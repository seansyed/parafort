#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixGreenButtons(content) {
  // Pattern to match green buttons that don't have text-white
  const greenButtonPattern = /<Button([^>]*bg-green[^>]*?)>/g;
  
  let matches = [...content.matchAll(greenButtonPattern)];
  let updatedContent = content;
  
  matches.forEach(match => {
    const fullMatch = match[0];
    const attributes = match[1];
    
    // Skip if already has text-white
    if (attributes.includes('text-white')) {
      return;
    }
    
    // Add text-white and font-semibold to className
    const updatedMatch = fullMatch.replace(
      /className="([^"]*?)"/,
      (classMatch, existingClasses) => {
        return `className="${existingClasses} text-white font-semibold"`;
      }
    );
    
    updatedContent = updatedContent.replace(fullMatch, updatedMatch);
  });
  
  return updatedContent;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('bg-green')) {
      const fixedContent = fixGreenButtons(content);
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed: ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all pages with green buttons
const keyPages = [
  'client/src/pages/services-marketplace.tsx',
  'client/src/pages/bookkeeping.tsx', 
  'client/src/pages/payroll-services.tsx',
  'client/src/pages/business-formation-service.tsx',
  'client/src/pages/registered-agent-services.tsx',
  'client/src/pages/annual-report-service.tsx',
  'client/src/pages/ein-service.tsx',
  'client/src/pages/digital-mailbox-services.tsx',
  'client/src/pages/legal-documents-service.tsx',
  'client/src/pages/dashboard.tsx',
  'client/src/pages/multi-business-dashboard.tsx',
  'client/src/pages/business-license-services.tsx',
  'client/src/pages/business-payroll-services.tsx',
  'client/src/pages/business-tax-filing-services.tsx',
  'client/src/pages/subscription-plans.tsx',
  'client/src/pages/checkout.tsx',
  'client/src/pages/admin-dashboard.tsx',
  'client/src/pages/business-health-radar.tsx',
  'client/src/pages/client-dashboard.tsx',
  'client/src/pages/settings.tsx',
  'client/src/pages/bookkeeping-services.tsx',
  'client/src/pages/enhanced-payroll-services.tsx',
  'client/src/pages/document-center.tsx',
  'client/src/pages/accounting-bookkeeping-services.tsx',
  'client/src/pages/business-formation-service.tsx',
  'client/src/pages/registered-agent-services.tsx',
  'client/src/pages/annual-report-service.tsx',
  'client/src/pages/ein-service.tsx',
  'client/src/pages/digital-mailbox-services.tsx',
  'client/src/pages/s-corporation-election-service.tsx',
  'client/src/pages/business-dissolution-service.tsx',
  'client/src/pages/business-legal-name-change.tsx',
  'client/src/pages/admin-dashboard.tsx',
  'client/src/pages/dashboard.tsx',
  'client/src/pages/business-health-radar.tsx',
  'client/src/pages/enhanced-dashboard.tsx',
  'client/src/pages/enhanced-services-dashboard.tsx'
];

let fixedCount = 0;
console.log('Fixing green button text visibility...');

for (const file of keyPages) {
  if (fs.existsSync(file) && processFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed button visibility in ${fixedCount} key pages.`);