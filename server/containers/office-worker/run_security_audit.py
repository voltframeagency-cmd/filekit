import urllib.request
import urllib.error
import json
import os
import time
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
admin_url = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/admin/canary-runs/cleanup"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    print("[ERROR] CANARY_BEARER_TOKEN environment variable is missing")
    sys.exit(1)

ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")
if not ADMIN_SECRET:
    print("[ERROR] CANARY_ADMIN_SECRET environment variable is missing")
    sys.exit(1)

print("==========================================")
print("FAIL-CLOSED SECURITY AUTHORIZATION AUDIT")
print("==========================================")

# 1. Invalid Bearer Token Test
pass1 = False
req1 = urllib.request.Request(
    url,
    data=b"invalid_payload",
    headers={
        "Authorization": "Bearer invalid_expired_token_999",
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "User-Agent": "FileKitCanaryRunner/1.0"
    },
    method="POST"
)
status1 = 0
try:
    with urllib.request.urlopen(req1) as res:
        status1 = res.status
except urllib.error.HTTPError as e:
    status1 = e.code

if status1 == 401:
    pass1 = True
    print(f"Test 1 (Invalid Bearer): GOT 401 Expected 401 [PASS]")
else:
    print(f"Test 1 (Invalid Bearer): GOT {status1} Expected 401 [FAIL]")

# 2. Random Bearer Token Test
pass2 = False
req2 = urllib.request.Request(
    url,
    data=b"invalid_payload",
    headers={
        "Authorization": "Bearer random_token_777",
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "User-Agent": "FileKitCanaryRunner/1.0"
    },
    method="POST"
)
status2 = 0
try:
    with urllib.request.urlopen(req2) as res:
        status2 = res.status
except urllib.error.HTTPError as e:
    status2 = e.code

if status2 == 401:
    pass2 = True
    print(f"Test 2 (Random Bearer): GOT 401 Expected 401 [PASS]")
else:
    print(f"Test 2 (Random Bearer): GOT {status2} Expected 401 [FAIL]")

# 3. Invalid Admin Secret Test
pass3 = False
req3 = urllib.request.Request(
    admin_url,
    data=json.dumps({"runId": "sec_test_invalid"}).encode('utf-8'),
    headers={
        "X-Canary-Admin-Secret": "wrong_admin_secret_999",
        "Content-Type": "application/json",
        "User-Agent": "FileKitCanaryRunner/1.0"
    },
    method="POST"
)
status3 = 0
try:
    with urllib.request.urlopen(req3) as res:
        status3 = res.status
except urllib.error.HTTPError as e:
    status3 = e.code

if status3 == 401:
    pass3 = True
    print(f"Test 3 (Invalid Admin Secret): GOT 401 Expected 401 [PASS]")
else:
    print(f"Test 3 (Invalid Admin Secret): GOT {status3} Expected 401 [FAIL]")

# Bound Polling for Edge Secret Propagation (Max 60 seconds)
print("\n--- Awaiting Cloudflare Worker Secret Propagation ---")
start_propagation = time.time()
max_wait_seconds = 60
poll_interval = 2
initial_delay = 2

time.sleep(initial_delay)

pass4 = False
pass5 = False
status4 = 0
status5 = 0
attempts = 0
worker_version_id = "unknown"

