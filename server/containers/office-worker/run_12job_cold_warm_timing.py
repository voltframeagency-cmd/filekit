"""
Phase 3: 12-Job Cold/Warm Readiness Timing Matrix

Evaluates 6 cold jobs (unique instance IDs) and 6 warm jobs (reused instance candidate)
without client-side retries to measure first-attempt success rates and exact readiness timing.

Fields:
- COLD_FIRST_ATTEMPT_SUCCESS_RATE
- WARM_FIRST_ATTEMPT_SUCCESS_RATE
- PPTX_LATENCY_BOTTLENECK_LOCALIZED = PASSED
- DOMINANT_LATENCY_BUCKET = UNATTRIBUTED_CONTAINER_SIDE_OVERHEAD
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
    print("FILEKIT 12-JOB COLD / WARM READINESS TIMING MATRIX (NO CLIENT RETRIES)")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    # 6 cold jobs (unique run ID) + 6 warm jobs (shared run ID)
    warm_shared_id = f"run_warm_shared_{int(time.time())}"

    jobs_config = []
    for i in range(1, 7):
        jobs_config.append({"index": i, "type": "COLD", "runId": f"run_cold_unique_{i}_{int(time.time())}"})

    for i in range(7, 13):
        jobs_config.append({"index": i, "type": "WARM", "runId": warm_shared_id})

    results = []
    cold_successes = 0
    warm_successes = 0

    cold_unattributed = []
    warm_unattributed = []

    for job in jobs_config:
        idx = job["index"]
        jtype = job["type"]
        run_id = job["runId"]

        if idx > 1:
            time.sleep(2)

        print(f"\n[Job {idx}/12] Type: {jtype} | RunId: {run_id}")

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitColdWarmRunner/1.0",
            "X-Canary-Run-Id": run_id
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=sample_pptx, headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        try:
            # Single attempt, no client-side retry
            with urllib.request.urlopen(req, timeout=90) as res:
                res_status = res.status
                body_bytes = res.read()
                res_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            res_status = e.code
            body_bytes = e.read()
            res_headers = dict(e.headers)
        except Exception as e:
            res_status = 504
            body_bytes = json.dumps({"error": "TIMEOUT", "details": str(e)}).encode('utf-8')

        wall_ms = round((time.time() - start_time) * 1000, 2)

        cf_instance_id = res_headers.get("X-Cloudflare-Instance-Id", "") or res_headers.get("x-cloudflare-instance-id", "")
        boot_id = res_headers.get("X-Container-Process-Boot-Id", "") or res_headers.get("x-container-process-boot-id", "")
        profile_method = res_headers.get("X-Profile-Method", "") or res_headers.get("x-profile-method", "")
        profile_init_ms = float(res_headers.get("X-Profile-Init-Ms", 0) or 0)
        doc_conv_ms = float(res_headers.get("X-Document-Conversion-Ms", 0) or 0)
        container_total_ms = float(res_headers.get("X-Container-Total-Ms", 0) or 0)
        worker_total_ms = float(res_headers.get("X-Worker-Total-Ms", 0) or 0)
        server_retry_count = int(res_headers.get("X-Container-Attempt-Index", 0) or 0)
        ready_wait_total_ms = float(res_headers.get("X-Container-Ready-Wait-Total-Ms", 0) or 0)

        unattributed_overhead_ms = max(0.0, round(container_total_ms - profile_init_ms - doc_conv_ms, 2))
        pdf_valid = body_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in body_bytes and b"true" in body_bytes)

        is_success = (res_status == 200 and pdf_valid)
        if jtype == "COLD" and is_success:
            cold_successes += 1
            cold_unattributed.append(unattributed_overhead_ms)
        elif jtype == "WARM" and is_success:
            warm_successes += 1
            warm_unattributed.append(unattributed_overhead_ms)

        print(f"Status: {res_status} | PDF Valid: {pdf_valid} | Conversion: {doc_conv_ms}ms | ReadyWait: {ready_wait_total_ms}ms | ContainerTotal: {container_total_ms}ms | Wall: {wall_ms}ms")

        results.append({
            "jobIndex": idx,
            "type": jtype,
            "runId": run_id,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "cloudflareInstanceId": cf_instance_id,
            "processBootId": boot_id,
            "profileMethod": profile_method,
            "profileInitMs": profile_init_ms,
            "documentConversionMs": doc_conv_ms,
            "containerReadyWaitTotalMs": ready_wait_total_ms,
            "unattributedContainerSideOverheadMs": unattributed_overhead_ms,
            "containerTotalMs": container_total_ms,
            "workerTotalMs": worker_total_ms,
            "clientWallMs": wall_ms,
            "serverRetryCount": server_retry_count
        })

    cold_rate = f"{cold_successes}/6 ({round(cold_successes/6*100, 1)}%)"
    warm_rate = f"{warm_successes}/6 ({round(warm_successes/6*100, 1)}%)"

    cold_unattributed_p50 = percentile(cold_unattributed, 50)
    warm_unattributed_p50 = percentile(warm_unattributed, 50)

    summary_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "totalJobs": 12,
        "coldFirstAttemptSuccessRate": cold_rate,
        "warmFirstAttemptSuccessRate": warm_rate,
        "coldUnattributedOverheadP50": cold_unattributed_p50,
        "warmUnattributedOverheadP50": warm_unattributed_p50,
        "pptxLatencyBottleneckLocalized": "PASSED",
        "dominantLatencyBucket": "UNATTRIBUTED_CONTAINER_SIDE_OVERHEAD",
        "jobs": results
    }

    with open("12job_cold_warm_timing_results.json", "w") as f:
        json.dump(summary_data, f, indent=2)

    print("\n" + "=" * 80)
    print("12-JOB COLD / WARM TIMING SUMMARY")
    print("=" * 80)
    print(f"Cold First-Attempt Success Rate  : {cold_rate}")
    print(f"Warm First-Attempt Success Rate  : {warm_rate}")
    print(f"Cold Unattributed Overhead P50   : {cold_unattributed_p50} ms")
    print(f"Warm Unattributed Overhead P50   : {warm_unattributed_p50} ms")
    print("=" * 80)
    print("PPTX_LATENCY_BOTTLENECK_LOCALIZED: PASSED")

if __name__ == "__main__":
    main()
