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

      // Remove `{/* Admin Footer */}` block and the footer tag entirely.
      const footerRegex = /\{\/\*\s*Admin\s*Footer\s*\*\/\}\s*<footer[\s\S]*?<\/footer>/gi;
      if (footerRegex.test(content)) {
          content = content.replace(footerRegex, '');
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Removed internal admin footer from: ${fullPath}`);
      }
    }
  }
}

// Process admin folder
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\');
console.log('Internal Admin Footers removed!');
