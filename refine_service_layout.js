const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function fixLayout(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Increase padding-top for Navbar clearance
    if (content.includes("padding-top: 100px;")) {
        content = content.replace(/padding-top: 100px;/g, "padding-top: 140px;");
        changed = true;
    }
    if (content.includes("top: 120px;")) { // for back-button
        content = content.replace(/top: 120px;/g, "top: 140px;");
        changed = true;
    }

    // 2. Ensure hero-content centering if it exists
    if (content.includes(".hero-content {") && !content.includes("margin: 0 auto;")) {
        content = content.replace(".hero-content {", ".hero-content {\n          margin: 0 auto;");
        changed = true;
    }

    // 3. Fix max-width of hero text on subpages
    if (content.includes(".hero-text {") && !content.includes("max-width: 600px;")) {
         // content = content.replace(".hero-text {", ".hero-text {\n          max-width: 600px;");
         // changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Refined Layout: ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx')) {
            fixLayout(fullPath);
        }
    });
}

processDir(servicesDir);
console.log("Layout refinement complete.");
