import urllib.request
import urllib.error
import json
import time
import os
import uuid
from create_pptx_smoke_corpus import generate_pptx_smoke_corpus

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

RUN_ID = f"run_pptx_{uuid.uuid4().hex[:8]}"

def main():
    print("==========================================================", flush=True)
    print(f"FILEKIT POWERPOINT-TO-PDF (PPTX) SMOKE TEST (Run ID: {RUN_ID})", flush=True)
    print("==========================================================", flush=True)

    # Pre-run inspection
    inspect_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(inspect_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    with urllib.request.urlopen(insp_req) as r:
        insp_data = json.loads(r.read().decode('utf-8'))
        print(f"Pre-run inspection: {insp_data['remainingObjectCount']} objects (Target: 0)", flush=True)
        assert insp_data['remainingObjectCount'] == 0

    jobs = generate_pptx_smoke_corpus()
    print(f"Executing {len(jobs)} PowerPoint fixtures sequentially...\n", flush=True)

    valid_passed = 0
    invalid_passed = 0
    errors = []
    real_container_ids = set()
    missing_container_id_count = 0
    unknown_container_id_count = 0
    telemetry_incomplete_count = 0

    for idx, job in enumerate(jobs, 1):
        j_id = job["id"]
        j_class = job["class"]
        expect_valid = job["expect_valid"]
        filename = job.get("filename", "presentation.pptx")
        data = job["data"]

        content_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

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
                body_bytes = res.read()
                wall_ms = (time.time() - start_wall) * 1000.0

                if expect_valid:
                    telemetry = json.loads(body_bytes.decode('utf-8'))
                    valid_passed += 1

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
                    profile_ms = tb.get("profileInitMs", 0)
                    lo_ms = tb.get("libreOfficeDurationMs", 0)
                    method = tb.get("profileMethod", "?")

                    telemetry_ok = (
                        raw_cid and str(raw_cid).lower() not in {"unknown", "missing", "none", ""} and
                        method != "?" and
                        lo_ms is not None
                    )
                    if not telemetry_ok:
                        telemetry_incomplete_count += 1

                    print(f"[{idx:02d}/{len(jobs)}] PASS {j_id:<32} ({j_class}) WallTime:{wall_ms:.0f}ms Format:{fmt} Profile:{profile_ms}ms({method}) LO:{lo_ms}ms Container:{display_cid}", flush=True)
                else:
                    errors.append(f"[{idx:02d}] Expected rejection for {j_id} but got HTTP {code}")
                    print(f"[{idx:02d}/{len(jobs)}] FAIL_UNEXPECTED {j_id:<32} ({j_class}) - Status: {code}", flush=True)
        except urllib.error.HTTPError as e:
            wall_ms = (time.time() - start_wall) * 1000.0
            code = e.code
            expected_code = job.get("expected_code", 422)
            if not expect_valid and (code == expected_code or code in [400, 401, 405, 413, 415, 422]):
                invalid_passed += 1
                print(f"[{idx:02d}/{len(jobs)}] REJECT_CORRECT {j_id:<32} ({j_class}) - Status: {code}", flush=True)
            else:
                errors.append(f"[{idx:02d}] Unexpected HTTP {code} for {j_id}")
                print(f"[{idx:02d}/{len(jobs)}] ERROR {j_id:<32} ({j_class}) - Status: {code}", flush=True)

    # Post-run inspection
    print("\n----------------------------------------------------------", flush=True)
    print("AUTOMATIC ZERO-RETENTION INSPECTION...", flush=True)
    insp_req = urllib.request.Request(inspect_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    with urllib.request.urlopen(insp_req) as r:
        insp_data = json.loads(r.read().decode('utf-8'))
        post_orphan_count = insp_data['remainingObjectCount']
        print(f"Post-run inspection: {post_orphan_count} objects remaining (Target: 0)", flush=True)

    total_valid_target = sum(1 for j in jobs if j["expect_valid"])
    total_invalid_target = sum(1 for j in jobs if not j["expect_valid"])

    telemetry_complete = (telemetry_incomplete_count == 0 and len(real_container_ids) > 0)
    container_reuse_confirmed = (len(real_container_ids) == 1 and telemetry_complete)

    print("\n==========================================================", flush=True)
    print("FILEKIT POWERPOINT-TO-PDF SMOKE TEST SUMMARY", flush=True)
    print("==========================================================", flush=True)
    print(f"Valid PPTX Conversions Passed: {valid_passed}/{total_valid_target}", flush=True)
    print(f"Invalid Inputs Rejected:       {invalid_passed}/{total_invalid_target}", flush=True)
    print(f"Total Correctness:             {valid_passed + invalid_passed}/{len(jobs)}", flush=True)
    print(f"Zero Retention:                {post_orphan_count} remaining objects", flush=True)
    print(f"REAL_CONTAINER_IDS:             {len(real_container_ids)} ({list(real_container_ids)})", flush=True)
    print(f"MISSING_CONTAINER_ID_COUNT:     {missing_container_id_count}", flush=True)
    print(f"UNKNOWN_CONTAINER_ID_COUNT:     {unknown_container_id_count}", flush=True)
    print(f"TELEMETRY_COMPLETE:             {telemetry_complete}", flush=True)
    print(f"CONTAINER_REUSE_CONFIRMED:      {container_reuse_confirmed}", flush=True)
    if errors:
        print("ERRORS:", flush=True)
        for err in errors:
            print(f"  {err}", flush=True)
    print("==========================================================", flush=True)

    if valid_passed == total_valid_target and invalid_passed == total_invalid_target and post_orphan_count == 0:
        print("Status: PPTX_SMOKE_TEST -> PASSED", flush=True)
    else:
        print("Status: PPTX_SMOKE_TEST -> FAILED", flush=True)

    summary = {
        "runId": RUN_ID,
        "engineFamily": "OFFICE_TO_PDF",
        "format": "POWERPOINT_PPTX",
        "validConversionsPassed": valid_passed,
        "invalidInputsRejected": invalid_passed,
        "totalCorrectOutcomes": valid_passed + invalid_passed,
        "automaticZeroRetentionRemainingObjects": post_orphan_count,
        "REAL_CONTAINER_IDS": list(real_container_ids),
        "MISSING_CONTAINER_ID_COUNT": missing_container_id_count,
        "UNKNOWN_CONTAINER_ID_COUNT": unknown_container_id_count,
        "TELEMETRY_COMPLETE": telemetry_complete,
        "CONTAINER_REUSE_CONFIRMED": container_reuse_confirmed,
    }

    with open("pptx_smoke_results.json", "w") as f:
        json.dump(summary, f, indent=2)
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
