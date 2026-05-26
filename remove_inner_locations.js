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

      // Remove the `<motion.section className="locations-section"> ... </motion.section>` block
      if (content.includes('className="locations-section"')) {
          content = content.replace(/<motion\.section\s+className="locations-section"[\s\S]*?<\/motion\.section>/, '');
          updated = true;
      }
      
      // Also entirely remove `const locations = [ ... ];` block to keep code clean and prevent unused vars
      if (content.includes('const locations = [')) {
          content = content.replace(/const locations = \[\s*\{[\s\S]*?\];/g, '');
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Cleaned up locations section from: ${fullPath}`);
      }
    }
  }
}

// Start from the services root
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Cleanup script finished!');
