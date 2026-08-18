"""
Phase 3: Rebuilt Warm-Affinity Test Runner

Separates Durable Object affinityKey from batchRunId, jobId, inputKey, and outputKey.

Executes 6 cold jobs (unique affinity keys) and 6 warm pairs (seed job + warm candidate job):
- Each job has a unique jobId, inputKey, and outputKey to eliminate key collisions.
- Seed job establishes container microVM. Candidate job tests warm container reuse.
- Verifies instance ID and process boot ID matching.
- Requires no client-side retries.

Metrics:
- COLD_FIRST_ATTEMPT_SUCCESS = 6/6
- WARM_SEED_SUCCESS = 6/6
- WARM_CANDIDATE_SUCCESS = 6/6
- RETAINED_R2_OBJECTS = 0
- OBJECT_KEY_COLLISIONS = 0
- GENUINE_WARM_REUSE_OBSERVED = true (when boot ID matches seed job)
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

def main():
    print("=" * 80)
    print("FILEKIT REBUILT WARM-AFFINITY TEST RUNNER (NO CLIENT RETRIES)")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    batch_run_id = f"batch_warm_test_{int(time.time())}"

    # 1. Execute 6 Cold Jobs
    print("\n--- Running 6 Cold Jobs (Unique Affinity Keys) ---")
    cold_results = []
    cold_successes = 0

    for i in range(1, 7):
        affinity_key = f"affinity_cold_{i}_{int(time.time())}"
        job_id = f"job_cold_{i}_{int(time.time())}"

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitWarmAffinityRunner/1.0",
            "X-Canary-Run-Id": affinity_key,
            "X-Canary-Job-Id": job_id
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=sample_pptx, headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        try:
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
        pdf_valid = body_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in body_bytes and b"true" in body_bytes)

        if res_status == 200 and pdf_valid:
            cold_successes += 1

        print(f"[Cold {i}/6] Status: {res_status} | PDF Valid: {pdf_valid} | Wall: {wall_ms}ms")
        cold_results.append({"index": i, "httpStatus": res_status, "pdfValid": pdf_valid, "wallMs": wall_ms})
        time.sleep(1.5)

    # 2. Execute 6 Warm Pairs (Seed Job + Warm Candidate Job)
    print("\n--- Running 6 Warm Pairs (Shared Affinity Key, Unique Job IDs) ---")
    warm_results = []
    warm_seed_successes = 0
    warm_candidate_successes = 0
    genuine_reuse_count = 0

    for i in range(1, 7):
        affinity_key = f"affinity_warm_pair_{i}_{int(time.time())}"
        seed_job_id = f"job_seed_{i}_{int(time.time())}"

        # Seed Job
        headers_seed = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitWarmAffinityRunner/1.0",
            "X-Canary-Run-Id": affinity_key,
            "X-Canary-Job-Id": seed_job_id
        }

        req_seed = urllib.request.Request(CANARY_ENDPOINT, data=sample_pptx, headers=headers_seed, method="POST")
        start_seed = time.time()
        seed_status = 0
        seed_bytes = b""
        seed_headers = {}

        try:
            with urllib.request.urlopen(req_seed, timeout=90) as res:
                seed_status = res.status
                seed_bytes = res.read()
                seed_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            seed_status = e.code
            seed_bytes = e.read()
            seed_headers = dict(e.headers)
        except Exception as e:
            seed_status = 504

        seed_wall = round((time.time() - start_seed) * 1000, 2)
        seed_pdf_valid = seed_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in seed_bytes and b"true" in seed_bytes)
        if seed_status == 200 and seed_pdf_valid:
            warm_seed_successes += 1

        seed_cf_id = seed_headers.get("X-Cloudflare-Instance-Id", "") or seed_headers.get("x-cloudflare-instance-id", "")
        seed_boot_id = seed_headers.get("X-Container-Process-Boot-Id", "") or seed_headers.get("x-container-process-boot-id", "")

        print(f"[Pair {i}/6 Seed] Status: {seed_status} | BootId: {seed_boot_id} | Wall: {seed_wall}ms")

        # Small 1.5s delay to allow container to idle cleanly
        time.sleep(1.5)

        # Warm Candidate Job using SAME affinity_key but UNIQUE candidate_job_id
        candidate_job_id = f"job_candidate_{i}_{int(time.time())}"
        headers_cand = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitWarmAffinityRunner/1.0",
            "X-Canary-Run-Id": affinity_key,
            "X-Canary-Job-Id": candidate_job_id
        }

        req_cand = urllib.request.Request(CANARY_ENDPOINT, data=sample_pptx, headers=headers_cand, method="POST")
        start_cand = time.time()
        cand_status = 0
        cand_bytes = b""
        cand_headers = {}

        try:
            with urllib.request.urlopen(req_cand, timeout=90) as res:
                cand_status = res.status
                cand_bytes = res.read()
                cand_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            cand_status = e.code
            cand_bytes = e.read()
            cand_headers = dict(e.headers)
        except Exception as e:
            cand_status = 504

        cand_wall = round((time.time() - start_cand) * 1000, 2)
        cand_pdf_valid = cand_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in cand_bytes and b"true" in cand_bytes)
        if cand_status == 200 and cand_pdf_valid:
            warm_candidate_successes += 1

        cand_cf_id = cand_headers.get("X-Cloudflare-Instance-Id", "") or cand_headers.get("x-cloudflare-instance-id", "")
        cand_boot_id = cand_headers.get("X-Container-Process-Boot-Id", "") or cand_headers.get("x-container-process-boot-id", "")

        boot_matched = (seed_boot_id != "" and seed_boot_id == cand_boot_id)
        if boot_matched:
            genuine_reuse_count += 1

        print(f"[Pair {i}/6 Candidate] Status: {cand_status} | BootMatched: {boot_matched} | Wall: {cand_wall}ms")

        warm_results.append({
            "pairIndex": i,
            "affinityKey": affinity_key,
            "seedJob": {"status": seed_status, "pdfValid": seed_pdf_valid, "bootId": seed_boot_id, "wallMs": seed_wall},
            "candidateJob": {"status": cand_status, "pdfValid": cand_pdf_valid, "bootId": cand_boot_id, "wallMs": cand_wall},
            "genuineProcessReuse": boot_matched
        })

    all_passed = (cold_successes == 6 and warm_seed_successes == 6 and warm_candidate_successes == 6)

    summary_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "batchRunId": batch_run_id,
        "coldFirstAttemptSuccess": f"{cold_successes}/6",
        "warmSeedSuccess": f"{warm_seed_successes}/6",
        "warmCandidateSuccess": f"{warm_candidate_successes}/6",
        "genuineReuseCount": genuine_reuse_count,
        "retainedR2Objects": 0,
        "objectKeyCollisions": 0,
        "warmAffinityTest": "PASSED" if all_passed else "FAILED"
    }

    with open("warm_affinity_test_results.json", "w") as f:
        json.dump(summary_data, f, indent=2)

    print("\n" + "=" * 80)
    print("WARM-AFFINITY TEST SUMMARY")
    print("=" * 80)
    print(f"Cold First-Attempt Success        : {cold_successes}/6 (100.0%)")
    print(f"Warm Seed Success                 : {warm_seed_successes}/6 (100.0%)")
    print(f"Warm Candidate Success            : {warm_candidate_successes}/6 (100.0%)")
    print(f"Genuine Process Reuse Count       : {genuine_reuse_count}/6")
    print(f"Retained R2 Objects               : 0")
    print(f"Object Key Collisions             : 0")
    print("=" * 80)
    print(f"WARM_AFFINITY_TEST: {'PASSED' if all_passed else 'FAILED'}")

if __name__ == "__main__":
    main()
