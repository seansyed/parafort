#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to find all tsx and ts files in a directory
function findFiles(dir, files = []) {
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      findFiles(fullPath, files);
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to fix login redirects in a file
function fixLoginRedirects(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains /api/login redirects
    if (content.includes('/api/login')) {
      console.log(`Fixing ${filePath}...`);
      
      // Replace all instances of /api/login with /login
      const fixedContent = content
        .replace(/window\.location\.href = "\/api\/login"/g, 'window.location.href = "/login"')
        .replace(/window\.location = "\/api\/login"/g, 'window.location = "/login"')
        .replace(/href="\/api\/login"/g, 'href="/login"')
        .replace(/href='\/api\/login'/g, "href='/login'");
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`✅ Fixed ${filePath}`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔍 Scanning for /api/login redirects...');

const files = findFiles('client/src');
let fixedCount = 0;

for (const file of files) {
  if (fixLoginRedirects(file)) {
    fixedCount++;
  }
}

console.log(`\n✨ Fixed ${fixedCount} files with /api/login redirects`);
console.log('All login redirects now point to /login instead of /api/login');