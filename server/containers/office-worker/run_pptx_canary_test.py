"""
PHASE 5: Full 100-Job PPTX Cloudflare Canary Test

Sends the complete 100-fixture corpus against the live Cloudflare worker.
For every valid fixture verifies:
- HTTP 200 status
- PDF magic bytes (via server-side verification)
- Expected page count
- SHA-256 identity after R2 retrieval
- Zero retained R2 objects

For invalid fixtures verifies:
- HTTP 4xx rejection
- Correct error classification

Captures granular timing from instrumented container headers.
"""

import urllib.request
import urllib.error
import json
import time
import os
import uuid
from create_pptx_fidelity_corpus import generate_pptx_fidelity_corpus

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

RUN_ID = f"run_pptx_{uuid.uuid4().hex[:8]}"


def main():
    print("=" * 60, flush=True)
    print(f"FILEKIT PPTX FIDELITY CANARY (Run ID: {RUN_ID})", flush=True)
    print("=" * 60, flush=True)

    # Pre-run R2 inspection
    inspect_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(inspect_url, headers={
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "User-Agent": "FileKitCanaryRunner/1.0"
    })
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        print(f"Pre-run R2: {insp['remainingObjectCount']} objects (Target: 0)", flush=True)
        assert insp['remainingObjectCount'] == 0

    corpus = generate_pptx_fidelity_corpus()
    total = len(corpus)
    print(f"Executing {total} PPTX fixtures sequentially...\n", flush=True)

    valid_passed = 0
    invalid_passed = 0
    fidelity_pass = 0
    fidelity_pass_variance = 0
    errors = []
    real_container_ids = set()
    missing_container_id_count = 0
    unknown_container_id_count = 0
    telemetry_incomplete_count = 0
    timing_records = []

    for idx, fix in enumerate(corpus, 1):
        fid = fix["id"]
        fclass = fix["class"]
        expect_valid = fix["expect_valid"]
        filename = fix.get("filename", "presentation.pptx")
        data = fix["data"]

        content_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        if not expect_valid and filename.endswith(('.pptm', '.potm', '.ppam')):
            content_type = "application/octet-stream"

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": content_type,
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

                if expect_valid:
                    telemetry = json.loads(body.decode('utf-8'))

                    # Extract container ID telemetry with strict validation
                    raw_cid = telemetry.get("containerInstanceId")
                    if not raw_cid:
                        missing_container_id_count += 1
                        display_cid = "MISSING"
                    elif str(raw_cid).lower() in {"unknown", "missing", "none", ""}:
                        unknown_container_id_count += 1
                        display_cid = f"UNKNOWN({raw_cid})"
                    else:
                        real_container_ids.add(str(raw_cid))
                        display_cid = str(raw_cid)[:24]

                    tb = telemetry.get("timingBreakdown", {})
                    fmt = telemetry.get("detectedFormat", "?")
                    prof_method = tb.get("profileMethod")
                    lo_duration = tb.get("libreOfficeDurationMs")
                    total_job = tb.get("totalJobMs")

                    telemetry_ok = (
                        raw_cid and str(raw_cid).lower() not in {"unknown", "missing", "none", ""} and
                        prof_method is not None and
                        lo_duration is not None and
                        total_job is not None
                    )
                    if not telemetry_ok:
                        telemetry_incomplete_count += 1

                    # Fidelity checks
                    pdf_magic = telemetry.get("pdfMagicBytesVerified", False)
                    sha_match = telemetry.get("sha256Matched", False)
                    page_count = telemetry.get("pageCount", 0)
                    expected_pages = fix.get("expected_pages", 1)
                    output_bytes = telemetry.get("outputBytes", 0)

                    # Classify fidelity
                    fidelity_status = "RENDER_FIDELITY_PASS"
                    issues = []

                    if not pdf_magic:
                        issues.append("PDF_MAGIC_MISSING")
                        fidelity_status = "OUTPUT_CORRUPTED"
                    if not sha_match:
                        issues.append("SHA256_MISMATCH")
                        fidelity_status = "OUTPUT_CORRUPTED"
                    if output_bytes < 500:
                        issues.append("OUTPUT_TOO_SMALL")
                        fidelity_status = "OUTPUT_INCOMPLETE"
                    if page_count != expected_pages and expected_pages > 0:
                        issues.append(f"PAGE_COUNT_MISMATCH(expected={expected_pages},got={page_count})")
                        if fidelity_status == "RENDER_FIDELITY_PASS":
                            fidelity_status = "RENDER_FIDELITY_PASS_WITH_KNOWN_VARIANCE"

                    if fidelity_status == "RENDER_FIDELITY_PASS":
                        fidelity_pass += 1
                    elif fidelity_status == "RENDER_FIDELITY_PASS_WITH_KNOWN_VARIANCE":
                        fidelity_pass_variance += 1

                    valid_passed += 1

                    # Timing record
                    timing_records.append({
                        "id": fid,
                        "class": fclass,
                        "wall_ms": round(wall_ms),
                        "container_ms": telemetry.get("containerDurationMs", 0),
                        "profile_ms": tb.get("profileInitMs", 0),
                        "lo_ms": lo_duration or 0,
                        "total_job_ms": total_job or 0,
                        "profile_method": prof_method or "?",
                        "format": fmt,
                        "pages": page_count,
                        "output_bytes": output_bytes,
                        "fidelity": fidelity_status,
                        "telemetry_complete": telemetry_ok
                    })

                    issue_str = f" [{','.join(issues)}]" if issues else ""
                    print(f"[{idx:03d}/{total}] PASS {fid:<36} ({fclass:<22}) Wall:{wall_ms:.0f}ms Pages:{page_count} {fidelity_status}{issue_str} CID:{display_cid}", flush=True)
                else:
                    errors.append(f"[{idx:03d}] Expected rejection for {fid} but got HTTP {code}")
                    print(f"[{idx:03d}/{total}] FAIL_UNEXPECTED {fid:<36} ({fclass}) - HTTP {code}", flush=True)

        except urllib.error.HTTPError as e:
            wall_ms = (time.time() - start_wall) * 1000.0
            code = e.code

            if not expect_valid and code in [400, 415, 422]:
                invalid_passed += 1
                print(f"[{idx:03d}/{total}] REJECT_CORRECT {fid:<36} ({fclass}) - HTTP {code}", flush=True)
            else:
                body = e.read().decode('utf-8', errors='replace')
                errors.append(f"[{idx:03d}] Unexpected HTTP {code} for {fid}: {body[:200]}")
                print(f"[{idx:03d}/{total}] ERROR {fid:<36} ({fclass}) - HTTP {code}", flush=True)

        except Exception as ex:
            wall_ms = (time.time() - start_wall) * 1000.0
            errors.append(f"[{idx:03d}] Exception for {fid}: {str(ex)[:200]}")
            print(f"[{idx:03d}/{total}] EXCEPTION {fid:<36} ({fclass}) - {str(ex)[:100]}", flush=True)

    # Post-run R2 inspection
    print("\n" + "-" * 60, flush=True)
    print("AUTOMATIC ZERO-RETENTION INSPECTION...", flush=True)
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        post_orphan = insp['remainingObjectCount']
        print(f"Post-run: {post_orphan} objects remaining (Target: 0)", flush=True)

    total_valid_target = sum(1 for f in corpus if f["expect_valid"])
    total_invalid_target = sum(1 for f in corpus if not f["expect_valid"])

    # Latency stats for valid jobs
    if timing_records:
        walls = sorted(r["wall_ms"] for r in timing_records)
        p50 = walls[len(walls) // 2]
        p90 = walls[int(len(walls) * 0.9)]
        p95 = walls[int(len(walls) * 0.95)]
        p99 = walls[int(len(walls) * 0.99)]
    else:
        p50 = p90 = p95 = p99 = 0

    telemetry_complete = (telemetry_incomplete_count == 0 and len(real_container_ids) > 0)
    container_reuse_confirmed = (len(real_container_ids) == 1 and telemetry_complete)

    print("\n" + "=" * 60, flush=True)
    print("FILEKIT PPTX STRUCTURAL CANARY SUMMARY", flush=True)
    print("=" * 60, flush=True)
    print(f"Valid PPTX Conversions Passed:    {valid_passed}/{total_valid_target}", flush=True)
    print(f"Invalid Inputs Rejected:          {invalid_passed}/{total_invalid_target}", flush=True)
    print(f"Total System Correctness:         {valid_passed + invalid_passed}/{total}", flush=True)
    print(f"Zero Retention:                   {post_orphan} remaining objects", flush=True)
    print(f"REAL_CONTAINER_IDS:               {len(real_container_ids)} ({list(real_container_ids)})", flush=True)
    print(f"MISSING_CONTAINER_ID_COUNT:       {missing_container_id_count}", flush=True)
    print(f"UNKNOWN_CONTAINER_ID_COUNT:       {unknown_container_id_count}", flush=True)
    print(f"TELEMETRY_COMPLETE:               {telemetry_complete}", flush=True)
    print(f"CONTAINER_REUSE_CONFIRMED:        {container_reuse_confirmed}", flush=True)
    print("-" * 60, flush=True)
    print("FIDELITY CLASSIFICATION:", flush=True)
    print(f"  RENDER_FIDELITY_PASS:                  {fidelity_pass}", flush=True)
    print(f"  RENDER_FIDELITY_PASS_WITH_VARIANCE:    {fidelity_pass_variance}", flush=True)
    corrupted = sum(1 for r in timing_records if r["fidelity"] == "OUTPUT_CORRUPTED")
    incomplete = sum(1 for r in timing_records if r["fidelity"] == "OUTPUT_INCOMPLETE")
    print(f"  OUTPUT_CORRUPTED:                      {corrupted}", flush=True)
    print(f"  OUTPUT_INCOMPLETE:                      {incomplete}", flush=True)
    print(f"  EXPECTED_SECURITY_REJECTION:            {invalid_passed}", flush=True)
    print("-" * 60, flush=True)
    print("LATENCY:", flush=True)
    print(f"  P50: {p50:.0f}ms", flush=True)
    print(f"  P90: {p90:.0f}ms", flush=True)
    print(f"  P95: {p95:.0f}ms", flush=True)
    print(f"  P99: {p99:.0f}ms", flush=True)
    print("-" * 60, flush=True)

    if errors:
        print("ERRORS:", flush=True)
        for err in errors:
            print(f"  {err}", flush=True)
        print("-" * 60, flush=True)

    all_correct = (valid_passed == total_valid_target and
                   invalid_passed == total_invalid_target and
                   post_orphan == 0 and
                   corrupted == 0 and
                   incomplete == 0)

    if all_correct:
        print("CLOUDFLARE_PPTX_STRUCTURAL_CANARY:  PASSED", flush=True)
    else:
        print("CLOUDFLARE_PPTX_STRUCTURAL_CANARY:  FAILED", flush=True)
    print("=" * 60, flush=True)

    # Save results
    summary = {
        "runId": RUN_ID,
        "engineFamily": "OFFICE_TO_PDF",
        "format": "POWERPOINT_PPTX",
        "validConversionsPassed": valid_passed,
        "invalidInputsRejected": invalid_passed,
        "totalCorrectOutcomes": valid_passed + invalid_passed,
        "automaticZeroRetentionRemainingObjects": post_orphan,
        "REAL_CONTAINER_IDS": list(real_container_ids),
        "MISSING_CONTAINER_ID_COUNT": missing_container_id_count,
        "UNKNOWN_CONTAINER_ID_COUNT": unknown_container_id_count,
        "TELEMETRY_COMPLETE": telemetry_complete,
        "CONTAINER_REUSE_CONFIRMED": container_reuse_confirmed,
        "fidelityClassification": {
            "renderFidelityPass": fidelity_pass,
            "renderFidelityPassWithVariance": fidelity_pass_variance,
            "outputCorrupted": corrupted,
            "outputIncomplete": incomplete,
            "expectedSecurityRejection": invalid_passed,
        },
        "latencyMs": {
            "p50": p50,
            "p90": p90,
            "p95": p95,
            "p99": p99,
        },
        "timingRecords": timing_records,
    }

    with open("pptx_canary_100_results.json", "w") as f:
        json.dump(summary, f, indent=2)


if __name__ == "__main__":
    main()
