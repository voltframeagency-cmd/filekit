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

  // 1. Ensure royal blue canvas hero headers use crisp white and blue-100 text
  if (content.includes("text-slate-900 leading-[1.1]")) {
    content = content.replaceAll("text-slate-900 leading-[1.1]", "text-white leading-[1.1]");
    modified = true;
  }
  if (content.includes("text-slate-600 leading-relaxed") && !content.includes("HowToStepSection")) {
    content = content.replaceAll("text-slate-600 leading-relaxed", "text-blue-100 leading-relaxed");
    modified = true;
  }
  if (content.includes("text-slate-600 font-medium")) {
    content = content.replaceAll("text-slate-600 font-medium", "text-blue-100 font-medium");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(pagePath, content, "utf-8");
    fixedCount++;
    console.log(`✓ Restored brand-compliant hero contrast in ${entry.name}/page.tsx`);
  }
}

console.log(`\nCompleted hero contrast harmonization across ${fixedCount} tool route pages.`);
