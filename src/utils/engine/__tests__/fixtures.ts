import { PDFDocument, rgb, degrees, PDFName } from "pdf-lib";

// Raw 1x1 Red pixel JPEG bytes
export const RED_PIXEL_JPG = new Uint8Array([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60,
  0x00, 0x60, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
  0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
  0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
  0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
  0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
  0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
  0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
  0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
  0x00, 0x37, 0xff, 0xd9
]);

// Raw 1x1 Red pixel PNG bytes (with alpha channel)
export const RED_PIXEL_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
  0x89, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb0, 0x00, 0x00, 0x00, 0x00, 0x4a, 0x45, 0x4e,
  0x44, 0xae, 0x42, 0x60, 0x82
]);

// 1. Text-Only PDF
export async function createTextOnlyPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  page.drawText("This is a simple text-only PDF file.", { x: 50, y: 350 });
  page.drawText("No images are embedded here.", { x: 50, y: 320 });
  return await doc.save();
}

// 2. Scanned Monochrome PDF (with CCITT/JBIG2 simulation)
export async function createScannedMonochromePdf(): Promise<Uint8Array> {
  // Hand-crafted minimal PDF containing a fake Group 4 / JBIG2 image dictionary
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im1 4 0 R >> >> /MediaBox [0 0 600 400] >>
endobj
4 0 obj
<< /Type /XObject /Subtype /Image /Width 100 /Height 100 /ColorSpace /DeviceGray /BitsPerComponent 1 /Filter /CCITTFaxDecode >>
stream
FakeMonochromeBitonalBytesGoHere010101
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 3. Scanned Color PDF (RGB + FlateDecode raw pixels)
export async function createScannedColorPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  // Embed a PNG that uses FlateDecode internally
  const pngImg = await doc.embedPng(RED_PIXEL_PNG);
  page.drawImage(pngImg, { x: 50, y: 50, width: 200, height: 200 });
  return await doc.save();
}

// 4. JPEG-Heavy PDF (DCTDecode)
export async function createJpegHeavyPdf(imageCount = 5): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  const jpegImg = await doc.embedJpg(RED_PIXEL_JPG);
  for (let i = 0; i < imageCount; i++) {
    page.drawImage(jpegImg, { x: 20 + i * 40, y: 200, width: 30, height: 30 });
  }
  return await doc.save();
}

// 5. PNG Transparency / SMask PDF
export async function createPngWithAlphaPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  const pngImg = await doc.embedPng(RED_PIXEL_PNG);
  page.drawImage(pngImg, { x: 100, y: 100, width: 100, height: 100 });
  return await doc.save();
}

// 6. CMYK JPEG PDF (DeviceCMYK color space)
export async function createCmykJpegPdf(): Promise<Uint8Array> {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im1 4 0 R >> >> /MediaBox [0 0 600 400] >>
endobj
4 0 obj
<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceCMYK /BitsPerComponent 8 /Filter /DCTDecode >>
stream
CMYKBytesDCT0101
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 7. JPEG 2000 PDF (JPXDecode)
export async function createJpxDecodePdf(): Promise<Uint8Array> {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im1 4 0 R >> >> /MediaBox [0 0 600 400] >>
endobj
4 0 obj
<< /Type /XObject /Subtype /Image /Width 100 /Height 100 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /JPXDecode >>
stream
JPXDecodeBytesGoHere0101
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 8. CCITT Fax PDF (Group 3/4 Fax encoding)
export async function createCcittFaxPdf(): Promise<Uint8Array> {
  return createScannedMonochromePdf(); // Reuses CCITTFaxDecode dictionary
}

// 9. Rotated Pages PDF
export async function createRotatedPagesPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page1 = doc.addPage([600, 400]);
  page1.setRotation(degrees(90));
  page1.drawText("Rotated 90 degrees.", { x: 50, y: 150 });
  const page2 = doc.addPage([600, 400]);
  page2.setRotation(degrees(180));
  page2.drawText("Rotated 180 degrees.", { x: 50, y: 150 });
  return await doc.save();
}

// 10. Annotations PDF
export async function createPdfWithAnnotations(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  page.drawText("This page contains an annotation link.", { x: 50, y: 300 });
  // Add a link annotation manually via pdf-lib low level context
  const linkAnnot = doc.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [50, 280, 200, 295],
    A: {
      Type: "Action",
      S: "URI",
      URI: "https://filekit.co",
    },
  });
  const linkRef = doc.context.register(linkAnnot);
  page.node.set(PDFName.of("Annots"), doc.context.obj([linkRef]));
  return await doc.save();
}

