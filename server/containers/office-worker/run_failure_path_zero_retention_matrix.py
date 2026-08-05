"""
Phase 2: Failure-Path Zero-Retention Fault Injection Matrix Runner

Injects controlled faults across 9 worker execution stages and verifies
that the top-level finally cleanup block executes deterministically, leaving 0 R2 objects.
"""

import urllib.request
import urllib.error
import json
import os
import sys
import uuid
import time
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
if not ADMIN_SECRET:
    raise ValueError("CANARY_ADMIN_SECRET environment variable is required")

STAGES = [
    "AFTER_INPUT_R2_WRITE",
    "BEFORE_CONTAINER_RPC",
    "DURING_CONTAINER_RPC_TIMEOUT",
    "AFTER_CONTAINER_SUCCESS",
    "DURING_PDF_VERIFICATION",
    "BEFORE_OUTPUT_R2_WRITE",
    "AFTER_OUTPUT_R2_WRITE",
    "DURING_RESPONSE_SERIALIZATION",
    "FIRST_DELETE_ATTEMPT_FAILURE"
]

def main():
    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    print("=" * 70)
    print("FILEKIT FAILURE-PATH ZERO-RETENTION FAULT INJECTION MATRIX")
    print("=" * 70)

    passed_matrix_count = 0
    total_stages = len(STAGES)

    for idx, stage in enumerate(STAGES, 1):
        run_id = f"fault_run_{idx}_{stage.lower()}_{uuid.uuid4().hex[:6]}"
        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Run-ID": run_id,
            "X-Canary-Job-Index": "1",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": stage
        }

        req = urllib.request.Request(ENDPOINT, data=sample_pptx, headers=headers, method="POST")
        status_code = 0
        error_code = "UNKNOWN"

        try:
            with urllib.request.urlopen(req) as res:
                status_code = res.status
                body = res.read().decode('utf-8')
                data = json.loads(body)
                error_code = data.get("error", "SUCCESS")
        except urllib.error.HTTPError as e:
            status_code = e.code
            body = e.read().decode('utf-8', errors='replace')
            try:
                data = json.loads(body)
                error_code = data.get("error", "HTTP_ERROR")
            except Exception:
                error_code = f"HTTP_{e.code}"

        # Verify zero retention via inspect API
        time.sleep(0.3)
        insp_url = f"{INSPECT_ENDPOINT}?runId={run_id}"
        insp_req = urllib.request.Request(insp_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
        remaining_objects = -1
        with urllib.request.urlopen(insp_req) as insp_res:
            insp_data = json.loads(insp_res.read().decode('utf-8'))
            remaining_objects = insp_data.get("remainingObjectCount", -1)

        pass_stage = (remaining_objects == 0)
        if pass_stage:
            passed_matrix_count += 1
            status_str = "PASS"
        else:
            status_str = "FAIL"

        print(f"[{idx:02d}/{total_stages}] {status_str} {stage:<32} HTTP:{status_code} ErrorCode:{error_code:<30} RemainingObjects:{remaining_objects}", flush=True)

    print("=" * 70)
    print("FAILURE-PATH ZERO-RETENTION MATRIX SUMMARY")
    print("=" * 70)
    print(f"Total Injection Scenarios : {total_stages}")
    print(f"Zero Retention Confirmed  : {passed_matrix_count}/{total_stages}")
    print("-" * 70)

    if passed_matrix_count == total_stages:
        print("FAILURE_PATH_ZERO_RETENTION_MATRIX: PASSED", flush=True)
    else:
        print("FAILURE_PATH_ZERO_RETENTION_MATRIX: FAILED", flush=True)

if __name__ == "__main__":
    main()
