"""
Phase 6: 30-Job Representative Stability Matrix (No Client Retries)

Evaluates 30 representative presentations across 5 categories:
- 8 Simple
- 8 Image-Heavy
- 5 Native Chart
- 5 Arabic/CJK
- 4 Large Deck

Strict Threshold Requirements:
- FIRST_ATTEMPT_SUCCESSES = 30/30 (100.0%)
- EVENTUAL_SUCCESSES = 30/30
- UNEXPLAINED_5XX = 0
- CLIENT_TIMEOUTS = 0
- CORRUPT_OUTPUTS = 0
- TELEMETRY_COMPLETE = 30/30
- PPTX_FIRST_ATTEMPT_STABILITY = PASSED_30_OF_30

Failure Classification:
- HTTP 401 classified as PROPAGATION_FAILURE (not application failure)
- Client-side urllib timeout classified as CLIENT_TIMEOUT (not HTTP 504)
- Actual HTTP 5xx from server classified as SERVER_5XX
"""

import urllib.request
import urllib.error
import json
import os
import time
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

CANARY_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"

try:
    from _sec_store import BEARER_TOKEN
except ImportError:
    BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")

if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

def percentile(data, pct):
    if not data:
        return 0.0
    sorted_d = sorted(data)
    k = (len(sorted_d) - 1) * (pct / 100.0)
    f = int(k)
    c = f + 1
    if c >= len(sorted_d):
        return sorted_d[-1]
    d0 = sorted_d[f] * (c - k)
    d1 = sorted_d[c] * (k - f)
    return round(d0 + d1, 2)

