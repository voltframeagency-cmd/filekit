import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import { PDFDocument, degrees } from "pdf-lib";

const TARGET_DIR = path.join(__dirname, "../public/test-fixtures");
const SAMPLE_IMAGE_URL = "https://picsum.photos/id/10/2500/1667"; // ~1.5 MB high-res JPEG
const SAMPLE_IMAGE_PATH = path.join(TARGET_DIR, "sample_photo.jpg");

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${res.statusCode}`));
        return;
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        resolve();
      });
    }).on("error", reject);
  });
}

async function compilePdf(numImages: number, destPath: string, baseImage: Uint8Array) {
  const doc = await PDFDocument.create();
  
  for (let i = 0; i < numImages; i++) {
    // Salt the image data slightly so pdf-lib compiles distinct XObject streams
    const salted = new Uint8Array(baseImage.length + i);
    salted.set(baseImage);
    for (let s = 0; s < i; s++) {
      salted[baseImage.length + s] = s % 256;
    }

    const img = await doc.embedJpg(salted);
    const page = doc.addPage([1000, 1000]);
    
    // Rotate one page to satisfy the rotated page requirement
    if (i === 1) {
      page.setRotation(degrees(90));
    }
    
    page.drawImage(img, { x: 50, y: 50, width: 900, height: 900 });
  }

  const bytes = await doc.save();
  fs.writeFileSync(destPath, bytes);
  console.log(`✓ Generated ${path.basename(destPath)}: ${(bytes.length / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  console.log("Preparing JPEG-heavy test fixtures...");
  if (!fs.existsSync(SAMPLE_IMAGE_PATH)) {
    console.log(`Downloading base sample JPEG from ${SAMPLE_IMAGE_URL}...`);
    try {
      await downloadFile(SAMPLE_IMAGE_URL, SAMPLE_IMAGE_PATH);
      console.log("✓ Base sample JPEG downloaded.");
    } catch (err: any) {
      console.error("Failed to download base sample JPEG. Reverting to dummy image construction.", err);
      // Write a dummy 1MB array of random JPEG-like garbage
      const dummyJpg = new Uint8Array(1 * 1024 * 1024);
      dummyJpg.set([0xff, 0xd8, 0xff, 0xe0]); // Minimal JPEG signature
      dummyJpg[dummyJpg.length - 2] = 0xff;
      dummyJpg[dummyJpg.length - 1] = 0xd9; // Minimal JPEG EOI
      fs.writeFileSync(SAMPLE_IMAGE_PATH, dummyJpg);
    }
  }

  const baseImage = fs.readFileSync(SAMPLE_IMAGE_PATH);

  // Generate the 6 fixtures: 2MB, 5MB, 8MB, 15MB, 25MB, 50MB
  const configs = [
    { name: "scan_2mb.pdf", count: 5 },
    { name: "scan_5mb.pdf", count: 12 },
    { name: "scan_8mb.pdf", count: 20 },
    { name: "scan_15mb.pdf", count: 38 },
    { name: "scan_25mb.pdf", count: 62 },
    { name: "scan_50mb.pdf", count: 125 }
  ];

  for (const cfg of configs) {
    const dest = path.join(TARGET_DIR, cfg.name);
    await compilePdf(cfg.count, dest, baseImage);
  }

  console.log("All JPEG-heavy fixtures generated successfully.");
}

main().catch(err => {
  console.error("Failed to generate JPEG fixtures:", err);
  process.exit(1);
});
export {};
