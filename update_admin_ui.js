const fs = require('fs');
const path = require('path');

// 1. Update AdminSidebar.tsx
const sidebarPath = 'c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin\\components\\AdminSidebar.tsx';
if (fs.existsSync(sidebarPath)) {
    let content = fs.readFileSync(sidebarPath, 'utf8');
    
    // Replace OC icon and text with the logo style
    const oldLogoBlock = /<div style={{ marginBottom: '3\.5rem', padding: '0 0\.5rem' }}>[\s\S]*?<\/div>\s*<\/Link>\s*<\/div>/;
    
    // Actually simpler to match the specific content from my previous view_file
    const startTag = '<div style={{ marginBottom: \'3.5rem\', padding: \'0 0.5rem\' }}>';
    const endTag = '</div>'; // This might be tricky if not careful
    
    // Let's use a more specific target
    const target = `<div style={{ marginBottom: '3.5rem', padding: '0 0.5rem' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #222 0%, #e61e25 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        boxShadow: '0 8px 15px rgba(230, 30, 37, 0.3)'
                    }}>
                        OC
                    </div>
                    <div>
                        <div style={{ color: '#e61e25', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.1 }}>One Click</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#facc15', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '2px' }}>Admin Portal</div>
                    </div>
                </Link>
            </div>`;

    const newLogo = `<div style={{ marginBottom: '3.5rem', padding: '0 0.5rem' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                        <svg width="26" height="26" viewBox="0 0 28 28" style={{ marginRight: '-1px' }}>
                            <circle cx="14" cy="14" r="11" fill="none" stroke="white" strokeWidth="4"/>
                            <rect x="16" y="2" width="9" height="9" fill="#e61e25" rx="1"/>
                        </svg>
                        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginLeft: '-1px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>One Click</span>
                    </div>
                    <div style={{ color: '#888', fontWeight: '900', letterSpacing: '3px', fontSize: '0.6rem', marginTop: '1px' }}>ADVERTISEMENT</div>
                </Link>
            </div>`;

    if (content.includes('OC') && content.includes('Admin Portal')) {
        content = content.replace(target, newLogo);
        fs.writeFileSync(sidebarPath, content);
        console.log('AdminSidebar logo updated.');
    }
}

// 2. Update Admin Footers (Quick Links)
function updateAdminFooters(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateAdminFooters(fullPath);
        } else if (file === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Look for the specific ul of Quick Links
            const quickLinksUlRegex = /<ul style={{ display: 'flex', flexDirection: 'column', gap: '0\.6rem', color: 'rgba\(255,255,255,0\.6\)', fontSize: '0\.9rem', listStyle: 'none', padding: 0 }}>\s*<li><a href="\/".*?<\/li>\s*<li><a href="\/services".*?<\/li>\s*<li><a href="\/testimonials".*?<\/li>\s*<li><a href="\/contact".*?<\/li>\s*<\/ul>/g;

            const newUl = `<ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
                                    <li><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
                                    <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                                    <li><a href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a></li>
                                    <li><a href="/projects" style={{ color: 'inherit', textDecoration: 'none' }}>Projects</a></li>
                                    <li><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
                                </ul>`;

            if (quickLinksUlRegex.test(content)) {
                content = content.replace(quickLinksUlRegex, newUl);
                fs.writeFileSync(fullPath, content);
                console.log(`Updated footer links in: ${fullPath}`);
            } else {
                // Secondary fallback because of format differences
                const simpleRegex = /<li><a href="\/testimonials".*?<\/li>/;
                if (simpleRegex.test(content)) {
                     content = content.replace('<li><a href="/testimonials" style={{ color: \'inherit\', textDecoration: \'none\' }}>Testimonials</a></li>', '<li><a href="/about" style={{ color: \'inherit\', textDecoration: \'none\' }}>About</a></li>\n                                    <li><a href="/projects" style={{ color: \'inherit\', textDecoration: \'none\' }}>Projects</a></li>');
                     fs.writeFileSync(fullPath, content);
                     console.log(`Updated footer links (fallback) in: ${fullPath}`);
                }
            }
        }
    }
}

updateAdminFooters('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin');
console.log('Script execution complete.');
