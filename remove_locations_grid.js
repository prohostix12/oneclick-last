const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let updated = false;
      
      if (content.includes('ServiceLocations')) {
          content = content.replace(/import ServiceLocations.*\n?/g, '');
          content = content.replace(/<ServiceLocations \/>\n?/g, '');
          updated = true;
      }
      
      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Removed ServiceLocations from: ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services');
console.log('Cleanup complete!');
