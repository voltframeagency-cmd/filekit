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

CLOUDFLARE_API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
CLOUDFLARE_ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
R2_BUCKET_NAME = "filekit-canary-r2-staged"

if not CLOUDFLARE_API_TOKEN:
    print("[FAIL CLOSED] CLOUDFLARE_API_TOKEN environment variable is missing")
    sys.exit(1)

if not CLOUDFLARE_ACCOUNT_ID:
    print("[FAIL CLOSED] CLOUDFLARE_ACCOUNT_ID environment variable is missing")
    sys.exit(1)

print("==========================================")
print("R2 RETENTION AUDIT")
print("==========================================")

# Query the R2 bucket for any remaining objects using Cloudflare API
# https://developers.cloudflare.com/api/operations/r2-list-objects
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

retained_count = -1  # -1 means "could not determine"
retained_keys = []
api_error = None

try:
    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read().decode("utf-8"))
        if body.get("success"):
            objects = body.get("result", [])
            retained_count = len(objects)
            retained_keys = [obj.get("key", "unknown") for obj in objects[:10]]
        else:
            api_error = f"API returned success=false: {json.dumps(body.get('errors', []))}"
except urllib.error.HTTPError as e:
    error_body = ""
    try:
        error_body = e.read().decode("utf-8")
    except Exception:
        pass
    api_error = f"HTTP {e.code}: {error_body[:500]}"
except Exception as e:
    api_error = f"Connection error: {str(e)}"

# Fail-closed: if we couldn't query, that's a failure
if api_error:
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
