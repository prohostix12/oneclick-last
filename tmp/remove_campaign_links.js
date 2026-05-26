const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'src/app/testimonials/page.tsx',
    'src/app/services/cladding/page.tsx',
    'src/app/services/exhibition/page.tsx',
    'src/app/services/digital-graphics/page.tsx',
    'src/app/services/branding/page.tsx',
    'src/app/services/retail-signage/page.tsx',
    'src/app/services/signage/page.tsx',
    'src/app/services/vehicle-graphics/page.tsx',
    'src/app/services/vehicle-branding/page.tsx',
    'src/app/admin/components/AdminSidebar.tsx'
];

filesToUpdate.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace /campaign with /contact and related text
        content = content.replace(/href="\/campaign"/g, 'href="/contact"');
        content = content.replace(/href='\/campaign'/g, "href='/contact'");
        
        // Remove individual admin sidebar items for campaigns
        if (file.includes('AdminSidebar.tsx')) {
            // Target the specific block for campaigns in the sidebar
            const campaignBlockRegex = /<Link\s+href="\/admin\/campaigns"[\s\S]*?<\/Link>/g;
            content = content.replace(campaignBlockRegex, '');
        }

        // Specific text replacements for buttons
        content = content.replace(/Start Your\s*<\/motion.h2>\s*<motion.div[^>]*>\s*Campaign/g, 'Get in\n<\/motion.h2>\n<motion.div className="cta-subtitle" variants={fadeInUp}>\nTouch');
        content = content.replace(/Start Your\s*<\/h2>\s*<div[^>]*>\s*Campaign/g, 'Get in\n<\/h2>\n<div className="cta-subtitle">\nTouch');
        content = content.replace(/Submit Request <ArrowRight size={22} \/>/g, 'Contact Us <ArrowRight size={22} />');

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});