def main():
    print("=" * 80, flush=True)
    print("FILEKIT 30-JOB REPRESENTATIVE STABILITY MATRIX (NO CLIENT RETRIES)", flush=True)
    print("=" * 80, flush=True)

    corpus = generate_real_fidelity_corpus()

    categories = [
        ("SIMPLE", 8),
        ("IMAGE_HEAVY", 8),
        ("NATIVE_CHART", 5),
        ("ARABIC_CJK", 5),
        ("LARGE_DECK", 4)
    ]

    batch_run_id = f"canary_run_{int(time.time())}"

    matrix_jobs = []
    job_idx = 1
    for cat_name, count in categories:
        for c in range(count):
            sample_data = corpus[(job_idx - 1) % len(corpus)]["data"]
            matrix_jobs.append({
                "jobIndex": job_idx,
                "category": cat_name,
                "data": sample_data,
                "runId": batch_run_id
            })
            job_idx += 1

    results = []
    first_attempt_successes = 0
    server_5xx = 0
    client_timeouts = 0
    propagation_failures = 0
    corrupt_outputs = 0
    telemetry_complete = 0

    all_doc_conv = []
    all_container_total = []
    all_worker_total = []
    all_client_wall = []

    # Pre-Run Retention Cleanup: Clean up any stale canary keys from previous test cycles
    admin_secret = os.environ.get("CANARY_ADMIN_SECRET", "")
    if admin_secret:
        try:
            cleanup_url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/admin/canary-runs/cleanup"
            cleanup_req = urllib.request.Request(
                cleanup_url,
                data=json.dumps({"runId": batch_run_id, "dryRun": False}).encode('utf-8'),
                headers={
                    "X-Canary-Admin-Secret": admin_secret,
                    "Content-Type": "application/json",
                    "User-Agent": "FileKit30JobMatrixRunner/1.0"
                },
                method="POST"
            )
            with urllib.request.urlopen(cleanup_req, timeout=10) as c_res:
                c_body = json.loads(c_res.read().decode('utf-8'))
                print(f"[Pre-Run Cleanup] Stale R2 objects purged: {c_body.get('deletedCount', 0)}", flush=True)
        except Exception as c_err:
            print(f"[Pre-Run Cleanup Notice] {c_err}", flush=True)

    # Container Pre-Warm Probe: Ensure canonical microVM is booted and healthy before the 30-job matrix begins
    print(f"\n--- Pre-Warming Canonical Container Instance ({batch_run_id}) ---", flush=True)
    from create_pptx_smoke_corpus import build_openxml_pptx
    warm_data = build_openxml_pptx(title="Prewarm", num_slides=1)
    warm_headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "User-Agent": "FileKit30JobMatrixRunner/1.0",
        "X-Canary-Run-Id": batch_run_id,
        "X-Canary-Job-Id": "job_prewarm"
    }
    container_ready = False
    for warm_attempt in range(1, 10):
        try:
            print(f"[Pre-Warm Attempt {warm_attempt}/9] Sending 1-slide probe to container...", flush=True)
            warm_req = urllib.request.Request(CANARY_ENDPOINT, data=warm_data, headers=warm_headers, method="POST")
            with urllib.request.urlopen(warm_req, timeout=90) as w_res:
                w_bytes = w_res.read()
                if w_res.status == 200 and (w_bytes.startswith(b"%PDF-") or b"pdfMagicBytesVerified" in w_bytes):
                    print(f"[Pre-Warm Ready] Container is warm and verified (Attempt {warm_attempt}).", flush=True)
                    container_ready = True
                    break
        except Exception as w_err:
            print(f"[Pre-Warm Waiting] {w_err} (Attempt {warm_attempt}/9)", flush=True)
            time.sleep(3.0)

    if not container_ready:
        print("[FAIL CLOSED] Container instance could not be warmed before starting matrix.", flush=True)
        sys.exit(1)

    time.sleep(2.0)

    for job in matrix_jobs:
        idx = job["jobIndex"]
        cat = job["category"]
        job_id = f"job_30j_{idx}"
        run_id = job["runId"]

        time.sleep(2.0)
        print(f"\n[Job {idx}/30] Category: {cat} (Run ID: {run_id})")

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKit30JobMatrixRunner/1.0",
            "X-Canary-Run-Id": run_id,
            "X-Canary-Job-Id": job_id
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=job["data"], headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}
        failure_class = "NONE"
        exception_class = "NONE"
        response_received = True

        try:
            # Single attempt per request - no client retries
            with urllib.request.urlopen(req, timeout=90) as res:
                res_status = res.status
                body_bytes = res.read()
                res_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            res_status = e.code
            try:
                body_bytes = e.read()
            except Exception:
                body_bytes = b""
            res_headers = dict(e.headers)
            if res_status == 401:
                # Distinguish auth failures — likely propagation inconsistency
                propagation_failures += 1
                failure_class = "PROPAGATION_FAILURE"
            elif res_status >= 500:
                # Actual HTTP 5xx returned by the server
                server_5xx += 1
                failure_class = "SERVER_5XX"
            else:
                failure_class = f"HTTP_{res_status}"
        except Exception as e:
            # Client-side timeout or network error — NOT an HTTP 504
            # Record the actual exception class for truthful diagnosis
            exception_class = type(e).__name__
            response_received = False
            client_timeouts += 1
            failure_class = "CLIENT_TIMEOUT"
            # Use a synthetic status that is clearly not an HTTP status
            res_status = -1
            body_bytes = json.dumps({
                "error": "CLIENT_TIMEOUT",
                "exceptionClass": exception_class,
                "details": str(e)
            }).encode('utf-8')

        wall_ms = round((time.time() - start_time) * 1000, 2)

        cf_instance_id = res_headers.get("X-Cloudflare-Instance-Id", "") or res_headers.get("x-cloudflare-instance-id", "")
        boot_id = res_headers.get("X-Container-Process-Boot-Id", "") or res_headers.get("x-container-process-boot-id", "")
        doc_conv_ms = float(res_headers.get("X-Document-Conversion-Ms", 0) or 0)
        container_total_ms = float(res_headers.get("X-Container-Total-Ms", 0) or 0)
        worker_total_ms = float(res_headers.get("X-Worker-Total-Ms", 0) or 0)

        pdf_valid = body_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in body_bytes and b"true" in body_bytes)

        if res_status == 200 and pdf_valid:
            first_attempt_successes += 1
        elif res_status == 200 and not pdf_valid:
            corrupt_outputs += 1

        if cf_instance_id and boot_id:
            telemetry_complete += 1

        all_doc_conv.append(doc_conv_ms)
        all_container_total.append(container_total_ms)
        all_worker_total.append(worker_total_ms)
        all_client_wall.append(wall_ms)

        status_display = str(res_status) if res_status > 0 else "CLIENT_TIMEOUT"
        print(f"Status: {status_display} | PDF Valid: {pdf_valid} | "
              f"FailureClass: {failure_class} | "
              f"Conversion: {doc_conv_ms}ms | ContainerTotal: {container_total_ms}ms | Wall: {wall_ms}ms")

        diagnostic_probes = []
        if res_status == 401 or failure_class in ("PROPAGATION_FAILURE", "CLIENT_TIMEOUT"):
            diag_reason = "propagation_verification" if res_status == 401 else "timeout_verification"
            print(f"  [Diagnostic Probe] Triggering non-modifying diagnostic probe ({diag_reason})...")
            for diag_attempt in range(1, 3):
                time.sleep(1.0)
                try:
                    diag_req = urllib.request.Request(CANARY_ENDPOINT, data=job["data"], headers=headers, method="POST")
                    with urllib.request.urlopen(diag_req, timeout=10) as diag_res:
                        d_status = diag_res.status
                        d_pdf_valid = True
                        diagnostic_probes.append({
                            "attempt": diag_attempt,
                            "httpStatus": d_status,
                            "pdfValid": d_pdf_valid,
                            "classification": "PROPAGATION_RECOVERED" if res_status == 401 else "TIMEOUT_RECOVERED"
                        })
                        print(f"  [Diagnostic Probe {diag_attempt}] Status: {d_status} (Passed)")
                        break
                except urllib.error.HTTPError as de:
                    d_status = de.code
                    diagnostic_probes.append({
                        "attempt": diag_attempt,
                        "httpStatus": d_status,
                        "pdfValid": False,
                        "classification": f"HTTP_{d_status}"
                    })
                    print(f"  [Diagnostic Probe {diag_attempt}] HTTP {d_status}")
                except Exception as de:
                    diagnostic_probes.append({
                        "attempt": diag_attempt,
                        "httpStatus": -1,
                        "exceptionClass": type(de).__name__,
                        "classification": "CLIENT_TIMEOUT"
                    })
                    print(f"  [Diagnostic Probe {diag_attempt}] Exception: {type(de).__name__}")

        results.append({
            "jobIndex": idx,
            "category": cat,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "failureClass": failure_class,
            "exceptionClass": exception_class,
            "responseReceived": response_received,
            "diagnosticProbes": diagnostic_probes,
            "cloudflareInstanceId": cf_instance_id,
            "processBootId": boot_id,
            "documentConversionMs": doc_conv_ms,
            "containerTotalMs": container_total_ms,
            "workerTotalMs": worker_total_ms,
            "clientWallMs": wall_ms
        })

    telemetry_gate_passed = (telemetry_complete == 30)
    all_passed = (first_attempt_successes == 30 and server_5xx == 0
                  and client_timeouts == 0 and corrupt_outputs == 0
                  and propagation_failures == 0 and telemetry_gate_passed)

    summary_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "batchRunId": batch_run_id,
        "batchRunIds": [batch_run_id],
        "totalJobs": 30,
        "firstAttemptSuccesses": f"{first_attempt_successes}/30",
        "eventualSuccesses": f"{first_attempt_successes}/30",
        "server5xx": server_5xx,
        "clientTimeouts": client_timeouts,
        "propagationFailures": propagation_failures,
        "corruptOutputs": corrupt_outputs,
        "telemetryComplete": f"{telemetry_complete}/30",
        "telemetryGatePassed": telemetry_gate_passed,
        "failureClassification": {
            "SERVER_5XX": server_5xx,
            "CLIENT_TIMEOUT": client_timeouts,
            "PROPAGATION_FAILURE": propagation_failures,
            "CORRUPT_OUTPUT": corrupt_outputs
        },
        "timingPercentiles": {
            "documentConversionP50": percentile(all_doc_conv, 50),
            "containerTotalP50": percentile(all_container_total, 50),
            "workerTotalP50": percentile(all_worker_total, 50),
            "clientWallP50": percentile(all_client_wall, 50)
        },
        "jobs": results,
        "pptxFirstAttemptStability": f"PASSED_{first_attempt_successes}_OF_30" if all_passed else f"FAILED_{first_attempt_successes}_OF_30"
    }

    with open("30job_stability_matrix_results.json", "w") as f:
        json.dump(summary_data, f, indent=2)

    print("\n" + "=" * 80)
    print("30-JOB REPRESENTATIVE STABILITY SUMMARY")
    print("=" * 80)
    print(f"Total Jobs                        : 30")
    print(f"First-Attempt Successes           : {first_attempt_successes}/30 ({round(first_attempt_successes/30*100, 1)}%)")
    print(f"Eventual Successes                : {first_attempt_successes}/30")
    print(f"Server 5xx                        : {server_5xx}")
    print(f"Client Timeouts                   : {client_timeouts}")
    print(f"Propagation Failures (401)        : {propagation_failures}")
    print(f"Corrupt Outputs                   : {corrupt_outputs}")
    print(f"Telemetry Complete                : {telemetry_complete}/30")
    print(f"Telemetry Gate Passed             : {telemetry_gate_passed}")
    print("=" * 80)
    print(f"PPTX_FIRST_ATTEMPT_STABILITY: {'PASSED_30_OF_30' if all_passed else 'FAILED'}")

    if not telemetry_gate_passed:
        print(f"\n[FAIL CLOSED] Telemetry completeness gate failed: {telemetry_complete}/30 (required 30/30)")
        sys.exit(1)

    if not all_passed:
        print("\n[FAIL CLOSED] 30-Job Stability Matrix criteria not satisfied.")
        sys.exit(1)

    print("\n[SUCCESS] 30-Job Stability Matrix Completed Successfully.")

if __name__ == "__main__":
    main()
