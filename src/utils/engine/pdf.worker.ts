import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";

self.onmessage = async (e: MessageEvent) => {
  const { action, buffer, scale, quality } = e.data;
  if (action === "CAPABILITY_PROBE") {
    const isGenuineWorker = typeof window === "undefined" && typeof self !== "undefined";
    (self as any).postMessage({
      status: "CAPABILITY_READY",
      pdfWorkerBoot: true,
      workerConfirmed: isGenuineWorker
    });
    return;
  }
  if (action !== "compress") return;

  try {
    const t0 = performance.now();
    const doc = await PDFDocument.load(buffer);
    const t1 = performance.now();
    
    const objects = doc.context.enumerateIndirectObjects();
    let replacedCount = 0;

    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        const subtype = dict.get(PDFName.of("Subtype"));
        if (subtype === PDFName.of("Image")) {
          const filter = dict.get(PDFName.of("Filter"));
          const colorSpace = dict.get(PDFName.of("ColorSpace"));

          const isDCT = filter === PDFName.of("DCTDecode");
          const isRGB = colorSpace === PDFName.of("DeviceRGB");
          const isGray = colorSpace === PDFName.of("DeviceGray");

          if ((!filter || isDCT) && (!colorSpace || isRGB || isGray)) {
            try {
              const rawBytes = obj.contents;
              const blob = new Blob([rawBytes as any], { type: "image/jpeg" });
              const bitmap = await createImageBitmap(blob);

              const width = Math.round(bitmap.width * scale);
              const height = Math.round(bitmap.height * scale);
              const canvas = new OffscreenCanvas(width, height);
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0, width, height);
                const compressedBlob = await canvas.convertToBlob({
                  type: "image/jpeg",
                  quality: quality
                });
                const compressedBytes = new Uint8Array(await compressedBlob.arrayBuffer());

                const imgDict = doc.context.obj({
                  Type: PDFName.of("XObject"),
                  Subtype: PDFName.of("Image"),
                  Width: width,
                  Height: height,
                  BitsPerComponent: 8,
                  ColorSpace: colorSpace || PDFName.of("DeviceRGB"),
                  Filter: PDFName.of("DCTDecode")
                });
                const newStream = PDFRawStream.of(imgDict, compressedBytes);
                doc.context.assign(ref, newStream);
                replacedCount++;
              }
              bitmap.close();
            } catch (imgErr) {
              // Ignore single XObject compression failure to prevent crashing entire document process
            }
          }
        }
      }
    }

    const t2 = performance.now();

    // Strip metadata lossless strip optimization pass
    doc.catalog.delete(PDFName.of("Metadata"));
    const outputBytes = await doc.save({ useObjectStreams: true });
    const t3 = performance.now();

    const isGenuineWorker = typeof window === "undefined" && typeof self !== "undefined";

    // Post back success response with transferable buffer
    (self as any).postMessage({
      status: "success",
      buffer: outputBytes.buffer,
      replacedCount,
      workerConfirmed: isGenuineWorker,
      timingLoadMs: Math.round(t1 - t0),
      timingCompressMs: Math.round(t2 - t1),
      timingSaveMs: Math.round(t3 - t2)
    }, [outputBytes.buffer]);

  } catch (err: any) {
    (self as any).postMessage({
      status: "error",
      errorMsg: err.message,
      workerConfirmed: typeof window === "undefined"
    });
  }
};
export {};
