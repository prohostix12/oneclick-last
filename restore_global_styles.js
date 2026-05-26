const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function restoreGlobalStyles(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Restore <style jsx> back to <style jsx global> because framer-motion strips the styled-jsx scope
    if (content.includes("<style jsx>")) {
        content = content.replace(/<style jsx>/g, "<style jsx global>");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Restored global scope: ${filePath}`);
    }
}

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            restoreGlobalStyles(fullPath);
        }
    });
}

processDir(servicesDir);
console.log("Restoration complete.");
