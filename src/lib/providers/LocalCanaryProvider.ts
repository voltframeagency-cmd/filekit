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
import {
  generateSignedUploadUrl,
  validateUploadedBuffer,
  scanStagedFileMalware,
  generateSignedDownloadUrl,
  executeRemoteStorageDeletion,
} from '../engine/serverStorageAdapter';
import { reconcileJobExecutionCost } from '../engine/providerCostReconciliation';

export class LocalCanaryProvider implements ServerJobProvider {
  readonly providerName = 'Local Canary Emulated Provider';
  readonly providerType = 'LOCAL_EMULATION' as const;

  async createUploadTarget(request: UploadRequest): Promise<UploadTarget> {
    const spec = generateSignedUploadUrl(request.filename, request.mimeType, request.fileSizeBytes, request.maxSizeBytes);
    return {
      signedUrl: spec.signedUrl,
      objectId: spec.objectId,
      expiresAt: spec.expiresAt,
    };
  }

  async verifyUploadedObject(buffer: Buffer, declaredMime: string): Promise<FileValidation> {
    const preflight = validateUploadedBuffer(buffer, declaredMime);
    const malware = scanStagedFileMalware(buffer);
    return {
      valid: preflight.valid && malware.clean,
      detectedMagic: preflight.detectedMagic,
      errorReason: preflight.errorReason || (!malware.clean ? `Malware: ${malware.threatName}` : undefined),
      isClean: malware.clean,
    };
  }

  async dispatchConversion(job: ConversionJob): Promise<JobHandle> {
    return {
      jobId: job.jobId,
      status: 'COMPLETED',
    };
  }

  async getJobResult(jobId: string): Promise<JobResult> {
    return {
      jobId,
      outputObjectId: `obj_output_${jobId}`,
      outputSizeBytes: 105000,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      executionDurationMs: 1200,
      status: 'SUCCESS',
    };
  }

  async createDownloadTarget(objectId: string, filename: string): Promise<DownloadTarget> {
    const fakeBuffer = Buffer.concat([Buffer.from('%PDF-1.7\n%'), Buffer.alloc(100000)]);
    const spec = generateSignedDownloadUrl(fakeBuffer, filename);
    return {
      signedDownloadUrl: spec.signedDownloadUrl,
      outputObjectId: spec.outputObjectId,
      expiresAt: spec.expiresAt,
    };
  }

  async deleteObject(inputId: string, outputId: string): Promise<DeletionEvidence> {
    const res = executeRemoteStorageDeletion(inputId, outputId);
    return {
      objectId: outputId,
      inputDeleted: res.inputTypeDeleted,
      outputDeleted: res.outputTypeDeleted,
      deletionLatencyMs: res.inputDeletionLatencyMs + res.outputDeletionLatencyMs,
      retryAttempts: res.retryAttempts,
      status: res.status === 'DELETION_RETRY_SUCCESS' ? 'RETRY_QUEUED' : 'DELETED',
    };
  }

  async estimateCost(usage: ResourceUsage): Promise<CostEstimate> {
    const report = reconcileJobExecutionCost({
      jobId: 'local_canary_job',
      provider: 'LOCAL_CANARY_EMULATION',
      region: 'europe-west1',
      containerCpuCores: usage.allocatedCpuCores,
      containerRamGiB: usage.allocatedRamGiB,
      cpuDurationMs: usage.wallClockDurationMs,
      wallClockDurationMs: usage.wallClockDurationMs,
      egressBytes: usage.outputSizeBytes,
      storageOperationsCount: 4,
      status: 'SUCCESS',
    });
    return {
      provider: 'Local Canary Emulated',
      region: 'local',
      currency: 'EUR',
      grossResourceCostEUR: report.totalInfrastructureCostEUR,
      classification: 'RATE_CARD_ESTIMATED_COST',
    };
  }
}
