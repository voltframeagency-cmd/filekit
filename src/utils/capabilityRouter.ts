import { WorkspaceState } from "@/utils/engine/types";

export interface CapabilityInput {
  file: File;
  pages?: number;
  isPasswordProtected?: boolean;
  isCorrupted?: boolean;
  requestedOperation: string;
  hasPdfSignature?: boolean;
  estimatedDecodedMemoryMB?: number;
  browserMemoryClassGB?: number; // navigator.deviceMemory or estimate
  hasWebWorker?: boolean;
  hasWasmSupport?: boolean;
  priorLocalFailureCount?: number;
}

export interface RouterThresholds {
  maxLocalFileSizeMB: number;
  recommendedLocalFileSizeMB: number;
  maxLocalPageCount: number;
  warningPageCount: number;
  minMemoryClassGB: number;
  requireWasm: boolean;
  requireWorker: boolean;
}

// Configurable thresholds matching system constraints
export const DEFAULT_THRESHOLDS: RouterThresholds = {
  maxLocalFileSizeMB: 100,
  recommendedLocalFileSizeMB: 50,
  maxLocalPageCount: 500,
  warningPageCount: 50,
  minMemoryClassGB: 4,
  requireWasm: true,
  requireWorker: true,
};

export class FileCapabilityRouter {
  private static thresholds: RouterThresholds = DEFAULT_THRESHOLDS;

  static configure(customThresholds: Partial<RouterThresholds>) {
    this.thresholds = { ...this.thresholds, ...customThresholds };
  }

  static getThresholds(): RouterThresholds {
    return this.thresholds;
  }

  static evaluate(input: CapabilityInput): WorkspaceState {
    const {
      file,
      pages = 24,
      isPasswordProtected = false,
      isCorrupted = false,
      requestedOperation,
      hasPdfSignature = true,
      estimatedDecodedMemoryMB,
      browserMemoryClassGB = 4,
      hasWebWorker = typeof window !== "undefined" && typeof window.Worker !== "undefined",
      hasWasmSupport = typeof window !== "undefined" && typeof (window as any).WebAssembly !== "undefined",
      priorLocalFailureCount = 0,
    } = input;

    const t = this.thresholds;

    // 1. MIME and Extension Verification
    const isPdfExtension = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdfExtension) {
      return "UNSUPPORTED";
    }

    // 2. Check mock filename routes for visual testing
    const fileNameLower = file.name.toLowerCase();
    if (fileNameLower.includes("server-req")) {
      return "SERVER_REQUIRED";
    }
    if (fileNameLower.includes("server-rec")) {
      return "SERVER_RECOMMENDED";
    }

    // 3. Signature & Parser Verification
    if (!hasPdfSignature || isCorrupted) {
      return "UNSUPPORTED"; // Or FAILED/UNSUPPORTED depending on policy
    }

    // 4. Security Check (Encryption / Password protection)
    if (isPasswordProtected) {
      // Password protected files cannot be parsed locally without user inputting password
      return "UNSUPPORTED";
    }

    // 5. Check operations requirements
    if (requestedOperation !== "compress") {
      return "UNSUPPORTED";
    }

    // 6. Check environment capability (WASM and Worker requirements)
    if (t.requireWasm && !hasWasmSupport) {
      return "SERVER_REQUIRED"; // Missing WASM fallback to server processing
    }
    if (t.requireWorker && !hasWebWorker) {
      return "SERVER_RECOMMENDED"; // Lack of multi-threading makes local operation slow
    }

    // 7. Decoded Memory Estimation & Browser Memory limits
    const ONE_MB = 1024 * 1024;
    const fileSizeMB = file.size / ONE_MB;
    const estMemoryMB = estimatedDecodedMemoryMB ?? (pages * 3.5 + fileSizeMB);

    // If browser is running low-end device profile
    if (browserMemoryClassGB < t.minMemoryClassGB) {
      if (fileSizeMB > t.recommendedLocalFileSizeMB / 2) {
        return "SERVER_REQUIRED";
      }
    }

    // 8. Size and complexity decision matrix
    if (fileSizeMB > t.maxLocalFileSizeMB || pages > t.maxLocalPageCount) {
      return "SERVER_REQUIRED";
    }

    // 9. Prior failures local-engine routing guard
    if (priorLocalFailureCount > 0) {
      return "SERVER_RECOMMENDED";
    }

    if (fileSizeMB > t.recommendedLocalFileSizeMB) {
      return "SERVER_RECOMMENDED";
    }

    // 10. High page count warnings
    if (pages > t.warningPageCount) {
      return "LOCAL_WITH_WARNING";
    }

    return "LOCAL_SAFE";
  }
}
