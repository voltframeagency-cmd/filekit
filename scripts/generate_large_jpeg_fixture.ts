import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { PDFDocument } from "pdf-lib";

async function generateLargeFixture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/compress-pdf");

  const jpegBase64 = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    for (let y = 0; y < 1200; y += 10) {
      for (let x = 0; x < 1200; x += 10) {
        ctx.fillStyle = `rgb(${(x * 13) % 256}, ${(y * 17) % 256}, ${(x + y * 7) % 256})`;
        ctx.fillRect(x, y, 10, 10);
      }
    }

    return canvas.toDataURL("image/jpeg", 0.95);
  });

  await browser.close();

  const base64Data = jpegBase64.replace(/^data:image\/jpeg;base64,/, "");
  const jpegBytes = Buffer.from(base64Data, "base64");

  const doc = await PDFDocument.create();
  const page1 = doc.addPage([1200, 1200]);
  const img = await doc.embedJpg(jpegBytes);
  page1.drawImage(img, { x: 0, y: 0, width: 1200, height: 1200 });

  const pdfBytes = await doc.save();
  const outPath = path.join(__dirname, "../src/utils/engine/__tests__/large_jpeg.pdf");
  fs.writeFileSync(outPath, Buffer.from(pdfBytes));

  console.log(`Generated large JPEG PDF fixture at ${outPath} (${pdfBytes.byteLength} bytes)`);
}

generateLargeFixture();
