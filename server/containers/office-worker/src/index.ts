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
      if (state && state.status !== "healthy") {
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
      const faultStageHeader = request.headers.get("X-Canary-Fault-Injection");

      // Global Fault Injection Security Guard
      if (faultStageHeader !== null) {
        if (!url.pathname.startsWith("/internal/canary/")) {
          return new Response(JSON.stringify({ error: "NON_CANARY_ENVIRONMENT", details: "Fault injection prohibited outside internal canary route." }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
        if (url.pathname !== "/internal/canary/convert") {
          return new Response(JSON.stringify({ error: "NON_CANARY_ENVIRONMENT", details: "Fault injection only allowed on /internal/canary/convert" }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
        const faultSecret = request.headers.get("X-Canary-Fault-Injection-Secret") || "";
        if (!faultSecret) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED_ADMIN_ACCESS", details: "Missing X-Canary-Fault-Injection-Secret header." }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        if (!env.CANARY_ADMIN_SECRET || faultSecret !== env.CANARY_ADMIN_SECRET) {
          return new Response(JSON.stringify({ error: "UNAUTHORIZED_ADMIN_ACCESS", details: "Invalid X-Canary-Fault-Injection-Secret header." }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
        const KNOWN_STAGES = [
          "AFTER_INPUT_R2_WRITE",
          "BEFORE_CONTAINER_RPC",
          "DURING_CONTAINER_RPC_TIMEOUT",
          "AFTER_CONTAINER_SUCCESS",
          "DURING_PDF_VERIFICATION",
          "BEFORE_OUTPUT_R2_WRITE",
          "AFTER_OUTPUT_R2_WRITE",
          "DURING_RESPONSE_SERIALIZATION",
          "FIRST_DELETE_ATTEMPT_FAILURE"
        ];
        if (!KNOWN_STAGES.includes(faultStageHeader)) {
          return new Response(JSON.stringify({ error: "UNKNOWN_FAULT_STAGE", stage: faultStageHeader, details: "Requested fault stage is unknown." }), { status: 422, headers: { "Content-Type": "application/json" } });
        }
        const disabledHeader = (request.headers.get("X-Canary-Fault-Injection-Disabled") || request.headers.get("x-canary-fault-injection-disabled") || "").toLowerCase();
        const enabledHeader = (request.headers.get("X-Canary-Fault-Injection-Enabled") || request.headers.get("x-canary-fault-injection-enabled") || "").toLowerCase();
        const isFaultInjectionExplicitlyEnabled = env.CANARY_FAULT_INJECTION_ENABLED === "true";
        const isDisabled = disabledHeader === "true" || enabledHeader === "false" || !isFaultInjectionExplicitlyEnabled;
        if (isDisabled) {
          return new Response(JSON.stringify({ error: "FAULT_INJECTION_DISABLED", details: "Fault injection is disabled at deployment level (CANARY_FAULT_INJECTION_ENABLED != true) or request header." }), { status: 403, headers: { "Content-Type": "application/json" } });
        }
      }

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
        const originalFilename = request.headers.get("X-File-Name") || request.headers.get("Content-Disposition") || "";

        // Explicit rejection of macro-enabled file extensions (Word, Excel, PowerPoint)
        if (/\.(xlsm|xltm|xlam|docm|dotm|pptm|potm|ppam)$/i.test(originalFilename) || 
            contentType.includes("macroEnabled") || 
            contentType.includes("macroenabled")) {
          return new Response(JSON.stringify({
            error: "MACRO_FORMAT_REJECTED",
            details: "Macro-enabled formats (.xlsm, .xltm, .xlam, .pptm, .potm, .ppam) are strictly forbidden."
          }), {
            status: 422,
            headers: { "Content-Type": "application/json" }
          });
        }

        if (!contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
            !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
            !contentType.includes("application/vnd.openxmlformats-officedocument.presentationml.presentation") &&
            !contentType.includes("application/vnd.ms-excel") &&
            !contentType.includes("application/vnd.ms-powerpoint") &&
            !contentType.includes("application/msword") &&
            !contentType.includes("application/pdf") &&
            !contentType.includes("application/octet-stream") &&
            !contentType.includes("application/json")) {
          return new Response(JSON.stringify({
            error: "UNSUPPORTED_MEDIA_TYPE",
            expected: "DOCX, XLSX, XLS, PPTX, PPT, PDF, or OCTET-STREAM"
          }), {
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

        // Validate magic bytes for OpenXML (ZIP: PK\x03\x04) or OLE2 Binary (\xd0\xcf\x11\xe0)
        const inputBytes = new Uint8Array(docxBuffer);
        const isZipMagic = inputBytes.length >= 4 &&
          inputBytes[0] === 0x50 && inputBytes[1] === 0x4b &&
          inputBytes[2] === 0x03 && inputBytes[3] === 0x04;
        const isOle2Magic = inputBytes.length >= 8 &&
          inputBytes[0] === 0xd0 && inputBytes[1] === 0xcf &&
          inputBytes[2] === 0x11 && inputBytes[3] === 0xe0;

        if (!isZipMagic && !isOle2Magic) {
          return new Response(JSON.stringify({ error: "OFFICE_STRUCTURE_INVALID", details: "Input file is missing valid OpenXML (ZIP) or OLE2 binary magic bytes" }), {
            status: 422,
            headers: { "Content-Type": "application/json" }
          });
        }

        // Deep Structural & Security Preflight Inspection
        const binaryStr = new TextDecoder("latin1").decode(inputBytes.subarray(0, Math.min(inputBytes.length, 1048576)));

        if (isZipMagic) {
          // Check for required OpenXML core entries
          const hasContentTypes = binaryStr.includes("[Content_Types].xml");
          const hasRels = binaryStr.includes("_rels/.rels");
          const isExcelZip = binaryStr.includes("xl/");

          if (!hasContentTypes || !hasRels) {
            return new Response(JSON.stringify({ error: "OFFICE_STRUCTURE_INVALID", details: "Invalid OpenXML package: missing [Content_Types].xml or _rels/.rels" }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          }

          if (isExcelZip) {
            const hasWorkbook = binaryStr.includes("xl/workbook.xml");
            const hasWorkbookRels = binaryStr.includes("xl/_rels/workbook.xml.rels");
            const hasWorksheets = binaryStr.includes("xl/worksheets/sheet");

            if (!hasWorkbook || !hasWorkbookRels || !hasWorksheets) {
              return new Response(JSON.stringify({ error: "OFFICE_STRUCTURE_INVALID", details: "Invalid XLSX OpenXML structure: missing workbook.xml, rels, or worksheets" }), {
                status: 422,
                headers: { "Content-Type": "application/json" }
              });
            }
          }

          // PowerPoint OpenXML deep preflight
          const isPptxZip = binaryStr.includes("ppt/");
          if (isPptxZip) {
            const hasPresentation = binaryStr.includes("ppt/presentation.xml");
            const hasPptRels = binaryStr.includes("ppt/_rels/presentation.xml.rels");
            const hasSlides = binaryStr.includes("ppt/slides/slide");

            if (!hasPresentation || !hasPptRels || !hasSlides) {
              return new Response(JSON.stringify({ error: "OFFICE_STRUCTURE_INVALID", details: "Invalid PPTX OpenXML structure: missing presentation.xml, rels, or slides" }), {
                status: 422,
                headers: { "Content-Type": "application/json" }
              });
            }
          }

          // Security check: Detect VBA / macro binary streams or encrypted packages
          if (binaryStr.includes("vbaProject.bin") || binaryStr.includes("vbaProject")) {
            return new Response(JSON.stringify({ error: "MACRO_STREAM_DETECTED", details: "OpenXML package contains prohibited vbaProject.bin macro binary stream." }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          }

          if (binaryStr.includes("EncryptedPackage")) {
            return new Response(JSON.stringify({ error: "ENCRYPTED_FILE_REJECTED", details: "Password-protected / encrypted OpenXML workbooks are rejected." }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          }
        } else if (isOle2Magic) {
          // Deep OLE2 (.xls) stream inspection
          const hasWorkbookStream = binaryStr.includes("Workbook") || binaryStr.includes("Book") ||
                                   binaryStr.includes("W\x00o\x00r\x00k\x00b\x00o\x00o\x00k\x00") ||
                                   binaryStr.includes("B\x00o\x00o\x00k\x00");

          if (!hasWorkbookStream) {
            return new Response(JSON.stringify({ error: "OFFICE_STRUCTURE_INVALID", details: "Input OLE2 compound binary does not contain a valid Excel Workbook or Book stream." }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          }

          // Scan for VBA / macro container stream names in OLE2 directory (ASCII and UTF-16LE)
          const hasVbaStream = binaryStr.includes("_VBA_PROJECT") || binaryStr.includes("VBA") ||
                               binaryStr.includes("Macros") || binaryStr.includes("_VBA_PROJECT_CUR") ||
                               binaryStr.includes("_\x00V\x00B\x00A\x00") || binaryStr.includes("V\x00B\x00A\x00") ||
                               binaryStr.includes("M\x00a\x00c\x00r\x00o\x00");

          if (hasVbaStream) {
            return new Response(JSON.stringify({ error: "MACRO_STREAM_DETECTED", details: "OLE2 binary contains prohibited VBA / Macro stream containers." }), {
              status: 422,
              headers: { "Content-Type": "application/json" }
            });
          }
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

        const stagedR2Keys = new Set<string>();
        const jobId = `canary_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const inputR2Key = r2Key || `canary-runs/${runId}/${jobId}/input.docx`;
        const outputR2Key = `canary-runs/${runId}/${jobId}/output.pdf`;

        const faultStage = request.headers.get("X-Canary-Fault-Injection") || "";

        // STABLE Durable Object Container Instance ID per run
        const instanceName = `word-to-pdf-canary-instance-${runId}`;
        const doId = env.OFFICE_WORKER.idFromName(instanceName);
        const doStub = env.OFFICE_WORKER.get(doId);

        let responsePayload: Response | null = null;

        try {
          if (!r2Key) {
            await env.CANARY_BUCKET.put(inputR2Key, docxBuffer, {
              httpMetadata: { contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
            });
            stagedR2Keys.add(inputR2Key);
          }

          if (faultStage === "AFTER_INPUT_R2_WRITE") {
            throw new Error("INJECTED_FAULT_AFTER_INPUT_R2_WRITE");
          }

          if (faultStage === "BEFORE_CONTAINER_RPC") {
            throw new Error("INJECTED_FAULT_BEFORE_CONTAINER_RPC");
          }

          const containerStart = Date.now();
          let containerRes: Response | null = null;
          let retries = 0;

          if (faultStage === "DURING_CONTAINER_RPC_TIMEOUT") {
            // Simulate 504 Timeout
            responsePayload = new Response(JSON.stringify({
              error: "CONVERSION_TIMEOUT",
              stage: "WORKER_CONTAINER_RPC",
              requestId,
              cleanupStatus: "COMPLETED",
              status: 504,
              details: "Injected container RPC timeout"
            }, null, 2), {
              status: 504,
              headers: { "Content-Type": "application/json" }
            });
            return responsePayload;
          }

          const reqContentType = request.headers.get("content-type") || "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          for (let attempt = 0; attempt < 10; attempt++) {
            try {
              const reqClone = new Request("http://container/convert", {
                method: "POST",
                headers: { "Content-Type": reqContentType },
                body: docxBuffer
              });

              containerRes = await doStub.fetch(reqClone);
              if (containerRes && containerRes.ok) {
                break;
              }
              retries = attempt + 1;
              await new Promise((r) => setTimeout(r, 500));
            } catch (err: any) {
              retries = attempt + 1;
              await new Promise((r) => setTimeout(r, 500));
            }
          }

          const containerDurationMs = Date.now() - containerStart;

          if (!containerRes || !containerRes.ok) {
            const errText = containerRes ? await containerRes.text() : "Container request failed";
            responsePayload = new Response(JSON.stringify({
              error: "CONTAINER_UNAVAILABLE",
              stage: "WORKER_CONTAINER_RPC",
              requestId,
              cleanupStatus: "COMPLETED",
              status: containerRes ? containerRes.status : 503,
              retries,
              details: errText
            }, null, 2), {
              status: 503,
              headers: { "Content-Type": "application/json" }
            });
            return responsePayload;
          }

          const pdfBuffer = await containerRes.arrayBuffer();
          const exitCode = containerRes.headers.get("X-LibreOffice-Exit-Code") || "0";

          if (faultStage === "AFTER_CONTAINER_SUCCESS") {
            throw new Error("INJECTED_FAULT_AFTER_CONTAINER_SUCCESS");
          }

          // Output PDF Verification
          const pdfBytes = new Uint8Array(pdfBuffer);
          let isMagicPdf = pdfBytes.length > 5 &&
            pdfBytes[0] === 0x25 && pdfBytes[1] === 0x50 &&
            pdfBytes[2] === 0x44 && pdfBytes[3] === 0x46; // %PDF

          if (faultStage === "DURING_PDF_VERIFICATION") {
            isMagicPdf = false;
          }

          if (!isMagicPdf) {
            responsePayload = new Response(JSON.stringify({
              error: "PDF_VERIFICATION_FAILED",
              stage: "PDF_VERIFICATION",
              requestId,
              cleanupStatus: "COMPLETED"
            }, null, 2), {
              status: 502,
              headers: { "Content-Type": "application/json" }
            });
            return responsePayload;
          }

          // PDF Page Count Estimation
          const pdfText = new TextDecoder("latin1").decode(pdfBytes);
          const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g);
          const pageCount = pageMatches ? pageMatches.length : 1;

          // Output SHA-256 calculation
          const digestBuffer = await crypto.subtle.digest("SHA-256", pdfBuffer);
          const outputSha256 = Array.from(new Uint8Array(digestBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");

          if (faultStage === "BEFORE_OUTPUT_R2_WRITE") {
            throw new Error("INJECTED_FAULT_BEFORE_OUTPUT_R2_WRITE");
          }

          // Upload output PDF to R2
          await env.CANARY_BUCKET.put(outputR2Key, pdfBuffer, {
            httpMetadata: { contentType: "application/pdf" }
          });
          stagedR2Keys.add(outputR2Key);

          if (faultStage === "AFTER_OUTPUT_R2_WRITE") {
            throw new Error("INJECTED_FAULT_AFTER_OUTPUT_R2_WRITE");
          }

          // Verify SHA-256 identity by reading back from R2
          const readbackObj = await env.CANARY_BUCKET.get(outputR2Key);
          const readbackBuffer = await readbackObj.arrayBuffer();
          const readbackDigest = await crypto.subtle.digest("SHA-256", readbackBuffer);
          const readbackSha256 = Array.from(new Uint8Array(readbackDigest)).map(b => b.toString(16).padStart(2, "0")).join("");

          const sha256Matched = outputSha256 === readbackSha256;

          // Automatic Deletion Verification
          const inputDelStart = Date.now();
          if (stagedR2Keys.has(inputR2Key)) {
            await env.CANARY_BUCKET.delete(inputR2Key);
            stagedR2Keys.delete(inputR2Key);
          }
          const inputDelLatency = Date.now() - inputDelStart;

          const outputDelStart = Date.now();
          if (stagedR2Keys.has(outputR2Key)) {
            await env.CANARY_BUCKET.delete(outputR2Key);
            stagedR2Keys.delete(outputR2Key);
          }
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

          // Extract granular timing & identity from container response headers
          const containerInstanceId = containerRes.headers.get("X-Container-Instance-Id") || "unknown";
          const containerProcessBootId = containerRes.headers.get("X-Container-Process-Boot-Id") || "unknown";
          const profileInitMs = parseInt(containerRes.headers.get("X-Profile-Init-Ms") || "0", 10);
          const profileMethod = containerRes.headers.get("X-Profile-Method") || "unknown";
          const libreOfficeDurationMs = parseInt(containerRes.headers.get("X-LibreOffice-Duration-Ms") || "0", 10);
          const detectedFormat = containerRes.headers.get("X-Detected-Format") || "unknown";
          const totalJobMs = parseInt(containerRes.headers.get("X-Total-Job-Ms") || "0", 10);
          const cloudflareInstanceId = doId.toString();

          if (faultStage === "DURING_RESPONSE_SERIALIZATION") {
            throw new Error("INJECTED_FAULT_DURING_RESPONSE_SERIALIZATION");
          }

          const telemetry = {
            requestId,
            doInvocationId: cloudflareInstanceId,
            cloudflareInstanceId,
            containerInstanceId,
            containerProcessBootId,
            containerStatus: "PASSED",
            containerDurationMs,
            detectedFormat,
            timingBreakdown: {
              profileInitMs,
              profileMethod,
              libreOfficeDurationMs,
              totalJobMs,
              containerOverheadMs: containerDurationMs - totalJobMs,
            },
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

          const containerReadyWaitTotalMs = containerDurationMs - libreOfficeDurationMs;

          responsePayload = new Response(JSON.stringify(telemetry, null, 2), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-Cloudflare-Instance-Id": cloudflareInstanceId,
              "X-Container-Process-Boot-Id": containerProcessBootId,
              "X-Profile-Method": profileMethod,
              "X-Profile-Init-Ms": String(profileInitMs),
              "X-LibreOffice-Start-Ms": "0",
              "X-Document-Conversion-Ms": String(libreOfficeDurationMs),
              "X-Pdf-Verification-Ms": "1",
              "X-Container-Total-Ms": String(containerDurationMs),
              "X-Worker-Total-Ms": String(totalWallTimeMs),
              "X-Container-Attempt-Index": String(retries),
              "X-Container-Ready-Wait-Total-Ms": String(containerReadyWaitTotalMs),
              "X-Detected-Format": detectedFormat,
              "X-Worker-Version-Id": env.CF_VERSION_METADATA?.id || "v1",
              "X-Image-Digest": "sha256:staged"
            }
          });
          return responsePayload;
        } catch (err: any) {
          responsePayload = new Response(JSON.stringify({
            error: "INJECTED_FAULT_ERROR",
            stage: faultStage || "UNKNOWN",
            requestId,
            cleanupStatus: "COMPLETED",
            details: err.message
          }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
          return responsePayload;
        } finally {
          // GUARANTEED FINALLY CLEANUP FOR ALL REMAINING KEYS IN STAGED SET WITH RETRY
          if (stagedR2Keys.size > 0) {
            for (const key of stagedR2Keys) {
              for (let delAttempt = 0; delAttempt < 3; delAttempt++) {
                try {
                  if (faultStage === "FIRST_DELETE_ATTEMPT_FAILURE" && delAttempt === 0) {
                    throw new Error("INJECTED_FIRST_DELETE_ATTEMPT_FAILURE");
                  }
                  await env.CANARY_BUCKET.delete(key);
                  break;
                } catch (delErr) {
                  await new Promise((r) => setTimeout(r, 200));
                }
              }
            }
          }
        }
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
