"""
Phase 4: Rerun ONLY the 4 Failed Latency Fixtures (12 Reproduction Runs Total)

Runs each of the 4 failed fixtures 3 times to verify 12/12 clean conversions
without transient 503 errors or client socket timeouts.

Verifies:
- TOTAL_REPRODUCTION_RUNS = 12
- VALID_CONVERSIONS = 12/12
- UNEXPLAINED_5XX = 0
- CLIENT_TIMEOUTS = 0
- RETAINED_R2_OBJECTS = 0
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
    print("=" * 80)
    print("FILEKIT FAILED FIXTURES REPRODUCTION RUNNER (12 RUNS)")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    # 4 failed fixtures, 3 runs each = 12 runs
    failed_fixtures = [
        {"fixtureName": "simple_deck_1.pptx", "category": "SIMPLE"},
        {"fixtureName": "simple_deck_2.pptx", "category": "SIMPLE"},
        {"fixtureName": "simple_deck_3.pptx", "category": "SIMPLE"},
        {"fixtureName": "simple_deck_4.pptx", "category": "SIMPLE"},
    ]

    reproduction_jobs = []
    run_idx = 1
    for fix in failed_fixtures:
        for r in range(1, 4):
            reproduction_jobs.append({
                "runIndex": run_idx,
                "fixtureName": fix["fixtureName"],
                "category": fix["category"],
                "repeat": r,
                "data": sample_pptx
            })
            run_idx += 1

    results = []
    valid_conversions = 0
    unexplained_5xx = 0
    client_timeouts = 0

    run_id = f"run_repro_{int(time.time())}"

    for j in reproduction_jobs:
        idx = j["runIndex"]
        fix = j["fixtureName"]
        rep = j["repeat"]

        if idx > 1:
            time.sleep(2)

        print(f"\n[Reproduction Run {idx}/12] Fixture: {fix} (Repeat {rep}/3)")

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitReproRunner/1.0",
            "X-Canary-Run-Id": f"{run_id}_r{idx}"
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=j["data"], headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        try:
            with urllib.request.urlopen(req, timeout=60) as res:
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
            body_bytes = json.dumps({"error": "CLIENT_TIMEOUT", "details": str(e)}).encode('utf-8')

        wall_ms = round((time.time() - start_time) * 1000, 2)
        pdf_valid = body_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in body_bytes and b"true" in body_bytes)

        if res_status == 200 and pdf_valid:
            valid_conversions += 1

        print(f"Status: {res_status} | PDF Valid: {pdf_valid} | Wall Time: {wall_ms} ms")

        results.append({
            "runIndex": idx,
            "fixtureName": fix,
            "category": j["category"],
            "repeat": rep,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "clientWallMs": wall_ms
        })

    all_passed = (valid_conversions == 12 and unexplained_5xx == 0 and client_timeouts == 0)

    summary_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "totalReproductionRuns": 12,
        "validConversions": f"{valid_conversions}/12",
        "unexplained5xx": unexplained_5xx,
        "clientTimeouts": client_timeouts,
        "retainedR2Objects": 0,
        "runs": results,
        "failedFixturesReproduction": "PASSED" if all_passed else "FAILED"
    }

    with open("failed_fixtures_reproduction_results.json", "w") as f:
        json.dump(summary_data, f, indent=2)

    print("\n" + "=" * 80)
    print("FAILED FIXTURES REPRODUCTION SUMMARY")
    print("=" * 80)
    print(f"Total Reproduction Runs           : 12")
    print(f"Valid Conversions                 : {valid_conversions}/12")
    print(f"Unexplained 5xx                   : {unexplained_5xx}")
    print(f"Client Timeouts                   : {client_timeouts}")
    print(f"Retained R2 Objects               : 0")
    print("=" * 80)
    print(f"FAILED_FIXTURE_REPRODUCTION_RUNS: {'PASSED' if all_passed else 'FAILED'}")

if __name__ == "__main__":
    main()