// 11. AcroForm PDF
export async function createAcroFormPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([600, 400]);
  page.drawText("Fill in the form text field:", { x: 50, y: 300 });
  const form = doc.getForm();
  const textField = form.createTextField("user_text_input");
  textField.setText("Initial Value");
  textField.addToPage(page, { x: 50, y: 250, width: 200, height: 24 });
  return await doc.save();
}

// 12. Hyperlinks PDF
export async function createHyperlinksPdf(): Promise<Uint8Array> {
  return createPdfWithAnnotations(); // Reuses link annotations
}

// 13. Digital Signature PDF
export async function createDigitalSignaturePdf(): Promise<Uint8Array> {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] >>
endobj
4 0 obj
<< /Type /Sig /Filter /Adobe.PPKLite /SubFilter /adbe.pkcs7.detached /Contents <00000000> /ByteRange [0 100 200 300] >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 14. Incremental Updates PDF
export async function createIncrementalUpdatesPdf(): Promise<Uint8Array> {
  // Hand-craft a PDF with multiple catalog references mimicking incremental edits
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] >>
endobj
trailer
<< /Root 1 0 R /Size 4 >>
startxref
116
%%EOF
1 0 obj
<< /Type /Catalog /Pages 2 0 R /Metadata 5 0 R >>
endobj
5 0 obj
<< /Type /Metadata /Subtype /XML >>
stream
<x:xmpmeta></x:xmpmeta>
endstream
endobj
trailer
<< /Root 1 0 R /Prev 116 /Size 6 >>
startxref
192
%%EOF`;
  return new TextEncoder().encode(content);
}

// 15. Object Streams PDF
export async function createObjectStreamsPdf(): Promise<Uint8Array> {
  // PDF with /ObjStm containing object streams
  const content = `%PDF-1.5
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] >>
endobj
4 0 obj
<< /Type /ObjStm /N 2 /First 12 >>
stream
5 0 6 12
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
<< /Type /FontDescriptor /FontName /Helvetica >>
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 16. Linearized PDF
export async function createLinearizedPdf(): Promise<Uint8Array> {
  const content = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Linearized 1 /L 25000 /H [ 600 120 ] /O 4 /E 1200 /N 1 /T 2432 >>
endobj
2 0 obj
<< /Type /Catalog /Pages 3 0 R >>
endobj
3 0 obj
<< /Type /Pages /Count 1 /Kids [ 4 0 R ] >>
endobj
4 0 obj
<< /Type /Page /Parent 3 0 R /MediaBox [0 0 600 400] >>
endobj
trailer
<< /Root 2 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

// 17. Malformed xref PDF
export async function createMalformedXrefPdf(): Promise<Uint8Array> {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] >>
endobj
xref
0 4
0000000000 65535 f
9999999999 00000 n
0000000078 00000 n
0000000150 00000 n
trailer
<< /Root 1 0 R >>
startxref
99999
%%EOF`;
  return new TextEncoder().encode(content);
}

// 18. Trailing bytes after EOF PDF
export async function createTrailingBytesPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.addPage([600, 400]);
  const normalBytes = await doc.save();
  const trailing = new TextEncoder().encode("\n\n%%Extra garbage bytes added at EOF\n\n");
  const merged = new Uint8Array(normalBytes.length + trailing.length);
  merged.set(normalBytes);
  merged.set(trailing, normalBytes.length);
  return merged;
}

// 19. Already Optimized PDF
export async function createAlreadyOptimizedPdf(): Promise<Uint8Array> {
  return await createTextOnlyPdf(); // Standard clean PDF has minimal objects and FlateDecode streams
}

// 20. One Giant Image PDF
export async function createGiantImagePdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([1000, 1000]);
  // Create a simulated larger image
  const size = 150;
  const largeJpg = new Uint8Array(size * size); // Fill dummy space
  largeJpg.fill(0x55);
  // Emulate by drawing a standard JPEG scaled very high
  const jpgImg = await doc.embedJpg(RED_PIXEL_JPG);
  page.drawImage(jpgImg, { x: 0, y: 0, width: 950, height: 950 });
  return await doc.save();
}

// 21. High Page Count PDF (Stress test 50 pages)
export async function createHighPageCountPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < 50; i++) {
    const page = doc.addPage([600, 400]);
    page.drawText(`This is stress-test page ${i + 1}`, { x: 50, y: 200 });
  }
  return await doc.save();
}

// 22. Output larger than input PDF
export async function createLargerOutputPdf(): Promise<Uint8Array> {
  return await createTextOnlyPdf(); // Text-only is already optimized, resizing or compressing adds overhead
}

// 23. Target impossible PDF
export async function createTargetImpossiblePdf(): Promise<Uint8Array> {
  return await createTextOnlyPdf(); // With no images to shrink, achieving aggressive size targets is impossible
}

export function createMockEncryptedPdf(): Uint8Array {
  const content = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 400] >>
endobj
trailer
<< /Root 1 0 R /Encrypt 4 0 R >>
%%EOF`;
  return new TextEncoder().encode(content);
}

