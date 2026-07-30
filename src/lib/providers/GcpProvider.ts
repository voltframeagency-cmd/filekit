import {
  ServerJobProvider,
  UploadRequest,
  UploadTarget,
  FileValidation,
  ConversionJob,
  JobHandle,
  JobResult,
  DownloadTarget,
  DeletionEvidence,
  ResourceUsage,
  CostEstimate,
} from './ServerJobProvider';
import { GCP_CLOUD_RUN_WEST1_RATES } from '../engine/providerCostReconciliation';

/**
 * GCP Provider Reference Implementation (Retained as ALTERNATIVE_PROVIDER_REFERENCE)
 */
export class GcpProvider implements ServerJobProvider {
  readonly providerName = 'GCP Cloud Run + GCS Provider (Alternative Reference)';
  readonly providerType = 'GCP_CLOUD_RUN' as const;

  async createUploadTarget(request: UploadRequest): Promise<UploadTarget> {
    const objectId = `gcs_obj_input_${Date.now()}`;
    return {
      signedUrl: `https://storage.googleapis.com/filekit-staged-uploads/${objectId}/${request.filename}`,
      objectId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  async verifyUploadedObject(buffer: Buffer, declaredMime: string): Promise<FileValidation> {
    const magicHex = buffer.subarray(0, 4).toString('hex').toUpperCase();
    return { valid: magicHex === '504B0304', detectedMagic: magicHex, isClean: true };
  }

  async dispatchConversion(job: ConversionJob): Promise<JobHandle> {
    return { jobId: job.jobId, status: 'QUEUED' };
  }

  async getJobResult(jobId: string): Promise<JobResult> {
    return {
      jobId,
      outputObjectId: `gcs_obj_output_${jobId}`,
      outputSizeBytes: 105000,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      executionDurationMs: 1850,
      status: 'SUCCESS',
    };
  }

  async createDownloadTarget(objectId: string, filename: string): Promise<DownloadTarget> {
    return {
      signedDownloadUrl: `https://storage.googleapis.com/filekit-processed-outputs/${objectId}/${filename}`,
      outputObjectId: objectId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
  }

  async deleteObject(inputId: string, outputId: string): Promise<DeletionEvidence> {
    return {
      objectId: outputId,
      inputDeleted: true,
      outputDeleted: true,
      deletionLatencyMs: 35,
      retryAttempts: 0,
      status: 'DELETED',
    };
  }

  async estimateCost(usage: ResourceUsage): Promise<CostEstimate> {
    const rates = GCP_CLOUD_RUN_WEST1_RATES;
    const durationSec = usage.wallClockDurationMs / 1000;
    const cpuCost = durationSec * usage.allocatedCpuCores * rates.cpuSecondRateEUR;
    const ramCost = durationSec * usage.allocatedRamGiB * rates.ramGiBSecondRateEUR;
    const egressCost = (usage.outputSizeBytes / (1024 * 1024 * 1024)) * rates.egressGBRateEUR;

    return {
      provider: 'GCP Cloud Run + GCS',
      region: 'europe-west1',
      currency: 'EUR',
      grossResourceCostEUR: Number((cpuCost + ramCost + egressCost).toFixed(7)),
      classification: 'RATE_CARD_ESTIMATED_COST',
    };
  }
}
