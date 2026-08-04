"""
Phase 2: Isolated Diagnostic Runner for real_deck_21_arabic_financial_report

Executes 3 sequential attempts of the failing Arabic PPTX fixture.
Captures detailed response metrics, failure stage classification, and R2 cleanup state.
"""

import urllib.request
import urllib.error
import json
import time
import os
import uuid
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "filekit_canary_secret_2026_rotated")

def main():
    corpus = generate_real_fidelity_corpus()
    target_fix = next(f for f in corpus if f["id"] == "real_deck_21_arabic_financial_report")

    print("=" * 60)
    print(f"ISOLATED DIAGNOSTIC: {target_fix['id']}")
    print("=" * 60)

    for attempt in range(1, 4):
        run_id = f"diag_arabic_21_{attempt}_{uuid.uuid4().hex[:6]}"
        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Run-ID": run_id,
            "X-Canary-Job-Index": "1",
            "X-File-Name": target_fix["filename"]
        }

        start = time.time()
        req = urllib.request.Request(ENDPOINT, data=target_fix["data"], headers=headers, method="POST")

        print(f"\n--- Attempt {attempt} (Run ID: {run_id}) ---")
        try:
            with urllib.request.urlopen(req) as res:
                wall_ms = (time.time() - start) * 1000.0
                body = res.read()
                data = json.loads(body.decode('utf-8'))
                print(f"HTTP Status: {res.status}")
                print(f"Request ID:  {data.get('requestId')}")
                print(f"Cloudflare Instance ID: {res.headers.get('X-Cloudflare-Instance-Id')}")
                print(f"Process Boot ID:        {res.headers.get('X-Container-Process-Boot-Id')}")
                print(f"Conversion Duration:   {data.get('timingBreakdown', {}).get('libreOfficeDurationMs')} ms")
                print(f"Wall Time:             {wall_ms:.0f} ms")
        except urllib.error.HTTPError as e:
            wall_ms = (time.time() - start) * 1000.0
            body = e.read().decode('utf-8', errors='replace')
            print(f"HTTP Status: {e.code}")
            print(f"Wall Time:   {wall_ms:.0f} ms")
            print(f"Raw Response Body:\n{body[:500]}")
            
            # Inspect R2 state post-failure
            insp_url = f"{INSPECT_ENDPOINT}?runId={run_id}"
            insp_req = urllib.request.Request(insp_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
            with urllib.request.urlopen(insp_req) as insp_res:
                insp_data = json.loads(insp_res.read().decode('utf-8'))
                print(f"Post-failure R2 remaining objects for run: {insp_data['remainingObjectCount']}")
                if insp_data['objects']:
                    print(f"Orphan Keys: {insp_data['objects']}")

        except Exception as ex:
            wall_ms = (time.time() - start) * 1000.0
            print(f"Exception: {str(ex)}")

if __name__ == "__main__":
    main()
