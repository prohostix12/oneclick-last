const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'settings') {
      processDir(fullPath);
    } else if (entry.name.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;

      // Ensure we don't duplicate logo
      if (content.includes('>One</span> Click</h3>') && content.includes("onClick={() => window.location.href='/'}")) {
          continue;
      }

      // Find the Header wrapping block: `<div>\n<h1` or `<div ...>\n<h1`
      const h1Regex = /(<div>|<div[^>]*>)\s*(<h1[^>]*>)/;
      
      const logoHtml = `\n<h3 onClick={() => window.location.href='/'} style={{ cursor: 'pointer', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: '#1a1a1a', display: 'flex', alignItems: 'center' }}><span style={{ color: '#e61e25' }}>One</span>&nbsp;Click</h3>\n`;

      if (h1Regex.test(content)) {
          content = content.replace(h1Regex, `$1${logoHtml}$2`);
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Injected One Click logo into: ${fullPath}`);
      }
    }
  }
}

// Process admin folder
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\');
console.log('Admin logo injection complete!');
