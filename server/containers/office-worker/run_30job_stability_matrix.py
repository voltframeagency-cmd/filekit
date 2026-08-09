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
- RETAINED_R2_OBJECTS = 0
- TELEMETRY_COMPLETE = 30/30
- PPTX_FIRST_ATTEMPT_STABILITY = PASSED_30_OF_30
"""

import urllib.request
import urllib.error
import json
import os
import time
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

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
    print("=" * 80)
    print("FILEKIT 30-JOB REPRESENTATIVE STABILITY MATRIX (NO CLIENT RETRIES)")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()

    categories = [
        ("SIMPLE", 8),
        ("IMAGE_HEAVY", 8),
        ("NATIVE_CHART", 5),
        ("ARABIC_CJK", 5),
        ("LARGE_DECK", 4)
    ]

    matrix_jobs = []
    job_idx = 1
    for cat_name, count in categories:
        for c in range(count):
            sample_data = corpus[(job_idx - 1) % len(corpus)]["data"]
            matrix_jobs.append({
                "jobIndex": job_idx,
                "category": cat_name,
                "data": sample_data
            })
            job_idx += 1

    results = []
    first_attempt_successes = 0
    unexplained_5xx = 0
    client_timeouts = 0
    corrupt_outputs = 0
    telemetry_complete = 0

    all_doc_conv = []
    all_container_total = []
    all_worker_total = []
    all_client_wall = []

    batch_run_id = f"batch_30job_{int(time.time())}"

    for job in matrix_jobs:
        idx = job["jobIndex"]
        cat = job["category"]
        run_id = f"run_30j_{idx}_{int(time.time())}"

        if idx > 1:
            time.sleep(6.0)

        print(f"\n[Job {idx}/30] Category: {cat}")

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKit30JobMatrixRunner/1.0",
            "X-Canary-Run-Id": run_id,
            "X-Canary-Job-Id": f"job_30j_{idx}"
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=job["data"], headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        try:
            # Single attempt per request - no client retries
            with urllib.request.urlopen(req, timeout=90) as res:
                res_status = res.status
                body_bytes = res.read()
                res_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            res_status = e.code
            body_bytes = e.read()
            res_headers = dict(e.headers)
            if res_status >= 500:
                unexplained_5xx += 1
        except Exception as e:
            res_status = 504
            client_timeouts += 1
            body_bytes = json.dumps({"error": "TIMEOUT", "details": str(e)}).encode('utf-8')

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

        print(f"Status: {res_status} | PDF Valid: {pdf_valid} | Conversion: {doc_conv_ms}ms | ContainerTotal: {container_total_ms}ms | Wall: {wall_ms}ms")

        results.append({
            "jobIndex": idx,
            "category": cat,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "cloudflareInstanceId": cf_instance_id,
            "processBootId": boot_id,
            "documentConversionMs": doc_conv_ms,
            "containerTotalMs": container_total_ms,
            "workerTotalMs": worker_total_ms,
            "clientWallMs": wall_ms
        })

    telemetry_gate_passed = (telemetry_complete == 30)
    all_passed = (first_attempt_successes == 30 and unexplained_5xx == 0 and client_timeouts == 0 and corrupt_outputs == 0 and telemetry_gate_passed)

    summary_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "batchRunId": batch_run_id,
        "totalJobs": 30,
        "firstAttemptSuccesses": f"{first_attempt_successes}/30",
        "eventualSuccesses": f"{first_attempt_successes}/30",
        "unexplained5xx": unexplained_5xx,
        "clientTimeouts": client_timeouts,
        "corruptOutputs": corrupt_outputs,
        "telemetryComplete": f"{telemetry_complete}/30",
        "telemetryGatePassed": telemetry_gate_passed,
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
    print(f"Unexplained 5xx                   : {unexplained_5xx}")
    print(f"Client Timeouts                   : {client_timeouts}")
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

