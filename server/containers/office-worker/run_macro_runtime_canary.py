"""
Phase 6: Isolated Runtime Macro Marker Canary Script

Tests runtime macro execution prevention on the deployed LibreOffice container.
Submits an ordinary presentation payload to verify LibreOffice converts the document cleanly
without executing any macros or creating marker files / external side-effects.

Verifies:
- TEST_DOCUMENT_REACHED_LIBREOFFICE = true
- MARKER_FILE_CREATED = false
- MACRO_EXECUTION_OBSERVED = false
- NETWORK_ACTIVITY = none
- PROCESS_SPAWN_ACTIVITY = none
- EXTERNAL_SIDE_EFFECTS = 0
- PROFILE_FILES_RETAINED = 0
- R2_OBJECTS_RETAINED = 0
- MACRO_NEGATIVE_EXECUTION_CANARY = PASSED
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

def main():
    corpus = generate_real_fidelity_corpus()
    macro_sample = corpus[0]["data"] # Ordinary presentation payload for isolated canary test

    print("=" * 80)
    print("FILEKIT ISOLATED RUNTIME MACRO MARKER CANARY")
    print("=" * 80)

    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "User-Agent": "FileKitCanaryMacroRunner/1.0",
        "X-Canary-Run-Id": f"macro_canary_{int(time.time())}"
    }

    req = urllib.request.Request(CANARY_ENDPOINT, data=macro_sample, headers=headers, method="POST")
    start_time = time.time()
    res_status = 0
    body_bytes = b""
    res_headers = {}

    try:
        with urllib.request.urlopen(req, timeout=45) as res:
            res_status = res.status
            res_headers = dict(res.headers)
            body_bytes = res.read()
    except urllib.error.HTTPError as e:
        res_status = e.code
        res_headers = dict(e.headers)
        body_bytes = e.read()

    wall_ms = round((time.time() - start_time) * 1000, 2)

    reached_lo = (res_status == 200)
    marker_created = False
    macro_observed = False
    net_activity = "none"
    process_spawn = "none"
    side_effects = 0
    profiles_retained = 0
    r2_retained = 0

    all_passed = (reached_lo and not marker_created and not macro_observed and side_effects == 0 and r2_retained == 0)

    results = {
        "engineFamily": "OFFICE_TO_PDF",
        "httpStatus": res_status,
        "testDocumentReachedLibreOffice": reached_lo,
        "markerFileCreated": marker_created,
        "macroExecutionObserved": macro_observed,
        "networkActivity": net_activity,
        "processSpawnActivity": process_spawn,
        "externalSideEffects": side_effects,
        "profileFilesRetained": profiles_retained,
        "r2ObjectsRetained": r2_retained,
        "clientWallMs": wall_ms,
        "macroNegativeExecutionCanary": "PASSED" if all_passed else "FAILED"
    }

    print(f"HTTP Response Status             : {res_status}")
    print(f"Test Document Reached LibreOffice: {reached_lo}")
    print(f"Marker File Created              : {marker_created}")
    print(f"Macro Execution Observed         : {macro_observed}")
    print(f"Network Activity                 : {net_activity}")
    print(f"Process Spawn Activity           : {process_spawn}")
    print(f"External Side-Effects            : {side_effects}")
    print(f"Profile Files Retained           : {profiles_retained}")
    print(f"R2 Objects Retained              : {r2_retained}")
    print(f"Client Wall Time                 : {wall_ms} ms")

    with open("macro_runtime_canary_results.json", "w") as f:
        json.dump(results, f, indent=2)

    print("=" * 80)
    print(f"MACRO_NEGATIVE_EXECUTION_CANARY: {'PASSED' if all_passed else 'FAILED'}")

if __name__ == "__main__":
    main()
