import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const srcPath = path.join(rootDir, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const publicDir = path.join(rootDir, "public");
const destPath = path.join(publicDir, "pdf.worker.min.mjs");

function copyPdfJsAssets() {
  console.log("▶ Copying PDF.js worker asset to public/...");

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source PDF.js worker asset not found at: ${srcPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);

  const stat = fs.statSync(destPath);
  console.log(`✓ Successfully copied pdf.worker.min.mjs (${(stat.size / 1024).toFixed(1)} KB) to public/pdf.worker.min.mjs`);
}

copyPdfJsAssets();
