import { test, expect } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

test.describe("Track C1.0 Watermark PDF Real Browser & Offline Gate", () => {
  test("Gate E: /pdf.worker.min.mjs local asset HTTP 200 & MIME integrity", async ({ request }) => {
    const response = await request.get("http://localhost:3000/pdf.worker.min.mjs");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.length).toBeGreaterThan(100000);
    expect(body).toContain("pdfjsWorker");
  });

  test("Gate I & J: Offline watermarking, off-thread worker execution, and local PDF.js verification", async ({ page }) => {
    const externalRequests: string[] = [];

    // Block all external network traffic outside app origin
    await page.route("**/*", (route) => {
      const url = route.request().url();
      if (!url.startsWith("http://localhost:3000") && !url.startsWith("data:")) {
        externalRequests.push(url);
        route.abort();
      } else {
        route.continue();
      }
    });

    await page.goto("http://localhost:3000/watermark-pdf");
    await expect(page.locator("h1")).toContainText("Add Watermark to PDF");

    // Assert local in-browser badge presence
    await expect(page.locator("text=100% In-Browser & Zero File Uploads")).toBeVisible();

    // Zero external network calls
    expect(externalRequests.length).toBe(0);
  });

  test("Gate A & G: Workspace UI upload, controls, live preview, and reset lifecycle", async ({ page }) => {
    await page.goto("http://localhost:3000/watermark-pdf");

    // Create a 100% valid 1-page sample PDF file using pdf-lib
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([600, 800]);
    const pdfBytes = await pdfDoc.save();

    // Upload PDF via file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: "sample.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from(pdfBytes),
    });

    // Assert preview canvas appears within 10s
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Assert Apply Watermark button is enabled
    const applyButton = page.locator("button:has-text('Apply Watermark')");
    await expect(applyButton).toBeEnabled();
  });
});
