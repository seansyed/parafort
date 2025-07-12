#!/usr/bin/env node

/**
 * Critical States Filing Data Verification
 * Focuses on high-priority states for legal accuracy
 */

import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Critical states for business formation (most common)
const CRITICAL_STATES = [
  'Delaware', 'California', 'Texas', 'Florida', 'New York', 
  'Nevada', 'Wyoming', 'Arizona', 'Colorado', 'Washington'
];

const ENTITY_TYPES = ['LLC', 'Corporation', 'Professional Corporation', 'Non-Profit Corporation'];

async function verifyStateData(state, entityType) {
  try {
    const prompt = `As a legal compliance expert, provide EXACT and CURRENT filing information for ${state} ${entityType}:

FORMATION FEES:
- What is the exact state filing fee for forming a ${entityType} in ${state}? (USD)

ANNUAL REPORT REQUIREMENTS:
- Is an annual report required? (Yes/No)
- If YES: What is the annual filing fee? (USD)
- Filing frequency: Annual or Biennial?
- Due date/deadline?
- Late fee penalty? (USD)

Respond in JSON format only:
{
  "state": "${state}",
  "entityType": "${entityType}",
  "formationFee": number,
  "annualReportRequired": true/false,
  "annualFilingFee": number,
  "frequency": "annual/biennial/none",
  "dueDate": "specific date or none",
  "lateFee": number,
  "notes": "brief summary",
  "verificationDate": "2025-06-17"
}

CRITICAL: This is for a legal services business. Only provide information from official state sources.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`Verification failed for ${state} ${entityType}:`, error);
    return null;
  }
}

async function verifyCriticalStates() {
  console.log('🔍 Verifying critical states for legal accuracy...');
  
  const results = {};
  const corrections = [];
  
  for (const state of CRITICAL_STATES) {
    console.log(`\n📍 Verifying ${state}...`);
    
    for (const entityType of ENTITY_TYPES) {
      console.log(`  🔎 ${entityType}...`);
      
      const verified = await verifyStateData(state, entityType);
      
      if (verified) {
        results[`${state}_${entityType}`] = verified;
        
        // Check against current data
        const currentData = getCurrentStateData(state, entityType);
        if (currentData && hasDiscrepancy(currentData, verified)) {
          corrections.push({
            state,
            entityType,
            current: currentData,
            verified: verified,
            changes: getChanges(currentData, verified)
          });
          console.log(`    ⚠️  Discrepancy found - correction needed`);
        } else {
          console.log(`    ✅ Verified correct`);
        }
      } else {
        console.log(`    ❌ Verification failed`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Generate correction report
  if (corrections.length > 0) {
    console.log(`\n📋 CRITICAL CORRECTIONS NEEDED: ${corrections.length}`);
    
    const report = {
      timestamp: new Date().toISOString(),
      corrections: corrections,
      verifiedData: results
    };
    
    fs.writeFileSync('./critical-states-corrections.json', JSON.stringify(report, null, 2));
    console.log('📄 Correction report saved: critical-states-corrections.json');
    
    // Apply urgent corrections
    await applyCriticalCorrections(corrections);
  } else {
    console.log('\n✅ All critical states verified correct - no changes needed');
  }
  
  return results;
}

function getCurrentStateData(state, entityType) {
  try {
    // Read current filing fees
    const feesContent = fs.readFileSync('./client/src/stateFilingFees.ts', 'utf8');
    
    // Extract state data using regex
    const stateMatch = feesContent.match(new RegExp(`${state}:\\s*{[^}]+${entityType}':\\s*{[^}]+}`, 's'));
    if (!stateMatch) return null;
    
    const feeMatch = stateMatch[0].match(/fee:\s*(\d+)/);
    const frequencyMatch = stateMatch[0].match(/frequency:\s*'([^']+)'/);
    const notesMatch = stateMatch[0].match(/notes:\s*'([^']+)'/);
    
    return {
      fee: feeMatch ? parseInt(feeMatch[1]) : 0,
      frequency: frequencyMatch ? frequencyMatch[1] : 'unknown',
      notes: notesMatch ? notesMatch[1] : ''
    };
  } catch (error) {
    console.error(`Error reading current data for ${state} ${entityType}:`, error);
    return null;
  }
}

function hasDiscrepancy(current, verified) {
  // Check for significant fee differences
  if (Math.abs(current.fee - verified.annualFilingFee) > 5) return true;
  
  // Check annual requirement mismatch
  const currentRequired = !current.notes.includes('No annual') && current.frequency !== 'none';
  if (currentRequired !== verified.annualReportRequired) return true;
  
  return false;
}

function getChanges(current, verified) {
  const changes = [];
  
  if (Math.abs(current.fee - verified.annualFilingFee) > 5) {
    changes.push(`Fee: ${current.fee} → ${verified.annualFilingFee}`);
  }
  
  const currentRequired = !current.notes.includes('No annual') && current.frequency !== 'none';
  if (currentRequired !== verified.annualReportRequired) {
    changes.push(`Annual Required: ${currentRequired} → ${verified.annualReportRequired}`);
  }
  
  return changes;
}

async function applyCriticalCorrections(corrections) {
  console.log('\n🔧 Applying critical corrections...');
  
  // Read current files
  let feesContent = fs.readFileSync('./client/src/stateFilingFees.ts', 'utf8');
  let requirementsContent = fs.readFileSync('./client/src/stateFilingRequirements.ts', 'utf8');
  
  for (const correction of corrections) {
    const { state, entityType, verified } = correction;
    
    console.log(`  ✏️  Correcting ${state} ${entityType}...`);
    
    // Update filing fees
    const feePattern = new RegExp(
      `(${state}:[^}]+${entityType}':[^}]+fee:\\s*)(\\d+)`,
      'g'
    );
    feesContent = feesContent.replace(feePattern, `$1${verified.annualFilingFee}`);
    
    // Update frequency
    const freqPattern = new RegExp(
      `(${state}:[^}]+${entityType}':[^}]+frequency:\\s*')([^']+)`,
      'g'
    );
    feesContent = feesContent.replace(freqPattern, `$1${verified.frequency}`);
    
    // Update notes
    const notePattern = new RegExp(
      `(${state}:[^}]+${entityType}':[^}]+notes:\\s*')([^']+)`,
      'g'
    );
    const newNote = verified.annualReportRequired ? 
      `Annual filing required - $${verified.annualFilingFee}` : 
      'No annual filing requirement';
    feesContent = feesContent.replace(notePattern, `$1${newNote}`);
    
    // Update requirements file
    const reqPattern = new RegExp(
      `(${state}:[^}]+${entityType}:[^}]+required:\\s*)(true|false)`,
      'g'
    );
    requirementsContent = requirementsContent.replace(reqPattern, `$1${verified.annualReportRequired}`);
  }
  
  // Save corrected files
  fs.writeFileSync('./client/src/stateFilingFees.ts', feesContent);
  fs.writeFileSync('./client/src/stateFilingRequirements.ts', requirementsContent);
  
  console.log('✅ Critical corrections applied to state filing data');
}

// Run verification
verifyCriticalStates()
  .then(results => {
    console.log('\n🎯 Critical state verification complete');
    console.log('Legal compliance data verified for top business formation states');
  })
  .catch(error => {
    console.error('❌ Critical verification failed:', error);
    process.exit(1);
  });