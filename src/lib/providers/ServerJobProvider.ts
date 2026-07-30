export interface UploadRequest {
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  maxSizeBytes?: number;
}

export interface UploadTarget {
  signedUrl: string;
  objectId: string;
  expiresAt: string;
}

export interface FileValidation {
  valid: boolean;
  detectedMagic: string;
  errorReason?: string;
  isClean?: boolean;
}

export interface ConversionJob {
  jobId: string;
  inputObjectId: string;
  requestedOperation: string;
  timeoutMs?: number;
}

export interface JobHandle {
  jobId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'REJECTED';
}

export interface JobResult {
  jobId: string;
  outputObjectId: string;
  outputSizeBytes: number;
  sha256Hash: string;
  executionDurationMs: number;
  status: 'SUCCESS' | 'FAILED';
}

export interface DownloadTarget {
  signedDownloadUrl: string;
  outputObjectId: string;
  expiresAt: string;
}

export interface DeletionEvidence {
  objectId: string;
  inputDeleted: boolean;
  outputDeleted: boolean;
  deletionLatencyMs: number;
  retryAttempts: number;
  status: 'DELETED' | 'RETRY_QUEUED';
}

export interface ResourceUsage {
  wallClockDurationMs: number;
  cpuSeconds: number;
  allocatedCpuCores: number;
  allocatedRamGiB: number;
  outputSizeBytes: number;
}

export interface CostEstimate {
  provider: string;
  region: string;
  currency: string;
  grossResourceCostEUR: number;
  classification: 'RATE_CARD_ESTIMATED_COST' | 'PROVIDER_MEASURED' | 'PROVIDER_RECONCILED';
}

/**
 * Provider-agnostic interface for server-side job execution, storage, and telemetry.
 */
export interface ServerJobProvider {
  readonly providerName: string;
  readonly providerType: 'LOCAL_EMULATION' | 'CLOUDFLARE_CONTAINERS' | 'GCP_CLOUD_RUN';

  createUploadTarget(request: UploadRequest): Promise<UploadTarget>;
  verifyUploadedObject(buffer: Buffer, declaredMime: string): Promise<FileValidation>;
  dispatchConversion(job: ConversionJob): Promise<JobHandle>;
  getJobResult(jobId: string): Promise<JobResult>;
  createDownloadTarget(objectId: string, filename: string): Promise<DownloadTarget>;
  deleteObject(inputId: string, outputId: string): Promise<DeletionEvidence>;
  estimateCost(usage: ResourceUsage): Promise<CostEstimate>;
}
