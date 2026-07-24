import assert from "assert";
import { PDFDocument } from "pdf-lib";
import {
  bulkDelete,
  bulkRotate,
  generateInitialPageItems,
  invertSelection,
  parsePageRangeString,
  reorderPages,
  restoreDeletedPages,
  rotateEvenPages,
  rotateOddPages,
  rotatePage,
  setAllSelected,
  sortPagesByFileName,
  toggleDeletePage,
  toggleSelectPage,
} from "../pageOperations";
import { preflightPdfDocuments } from "../PdfPageEditorPreflight";
import { executePdfPageEditor } from "../PdfPageEditorEngine";
import { verifyPdfEditorOutput } from "../outputVerification";

async function createTestPdfBuffer(pageCount: number): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([595, 842]); // A4
  }
  return await doc.save();
}

async function runPdfEditorTests() {
  console.log("▶ Running Production-Hardened PDF Page Editor Unit & Integration Tests...\n");
  let assertions = 0;

  // Test 1: Page operations pure state helpers
  {
    const initial = generateInitialPageItems(0, 4, "b_file.pdf");
    assert.strictEqual(initial.length, 4);
    assert.strictEqual(initial[0].originalPageIndex, 0);
    assert.strictEqual(initial[0].sourceFileName, "b_file.pdf");
    assertions += 3;

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

    // Rotate Odd Pages (1-indexed pages 1 and 3 -> indices 0 and 2)
    const oddRotated = rotateOddPages(initial, "cw");
    assert.strictEqual(oddRotated[0].currentRotation, 90);
    assert.strictEqual(oddRotated[1].currentRotation, 0);
    assert.strictEqual(oddRotated[2].currentRotation, 90);
    assert.strictEqual(oddRotated[3].currentRotation, 0);
    assertions += 4;

    // Rotate Even Pages (1-indexed pages 2 and 4 -> indices 1 and 3)
    const evenRotated = rotateEvenPages(initial, "cw");
    assert.strictEqual(evenRotated[0].currentRotation, 0);
    assert.strictEqual(evenRotated[1].currentRotation, 90);
    assert.strictEqual(evenRotated[2].currentRotation, 0);
    assert.strictEqual(evenRotated[3].currentRotation, 90);
    assertions += 4;

    // Filename Sorting
    const itemsA = generateInitialPageItems(0, 2, "z_doc.pdf");
    const itemsB = generateInitialPageItems(1, 2, "a_doc.pdf");
    const unsorted = [...itemsA, ...itemsB];
    const sorted = sortPagesByFileName(unsorted);
    assert.strictEqual(sorted[0].sourceFileName, "a_doc.pdf");
    assert.strictEqual(sorted[2].sourceFileName, "z_doc.pdf");
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

    const preflight = await preflightPdfDocuments([
      { name: "doc1.pdf", buffer: pdfBuffer1 },
      { name: "doc2.pdf", buffer: pdfBuffer2 },
    ]);
    assert.strictEqual(preflight.isValid, true);
    assert.strictEqual(preflight.totalPages, 5);
    assert.strictEqual(preflight.documentsCount, 2);
    assert.strictEqual(preflight.pageItems.length, 5);
    assert.strictEqual(preflight.signatureDetected, false);
    assertions += 5;
  }

  // Test 3: Engine execution — Merge & Rotate
  {
    const pdf1 = await createTestPdfBuffer(2);
    const pdf2 = await createTestPdfBuffer(3);

    const items1 = generateInitialPageItems(0, 2, "pdf1.pdf");
    const items2 = generateInitialPageItems(1, 3, "pdf2.pdf");
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
    assert.strictEqual(result.verification.pdfLibReloadVerified, true);
    assert.strictEqual(result.fileName, "merged.pdf");
    assertions += 5;
  }

  // Test 4: Engine execution — Split Every Page
  {
    const pdf = await createTestPdfBuffer(4);
    const items = generateInitialPageItems(0, 4, "split_source.pdf");

    const result = await executePdfPageEditor(
      [pdf],
      items,
      { targetRoute: "/split-pdf", splitMode: "every-page" }
    );

    assert.strictEqual(result.pageCount, 4);
    assert.strictEqual(result.verification.isValid, true);
    assert.strictEqual(result.splitArtifacts?.length, 4);
    assert.strictEqual(result.splitArtifacts?.[0].pageCount, 1);
    assertions += 4;
  }

  // Test 5: Output Verification Error Handling
  {
    const invalidBuffer = new Uint8Array([0x00, 0x00, 0x00]);
    const verification = await verifyPdfEditorOutput(invalidBuffer, 1);
    assert.strictEqual(verification.isValid, false);
    assert.strictEqual(verification.magicBytesValid, false);
    assertions += 2;
  }

  console.log(`\n✅ All ${assertions} production-hardening assertions passed cleanly in run_tests.ts!`);
}

runPdfEditorTests().catch((err) => {
  console.error("❌ PDF Page Editor Unit Test Failure:", err);
  process.exit(1);
});
