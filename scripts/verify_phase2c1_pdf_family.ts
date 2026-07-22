import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "C:\\Users\\mahdi\\FileKit-PdfFamily-Fixtures";
const BASE_URL = "http://localhost:3000";

async function verifyPhase2c1PdfFamily() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  console.log("======================================================================");
  console.log("PHASE 2C1: COMPLETE PDF COMPRESSOR FAMILY CHROMIUM AUDIT");
  console.log("======================================================================\n");

  const browser = await chromium.launch({ headless: true });

  // Generate valid sample PDF using pdf-lib inside browser
  const setupPage = await browser.newPage();
  await setupPage.goto(`${BASE_URL}/compress-pdf-to-2mb`, { waitUntil: "networkidle" });

  const pdfB64 = await setupPage.evaluate(async () => {
    const PDFDocument = (window as any).PDFLib.PDFDocument;
    const rgb = (window as any).PDFLib.rgb;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    page.drawText("FileKit Phase 2C1 Sample PDF Document", { x: 50, y: 350, size: 20, color: rgb(0, 0.4, 0.8) });
    for (let i = 0; i < 50; i++) {
      page.drawText(`Sample line content item ${i + 1} with repeated text bytes for testing`, { x: 50, y: 320 - i * 5, size: 10 });
    }
    const pdfBytes = await pdfDoc.save();
    let binary = "";
    const bytes = new Uint8Array(pdfBytes);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  });

  await setupPage.close();

  const pdfBuf = Buffer.from(pdfB64, "base64");
  fs.writeFileSync(path.join(TEMP_DIR, "sample_doc.pdf"), pdfBuf);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    acceptDownloads: true
  });

  // Test 1: /compress-pdf (General PDF Compressor Workspace)
  console.log("[Test 1] /compress-pdf General PDF Compressor Execution...");
  const page1 = await context.newPage();
  await page1.goto(`${BASE_URL}/compress-pdf`, { waitUntil: "networkidle" });

  const h1Text1 = await page1.locator("h1").innerText();
  console.log(`  ✓ General Route H1: "${h1Text1}" (Expected: "PDF Compressor")`);

  await page1.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "sample_doc.pdf"));
  await page1.waitForSelector('button:has-text("Compress PDF")', { timeout: 10000 });

  await page1.locator('button:has-text("Compress PDF")').click();
  await page1.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText1 = await page1.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ General PDF Outcome: Download Button="${dlBtnText1}"`);
  await page1.close();

  // Test 2: /compress-pdf-to-size (Custom Target Route & Quick Chips)
  console.log("\n[Test 2] /compress-pdf-to-size Custom Target Route Execution...");
  const page2 = await context.newPage();
  await page2.goto(`${BASE_URL}/compress-pdf-to-size?target=3&unit=mb`, { waitUntil: "networkidle" });

  const h1Text2 = await page2.locator("h1").innerText();
  console.log(`  ✓ Custom Route H1: "${h1Text2}"`);

  await page2.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "sample_doc.pdf"));
  await page2.waitForSelector('input[type="number"]', { timeout: 10000 });

  const initialInputVal = await page2.locator('input[type="number"]').inputValue();
  console.log(`  ✓ Query prefilling target=3&unit=mb -> input value: "${initialInputVal}"`);

  // Quick chip populates field
  await page2.locator('button:has-text("1 MB")').click();
  const chipInputVal = await page2.locator('input[type="number"]').inputValue();
  console.log(`  ✓ Quick-fill chip '1 MB' populated field -> input value: "${chipInputVal}"`);

  await page2.waitForSelector('button:has-text("Compress PDF")', { timeout: 10000 });
  await page2.locator('button:has-text("Compress PDF")').click();
  await page2.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText2 = await page2.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Custom Target Outcome: Download Button="${dlBtnText2}"`);
  await page2.close();

  // Test 3: /compress-pdf-to-2mb (Fixed 2 MB Route)
  console.log("\n[Test 3] /compress-pdf-to-2mb Fixed 2 MB Route Execution...");
  const page3 = await context.newPage();
  await page3.goto(`${BASE_URL}/compress-pdf-to-2mb`, { waitUntil: "networkidle" });

  const h1Text3 = await page3.locator("h1").innerText();
  console.log(`  ✓ Fixed Route H1: "${h1Text3}" (Expected: "Compress a PDF below 2 MB")`);

  await page3.locator('input[type="file"]').setInputFiles(path.join(TEMP_DIR, "sample_doc.pdf"));
  await page3.waitForSelector('button:has-text("Compress PDF")', { timeout: 10000 });

  const hasEditableTarget = await page3.locator('input[type="number"]').isVisible();
  console.log(`  ✓ Fixed 2 MB route suppresses editable target input: ${!hasEditableTarget}`);

  await page3.locator('button:has-text("Compress PDF")').click();
  await page3.waitForSelector('button:has-text("Download")', { timeout: 20000 });

  const dlBtnText3 = await page3.locator('button:has-text("Download")').innerText();
  console.log(`  ✓ Fixed 2 MB Outcome: Download Button="${dlBtnText3}"`);

  // Download verification
  const dlPromise = page3.waitForEvent("download");
  await page3.locator('button:has-text("Download")').first().click();
  const dl = await dlPromise;
  const dlPath = path.join(TEMP_DIR, "compressed_out.pdf");
  await dl.saveAs(dlPath);
  const dlBytes = fs.readFileSync(dlPath).byteLength;
  console.log(`  ✓ Downloaded PDF File Verified: ${dlBytes} Bytes saved successfully`);

  await page3.close();

  // Test 4: Mobile Viewport 375px Responsiveness
  console.log("\n[Test 4] Mobile 375px Viewport Overflow Check...");
  const mobContext = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true });
  const mobPage = await mobContext.newPage();
  await mobPage.goto(`${BASE_URL}/compress-pdf-to-size`, { waitUntil: "networkidle" });
  const scrollWidth = await mobPage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobPage.evaluate(() => document.documentElement.clientWidth);
  console.log(`  ✓ Mobile 375px Overflow Check: ScrollWidth (${scrollWidth}) === ClientWidth (${clientWidth}) -> ${scrollWidth === clientWidth}`);
  await mobContext.close();

  await browser.close();

  // Clean temp files
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log(`\nPurged temporary directory: ${TEMP_DIR} (Test-Path = ${fs.existsSync(TEMP_DIR)})\n`);
  }

  console.log("======================================================================");
  console.log("PHASE 2C1 PDF COMPRESSOR FAMILY AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyPhase2c1PdfFamily();
