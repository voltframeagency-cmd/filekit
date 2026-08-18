/**
 * FileKit Server Cost Optimization & Capability Routing Engine Architecture
 *
 * Classification: EXPERIMENTAL_INFRASTRUCTURE (Scaffold Specification)
 * Server Engines Status: PLANNED (Execution infrastructure under development)
 * Core Principle: The server performs ONLY work the browser cannot safely perform.
 */

export type RoutingDecision =
  | "LOCAL_SAFE"
  | "LOCAL_WITH_WARNING"
  | "SERVER_FAST"
  | "SERVER_STANDARD"
  | "SERVER_COMPLEX"
  | "UNSUPPORTED";

export type WorkerLaneClass = "FAST" | "STANDARD" | "COMPLEX";
export type CostCalculationLabel = "ESTIMATED" | "MEASURED" | "PROVIDER_RECONCILED";

export interface CloudProviderPricingParams {
  provider: "Google Cloud Run" | "Cloudflare R2" | "AWS Lambda";
  region: "europe-west1" | "global";
  pricingDate: "2026-07-30";
  currency: "EUR";
  cpuSecondRateEUR: number;
  ramGiBSecondRateEUR: number;
  storageGBMonthRateEUR: number;
  egressGBRateEUR: number;
  classAOpsRateEUR: number;
  classBOpsRateEUR: number;
  durationAssumptionSeconds: number;
  cpuAssumptionVCPU: number;
  memoryAssumptionGiB: number;
}

export interface CostEstimateResult {
  label: CostCalculationLabel;
  computeCostEUR: number;
  storageCostEUR: number;
  transferCostEUR: number;
  totalInfrastructureCostEUR: number;
  params: CloudProviderPricingParams;
}

export interface FilePreflightInspection {
  magicBytes: string;
  mimeType: string;
  fileSizeBytes: number;
  pageCount?: number;
  hasNativeText?: boolean;
  hasScannedPages?: boolean;
  imageDimensions?: { width: number; height: number };
  isEncrypted: boolean;
  estimatedDecodedMemoryMB: number;
  requestedOperation: string;
}

export interface WorkerLaneConfig {
  lane: WorkerLaneClass;
  vCPU: number;
  ramGiB: number;
  timeoutSeconds: number;
  maxConcurrentJobsPerNode: number;
  pricingParams: CloudProviderPricingParams;
}

export interface SelectiveOcrPagePlan {
  pageIndex: number;
  isNativeText: boolean;
  isBlankPage: boolean;
  isScannedImage: boolean;
  action: "SKIP_OCR" | "EXECUTE_PAGE_OCR" | "PRESERVE_NATIVE_TEXT";
  threadLimit: number; // OMP_THREAD_LIMIT=1
}

export interface SelectiveOcrPlan {
  totalPages: number;
  pagesSkipped: number;
  pagesProcessed: number;
  estimatedSavingsPercentage: number;
  pagePlans: SelectiveOcrPagePlan[];
}

export interface CommercialMarginStructure {
  jobPassPriceEUR: number;
  vatRatePercentage: number;
  netRevenueEUR: number;
  paymentGatewayFeeEUR: number;
  netAvailableRevenueEUR: number;
  averageJobsPerPass: number;
  totalInfrastructureCostPerPassEUR: number;
  singleJobComputeMarginPercentage: number;
  infrastructureContributionMarginPercentage: number;
  commercialContributionMarginPercentage: number;
}

export const DEFAULT_CLOUD_RUN_PARAMS: CloudProviderPricingParams = {
  provider: "Google Cloud Run",
  region: "europe-west1",
  pricingDate: "2026-07-30",
  currency: "EUR",
  cpuSecondRateEUR: 0.000024,
  ramGiBSecondRateEUR: 0.0000025,
  storageGBMonthRateEUR: 0.015,
  egressGBRateEUR: 0.00, // Cloudflare R2 / zero egress architecture
  classAOpsRateEUR: 0.0000045,
  classBOpsRateEUR: 0.00000035,
  durationAssumptionSeconds: 30,
  cpuAssumptionVCPU: 1,
  memoryAssumptionGiB: 1,
};

