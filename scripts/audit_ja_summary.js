const fs = require("fs");
const path = require("path");

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        walk(filePath, fileList);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = walk("./src");
const missingByFile = {};

for (const file of allFiles) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes("isFilipino ?") ||
      line.includes("isThai ?") ||
      line.includes("isVietnamese ?") ||
      line.includes("isMalay ?")
    ) {
      const start = Math.max(0, i - 14);
      const end = Math.min(lines.length - 1, i + 14);
      const window = lines.slice(start, end + 1).join("\n");
      if (!window.includes("isJapanese") && !window.includes('"ja"') && !window.includes("'ja'")) {
        missingByFile[file] = (missingByFile[file] || 0) + 1;
      }
    }
  }
}

console.log("FILES WITH MISSING JA:");
console.log(JSON.stringify(missingByFile, null, 2));
