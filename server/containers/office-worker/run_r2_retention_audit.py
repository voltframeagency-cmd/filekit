"""
R2 Retention Audit: Verifies that no canary objects remain in the R2 bucket
after the test suite completes.

Fail-closed: If we cannot query R2 or objects remain, exit nonzero.
"""
import urllib.request
import urllib.error
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
R2_BUCKET_NAME = "filekit-canary-r2-staged"
ADMIN_URL = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/admin/canary-runs/cleanup"

print("==========================================")
print("R2 RETENTION AUDIT")
print("==========================================")

retained_count = -1  # -1 means "could not determine"
retained_keys = []
api_error = None

# Determine candidate runId to audit
run_id = os.environ.get("CANARY_RUN_ID", "")
if not run_id:
    try:
        with open("30job_stability_matrix_results.json", "r", encoding="utf-8") as f:
            mat_data = json.load(f)
            run_id = mat_data.get("batchRunId", "")
    except Exception:
        pass
if not run_id:
    run_id = "default"

# Strategy 1: Worker Admin API (authenticated via CANARY_ADMIN_SECRET)
if ADMIN_SECRET:
    try:
        req = urllib.request.Request(
            ADMIN_URL,
            data=json.dumps({"runId": run_id, "dryRun": True}).encode('utf-8'),
            headers={
                "X-Canary-Admin-Secret": ADMIN_SECRET,
                "Content-Type": "application/json",
                "User-Agent": "FileKitCanaryRunner/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req) as res:
            body = json.loads(res.read().decode("utf-8"))
            retained_count = body.get("matchingObjectCount", 0)
            retained_keys = body.get("objects", [])
            print(f"[Worker Admin API] R2 retention query successful for runId '{run_id}'. Retained objects: {retained_count}")
            api_error = None
    except Exception as e:
        print(f"[Worker Admin API Warning] {e}")
        api_error = str(e)

# Strategy 2: Worker Inspect API (authenticated via CANARY_BEARER_TOKEN)
if retained_count == -1 and BEARER_TOKEN:
    try:
        inspect_url = f"https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect?runId={run_id}"
        req = urllib.request.Request(
            inspect_url,
            headers={
                "Authorization": f"Bearer {BEARER_TOKEN}",
                "User-Agent": "FileKitCanaryRunner/1.0"
            },
            method="GET"
        )
        with urllib.request.urlopen(req) as res:
            body = json.loads(res.read().decode("utf-8"))
            retained_count = body.get("remainingObjectCount", 0)
            retained_keys = body.get("objects", [])
            print(f"[Worker Inspect API] R2 retention query successful for runId '{run_id}'. Retained objects: {retained_count}")
            api_error = None
    except Exception as e:
        print(f"[Worker Inspect API Warning] {e}")
        api_error = str(e)

# Strategy 3: Cloudflare REST API
if retained_count == -1 and CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID:
    list_url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/r2/buckets/{R2_BUCKET_NAME}/objects"
    req = urllib.request.Request(
        list_url,
        headers={
            "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="GET"
    )
    try:
        with urllib.request.urlopen(req) as res:
            body = json.loads(res.read().decode("utf-8"))
            if body.get("success"):
                objects = body.get("result", [])
                retained_count = len(objects)
                retained_keys = [obj.get("key", "unknown") for obj in objects[:10]]
                print(f"[Cloudflare REST API] R2 retention query successful. Retained objects: {retained_count}")
                api_error = None
    except Exception as e:
        print(f"[Cloudflare REST API Warning] {e}")
        api_error = str(e)

# Fail-closed: if we couldn't query, that's a failure
if retained_count == -1:
    print(f"[FAIL CLOSED] Could not query R2 bucket: {api_error}")
    results = {
        "retainedR2Objects": -1,
        "apiError": api_error,
        "passed": False,
        "failReason": "CANNOT_QUERY_R2"
    }
    with open("r2_retention_audit_results.json", "w") as f:
        json.dump(results, f, indent=2)
    sys.exit(1)


r2_passed = (retained_count == 0)

results = {
    "retainedR2Objects": retained_count,
    "retainedKeys": retained_keys,
    "passed": r2_passed
}

with open("r2_retention_audit_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"RETAINED_R2_OBJECTS              = {retained_count}")
if retained_keys:
    print(f"RETAINED_KEYS (first 10)         = {retained_keys}")
print(f"R2_RETENTION_AUDIT_PASSED        = {r2_passed}")
print("==========================================")

if not r2_passed:
    print(f"\n[FAIL CLOSED] R2 bucket still contains {retained_count} object(s). Expected 0.")
    sys.exit(1)

print("\n[SUCCESS] R2 Retention Audit Passed - No retained objects.")
