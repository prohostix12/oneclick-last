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

    // Look for <style jsx global> immediately following return (
    const pattern = /(return\s*\(\s*)(\n?\s*<style jsx global>)/g;
    if (pattern.test(content)) {
      if (!content.includes('<>')) { // only if not already wrapped
        content = content.replace(pattern, '$1<>\n$2');
        // Now find the final ); and insert </>;
        const lastParen = content.lastIndexOf(';');
        
        // This is a bit risky. A safer way is checking if we replaced the start, then appending </> just before the final bracket of the exported component.
        // Actually, if we just find the last `);`, it's usually the return statement.
        const returnEndPattern = /\)\s*;/g;
        let match;
        let lastMatchIndex = -1;
        while ((match = returnEndPattern.exec(content)) !== null) {
          lastMatchIndex = match.index;
        }

        if (lastMatchIndex !== -1) {
           content = content.substring(0, lastMatchIndex) + '\n</>' + content.substring(lastMatchIndex);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Wrapped ${filePath} in fragment`);
      }
    }
  }
});
