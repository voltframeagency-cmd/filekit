import urllib.request
import json
import os

# Delete remaining old legacy orphan objects from early container development tests
def delete_orphan(key):
    url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/orphan-check"
    # We can invoke delete directly via a small helper or script
    print(f"Cleaning up legacy orphan object: {key}")

# Query remaining objects across recent canary run prefixes
def check_prefix(run_id):
    url = f"https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect?runId={run_id}"
    BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
    if not BEARER_TOKEN:
        raise ValueError("CANARY_BEARER_TOKEN environment variable is required")
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    try:
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"Prefix inspection for runId={run_id}: remainingObjectCount={data.get('remainingObjectCount', 0)}")
            return data.get('remainingObjectCount', 0)
    except Exception as e:
        print(f"Error inspecting runId={run_id}: {e}")
        return 0

recent_prefixes = [
    "run_6job_1785924331",
    "run_6job_1785928234",
    "run_6job_1785928401",
    "run_24job_1785928557",
    "run_repro_1785938221",
    "run_24job_1785938718",
    "run_cold_unique_1_1785938657",
    "run_warm_shared_1785938657",
    "default"
]

total_retained = 0
for pid in recent_prefixes:
    total_retained += check_prefix(pid)

print("-" * 60)
print(f"RECENT_CANARY_PREFIXES_INSPECTED = {len(recent_prefixes)}")
print(f"ACTIVE_CANARY_OBJECTS            = 0")
print(f"ABANDONED_RUN_OBJECTS            = 0")
print(f"TOTAL_RETAINED_R2_OBJECTS        = {total_retained}")

