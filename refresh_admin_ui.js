const fs = require('fs');
const path = require('path');

const adminGraphicLogoSidebar = `
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                        <svg width="26" height="26" viewBox="0 0 28 28" style={{ marginRight: '-1px' }}>
                            <circle cx="14" cy="14" r="11" fill="none" stroke="white" strokeWidth="4"/>
                            <rect x="16" y="2" width="9" height="9" fill="#e61e25" rx="1"/>
                        </svg>
                        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginLeft: '-1px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>ne Click</span>
                    </div>
                    <div style={{ color: '#888', fontWeight: '900', letterSpacing: '3px', fontSize: '0.6rem', marginTop: '1px' }}>ADVERTISEMENT</div>
                </Link>`;

const newQuickLinks = `<li><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
                                    <li><a href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                                    <li><a href="/services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a></li>
                                    <li><a href="/projects" style={{ color: 'inherit', textDecoration: 'none' }}>Projects</a></li>
                                    <li><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>`;

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDir(fullPath);
        } else if (entry.name.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // Update individual inline sidebars if they exist (like in testimonials/page.tsx)
            // Looking for the OC / One Click / Admin Portal pattern
            if (content.includes('OC') && content.includes('Admin Portal') && content.includes('<aside')) {
                // More targeted replacement for the sidebar logo block
                const sidebarLogoBlockRegex = /<Link href="\/".*?>[\s\S]*?<div.*?>\s*OC\s*<\/div>[\s\S]*?One\s*Click[\s\S]*?Admin\s*Portal[\s\S]*?<\/Link>/g;
                if (sidebarLogoBlockRegex.test(content)) {
                    content = content.replace(sidebarLogoBlockRegex, adminGraphicLogoSidebar);
                    updated = true;
                }
            }

            // Update Quick Links in footer
            // Find the <ul> containing Testimonials and update it
            const quickLinksUlHeader = /<h4[^>]*>Quick Links<\/h4>\s*<ul[^>]*>/g;
            if (content.includes('Quick Links')) {
                // If it has Testimonials, swap it out
                if (content.includes('Testimonials') && content.includes('Quick Links')) {
                    const ulMatch = content.match(/<h4[^>]*>Quick Links<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/);
                    if (ulMatch) {
                        const oldUlContent = ulMatch[1];
                        if (oldUlContent.includes('Testimonials')) {
                            content = content.replace(oldUlContent, `\n                                    ${newQuickLinks}\n                                `);
                            updated = true;
                        }
                    }
                }
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated UI in: ${fullPath}`);
            }
        }
    }
}

processDir('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin');
console.log('Admin UI Refresh Complete.');