export const WORKER_LANE_PROFILES: Record<WorkerLaneClass, WorkerLaneConfig> = {
  FAST: {
    lane: "FAST",
    vCPU: 1,
    ramGiB: 1,
    timeoutSeconds: 30,
    maxConcurrentJobsPerNode: 4,
    pricingParams: { ...DEFAULT_CLOUD_RUN_PARAMS, cpuAssumptionVCPU: 1, memoryAssumptionGiB: 1, durationAssumptionSeconds: 30 },
  },
  STANDARD: {
    lane: "STANDARD",
    vCPU: 2,
    ramGiB: 2,
    timeoutSeconds: 60,
    maxConcurrentJobsPerNode: 2,
    pricingParams: { ...DEFAULT_CLOUD_RUN_PARAMS, cpuAssumptionVCPU: 2, memoryAssumptionGiB: 2, durationAssumptionSeconds: 60 },
  },
  COMPLEX: {
    lane: "COMPLEX",
    vCPU: 4,
    ramGiB: 8,
    timeoutSeconds: 120,
    maxConcurrentJobsPerNode: 1,
    pricingParams: { ...DEFAULT_CLOUD_RUN_PARAMS, cpuAssumptionVCPU: 4, memoryAssumptionGiB: 8, durationAssumptionSeconds: 120 },
  },
};

/**
 * Parameterized Compute Cost Calculation
 */
export function estimateComputeCost(params: CloudProviderPricingParams): number {
  return (
    params.cpuAssumptionVCPU * params.durationAssumptionSeconds * params.cpuSecondRateEUR +
    params.memoryAssumptionGiB * params.durationAssumptionSeconds * params.ramGiBSecondRateEUR
  );
}

/**
 * Parameterized Storage & Transfer Cost Calculation
 */
export function estimateStorageCost(bytes: number, durationMinutes: number, params: CloudProviderPricingParams): number {
  const gbMonths = (bytes / (1024 * 1024 * 1024)) * (durationMinutes / (30 * 24 * 60));
  return gbMonths * params.storageGBMonthRateEUR + params.classAOpsRateEUR + params.classBOpsRateEUR;
}

/**
 * Total Infrastructure Cost Estimation
 */
export function estimateTotalInfrastructureCost(bytes: number, durationMinutes: number, params: CloudProviderPricingParams): CostEstimateResult {
  const compute = estimateComputeCost(params);
  const storage = estimateStorageCost(bytes, durationMinutes, params);
  const transfer = (bytes / (1024 * 1024 * 1024)) * params.egressGBRateEUR;
  return {
    label: "ESTIMATED",
    computeCostEUR: Math.round(compute * 1000000) / 1000000,
    storageCostEUR: Math.round(storage * 1000000) / 1000000,
    transferCostEUR: Math.round(transfer * 1000000) / 1000000,
    totalInfrastructureCostEUR: Math.round((compute + storage + transfer) * 1000000) / 1000000,
    params,
  };
}

/**
 * Calculates 3 Distinct Margin Metrics for FileKit Job Passes
 */
export function calculateCommercialMarginStructure(
  jobPassPriceEUR: number = 4.90,
  vatRatePercentage: number = 25.0,
  paymentGatewayFeeEUR: number = 0.30,
  jobsPerPass: number = 6,
  averageInfrastructureCostPerJobEUR: number = 0.04
): CommercialMarginStructure {
  const netRevenueEUR = jobPassPriceEUR / (1 + vatRatePercentage / 100);
  const netAvailableRevenueEUR = netRevenueEUR - paymentGatewayFeeEUR;
  const totalInfrastructureCostPerPassEUR = jobsPerPass * averageInfrastructureCostPerJobEUR;

  const singleJobComputeMarginPercentage = ((jobPassPriceEUR - averageInfrastructureCostPerJobEUR) / jobPassPriceEUR) * 100;
  const infrastructureContributionMarginPercentage = ((netRevenueEUR - totalInfrastructureCostPerPassEUR) / netRevenueEUR) * 100;
  const commercialContributionMarginPercentage = ((netAvailableRevenueEUR - totalInfrastructureCostPerPassEUR) / netRevenueEUR) * 100;

  return {
    jobPassPriceEUR: Math.round(jobPassPriceEUR * 100) / 100,
    vatRatePercentage,
    netRevenueEUR: Math.round(netRevenueEUR * 100) / 100,
    paymentGatewayFeeEUR: Math.round(paymentGatewayFeeEUR * 100) / 100,
    netAvailableRevenueEUR: Math.round(netAvailableRevenueEUR * 100) / 100,
    averageJobsPerPass: jobsPerPass,
    totalInfrastructureCostPerPassEUR: Math.round(totalInfrastructureCostPerPassEUR * 1000) / 1000,
    singleJobComputeMarginPercentage: Math.round(singleJobComputeMarginPercentage * 10) / 10,
    infrastructureContributionMarginPercentage: Math.round(infrastructureContributionMarginPercentage * 10) / 10,
    commercialContributionMarginPercentage: Math.round(commercialContributionMarginPercentage * 10) / 10,
  };
}

