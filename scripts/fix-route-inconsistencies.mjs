import fs from "fs";
import path from "path";

const appDir = path.resolve("src/app");
const entries = fs.readdirSync(appDir, { withFileTypes: true });

let fixedCount = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(") || entry.name === "api" || entry.name === "dev") {
    continue;
  }

  const pagePath = path.join(appDir, entry.name, "page.tsx");
  if (!fs.existsSync(pagePath)) continue;

  let content = fs.readFileSync(pagePath, "utf-8");
  let modified = false;

  // 1. Fix contrast issues: text-white -> text-slate-900, text-blue-100 -> text-slate-600
  if (content.includes("text-white leading-[1.1]")) {
    content = content.replaceAll("text-white leading-[1.1]", "text-slate-900 leading-[1.1]");
    modified = true;
  }
  if (content.includes("text-blue-100 leading-relaxed")) {
    content = content.replaceAll("text-blue-100 leading-relaxed", "text-slate-600 leading-relaxed");
    modified = true;
  }
  if (content.includes("text-blue-100 font-medium")) {
    content = content.replaceAll("text-blue-100 font-medium", "text-slate-600 font-medium");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(pagePath, content, "utf-8");
    fixedCount++;
    console.log(`✓ Fixed typography contrast in ${entry.name}/page.tsx`);
  }
}

console.log(`\nCompleted contrast fix across ${fixedCount} tool route pages.`);
