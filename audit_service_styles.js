const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function auditFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove the 'global' attribute from <style jsx global>
    if (content.includes("<style jsx global>")) {
        content = content.replace(/<style jsx global>/g, "<style jsx>");
        changed = true;
    }

    // 2. Remove the duplicate * { scrollbar-width: none; ... } from pages
    // Since it's already in globals.css, it's redundant and can trigger mismatches if differently spaced
    const scrollbarRe = /\s*\* \{\s*scrollbar-width: none;\s*-ms-overflow-style: none;\s*\}\s*\*::-webkit-scrollbar \{\s*display: none;\s*\}/g;
    if (scrollbarRe.test(content)) {
        content = content.replace(scrollbarRe, '');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Audited Styles: ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            auditFile(fullPath);
        }
    });
}

processDir(servicesDir);
console.log("Audit complete.");
