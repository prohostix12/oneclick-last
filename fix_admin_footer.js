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

      // Regex to find the <ul ...> list containing Dubai, +971, and hello@...
      // and replace it with an Edit button to a settings page.
      const contactUlRegex = /<ul[^>]*>[\s\S]*?Dubai,\s*UAE[\s\S]*?\+971[\s\S]*?hello@oneclickadv\.ae[\s\S]*?<\/ul>/g;

      if (contactUlRegex.test(content)) {
          const editButtonHtml = `<Link href="/admin/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s ease' }}>Edit Contact Details</Link>`;
          
          content = content.replace(contactUlRegex, editButtonHtml);
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Replaced hardcoded admin contact details with Edit button in: ${fullPath}`);
      }
    }
  }
}

// Process admin folder
processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\');
console.log('Script finished!');
