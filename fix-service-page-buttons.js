import fs from 'fs';
import path from 'path';

// Service pages that need button fixes in pricing sections
const servicePages = [
  'client/src/pages/business-dissolution-service.tsx',
  'client/src/pages/legal-documents-service.tsx',
  'client/src/pages/accounting-bookkeeping-services.tsx',
  'client/src/pages/business-formation-service.tsx',
  'client/src/pages/business-license-services.tsx',
  'client/src/pages/business-tax-filing-services.tsx',
  'client/src/pages/tax-filing-services.tsx',
  'client/src/pages/bookkeeping-services.tsx',
  'client/src/pages/payroll-services.tsx',
  'client/src/pages/digital-mailbox-services.tsx',
  'client/src/pages/registered-agent-services.tsx',
  'client/src/pages/fictitious-business-services.tsx'
];

// Button replacement function
function fixButtonVisibility(content) {
  // Pattern for Button components with green background in pricing sections
  const buttonPattern = /<Button[\s\S]*?className="[^"]*bg-green[^"]*"[\s\S]*?>([\s\S]*?)<\/Button>/g;
  
  let fixedContent = content.replace(buttonPattern, (match, buttonText) => {
    // Extract onClick handler
    const onClickMatch = match.match(/onClick=\{([^}]+)\}/);
    const onClick = onClickMatch ? onClickMatch[1] : 'handleGetStarted';
    
    // Clean button text
    const cleanText = buttonText.trim().replace(/\s+/g, ' ');
    
    return `<button
                onClick={${onClick}}
                style={{
                  backgroundColor: '#34de73',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 48px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2bc866';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#34de73';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ${cleanText}
              </button>`;
  });

  return fixedContent;
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath} - file not found`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has green buttons that need fixing
    if (content.includes('bg-green') && content.includes('<Button')) {
      const fixedContent = fixButtonVisibility(content);
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`Fixed button visibility in: ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
let fixedCount = 0;
console.log('Fixing button visibility across all service pages...');

for (const file of servicePages) {
  if (processFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed button visibility in ${fixedCount} service pages.`);