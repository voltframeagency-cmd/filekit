import { WorkspaceState, LocalPdfRuntimeCapabilities } from "@/utils/engine/types";

export interface CapabilityInput {
  file: File;
  pages?: number;
  isPasswordProtected?: boolean;
  isCorrupted?: boolean;
  requestedOperation: string;
  hasPdfSignature?: boolean;
  estimatedDecodedMemoryMB?: number;
  browserMemoryClassGB?: number; // navigator.deviceMemory or undefined
  hasWebWorker?: boolean;
  hasWasmSupport?: boolean;
  priorLocalFailureCount?: number;
  capabilities?: LocalPdfRuntimeCapabilities;
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
      browserMemoryClassGB,
      hasWebWorker = typeof window !== "undefined" && typeof window.Worker !== "undefined",
      hasWasmSupport = typeof window !== "undefined" && typeof (window as any).WebAssembly !== "undefined",
      priorLocalFailureCount = 0,
      capabilities,
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
      return "UNSUPPORTED";
    }

    // 4. Security Check (Encryption / Password protection)
    if (isPasswordProtected) {
      return "UNSUPPORTED";
    }

    // 5. Check operations requirements
    if (requestedOperation !== "compress") {
      return "UNSUPPORTED";
    }

    // 6. Check detailed feature capabilities if provided
    if (capabilities) {
      if (!capabilities.worker || !capabilities.pdfWorkerBoot) {
        return "SERVER_REQUIRED";
      }
      if (!capabilities.offscreenCanvas || !capabilities.createImageBitmap || !capabilities.canvasJpegEncoding || !capabilities.transferableArrayBuffer) {
        return "SERVER_RECOMMENDED";
      }
    } else {
      // Fallback checks for environments without full probing (e.g. CLI tests)
      if (t.requireWasm && !hasWasmSupport) {
        return "SERVER_REQUIRED";
      }
      if (t.requireWorker && !hasWebWorker) {
        return "SERVER_RECOMMENDED";
      }
    }

    // 7. Hard Size and complexity limits
    const ONE_MB = 1024 * 1024;
    const fileSizeMB = file.size / ONE_MB;
    if (fileSizeMB > t.maxLocalFileSizeMB || pages > t.maxLocalPageCount) {
      return "SERVER_REQUIRED";
    }

    // 8. Decoded Memory Estimation & Browser Memory limits
    const estMemoryMB = estimatedDecodedMemoryMB ?? (pages * 3.5 + fileSizeMB);

    // Determine budget based on browser device memory class (LOW_OR_UNKNOWN = 160MB, MEDIUM = 256MB, HIGH = 384MB)
    let memoryBudgetMB = 160; 
    if (browserMemoryClassGB === 4) {
      memoryBudgetMB = 256;
    } else if (browserMemoryClassGB && browserMemoryClassGB >= 8) {
      memoryBudgetMB = 384;
    }

    // Route based on memory class budgets (exceeding budget routes away immediately)
    if (estMemoryMB > memoryBudgetMB) {
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

  static getRoutingReason(input: CapabilityInput): string {
    const {
      file,
      pages = 24,
      isPasswordProtected = false,
      estimatedDecodedMemoryMB,
      browserMemoryClassGB,
      hasWebWorker = typeof window !== "undefined" && typeof window.Worker !== "undefined",
      hasWasmSupport = typeof window !== "undefined" && typeof (window as any).WebAssembly !== "undefined",
      capabilities,
    } = input;

    const t = this.thresholds;
    const ONE_MB = 1024 * 1024;
    const fileSizeMB = file.size / ONE_MB;
    const estMemoryMB = estimatedDecodedMemoryMB ?? (pages * 3.5 + fileSizeMB);

    if (isPasswordProtected) return "password_protected";

    // Route reason based on detailed feature capabilities if provided
    if (capabilities) {
      if (!capabilities.worker || !capabilities.pdfWorkerBoot) {
        return "browser_limit";
      }
      if (!capabilities.offscreenCanvas || !capabilities.createImageBitmap || !capabilities.canvasJpegEncoding || !capabilities.transferableArrayBuffer) {
        return "browser_limit";
      }
    } else {
      if (!hasWasmSupport || !hasWebWorker) return "browser_limit";
    }
    
    let memoryBudgetMB = 160; 
    if (browserMemoryClassGB === 4) {
      memoryBudgetMB = 256;
    } else if (browserMemoryClassGB && browserMemoryClassGB >= 8) {
      memoryBudgetMB = 384;
    }
    
    if (estMemoryMB > memoryBudgetMB) return "memory_budget";
    if (fileSizeMB > t.maxLocalFileSizeMB || pages > t.maxLocalPageCount) return "size_limit";
    if (fileSizeMB > t.recommendedLocalFileSizeMB) return "recommended_limit";

    return "none";
  }
}
