"""
Isolated 3x Rerun of Failed Job 20 (Native Chart Fixture)
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

def main():
    print("=" * 80)
    print("FILEKIT JOB 20 ISOLATED REPRODUCTION RUNNER (3 RUNS)")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()
    sample_data = corpus[2 % len(corpus)]["data"]

    successes = 0
    for r in range(1, 4):
        run_id = f"run_j20_repro_{r}_{int(time.time())}"
        if r > 1:
            time.sleep(3.0)

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitJob20Runner/1.0",
            "X-Canary-Run-Id": run_id
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=sample_data, headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""

        try:
            with urllib.request.urlopen(req, timeout=90) as res:
                res_status = res.status
                body_bytes = res.read()
        except urllib.error.HTTPError as e:
            res_status = e.code
            body_bytes = e.read()
        except Exception as e:
            res_status = 504

        wall_ms = round((time.time() - start_time) * 1000, 2)
        pdf_valid = body_bytes.startswith(b"%PDF-") or (b"pdfMagicBytesVerified" in body_bytes and b"true" in body_bytes)

        if res_status == 200 and pdf_valid:
            successes += 1

        print(f"[Run {r}/3] Status: {res_status} | PDF Valid: {pdf_valid} | Wall: {wall_ms}ms")

    print("=" * 80)
    print(f"JOB 20 REPRODUCTION RESULT: {successes}/3 Successes")

if __name__ == "__main__":
    main()
