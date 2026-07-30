export interface ProviderExecutionTelemetry {
  jobId: string;
  provider: 'GCP_CLOUD_RUN' | 'AWS_FARGATE' | 'LOCAL_CANARY_EMULATION';
  region: string;
  containerCpuCores: number;
  containerRamGiB: number;
  cpuDurationMs: number;
  wallClockDurationMs: number;
  egressBytes: number;
  storageOperationsCount: number;
  status: 'SUCCESS' | 'REJECTED_PREFLIGHT' | 'FAILED_TIMEOUT';
}

export interface ReconciledCostReport {
  jobId: string;
  provider: string;
  region: string;
  pricingDate: string;
  currency: string;
  
  // Detailed Compute Breakdown
  cpuSecondRateEUR: number;
  ramGiBSecondRateEUR: number;
  storageGBMonthRateEUR: number;
  egressGBRateEUR: number;
  
  cpuCostEUR: number;
  ramCostEUR: number;
  storageCostEUR: number;
  egressCostEUR: number;
  
  totalInfrastructureCostEUR: number;
  classification: 'PROVIDER_MEASURED' | 'PROVIDER_RECONCILED' | 'LOCAL_CANARY_MEASURED';
}

// GCP Cloud Run europe-west1 baseline rates (as of 2026)
export const GCP_CLOUD_RUN_WEST1_RATES = {
  provider: 'GCP_CLOUD_RUN',
  region: 'europe-west1',
  pricingDate: '2026-01-01',
  currency: 'EUR',
  cpuSecondRateEUR: 0.000024, // €0.000024 per vCPU-second
  ramGiBSecondRateEUR: 0.0000025, // €0.0000025 per GiB-second
  storageGBMonthRateEUR: 0.020, // €0.020 per GB-month
  egressGBRateEUR: 0.080, // €0.080 per GB egress
};

/**
 * Reconciles empirical job execution telemetry into an audited cost report
 */
export function reconcileJobExecutionCost(
  telemetry: ProviderExecutionTelemetry
): ReconciledCostReport {
  const rates = GCP_CLOUD_RUN_WEST1_RATES;

  const durationSec = telemetry.wallClockDurationMs / 1000;
  const cpuSecTotal = durationSec * telemetry.containerCpuCores;
  const ramGiBSecTotal = durationSec * telemetry.containerRamGiB;

  const cpuCost = cpuSecTotal * rates.cpuSecondRateEUR;
  const ramCost = ramGiBSecTotal * rates.ramGiBSecondRateEUR;

  // Staged input/output storage cost (staged for 15 mins = 0.000347 days)
  const storageGB = (10 * 1024 * 1024) / (1024 * 1024 * 1024); // 10MB avg
  const storageCost = (storageGB * rates.storageGBMonthRateEUR) / (30 * 24 * 4);

  // Download egress cost
  const egressGB = telemetry.egressBytes / (1024 * 1024 * 1024);
  const egressCost = egressGB * rates.egressGBRateEUR;

  const totalCost = cpuCost + ramCost + storageCost + egressCost;

  return {
    jobId: telemetry.jobId,
    provider: telemetry.provider,
    region: rates.region,
    pricingDate: rates.pricingDate,
    currency: rates.currency,
    cpuSecondRateEUR: rates.cpuSecondRateEUR,
    ramGiBSecondRateEUR: rates.ramGiBSecondRateEUR,
    storageGBMonthRateEUR: rates.storageGBMonthRateEUR,
    egressGBRateEUR: rates.egressGBRateEUR,
    cpuCostEUR: Number(cpuCost.toFixed(7)),
    ramCostEUR: Number(ramCost.toFixed(7)),
    storageCostEUR: Number(storageCost.toFixed(7)),
    egressCostEUR: Number(egressCost.toFixed(7)),
    totalInfrastructureCostEUR: Number(totalCost.toFixed(6)),
    classification: telemetry.provider === 'LOCAL_CANARY_EMULATION' ? 'LOCAL_CANARY_MEASURED' : 'PROVIDER_MEASURED',
  };
}
