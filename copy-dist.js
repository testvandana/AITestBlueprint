const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyFolderContentsSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.readdirSync(src).forEach((childItemName) => {
    const srcPath = path.join(src, childItemName);
    const destPath = path.join(dest, childItemName);
    if (fs.statSync(srcPath).isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

copyFolderContentsSync('Chapter-4-AI-Agents/public', '.');
console.log('Copied built output to root correctly for Vercel.');
