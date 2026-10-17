"""
verify_real_office_lifecycle.py

Executes a complete, bounded lifecycle verification of the Cloudflare Containers Office Worker:
1. Confirms input exists in remote R2 prior to processing.
2. Triggers real conversion through LibreOffice container requesting actual PDF binary bytes.
3. Obtains actual PDF bytes, parses them independently via pypdf, and asserts expected fixture text and page count.
4. Verifies automatic zero-retention cleanup BEFORE any test-side deletion, distinguishing missing objects from auth/network errors.
5. Injects a mid-pipeline fault and requires the EXACT HTTP status (500) and exact fault code, verifying fail-closed zero-retention cleanup.
"""

import os
import sys
import time
import io
import json
import secrets
import subprocess
import urllib.request
import urllib.error
import pypdf

# Force UTF-8 on Windows shell
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Load secrets from private _sec_store.py
sec_store_path = os.path.join(os.path.dirname(__file__), "..", "_sec_store.py")
if not os.path.exists(sec_store_path):
    sec_store_path = os.path.join(os.path.dirname(__file__), "..", "server", "containers", "office-worker", "_sec_store.py")

if os.path.exists(sec_store_path):
    with open(sec_store_path) as f:
        code = f.read()
        exec(code, globals())
else:
    BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
    ADMIN_SECRET = os.environ.get("CANARY_ADMIN_SECRET", "")

if not globals().get("BEARER_TOKEN"):
    print("ERROR: BEARER_TOKEN not found in _sec_store.py or environment.")
    sys.exit(1)

WORKER_URL = "https://filekit-office-worker-canary.voltframeagency.workers.dev"
BUCKET_NAME = "filekit-canary-r2-staged"
FIXTURE_PATH = os.path.join(os.path.dirname(__file__), "..", "server", "containers", "office-worker", "sample_canary.docx")
EXPECTED_FIXTURE_TEXT = "FileKit Canary Benchmark"

def r2_cmd(action, object_path, extra_args=None):
    cmd = f"npx wrangler r2 object {action} {BUCKET_NAME}/{object_path} --remote"
    if extra_args:
        cmd += f" {extra_args}"
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace')
    return res.returncode, res.stdout, res.stderr

def inspect_prefix(run_id):
    url = f"{WORKER_URL}/internal/canary/inspect?runId={run_id}"
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data
    except Exception as e:
        print(f"Error inspecting prefix for run {run_id}: {e}")
        return None

def verify_r2_key_does_not_exist(key_path):
    """
    Directly queries remote R2 and strictly distinguishes:
    1. Genuine missing object (stdout/stderr has 'The specified key does not exist' or 'NoSuchKey')
    2. Authentication / Network / Cloudflare errors (which must NOT be mistaken for a missing object)
    """
    code, out, err = r2_cmd("get", key_path)
    combined = (out + "\n" + err).lower()

    if "the specified key does not exist" in combined or "nosuchkey" in combined:
        return True, "Key confirmed nonexistent (The specified key does not exist)."

    if code == 0:
        return False, f"Key '{key_path}' unexpectedly exists in R2 (HTTP 200 / download succeeded)."

    # If code != 0 but error message is not a missing key, it's an unexpected failure
    if "unauthorized" in combined or "authentication" in combined or "invalid" in combined:
        return False, f"Authentication error checking R2 key '{key_path}': {err.strip()}"
    if "econnrefused" in combined or "etimedout" in combined or "fetch failed" in combined:
        return False, f"Network error checking R2 key '{key_path}': {err.strip()}"

    return False, f"Unexpected error checking R2 key '{key_path}': {err.strip()}"

