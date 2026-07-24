import assert from "assert";
import fs from "fs";
import path from "path";

async function runPdfAidFidelityTest() {
  console.log("▶ Running PDFAid 84-Route Source Fidelity Audit Assertion...\n");

  const docPath = path.join(
    process.cwd(),
    "docs/research/competitors/filekit-route-portfolio-and-engine-architecture.md"
  );

  const docContent = fs.readFileSync(docPath, "utf-8");

  // Extract Document A section
  const docAStart = docContent.indexOf("## 📁 DOCUMENT A: Observed PDFAid 84-Route Inventory");
  const docBStart = docContent.indexOf("## 🏛️ DOCUMENT B: FileKit Normalized Route Portfolio");

  assert.ok(docAStart !== -1, "Document A section must exist");
  assert.ok(docBStart !== -1, "Document B section must exist");

  const docAText = docContent.slice(docAStart, docBStart);

  // Count categories in Document A table
  const lines = docAText.split("\n");
  const tableRows = lines.filter((l) => l.trim().startsWith("| **") && l.includes("|"));

  let fromPdfCount = 0;
  let toPdfCount = 0;
  let convertImageCount = 0;
  let editPdfCount = 0;

  for (const row of tableRows) {
    const cols = row.split("|").map((c) => c.trim());
    if (cols.length >= 4) {
      const category = cols[3];
      if (category === "From PDF") fromPdfCount++;
      if (category === "To PDF") toPdfCount++;
      if (category === "Convert Image") convertImageCount++;
      if (category === "Edit PDF") editPdfCount++;
    }
  }

  const totalObserved = fromPdfCount + toPdfCount + convertImageCount + editPdfCount;

  console.log(`Document A Observed Categories:`);
  console.log(`- From PDF: ${fromPdfCount} (expected 24)`);
  console.log(`- To PDF: ${toPdfCount} (expected 24)`);
  console.log(`- Convert Image: ${convertImageCount} (expected 24)`);
  console.log(`- Edit PDF: ${editPdfCount} (expected 12)`);
  console.log(`- Total Observed Routes: ${totalObserved} (expected 84)`);

  assert.strictEqual(fromPdfCount, 24, "From PDF category count must be exactly 24");
  assert.strictEqual(toPdfCount, 24, "To PDF category count must be exactly 24");
  assert.strictEqual(convertImageCount, 24, "Convert Image category count must be exactly 24");
  assert.strictEqual(editPdfCount, 12, "Edit PDF category count must be exactly 12");
  assert.strictEqual(totalObserved, 84, "Total Document A routes must be exactly 84");

  console.log("\n✅ PDFAid 84-Route Source Fidelity Assertion passed cleanly!");
}

runPdfAidFidelityTest().catch((err) => {
  console.error("❌ PDFAid Source Fidelity Test Failure:", err);
  process.exit(1);
});
