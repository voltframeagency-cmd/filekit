"""
Fail-Closed Security Authorization Audit with Propagation Stability Verification.

After initial propagation succeeds, requires CONSECUTIVE_PROBES_REQUIRED
consecutive successful bearer+admin probes to confirm edge stability.
Records propagation stability evidence.
"""
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

# Stability parameters
CONSECUTIVE_PROBES_REQUIRED = 3
STABILIZATION_WINDOW_SECONDS = 5

print("==========================================")
print("FAIL-CLOSED SECURITY AUTHORIZATION AUDIT")
print("==========================================")

# ── 1. Invalid Bearer Token Test ──
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

# ── 2. Random Bearer Token Test ──
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

# ── 3. Invalid Admin Secret Test ──
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

# ── 4 & 5. Propagation Polling with Multi-Probe Stability Verification ──
print("\n--- Awaiting Cloudflare Worker Secret Propagation ---")
start_propagation = time.time()
max_wait_seconds = 90  # Extended to accommodate stability verification
poll_interval = 2
initial_delay = 2

time.sleep(initial_delay)

pass4 = False
pass5 = False
status4 = 0
status5 = 0
attempts = 0
worker_version_id = "unknown"
consecutive_successes = 0
stability_probe_log = []


from create_pptx_smoke_corpus import build_openxml_pptx
PROBE_PAYLOAD = build_openxml_pptx(title="SecurityProbe", num_slides=1)

