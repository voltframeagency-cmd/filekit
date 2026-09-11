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

for (const file of allFiles) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  const missing = [];
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
        missing.push({ line: i + 1, snippet: line.trim() });
      }
    }
  }
  if (missing.length > 0) {
    console.log(`\n=============================`);
    console.log(`${file} (${missing.length} items):`);
    console.log(`=============================`);
    missing.forEach(m => console.log(`L${m.line}: ${m.snippet.slice(0, 90)}`));
  }
}
