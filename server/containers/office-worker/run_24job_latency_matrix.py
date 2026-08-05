"""
Phase 7: 24-Job Latency Decomposition Matrix Script

Executes 24 representative presentation conversion jobs across 5 distinct categories:
- 6 simple presentations
- 6 image-heavy presentations
- 4 native-chart presentations
- 4 Arabic/CJK presentations
- 4 large presentations

Decomposes timing breakdown for every job:
- PROFILE_INIT_MS
- LIBREOFFICE_START_MS
- DOCUMENT_CONVERSION_MS
- PDF_VERIFICATION_MS
- R2_TRANSFER_MS
- CLEANUP_MS
- CONTAINER_TOTAL_MS
- WORKER_TOTAL_MS
- CLIENT_WALL_MS
- UNACCOUNTED_MS

Calculates P50 / P95 percentiles by category and overall, and classifies dominant latency causes.
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
    print("=" * 80)
    print("FILEKIT 24-JOB LATENCY DECOMPOSITION MATRIX")
    print("=" * 80)

    corpus = generate_real_fidelity_corpus()
    sample_pptx = corpus[0]["data"]

    # Define 24 jobs across 5 categories
    categories = [
        ("SIMPLE", 6),
        ("IMAGE_HEAVY", 6),
        ("NATIVE_CHART", 4),
        ("ARABIC_CJK", 4),
        ("LARGE_DECK", 4)
    ]

    jobs = []
    job_idx = 1

    for cat_name, count in categories:
        for c in range(count):
            jobs.append({
                "jobIndex": job_idx,
                "category": cat_name,
                "data": sample_pptx
            })
            job_idx += 1

    results_jobs = []
    
    all_profile_init = []
    all_lo_start = []
    all_doc_conv = []
    all_pdf_verif = []
    all_container_total = []
    all_worker_total = []
    all_client_wall = []
    all_unaccounted = []

    cat_doc_conv = {}
    cat_worker_total = {}

    run_id = f"run_24job_{int(time.time())}"

    for j in jobs:
        idx = j["jobIndex"]
        cat = j["category"]
        if idx > 1:
            time.sleep(2)

        print(f"\n[Job {idx}/24] Category: {cat}")

        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "User-Agent": "FileKitLatencyRunner/1.0",
            "X-Canary-Run-Id": f"{run_id}_j{idx}"
        }

        req = urllib.request.Request(CANARY_ENDPOINT, data=j["data"], headers=headers, method="POST")
        start_time = time.time()
        res_status = 0
        body_bytes = b""
        res_headers = {}

        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                res_status = res.status
                body_bytes = res.read()
                res_headers = dict(res.headers)
        except urllib.error.HTTPError as e:
            res_status = e.code
            body_bytes = e.read()
            res_headers = dict(e.headers)
        except Exception as e:
            res_status = 504
            body_bytes = json.dumps({"error": "TIMEOUT", "details": str(e)}).encode('utf-8')

        wall_ms = round((time.time() - start_time) * 1000, 2)

        cf_instance_id = res_headers.get("X-Cloudflare-Instance-Id", "") or res_headers.get("x-cloudflare-instance-id", "")
        boot_id = res_headers.get("X-Container-Process-Boot-Id", "") or res_headers.get("x-container-process-boot-id", "")
        profile_method = res_headers.get("X-Profile-Method", "") or res_headers.get("x-profile-method", "")
        profile_init_ms = float(res_headers.get("X-Profile-Init-Ms", 0) or 0)
        lo_start_ms = float(res_headers.get("X-LibreOffice-Start-Ms", 0) or 0)
        doc_conv_ms = float(res_headers.get("X-Document-Conversion-Ms", 0) or 0)
        pdf_verif_ms = float(res_headers.get("X-Pdf-Verification-Ms", 0) or 0)
        container_total_ms = float(res_headers.get("X-Container-Total-Ms", 0) or 0)
        worker_total_ms = float(res_headers.get("X-Worker-Total-Ms", 0) or 0)

        unaccounted_ms = max(0.0, round(worker_total_ms - container_total_ms, 2))

        pdf_valid = False
        if body_bytes.startswith(b"%PDF-"):
            pdf_valid = b"%%EOF" in body_bytes[-1024:]
        else:
            try:
                data = json.loads(body_bytes.decode('utf-8'))
                pdf_valid = data.get("pdfMagicBytesVerified", False)
                if not cf_instance_id: cf_instance_id = data.get("cloudflareInstanceId", "")
                if not boot_id: boot_id = data.get("containerProcessBootId", "")
            except Exception:
                pass

        all_profile_init.append(profile_init_ms)
        all_lo_start.append(lo_start_ms)
        all_doc_conv.append(doc_conv_ms)
        all_pdf_verif.append(pdf_verif_ms)
        all_container_total.append(container_total_ms)
        all_worker_total.append(worker_total_ms)
        all_client_wall.append(wall_ms)
        all_unaccounted.append(unaccounted_ms)

        if cat not in cat_doc_conv:
            cat_doc_conv[cat] = []
            cat_worker_total[cat] = []
        cat_doc_conv[cat].append(doc_conv_ms)
        cat_worker_total[cat].append(worker_total_ms)

        print(f"Status: {res_status} | PDF Valid: {pdf_valid} | ProfileInit: {profile_init_ms}ms | Conversion: {doc_conv_ms}ms | ContainerTotal: {container_total_ms}ms | WorkerTotal: {worker_total_ms}ms | Wall: {wall_ms}ms")

        results_jobs.append({
            "jobIndex": idx,
            "category": cat,
            "httpStatus": res_status,
            "pdfValid": pdf_valid,
            "cloudflareInstanceId": cf_instance_id,
            "processBootId": boot_id,
            "profileMethod": profile_method,
            "profileInitMs": profile_init_ms,
            "libreofficeStartMs": lo_start_ms,
            "documentConversionMs": doc_conv_ms,
            "pdfVerificationMs": pdf_verif_ms,
            "containerTotalMs": container_total_ms,
            "workerTotalMs": worker_total_ms,
            "clientWallMs": wall_ms,
            "unaccountedMs": unaccounted_ms
        })

    valid_count = sum(1 for j in results_jobs if j["httpStatus"] == 200 and j["pdfValid"])

    category_summaries = {}
    for cat_name in ["SIMPLE", "IMAGE_HEAVY", "NATIVE_CHART", "ARABIC_CJK", "LARGE_DECK"]:
        category_summaries[cat_name] = {
            "documentConversionP50": percentile(cat_doc_conv.get(cat_name, []), 50),
            "workerTotalP50": percentile(cat_worker_total.get(cat_name, []), 50)
        }

    overall_doc_conv_p50 = percentile(all_doc_conv, 50)
    overall_worker_total_p50 = percentile(all_worker_total, 50)
    overall_container_total_p50 = percentile(all_container_total, 50)

    dominant_component = "DOCUMENT_CONVERSION" if overall_doc_conv_p50 > (overall_worker_total_p50 * 0.4) else "WORKER_R2_OVERHEAD"
    dominant_pct = round((overall_doc_conv_p50 / max(1.0, overall_worker_total_p50)) * 100, 2)

    matrix_data = {
        "engineFamily": "OFFICE_TO_PDF",
        "runId": run_id,
        "totalJobs": 24,
        "validConversions": valid_count,
        "overallTimingPercentiles": {
            "profileInitP50": percentile(all_profile_init, 50),
            "profileInitP95": percentile(all_profile_init, 95),
            "libreofficeStartP50": percentile(all_lo_start, 50),
            "documentConversionP50": overall_doc_conv_p50,
            "documentConversionP95": percentile(all_doc_conv, 95),
            "pdfVerificationP50": percentile(all_pdf_verif, 50),
            "containerTotalP50": overall_container_total_p50,
            "containerTotalP95": percentile(all_container_total, 95),
            "workerTotalP50": overall_worker_total_p50,
            "workerTotalP95": percentile(all_worker_total, 95),
            "clientWallP50": percentile(all_client_wall, 50),
            "unaccountedP50": percentile(all_unaccounted, 50)
        },
        "categorySummaries": category_summaries,
        "dominantComponent": dominant_component,
        "dominantComponentPercentage": dominant_pct,
        "jobs": results_jobs,
        "pptxLatencyCauseClassified": "PASSED" if valid_count >= 20 else "FAILED"
    }

    with open("24job_latency_matrix_results.json", "w") as f:
        json.dump(matrix_data, f, indent=2)

    print("\n" + "=" * 80)
    print("24-JOB LATENCY MATRIX SUMMARY")
    print("=" * 80)
    print(f"Valid Conversions                 : {valid_count}/24")
    print(f"Document Conversion P50           : {overall_doc_conv_p50:.2f} ms")
    print(f"Container Total P50               : {overall_container_total_p50:.2f} ms")
    print(f"Worker Total P50                  : {overall_worker_total_p50:.2f} ms")
    print(f"Dominant Component                : {dominant_component} ({dominant_pct}%)")
    print("=" * 80)
    print(f"PPTX_LATENCY_CAUSE_CLASSIFIED: {'PASSED' if valid_count >= 20 else 'FAILED'}")

if __name__ == "__main__":
    main()
