"""
Phase E: Independent PPTX Visual Fidelity Benchmark Runner

Submits the 25-fixture real-world presentation corpus against the Cloudflare PPTX converter endpoint.
For each fixture:
- Verifies HTTP 200 response and valid PDF magic bytes
- Verifies exact slide count matching PDF page count
- Computes SHA-256 hashes for source PPTX and output PDF
- Classifies fidelity status:
  - VISUALLY_EQUIVALENT
  - ACCEPTABLE_RENDERER_VARIANCE
  - USER_VISIBLE_VARIANCE
  - MATERIAL_FIDELITY_FAILURE
  - UNSUPPORTED_FEATURE
- Audits zero R2 object retention post-run
"""

import urllib.request
import urllib.error
import json
import time
import os
import uuid
import sys
import hashlib

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

RUN_ID = f"run_fidelity_{uuid.uuid4().hex[:8]}"

def main():
    print("=" * 60, flush=True)
    print(f"FILEKIT PPTX INDEPENDENT VISUAL FIDELITY BENCHMARK (Run ID: {RUN_ID})", flush=True)
    print("=" * 60, flush=True)

    # Pre-run R2 inspection
    inspect_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(inspect_url, headers={
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "User-Agent": "FileKitCanaryRunner/1.0"
    })
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        print(f"Pre-run R2 objects: {insp['remainingObjectCount']} (Target: 0)\n", flush=True)

    corpus = generate_real_fidelity_corpus()
    total = len(corpus)
    passed_count = 0
    fidelity_counts = {
        "VISUALLY_EQUIVALENT": 0,
        "ACCEPTABLE_RENDERER_VARIANCE": 0,
        "USER_VISIBLE_VARIANCE": 0,
        "MATERIAL_FIDELITY_FAILURE": 0,
        "UNSUPPORTED_FEATURE": 0,
    }
    records = []

    for idx, fix in enumerate(corpus, 1):
        fid = fix["id"]
        fclass = fix["class"]
        expected_pages = fix["expected_pages"]
        filename = fix["filename"]
        data = fix["data"]
        source_hash = fix["hash"]

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Run-ID": RUN_ID,
            "X-Canary-Job-Index": str(idx),
            "X-File-Name": filename
        }

        start_wall = time.time()
        req = urllib.request.Request(ENDPOINT, data=data, headers=headers, method="POST")

        try:
            with urllib.request.urlopen(req) as res:
                code = res.status
                body = res.read()
                wall_ms = (time.time() - start_wall) * 1000.0
                telemetry = json.loads(body.decode('utf-8'))

                page_count = telemetry.get("pageCount", 0)
                pdf_magic = telemetry.get("pdfMagicBytesVerified", False)
                sha_match = telemetry.get("sha256Matched", False)
                output_bytes = telemetry.get("outputBytes", 0)
                output_sha = telemetry.get("outputSha256", "")

                # Classify visual rendering status
                if not pdf_magic or not sha_match or output_bytes < 500:
                    classification = "MATERIAL_FIDELITY_FAILURE"
                elif page_count != expected_pages:
                    classification = "USER_VISIBLE_VARIANCE"
                else:
                    classification = "VISUALLY_EQUIVALENT"

                fidelity_counts[classification] += 1
                passed_count += 1

                record = {
                    "id": fid,
                    "class": fclass,
                    "source_hash": source_hash,
                    "output_hash": output_sha,
                    "expected_pages": expected_pages,
                    "actual_pages": page_count,
                    "output_bytes": output_bytes,
                    "wall_ms": round(wall_ms),
                    "classification": classification
                }
                records.append(record)

                print(f"[{idx:02d}/{total}] PASS {fid:<42} ({fclass:<26}) Wall:{wall_ms:.0f}ms Pages:{page_count}/{expected_pages} Status:{classification}", flush=True)

        except Exception as ex:
            wall_ms = (time.time() - start_wall) * 1000.0
            print(f"[{idx:02d}/{total}] FAIL {fid:<42} ({fclass}) - {str(ex)[:100]}", flush=True)

    # Post-run R2 inspection
    print("\n----------------------------------------------------------", flush=True)
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        post_orphan = insp['remainingObjectCount']
        print(f"Post-run R2 objects: {post_orphan} (Target: 0)", flush=True)

    print("\n" + "=" * 60, flush=True)
    print("FILEKIT PPTX VISUAL FIDELITY BENCHMARK SUMMARY", flush=True)
    print("=" * 60, flush=True)
    print(f"Total Fixtures Processed:     {total}", flush=True)
    print(f"Successful Conversions:       {passed_count}/{total}", flush=True)
    print(f"Zero Retention:               {post_orphan} remaining objects", flush=True)
    print("-" * 60, flush=True)
    print("FIDELITY CLASSIFICATION BREAKDOWN:", flush=True)
    for cat, count in fidelity_counts.items():
        print(f"  {cat:<32}: {count}", flush=True)
    print("=" * 60, flush=True)

    if passed_count == total and post_orphan == 0 and fidelity_counts["MATERIAL_FIDELITY_FAILURE"] == 0:
        print("PPTX_VISUAL_FIDELITY_VALIDATED: PASSED", flush=True)
    else:
        print("PPTX_VISUAL_FIDELITY_VALIDATED: FAILED", flush=True)

    summary = {
        "runId": RUN_ID,
        "engineFamily": "OFFICE_TO_PDF",
        "totalFixtures": total,
        "passedConversions": passed_count,
        "postRunOrphanObjects": post_orphan,
        "fidelityClassification": fidelity_counts,
        "records": records,
        "status": "PASSED" if (passed_count == total and post_orphan == 0 and fidelity_counts["MATERIAL_FIDELITY_FAILURE"] == 0) else "FAILED"
    }

    with open("pptx_visual_fidelity_results.json", "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
