const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
};

// Map of common slow durations to faster ones
const replacements = [
    { from: /duration:\s*1\.2/g, to: 'duration: 0.4' },
    { from: /duration:\s*1\.0/g, to: 'duration: 0.3' },
    { from: /duration:\s*0\.8/g, to: 'duration: 0.3' },
    { from: /duration:\s*0\.6/g, to: 'duration: 0.2' },
    { from: /delay:\s*0\.3/g, to: 'delay: 0.1' },
    { from: /delay:\s*0\.5/g, to: 'delay: 0.15' },
    { from: /transition:\s*all\s*0\.8s/g, to: 'transition: all 0.3s' },
    { from: /transition:\s*all\s*0\.5s/g, to: 'transition: all 0.2s' },
    { from: /animation-duration:\s*1s/g, to: 'animation-duration: 0.4s' }
];

const files = walk(path.join(__dirname, 'src', 'app'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });
    
    if (content !== original) {
        console.log(`Sped up animations in: ${file}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Finished speeding up animations.');
