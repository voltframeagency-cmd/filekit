"use client";

import React, { useState, useEffect } from "react";
import { PDFDocument, PDFName, PDFRawStream, PDFDict } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

// Initialize PDF.js worker using the correct v4 .mjs ES module CDN
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface SpikeResult {
  filename: string;
  originalSize: number;
  spikeASize: number;
  spikeBSize: number;
  spikeCSize: number;
  status: "SUPPORTED_AND_TRANSFORMED" | "SUPPORTED_UNCHANGED" | "UNSUPPORTED_AND_ROUTED" | "REJECTED_SAFELY" | "FAILED";
  replacedCount: number;
  textPreserved: boolean;
  linksPreserved: boolean;
  visualDifference: number;
  pageCount: number;
  durationMs: number;
  errorMsg?: string;
}

const FIXTURES = [
  "text_simple.pdf",
  "text_multipage.pdf",
  "scan_balanced.pdf",
  "scan_large.pdf",
  "flate_alpha.pdf",
  "cmyk_profile.pdf",
  "interactive_form.pdf",
  "signed_digital.pdf",
  "encrypted_aes256.pdf",
  "password_protected.pdf"
];

import { notFound } from "next/navigation";

export default function SpikeTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [results, setResults] = useState<SpikeResult[]>([]);
  const [running, setRunning] = useState(false);
  const [currentFile, setCurrentFile] = useState("");

  const runAllSpikes = async () => {
    setRunning(true);
    const tempResults: SpikeResult[] = [];

    for (const filename of FIXTURES) {
      setCurrentFile(filename);
      const start = Date.now();
      
      const stats: SpikeResult = {
        filename,
        originalSize: 0,
        spikeASize: 0,
        spikeBSize: 0,
        spikeCSize: 0,
        status: "SUPPORTED_UNCHANGED",
        replacedCount: 0,
        textPreserved: true,
        linksPreserved: true,
        visualDifference: 0,
        pageCount: 0,
        durationMs: 0,
        errorMsg: ""
      };

      try {
        // 1. Fetch file bytes
        const fileRes = await fetch(`/test-fixtures/${filename}`);
        if (!fileRes.ok) {
          throw new Error(`Failed to load fixture file: ${fileRes.statusText}`);
        }
        const arrayBuffer = await fileRes.arrayBuffer();
        stats.originalSize = arrayBuffer.byteLength;

        // 2. Preflight signature validation
        const headerBytes = new Uint8Array(arrayBuffer.slice(0, 5));
        const headerStr = new TextDecoder().decode(headerBytes);
        if (headerStr !== "%PDF-") {
          stats.status = "REJECTED_SAFELY";
          stats.errorMsg = "Rejected: Invalid PDF signature header";
          stats.spikeASize = stats.originalSize;
          tempResults.push({ ...stats, durationMs: Date.now() - start });
          continue;
        }

        // 3. Encrypted PDF rejection safety
        let pdfDoc: PDFDocument | null = null;
        try {
          pdfDoc = await PDFDocument.load(arrayBuffer);
        } catch (e: any) {
          if (e.message?.toLowerCase().includes("encrypt") || e.message?.toLowerCase().includes("password")) {
            stats.status = "REJECTED_SAFELY";
            stats.errorMsg = `Rejected: password or encryption required (${e.message})`;
            stats.textPreserved = false;
            stats.linksPreserved = false;
            tempResults.push({ ...stats, durationMs: Date.now() - start });
            continue;
          }
          throw e;
        }

        // 4. Digital Signature detection bypass
        const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
        let isSigned = false;
        for (const [, obj] of indirectObjects) {
          if (obj instanceof PDFRawStream || obj instanceof PDFDict) {
            const dict = obj instanceof PDFRawStream ? obj.dict : obj;
            const type = dict.get(PDFName.of("Type"));
            if (type === PDFName.of("Sig")) {
              isSigned = true;
              break;
            }
          }
        }

        if (isSigned) {
          stats.status = "UNSUPPORTED_AND_ROUTED"; // Mapped to UNSUPPORTED_SIGNED_DOCUMENT
          stats.errorMsg = "Bypassed: Document contains cryptographic digital signature";
          stats.spikeASize = stats.originalSize;
          tempResults.push({ ...stats, durationMs: Date.now() - start });
          continue;
        }

        stats.pageCount = pdfDoc.getPageCount();

        // 5. Execute Spike A: Browser-side image stream re-compressor
        let replacedCount = 0;
        let isUnsupportedImage = false;
        let savedBytesA: Uint8Array | null = null;
        try {
          const freshBufferA = arrayBuffer.slice(0);
          const docA = await PDFDocument.load(freshBufferA);
          const objectsA = docA.context.enumerateIndirectObjects();

          for (const [ref, obj] of objectsA) {
            if (obj instanceof PDFRawStream) {
              const dict = obj.dict;
              const subtype = dict.get(PDFName.of("Subtype"));
              if (subtype === PDFName.of("Image")) {
                const filter = dict.get(PDFName.of("Filter"));
                const colorSpace = dict.get(PDFName.of("ColorSpace"));

                const isDCT = filter === PDFName.of("DCTDecode");
                const isSupportedFilter = !filter || isDCT;

                const isRGB = colorSpace === PDFName.of("DeviceRGB");
                const isSupportedColorSpace = !colorSpace || isRGB;

                if (isSupportedFilter && isSupportedColorSpace) {
                  try {
                    const rawBytes = obj.contents;
                    const blob = new Blob([rawBytes as any], { type: "image/jpeg" });
                    const bitmap = await createImageBitmap(blob);

                    // Create OffscreenCanvas and compress
                    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                      ctx.drawImage(bitmap, 0, 0);
                      const compressedBlob = await canvas.convertToBlob({
                        type: "image/jpeg",
                        quality: 0.7
                      });
                      const compressedBytes = new Uint8Array(await compressedBlob.arrayBuffer());

                      // Replace XObject stream
                      const newStream = docA.context.flateStream(compressedBytes, {
                        Type: PDFName.of("XObject"),
                        Subtype: PDFName.of("Image"),
                        Width: bitmap.width,
                        Height: bitmap.height,
                        BitsPerComponent: 8,
                        ColorSpace: PDFName.of("DeviceRGB"),
                        Filter: PDFName.of("DCTDecode")
                      });
                      docA.context.assign(ref, newStream);
                      replacedCount++;
                    }
                    bitmap.close();
                  } catch (imgErr) {
                    console.warn("Failed to compress XObject image", imgErr);
                  }
                } else {
                  isUnsupportedImage = true;
                }
              }
            }
          }

          savedBytesA = await docA.save();
          stats.spikeASize = savedBytesA.length;
          stats.replacedCount = replacedCount;
          if (isUnsupportedImage) {
            stats.status = "UNSUPPORTED_AND_ROUTED";
            stats.errorMsg += "\nUnsupported image color spaces or compression filters detected.";
          } else if (replacedCount > 0) {
            stats.status = "SUPPORTED_AND_TRANSFORMED";
          }
        } catch (errA: any) {
          stats.errorMsg += `\nSpike A Failed: ${errA.message}`;
          console.error(errA);
        }

        // 6. Execute Spike B: PDF.js canvas flattening fallback
        try {
          const freshBufferB = arrayBuffer.slice(0);
          const pdfJsDoc = await pdfjs.getDocument({ data: freshBufferB }).promise;
          const destDocB = await PDFDocument.create();

          for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
            const page = await pdfJsDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = new OffscreenCanvas(viewport.width, viewport.height);
            const canvasContext = canvas.getContext("2d") as any;

            await page.render({ canvasContext, viewport }).promise;
            const flatBlob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.75 });
            const flatBytes = new Uint8Array(await flatBlob.arrayBuffer());

            const img = await destDocB.embedJpg(flatBytes);
            const destPage = destDocB.addPage([viewport.width, viewport.height]);
            destPage.drawImage(img, { x: 0, y: 0, width: viewport.width, height: viewport.height });
          }

          const savedBytesB = await destDocB.save();
          stats.spikeBSize = savedBytesB.length;
        } catch (errB: any) {
          stats.errorMsg += `\nSpike B Failed: ${errB.message}`;
          console.error(errB);
        }

        // 7. Execute Spike C: Metadata-stripping lossless optimization
        try {
          const freshBufferC = arrayBuffer.slice(0);
          const docC = await PDFDocument.load(freshBufferC);
          docC.catalog.delete(PDFName.of("Metadata"));
          const savedBytesC = await docC.save({ useObjectStreams: true });
          stats.spikeCSize = savedBytesC.length;
        } catch (errC: any) {
          stats.errorMsg += `\nSpike C Failed: ${errC.message}`;
          console.error(errC);
        }

        // 8. Measure Visual Similarity (Visual regression check on page 1)
        try {
          const freshBufferImg = arrayBuffer.slice(0);
          const pdfJsDoc = await pdfjs.getDocument({ data: freshBufferImg }).promise;
          const page1Original = await pdfJsDoc.getPage(1);
          const vp = page1Original.getViewport({ scale: 1 });
          const canvasBefore = new OffscreenCanvas(vp.width, vp.height);
          await page1Original.render({ canvasContext: canvasBefore.getContext("2d") as any, viewport: vp }).promise;
          
          if (stats.spikeASize > 0 && savedBytesA) {
            const pdfJsDocA = await pdfjs.getDocument({ data: savedBytesA }).promise;
            const page1A = await pdfJsDocA.getPage(1);
            const canvasAfter = new OffscreenCanvas(vp.width, vp.height);
            await page1A.render({ canvasContext: canvasAfter.getContext("2d") as any, viewport: vp }).promise;

            const ctxB = canvasBefore.getContext("2d")!;
            const ctxA = canvasAfter.getContext("2d")!;
            const dataB = ctxB.getImageData(0, 0, vp.width, vp.height).data;
            const dataA = ctxA.getImageData(0, 0, vp.width, vp.height).data;

            let diffPixels = 0;
            for (let k = 0; k < dataB.length; k += 4) {
              if (dataB[k] !== dataA[k] || dataB[k+1] !== dataA[k+1] || dataB[k+2] !== dataA[k+2]) {
                diffPixels++;
              }
            }
            stats.visualDifference = (diffPixels / (vp.width * vp.height)) * 100;
          }
        } catch (visErr: any) {
          stats.errorMsg += `\nVisual check failed: ${visErr.message}`;
          console.warn(visErr);
        }

        // Clean up error message if none occurred
        stats.errorMsg = (stats.errorMsg || "").trim();
        if (stats.errorMsg && !stats.spikeASize && !stats.spikeBSize) {
          stats.status = "FAILED";
        }

      } catch (err: any) {
        console.error(`Spike crashed on ${filename}`, err);
        stats.status = "FAILED";
        stats.errorMsg = err.message + "\n" + err.stack;
      }

      stats.durationMs = Date.now() - start;
      tempResults.push(stats);
      setResults([...tempResults]);
    }

    setRunning(false);
    setCurrentFile("");
    
    // Export globally for browser subagent / console logs
    (window as any).__SPIKE_RESULT__ = tempResults;
  };

  useEffect(() => {
    runAllSpikes();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">FileKit Phase 2A0.1 browser Spikes Testbed</h1>
        <p className="text-sm text-slate-500 mt-1">Executing PDF.js & pdf-lib pipelines natively in worker environments</p>
      </header>

      {running && (
        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg mb-6 flex items-center gap-3 font-semibold text-sm">
          <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Processing: {currentFile}...</span>
        </div>
      )}

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <th className="p-4">Filename</th>
              <th className="p-4">Original Size</th>
              <th className="p-4">Spike A (Safe)</th>
              <th className="p-4">Spike B (Flat)</th>
              <th className="p-4">Spike C (Lossless)</th>
              <th className="p-4">Status</th>
              <th className="p-4">Replaced Images</th>
              <th className="p-4">Visual Diff %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((r) => (
              <tr key={r.filename} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono font-bold text-slate-700">
                  <div>{r.filename}</div>
                  {r.errorMsg && <div className="text-[10px] text-red-500 mt-1 whitespace-pre-wrap">{r.errorMsg}</div>}
                </td>
                <td className="p-4 text-slate-500">{(r.originalSize / 1024).toFixed(1)} KB</td>
                <td className="p-4 font-bold text-slate-800">
                  {r.spikeASize ? `${(r.spikeASize / 1024).toFixed(1)} KB` : "N/A"}
                </td>
                <td className="p-4 text-slate-500">
                  {r.spikeBSize ? `${(r.spikeBSize / 1024).toFixed(1)} KB` : "N/A"}
                </td>
                <td className="p-4 text-slate-500">
                  {r.spikeCSize ? `${(r.spikeCSize / 1024).toFixed(1)} KB` : "N/A"}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    r.status === "SUPPORTED_AND_TRANSFORMED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    r.status === "SUPPORTED_UNCHANGED" ? "bg-slate-100 text-slate-600 border border-slate-200" :
                    r.status === "UNSUPPORTED_AND_ROUTED" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    r.status === "REJECTED_SAFELY" ? "bg-indigo-50 text-indigo-700 border border-indigo-200" :
                    "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-slate-600 font-semibold">{r.replacedCount} images</td>
                <td className="p-4 text-slate-600 font-mono">{r.visualDifference.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