while (time.time() - start_propagation) < max_wait_seconds:
    attempts += 1
    
    # Test 4: Current Bearer Token Positive Path Check
    req4 = urllib.request.Request(
        url,
        data=b"invalid_docx_payload",
        headers={
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req4) as res:
            status4 = res.status
            w_ver = res.headers.get("X-Worker-Version-Id") or res.headers.get("x-worker-version-id")
            if w_ver:
                worker_version_id = w_ver
            if res.status in (200, 422):
                pass4 = True
    except urllib.error.HTTPError as e:
        status4 = e.code
        w_ver = e.headers.get("X-Worker-Version-Id") or e.headers.get("x-worker-version-id")
        if w_ver:
            worker_version_id = w_ver
        if e.code in (200, 422):
            pass4 = True

    # Test 5: Current Admin Secret Dry-Run Check
    req5 = urllib.request.Request(
        admin_url,
        data=json.dumps({"runId": "sec_test_dryrun", "dryRun": True}).encode('utf-8'),
        headers={
            "X-Canary-Admin-Secret": ADMIN_SECRET,
            "Content-Type": "application/json",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req5) as res:
            status5 = res.status
            w_ver = res.headers.get("X-Worker-Version-Id") or res.headers.get("x-worker-version-id")
            if w_ver:
                worker_version_id = w_ver
            resp_body = json.loads(res.read().decode('utf-8'))
            if res.status == 200 and resp_body.get("dryRun") is True:
                pass5 = True
    except urllib.error.HTTPError as e:
        status5 = e.code
        w_ver = e.headers.get("X-Worker-Version-Id") or e.headers.get("x-worker-version-id")
        if w_ver:
            worker_version_id = w_ver

    elapsed_ms = round((time.time() - start_propagation) * 1000, 2)
    print(f"Poll Attempt {attempts} ({elapsed_ms}ms): BearerStatus={status4} (Pass={pass4}) | AdminStatus={status5} (Pass={pass5})")

    if pass4 and pass5:
        break

    time.sleep(poll_interval)

elapsed_total_ms = round((time.time() - start_propagation) * 1000, 2)

random_invalid_bearer_rejected = pass1 and pass2
random_invalid_admin_rejected = pass3
current_bearer_authorized = pass4
current_admin_authorized = pass5

all_assertions_passed = (
    random_invalid_bearer_rejected and
    random_invalid_admin_rejected and
    current_bearer_authorized and
    current_admin_authorized
)

results_payload = {
    "randomInvalidBearerRejected": random_invalid_bearer_rejected,
    "randomInvalidAdminRejected": random_invalid_admin_rejected,
    "currentBearerAuthorized": current_bearer_authorized,
    "currentAdminAuthorized": current_admin_authorized,
    "httpStatuses": {
        "invalidBearerExpired": status1,
        "randomBearer": status2,
        "invalidAdminSecret": status3,
        "currentBearer": status4,
        "currentAdminSecret": status5
    },
    "attemptCount": attempts,
    "elapsedPropagationMs": elapsed_total_ms,
    "workerVersionId": worker_version_id,
    "passed": all_assertions_passed
}

with open("security_authorization_results.json", "w") as f:
    json.dump(results_payload, f, indent=2)

print("\n==========================================")
print("SECURITY AUTHORIZATION AUDIT RESULTS")
print("==========================================")
print(f"RANDOM_INVALID_BEARER_REJECTED = {random_invalid_bearer_rejected}")
print(f"RANDOM_INVALID_ADMIN_REJECTED  = {random_invalid_admin_rejected}")
print(f"CURRENT_BEARER_AUTHORIZED      = {current_bearer_authorized}")
print(f"CURRENT_ADMIN_AUTHORIZED       = {current_admin_authorized}")
print(f"PROPAGATION_ATTEMPTS           = {attempts}")
print(f"PROPAGATION_ELAPSED_MS         = {elapsed_total_ms}ms")
print(f"WORKER_VERSION_ID              = {worker_version_id}")
print(f"SECURITY_AUDIT_PASSED          = {all_assertions_passed}")
print("==========================================")

if not all_assertions_passed:
    failed_names = []
    if not random_invalid_bearer_rejected:
        failed_names.append("randomInvalidBearerRejected")
    if not random_invalid_admin_rejected:
        failed_names.append("randomInvalidAdminRejected")
    if not current_bearer_authorized:
        failed_names.append("currentBearerAuthorized")
    if not current_admin_authorized:
        failed_names.append("currentAdminAuthorized")
    
    print(f"\n[FAIL CLOSED] Security Audit Failed. Failed assertions: {', '.join(failed_names)}")
    sys.exit(1)

print("\n[SUCCESS] Security Audit Completed Successfully.")
