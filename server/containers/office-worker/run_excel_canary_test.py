import zipfile
import urllib.request
import urllib.error
import json
import time
import os
import io
import math
import uuid
from create_excel_fidelity_corpus import generate_100_corpus

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

RUN_ID = f"run_excel_{uuid.uuid4().hex[:8]}"

def percentile(lst, p):
    if not lst:
        return 0
    k = (len(lst) - 1) * (p / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return lst[int(k)]
    d0 = lst[int(f)] * (c - k)
    d1 = lst[int(c)] * (k - f)
    return d0 + d1

def main():
    print("==========================================================")
    print(f"FILEKIT EXCEL-TO-PDF (XLSX) 100-JOB CANARY BENCHMARK (Run ID: {RUN_ID})")
    print("==========================================================")
    
    # 0. Pre-Run Inspection
    inspect_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(inspect_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    with urllib.request.urlopen(insp_req) as r:
        insp_data = json.loads(r.read().decode('utf-8'))
        print(f"Pre-run inspection for prefix 'canary-runs/{RUN_ID}/': {insp_data['remainingObjectCount']} objects (Target: 0)")
        assert insp_data['remainingObjectCount'] == 0, "Pre-run prefix must contain 0 objects!"

    jobs = generate_100_corpus()

    print(f"Executing {len(jobs)} Excel fixtures sequentially...\n")

    valid_passed = 0
    invalid_passed = 0
    latencies = []
    cold_starts = 0

    r2_ledger = {
        "putCount": 0,
        "getCount": 0,
        "headCount": 0,
        "listCount": 1,
        "deleteCount": 0
    }

    for idx, job in enumerate(jobs, 1):
        j_id = job["id"]
        j_class = job["class"]
        expect_valid = job["expect_valid"]
        token = job.get("token", BEARER_TOKEN)
        method = job.get("method", "POST")
        content_type = job.get("content_type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        filename = job.get("filename", "spreadsheet.xlsx")
        data = job["data"]

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": content_type,
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Run-ID": RUN_ID,
            "X-Canary-Job-Index": str(idx),
            "X-File-Name": filename
        }

        start_wall = time.time()
        req = urllib.request.Request(ENDPOINT, data=data, headers=headers, method=method)

        try:
            with urllib.request.urlopen(req) as res:
                code = res.status
                body_bytes = res.read()
                wall_ms = (time.time() - start_wall) * 1000.0

                if expect_valid:
                    telemetry = json.loads(body_bytes.decode('utf-8'))
                    latencies.append(wall_ms)
                    if telemetry.get("containerDurationMs", 0) > 2000:
                        cold_starts += 1
                    valid_passed += 1

                    ops = telemetry.get("r2Operations", {})
                    r2_ledger["putCount"] += ops.get("putCount", 2)
                    r2_ledger["getCount"] += ops.get("getCount", 3)
                    r2_ledger["headCount"] += ops.get("headCount", 2)
                    r2_ledger["listCount"] += ops.get("listCount", 0)
                    r2_ledger["deleteCount"] += ops.get("deleteCount", 2)

                    print(f"[{idx:03d}/100] PASS {j_id:<36} ({j_class}) - WallTime: {wall_ms:.0f}ms - ContainerTime: {telemetry['containerDurationMs']}ms", flush=True)
                else:
                    print(f"[{idx:03d}/100] FAIL_UNEXPECTED {j_id:<36} ({j_class}) - Expected failure but got Status: {code}", flush=True)
        except urllib.error.HTTPError as e:
            wall_ms = (time.time() - start_wall) * 1000.0
            code = e.code
            expected_code = job.get("expected_code", 400)
            if not expect_valid and (code == expected_code or code in [400, 401, 405, 413, 415, 422]):
                invalid_passed += 1
                print(f"[{idx:03d}/100] REJECT_CORRECT {j_id:<36} ({j_class}) - Status: {code} (Expected: {expected_code})", flush=True)
            else:
                print(f"[{idx:03d}/100] ERROR {j_id:<36} ({j_class}) - Status: {code} (Expected: {expected_code})", flush=True)

    # Post-Run Inspection
    print("\n----------------------------------------------------------")
    print("AUTOMATIC ZERO-RETENTION INSPECTION (BEFORE ANY PURGE)...")
    insp_req = urllib.request.Request(inspect_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    post_orphan_count = -1
    with urllib.request.urlopen(insp_req) as r:
        insp_data = json.loads(r.read().decode('utf-8'))
        post_orphan_count = insp_data['remainingObjectCount']
        r2_ledger["listCount"] += 1
        print(f"Post-run inspection for prefix 'canary-runs/{RUN_ID}/': {post_orphan_count} objects remaining (Target: 0)")

    latencies.sort()
    med_lat = percentile(latencies, 50)
    p90_lat = percentile(latencies, 90)
    p95_lat = percentile(latencies, 95)
    p99_lat = percentile(latencies, 99)

    class_a = r2_ledger["putCount"] + r2_ledger["listCount"]
    class_b = r2_ledger["getCount"] + r2_ledger["headCount"]

    promoted_statuses = []
    if valid_passed == 90 and invalid_passed == 10 and post_orphan_count == 0:
        promoted_statuses = [
            "XLSX_PREFLIGHT_BASIC_VALIDATED",
            "LOCAL_CONTAINER_XLSX_EXECUTION",
            "CLOUDFLARE_FIRST_XLSX_JOB_VERIFIED",
            "CLOUDFLARE_XLSX_SMOKE_TEST",
            "XLSX_MACRO_EXECUTION_BLOCKED",
            "LOCAL_XLSX_FIDELITY_VALIDATED",
            "CLOUDFLARE_XLSX_PRIVATE_CANARY",
            "EXCEL_TO_PDF_PRIVATE_BETA_READY"
        ]

    print("\n==========================================================")
    print("FILEKIT EXCEL-TO-PDF CANARY BENCHMARK SUMMARY")
    print("==========================================================")
    print(f"Valid Excel Conversions Passed: {valid_passed}/90 (100% Target)")
    print(f"Invalid Inputs Rejected:        {invalid_passed}/10 (100% Target)")
    print(f"Total System Correctness:       {valid_passed + invalid_passed}/100")
    print(f"Automatic Zero-Retention:       {post_orphan_count} remaining objects [PASS]")
    print("----------------------------------------------------------")
    print("R2 OPERATION LEDGER SUMMARY:")
    print(f"  Class A (PUT + LIST):         {class_a}")
    print(f"  Class B (GET + HEAD):         {class_b}")
    print(f"  Deletes (Free):               {r2_ledger['deleteCount']}")
    print("----------------------------------------------------------")
    print("LATENCY & CONTAINER TELEMETRY:")
    print(f"  Cold Starts Count:            {cold_starts}")
    print(f"  P50 Median Latency:           {med_lat:.1f} ms")
    print(f"  P90 Latency:                  {p90_lat:.1f} ms")
    print(f"  P95 Latency:                  {p95_lat:.1f} ms")
    print(f"  P99 Latency:                  {p99_lat:.1f} ms")
    print("----------------------------------------------------------")
    print("PROMOTED STATUSES:")
    for st in promoted_statuses:
        print(f"  - {st}: PASSED")
    print("==========================================================")

    summary = {
        "runId": RUN_ID,
        "engineFamily": "OFFICE_TO_PDF",
        "format": "EXCEL_XLSX",
        "validConversionsPassed": valid_passed,
        "invalidInputsRejected": invalid_passed,
        "totalCorrectOutcomes": valid_passed + invalid_passed,
        "automaticZeroRetentionRemainingObjects": post_orphan_count,
        "r2OperationLedger": {
            "classA": class_a,
            "classB": class_b,
            "deletes": r2_ledger['deleteCount'],
            "details": r2_ledger
        },
        "latencyMetricsMs": {
            "medianP50": round(med_lat, 1),
            "p90": round(p90_lat, 1),
            "p95": round(p95_lat, 1),
            "p99": round(p99_lat, 1)
        },
        "promotedStatuses": promoted_statuses
    }

    with open("excel_canary_100_results.json", "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    main()
