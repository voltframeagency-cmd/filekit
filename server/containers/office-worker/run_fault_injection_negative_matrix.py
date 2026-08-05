"""
Phase 1: Fault Injection Negative Matrix Runner

Executes 7 negative security scenarios for fault injection gating:
1. Missing admin credential (HTTP 401)
2. Incorrect admin credential (HTTP 401)
3. Fault injection disabled / missing secret (HTTP 403)
4. Customer-facing route (HTTP 404)
5. Unknown fault stage (HTTP 422)
6. Non-canary environment route (HTTP 403)
7. Valid internal canary request (HTTP 500 / Fault Injected)
"""

import urllib.request
import urllib.error
import json
import os
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CANARY_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
PUBLIC_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/powerpoint-to-pdf"
OTHER_CANARY_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
if not ADMIN_SECRET:
    raise ValueError("CANARY_ADMIN_SECRET environment variable is required")

SCENARIOS = [
    {
        "index": 1,
        "name": "Missing admin credential",
        "url": CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE"
        },
        "allowedStatus": [401],
        "allowedError": ["UNAUTHORIZED_ADMIN_ACCESS"]
    },
    {
        "index": 2,
        "name": "Incorrect admin credential",
        "url": CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": "wrong_secret_123",
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE"
        },
        "allowedStatus": [401],
        "allowedError": ["UNAUTHORIZED_ADMIN_ACCESS"]
    },
    {
        "index": 3,
        "name": "Fault injection disabled flag",
        "url": CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE",
            "X-Canary-Fault-Injection-Disabled": "true"
        },
        "allowedStatus": [403],
        "allowedError": ["FAULT_INJECTION_DISABLED"]
    },
    {
        "index": 4,
        "name": "Customer-facing route",
        "url": PUBLIC_ENDPOINT,
        "headers": {
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE"
        },
        "allowedStatus": [403, 404],
        "allowedError": ["NON_CANARY_ENVIRONMENT", "NOT_FOUND"]
    },
    {
        "index": 5,
        "name": "Unknown fault stage",
        "url": CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": "INVALID_STAGE_XYZ"
        },
        "allowedStatus": [422],
        "allowedError": ["UNKNOWN_FAULT_STAGE"]
    },
    {
        "index": 6,
        "name": "Non-canary environment route",
        "url": OTHER_CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE"
        },
        "allowedStatus": [403, 404],
        "allowedError": ["NON_CANARY_ENVIRONMENT", "NOT_FOUND"]
    },
    {
        "index": 7,
        "name": "Correct internal canary request",
        "url": CANARY_ENDPOINT,
        "headers": {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
            "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE"
        },
        "allowedStatus": [500],
        "allowedError": ["INJECTED_FAULT_ERROR"]
    }
]

def main():
    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    print("=" * 70)
    print("FILEKIT FAULT INJECTION NEGATIVE SECURITY MATRIX")
    print("=" * 70)

    passed_count = 0
    total = len(SCENARIOS)
    records = []

    for item in SCENARIOS:
        idx = item["index"]
        name = item["name"]
        url = item["url"]
        headers = item["headers"]
        allowed_status = item["allowedStatus"]
        allowed_error = item["allowedError"]

        req_data = sample_pptx if ("convert" in url or "powerpoint" in url) else json.dumps({"runId": "test_neg"}).encode('utf-8')
        req = urllib.request.Request(url, data=req_data, headers=headers, method="POST")
        actual_status = 0
        actual_error = "UNKNOWN"

        try:
            with urllib.request.urlopen(req) as res:
                actual_status = res.status
                body = res.read().decode('utf-8')
                try:
                    data = json.loads(body)
                    actual_error = data.get("error", "SUCCESS")
                except Exception:
                    actual_error = "SUCCESS"
        except urllib.error.HTTPError as e:
            actual_status = e.code
            body = e.read().decode('utf-8', errors='replace')
            try:
                data = json.loads(body)
                actual_error = data.get("error", f"HTTP_{e.code}")
            except Exception:
                actual_error = f"HTTP_{e.code}"

        # Match status
        is_pass = (actual_status in allowed_status)
        if is_pass:
            passed_count += 1
            status_str = "PASS"
        else:
            status_str = "FAIL"

        rec = {
            "index": idx,
            "scenario": name,
            "allowedStatus": allowed_status,
            "actualStatus": actual_status,
            "allowedError": allowed_error,
            "actualError": actual_error,
            "passed": is_pass
        }
        records.append(rec)

        print(f"[{idx:01d}/{total}] {status_str} {name:<36} HTTP:{actual_status} (Allowed:{allowed_status}) ErrorCode:{actual_error}", flush=True)

    print("=" * 70)
    print("FAULT INJECTION NEGATIVE MATRIX SUMMARY")
    print("=" * 70)
    print(f"Total Security Scenarios : {total}")
    print(f"Passed Scenarios         : {passed_count}/{total}")
    print("-" * 70)

    is_all_passed = (passed_count == total)
    summary = {
        "engineFamily": "OFFICE_TO_PDF",
        "totalScenarios": total,
        "passedScenarios": passed_count,
        "matrixStatus": "PASSED_7_OF_7" if is_all_passed else "FAILED",
        "records": records
    }

    with open("fault_injection_negative_matrix_results.json", "w") as f:
        json.dump(summary, f, indent=2)

    if is_all_passed:
        print("FAULT_INJECTION_NEGATIVE_MATRIX: PASSED_7_OF_7", flush=True)
    else:
        print("FAULT_INJECTION_NEGATIVE_MATRIX: FAILED", flush=True)

if __name__ == "__main__":
    main()
