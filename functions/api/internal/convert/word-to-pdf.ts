// Cloudflare Pages Function: /api/internal/convert/word-to-pdf
// Actual deployed conversion path dispatching to real LibreOffice container worker.
// Enforces €4.90 Job Pass entitlement for premium/large workloads.

import { assertFeatureEntitlement } from '../../../../src/lib/billing/entitlementGuard';
import { jobPassService } from '../../../../src/lib/billing/jobPassService';
import { getBillingConfig } from '../../../../src/lib/billing/billingConfig';

const DEFAULT_OFFICE_WORKER_URL = 'https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert';

export const onRequestPost = async (context: any) => {
  try {
    if (context.env) {
      if (context.env.DB) {
        jobPassService.bindD1(context.env.DB);
      }
      getBillingConfig(true, context.env);
    }

    const officeWorkerUrl = context.env?.OFFICE_WORKER_URL || DEFAULT_OFFICE_WORKER_URL;

    const req = context.request;
    const contentType = req.headers.get('content-type') || '';

    // Clone request for inspection
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: 'No file provided in request.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fileSize = file.size;
    const isBatch =
      formData.get('batch') === 'true' ||
      req.headers.get('x-batch-mode') === 'true' ||
      req.headers.get('x-require-premium') === 'true';

    // 1. ENFORCE JOB PASS ENTITLEMENT ON DEPLOYED PATH
    // Fair-use files <= 50MB are allowed free; files > 50MB or batch/premium requests require Job Pass
    const guard = await assertFeatureEntitlement(req, 'SERVER_OFFICE_CONVERSION', {
      fileSizeBytes: fileSize,
      isBatch,
    });

    if (!guard.authorized && guard.response) {
      return guard.response;
    }

    // 2. DISPATCH TO REAL LIBREOFFICE WORKER CONTAINER
    const workerBearerToken = context.env?.CANARY_BEARER_TOKEN;
    if (!workerBearerToken) {
      return new Response(JSON.stringify({ success: false, error: 'Missing CANARY_BEARER_TOKEN binding on edge.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const fileBuffer = await file.arrayBuffer();

    const forwardHeaders: Record<string, string> = {
      Authorization: `Bearer ${workerBearerToken.trim()}`,
      'Content-Type': file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'X-File-Name': file.name || 'document.docx',
      'X-Canary-Run-ID': req.headers.get('x-canary-run-id') || 'default',
      Accept: 'application/pdf',
      'X-Return-Format': 'binary',
    };

    if (guard.passId) {
      forwardHeaders['X-Job-Pass-Id'] = guard.passId;
    }

    const workerRes = await fetch(officeWorkerUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: fileBuffer,
    });

    if (!workerRes.ok) {
      const errText = await workerRes.text();
      return new Response(
        JSON.stringify({
          success: false,
          error: `Real LibreOffice worker failed with status ${workerRes.status}`,
          details: errText,
        }),
        {
          status: workerRes.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Stream back real converted PDF bytes from LibreOffice container
    const pdfBytes = await workerRes.arrayBuffer();
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^.]+$/, '')}.pdf"`,
        'X-Converted-By': 'FileKit-LibreOffice-Container',
        'X-Job-Pass-Verified': guard.passId ? 'true' : 'false',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Conversion dispatch failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
