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

      // Add the import if not present
      if (!content.includes('LocationText')) {
          const depth = fullPath.split('src\\app\\services\\')[1].split('\\').length;
          const relativePath = depth === 1 ? '../components/LocationText' : '../../components/LocationText';
          
          if (content.includes("import Link from 'next/link';")) {
              content = content.replace(/import Link from 'next\/link';/, `import Link from 'next/link';\nimport LocationText from '${relativePath}';`);
          } else {
              content = `import LocationText from '${relativePath}';\n` + content;
          }
      }
      
      // Inject <LocationText /> dynamically before the CTA Section or the final closing div/fragment
      if (!content.includes('<LocationText />')) {
        // If it's a detail page and it has the CTA Section
        if (content.includes('{/* CTA Section */}')) {
            content = content.replace(/\{\/\* CTA Section \*\/\}/, '<LocationText />\n        {/* CTA Section */}');
            updated = true;
        } 
        // fallback to closing div if it somehow misses the CTA string but has the standard layout close
        else if (content.match(/(<\/div>\s*<\/>\s*\);\s*\})$/)) {
            content = content.replace(/(<\/div>\s*<\/>\s*\);\s*\})$/, '  <LocationText />\n      $1');
            updated = true;
        }
      }
      
      if (updated || content.includes('LocationText')) {
          fs.writeFileSync(fullPath, content);
          console.log(`Injected LocationText into: ${fullPath}`);
      }
    }
  }
}

// Start from the services root
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Injection complete!');