def probe_bearer():
    """Probe the bearer endpoint. Returns (status, version_id, passed)."""
    req = urllib.request.Request(
        url,
        data=PROBE_PAYLOAD,
        headers={
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as res:
            ver = res.headers.get("X-Worker-Version-Id") or res.headers.get("x-worker-version-id") or res.headers.get("CF-RAY")
            return res.status, ver, res.status == 200
    except urllib.error.HTTPError as e:
        ver = e.headers.get("X-Worker-Version-Id") or e.headers.get("x-worker-version-id") or e.headers.get("CF-RAY")
        return e.code, ver, False
    except Exception:
        return 0, None, False


def probe_admin():
    """Probe the admin endpoint. Returns (status, version_id, passed)."""
    req = urllib.request.Request(
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
        with urllib.request.urlopen(req) as res:
            ver = res.headers.get("X-Worker-Version-Id") or res.headers.get("x-worker-version-id")
            body = json.loads(res.read().decode('utf-8'))
            ok = res.status == 200 and body.get("dryRun") is True
            return res.status, ver, ok
    except urllib.error.HTTPError as e:
        ver = e.headers.get("X-Worker-Version-Id") or e.headers.get("x-worker-version-id")
        return e.code, ver, False
    except Exception:
        return 0, None, False


while (time.time() - start_propagation) < max_wait_seconds:
    attempts += 1

    b_status, b_ver, b_pass = probe_bearer()
    a_status, a_ver, a_pass = probe_admin()

    status4, status5 = b_status, a_status
    if b_ver:
        worker_version_id = b_ver
    if a_ver:
        worker_version_id = a_ver

    both_pass = b_pass and a_pass
    if both_pass:
        pass4 = True
        pass5 = True
        consecutive_successes += 1
    else:
        consecutive_successes = 0

    elapsed_ms = round((time.time() - start_propagation) * 1000, 2)
    probe_entry = {
        "attempt": attempts,
        "elapsedMs": elapsed_ms,
        "bearerStatus": b_status,
        "adminStatus": a_status,
        "bothPassed": both_pass,
        "consecutiveSuccesses": consecutive_successes
    }
    stability_probe_log.append(probe_entry)
    print(f"Probe {attempts} ({elapsed_ms}ms): Bearer={b_status} Admin={a_status} "
          f"BothPass={both_pass} Consecutive={consecutive_successes}/{CONSECUTIVE_PROBES_REQUIRED}")

    if consecutive_successes >= CONSECUTIVE_PROBES_REQUIRED:
        print(f"\n--- Propagation Stable: {consecutive_successes} consecutive successes ---")
        print(f"--- Entering {STABILIZATION_WINDOW_SECONDS}s stabilization window ---")
        time.sleep(STABILIZATION_WINDOW_SECONDS)

        # Final verification probe after stabilization window
        fb_status, fb_ver, fb_pass = probe_bearer()
        fa_status, fa_ver, fa_pass = probe_admin()
        final_both = fb_pass and fa_pass
        stability_probe_log.append({
            "attempt": "final_post_stabilization",
            "elapsedMs": round((time.time() - start_propagation) * 1000, 2),
            "bearerStatus": fb_status,
            "adminStatus": fa_status,
            "bothPassed": final_both,
            "consecutiveSuccesses": consecutive_successes + (1 if final_both else 0)
        })
        if final_both:
            print("--- Post-stabilization verification: PASSED ---")
            if fb_ver:
                worker_version_id = fb_ver
            break
        else:
            print("--- Post-stabilization verification: FAILED — resetting ---")
            consecutive_successes = 0

    time.sleep(poll_interval)

def fetch_cloudflare_worker_version():
    cf_token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    cf_account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
    if not cf_token or not cf_account:
        return None

    url = f"https://api.cloudflare.com/client/v4/accounts/{cf_account}/workers/scripts/filekit-office-worker-canary/deployments"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {cf_token}",
            "Content-Type": "application/json",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="GET"
    )
    try:
        with urllib.request.urlopen(req) as res:
            body = json.loads(res.read().decode('utf-8'))
            if body.get("success"):
                result = body.get("result", [])
                if isinstance(result, list) and len(result) > 0:
                    latest = result[0]
                    v_id = latest.get("id") or latest.get("version_id")
                    if v_id:
                        return v_id
                elif isinstance(result, dict):
                    deployments = result.get("deployments", [])
                    if deployments:
                        v_id = deployments[0].get("id") or deployments[0].get("version_id")
                        if v_id:
                            return v_id
    except Exception as e:
        print(f"[DEBUG] Deployment API query: {e}")

    url_script = f"https://api.cloudflare.com/client/v4/accounts/{cf_account}/workers/scripts/filekit-office-worker-canary"
    req_script = urllib.request.Request(
        url_script,
        headers={
            "Authorization": f"Bearer {cf_token}",
            "Content-Type": "application/json",
            "User-Agent": "FileKitCanaryRunner/1.0"
        },
        method="GET"
    )
    try:
        with urllib.request.urlopen(req_script) as res:
            body = json.loads(res.read().decode('utf-8'))
            if body.get("success"):
                res_obj = body.get("result", {})
                etag = res_obj.get("etag") or res_obj.get("modified_on")
                if etag:
                    return f"cf_script_{etag}"
    except Exception as e:
        print(f"[DEBUG] Script API query: {e}")

    return None

elapsed_total_ms = round((time.time() - start_propagation) * 1000, 2)

api_ver = fetch_cloudflare_worker_version()
if api_ver:
    print(f"Authoritative Cloudflare API Worker Version/Deployment ID: {api_ver}")
    worker_version_id = api_ver
elif worker_version_id == "unknown":
    try:
        h_req = urllib.request.Request("https://filekit-office-worker-canary.voltframeagency.workers.dev/health", headers={"User-Agent": "FileKitCanaryRunner/1.0"})
        with urllib.request.urlopen(h_req, timeout=10) as h_res:
            ray = h_res.headers.get("CF-RAY")
            if ray:
                worker_version_id = f"cf_ray_{ray.split('-')[0]}"
                print(f"Verified Cloudflare Edge Provenance Ray ID: {worker_version_id}")
    except Exception as he:
        print(f"[DEBUG] Health provenance probe: {he}")

propagation_stable = consecutive_successes >= CONSECUTIVE_PROBES_REQUIRED

random_invalid_bearer_rejected = pass1 and pass2
random_invalid_admin_rejected = pass3
current_bearer_authorized = pass4
current_admin_authorized = pass5

all_assertions_passed = (
    random_invalid_bearer_rejected and
    random_invalid_admin_rejected and
    current_bearer_authorized and
    current_admin_authorized and
    propagation_stable
)

results_payload = {
    "randomInvalidBearerRejected": random_invalid_bearer_rejected,
    "randomInvalidAdminRejected": random_invalid_admin_rejected,
    "currentBearerAuthorized": current_bearer_authorized,
    "currentAdminAuthorized": current_admin_authorized,
    "propagationStable": propagation_stable,
    "consecutiveProbesRequired": CONSECUTIVE_PROBES_REQUIRED,
    "consecutiveProbesAchieved": consecutive_successes,
    "stabilizationWindowSeconds": STABILIZATION_WINDOW_SECONDS,
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
    "stabilityProbeLog": stability_probe_log,
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
print(f"PROPAGATION_STABLE             = {propagation_stable}")
print(f"CONSECUTIVE_PROBES_ACHIEVED    = {consecutive_successes}/{CONSECUTIVE_PROBES_REQUIRED}")
print(f"STABILIZATION_WINDOW           = {STABILIZATION_WINDOW_SECONDS}s")
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
    if not propagation_stable:
        failed_names.append("propagationStable")

    print(f"\n[FAIL CLOSED] Security Audit Failed. Failed assertions: {', '.join(failed_names)}")
    sys.exit(1)

print("\n[SUCCESS] Security Audit Completed Successfully — Propagation Stable.")
