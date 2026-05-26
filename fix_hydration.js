const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Find <Link ...><button ...>...</button></Link>
    // and change to <Link ... className="back-button">...</Link>
    
    const regex = /<Link\s+href="\/services">\s*<button\s+className="back-button">\s*(<ArrowLeft[^>]*\/>)\s*<\/button>\s*<\/Link>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '<Link href="/services" className="back-button">$1</Link>');
        changed = true;
    }

    // Also check for <Link href="/services"><div className="back-button">... if I changed it to div earlier
    const regexDiv = /<Link\s+href="\/services">\s*<div\s+className="back-button">\s*(<ArrowLeft[^>]*\/>)\s*<\/div>\s*<\/Link>/g;
    if (regexDiv.test(content)) {
        content = content.replace(regexDiv, '<Link href="/services" className="back-button">$1</Link>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            fixFile(fullPath);
        }
    });
}

processDir(servicesDir);
