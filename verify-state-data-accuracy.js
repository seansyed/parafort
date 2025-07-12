#!/usr/bin/env node

/**
 * Comprehensive State Filing Data Verification System
 * Verifies ALL 50 states' filing fees and requirements for accuracy
 * Uses OpenAI GPT-4o and Google Gemini for cross-validation
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize AI services
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Entity types to verify
const ENTITY_TYPES = ['LLC', 'Corporation', 'Professional Corporation', 'Non-Profit Corporation'];

// US States
const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

/**
 * Get current state data from files
 */
function getCurrentStateData() {
  try {
    // Read filing fees
    const feesContent = fs.readFileSync('./client/src/stateFilingFees.ts', 'utf8');
    const requirementsContent = fs.readFileSync('./client/src/stateFilingRequirements.ts', 'utf8');
    
    return {
      fees: feesContent,
      requirements: requirementsContent
    };
  } catch (error) {
    console.error('Error reading current state data:', error);
    return null;
  }
}

/**
 * Verify state data with OpenAI
 */
async function verifyWithOpenAI(state, entityType) {
  try {
    const prompt = `As a legal compliance expert, provide EXACT and CURRENT information for ${state} ${entityType}:

1. Formation/Filing Fee: What is the exact state government filing fee for forming a ${entityType} in ${state}? (in USD)
2. Annual Report Requirement: Is an annual report required? (Yes/No)
3. If YES to annual reports:
   - Annual filing fee (in USD)
   - Filing frequency (annual/biennial)
   - Due date/deadline
   - Late fee penalty

Respond in JSON format:
{
  "state": "${state}",
  "entityType": "${entityType}",
  "formationFee": number,
  "annualReportRequired": boolean,
  "annualFilingFee": number or 0,
  "frequency": "annual/biennial/none",
  "dueDate": "specific date or none",
  "lateFee": number or 0,
  "notes": "brief compliance notes",
  "source": "official state source or regulation",
  "lastUpdated": "2025"
}

IMPORTANT: Only provide information from official state sources. Be extremely accurate as this is for a legal services business.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1 // Low temperature for factual accuracy
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`OpenAI verification failed for ${state} ${entityType}:`, error);
    return null;
  }
}

/**
 * Verify state data with Google Gemini
 */
async function verifyWithGemini(state, entityType) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `As a legal compliance expert, verify the following for ${state} ${entityType} business formation:

1. What is the exact state filing fee for forming a ${entityType} in ${state}?
2. Are annual reports required for ${entityType} in ${state}? 
3. If annual reports are required, what is the fee and frequency?
4. What are the specific due dates and penalties?

Provide response in JSON format with exact fees, requirements, and official sources.
Focus on accuracy - this is for a legal services business requiring precise compliance information.

{
  "state": "${state}",
  "entityType": "${entityType}",
  "formationFee": "exact USD amount",
  "annualReportRequired": true/false,
  "annualFilingDetails": {
    "fee": "USD amount or 0",
    "frequency": "annual/biennial/none",
    "dueDate": "specific date",
    "penalty": "late fee amount"
  },
  "officialSource": "state website or regulation",
  "verificationDate": "2025-06-17"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error(`Gemini verification failed for ${state} ${entityType}:`, error);
    return null;
  }
}

/**
 * Cross-validate results from both AI services
 */
function crossValidateResults(openaiResult, geminiResult) {
  if (!openaiResult || !geminiResult) {
    return { status: 'incomplete', issues: ['Missing AI verification data'] };
  }

  const issues = [];
  
  // Compare formation fees
  const openaiFormationFee = parseInt(openaiResult.formationFee);
  const geminiFormationFee = parseInt(geminiResult.formationFee);
  
  if (Math.abs(openaiFormationFee - geminiFormationFee) > 5) {
    issues.push(`Formation fee mismatch: OpenAI=${openaiFormationFee}, Gemini=${geminiFormationFee}`);
  }
  
  // Compare annual report requirements
  if (openaiResult.annualReportRequired !== geminiResult.annualReportRequired) {
    issues.push(`Annual report requirement mismatch: OpenAI=${openaiResult.annualReportRequired}, Gemini=${geminiResult.annualReportRequired}`);
  }
  
  // Compare annual filing fees if both say required
  if (openaiResult.annualReportRequired && geminiResult.annualReportRequired) {
    const openaiAnnualFee = parseInt(openaiResult.annualFilingFee);
    const geminiAnnualFee = parseInt(geminiResult.annualFilingDetails?.fee || 0);
    
    if (Math.abs(openaiAnnualFee - geminiAnnualFee) > 5) {
      issues.push(`Annual filing fee mismatch: OpenAI=${openaiAnnualFee}, Gemini=${geminiAnnualFee}`);
    }
  }

  return {
    status: issues.length === 0 ? 'validated' : 'discrepancy',
    issues: issues,
    consensusData: {
      state: openaiResult.state,
      entityType: openaiResult.entityType,
      formationFee: Math.round((openaiFormationFee + geminiFormationFee) / 2),
      annualReportRequired: openaiResult.annualReportRequired && geminiResult.annualReportRequired,
      annualFilingFee: openaiResult.annualReportRequired ? 
        Math.round(((parseInt(openaiResult.annualFilingFee) || 0) + (parseInt(geminiResult.annualFilingDetails?.fee) || 0)) / 2) : 0,
      frequency: openaiResult.frequency,
      dueDate: openaiResult.dueDate,
      lateFee: openaiResult.lateFee || 0,
      sources: [openaiResult.source, geminiResult.officialSource].filter(Boolean)
    }
  };
}

/**
 * Generate corrected state filing fees file
 */
function generateCorrectedFilingFees(verificationResults) {
  let output = `// AUTO-GENERATED: Verified State Filing Fees - ${new Date().toISOString()}\n`;
  output += `// Verified using OpenAI GPT-4o and Google Gemini AI services\n`;
  output += `// Cross-validated for legal services accuracy\n\n`;
  
  output += `export interface StateFilingFee {\n`;
  output += `  fee: number;\n`;
  output += `  frequency: string;\n`;
  output += `  dueDate: string;\n`;
  output += `  lateFee: number;\n`;
  output += `  notes: string;\n`;
  output += `}\n\n`;
  
  output += `export interface StateFilingData {\n`;
  output += `  state: string;\n`;
  output += `  LLC: StateFilingFee;\n`;
  output += `  Corporation: StateFilingFee;\n`;
  output += `  'Professional Corporation': StateFilingFee;\n`;
  output += `  'Non-Profit Corporation': StateFilingFee;\n`;
  output += `}\n\n`;
  
  output += `export const stateFilingFees: Record<string, StateFilingData> = {\n`;
  
  for (const state of STATES) {
    output += `  ${state}: {\n`;
    output += `    state: '${state}',\n`;
    
    for (const entityType of ENTITY_TYPES) {
      const key = `${state}_${entityType}`;
      const verification = verificationResults[key];
      
      if (verification && verification.status === 'validated') {
        const data = verification.consensusData;
        output += `    '${entityType}': {\n`;
        output += `      fee: ${data.formationFee || 0},\n`;
        output += `      frequency: '${data.frequency || 'none'}',\n`;
        output += `      dueDate: '${data.dueDate || 'No filing required'}',\n`;
        output += `      lateFee: ${data.lateFee || 0},\n`;
        output += `      notes: '${data.annualReportRequired ? `Annual filing required - $${data.annualFilingFee}` : 'No annual filing requirement'}'\n`;
        output += `    },\n`;
      } else {
        // Keep existing data if verification failed
        output += `    '${entityType}': {\n`;
        output += `      fee: 0, // VERIFICATION FAILED - NEEDS MANUAL REVIEW\n`;
        output += `      frequency: 'unknown',\n`;
        output += `      dueDate: 'Manual verification required',\n`;
        output += `      lateFee: 0,\n`;
        output += `      notes: 'AI verification incomplete - requires manual research'\n`;
        output += `    },\n`;
      }
    }
    
    output += `  },\n`;
  }
  
  output += `};\n`;
  
  return output;
}

/**
 * Main verification process
 */
async function verifyAllStateData() {
  console.log('🔍 Starting comprehensive state data verification...');
  console.log(`📊 Verifying ${STATES.length} states × ${ENTITY_TYPES.length} entity types = ${STATES.length * ENTITY_TYPES.length} combinations`);
  
  const verificationResults = {};
  const issues = [];
  let completed = 0;
  const total = STATES.length * ENTITY_TYPES.length;
  
  // Process each state and entity type combination
  for (const state of STATES) {
    console.log(`\n📍 Verifying ${state}...`);
    
    for (const entityType of ENTITY_TYPES) {
      const key = `${state}_${entityType}`;
      
      try {
        console.log(`  🔎 ${entityType}...`);
        
        // Get verification from both AI services
        const [openaiResult, geminiResult] = await Promise.all([
          verifyWithOpenAI(state, entityType),
          verifyWithGemini(state, entityType)
        ]);
        
        // Cross-validate results
        const validation = crossValidateResults(openaiResult, geminiResult);
        verificationResults[key] = validation;
        
        if (validation.status === 'discrepancy') {
          issues.push({
            state,
            entityType,
            issues: validation.issues
          });
          console.log(`    ⚠️  Discrepancy detected: ${validation.issues.join(', ')}`);
        } else if (validation.status === 'validated') {
          console.log(`    ✅ Verified`);
        } else {
          console.log(`    ❌ Incomplete verification`);
        }
        
        completed++;
        console.log(`    Progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`  ❌ Error verifying ${state} ${entityType}:`, error);
        verificationResults[key] = { status: 'error', error: error.message };
      }
    }
  }
  
  // Generate verification report
  console.log('\n📋 VERIFICATION COMPLETE');
  console.log(`✅ Validated: ${Object.values(verificationResults).filter(r => r.status === 'validated').length}`);
  console.log(`⚠️  Discrepancies: ${Object.values(verificationResults).filter(r => r.status === 'discrepancy').length}`);
  console.log(`❌ Errors: ${Object.values(verificationResults).filter(r => r.status === 'error').length}`);
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: total,
      validated: Object.values(verificationResults).filter(r => r.status === 'validated').length,
      discrepancies: Object.values(verificationResults).filter(r => r.status === 'discrepancy').length,
      errors: Object.values(verificationResults).filter(r => r.status === 'error').length
    },
    issues: issues,
    verificationResults: verificationResults
  };
  
  fs.writeFileSync('./state-verification-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: state-verification-report.json');
  
  // Generate corrected files if enough data is validated
  const validationRate = report.summary.validated / total;
  if (validationRate > 0.8) {
    console.log('\n🔧 Generating corrected state filing fees...');
    const correctedFees = generateCorrectedFilingFees(verificationResults);
    fs.writeFileSync('./client/src/stateFilingFees-verified.ts', correctedFees);
    console.log('✅ Corrected filing fees saved to: client/src/stateFilingFees-verified.ts');
  } else {
    console.log(`\n⚠️  Validation rate too low (${Math.round(validationRate*100)}%) - manual review required`);
  }
  
  return report;
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAllStateData()
    .then(report => {
      console.log('\n🎯 STATE DATA VERIFICATION COMPLETE');
      console.log('Review the generated report for any discrepancies that need manual research.');
      if (report.summary.discrepancies > 0) {
        console.log('\n⚠️  CRITICAL: Found discrepancies that require legal review');
        console.log('Manual verification recommended for legal services compliance');
      }
    })
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

export { verifyAllStateData };