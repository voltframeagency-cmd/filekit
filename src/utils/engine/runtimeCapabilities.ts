import { LocalPdfRuntimeCapabilities } from "./types";

let cachedCapabilities: LocalPdfRuntimeCapabilities | null = null;

export interface RuntimeCapabilityService {
  detect(): Promise<LocalPdfRuntimeCapabilities>;
  getCached(): LocalPdfRuntimeCapabilities | null;
  invalidate(): void;
}

export const testPdfWorkerBoot = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (typeof Worker === "undefined") return resolve(false);
      const w = new Worker(new URL("./pdf.worker.ts", import.meta.url));
      const timer = setTimeout(() => {
        w.terminate();
        resolve(false);
      }, 2000);

      w.onmessage = (e) => {
        clearTimeout(timer);
        w.terminate();
        resolve(e.data && e.data.status === "CAPABILITY_READY");
      };

      w.onerror = () => {
        clearTimeout(timer);
        w.terminate();
        resolve(false);
      };

      w.postMessage({ action: "CAPABILITY_PROBE" });
    } catch {
      resolve(false);
    }
  });
};

export const detectCapabilities = async (): Promise<LocalPdfRuntimeCapabilities> => {
  if (cachedCapabilities) {
    return cachedCapabilities;
  }

  if (typeof window === "undefined") {
    return {
      worker: false,
      offscreenCanvas: false,
      createImageBitmap: false,
      canvasJpegEncoding: false,
      transferableArrayBuffer: false,
      pdfWorkerBoot: false
    };
  }

  const worker = typeof Worker !== "undefined";
  const offscreenCanvas = typeof OffscreenCanvas !== "undefined";
  const cib = typeof window.createImageBitmap !== "undefined";
  const transferableArrayBuffer = typeof ArrayBuffer !== "undefined" && typeof MessageChannel !== "undefined";

  let canvasJpegEncoding = false;
  try {
    if (offscreenCanvas) {
      const oc = new OffscreenCanvas(1, 1);
      if ((oc as any).convertToBlob) {
        canvasJpegEncoding = true;
      }
    }
  } catch {}

  const pdfWorkerBoot = await testPdfWorkerBoot();

  const caps: LocalPdfRuntimeCapabilities = {
    worker,
    offscreenCanvas,
    createImageBitmap: cib,
    canvasJpegEncoding,
    transferableArrayBuffer,
    pdfWorkerBoot
  };

  cachedCapabilities = caps;
  return caps;
};

export const runtimeCapabilityService: RuntimeCapabilityService = {
  detect: detectCapabilities,
  getCached: () => cachedCapabilities,
  invalidate: () => {
    cachedCapabilities = null;
  }
};
