import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  const pagesData = [
    { title: 'FileKit Verification Page 1 - Alpha Architecture', body: 'This is the first page of the verified multipage document testing text stream integrity.' },
    { title: 'FileKit Verification Page 2 - Beta Processing Protocol', body: 'This is the second page of the verified multipage document testing deterministic retention.' },
    { title: 'FileKit Verification Page 3 - Gamma Privacy Boundary', body: 'This is the third page of the verified multipage document testing client-side privacy guarantees.' }
  ];

  for (const item of pagesData) {
    const page = doc.addPage([595.28, 841.89]); // A4
    page.drawText(item.title, {
      x: 50,
      y: 750,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    page.drawText(item.body, {
      x: 50,
      y: 700,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3)
    });
  }

  const pdfBytes = await doc.save();
  const targetPath = path.join(process.cwd(), 'test-fixtures', 'text_multipage.pdf');
  fs.writeFileSync(targetPath, pdfBytes);
  console.log(`✓ Generated valid multipage PDF at ${targetPath} (${pdfBytes.length} bytes, 3 pages)`);
}

generate().catch(err => {
  console.error('Failed to generate fixture:', err);
  process.exit(1);
});
