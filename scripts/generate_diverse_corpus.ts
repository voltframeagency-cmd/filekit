import * as fs from "fs";
import * as path from "path";
import { PDFDocument, rgb, degrees } from "pdf-lib";

const TARGET_DIR = path.join(__dirname, "../test-fixtures");
const SAMPLE_IMAGE_PATH = path.join(TARGET_DIR, "sample_photo.jpg");

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function main() {
  console.log("Generating diverse document corpus (10 distinct fixtures)...");

  // Read base image
  if (!fs.existsSync(SAMPLE_IMAGE_PATH)) {
    console.error("Base sample_photo.jpg not found! Run generate_jpeg_fixtures.ts first.");
    process.exit(1);
  }
  const baseImgBytes = fs.readFileSync(SAMPLE_IMAGE_PATH);

  // 1. receipt_scan.pdf (Mobile-scanned receipt mockup: 1 page, text + image)
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage([400, 800]); // Tall and narrow receipt dimensions
    const img = await doc.embedJpg(baseImgBytes);
    // Draw receipt background and mock text
    page.drawRectangle({ x: 0, y: 0, width: 400, height: 800, color: rgb(0.98, 0.98, 0.95) });
    page.drawText("SUPERMARKET INC.", { x: 120, y: 750, size: 16 });
    page.drawText("123 Main Street, Cityville", { x: 110, y: 730, size: 10 });
    page.drawText("ITEMS PURCHASED:", { x: 30, y: 690, size: 12 });
    page.drawText("Apple (x5) ----------- $2.50", { x: 30, y: 660, size: 10 });
    page.drawText("Bread (x1) ----------- $1.80", { x: 30, y: 640, size: 10 });
    page.drawText("Milk (x2) ------------ $3.00", { x: 30, y: 620, size: 10 });
    page.drawText("TOTAL: --------------- $7.30", { x: 30, y: 590, size: 12 });
    // Embed receipt barcode or small scanned receipt image
    page.drawImage(img, { x: 50, y: 150, width: 300, height: 400 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "receipt_scan.pdf"), bytes);
    console.log("✓ Generated receipt_scan.pdf");
  }

  // 2. academic_paper.pdf (Academic article with layout + charts: 2 pages, multi-column text)
  {
    const doc = await PDFDocument.create();
    const page1 = doc.addPage([595, 842]); // A4
    const page2 = doc.addPage([595, 842]);
    const img = await doc.embedJpg(baseImgBytes);

    // Page 1: Title, Abstract, Columns
    page1.drawText("Deep Perceptual Optimization of Lossy Document Compression", { x: 50, y: 780, size: 16 });
    page1.drawText("Author: J. Smith et al.", { x: 50, y: 760, size: 10 });
    page1.drawText("Abstract: In this paper we describe browser-side Web Assembly routines...", { x: 50, y: 720, size: 10, maxWidth: 495 });
    page1.drawRectangle({ x: 50, y: 100, width: 230, height: 580, color: rgb(0.97, 0.97, 0.97) });
    page1.drawRectangle({ x: 315, y: 100, width: 230, height: 580, color: rgb(0.97, 0.97, 0.97) });
    page1.drawText("[COLUMN A TEXT AREA]", { x: 70, y: 650, size: 11 });
    page1.drawText("[COLUMN B TEXT AREA]", { x: 335, y: 650, size: 11 });

    // Page 2: Charts/Figures
    page2.drawText("Fig 1. Performance regression baseline of local downscaling passes", { x: 50, y: 780, size: 11 });
    page2.drawImage(img, { x: 50, y: 450, width: 495, height: 300 });
    page2.drawText("[RESULTS SECTION CONTINUED]", { x: 50, y: 400, size: 10 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "academic_paper.pdf"), bytes);
    console.log("✓ Generated academic_paper.pdf");
  }

  // 3. slide_deck.pdf (Slide deck: 3 landscape slides, slide backgrounds, large fonts)
  {
    const doc = await PDFDocument.create();
    const img = await doc.embedJpg(baseImgBytes);
    const slides = [
      { title: "FileKit Strategy & Vision", color: rgb(0.1, 0.2, 0.4) },
      { title: "Local Performance Heuristics", color: rgb(0.2, 0.4, 0.3) },
      { title: "Q3 Roadmap Metrics", color: rgb(0.5, 0.2, 0.2) }
    ];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const page = doc.addPage([792, 612]); // Letter landscape
      page.drawRectangle({ x: 0, y: 0, width: 792, height: 612, color: slide.color });
      page.drawText(slide.title, { x: 50, y: 500, size: 36, color: rgb(1, 1, 1) });
      page.drawText("Proprietary FileKit Data Presentation", { x: 50, y: 460, size: 14, color: rgb(0.9, 0.9, 0.9) });
      // Embed different visual crops
      page.drawImage(img, { x: 100, y: 100, width: 592, height: 300 });
    }
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "slide_deck.pdf"), bytes);
    console.log("✓ Generated slide_deck.pdf");
  }

  // 4. color_brochure.pdf (Mixed rich layout brochure: 1 page, background, shapes)
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage([600, 900]);
    const img = await doc.embedJpg(baseImgBytes);
    // Background gradient block simulation
    page.drawRectangle({ x: 0, y: 450, width: 600, height: 450, color: rgb(0.9, 0.4, 0.1) });
    page.drawRectangle({ x: 0, y: 0, width: 600, height: 450, color: rgb(0.1, 0.1, 0.1) });
    page.drawText("VISIT CLOUD KIT BROCHURE", { x: 50, y: 800, size: 28, color: rgb(1, 1, 1) });
    page.drawImage(img, { x: 50, y: 150, width: 500, height: 400 });
    page.drawText("Secure. Local-First. Private.", { x: 50, y: 100, size: 18, color: rgb(1, 1, 1) });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "color_brochure.pdf"), bytes);
    console.log("✓ Generated color_brochure.pdf");
  }

  // 5. screenshot_doc.pdf (Screenshot verification page: 1 page)
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage([800, 600]);
    const img = await doc.embedJpg(baseImgBytes);
    page.drawText("FileKit UI Test Verification Logs", { x: 50, y: 550, size: 14 });
    page.drawText("Below is the verified desktop checkout screen validation snapshot:", { x: 50, y: 530, size: 10 });
    page.drawImage(img, { x: 50, y: 100, width: 700, height: 400 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "screenshot_doc.pdf"), bytes);
    console.log("✓ Generated screenshot_doc.pdf");
  }

  // 6. grayscale_scan.pdf (Grayscale scan mock: 1 page)
  {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);
    const img = await doc.embedJpg(baseImgBytes); // Embed sample JPEG
    page.drawText("Grayscale Print Mockup", { x: 50, y: 800, size: 12 });
    page.drawImage(img, { x: 50, y: 200, width: 495, height: 500 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "grayscale_scan.pdf"), bytes);
    console.log("✓ Generated grayscale_scan.pdf");
  }

  // 7. mixed_pages.pdf (Text page + image page mixed document)
  {
    const doc = await PDFDocument.create();
    const page1 = doc.addPage([595, 842]);
    const page2 = doc.addPage([595, 842]);
    const img = await doc.embedJpg(baseImgBytes);
    page1.drawText("This page contains ONLY text and vector graphics to verify bypass rules.", { x: 50, y: 700, size: 12 });
    page1.drawCircle({ x: 300, y: 400, size: 100, color: rgb(0.8, 0.2, 0.2) });

    page2.drawText("This page contains an embedded JPEG photo:", { x: 50, y: 750, size: 12 });
    page2.drawImage(img, { x: 50, y: 200, width: 495, height: 500 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "mixed_pages.pdf"), bytes);
    console.log("✓ Generated mixed_pages.pdf");
  }

  // 8. rotated_images.pdf (Rotated page layouts and rotated image drawings)
  {
    const doc = await PDFDocument.create();
    const page1 = doc.addPage([595, 842]);
    const page2 = doc.addPage([595, 842]);
    const img = await doc.embedJpg(baseImgBytes);

    // Page 1 rotated page
    page1.setRotation(degrees(90));
    page1.drawText("Rotated Page 90 Degrees", { x: 50, y: 500, size: 16 });
    page1.drawImage(img, { x: 50, y: 50, width: 400, height: 400 });

    // Page 2: Rotated drawing
    page2.drawText("Page 2: Image drawn with 45 degree rotation", { x: 50, y: 750, size: 12 });
    page2.drawImage(img, { x: 100, y: 100, width: 300, height: 300, rotate: degrees(45) });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "rotated_images.pdf"), bytes);
    console.log("✓ Generated rotated_images.pdf");
  }

  // 9. duplicate_refs.pdf (Multiple pages referencing the same single image object)
  {
    const doc = await PDFDocument.create();
    // Embed the image EXACTLY ONCE
    const img = await doc.embedJpg(baseImgBytes);
    
    // Draw it on Page 1
    const p1 = doc.addPage([600, 600]);
    p1.drawText("Page 1 - referencing image ref #1", { x: 50, y: 550, size: 14 });
    p1.drawImage(img, { x: 50, y: 50, width: 500, height: 450 });

    // Draw it on Page 2
    const p2 = doc.addPage([600, 600]);
    p2.drawText("Page 2 - referencing same image ref #1", { x: 50, y: 550, size: 14 });
    p2.drawImage(img, { x: 50, y: 50, width: 500, height: 450 });

    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "duplicate_refs.pdf"), bytes);
    console.log("✓ Generated duplicate_refs.pdf");
  }

  // 10. multi_dpi_scan.pdf (Varying resolution embedded images mockup)
  {
    const doc = await PDFDocument.create();
    const img = await doc.embedJpg(baseImgBytes);
    const page = doc.addPage([800, 800]);
    page.drawText("Multiple DPI/Resolution Mockup", { x: 50, y: 750, size: 14 });
    // Render at high scaling (simulates low DPI)
    page.drawImage(img, { x: 50, y: 400, width: 700, height: 300 });
    // Render at low scaling (simulates high DPI)
    page.drawImage(img, { x: 50, y: 50, width: 250, height: 300 });
    const bytes = await doc.save();
    fs.writeFileSync(path.join(TARGET_DIR, "multi_dpi_scan.pdf"), bytes);
    console.log("✓ Generated multi_dpi_scan.pdf");
  }

  console.log("All 10 diverse corpus fixtures successfully generated.");
}

main().catch((err) => {
  console.error("Failed to generate diverse corpus:", err);
  process.exit(1);
});
