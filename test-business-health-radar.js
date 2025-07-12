#!/usr/bin/env node

// Test script to verify Business Health Radar functionality works correctly
// This bypasses the Vite development server routing issues

const path = require('path');
const { execSync } = require('child_process');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://default:CHANGE_PASSWORD@localhost:5432/replit';

async function testBusinessHealthRadar() {
  console.log('🔍 Testing Business Health Radar functionality...\n');

  try {
    // Import the business health service directly
    const { businessHealthService } = await import('./server/businessHealthService.js');
    
    console.log('✅ Business Health Service imported successfully');

    // Test with CPASytes LLC (ID: 477)
    const businessId = '477';
    
    console.log(`\n📊 Testing insight generation for business ID: ${businessId}`);

    // Check if insights can be generated
    console.log('Checking rate limiting eligibility...');
    const eligibility = await businessHealthService.canGenerateInsights(businessId);
    
    console.log('Rate limiting result:', JSON.stringify(eligibility, null, 2));

    if (!eligibility.canGenerate) {
      console.log('❌ Rate limit exceeded. Next available:', eligibility.nextAvailable);
      console.log('⏰ Days remaining:', eligibility.daysRemaining);
      return;
    }

    console.log('✅ Rate limiting passed - proceeding with insight generation');

    // Generate insights
    console.log('\n🧠 Generating AI insights...');
    const insights = await businessHealthService.generateInsights(businessId);
    
    console.log('✅ Insights generated successfully!');
    console.log(`📈 Generated ${insights.length} insights`);
    
    insights.forEach((insight, index) => {
      console.log(`\nInsight ${index + 1}:`);
      console.log(`  Type: ${insight.insightType}`);
      console.log(`  Title: ${insight.title}`);
      console.log(`  Priority: ${insight.priority}`);
      console.log(`  Category: ${insight.category}`);
      console.log(`  Confidence: ${insight.confidenceScore}%`);
      console.log(`  Actionable: ${insight.isActionable ? 'Yes' : 'No'}`);
    });

    console.log('\n🎉 Business Health Radar test completed successfully!');
    console.log('\nThe functionality works correctly - the issue is only with Vite development server routing.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testBusinessHealthRadar().catch(console.error);