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

      // Ensure full width flush with footer
      if (content.includes('margin: 0 auto 4rem auto;') || content.includes('margin-bottom: 4rem;') || content.includes('margin: 0 auto 3rem auto;')) {
          content = content.replace(/margin:\s*0\s*auto\s*4rem\s*auto;/g, 'margin: 0 auto;');
          content = content.replace(/margin:\s*0\s*auto\s*3rem\s*auto;/g, 'margin: 0 auto;');
          content = content.replace(/margin-bottom:\s*4rem;/g, 'margin-bottom: 0;');
          content = content.replace(/margin-bottom:\s*3rem;/g, 'margin-bottom: 0;');
          updated = true;
      }

      // Remove border radius to make it perfectly squared off at bottom
      if (content.includes('border-radius: 20px;') && content.includes('.cta-section {') && fullPath.includes('[slug]') === false && fullPath.includes('services\\\\page.tsx') === false) {
          content = content.replace(/border-radius:\s*20px;/g, 'border-radius: 0;');
          updated = true;
      }
      
      // Make standard width 100%
      if (content.includes('max-width: 800px;') && content.includes('.cta-section {') && fullPath.includes('services\\\\page.tsx') === false) {
          content = content.replace(/max-width:\s*800px;/g, 'max-width: 100%;');
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Safely fixed white gap trailing CTA in: ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Safe Gap fix script finished!');
