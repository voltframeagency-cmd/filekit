import assert from "assert";
import { PDFDocument, degrees } from "pdf-lib";
import {
  bulkDelete,
  bulkRotate,
  generateInitialPageItems,
  invertSelection,
  parsePageRangeString,
  reorderPages,
  restoreDeletedPages,
  rotatePage,
  setAllSelected,
  toggleDeletePage,
  toggleSelectPage,
} from "../pageOperations";
import { preflightPdfDocuments } from "../PdfPageEditorPreflight";
import { executePdfPageEditor } from "../PdfPageEditorEngine";
import { verifyPdfEditorOutput } from "../outputVerification";
import { PageOperationItem } from "../types";

async function createTestPdfBuffer(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([595, 842]); // A4
  }
  return await doc.save();
}

async function runPdfEditorTests() {
  console.log("▶ Running PDF Page Editor & Organization Unit Tests...\n");
  let assertions = 0;

  // Test 1: Page operations pure state helpers
  {
    const initial = generateInitialPageItems(0, 4);
    assert.strictEqual(initial.length, 4);
    assert.strictEqual(initial[0].originalPageIndex, 0);
    assertions += 2;

    // Reorder
    const reordered = reorderPages(initial, 0, 2);
    assert.strictEqual(reordered[2].originalPageIndex, 0);
    assert.strictEqual(reordered[0].originalPageIndex, 1);
    assertions += 2;

    // Rotate single
    const rotated = rotatePage(initial, initial[0].id, "cw");
    assert.strictEqual(rotated[0].currentRotation, 90);
    assert.strictEqual(rotated[1].currentRotation, 0);
    assertions += 2;

    // Toggle delete
    const deleted = toggleDeletePage(initial, initial[1].id);
    assert.strictEqual(deleted[1].isDeleted, true);
    assert.strictEqual(deleted[0].isDeleted, false);
    assertions += 2;

    // Page range parser
    const parsedRange = parsePageRangeString("1-3, 5", 10);
    assert.deepStrictEqual(parsedRange, [0, 1, 2, 4]);
    assertions++;
  }

  // Test 2: Preflight validation
  {
    const pdfBuffer1 = await createTestPdfBuffer(3);
    const pdfBuffer2 = await createTestPdfBuffer(2);

    const preflight = await preflightPdfDocuments([pdfBuffer1, pdfBuffer2]);
    assert.strictEqual(preflight.isValid, true);
    assert.strictEqual(preflight.totalPages, 5);
    assert.strictEqual(preflight.documentsCount, 2);
    assert.strictEqual(preflight.pageItems.length, 5);
    assertions += 4;
  }

  // Test 3: Engine execution — Merge & Rotate
  {
    const pdf1 = await createTestPdfBuffer(2);
    const pdf2 = await createTestPdfBuffer(3);

    const items1 = generateInitialPageItems(0, 2);
    const items2 = generateInitialPageItems(1, 3);
    const allItems = [...items1, ...items2];

    // Rotate 1st page by 90deg
    allItems[0].currentRotation = 90;

    const result = await executePdfPageEditor(
      [pdf1, pdf2],
      allItems,
      { targetRoute: "/merge-pdf", outputFilename: "merged.pdf" }
    );

    assert.strictEqual(result.pageCount, 5);
    assert.strictEqual(result.verification.isValid, true);
    assert.strictEqual(result.verification.magicBytesValid, true);
    assert.strictEqual(result.fileName, "merged.pdf");
    assertions += 4;
  }

  // Test 4: Engine execution — Delete & Reorder
  {
    const pdf = await createTestPdfBuffer(4);
    let items = generateInitialPageItems(0, 4);

    // Delete page 2 (index 1)
    items[1].isDeleted = true;
    // Reorder page 4 to first
    items = reorderPages(items, 3, 0);

    const activeCount = items.filter((it) => !it.isDeleted).length;
    assert.strictEqual(activeCount, 3);
    assertions++;

    const result = await executePdfPageEditor(
      [pdf],
      items,
      { targetRoute: "/delete-pdf-pages", outputFilename: "edited.pdf" }
    );

    assert.strictEqual(result.pageCount, 3);
    assert.strictEqual(result.verification.isValid, true);
    assertions += 2;
  }

  // Test 5: Output Verification Error Handling
  {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00]);
    const verification = await verifyPdfEditorOutput(invalidBuffer, 1);
    assert.strictEqual(verification.isValid, false);
    assert.strictEqual(verification.magicBytesValid, false);
    assertions += 2;
  }

  console.log(`\n✅ All ${assertions} assertions passed cleanly in run_tests.ts!`);
}

runPdfEditorTests().catch((err) => {
  console.error("❌ PDF Page Editor Unit Test Failure:", err);
  process.exit(1);
});
