import fs from 'fs';

// Fix duplicate businessResources entries
async function fixDuplicateResources() {
  console.log('Fixing duplicate businessResources entries...');
  
  const filePath = 'client/src/pages/annual-report-due-dates.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove duplicate businessResources entries by finding patterns where businessResources appears twice
  // Pattern: aiInsights: "...", businessResources: [...], businessResources: [...]
  const duplicatePattern = /(aiInsights: "[^"]*"),\s*businessResources: \[[^\]]*\],\s*(businessResources: \[[^\]]*\])/g;
  
  content = content.replace(duplicatePattern, '$1,\n    $2');
  
  // Also fix any cases where there might be extra commas or formatting issues
  content = content.replace(/,\s*,/g, ',');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed duplicate businessResources entries!');
}

fixDuplicateResources();