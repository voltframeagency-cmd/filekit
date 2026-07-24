import { executePdfWatermark } from "./PdfOverlayEngine";
import { WorkerRequestMessage, WorkerResponseMessage } from "./types";

ctxWorkerInit();

function ctxWorkerInit() {
  if (typeof self === "undefined") return;

  self.onmessage = async (e: MessageEvent<WorkerRequestMessage>) => {
    const msg = e.data;
    if (msg.type === "START_OVERLAY") {
      try {
        const { sourceBuffer, config, fileName } = msg.payload;
        const sourceBytes = new Uint8Array(sourceBuffer);

        const artifact = await executePdfWatermark(
          sourceBytes,
          config,
          fileName,
          (progress) => {
            const progressResp: WorkerResponseMessage = {
              type: "PROGRESS",
              payload: progress,
            };
            self.postMessage(progressResp);
          }
        );

        const successResp: WorkerResponseMessage = {
          type: "SUCCESS",
          payload: { artifact },
        };

        // Transfer output ArrayBuffer back to main thread
        const transferableBuffer = artifact.fileData.buffer as ArrayBuffer;
        self.postMessage(successResp, [transferableBuffer]);
      } catch (err: any) {
        const errorResp: WorkerResponseMessage = {
          type: "ERROR",
          payload: { error: err.message || String(err) },
        };
        self.postMessage(errorResp);
      }
    }
  };
}
