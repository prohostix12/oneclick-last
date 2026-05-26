const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const pageFontMaps = [
  { match: /page\.tsx$/, heading: "'Plus Jakarta Sans', sans-serif", body: "'DM Sans', sans-serif" },
  { match: /about\\page\.tsx$|about\/page\.tsx$/, heading: "'Outfit', sans-serif", body: "'Manrope', sans-serif" },
  { match: /services.*page\.tsx$/, heading: "'Syne', sans-serif", body: "'DM Sans', sans-serif" },
  { match: /contact\\page\.tsx$|contact\/page\.tsx$/, heading: "'Space Grotesk', sans-serif", body: "'DM Sans', sans-serif" },
  { match: /projects\\page\.tsx$|projects\/page\.tsx$/, heading: "'Plus Jakarta Sans', sans-serif", body: "'Manrope', sans-serif" },
  { match: /blog.*page\.tsx$/, heading: "'Outfit', sans-serif", body: "'DM Sans', sans-serif" },
  { match: /testimonials\\page\.tsx$|testimonials\/page\.tsx$/, heading: "'Space Grotesk', sans-serif", body: "'Manrope', sans-serif" },
];

walkDir(srcAppDir, function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    let relativePath = path.relative(srcAppDir, filePath).replace(/\\/g, '/');
    let content = fs.readFileSync(filePath, 'utf8');

    // Clean up old injection block
    let startIdx = content.indexOf('/* Professional Font Injection */');
    if (startIdx !== -1) {
      let endIdx = content.indexOf('</style>', startIdx);
      if (endIdx !== -1) {
         // remove the block entirely
         let beforeBlock = content.substring(0, startIdx);
         let afterBlock = content.substring(endIdx);
         content = beforeBlock + afterBlock;
      }
    }

    // Determine curated font mapping
    let headingFont = "'Plus Jakarta Sans', sans-serif"; // default professional
    let bodyFont = "'DM Sans', sans-serif"; // default professional
    
    for (let map of pageFontMaps) {
      if (map.match.test(filePath)) {
        headingFont = map.heading;
        bodyFont = map.body;
        break; // first match wins
      }
    }

    // Restore styling carefully
    let cssToInject = `
        /* Professional Typography */
        h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .title, .heading { font-family: ${headingFont} !important; letter-spacing: -0.5px; }
        body, p, span, div, a, li, .desc, .subtitle, .body-text { font-family: ${bodyFont}; }
        .btn, button, .button { font-family: ${headingFont} !important; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    `;

    if (content.includes('<style jsx global>{`') || content.includes('<style>{`')) {
      const parts = content.split('</style>');
      if (parts.length > 1) {
         // inject before the first style close
         parts[0] = parts[0] + cssToInject;
         content = parts.join('</style>');
      }
    } else {
        const returnIndex = content.lastIndexOf('return (');
        if (returnIndex !== -1) {
            const firstTagIndex = content.indexOf('<', returnIndex + 'return ('.length);
            if (firstTagIndex !== -1) {
                const before = content.substring(0, firstTagIndex);
                const after = content.substring(firstTagIndex);
                content = before + `\n<style jsx global>{\`${cssToInject}\`}</style>\n` + after;
            }
        }
    }

    // Clean up inline styles that I added (like Bricolage Grotesque or Playfair Display)
    content = content.replace(/fontFamily:\s*['"](?:Playfair Display|Bricolage Grotesque)['"],\s*['"]serif['"]/g, `fontFamily: ${headingFont}`);
    content = content.replace(/fontFamily:\s*['"](?:Playfair Display|Bricolage Grotesque)['"],\s*['"]sans-serif['"]/g, `fontFamily: ${headingFont}`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Curated professional fonts ${headingFont} & ${bodyFont} in ${relativePath}`);
  }
});
