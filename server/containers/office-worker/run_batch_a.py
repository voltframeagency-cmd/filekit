import urllib.request
import json
import os

url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
bearer_token = os.environ.get("CANARY_BEARER_TOKEN", "")

headers = {
    "Authorization": f"Bearer {bearer_token}",
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "User-Agent": "FileKitBatchA/1.0",
    "X-Canary-Run-ID": "batch_a_test"
}

with open("sample_canary.docx", "rb") as f:
    docx_bytes = f.read()

print("==========================================")
print("BATCH A: 10 REPEATED RUNS OF FAILED FIXTURE")
print("==========================================")

passed = 0
for i in range(1, 11):
    req = urllib.request.Request(url, data=docx_bytes, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            telemetry = json.loads(res.read().decode('utf-8'))
            print(f"[Batch A - {i:02d}/10] PASS - Status: {res.status} - WallTime: {telemetry['totalWallTimeMs']}ms - ContainerTime: {telemetry['containerDurationMs']}ms - Retries: {telemetry.get('retries', 0)}")
            passed += 1
    except Exception as e:
        print(f"[Batch A - {i:02d}/10] FAIL - {e}")

print(f"\nBatch A Outcome: {passed}/10 Passed (Target: 10/10)")
