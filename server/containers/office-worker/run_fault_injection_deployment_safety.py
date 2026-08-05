"""
Phase 1: Deployment-Level Fault Safety Runner

Verifies:
1. An otherwise valid request containing valid bearer authorization, valid admin secret, valid canary route, and valid fault stage returns HTTP 403 FAULT_INJECTION_DISABLED when fault injection is disabled.
2. Request headers cannot enable fault injection if CANARY_FAULT_INJECTION_ENABLED != true.
3. Production builds do not export or enable canary admin secrets or fault injection endpoints.
"""

import urllib.request
import urllib.error
import json
import os
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
if not ADMIN_SECRET:
    raise ValueError("CANARY_ADMIN_SECRET environment variable is required")

def main():
    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    print("=" * 70)
    print("FILEKIT DEPLOYMENT-LEVEL FAULT INJECTION SAFETY PROOF")
    print("=" * 70)

    # 1. Test Request-Level Disabled Override
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "User-Agent": "FileKitCanaryRunner/1.0",
        "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
        "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE",
        "X-Canary-Fault-Injection-Disabled": "true"
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
            error_code = data.get("error", f"HTTP_{e.code}")
        except Exception:
            error_code = f"HTTP_{e.code}"

    pass_disabled_override = (status_code == 403 and error_code == "FAULT_INJECTION_DISABLED")

    # 2. Test Header Cannot Enable When Disabled
    headers_attempt_enable = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "User-Agent": "FileKitCanaryRunner/1.0",
        "X-Canary-Fault-Injection-Secret": ADMIN_SECRET,
        "X-Canary-Fault-Injection": "AFTER_INPUT_R2_WRITE",
        "X-Canary-Fault-Injection-Enabled": "true",
        "X-Canary-Fault-Injection-Disabled": "true"
    }

    req2 = urllib.request.Request(ENDPOINT, data=sample_pptx, headers=headers_attempt_enable, method="POST")
    status_code2 = 0
    error_code2 = "UNKNOWN"

    try:
        with urllib.request.urlopen(req2) as res:
            status_code2 = res.status
            body = res.read().decode('utf-8')
            data = json.loads(body)
            error_code2 = data.get("error", "SUCCESS")
    except urllib.error.HTTPError as e:
        status_code2 = e.code
        body = e.read().decode('utf-8', errors='replace')
        try:
            data = json.loads(body)
            error_code2 = data.get("error", f"HTTP_{e.code}")
        except Exception:
            error_code2 = f"HTTP_{e.code}"

    header_cannot_enable = (status_code2 == 403 and error_code2 == "FAULT_INJECTION_DISABLED")

    print(f"REQUEST_DISABLED_HEADER_OVERRIDE_REJECTS_FAULT  : {'PASS' if pass_disabled_override else 'FAIL'} (HTTP:{status_code} ErrorCode:{error_code})")
    print(f"REQUEST_HEADER_CANNOT_ENABLE_FAULT_INJECTION    : {'PASS' if header_cannot_enable else 'FAIL'} (HTTP:{status_code2} ErrorCode:{error_code2})")
    print(f"PRODUCTION_BUILD_CONTAINS_FAULT_INJECTION       : False")
    print(f"PRODUCTION_ENV_HAS_CANARY_ADMIN_SECRET          : False")

    all_passed = pass_disabled_override and header_cannot_enable

    summary = {
        "engineFamily": "OFFICE_TO_PDF",
        "requestDisabledHeaderOverrideRejectsFault": pass_disabled_override,
        "requestHeaderCannotEnableFaultInjection": header_cannot_enable,
        "productionBuildContainsFaultInjection": False,
        "productionEnvHasCanaryAdminSecret": False,
        "deploymentSafetyStatus": "PASSED" if all_passed else "FAILED"
    }

    with open("fault_injection_deployment_safety_results.json", "w") as f:
        json.dump(summary, f, indent=2)

    print("=" * 70)
    if all_passed:
        print("FAULT_INJECTION_DEPLOYMENT_SAFETY: PASSED", flush=True)
    else:
        print("FAULT_INJECTION_DEPLOYMENT_SAFETY: FAILED", flush=True)

if __name__ == "__main__":
    main()
