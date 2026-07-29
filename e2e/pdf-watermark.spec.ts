import { test, expect } from "@playwright/test";
import { PDFDocument, degrees } from "pdf-lib";
import fs from "fs";

async function createSamplePdfBytes(pageCount: number = 1, rotationAngle: number = 0): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.addPage([600, 800]);
    if (rotationAngle !== 0) {
      page.setRotation(degrees(rotationAngle));
    }
  }
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

test.describe("Track C1.0 Watermark PDF Real Browser & Offline Gate", () => {
  test("Gate E: /pdf.worker.min.mjs local asset HTTP 200 & MIME integrity", async ({ request }) => {
    const response = await request.get("http://localhost:3000/pdf.worker.min.mjs");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(100000);
    expect(body).toContain("pdfjsWorker");
  });

  test("Gate A, G, I: Complete browser watermark execution & artifact download lifecycle", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("http://localhost:3000/watermark-pdf");
    await expect(page.locator("h1")).toContainText("Add Watermark to PDF");

    const pdfBuffer = await createSamplePdfBytes(1);

    // 1. Upload PDF file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "sample_doc.pdf",
      mimeType: "application/pdf",
      buffer: pdfBuffer,
    });

    // 2. Assert preview canvas appears within 15s
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // 3. Fill watermark text
    const textInput = page.locator('input[type="text"]').first();
    await textInput.fill("CONFIDENTIAL E2E");

    // 4. Click Apply Watermark
    const applyButton = page.locator("button:has-text('Apply Watermark')");
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    // 5. Assert Dual-Reload Verified badge and WEB_WORKER execution mode badge appear
    const verifiedBadge = page.locator("text=Dual-Reload Verified");
    try {
      await expect(verifiedBadge).toBeVisible({ timeout: 15000 });
    } catch (err) {
      const errorMsg = await page.locator("div.bg-red-950\\/80").textContent().catch(() => null);
      if (errorMsg) {
        console.error("UI ERROR BANNER ON 1ST RUN:", errorMsg);
      }
      throw err;
    }

    const workerBadge = page.locator("text=WEB_WORKER");
    await expect(workerBadge).toBeVisible();

    // 6. Complete Download Validation: Capture downloaded file, save, read bytes & reload with pdf-lib
    const downloadButton = page.locator("button:has-text('Download Watermarked PDF')");
    await expect(downloadButton).toBeEnabled();

    const downloadPromise = page.waitForEvent("download");
    await downloadButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("watermarked-sample_doc.pdf");

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();

    if (downloadPath) {
      const downloadedBytes = fs.readFileSync(downloadPath);
      expect(downloadedBytes.length).toBeGreaterThan(100);

      // Verify magic bytes %PDF-
      expect(downloadedBytes[0]).toBe(0x25); // %
      expect(downloadedBytes[1]).toBe(0x50); // P
      expect(downloadedBytes[2]).toBe(0x44); // D
      expect(downloadedBytes[3]).toBe(0x46); // F

      // Reload with pdf-lib and assert page count
      const reloadedDoc = await PDFDocument.load(downloadedBytes);
      expect(reloadedDoc.getPageCount()).toBe(1);
    }

    // 7. Test Adjust Watermark & Second Successful Execution
    const adjustButton = page.locator("button:has-text('Adjust Watermark')");
    await expect(adjustButton).toBeVisible();
    await adjustButton.click();

    // Re-assert preview canvas restored
    await expect(canvas).toBeVisible();

    // Update watermark text for 2nd run
    await textInput.fill("REVISED DRAFT 2026");
    await page.waitForTimeout(300);
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    try {
      await expect(verifiedBadge).toBeVisible({ timeout: 15000 });
    } catch (err) {
      const errorMsg = await page.locator("div.bg-red-950\\/80").textContent().catch(() => null);
      if (errorMsg) {
        console.error("UI ERROR BANNER ON 2ND RUN:", errorMsg);
      }
      throw err;
    }

    // 8. Test Start Over reset lifecycle
    const startOverButton = page.locator("button:has-text('Start Over')");
    await expect(startOverButton).toBeVisible();
    await startOverButton.click();

    // Assert upload dropzone is restored
    await expect(page.locator("text=Drop your PDF here")).toBeVisible();

    // 9. Assert zero page errors and console errors
    expect(pageErrors.length).toBe(0);
    expect(consoleErrors.length).toBe(0);
  });

  test("Gate J: Real offline complete watermark processing & privacy assertion workflow", async ({ page }) => {
    const recordedRequests: Array<{ method: string; url: string; postData?: string }> = [];

    // Intercept and record all network traffic
    await page.route("**/*", (route) => {
      const req = route.request();
      const url = req.url();
      const method = req.method();
      const postData = req.postData() || undefined;

      recordedRequests.push({ method, url, postData });

      const isLocalHostOrBlob =
        url.startsWith("http://localhost:3000") ||
        url.startsWith("http://127.0.0.1") ||
        url.startsWith("data:") ||
        url.startsWith("blob:") ||
        url.startsWith("file:");

      if (!isLocalHostOrBlob) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto("http://localhost:3000/watermark-pdf");
    await expect(page.locator("h1")).toContainText("Add Watermark to PDF");

    const pdfBuffer = await createSamplePdfBytes(1);

    // Upload PDF file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "offline_sample.pdf",
      mimeType: "application/pdf",
      buffer: pdfBuffer,
    });

    // Preview canvas
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });

    // Apply Watermark offline
    const applyButton = page.locator("button:has-text('Apply Watermark')");
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    // Assert Dual-Reload Verified & WEB_WORKER badges appear offline
    await expect(page.locator("text=Dual-Reload Verified")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=WEB_WORKER")).toBeVisible();

    // Assert download button is enabled offline
    const downloadButton = page.locator("button:has-text('Download Watermarked PDF')");
    await expect(downloadButton).toBeEnabled();

    // Privacy Assertion: Assert NO external POST, PUT, or PATCH requests contain PDF bytes or target remote endpoints
    const externalMutatingRequests = recordedRequests.filter(
      (r) =>
        !r.url.startsWith("http://localhost:3000") &&
        !r.url.startsWith("http://127.0.0.1") &&
        ["POST", "PUT", "PATCH"].includes(r.method)
    );
    expect(externalMutatingRequests.length).toBe(0);
  });
});
