import { WorkspaceState } from "@/hooks/useWorkspaceState";

export interface CapabilityInput {
  file: File;
  pages?: number;
  isPasswordProtected?: boolean;
  isCorrupted?: boolean;
  requestedOperation: string;
}

export class FileCapabilityRouter {
  static evaluate(input: CapabilityInput): WorkspaceState {
    const { file, pages = 24, isPasswordProtected = false, isCorrupted = false, requestedOperation } = input;

    // 1. Inspect file extension and MIME type
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return "UNSUPPORTED";
    }

    // 2. Readability/corruption check
    if (isCorrupted) {
      return "FAILED";
    }

    // 3. Password protection check
    if (isPasswordProtected) {
      return "FAILED"; // Or custom warning state in future
    }

    // 4. File size thresholds
    const ONE_MB = 1024 * 1024;
    const fileSizeMB = file.size / ONE_MB;

    // Web Worker support check
    const hasWebWorker = typeof window !== "undefined" && typeof window.Worker !== "undefined";

    // Estimate decoded memory: ~3MB per page average for rendering canvas memory + file buffer
    const estimatedMemoryMB = pages * 3 + fileSizeMB;

    // Simulate browser capability check (standard threshold for local WebAssembly/JS memory limits is ~512MB)
    const browserMemoryLimitMB = typeof navigator !== "undefined" && (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory * 1024 * 0.1 // 10% of total system RAM
      : 512;

    // Capability Decision Routing logic
    if (fileSizeMB > 100 || estimatedMemoryMB > browserMemoryLimitMB) {
      // Too large for safe local browser memory processing
      return "SERVER_REQUIRED";
    }

    if (fileSizeMB > 50 || !hasWebWorker) {
      // Local processing possible but slow, or lacking Web Worker offloading
      return "SERVER_RECOMMENDED";
    }

    if (pages > 50) {
      // High page count might lag UI thread slightly
      return "LOCAL_WITH_WARNING";
    }

    return "LOCAL_SAFE";
  }
}
