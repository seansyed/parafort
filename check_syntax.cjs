const fs = require('fs');
const content = fs.readFileSync('server/routes.ts', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);
console.log('Line 17397 content:', JSON.stringify(lines[17396]));
console.log('Line 17397 length:', lines[17396].length);

// Check if there's content after the last closing brace
const lastBraceIndex = content.lastIndexOf('}');
const afterBrace = content.substring(lastBraceIndex + 1);
console.log('Content after last brace:', JSON.stringify(afterBrace));
console.log('Content after last brace length:', afterBrace.length);

// Check the last few characters
console.log('Last 10 characters:', JSON.stringify(content.slice(-10)));