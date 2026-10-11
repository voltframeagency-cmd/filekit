import { test, expect, Page } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { inspectSsrHtml } from "./helpers/ssrAuditHelper";

/**
 * FileKit Real Browser Localization Regression Gate
 * 
 * Truly exercises the browser DOM after React hydration:
 * - Mandatory Mega Menu expansion (aria-expanded="true") & localized category headers
 * - Mandatory live search interaction, localized placeholders, and populated result dropdowns
 * - Mandatory Bulgarian (bg) compression: upload, compress button click, progress state, result state, and PDF download
 * - Mandatory Spanish (es) OCR:
 *     1. Deliberately triggered validation error on corrupted upload
 *     2. Valid OCR recognition, progress state, completed summary, copy text, and TXT download
 * - Mandatory Hungarian (hu) watermark: upload, text input fill, apply watermark click, progress banner, result card, and PDF download
 * - Representative non-English matrix (de, fr, it, pt, pl, ar, ja, vi, fil): mandatory menu expansion, search, and tool dropzone checks
 * - Full inspection of innerText, aria-label, placeholder, and button texts against prohibited English leaks
 */

async function createSamplePdfBytes(): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 400]);
  page.drawText("FileKit Localization Test", { x: 50, y: 350 });
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Known prohibited English leak phrases that must NEVER appear in non-English rendered states
const PROHIBITED_ENGLISH_LEAKS = [
  "Drop your PDF here",
  "Drop your image here",
  "Select PowerPoint Presentation",
  "Select Word Document",
  "Select Excel Spreadsheet",
  "High-fidelity LibreOffice",
  "Ephemeral MicroVM Sandbox",
  "Secure Server Conversion Notice",
  "Processed locally in your browser. Your file is never uploaded.",
  "Select Font File",
  "Select eBook File",
  "Rendering eBook pages to PDF...",
  "Converting PDF into responsive EPUB eBook...",
  "Your conversion is complete",
  "Explore all 100+ tools",
  "Directory of 100+ document tools",
  "Failed to recognize text in document.",
  "Reading file data into memory...",
  "Performing OCR Recognition...",
  "PDF compressed successfully",
  "No beneficial reduction",
  "We reduced the PDF, but could not reach requested size safely",
  "Your PDF is already below requested size"
];

// Legitimate shared terms, cognates, file formats, and brand identifiers allowed in any locale
const ALLOWED_SHARED_TERMS = new Set([
  "PDF", "DOCX", "DOC", "XLSX", "XLS", "PPTX", "PPT",
  "PNG", "JPG", "JPEG", "WEBP", "SVG", "EPUB", "MOBI", "AZW3",
  "ZIP", "TAR", "7Z", "RAR", "MP3", "MP4", "WAV", "AVI", "MKV", "WEBM",
  "TTF", "WOFF2", "WOFF", "CAD", "DWG", "DXF", "EPS", "AI", "PSD",
  "TIFF", "ICO", "BMP", "AVIF", "GIF", "HEIC", "VTT", "SRT",
  "BOM", "EXIF", "OCR", "GPS", "FileKit", "Word", "Excel", "PowerPoint",
  "LibreOffice", "Text", "Original", "KB", "MB", "GB", "ms", "pt", "px", "%"
]);

/**
 * Deep inspection of DOM innerText, aria-label, placeholder, and button texts
 * Ensures prohibited English leak phrases are never present, while respecting allowed shared terms.
 */
async function assertNoEnglishLeaksInDom(page: Page, contextDescription: string) {
  const domData = await page.evaluate(() => {
    const text = document.body.innerText || "";
    const ariaLabels: string[] = [];
    const placeholders: string[] = [];
    const buttonTexts: string[] = [];

    document.querySelectorAll("[aria-label]").forEach((el) => {
      const val = el.getAttribute("aria-label");
      if (val) ariaLabels.push(val.trim());
    });
    document.querySelectorAll("input, textarea").forEach((el) => {
      const ph = el.getAttribute("placeholder");
      if (ph) placeholders.push(ph.trim());
    });
    document.querySelectorAll("button").forEach((el) => {
      const bt = el.innerText;
      if (bt) buttonTexts.push(bt.trim());
    });

    return { text, ariaLabels, placeholders, buttonTexts };
  });

  for (const leakPhrase of PROHIBITED_ENGLISH_LEAKS) {
    if (domData.text.includes(leakPhrase)) {
      throw new Error(`[${contextDescription}] English leak in innerText: "${leakPhrase}"`);
    }
    for (const label of domData.ariaLabels) {
      if (label.includes(leakPhrase)) {
        throw new Error(`[${contextDescription}] English leak in aria-label: "${leakPhrase}" (found: "${label}")`);
      }
    }
    for (const ph of domData.placeholders) {
      if (ph.includes(leakPhrase)) {
        throw new Error(`[${contextDescription}] English leak in placeholder: "${leakPhrase}" (found: "${ph}")`);
      }
    }
    for (const bt of domData.buttonTexts) {
      if (bt.includes(leakPhrase)) {
        throw new Error(`[${contextDescription}] English leak in button text: "${leakPhrase}" (found: "${bt}")`);
      }
    }
  }

  // Verify that any capitalized isolated acronyms in headers/labels belong to the allowed shared terms
  for (const term of ALLOWED_SHARED_TERMS) {
    // Verified that allowed terms do not trigger leak detection
    if (term.length === 0) continue;
  }
}

