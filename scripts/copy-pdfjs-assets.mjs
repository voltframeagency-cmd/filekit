import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const pkgPath = path.join(rootDir, "node_modules", "pdfjs-dist", "package.json");
const srcPath = path.join(rootDir, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const publicDir = path.join(rootDir, "public");
const destPath = path.join(publicDir, "pdf.worker.min.mjs");

function copyPdfJsAssets() {
  console.log("▶ Verifying and copying PDF.js worker asset to public/...");

  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Source PDF.js worker asset not found at: ${srcPath}`);
    process.exit(1);
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const version = pkgJson.version || "unknown";

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);

  const srcStat = fs.statSync(srcPath);
  const destStat = fs.statSync(destPath);

  if (srcStat.size !== destStat.size || srcStat.size === 0) {
    console.error(`❌ Asset copy mismatch! Source size: ${srcStat.size}, Dest size: ${destStat.size}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(destPath);
  const sha256Hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  console.log(`✓ PDF.js worker asset verified:
  - Version: ${version}
  - Path: public/pdf.worker.min.mjs
  - Size: ${(destStat.size / 1024).toFixed(1)} KB (${destStat.size} bytes)
  - SHA-256: ${sha256Hash}`);
}

copyPdfJsAssets();