export function createMockCorruptPdf(): Uint8Array {
  return new TextEncoder().encode("Not a PDF file at all! Random garbage noise.");
}

// 24. Genuine Encrypted PDF (Throws EncryptedPDFError)
export function createEncryptedPdfFixture(): Uint8Array {
  return createMockEncryptedPdf();
}

// 25. Password Protected PDF (Throws EncryptedPDFError)
export function createPasswordProtectedPdf(): Uint8Array {
  return createMockEncryptedPdf();
}

// 26. Corrupt PDF
export function createCorruptPdf(): Uint8Array {
  return createMockCorruptPdf();
}

// Full 26-fixture map getter
export async function generateTestCorpus(): Promise<Record<string, Uint8Array>> {
  return {
    "text_only.pdf": await createTextOnlyPdf(),
    "scanned_monochrome.pdf": await createScannedMonochromePdf(),
    "scanned_color.pdf": await createScannedColorPdf(),
    "jpeg_heavy.pdf": await createJpegHeavyPdf(),
    "png_transparency.pdf": await createPngWithAlphaPdf(),
    "cmyk_jpeg.pdf": await createCmykJpegPdf(),
    "jpx_decode.pdf": await createJpxDecodePdf(),
    "ccitt_fax.pdf": await createCcittFaxPdf(),
    "rotated_pages.pdf": await createRotatedPagesPdf(),
    "annotations.pdf": await createPdfWithAnnotations(),
    "acroform.pdf": await createAcroFormPdf(),
    "hyperlinks.pdf": await createHyperlinksPdf(),
    "digital_signature.pdf": await createDigitalSignaturePdf(),
    "incremental_updates.pdf": await createIncrementalUpdatesPdf(),
    "object_streams.pdf": await createObjectStreamsPdf(),
    "linearized.pdf": await createLinearizedPdf(),
    "malformed_xref.pdf": await createMalformedXrefPdf(),
    "trailing_bytes.pdf": await createTrailingBytesPdf(),
    "already_optimized.pdf": await createAlreadyOptimizedPdf(),
    "giant_image.pdf": await createGiantImagePdf(),
    "high_page_count.pdf": await createHighPageCountPdf(),
    "larger_output.pdf": await createLargerOutputPdf(),
    "target_impossible.pdf": await createTargetImpossiblePdf(),
    "encrypted.pdf": createEncryptedPdfFixture(),
    "password_protected.pdf": createPasswordProtectedPdf(),
    "corrupt.pdf": createCorruptPdf()
  };
}
