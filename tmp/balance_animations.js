const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
};

const rootDir = process.cwd();
const files = walk(rootDir);

console.log(`Analyzing ${files.length} files...`);

files.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Adjust Framer Motion and CSS Durations
    // Targeting duration values like 0.2s, 0.4s to make them smoother
    content = content.replace(/duration:\s*(0\.\d+)/g, (match, val) => {
        const num = parseFloat(val);
        if (num <= 0.3) return `duration: 0.6`;
        if (num <= 0.5) return `duration: 1.0`;
        return `duration: 1.2`;
    });

    // Adjust Stagger and Delays
    content = content.replace(/staggerChildren:\s*(0\.\d+)/g, (match, val) => {
        const num = parseFloat(val);
        return `staggerChildren: 0.3`;
    });

    content = content.replace(/delayChildren:\s*(0\.\d+)/g, (match, val) => {
        const num = parseFloat(val);
        return `delayChildren: 0.5`;
    });

    content = content.replace(/delay:\s*(0\.\d+)/g, (match, val) => {
        const num = parseFloat(val);
        return `delay: 0.3`;
    });

    // CSS Transitions
    content = content.replace(/transition:\s*all\s*(0\.\d+)s/g, (match, val) => {
        return `transition: all 0.6s`;
    });
    
    content = content.replace(/transition:\s*(0\.\d+)s/g, (match, val) => {
        return `transition: 0.6s`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Adjusted: ${filePath}`);
    }
});

console.log('Balance adjustment complete.');
