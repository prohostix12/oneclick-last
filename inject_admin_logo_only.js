const fs = require('fs');
const path = require('path');

function processAdmin(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'settings') {
      processAdmin(fullPath);
    } else if (entry.name.endsWith('.tsx') && entry.name === 'page.tsx') {
      let adminContent = fs.readFileSync(fullPath, 'utf8');
      
      // Delete old plain text logo if somehow present
      adminContent = adminContent.replace(/<h3 onClick[^>]*><span style={{ color: '#e61e25' }}>One<\/span>&nbsp;Click<\/h3>/g, '');

      // Check if new graphical logo is already there to prevent duplication
      if (adminContent.includes('span style={{ marginLeft: \'-1px\' }}>ne Click')) {
          continue;
      }

      const h1Regex = /(<div>|<div[^>]*>)\s*(<h1[^>]*>)/;
      const adminGraphicLogo = `\n<div onClick={() => window.location.href='/'} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0', fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', fontFamily: "'Bricolage Grotesque', sans-serif" }}><svg width="26" height="26" viewBox="0 0 28 28" style={{ marginRight: '-1px' }}><circle cx="14" cy="14" r="11" fill="none" stroke="#1a1a1a" strokeWidth="4"/><rect x="16" y="2" width="9" height="9" fill="#e61e25" rx="1"/></svg><span style={{ marginLeft: '-1px' }}>ne Click</span></div><div style={{ color: '#888', fontWeight: '900', letterSpacing: '4px', fontSize: '0.65rem' }}>ADVERTISEMENT</div></div>\n`;

      if (h1Regex.test(adminContent)) {
          let replaced = adminContent.replace(h1Regex, `$1${adminGraphicLogo}$2`);
          fs.writeFileSync(fullPath, replaced);
          console.log(`Admin graphical logo added: ${fullPath}`);
      }
    }
  }
}

processAdmin('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\');
console.log('Script finish');
