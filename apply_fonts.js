const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');

const fontsPerPage = {
  'page.tsx': {
    title: "'Syne', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Manrope', sans-serif"
  },
  'about/page.tsx': {
    title: "'Bricolage Grotesque', sans-serif",
    heading: "'Space Grotesk', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Outfit', sans-serif"
  },
  'contact/page.tsx': {
    title: "'Space Grotesk', sans-serif",
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Manrope', sans-serif"
  },
  'how-it-works/page.tsx': {
    title: "'Outfit', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'Manrope', sans-serif",
    subtitle: "'Space Grotesk', sans-serif"
  },
  'blog/page.tsx': {
    title: "'Syne', sans-serif",
    heading: "'Plus Jakarta Sans', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Bricolage Grotesque', sans-serif"
  },
  'locations/page.tsx': {
    title: "'Bebas Neue', cursive",
    heading: "'Manrope', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Syne', sans-serif"
  },
  'faq/page.tsx': {
    title: "'Outfit', sans-serif",
    heading: "'Space Grotesk', sans-serif",
    body: "'Manrope', sans-serif",
    subtitle: "'DM Sans', sans-serif"
  },
  'projects/page.tsx': {
    title: "'Bricolage Grotesque', sans-serif",
    heading: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Plus Jakarta Sans', sans-serif"
  },
  'testimonials/page.tsx': {
    title: "'Space Grotesk', sans-serif",
    heading: "'Outfit', sans-serif",
    body: "'DM Sans', sans-serif",
    subtitle: "'Manrope', sans-serif"
  }
};

for (const [relativePath, fonts] of Object.entries(fontsPerPage)) {
  const filePath = path.join(srcAppDir, relativePath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove old base system fonts
    content = content.replace(/font-family:\s*-(apple-system|moz-initial).*?;/gi, `font-family: ${fonts.body};`);
    
    // Attempt to inject font families to known classes if they don't already have one
    const cssToInject = `
        /* Professional Font Injection */
        h1, .hero-title, .page-title, .title { font-family: ${fonts.title} !important; }
        h2, h3, .section-title, .heading { font-family: ${fonts.heading} !important; }
        h4, h5, h6, .subtitle, .section-subtitle, .desc { font-family: ${fonts.subtitle} !important; }
        body, p, span, div, a, li, .body-text { font-family: ${fonts.body}; }
        .btn, button, .button { font-family: ${fonts.subtitle} !important; }
        .hero-title { letter-spacing: -1px; }
        .section-title { letter-spacing: -0.5px; }
    `;

    // Try to safely append styles if there is a style block
    if (content.includes('<style jsx global>{`') || content.includes('<style>{`')) {
      const parts = content.split('<style');
      if (parts.length > 1) {
         // Insert before the closing </style> of the first style block
         const styleClosingIndex = parts[1].indexOf('`}</style>');
         if (styleClosingIndex !== -1) {
             const before = parts[1].substring(0, styleClosingIndex);
             const after = parts[1].substring(styleClosingIndex);
             parts[1] = before + cssToInject + after;
             content = parts.join('<style');
         }
      }
    } else {
        // No style block found, append one right before the first React node being returned
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
    console.log(`Updated fonts in ${relativePath}`);
  }
}

