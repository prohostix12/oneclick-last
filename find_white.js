const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('#ffffff') || lines[i].includes('white')) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}
