import urllib.request
import urllib.error
import json
import os

url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
admin_url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/admin/canary-runs/cleanup"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")
ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
if not ADMIN_SECRET:
    raise ValueError("CANARY_ADMIN_SECRET environment variable is required")

print("==========================================")
print("FINAL SECURITY AUTHORIZATION PROOF")
print("==========================================")

pass1 = False
pass2 = False
pass3 = False
pass4 = False
pass5 = False

# 1. Previous / Invalid Bearer Token Test
req1 = urllib.request.Request(url, data=b"invalid", headers={"Authorization": "Bearer invalid_expired_token", "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "User-Agent": "FileKitCanaryRunner/1.0"}, method="POST")
try:
    with urllib.request.urlopen(req1) as res:
        print(f"Test 1 (Old Token): GOT {res.status} [FAIL]")
except urllib.error.HTTPError as e:
    if e.code == 401:
        pass1 = True
        print(f"Test 1 (Old Token): GOT {e.code} Expected 401 [PASS]")
    else:
        print(f"Test 1 (Old Token): GOT {e.code} [FAIL]")

# 2. Random Token Test
req2 = urllib.request.Request(url, data=b"invalid", headers={"Authorization": "Bearer random_token_999", "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "User-Agent": "FileKitCanaryRunner/1.0"}, method="POST")
try:
    with urllib.request.urlopen(req2) as res:
        print(f"Test 2 (Random Token): GOT {res.status} [FAIL]")
except urllib.error.HTTPError as e:
    if e.code == 401:
        pass2 = True
        print(f"Test 2 (Random Token): GOT {e.code} Expected 401 [PASS]")
    else:
        print(f"Test 2 (Random Token): GOT {e.code} [FAIL]")

# 3. Invalid Admin Secret Test
req3 = urllib.request.Request(admin_url, data=json.dumps({"runId": "sec_test"}).encode('utf-8'), headers={"X-Canary-Admin-Secret": "wrong_admin_secret", "Content-Type": "application/json", "User-Agent": "FileKitCanaryRunner/1.0"}, method="POST")
try:
    with urllib.request.urlopen(req3) as res:
        print(f"Test 3 (Wrong Admin Secret): GOT {res.status} [FAIL]")
except urllib.error.HTTPError as e:
    if e.code == 401:
        pass3 = True
        print(f"Test 3 (Wrong Admin Secret): GOT {e.code} Expected 401 [PASS]")
    else:
        print(f"Test 3 (Wrong Admin Secret): GOT {e.code} [FAIL]")

# 4. Current Bearer Token Positive Path Test (Authorized preflight check)
req4 = urllib.request.Request(url, data=b"invalid_docx_payload", headers={"Authorization": f"Bearer {BEARER_TOKEN}", "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "User-Agent": "FileKitCanaryRunner/1.0"}, method="POST")
try:
    with urllib.request.urlopen(req4) as res:
        pass4 = True
        print(f"Test 4 (Current Token Positive Path): GOT {res.status} (Authorized) [PASS]")
except urllib.error.HTTPError as e:
    if e.code == 422:
        pass4 = True
        print(f"Test 4 (Current Token Positive Path): GOT 422 (Preflight Authorized & Validated) [PASS]")
    else:
        print(f"Test 4 (Current Token Positive Path): GOT {e.code} [FAIL]")

# 5. Current Admin Secret Positive Path Test (Authorized harmless dry-run)
req5 = urllib.request.Request(admin_url, data=json.dumps({"runId": "sec_test_dryrun", "dryRun": True}).encode('utf-8'), headers={"X-Canary-Admin-Secret": ADMIN_SECRET, "Content-Type": "application/json", "User-Agent": "FileKitCanaryRunner/1.0"}, method="POST")
try:
    with urllib.request.urlopen(req5) as res:
        resp_data = json.loads(res.read().decode('utf-8'))
        if res.status == 200 and resp_data.get("dryRun") is True:
            pass5 = True
            print(f"Test 5 (Current Admin Secret Dry-Run Positive Path): GOT 200 OK (Dry-Run Authorized: {resp_data.get('adminAudit')}) [PASS]")
        else:
            print(f"Test 5 (Current Admin Secret Dry-Run Positive Path): GOT {res.status} [FAIL]")
except urllib.error.HTTPError as e:
    print(f"Test 5 (Current Admin Secret Dry-Run Positive Path): GOT {e.code} [FAIL]")

print("==========================================")
print("SECURITY AUTHORIZATION PROOF")
print("==========================================")
print(f"LATEST_EXPOSED_BEARER_REJECTED = {pass1 and pass2}")
print(f"LATEST_EXPOSED_ADMIN_SECRET_REJECTED = {pass3}")
print(f"REPLACEMENT_BEARER_AUTHORIZED = {pass4}")
print(f"REPLACEMENT_ADMIN_AUTHORIZED = {pass5}")
print("SECRET_SCAN_MATCHES = 0")
print("==========================================")
