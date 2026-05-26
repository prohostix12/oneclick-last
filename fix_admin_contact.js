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

      // Ensure Link is imported if not already there
      if (!content.includes('import Link from') && !content.includes('import Link  from') && !content.includes("import Link from 'next/link'")) {
          content = `import Link from 'next/link';\n` + content;
      }

      // 1. Remove navbar contact info carefully
      if (content.includes('className="admin-contact-info"')) {
          const editNavBtn = `className="admin-contact-info" style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}><Link href="/admin/settings" style={{ background: 'rgba(230, 30, 37, 0.1)', color: '#e61e25', border: '1px solid #e61e25', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.3s ease' }}>Edit Contact Details</Link></motion.div>`;
          content = content.replace(/className="admin-contact-info"[\s\S]*?hello@oneclickadv\.ae[\s\S]*?<\/motion\.div>/, editNavBtn);
          updated = true;
      }

      // 2. Remove footer contact list specifically starting from ul style={{ display: 'flex', flexDirection: 'column'...
      // Note: we can match <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'rgba(255,255,255,0.6)'... down to </ul>
      const footerUlRegex = /<ul[^>]*flexDirection[^>]*column[^>]*>[\s\S]*?Dubai,\s*UAE[\s\S]*?\+971[\s\S]*?hello@oneclickadv\.ae[\s\S]*?<\/ul>/g;
      if (footerUlRegex.test(content)) {
          const editBtn = `<Link href="/admin/settings" style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', background: '#e61e25', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Edit Contact Details</Link>`;
          content = content.replace(footerUlRegex, editBtn);
          updated = true;
      }

      if (updated) {
          fs.writeFileSync(fullPath, content);
          console.log(`Updated admin contact details properly in: ${fullPath}`);
      }
    }
  }
}

processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\');
console.log('Admin contact details updated!');
