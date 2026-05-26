const fs = require('fs');
const path = require('path');

// 1. Fix src/app/services/page.tsx background image clarity
let servicesPagePath = 'c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\services\\page.tsx';
let content = fs.readFileSync(servicesPagePath, 'utf8');

// Update image for a better one
content = content.replace('https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&q=80', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1600&q=80');

// Reduce darkness
content = content.replace(/filter:\s*brightness\(0\.4\);/g, 'filter: brightness(0.7);');
content = content.replace(/background:\s*rgba\(0,0,0,0\.5\);/g, 'background: rgba(0,0,0,0.4);');

fs.writeFileSync(servicesPagePath, content);
console.log('Services page background updated.');


// 2. Add graphic logo to the Home Page Footer (Footer.tsx)
let footerPath = 'c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\components\\Footer.tsx';
let footerContent = fs.readFileSync(footerPath, 'utf8');

const footerBottomRegex = /<div style={{ borderTop: '1px solid rgba\(255,255,255,0\.08\)', paddingTop: '40px', textAlign: 'center', color: '#666', fontSize: '0\.9rem', fontWeight: 500 }}>[\s\S]*?<\/div>/;
const graphicFooterLogo = `<div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', textAlign: 'center', color: '#666', fontSize: '0.9rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', fontSize: '1.6rem', fontWeight: 800, color: 'white', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" style={{ marginRight: '-1px' }}>
                <circle cx="14" cy="14" r="11" fill="none" stroke="white" strokeWidth="4"/>
                <rect x="16" y="2" width="9" height="9" fill="#e61e25" rx="1"/>
              </svg>
              <span style={{ marginLeft: '-1px' }}>ne Click</span>
            </div>
            <div style={{ color: '#888', fontWeight: '900', letterSpacing: '4px', fontSize: '0.65rem', marginTop: '4px' }}>ADVERTISEMENT</div>
          </Link>
          &copy; {currentYear || new Date().getFullYear()} One Click Advertisement. All rights reserved.
        </div>`;

if (footerBottomRegex.test(footerContent)) {
    footerContent = footerContent.replace(footerBottomRegex, graphicFooterLogo);
    fs.writeFileSync(footerPath, footerContent);
    console.log('Footer Logo added.');
}

// 3. Inject Graphic Logo to Admin Dashboard Navbar (re-run logic with graphic logo)
function processAdmin(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'settings') {
      processAdmin(fullPath);
    } else if (entry.name.endsWith('.tsx')) {
      let adminContent = fs.readFileSync(fullPath, 'utf8');
      
      // Delete old text logo if it exists
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
