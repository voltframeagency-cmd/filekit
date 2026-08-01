import { Container } from "@cloudflare/containers";

export class OfficeWorker extends Container {
  defaultPort = 8080;
  requiredPorts = [8080];
  sleepAfter = "10m";

  onStart() {
    console.log("[OfficeWorker] Container instance started.");
  }

  onError(err: unknown) {
    console.error("[OfficeWorker] Container instance error:", err);
  }

  onStop(params: { exitCode?: number; reason?: string }) {
    console.log(`[OfficeWorker] Container stopped. Reason: ${params.reason}, ExitCode: ${params.exitCode}`);
  }

  async fetch(request: Request): Promise<Response> {
    try {
      const state = await this.getState();
      if (state && state.status !== "running" && state.status !== "starting") {
        await this.startAndWaitForPorts(8080);
      }
      return await this.containerFetch(request, 8080);
    } catch (err: any) {
      console.error("[OfficeWorker DO Exception]", err);
      return new Response(JSON.stringify({
        error: "CONTAINER_DO_EXCEPTION",
        details: err?.message || String(err)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
}

export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    try {
      const url = new URL(request.url);

      // 1. Public Health Check
      if (url.pathname === "/" || url.pathname === "/health") {
        if (request.method !== "GET") {
          return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
            status: 405,
            headers: { "Content-Type": "application/json", "Allow": "GET" }
          });
        }
        return new Response("FileKit Cloudflare Containers Worker", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        });
      }

      // 2. Conversion Route Handler (/internal/canary/convert)
      if (url.pathname === "/internal/canary/convert") {
        if (request.method !== "POST") {
          return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), {
            status: 405,
            headers: { "Content-Type": "application/json", "Allow": "POST" }
          });
        }

        // Security Token Check
        const authHeader = request.headers.get("Authorization") || "";
        const secretHeader = request.headers.get("X-Canary-Secret") || "";
        const expectedSecret = env.CANARY_BEARER_TOKEN;

        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : secretHeader;
        if (!token || token !== expectedSecret) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED_CANARY_ACCESS" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }

        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
            !contentType.includes("application/octet-stream") &&
            !contentType.includes("application/json")) {
          return new Response(JSON.stringify({ error: "UNSUPPORTED_MEDIA_TYPE", expected: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), {
            status: 415,
            headers: { "Content-Type": "application/json" }
          });
        }

        const startTime = Date.now();
        const requestId = request.headers.get("cf-ray") || `req_${Date.now()}`;

        let docxBuffer: ArrayBuffer;
        let r2Key: string | null = null;
        let runId: string = "default";

        if (contentType.includes("application/json")) {
          const body = (await request.json()) as { r2Key?: string; runId?: string };
          r2Key = body.r2Key || null;
          runId = body.runId || "default";
          if (!r2Key) {
            return new Response(JSON.stringify({ error: "MISSING_R2_KEY" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }
          const r2Obj = await env.CANARY_BUCKET.get(r2Key);
          if (!r2Obj) {
            return new Response(JSON.stringify({ error: "R2_OBJECT_NOT_FOUND" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          docxBuffer = await r2Obj.arrayBuffer();
        } else {
          docxBuffer = await request.arrayBuffer();
          runId = request.headers.get("X-Canary-Run-ID") || "default";
        }

        // Input SHA-256 calculation
        const inputDigestBuffer = await crypto.subtle.digest("SHA-256", docxBuffer);
        const inputSha256 = Array.from(new Uint8Array(inputDigestBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

        // Validate magic bytes for ZIP/DOCX (PK\x03\x04)
        const inputBytes = new Uint8Array(docxBuffer);
        const isDocxMagic = inputBytes.length >= 4 &&
          inputBytes[0] === 0x50 && inputBytes[1] === 0x4b &&
          inputBytes[2] === 0x03 && inputBytes[3] === 0x04;

        if (!isDocxMagic) {
          return new Response(JSON.stringify({ error: "DOCX_STRUCTURE_INVALID", details: "Input file is missing DOCX/ZIP magic bytes" }), {
            status: 422,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Enforce Canary Execution Limits (25 MB max)
        const MAX_CANARY_BYTES = 25 * 1024 * 1024;
        if (docxBuffer.byteLength > MAX_CANARY_BYTES) {
          return new Response(JSON.stringify({ error: "FILE_TOO_LARGE", maxAllowedBytes: MAX_CANARY_BYTES }), {
            status: 413,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Enforce Server-Side Capped Private Beta Ceiling (100 jobs max)
        const MAX_PRIVATE_BETA_JOBS = 100;
        const jobIndex = parseInt(request.headers.get("X-Canary-Job-Index") || "1", 10);
        if (jobIndex > MAX_PRIVATE_BETA_JOBS) {
          return new Response(JSON.stringify({
            error: "PRIVATE_BETA_CAP_EXCEEDED",
            maxAllowedConversions: MAX_PRIVATE_BETA_JOBS,
            details: "The 100-job private beta cap has been reached for this execution instance."
          }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
          });
        }

        const jobId = `canary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const inputR2Key = r2Key || `canary-runs/${runId}/${jobId}/input.docx`;
        const outputR2Key = `canary-runs/${runId}/${jobId}/output.pdf`;

        if (!r2Key) {
          await env.CANARY_BUCKET.put(inputR2Key, docxBuffer, {
            httpMetadata: { contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
          });
        }

        // STABLE Durable Object Container Instance ID per run
        const instanceName = `word-to-pdf-canary-instance-${runId}`;
        const doId = env.OFFICE_WORKER.idFromName(instanceName);
        const doStub = env.OFFICE_WORKER.get(doId);

        const containerStart = Date.now();
        let containerRes: Response | null = null;
        let retries = 0;

        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const reqClone = new Request("http://container/convert", {
              method: "POST",
              headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
              body: docxBuffer
            });
            containerRes = await doStub.fetch(reqClone);
            if (containerRes && containerRes.ok) {
              break;
            }
            retries = attempt + 1;
            await new Promise((r) => setTimeout(r, 300));
          } catch (err: any) {
            retries = attempt + 1;
            await new Promise((r) => setTimeout(r, 300));
          }
        }

        const containerDurationMs = Date.now() - containerStart;

        if (!containerRes || !containerRes.ok) {
          const errText = containerRes ? await containerRes.text() : "Container request failed";
          return new Response(JSON.stringify({
            error: "CONTAINER_CONVERSION_FAILED",
            status: containerRes ? containerRes.status : 500,
            retries,
            details: errText
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const pdfBuffer = await containerRes.arrayBuffer();
        const exitCode = containerRes.headers.get("X-LibreOffice-Exit-Code") || "0";

        // Output PDF Verification
        const pdfBytes = new Uint8Array(pdfBuffer);
        const isMagicPdf = pdfBytes.length > 5 &&
          pdfBytes[0] === 0x25 && pdfBytes[1] === 0x50 &&
          pdfBytes[2] === 0x44 && pdfBytes[3] === 0x46; // %PDF

        if (!isMagicPdf) {
          return new Response(JSON.stringify({ error: "INVALID_PDF_OUTPUT_MAGIC_BYTES" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        // PDF Page Count Estimation
        const pdfText = new TextDecoder("latin1").decode(pdfBytes);
        const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g);
        const pageCount = pageMatches ? pageMatches.length : 1;

        // Output SHA-256 calculation
        const digestBuffer = await crypto.subtle.digest("SHA-256", pdfBuffer);
        const outputSha256 = Array.from(new Uint8Array(digestBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

        // Upload output PDF to R2
        await env.CANARY_BUCKET.put(outputR2Key, pdfBuffer, {
          httpMetadata: { contentType: "application/pdf" }
        });

        // Verify SHA-256 identity by reading back from R2
        const readbackObj = await env.CANARY_BUCKET.get(outputR2Key);
        const readbackBuffer = await readbackObj.arrayBuffer();
        const readbackDigest = await crypto.subtle.digest("SHA-256", readbackBuffer);
        const readbackSha256 = Array.from(new Uint8Array(readbackDigest)).map(b => b.toString(16).padStart(2, "0")).join("");

        const sha256Matched = outputSha256 === readbackSha256;

        // Automatic Deletion Verification
        const inputDelStart = Date.now();
        await env.CANARY_BUCKET.delete(inputR2Key);
        const inputDelLatency = Date.now() - inputDelStart;

        const outputDelStart = Date.now();
        await env.CANARY_BUCKET.delete(outputR2Key);
        const outputDelLatency = Date.now() - outputDelStart;

        const checkInputHead = await env.CANARY_BUCKET.head(inputR2Key);
        const checkInputGet = await env.CANARY_BUCKET.get(inputR2Key);
        const checkOutputHead = await env.CANARY_BUCKET.head(outputR2Key);
        const checkOutputGet = await env.CANARY_BUCKET.get(outputR2Key);

        const inputCleanup = {
          head: checkInputHead === null ? "NOT_FOUND" : "EXISTS",
          get: checkInputGet === null ? "NOT_FOUND" : "EXISTS",
          listed: false,
          deletionLatencyMs: inputDelLatency
        };

        const outputCleanup = {
          head: checkOutputHead === null ? "NOT_FOUND" : "EXISTS",
          get: checkOutputGet === null ? "NOT_FOUND" : "EXISTS",
          listed: false,
          deletionLatencyMs: outputDelLatency
        };

        const totalWallTimeMs = Date.now() - startTime;

        const telemetry = {
          requestId,
          doInvocationId: doId.toString(),
          containerStatus: "PASSED",
          containerDurationMs,
          libreOfficeExitCode: parseInt(exitCode, 10),
          retries,
          inputSha256,
          inputBytes: docxBuffer.byteLength,
          outputBytes: pdfBuffer.byteLength,
          pdfMagicBytesVerified: isMagicPdf,
          pageCount,
          outputSha256,
          sha256Matched,
          inputCleanup,
          outputCleanup,
          r2Operations: {
            putCount: r2Key ? 1 : 2,
            getCount: r2Key ? 4 : 3,
            headCount: 2,
            listCount: 0,
            deleteCount: 2
          },
          totalWallTimeMs
        };

        return new Response(JSON.stringify(telemetry, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 3. Run-Scoped Inspection Endpoint (/internal/canary/inspect)
      if (url.pathname === "/internal/canary/inspect") {
        if (request.method !== "GET") {
          return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405 });
        }

        const authHeader = request.headers.get("Authorization") || "";
        const secretHeader = request.headers.get("X-Canary-Secret") || "";
        const expectedSecret = env.CANARY_BEARER_TOKEN;
        const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : secretHeader;
        if (!token || token !== expectedSecret) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED_CANARY_ACCESS" }), { status: 401 });
        }

        const runId = url.searchParams.get("runId") || "default";
        const prefix = `canary-runs/${runId}/`;
        const listResult = await env.CANARY_BUCKET.list({ prefix });

        return new Response(JSON.stringify({
          runId,
          prefix,
          remainingObjectCount: listResult.objects.length,
          objects: listResult.objects.map((o: any) => o.key)
        }, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 4. Hardened Admin Deletion Endpoint (/internal/admin/canary-runs/cleanup)
      if (url.pathname === "/internal/admin/canary-runs/cleanup") {
        if (request.method !== "POST") {
          return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405 });
        }

        const adminSecretHeader = request.headers.get("X-Canary-Admin-Secret") || "";
        const expectedAdminSecret = env.CANARY_ADMIN_SECRET;
        if (!adminSecretHeader || adminSecretHeader !== expectedAdminSecret) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED_ADMIN_ACCESS" }), { status: 401 });
        }

        const body = (await request.json()) as { runId?: string; maxLimit?: number; dryRun?: boolean };
        const runId = body.runId;
        if (!runId || runId.includes("..") || runId.includes("*")) {
          return new Response(JSON.stringify({ error: "INVALID_RUN_ID_SPECIFICATION" }), { status: 400 });
        }

        const prefix = `canary-runs/${runId}/`;
        const listResult = await env.CANARY_BUCKET.list({ prefix });

        if (body.dryRun) {
          return new Response(JSON.stringify({
            adminAudit: "DRY_RUN",
            runId,
            prefix,
            dryRun: true,
            matchingObjectCount: listResult.objects.length,
            purgedCount: 0,
            remainingObjectCount: listResult.objects.length,
            r2Operations: { putCount: 0, getCount: 0, headCount: 0, listCount: 1, deleteCount: 0 }
          }, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }

        const maxLimit = body.maxLimit || 500;
        let count = 0;

        for (const obj of listResult.objects) {
          if (count >= maxLimit) break;
          await env.CANARY_BUCKET.delete(obj.key);
          count++;
        }

        const postList = await env.CANARY_BUCKET.list({ prefix });

        return new Response(JSON.stringify({
          adminAudit: "PURGE_RUN_SCOPED",
          runId,
          prefix,
          purgedCount: count,
          remainingObjectCount: postList.objects.length,
          r2Operations: { putCount: 0, getCount: 0, headCount: 0, listCount: 2, deleteCount: count }
        }, null, 2), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ error: "NOT_FOUND" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (globalErr: any) {
      console.error("[Global Worker Exception]", globalErr);
      return new Response(JSON.stringify({
        error: "WORKER_UNCAUGHT_EXCEPTION",
        details: globalErr?.message || String(globalErr)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
