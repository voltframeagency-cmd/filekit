import urllib.request
import json
import os
import time

url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
bearer_token = os.environ.get("CANARY_BEARER_TOKEN", "")

headers = {
    "Authorization": f"Bearer {bearer_token}",
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "User-Agent": "FileKitBatchB/1.0",
    "X-Canary-Run-ID": "batch_b_warm"
}

with open("sample_canary.docx", "rb") as f:
    docx_bytes = f.read()

print("==========================================")
print("BATCH B: 20 WARM-INSTANCE CALIBRATION RUNS")
print("==========================================")

latencies = []
cold_starts = 0
passed = 0

for i in range(1, 21):
    start = time.time()
    req = urllib.request.Request(url, data=docx_bytes, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            wall_ms = (time.time() - start) * 1000.0
            telemetry = json.loads(res.read().decode('utf-8'))
            container_ms = telemetry.get("containerDurationMs", 0)
            if container_ms > 2000:
                cold_starts += 1
            latencies.append(wall_ms)
            passed += 1
            print(f"[Batch B - {i:02d}/20] PASS - WallTime: {wall_ms:.0f}ms - ContainerTime: {container_ms}ms")
    except Exception as e:
        print(f"[Batch B - {i:02d}/20] FAIL - {e}")

latencies.sort()
p50 = latencies[len(latencies)//2] if latencies else 0
p95 = latencies[int(len(latencies)*0.95)] if latencies else 0

print("\n==========================================")
print("BATCH B CALIBRATION RESULTS:")
print(f"Passed:           {passed}/20")
print(f"Cold Starts:      {cold_starts} (Target: <= 2)")
print(f"Warm P50 Latency: {p50:.1f}ms (Target: < 5000ms)")
print(f"Warm P95 Latency: {p95:.1f}ms (Target: < 10000ms)")
print("==========================================")
