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

    // Find the broken CSS injection
    if (content.includes('`}')) {
      // It injected it like: `}\n        /* Professional Typography */ ... \n    </style>
      // We want to move the `} to right before </style>.
      
      const pattern = /`}\s*\/\* Professional Typography \*\/(.*?)<\/style>/s;
      const match = content.match(pattern);
      if (match) {
        const injectedStyles = match[1];
        const replacement = `\n/* Professional Typography */${injectedStyles}\n\`}</style>`;
        content = content.replace(pattern, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed syntax in ${filePath}`);
      }
    }
  }
});