/**
 * FileKit Advisory Preflight Firewall (Cost Estimation Filter)
 */
export function inspectAndRoutePreflight(inspection: FilePreflightInspection): RoutingDecision {
  if (inspection.isEncrypted) {
    return "UNSUPPORTED";
  }

  if (inspection.fileSizeBytes > 500 * 1024 * 1024) {
    return "UNSUPPORTED";
  }

  // Local-first execution paths (€0.00 cloud cost)
  if (
    inspection.requestedOperation.includes("merge") ||
    inspection.requestedOperation.includes("split") ||
    inspection.requestedOperation.includes("rotate") ||
    inspection.requestedOperation.includes("delete") ||
    inspection.requestedOperation.includes("reorder") ||
    inspection.requestedOperation.includes("crop") ||
    inspection.requestedOperation.includes("watermark") ||
    inspection.requestedOperation.includes("page-number") ||
    inspection.requestedOperation.includes("jpg-to-png") ||
    inspection.requestedOperation.includes("png-to-jpg") ||
    inspection.requestedOperation.includes("jpg-to-webp") ||
    inspection.requestedOperation.includes("png-to-ico") ||
    inspection.requestedOperation.includes("heic-to-jpg") ||
    inspection.requestedOperation.includes("heic-to-png") ||
    inspection.requestedOperation.includes("avif-to-jpg") ||
    inspection.requestedOperation.includes("image-to-text") ||
    inspection.requestedOperation.includes("ocr-pdf") ||
    inspection.requestedOperation.includes("make-pdf-searchable")
  ) {
    return inspection.fileSizeBytes < 50 * 1024 * 1024 ? "LOCAL_SAFE" : "LOCAL_WITH_WARNING";
  }

  if (inspection.fileSizeBytes < 5 * 1024 * 1024 && (inspection.pageCount || 1) <= 5) {
    return "SERVER_FAST";
  }

  if (inspection.fileSizeBytes < 30 * 1024 * 1024 && (inspection.pageCount || 1) <= 50) {
    return "SERVER_STANDARD";
  }

  return "SERVER_COMPLEX";
}

/**
 * Selective OCR Planner: Target hypothesis to eliminate unnecessary OCR on native text pages.
 */
export function generateSelectiveOcrPlan(pages: Array<{ isNativeText: boolean; isBlank: boolean; isImageOnly: boolean }>): SelectiveOcrPlan {
  let skipped = 0;
  let processed = 0;

  const pagePlans: SelectiveOcrPagePlan[] = pages.map((page, idx) => {
    if (page.isBlank) {
      skipped++;
      return {
        pageIndex: idx,
        isNativeText: false,
        isBlankPage: true,
        isScannedImage: false,
        action: "SKIP_OCR",
        threadLimit: 1,
      };
    }

    if (page.isNativeText) {
      skipped++;
      return {
        pageIndex: idx,
        isNativeText: true,
        isBlankPage: false,
        isScannedImage: false,
        action: "PRESERVE_NATIVE_TEXT",
        threadLimit: 1,
      };
    }

    processed++;
    return {
      pageIndex: idx,
      isNativeText: false,
      isBlankPage: false,
      isScannedImage: true,
      action: "EXECUTE_PAGE_OCR",
      threadLimit: 1,
    };
  });

  const totalPages = pages.length || 1;
  const savings = (skipped / totalPages) * 100;

  return {
    totalPages,
    pagesSkipped: skipped,
    pagesProcessed: processed,
    estimatedSavingsPercentage: Math.round(savings * 10) / 10,
    pagePlans,
  };
}

export const TECHNICAL_DISCLOSURES = {
  localExecution: "No server compute is used for this operation.",
  localPrivacy: "File content stays on the device for this operation.",
  localScale: "No central processing capacity is consumed, subject to device limits.",
};