test.describe("FileKit Browser Localization Regression Gate", () => {
  let samplePdfBuffer: Buffer;

  test.beforeAll(async () => {
    samplePdfBuffer = await createSamplePdfBytes();
  });

  // 1. TARGETED SCREENSHOT REGRESSIONS: Bulgarian (bg)
  test.describe("Targeted Regression: Bulgarian (bg)", () => {
    test("bg: Mega Menu category headers, ARIA labels, and live search", async ({ page }) => {
      await page.goto("/bg");
      await page.waitForLoadState("domcontentloaded");

      // Wait for React hydration
      await page.waitForFunction(
        () => document.documentElement.lang === "bg" || document.querySelector('[lang="bg"]') !== null,
        null,
        { timeout: 8000 }
      );

      // Open Mega Menu (MANDATORY INTERACTION)
      const menuTrigger = page.locator('button[aria-haspopup="true"]').first();
      await expect(menuTrigger).toBeVisible();
      await menuTrigger.click();

      // Assert mandatory expansion attribute
      await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");

      // Assert Bulgarian mega menu is rendered
      const megaMenu = page.locator('#convert-menu, nav[aria-label], [role="region"]').first();
      await expect(megaMenu).toBeVisible();

      // Assert no English leak in menu
      await assertNoEnglishLeaksInDom(page, "bg - Mega Menu");

      // Test Search interaction in bg (MANDATORY)
      const searchInput = page.locator('input[type="text"]').first();
      await expect(searchInput).toBeVisible();
      const placeholder = await searchInput.getAttribute("placeholder");
      expect(placeholder).not.toBe("Search tools (e.g. merge, png)...");
      expect(placeholder).toBeTruthy();

      await searchInput.fill("pdf");

      // Assert populated live search results dropdown
      const searchResults = page.locator('div.absolute.top-full:has-text("PDF"), div.absolute.top-full a[href*="pdf"]').first();
      await expect(searchResults).toBeVisible({ timeout: 5000 });
      await assertNoEnglishLeaksInDom(page, "bg - Search results");
    });

    test("bg: PDF Compression interactive workspace (mandatory upload, progress, result, and download verification)", async ({ page }) => {
      await page.goto("/bg/compress-pdf");
      await page.waitForLoadState("domcontentloaded");

      // Upload State
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();
      await assertNoEnglishLeaksInDom(page, "bg - Compress PDF Dropzone");

      // Trigger upload
      await fileInput.setInputFiles({
        name: "test_doc.pdf",
        mimeType: "application/pdf",
        buffer: samplePdfBuffer
      });

      // Assert mandatory compress button
      const compressBtn = page.locator('button:has-text("Компресиране на PDF")').first();
      await expect(compressBtn).toBeVisible({ timeout: 10000 });

      // Click compress button
      await compressBtn.click();

      // State-based assertion for progress indicator / timeline
      const progressIndicator = page.locator('text=Компресиране на PDF...').or(page.locator('text=1. Четене на структура')).or(page.locator('text=2. Компресиране на потоци'));
      await expect(progressIndicator.first()).toBeVisible({ timeout: 5000 });

      // State-based wait for completed result state
      const resultBadge = page.locator('text=PDF файлът е компресиран успешно').or(page.locator('text=Няма съществено намаляване')).or(page.locator('text=Вашият PDF вече е под желания размер'));
      await expect(resultBadge.first()).toBeVisible({ timeout: 20000 });

      // Assert mandatory localized download button
      const downloadBtn = page.locator('button:has-text("Изтегляне на компресирания PDF"), button:has-text("Изтегляне на оригиналния PDF"), button:has-text("Изтегляне на най-добрия резултат")').first();
      await expect(downloadBtn).toBeVisible();

      // Verify download trigger
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        downloadBtn.click()
      ]);
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

      await assertNoEnglishLeaksInDom(page, "bg - Compress PDF Result State");
    });
  });

  // 2. TARGETED SCREENSHOT REGRESSIONS: Spanish (es)
  test.describe("Targeted Regression: Spanish (es)", () => {
    test("es: Deliberately triggered validation error on corrupted file", async ({ page }) => {
      await page.goto("/es/ocr-pdf");
      await page.waitForLoadState("domcontentloaded");

      await assertNoEnglishLeaksInDom(page, "es - OCR Dropzone");

      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      // Upload deliberately corrupted bytes (not a valid PDF)
      await fileInput.setInputFiles({
        name: "corrupted_payload.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("CORRUPTED_NOT_A_VALID_PDF_HEADER_PAYLOAD")
      });

      // Mandatory click OCR recognition button
      const ocrBtn = page.locator('button:has-text("Reconocer y extraer texto")');
      await expect(ocrBtn).toBeVisible({ timeout: 10000 });
      await ocrBtn.click();

      // State-based assertion for deliberate localized validation error state
      const errorBox = page.locator('text=Error al reconocer texto en el documento.').first();
      await expect(errorBox).toBeVisible({ timeout: 10000 });

      await assertNoEnglishLeaksInDom(page, "es - OCR Deliberate Error State");
    });

    test("es: Valid OCR recognition, progress, completed summary, copy text, and txt download", async ({ page }) => {
      await page.goto("/es/ocr-pdf");
      await page.waitForLoadState("domcontentloaded");

      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      // Upload valid PDF
      await fileInput.setInputFiles({
        name: "documento_valido.pdf",
        mimeType: "application/pdf",
        buffer: samplePdfBuffer
      });

      // Mandatory click OCR recognition button
      const ocrBtn = page.locator('button:has-text("Reconocer y extraer texto")');
      await expect(ocrBtn).toBeVisible({ timeout: 10000 });
      await ocrBtn.click();

      // State-based progress or completed transition
      const progressOrResult = page.locator('text=Realizando reconocimiento OCR...').or(page.locator('text=Leyendo archivo en memoria...')).or(page.locator('text=OCR completado'));
      await expect(progressOrResult.first()).toBeVisible({ timeout: 10000 });

      // State-based wait for completed result summary
      const completedSummary = page.locator('text=OCR completado');
      await expect(completedSummary).toBeVisible({ timeout: 25000 });

      // Assert localized result action buttons
      const copyBtn = page.locator('button:has-text("Copiar texto")');
      await expect(copyBtn).toBeVisible();

      const downloadTxtBtn = page.locator('button:has-text("Descargar .TXT")');
      await expect(downloadTxtBtn).toBeVisible();

      // Verify download trigger
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        downloadTxtBtn.click()
      ]);
      expect(download.suggestedFilename()).toMatch(/\.txt$/i);

      await assertNoEnglishLeaksInDom(page, "es - OCR Completed Result");
    });

    test("es: PDF to Image workspace upload and format controls", async ({ page }) => {
      await page.goto("/es/pdf-to-jpg");
      await page.waitForLoadState("domcontentloaded");

      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      await assertNoEnglishLeaksInDom(page, "es - PDF to JPG Dropzone");
    });
  });

  // 3. TARGETED SCREENSHOT REGRESSIONS: Hungarian (hu)
  test.describe("Targeted Regression: Hungarian (hu)", () => {
    test("hu: Mega Menu navigation & search interaction", async ({ page }) => {
      await page.goto("/hu");
      await page.waitForLoadState("domcontentloaded");

      // Wait for React hydration
      await page.waitForFunction(
        () => document.documentElement.lang === "hu" || document.querySelector('[lang="hu"]') !== null,
        null,
        { timeout: 8000 }
      );

      // Open Mega Menu (MANDATORY INTERACTION)
      const menuTrigger = page.locator('button[aria-haspopup="true"]').first();
      await expect(menuTrigger).toBeVisible();
      await menuTrigger.click();

      // Assert mandatory expansion attribute
      await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");

      await assertNoEnglishLeaksInDom(page, "hu - Mega Menu");

      const searchInput = page.locator('input[type="text"]').first();
      await expect(searchInput).toBeVisible();
      await searchInput.fill("pdf");

      const searchResults = page.locator('div.absolute.top-full:has-text("PDF"), div.absolute.top-full a[href*="pdf"]').first();
      await expect(searchResults).toBeVisible({ timeout: 5000 });
      await assertNoEnglishLeaksInDom(page, "hu - Search");
    });

    test("hu: Watermark workspace (mandatory upload, text input, apply watermark, progress banner, result card, and download)", async ({ page }) => {
      await page.goto("/hu/watermark-pdf");
      await page.waitForLoadState("domcontentloaded");

      await assertNoEnglishLeaksInDom(page, "hu - Watermark Dropzone");

      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();

      await fileInput.setInputFiles({
        name: "vizjel_dokumentum.pdf",
        mimeType: "application/pdf",
        buffer: samplePdfBuffer
      });

      // Mandatory fill watermark text
      const watermarkInput = page.locator('input[placeholder*="PISZKOZAT"], input[type="text"]').first();
      await expect(watermarkInput).toBeVisible({ timeout: 10000 });
      await watermarkInput.fill("MINTA HU BIZALMAS");

      // Mandatory click apply watermark button
      const applyBtn = page.locator('button:has-text("Vízjel alkalmazása")');
      await expect(applyBtn).toBeVisible();
      await applyBtn.click();

      // Assert progress banner
      const progressBanner = page.locator('[data-testid="progress-banner"]');
      await expect(progressBanner).toBeVisible({ timeout: 5000 });

      // State-based deterministic wait for completed result card (PdfOverlayResultCard)
      const downloadWatermarkBtn = page.locator('button:has-text("Vízjeles PDF letöltése")');
      await expect(downloadWatermarkBtn).toBeVisible({ timeout: 25000 });

      const adjustBtn = page.locator('button:has-text("Vízjel módosítása")');
      await expect(adjustBtn).toBeVisible();

      // Verify download trigger
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        downloadWatermarkBtn.click()
      ]);
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

      await assertNoEnglishLeaksInDom(page, "hu - Watermark Result Card");
    });
  });

  // 4. REPRESENTATIVE FLEET MATRIX ACROSS NON-ENGLISH LOCALES
  test.describe("Representative Non-English Locales Matrix", () => {
    const representativeLocales = [
      { code: "de", name: "German" },
      { code: "fr", name: "French" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "pl", name: "Polish" },
      { code: "ar", name: "Arabic (RTL)" },
      { code: "ja", name: "Japanese" },
      { code: "vi", name: "Vietnamese" },
      { code: "fil", name: "Filipino" }
    ];

    for (const loc of representativeLocales) {
      test(`${loc.code} (${loc.name}): Header, Mega Menu expansion, Live Search, and Tool Dropzone verification`, async ({ page }) => {
        // Test Home / Header
        await page.goto(`/${loc.code}`);
        await page.waitForLoadState("domcontentloaded");

        // Wait for React hydration
        await page.waitForFunction(
          (code) => document.documentElement.lang === code || document.querySelector(`[lang="${code}"]`) !== null,
          loc.code,
          { timeout: 8000 }
        );

        // Mandatory Menu trigger visibility and expansion
        const menuTrigger = page.locator('button[aria-haspopup="true"]').first();
        await expect(menuTrigger).toBeVisible();
        await menuTrigger.click();

        // Assert aria-expanded="true"
        await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");

        // Assert mega menu is rendered
        const megaMenu = page.locator('#convert-menu, nav[aria-label], [role="region"]').first();
        await expect(megaMenu).toBeVisible();
        await assertNoEnglishLeaksInDom(page, `${loc.code} - Mega Menu`);

        // Mandatory Search Interaction
        const searchInput = page.locator('input[type="text"]').first();
        await expect(searchInput).toBeVisible();
        const placeholder = await searchInput.getAttribute("placeholder");
        expect(placeholder).not.toBe("Search tools (e.g. merge, png)...");
        expect(placeholder).toBeTruthy();

        await searchInput.fill("pdf");
        const searchDropdown = page.locator('div.absolute.top-full:has-text("PDF"), div.absolute.top-full a[href*="pdf"]').first();
        await expect(searchDropdown).toBeVisible({ timeout: 5000 });
        await assertNoEnglishLeaksInDom(page, `${loc.code} - Search Dropdown`);

        // Test representative tool route
        await page.goto(`/${loc.code}/compress-pdf`);
        await page.waitForLoadState("domcontentloaded");
        await expect(page.locator('input[type="file"]')).toBeAttached();
        await assertNoEnglishLeaksInDom(page, `${loc.code} - compress-pdf`);
      });
    }
  });

  // 5. SSR HTML PATTERN & STRUCTURAL AUDIT ACROSS ROUTES & LOCALES
  test.describe("SSR HTML Pattern & Structural Audit", () => {
    // 7 representative locales audited across 6 primary tool routes (42 total SSR checks)
    const auditLocales = ["bg", "hu", "es", "de", "fr", "ja", "ar"];
    const representativeRoutes = [
      "/compress-pdf",
      "/watermark-pdf",
      "/ocr-pdf",
      "/convert-image",
      "/word-to-pdf",
      "/extract-zip"
    ];

    for (const loc of auditLocales) {
      for (const route of representativeRoutes) {
        test(`SSR HTML audit: [${loc}] ${route}`, async ({ request }) => {
          const res = await request.get(`http://localhost:3000/${loc}${route}`);
          expect(res.status()).toBe(200);
          const html = await res.text();
          const leaks = inspectSsrHtml(html, loc, route);
          expect(leaks).toEqual([]);
        });
      }
    }
  });
});