def run_lifecycle_test():
    run_id = f"lifecycle_{int(time.time())}_{secrets.token_hex(4)}"
    job_id = f"job_{secrets.token_hex(3)}"
    input_key = f"canary-runs/{run_id}/{job_id}/input.docx"
    output_key = f"canary-runs/{run_id}/{job_id}/output.pdf"
    fail_run_id = f"fault_fail_{int(time.time())}_{secrets.token_hex(4)}"

    emergency_cleanup_keys = []

    try:
        print("=================================================================")
        print("STEP 1: CONFIRM INPUT EXISTS IN R2 PRIOR TO PROCESSING")
        print("=================================================================")
        print(f"Uploading input fixture to R2 at: {input_key}")
        emergency_cleanup_keys.append(input_key)
        code, out, err = r2_cmd("put", input_key, f"--file \"{FIXTURE_PATH}\"")
        if code != 0:
            print(f"FAILED to upload fixture to R2: {err}")
            return False
        print("✓ Upload to R2 succeeded.")

        # Confirm existence in R2
        inspect_data = inspect_prefix(run_id)
        if not inspect_data or input_key not in inspect_data.get("objects", []):
            print(f"FAILED: Input object {input_key} was not confirmed to exist in R2.")
            return False
        print(f"✓ CONFIRMED: Input object exists in R2 before conversion (remainingObjectCount = {inspect_data['remainingObjectCount']}).")

        print("\n=================================================================")
        print("STEP 2: RUN REAL CONVERSION THROUGH LIBREOFFICE CONTAINER")
        print("=================================================================")
        convert_url = f"{WORKER_URL}/internal/canary/convert"
        payload = json.dumps({"r2Key": input_key, "runId": run_id}).encode('utf-8')
        req = urllib.request.Request(convert_url, data=payload, headers={
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/json",
            "Accept": "application/pdf",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "X-Canary-Run-ID": run_id
        })

        try:
            with urllib.request.urlopen(req) as resp:
                resp_status = resp.status
                resp_content_type = resp.headers.get("Content-Type", "")
                telemetry_header = resp.headers.get("X-Telemetry-JSON", "")
                telemetry = json.loads(telemetry_header) if telemetry_header else {}
                pdf_bytes = resp.read()

                print(f"✓ Conversion HTTP Response: {resp_status} ({resp_content_type})")
                print(f"  Downloaded PDF bytes: {len(pdf_bytes)} bytes")
                if telemetry:
                    print(f"  Container Duration: {telemetry.get('containerDurationMs')} ms")
                    print(f"  LibreOffice Duration: {telemetry.get('timingBreakdown', {}).get('libreOfficeDurationMs')} ms")
                    print(f"  Output SHA-256: {telemetry.get('outputSha256')}")
        except urllib.error.HTTPError as e:
            print(f"FAILED: Conversion HTTP error {e.code}: {e.read().decode('utf-8')}")
            return False

        if resp_status != 200 or not resp_content_type.startswith("application/pdf") or len(pdf_bytes) == 0:
            print(f"FAILED: Response did not return valid PDF bytes. Status: {resp_status}, Type: {resp_content_type}, Size: {len(pdf_bytes)}")
            return False

        print("\n=================================================================")
        print("STEP 3: INDEPENDENT OUTPUT VERIFICATION & STRUCTURAL PARSING")
        print("=================================================================")
        # Verify magic bytes independently
        if not pdf_bytes.startswith(b"%PDF-"):
            print("FAILED: Downloaded bytes do not start with %PDF- magic bytes.")
            return False
        print(f"✓ Magic bytes verified: starts with {pdf_bytes[:8].decode('latin1', errors='replace').strip()}")

        # Parse independently with pypdf
        try:
            pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            page_count = len(pdf_reader.pages)
            print(f"✓ pypdf reader loaded successfully. Discovered pages: {page_count}")
            if page_count != 1:
                print(f"FAILED: Expected exactly 1 page in output PDF, got {page_count}.")
                return False

            extracted_text = pdf_reader.pages[0].extract_text() or ""
            print(f"✓ Extracted text snippet: '{extracted_text[:60].strip()}...'")
            if EXPECTED_FIXTURE_TEXT not in extracted_text:
                print(f"FAILED: Expected text '{EXPECTED_FIXTURE_TEXT}' not found in independently parsed PDF.")
                return False
            print(f"✓ CONFIRMED: Expected fixture text '{EXPECTED_FIXTURE_TEXT}' verified in output PDF.")
        except Exception as e:
            print(f"FAILED to parse PDF bytes with pypdf: {e}")
            return False

        print("\n=================================================================")
        print("STEP 4: CONFIRM AUTOMATIC DELETION OF KEYS (BEFORE ANY TEST DELETION)")
        print("=================================================================")
        # NOTE: WE DO NOT CALL r2_cmd("delete") HERE!
        # The worker's automatic cleanup must have already deleted both keys.

        post_inspect = inspect_prefix(run_id)
        if post_inspect is None:
            print("FAILED: Could not inspect prefix post-conversion.")
            return False
        
        remaining_count = post_inspect.get("remainingObjectCount", -1)
        if remaining_count != 0:
            print(f"FAILED: Automatic cleanup did not remove objects. Prefix has {remaining_count} objects: {post_inspect.get('objects')}")
            return False
        print(f"✓ CONFIRMED: Prefix {post_inspect['prefix']} has 0 remaining objects in R2 via inspect.")

        # Directly verify with remote R2 that input_key does not exist
        input_missing, input_msg = verify_r2_key_does_not_exist(input_key)
        if not input_missing:
            print(f"FAILED on input key automatic deletion: {input_msg}")
            return False
        print(f"✓ CONFIRMED via remote R2: Input key '{input_key}' -> {input_msg}")

        # Directly verify with remote R2 that output_key does not exist
        output_missing, output_msg = verify_r2_key_does_not_exist(output_key)
        if not output_missing:
            print(f"FAILED on output key automatic deletion: {output_msg}")
            return False
        print(f"✓ CONFIRMED via remote R2: Output key '{output_key}' -> {output_msg}")

        print("\n=================================================================")
        print("STEP 5: FAILURE-CLEANUP CASE (EXACT FAULT STATUS & CODE)")
        print("=================================================================")
        with open(FIXTURE_PATH, "rb") as f:
            docx_bytes = f.read()

        fail_req = urllib.request.Request(convert_url, data=docx_bytes, headers={
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "X-Canary-Run-ID": fail_run_id,
            "X-Canary-Fault-Injection": "AFTER_CONTAINER_SUCCESS",
            "X-Canary-Fault-Injection-Secret": ADMIN_SECRET
        })

        caught_status = None
        fault_payload = None

        try:
            with urllib.request.urlopen(fail_req) as resp:
                print(f"FAILED: Injected fault unexpectedly succeeded with HTTP {resp.status}!")
                return False
        except urllib.error.HTTPError as e:
            caught_status = e.code
            try:
                fault_payload = json.loads(e.read().decode('utf-8'))
            except Exception:
                fault_payload = {}

        print(f"✓ Injected fault caught with HTTP status: {caught_status}")
        print(f"  Error payload: {json.dumps(fault_payload)}")

        # Require EXACT HTTP status (500) and EXACT fault details
        if caught_status != 500:
            print(f"FAILED: Expected exact HTTP 500 for injected fault, received HTTP {caught_status}.")
            return False

        if fault_payload.get("error") != "INJECTED_FAULT_ERROR":
            print(f"FAILED: Expected error 'INJECTED_FAULT_ERROR', got '{fault_payload.get('error')}'.")
            return False

        if fault_payload.get("details") != "INJECTED_FAULT_AFTER_CONTAINER_SUCCESS":
            print(f"FAILED: Expected details 'INJECTED_FAULT_AFTER_CONTAINER_SUCCESS', got '{fault_payload.get('details')}'.")
            return False

        print("✓ CONFIRMED: Exact HTTP status (500) and exact fault code asserted.")

        # Verify that staged keys were cleaned up in finally block on fault
        fail_inspect = inspect_prefix(fail_run_id)
        if fail_inspect and fail_inspect.get("remainingObjectCount") == 0:
            print(f"✓ CONFIRMED: Failure path executed zero-retention cleanup (0 objects remain in R2 for run {fail_run_id}).")
        else:
            print(f"FAILED: Lingering objects found after failure: {fail_inspect}")
            return False

        print("\n=================================================================")
        print("REAL OFFICE CONVERSION & LIFECYCLE AUDIT: ALL 5 STEPS PASSED")
        print("=================================================================")
        return True

    finally:
        # EMERGENCY TEST CLEANUP ONLY (Runs after all assertions have executed)
        # If any object still lingers due to a crash or abort, clean it up here
        for k in emergency_cleanup_keys:
            try:
                r2_cmd("delete", k)
            except Exception:
                pass

if __name__ == "__main__":
    success = run_lifecycle_test()
    sys.exit(0 if success else 1)
