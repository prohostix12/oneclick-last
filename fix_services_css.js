const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src', 'app', 'services', 'page.tsx');

let content = fs.readFileSync(targetFile, 'utf8');

// 1. Fix hero-content margin
content = content.replace(
    /(\.hero-content\s*\{[\s\S]*?padding:\s*2rem;)(\s*\})/,
    '$1\n          margin: 0 auto;$2'
);

// 2. Fix service-card
content = content.replace(
    /(\.service-card\s*\{[\s\S]*?)background:\s*rgba\(0,\s*0,\s*0,\s*0\.05\);([\s\S]*?)border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.1\);([\s\S]*?)box-shadow:\s*0\s*4px\s*12px\s*rgba\(0,\s*0,\s*0,\s*0\.1\);/,
    '$1background: #ffffff;$2border: 1px solid rgba(0, 0, 0, 0.05);$3box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);'
);

// 3. Fix service-card:hover
content = content.replace(
    /(\.service-card:hover\s*\{[\s\S]*?)transform:\s*translateY\(-8px\);([\s\S]*?)background:\s*rgba\(255,\s*255,\s*255,\s*0\.08\);([\s\S]*?)box-shadow:\s*0\s*20px\s*40px\s*rgba\(0,\s*0,\s*0,\s*0\.25\);/,
    '$1transform: translateY(-10px);$2background: #ffffff;$3box-shadow: 0 20px 40px rgba(230, 30, 37, 0.15);'
);

// 4. Fix cta-section
content = content.replace(
    /(\.cta-section\s*\{)\s*background:\s*#1a1a1a;\s*padding:\s*4rem\s*2rem;\s*text-align:\s*center;\s*color:\s*white;/,
    '$1\n          position: relative;\n          padding: 8rem 2rem;\n          min-height: 400px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          overflow: hidden;\n          background: #111;'
);

fs.writeFileSync(targetFile, content);
console.log('Fixed CSS in services/page.tsx');
