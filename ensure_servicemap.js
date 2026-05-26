const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'app', 'services');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Ensure Import
    if (!content.includes("import ServiceMap from '@/app/components/ServiceMap';")) {
        content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport ServiceMap from '@/app/components/ServiceMap';");
        changed = true;
    }

    // 2. Ensure JSX Usage - more robust regex
    if (content.includes("{/* Service Locations */}") && !content.includes("<ServiceMap />")) {
        // Replace the comment and any subsequent whitespace until the next section
        content = content.replace(/\{\/\* Service Locations \*\/\}\s*/, "{/* Service Locations */}\n        <ServiceMap />\n        ");
        changed = true;
    }

    // 3. Removelegacy styles if ServiceMap is present
    if (content.includes("<ServiceMap />")) {
        const styleRegexes = [
            /\.locations-section \{[^}]*\}/g,
            /\.locations-header \{[^}]*\}/g,
            /\.locations-title \{[^}]*\}/g,
            /\.locations-subtitle \{[^}]*\}/g,
            /\.locations-description \{[^}]*\}/g,
            /\.locations-map-container \{[^}]*\}/g,
            /\.locations-map-container img \{[^}]*\}/g,
            /\.locations-grid \{[^}]*\}/g,
            /\.location-card \{[^}]*\}/g
        ];
        
        styleRegexes.forEach(re => {
            if (re.test(content)) {
                content = content.replace(re, '');
                changed = true;
            }
        });
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Audited: ${filePath}`);
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
