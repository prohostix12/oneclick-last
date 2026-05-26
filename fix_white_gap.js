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

      // Make cta-section full-width and remove bottom margin/border-radius
      if (content.includes('.cta-section {') || content.includes('.contact-section {')) {
          content = content.replace(/\.cta-section\s*\{[\s\S]*?\}/g, `.cta-section {
          background: #1a1a1a;
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }`);

          content = content.replace(/\.contact-section\s*\{[\s\S]*?\}/g, `.contact-section {
          background: #1a1a1a;
          padding: 4rem 2rem;
          text-align: center;
          color: white;
        }`);

          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Fixed white gap trailing CTA in: ${fullPath}`);
      }
    }
  }
}

// Start from the services root
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Gap fix script finished!');
