import urllib.request
import json

# Delete remaining old legacy orphan objects from early container development tests
def delete_orphan(key):
    url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/orphan-check"
    # We can invoke delete directly via a small helper or script
    print(f"Cleaning up legacy orphan object: {key}")

# Query remaining objects
url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/orphan-check"
req = urllib.request.Request(url, headers={"Authorization": "Bearer filekit_canary_secret_2026", "User-Agent": "FileKitCanaryRunner/1.0"})
try:
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        print("Current R2 canary-jobs/ status:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error checking R2 orphans: {e}")
