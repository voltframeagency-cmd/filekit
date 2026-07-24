import assert from "assert";
import fs from "fs";
import path from "path";

export interface PdfAidRouteExpectation {
  label: string;
  category: "From PDF" | "To PDF" | "Convert Image" | "Edit PDF";
}

export const EXPECTED_PDFAID_ROUTES: readonly PdfAidRouteExpectation[] = [
  // From PDF (24)
  { label: "PDF to Word", category: "From PDF" },
  { label: "PDF to Excel", category: "From PDF" },
  { label: "PDF to PPTX", category: "From PDF" },
  { label: "PDF to DXF", category: "From PDF" },
  { label: "PDF to JPG", category: "From PDF" },
  { label: "PDF to EPUB", category: "From PDF" },
  { label: "PDF to SVG", category: "From PDF" },
  { label: "PDF to TXT", category: "From PDF" },
  { label: "PDF to JPEG", category: "From PDF" },
  { label: "PDF to HTML", category: "From PDF" },
  { label: "PDF to Image", category: "From PDF" },
  { label: "PDF to PNG", category: "From PDF" },
  { label: "PDF to Pages", category: "From PDF" },
  { label: "PDF to Picture", category: "From PDF" },
  { label: "PDF to TIFF", category: "From PDF" },
  { label: "PDF to EPS", category: "From PDF" },
  { label: "PDF to PSD", category: "From PDF" },
  { label: "PDF to XLS", category: "From PDF" },
  { label: "PDF to XLSX", category: "From PDF" },
  { label: "PDF to MOBI", category: "From PDF" },
  { label: "PDF to BMP", category: "From PDF" },
  { label: "PDF to RTF", category: "From PDF" },
  { label: "PDF to GIF", category: "From PDF" },
  { label: "PDF to AZW3", category: "From PDF" },

  // To PDF (24)
  { label: "Image to PDF", category: "To PDF" },
  { label: "Word to PDF", category: "To PDF" },
  { label: "DWG to PDF", category: "To PDF" },
  { label: "Excel to PDF", category: "To PDF" },
  { label: "HTML to PDF", category: "To PDF" },
  { label: "PowerPoint to PDF", category: "To PDF" },
  { label: "ODT to PDF", category: "To PDF" },
  { label: "EPUB to PDF", category: "To PDF" },
  { label: "Pages to PDF", category: "To PDF" },
  { label: "HWP to PDF", category: "To PDF" },
  { label: "HEIC to PDF", category: "To PDF" },
  { label: "PPTX to PDF", category: "To PDF" },
  { label: "WPS to PDF", category: "To PDF" },
  { label: "CSV to PDF", category: "To PDF" },
  { label: "TXT to PDF", category: "To PDF" },
  { label: "PPT to PDF", category: "To PDF" },
  { label: "TIFF to PDF", category: "To PDF" },
  { label: "AI to PDF", category: "To PDF" },
  { label: "RTF to PDF", category: "To PDF" },
  { label: "MD to PDF", category: "To PDF" },
  { label: "SVG to PDF", category: "To PDF" },
  { label: "PUB to PDF", category: "To PDF" },
  { label: "DXF to PDF", category: "To PDF" },
  { label: "CDR to PDF", category: "To PDF" },

  // Convert Image (24)
  { label: "Image to JPG", category: "Convert Image" },
  { label: "Image to Word", category: "Convert Image" },
  { label: "HEIC to JPG", category: "Convert Image" },
  { label: "JPEG to EPS", category: "Convert Image" },
  { label: "PNG to EPS", category: "Convert Image" },
  { label: "Video to GIF", category: "Convert Image" },
  { label: "PNG to JPG", category: "Convert Image" },
  { label: "JPG to PNG", category: "Convert Image" },
  { label: "MP4 to GIF", category: "Convert Image" },
  { label: "PNG to ICO", category: "Convert Image" },
  { label: "Image to PNG", category: "Convert Image" },
  { label: "Image to Excel", category: "Convert Image" },
  { label: "Image to SVG", category: "Convert Image" },
  { label: "WEBP to JPG", category: "Convert Image" },
  { label: "Image to GIF", category: "Convert Image" },
  { label: "JPEG to PNG", category: "Convert Image" },
  { label: "SVG to PNG", category: "Convert Image" },
  { label: "JFIF to JPG", category: "Convert Image" },
  { label: "AVIF to JPG", category: "Convert Image" },
  { label: "DOCX to JPG", category: "Convert Image" },
  { label: "SVG to DXF", category: "Convert Image" },
  { label: "EPS to SVG", category: "Convert Image" },
  { label: "HTML to JPG", category: "Convert Image" },
  { label: "Word to JPG", category: "Convert Image" },

  // Edit PDF (12)
  { label: "Edit PDF", category: "Edit PDF" },
  { label: "Sign PDF", category: "Edit PDF" },
  { label: "Rotate PDF", category: "Edit PDF" },
  { label: "Merge PDF", category: "Edit PDF" },
  { label: "Split PDF", category: "Edit PDF" },
  { label: "Crop PDF", category: "Edit PDF" },
  { label: "Add watermark", category: "Edit PDF" },
  { label: "Add image to PDF", category: "Edit PDF" },
  { label: "Compress image", category: "Edit PDF" },
  { label: "Compress PDF", category: "Edit PDF" },
  { label: "Delete pages", category: "Edit PDF" },
  { label: "OCR PDF", category: "Edit PDF" },
] as const;

