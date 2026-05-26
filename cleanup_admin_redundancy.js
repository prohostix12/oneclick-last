const fs = require('fs');
const path = require('path');

function processAdmin(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'components' && entry.name !== 'login' && entry.name !== 'settings') {
            processAdmin(fullPath);
        } else if (entry.name === 'page.tsx') {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Remove the footer section
            const footerRegex = /{\/\* Admin Footer \*\/}\s*<footer[\s\S]*?<\/footer>/g;
            const footerRegexNoComment = /<footer[\s\S]*?<\/footer>/g;
            
            if (footerRegex.test(content)) {
                content = content.replace(footerRegex, '');
                console.log(`Removed commented footer from: ${fullPath}`);
            } else if (footerRegexNoComment.test(content)) {
                // Only remove if it's the admin footer style (not login or something)
                if (content.includes('PREMIUM OUTDOOR MEDIA SOLUTIONS') || content.includes('Quick Links')) {
                    content = content.replace(footerRegexNoComment, '');
                    console.log(`Removed footer from: ${fullPath}`);
                }
            }

            // Remove redundant sidebars
            const sidebarRegex = /<aside[\s\S]*?<\/aside>/g;
            if (sidebarRegex.test(content)) {
                 content = content.replace(sidebarRegex, '');
                 console.log(`Removed redundant sidebar from: ${fullPath}`);
            }

            // Fix the return statement at the end of the file if we removed too much or left trailing JSX
            // (Most pages have </div> at the end)
            
            fs.writeFileSync(fullPath, content);
        }
    }
}

processAdmin('c:\\Users\\LENOVO\\Desktop\\advertisement\\src\\app\\admin');
console.log('Cleanup finished.');
