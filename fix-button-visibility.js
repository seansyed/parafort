#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix button text visibility issues
function fixButtonVisibility(content) {
  // Pattern 1: variant="outline" with text-white that needs bg-transparent
  content = content.replace(
    /(<Button[^>]*variant="outline"[^>]*className="[^"]*text-white[^"]*)"([^>]*>)/g,
    (match, beforeClass, afterClass) => {
      // Check if bg-transparent is already present
      if (beforeClass.includes('bg-transparent')) {
        return match;
      }
      // Add bg-transparent and ensure border-2
      let newClass = beforeClass.replace('className="', 'className="bg-transparent ');
      if (!newClass.includes('border-2')) {
        newClass = newClass.replace('border-white', 'border-2 border-white');
      }
      return newClass + '"' + afterClass;
    }
  );

  // Pattern 2: Wrap button text in span for better visibility
  content = content.replace(
    /(<Button[^>]*variant="outline"[^>]*text-white[^>]*>)([^<]+)(<\/Button>)/g,
    (match, openTag, text, closeTag) => {
      // Skip if already has span wrapper
      if (text.includes('<span')) {
        return match;
      }
      // Wrap text in span with explicit white text styling
      const wrappedText = `<span className="text-white font-semibold">${text.trim()}</span>`;
      return openTag + wrappedText + closeTag;
    }
  );

  // Pattern 3: Fix buttons with icons and text
  content = content.replace(
    /(<Button[^>]*variant="outline"[^>]*text-white[^>]*>\s*)(<[^>]*className="[^"]*"[^>]*\/>)\s*([^<]+)(\s*<\/Button>)/g,
    (match, openTag, icon, text, closeTag) => {
      // Skip if already has span wrapper
      if (text.includes('<span')) {
        return match;
      }
      // Wrap text in span with explicit white text styling
      const wrappedText = `<span className="text-white font-semibold">${text.trim()}</span>`;
      return openTag + icon + '\n              ' + wrappedText + closeTag;
    }
  );

  return content;
}

// Function to process all TSX files
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has outline buttons with text-white
    if (content.includes('variant="outline"') && content.includes('text-white')) {
      const fixedContent = fixButtonVisibility(content);
      
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

// Get all TSX files in pages directory
function getAllTsxFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllTsxFiles(fullPath));
    } else if (entry.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const tsxFiles = getAllTsxFiles(pagesDir);

let fixedCount = 0;
console.log(`Processing ${tsxFiles.length} TSX files...`);

for (const file of tsxFiles) {
  if (processFile(file)) {
    fixedCount++;
  }
}

console.log(`\nFixed button visibility issues in ${fixedCount} files.`);