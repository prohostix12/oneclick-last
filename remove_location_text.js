const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = false;

      if (content.includes('LocationText')) {
          // Remove imports
          content = content.replace(/import\s+LocationText\s+from\s+['"].*?LocationText['"];\n?/g, '');
          
          // Remove the component tag
          content = content.replace(/\s*<LocationText \/>\n?/g, '\n');
          
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Removed LocationText from: ${fullPath}`);
      }
    }
  }
}

// Start from the services root
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Removal script finished!');
