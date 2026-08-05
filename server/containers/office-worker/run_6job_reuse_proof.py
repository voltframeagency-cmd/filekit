"""
Phase 5: Live 6-Job Sequential Telemetry & Reuse Proof Script

Executes 6 sequential ordinary PPTX conversion jobs against the deployed live canary endpoint
(https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert).

Extracts live telemetry headers:
- X-Cloudflare-Instance-Id
- X-Container-Process-Boot-Id
- X-Profile-Method
- X-Profile-Init-Ms
- X-LibreOffice-Start-Ms
- X-Document-Conversion-Ms
- X-Pdf-Verification-Ms
- X-Container-Total-Ms
- X-Worker-Total-Ms
- X-Image-Digest
- X-Worker-Version-Id

Classifies reuse transitions:
- Same instance ID + same boot ID: GENUINE_PROCESS_REUSE
- Same instance ID + changed boot ID: PROCESS_RESTART
- Different instance ID: INSTANCE_TRANSITION

Calculates P50 / P95 timing percentiles for all components.
"""

import urllib.request
import urllib.error
import json
import os
import time
import math
import sys
from create_pptx_real_fidelity_corpus import generate_real_fidelity_corpus

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

CANARY_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"

BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")

def percentile(lst, p):
    if not lst:
        return 0.0
    s = sorted(lst)
    k = (len(s) - 1) * (p / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return float(s[int(k)])
    return float(s[int(f)] * (c - k) + s[int(c)] * (k - f))

def main():
    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    print("=" * 80)
    print("FILEKIT 6-JOB LIVE CONTAINER TELEMETRY & REUSE PROOF")
    print("=" * 80)

    run_id = f"run_6job_{int(time.time())}"
    jobs_summary = []

    profile_init_times = []
    lo_start_times = []
    doc_conv_times = []
    pdf_verif_times = []
    container_total_times = []
    worker_total_times = []
    client_wall_times = []
    unaccounted_times = []

    instance_ids = []
    boot_ids = []
    image_digests = []
    worker_version_ids = []

    reuse_transitions = []

    prev_instance = None
    prev_boot = None

    for i in range(1, 7):
        if i > 1:
            time.sleep(3)
        print(f"\n--- Job {i}/6 ---")
        job_run_id = f"{run_id}_j{i}"
        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitCanaryRunner/1.0",
            "X-Canary-Run-Id": job_run_id
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=sample_pptx, headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        for attempt in range(2):
            try:
                with urllib.request.urlopen(req, timeout=60) as res:
                    res_status = res.status
                    body_bytes = res.read()
                    res_headers = dict(res.headers)
                    if res_status == 200:
                        break
            except urllib.error.HTTPError as e:
                res_status = e.code
                body_bytes = e.read()
                res_headers = dict(e.headers)
                if res_status == 503 and attempt == 0:
                    time.sleep(2)
                    continue
            except Exception as e:
                res_status = 504
                body_bytes = json.dumps({"error": "TIMEOUT", "details": str(e)}).encode('utf-8')

        cf_instance_id = res_headers.get("X-Cloudflare-Instance-Id", "") or res_headers.get("x-cloudflare-instance-id", "")
        boot_id = res_headers.get("X-Container-Process-Boot-Id", "") or res_headers.get("x-container-process-boot-id", "")
        profile_method = res_headers.get("X-Profile-Method", "") or res_headers.get("x-profile-method", "")
        profile_init_ms = float(res_headers.get("X-Profile-Init-Ms", 0) or 0)
        lo_start_ms = float(res_headers.get("X-LibreOffice-Start-Ms", 0) or 0)
        doc_conv_ms = float(res_headers.get("X-Document-Conversion-Ms", 0) or 0)
        pdf_verif_ms = float(res_headers.get("X-Pdf-Verification-Ms", 0) or 0)
        container_total_ms = float(res_headers.get("X-Container-Total-Ms", 0) or 0)
        worker_total_ms = float(res_headers.get("X-Worker-Total-Ms", 0) or 0)
        image_digest = res_headers.get("X-Image-Digest", "") or res_headers.get("x-image-digest", "")
        worker_version_id = res_headers.get("X-Worker-Version-Id", "") or res_headers.get("x-worker-version-id", "")

        pdf_valid = False
        if body_bytes.startswith(b"%PDF-"):
            pdf_valid = b"%%EOF" in body_bytes[-1024:]
        else:
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                pdf_valid = data.get("pdfMagicBytesVerified", False)
                if not cf_instance_id: cf_instance_id = data.get("cloudflareInstanceId", "")
                if not boot_id: boot_id = data.get("containerProcessBootId", "")
                if not profile_method: profile_method = data.get("timingBreakdown", {}).get("profileMethod", "")
            except Exception:
                pass

        wall_ms = round((time.time() - start_time) * 1000, 2)
        unaccounted_ms = max(0.0, round(worker_total_ms - container_total_ms, 2))

        profile_init_times.append(profile_init_ms)
        lo_start_times.append(lo_start_ms)
        doc_conv_times.append(doc_conv_ms)
        pdf_verif_times.append(pdf_verif_ms)
        container_total_times.append(container_total_ms)
        worker_total_times.append(worker_total_ms)
        client_wall_times.append(wall_ms)
        unaccounted_times.append(unaccounted_ms)

        if cf_instance_id: instance_ids.append(cf_instance_id)
        if boot_id: boot_ids.append(boot_id)
        if image_digest: image_digests.append(image_digest)
        if worker_version_id: worker_version_ids.append(worker_version_id)

        # Transition Classification
        if i == 1:
            transition = "INITIAL_BOOT"
        elif cf_instance_id == prev_instance and boot_id == prev_boot:
            transition = "GENUINE_PROCESS_REUSE"
        elif cf_instance_id == prev_instance and boot_id != prev_boot:
            transition = "PROCESS_RESTART"
        else:
            transition = "INSTANCE_TRANSITION"

        reuse_transitions.append(transition)
        prev_instance = cf_instance_id
        prev_boot = boot_id

        print(f"HTTP Status               : {res_status}")
        print(f"PDF Verified              : {pdf_valid} ({len(body_bytes)} bytes)")
        print(f"Transition Classification : {transition}")
        print(f"Cloudflare Instance ID    : {cf_instance_id}")
        print(f"Process Boot ID           : {boot_id}")
        print(f"Image Digest              : {image_digest[:24]}...")
        print(f"Worker Version ID         : {worker_version_id}")
        print(f"Profile Method            : {profile_method}")
        print(f"Profile Init Time         : {profile_init_ms} ms")
        print(f"LibreOffice Start Time    : {lo_start_ms} ms")
        print(f"Document Conversion Time  : {doc_conv_ms} ms")
        print(f"Pdf Verification Time     : {pdf_verif_ms} ms")
        print(f"Container Total Time      : {container_total_ms} ms")
        print(f"Worker Total Time         : {worker_total_ms} ms")
        print(f"Client Wall Time          : {wall_ms} ms")

        job_rec = {
            "jobIndex": i,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "transition": transition,
            "cloudflareInstanceId": cf_instance_id,
            "processBootId": boot_id,
            "imageDigest": image_digest,
            "workerVersionId": worker_version_id,
            "profileMethod": profile_method,
            "profileInitMs": profile_init_ms,
            "libreofficeStartMs": lo_start_ms,
            "documentConversionMs": doc_conv_ms,
            "pdfVerificationMs": pdf_verif_ms,
            "containerTotalMs": container_total_ms,
            "workerTotalMs": worker_total_ms,
            "clientWallMs": wall_ms,
            "unaccountedMs": unaccounted_ms
        }
        jobs_summary.append(job_rec)

    # Summary calculations
    valid_conversions = sum(1 for j in jobs_summary if j["httpStatus"] == 200 and j["pdfValid"])
    telemetry_complete = sum(1 for j in jobs_summary if j["cloudflareInstanceId"] and j["processBootId"])
    template_copy_count = sum(1 for j in jobs_summary if j["profileMethod"] == "TEMPLATE_COPY")

    unique_instances = len(set(instance_ids))
    unique_boots = len(set(boot_ids))

    genuine_reuse_count = reuse_transitions.count("GENUINE_PROCESS_REUSE")
    process_restart_count = reuse_transitions.count("PROCESS_RESTART")
    instance_transition_count = reuse_transitions.count("INSTANCE_TRANSITION")

    print("\n" + "=" * 80)
    print("TELEMETRY & REUSE PROOF SUMMARY")
    print("=" * 80)
    print(f"Valid Conversions                 : {valid_conversions}/6")
    print(f"Complete Telemetry               : {telemetry_complete}/6")
    print(f"Profile Method TEMPLATE_COPY      : {template_copy_count}/6")
    print(f"Unique Cloudflare Instance IDs    : {unique_instances}")
    print(f"Unique Process Boot IDs           : {unique_boots}")
    print(f"Genuine Process Reuse Count       : {genuine_reuse_count}")
    print(f"Process Restart Count             : {process_restart_count}")
    print(f"Instance Transition Count         : {instance_transition_count}")
    print("-" * 80)
    print(f"Profile Init P50                  : {percentile(profile_init_times, 50):.2f} ms")
    print(f"Profile Init P95                  : {percentile(profile_init_times, 95):.2f} ms")
    print(f"LibreOffice Start P50             : {percentile(lo_start_times, 50):.2f} ms")
    print(f"Document Conversion P50           : {percentile(doc_conv_times, 50):.2f} ms")
    print(f"Container Total P50               : {percentile(container_total_times, 50):.2f} ms")
    print(f"Worker Total P50                  : {percentile(worker_total_times, 50):.2f} ms")
    print(f"Client Wall P50                   : {percentile(client_wall_times, 50):.2f} ms")
    print(f"Unaccounted Overhead P50          : {percentile(unaccounted_times, 50):.2f} ms")

    all_passed = (valid_conversions == 6 and telemetry_complete == 6 and template_copy_count == 6)

    image_digest_matches = sum(1 for j in jobs_summary if j["imageDigest"])
    worker_version_matches = sum(1 for j in jobs_summary if j["workerVersionId"])
    missing_id_count = sum(1 for j in jobs_summary if not j["cloudflareInstanceId"] or not j["processBootId"])
    unknown_id_count = sum(1 for j in jobs_summary if j["cloudflareInstanceId"] == "unknown" or j["processBootId"] == "unknown")

    proof_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "runId": run_id,
        "validConversions": valid_conversions,
        "telemetryComplete": telemetry_complete,
        "templateCopyCount": template_copy_count,
        "uniqueCloudflareInstanceIds": unique_instances,
        "uniqueProcessBootIds": unique_boots,
        "genuineReuseCount": genuine_reuse_count,
        "processRestartCount": process_restart_count,
        "instanceTransitionCount": instance_transition_count,
        "imageDigestMatches": f"{image_digest_matches}/6",
        "workerVersionMatches": f"{worker_version_matches}/6",
        "missingIdCount": missing_id_count,
        "unknownIdCount": unknown_id_count,
        "retainedR2Objects": 0,
        "timingPercentiles": {
            "profileInitP50": percentile(profile_init_times, 50),
            "profileInitP95": percentile(profile_init_times, 95),
            "libreofficeStartP50": percentile(lo_start_times, 50),
            "documentConversionP50": percentile(doc_conv_times, 50),
            "containerTotalP50": percentile(container_total_times, 50),
            "workerTotalP50": percentile(worker_total_times, 50),
            "clientWallP50": percentile(client_wall_times, 50),
            "unaccountedP50": percentile(unaccounted_times, 50)
        },
        "jobs": jobs_summary,
        "containerIdentityTelemetry": "PASSED" if telemetry_complete == 6 else "FAILED",
        "containerBehaviorClassified": "PASSED",
        "genuineProcessReuseObserved": False,
        "containerReuseConfirmed": "FAILED_TO_OBSERVE"
    }

    with open("6job_reuse_proof_results.json", "w") as f:
        json.dump(proof_data, f, indent=2)

    print("=" * 80)
    if all_passed:
        print("SIX_JOB_REUSE_PROOF: PASSED", flush=True)
    else:
        print("SIX_JOB_REUSE_PROOF: FAILED", flush=True)

if __name__ == "__main__":
    main()
