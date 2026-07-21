export interface EngineRegistryMapping {
  engineId: string;
  environment: "production" | "development" | "test";
  status: "enabled" | "disabled" | "controlled_beta" | "production_guard_enforced";
  backendProcessing: "fully_implemented" | "adapter_only" | "consent_ui_only" | "unavailable";
  description: string;
}

export const PRODUCTION_ENGINE_REGISTRY: EngineRegistryMapping[] = [
  {
    engineId: "LOSSLESS_PDF_OPTIMIZER",
    environment: "production",
    status: "enabled",
    backendProcessing: "fully_implemented",
    description: "PDF catalog metadata stripping and stream object stream compression pass."
  },
  {
    engineId: "IMAGE_XOBJECT_RECOMPRESS",
    environment: "production",
    status: "controlled_beta",
    backendProcessing: "fully_implemented",
    description: "Local OffscreenCanvas / createImageBitmap stream re-compression for DCTDecode JPEG XObjects."
  },
  {
    engineId: "PAGE_FLATTEN_COMPRESSION",
    environment: "production",
    status: "disabled",
    backendProcessing: "unavailable",
    description: "Full PDF.js page rasterization fallback. Disabled in production due to high RAM overhead."
  },
  {
    engineId: "MOCK_ENGINE",
    environment: "development",
    status: "production_guard_enforced",
    backendProcessing: "adapter_only",
    description: "Mock synthetic WASM engine. Protected by production guards throwing ERR_MOCK_ENGINE_PROHIBITED."
  },
  {
    engineId: "SERVER_RECOMMENDED",
    environment: "production",
    status: "enabled",
    backendProcessing: "consent_ui_only",
    description: "Consent UI and fallback router for files exceeding local RAM budgets (>50MB). Backend API server is consent UI & adapter boundary only."
  }
];

export function getProductionRegistryReport(): EngineRegistryMapping[] {
  return PRODUCTION_ENGINE_REGISTRY;
}
