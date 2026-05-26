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

const professionalFonts = [
  "'Syne', sans-serif",
  "'Plus Jakarta Sans', sans-serif",
  "'Bricolage Grotesque', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Outfit', sans-serif"
];

const secondaryFonts = [
  "'DM Sans', sans-serif",
  "'Manrope', sans-serif"
];

walkDir(srcAppDir, function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    let relativePath = path.relative(srcAppDir, filePath).replace(/\\/g, '/');
    
    // Choose pseudo-random valid fonts based on path hash to be consistent but unique per page
    let hash = Array.from(relativePath).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    let titleFont = professionalFonts[hash % professionalFonts.length];
    let headingFont = professionalFonts[(hash + 1) % professionalFonts.length];
    let bodyFont = secondaryFonts[hash % secondaryFonts.length];
    let subtitleFont = secondaryFonts[(hash + 1) % secondaryFonts.length];

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has Professional Font Injection comment from previous script script
    if (content.includes('Professional Font Injection')) {
      return; 
    }

    // Remove old base system fonts
    content = content.replace(/font-family:\s*-(apple-system|moz-initial).*?;/gi, `font-family: ${bodyFont};`);
    
    let cssToInject = `
        /* Professional Font Injection */
        h1, .hero-title, .page-title, .title { font-family: ${titleFont} !important; }
        h2, h3, .section-title, .heading { font-family: ${headingFont} !important; }
        h4, h5, h6, .subtitle, .section-subtitle, .desc { font-family: ${subtitleFont} !important; }
        body, p, span, div, a, li, .body-text { font-family: ${bodyFont}; }
        .btn, button, .button { font-family: ${subtitleFont} !important; }
        .hero-title { letter-spacing: -1px; }
        .section-title { letter-spacing: -0.5px; }
    `;

    if (content.includes('<style jsx global>{`') || content.includes('<style>{`')) {
      const parts = content.split('<style');
      if (parts.length > 1) {
         const styleClosingIndex = parts[1].indexOf('`}</style>');
         if (styleClosingIndex !== -1) {
             const before = parts[1].substring(0, styleClosingIndex);
             const after = parts[1].substring(styleClosingIndex);
             parts[1] = before + cssToInject + after;
             content = parts.join('<style');
         }
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

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated fonts recursively in ${relativePath}`);
  }
});
