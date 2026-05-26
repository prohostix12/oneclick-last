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
      
      const hasFooter = content.includes('{/* Footer */}');
      
      if (hasFooter || content.includes('className="billboard-page"')) {
          console.log(`Processing: ${fullPath}`);
          
          // Remove the Footer block entirely
          content = content.replace(/\{\/\* Footer \*\/\}\s*<footer[\s\S]*?<\/footer>/, '');
          
          // Add the import if not present
          if (!content.includes('ServiceMap')) {
              let relativePath = '@/app/components/ServiceMap';
              content = content.replace(/import Link from 'next\/link';/, `import Link from 'next/link';\nimport ServiceMap from '${relativePath}';`);
          }
          
          // Fix motion variants
          content = content.replace(/transition: \{ duration: 0.6 \}/g, 'transition: { duration: 0.6 } as any');
          content = content.replace(/transition: \{ staggerChildren: 0.15, delayChildren: 0.2 \}/g, 'transition: { staggerChildren: 0.15, delayChildren: 0.2 } as any');

          // Inject <ServiceMap /> before the final closing div layout or contact section
          if (!content.includes('<ServiceMap />')) {
                // Look for the gap marker
                if (content.includes('{/* Service Locations */}')) {
                    content = content.replace(/\{\/\* Service Locations \*\/\}\s*/, '{/* Service Locations */}\n        <ServiceMap />\n');
                } else {
                    content = content.replace(/(<\/div>\s*<\/>\s*\);\s*\})$/, '  <ServiceMap />\n      $1');
                }
          }
          
          fs.writeFileSync(fullPath, content);
          console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

// Start from the services root
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\');
console.log('Refactoring complete!');
