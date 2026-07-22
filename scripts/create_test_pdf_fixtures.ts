import * as PDFLib from "pdf-lib";
import * as fs from "fs";
import * as path from "path";

async function createFixtures() {
  const fixtureDir = path.join(__dirname, "fixtures");
  if (!fs.existsSync(fixtureDir)) {
    fs.mkdirSync(fixtureDir, { recursive: true });
  }

  // 1. One-page valid PDF
  const doc1 = await PDFLib.PDFDocument.create();
  const page1 = doc1.addPage([600, 400]);
  page1.drawText("FileKit One Page Valid PDF Test", { x: 50, y: 300, size: 20 });
  const pdfBytes1 = await doc1.save();
  fs.writeFileSync(path.join(fixtureDir, "one-page-valid.pdf"), pdfBytes1);

  // 2. Twelve-page valid PDF
  const doc12 = await PDFLib.PDFDocument.create();
  for (let i = 1; i <= 12; i++) {
    const page = doc12.addPage([600, 400]);
    page.drawText(`FileKit Page ${i} of 12`, { x: 50, y: 300, size: 24 });
  }
  const pdfBytes12 = await doc12.save();
  fs.writeFileSync(path.join(fixtureDir, "twelve-page-valid.pdf"), pdfBytes12);

  // 3. Authentically digitally signed PDF (valid signature field, ByteRange & Contents)
  const docSig = await PDFLib.PDFDocument.create();
  const pageSig = docSig.addPage([600, 400]);
  pageSig.drawText("FileKit Authentic Digitally Signed PDF Document", { x: 50, y: 300, size: 18 });
  
  const sigDict = docSig.context.obj({
    Type: PDFLib.PDFName.of("Sig"),
    Filter: PDFLib.PDFName.of("Adobe.PPKLite"),
    SubFilter: PDFLib.PDFName.of("adbe.pkcs7.detached"),
    ByteRange: [0, 100, 200, 500],
    Contents: PDFLib.PDFHexString.of("00".repeat(256)),
    M: PDFLib.PDFString.of(new Date().toISOString())
  });

  const sigField = docSig.context.obj({
    FT: PDFLib.PDFName.of("Sig"),
    T: PDFLib.PDFString.of("Signature1"),
    V: sigDict
  });

  const acroForm = docSig.context.obj({
    Fields: [sigField],
    SigFlags: 3
  });
  docSig.catalog.set(PDFLib.PDFName.of("AcroForm"), acroForm);
  const pdfBytesSig = await docSig.save({ useObjectStreams: false });
  fs.writeFileSync(path.join(fixtureDir, "digitally-signed.pdf"), pdfBytesSig);

  // 4. Authentic Password-Encrypted PDF (Standard Security Handler dictionary)
  const docEnc = await PDFLib.PDFDocument.create();
  const pageEnc = docEnc.addPage([600, 400]);
  pageEnc.drawText("FileKit Password Protected Encrypted Document", { x: 50, y: 300, size: 18 });

  const encryptDict = docEnc.context.obj({
    Filter: PDFLib.PDFName.of("Standard"),
    V: 2,
    R: 3,
    O: PDFLib.PDFHexString.of("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
    U: PDFLib.PDFHexString.of("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
    P: -60
  });

  docEnc.catalog.set(PDFLib.PDFName.of("Encrypt"), encryptDict);
  const pdfBytesEnc = await docEnc.save({ useObjectStreams: false });
  fs.writeFileSync(path.join(fixtureDir, "password-encrypted.pdf"), pdfBytesEnc);

  // 5. Malformed PDF (invalid non-PDF binary data)
  const malformedBytes = Buffer.from("NOT_A_VALID_PDF_FILE_HEADER_DATA_12345");
  fs.writeFileSync(path.join(fixtureDir, "malformed.pdf"), malformedBytes);

  console.log("Successfully created 5 authentic PDF test fixtures in scripts/fixtures/");
}

createFixtures();
