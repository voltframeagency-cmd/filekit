import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";

self.onmessage = async (e: MessageEvent) => {
  const { action, buffer, scale, quality } = e.data;
  if (action !== "compress") return;

  try {
    const doc = await PDFDocument.load(buffer);
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

          if ((!filter || isDCT) && (!colorSpace || isRGB)) {
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

                const newStream = doc.context.flateStream(compressedBytes, {
                  Type: PDFName.of("XObject"),
                  Subtype: PDFName.of("Image"),
                  Width: width,
                  Height: height,
                  BitsPerComponent: 8,
                  ColorSpace: PDFName.of("DeviceRGB"),
                  Filter: PDFName.of("DCTDecode")
                });
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

    // Strip metadata lossless strip optimization pass
    doc.catalog.delete(PDFName.of("Metadata"));
    const outputBytes = await doc.save({ useObjectStreams: true });

    // Post back success response with transferable buffer
    self.postMessage({
      status: "success",
      buffer: outputBytes.buffer,
      replacedCount
    }, [outputBytes.buffer]);

  } catch (err: any) {
    self.postMessage({
      status: "error",
      errorMsg: err.message
    });
  }
};
export {};
