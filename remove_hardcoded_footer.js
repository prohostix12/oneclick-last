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

      // Regex to remove `{/* Footer */}` up to `</footer>`
      const footerRegex = /\{\/\*\s*Footer\s*\*\/\}\s*<footer[^>]*>[\s\S]*?<\/footer>/gi;
      
      if (footerRegex.test(content)) {
          content = content.replace(footerRegex, '');
          updated = true;
      }
      
      // Some footers might not have the `{/* Footer */}` comment, check for `<footer ...>` directly
      // Caution: only remove if it's clearly the duplicated specific footer
      if (!updated && content.includes('Premium advertising solutions across the UAE.')) {
          const directFooterRegex = /<footer[^>]*>[\s\S]*?<\/footer>/gi;
          if (directFooterRegex.test(content)) {
             content = content.replace(directFooterRegex, '');
             updated = true;
          }
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Removed duplicate footer from: ${fullPath}`);
      }
    }
  }
}

// Process services and testimonials
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\testimonials\\');

console.log('Duplicate footers fully removed!');
