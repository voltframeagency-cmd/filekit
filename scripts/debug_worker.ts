import { chromium } from "playwright";
import * as path from "path";

async function debugWorker() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log(`[Browser Console ${msg.type()}]`, msg.text()));
  page.on("pageerror", (err) => console.error("[Browser PageError]", err));

  await page.goto("http://localhost:3000/compress-pdf", { waitUntil: "networkidle" });

  const filePath = "C:\\Users\\mahdi\\FileKit-Private-Fixtures\\LOCAL-001.pdf";
  console.log(`Uploading ${filePath}...`);
  await page.setInputFiles('input[type="file"]', filePath);
  await page.waitForTimeout(1500);

  const compressBtn = page.locator('button:has-text("Compress PDF")');
  if (await compressBtn.isVisible()) {
    console.log("Clicking Compress PDF button...");
    await compressBtn.click();
    await page.waitForTimeout(10000);
  } else {
    console.log("Compress PDF button not visible! Body text:");
    console.log(await page.innerText("body"));
  }

  await browser.close();
}

debugWorker();
