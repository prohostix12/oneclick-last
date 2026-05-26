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

walkDir(srcAppDir, function(filePath) {
  if (filePath.endsWith('page.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Remove Professional Font Injection block
    content = content.replace(/<style jsx global>\{`[\s\S]*?Professional Font Injection[\s\S]*?`\}<\/style>/g, '');
    
    // Remove Professional Typography block
    content = content.replace(/<style jsx global>\{`[\s\S]*?Professional Typography[\s\S]*?`\}<\/style>/g, '');
    
    // Remove any leftover style blocks that are just fonts
    content = content.replace(/<style jsx global>\{`[\s\S]*?font-family:[\s\S]*?`\}<\/style>/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Cleaned font overrides from ${filePath}`);
    }
  }
});
