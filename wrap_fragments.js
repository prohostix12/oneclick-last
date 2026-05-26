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

    // If <style jsx global> is immediately after return (, and followed by another tag, it needs a fragment
    if (content.includes('return (\n<style jsx global>')) {
      if (!content.includes('return (\n<>\n<style jsx')) {
        // Find the return statement
        const returnIndex = content.lastIndexOf('return (\n<style jsx');
        if (returnIndex !== -1) {
           content = content.replace(/return \(\n<style jsx global>/g, 'return (\n<>\n<style jsx global>');
           // find the very end of the file where the last ); is
           const lastParenthesis = content.lastIndexOf(');');
           if (lastParenthesis !== -1) {
              const before = content.substring(0, lastParenthesis);
              const after = content.substring(lastParenthesis);
              content = before + '\n</>\n' + after;
              fs.writeFileSync(filePath, content, 'utf8');
              console.log(`Added JSX Fragments to ${filePath}`);
           }
        }
      }
    }
  }
});
