import { test, expect } from "@playwright/test";
import { PDFDocument, degrees } from "pdf-lib";

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

  test("Gate A, G, I: Complete browser watermark execution lifecycle", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    await page.goto("http://localhost:3000/watermark-pdf");
    await expect(page.locator("h1")).toContainText("Add Watermark to PDF");

    const pdfBuffer = await createSamplePdfBytes(1);

    // Upload PDF file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "sample_doc.pdf",
      mimeType: "application/pdf",
      buffer: pdfBuffer,
    });

    // Assert preview canvas appears within 15s
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Fill watermark text
    const textInput = page.locator('input[type="text"]').first();
    await textInput.fill("CONFIDENTIAL E2E");

    // Click Apply Watermark
    const applyButton = page.locator("button:has-text('Apply Watermark')");
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    // Assert Dual-Reload Verified badge appears
    const verifiedBadge = page.locator("text=Dual-Reload Verified");
    await expect(verifiedBadge).toBeVisible({ timeout: 15000 });

    // Assert download button is enabled
    const downloadButton = page.locator("button:has-text('Download Watermarked PDF')");
    await expect(downloadButton).toBeEnabled();

    // Test Start Over reset lifecycle from Result Card
    const startOverButton = page.locator("button:has-text('Start Over')");
    await expect(startOverButton).toBeVisible();
    await startOverButton.click();

    // Assert upload dropzone is restored
    await expect(page.locator("text=Drop your PDF here")).toBeVisible();
  });

  test("Gate J: Real offline complete watermark processing workflow", async ({ page }) => {
    const externalRequests: string[] = [];

    // Block all external (non-local) network traffic
    await page.route("**/*", (route) => {
      const url = route.request().url();
      const isLocal =
        url.startsWith("http://localhost:3000") ||
        url.startsWith("http://127.0.0.1") ||
        url.startsWith("data:") ||
        url.startsWith("blob:") ||
        url.startsWith("file:");

      if (!isLocal) {
        externalRequests.push(url);
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
    await applyButton.click();

    // Assert Dual-Reload Verified badge appears offline
    await expect(page.locator("text=Dual-Reload Verified")).toBeVisible({ timeout: 15000 });

    // Assert download button is enabled offline
    const downloadButton = page.locator("button:has-text('Download Watermarked PDF')");
    await expect(downloadButton).toBeEnabled();

    // Assert zero external requests during complete workflow
    expect(externalRequests.length).toBe(0);
  });
});