async function runPdfAidFidelityTest() {
  console.log("▶ Running Exact PDFAid 84-Route Identity & Ordering Assertion...\n");

  const docPath = path.join(
    process.cwd(),
    "docs/research/competitors/filekit-route-portfolio-and-engine-architecture.md"
  );

  const docContent = fs.readFileSync(docPath, "utf-8");

  // Extract Document A section only
  const docAStart = docContent.indexOf("## 📁 DOCUMENT A: Observed PDFAid 84-Route Inventory");
  const docBStart = docContent.indexOf("## 🏛️ DOCUMENT B: FileKit Normalized Route Portfolio");

  assert.ok(docAStart !== -1, "Document A section must exist");
  assert.ok(docBStart !== -1, "Document B section must exist");

  const docAText = docContent.slice(docAStart, docBStart);

  // Extract Markdown table rows from Document A
  const lines = docAText.split("\n");
  const tableRows = lines.filter((l) => l.trim().startsWith("| **") && l.includes("|"));

  const actualRoutes: PdfAidRouteExpectation[] = [];

  for (const row of tableRows) {
    const cols = row.split("|").map((c) => c.trim());
    if (cols.length >= 4) {
      const labelRaw = cols[2].replace(/\*\*/g, "").trim();
      const categoryRaw = cols[3].trim() as PdfAidRouteExpectation["category"];

      actualRoutes.push({
        label: labelRaw,
        category: categoryRaw,
      });
    }
  }

  // 1. Assert exact counts
  assert.strictEqual(actualRoutes.length, 84, `Actual route count must be 84 (got ${actualRoutes.length})`);
  assert.strictEqual(EXPECTED_PDFAID_ROUTES.length, 84, "Expected route array must be 84");

  // 2. Assert exact label & category ordering matching
  for (let i = 0; i < 84; i++) {
    const actual = actualRoutes[i];
    const expected = EXPECTED_PDFAID_ROUTES[i];
    assert.strictEqual(
      actual.label,
      expected.label,
      `Route label mismatch at index ${i + 1}: expected "${expected.label}", got "${actual.label}"`
    );
    assert.strictEqual(
      actual.category,
      expected.category,
      `Route category mismatch at index ${i + 1} ("${actual.label}"): expected "${expected.category}", got "${actual.category}"`
    );
  }

  // 3. Assert deep equality
  assert.deepStrictEqual(actualRoutes, EXPECTED_PDFAID_ROUTES, "Actual routes must deep equal EXPECTED_PDFAID_ROUTES");

  // 4. Assert no duplicate category:label pairs
  const uniqueKeys = new Set(actualRoutes.map((r) => `${r.category}:${r.label}`));
  assert.strictEqual(uniqueKeys.size, 84, "All 84 route keys must be unique");

  // 5. Negative Regression Fixture Assertions
  runNegativeRegressionFixtures();

  console.log(`Document A Verification Details:`);
  console.log(`✓ 84/84 exact route labels matched.`);
  console.log(`✓ 84/84 exact route categories matched.`);
  console.log(`✓ 84/84 exact sequence positions matched.`);
  console.log(`✓ 5 negative regression fixtures verified.`);

  console.log("\n✅ PDFAid 84-Route Exact Identity Assertion passed cleanly!");
}

function runNegativeRegressionFixtures() {
  const base = [...EXPECTED_PDFAID_ROUTES];

  // Fixture 1: Renamed route fails
  const renamed = [...base];
  renamed[0] = { label: "Fake Route", category: "From PDF" };
  assert.throws(
    () => assert.deepStrictEqual(renamed, EXPECTED_PDFAID_ROUTES),
    "Negative fixture 1 (renamed route) must fail deep assertion"
  );

  // Fixture 2: Duplicated route fails unique count
  const duplicated = [...base];
  duplicated[1] = { label: "PDF to Word", category: "From PDF" };
  const dupKeys = new Set(duplicated.map((r) => `${r.category}:${r.label}`));
  assert.notStrictEqual(dupKeys.size, 84, "Negative fixture 2 (duplicated route) must fail unique count");

  // Fixture 3: Swapped sequence positions fail
  const swapped = [...base];
  const tmp = swapped[0];
  swapped[0] = swapped[1];
  swapped[1] = tmp;
  assert.throws(
    () => assert.deepStrictEqual(swapped, EXPECTED_PDFAID_ROUTES),
    "Negative fixture 3 (swapped sequence) must fail deep assertion"
  );

  // Fixture 4: Swapped category fails
  const categoryShifted = [...base];
  categoryShifted[0] = { label: "PDF to Word", category: "To PDF" };
  assert.throws(
    () => assert.deepStrictEqual(categoryShifted, EXPECTED_PDFAID_ROUTES),
    "Negative fixture 4 (shifted category) must fail deep assertion"
  );

  // Fixture 5: Truncated count fails
  const truncated = base.slice(0, 83);
  assert.notStrictEqual(truncated.length, 84, "Negative fixture 5 (truncated count) must fail count assertion");
}

runPdfAidFidelityTest().catch((err) => {
  console.error("❌ PDFAid Exact Identity Assertion Failure:", err);
  process.exit(1);
});
