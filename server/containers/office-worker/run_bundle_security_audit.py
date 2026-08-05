"""
Phase 1: Security Artifact Freeze & Production Bundle Audit Script

Calculates immutable SHA-256 hashes for source files and verified security artifacts:
- fault_injection_matrix_results.json (9/9 failure retention matrix)
- fault_injection_negative_matrix_results.json (7/7 negative matrix)
- fault_injection_deployment_safety_results.json (Deployment safety proof)
- src/index.ts
- server.js
- Dockerfile

Audits production code paths for fault injection code tokens:
- X-Canary-Fault-Injection
- CANARY_ADMIN_SECRET
- INJECTED_FAULT_ERROR
- AFTER_INPUT_R2_WRITE
- DURING_CONTAINER_RPC_TIMEOUT
"""

import hashlib
import json
import os
import subprocess
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def calculate_sha256(filepath):
    if not os.path.exists(filepath):
        return "FILE_NOT_FOUND"
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def get_git_sha():
    try:
        res = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True)
        return res.stdout.strip()
    except Exception:
        return "UNKNOWN_GIT_SHA"

def main():
    print("=" * 70)
    print("FILEKIT SECURITY ARTIFACT SHA-256 FREEZE & BUNDLE AUDIT")
    print("=" * 70)

    git_sha = get_git_sha()
    worker_version_id = "cac4df97-0316-4982-8378-c530dd57673a"
    run_id = "run_20260805_canary_closeout"

    files_to_hash = {
        "faultMatrixJson": "fault_injection_matrix_results.json",
        "negativeMatrixJson": "fault_injection_negative_matrix_results.json",
        "deploymentSafetyJson": "fault_injection_deployment_safety_results.json",
        "localContainerJson": "local_container_execution_results.json",
        "reuseProofJson": "6job_reuse_proof_results.json",
        "workerSource": "src/index.ts",
        "containerServerJs": "server.js",
        "dockerfile": "Dockerfile",
        "wranglerToml": "wrangler.toml"
    }

    hashes = {}
    for key, path in files_to_hash.items():
        h = calculate_sha256(path)
        hashes[key] = {
            "path": path,
            "sha256": h
        }
        print(f"FILE HASH [{path:<42}] : {h}")

    # Production Bundle Code Audit
    # Scan customer-facing route code in src/index.ts for fault injection tokens
    with open("src/index.ts", "r", encoding="utf-8") as f:
        worker_code = f.read()

    # Extract customer-facing handlers (/powerpoint-to-pdf, /word-to-pdf, /excel-to-pdf)
    customer_route_tokens = [
        "X-Canary-Fault-Injection",
        "CANARY_ADMIN_SECRET",
        "INJECTED_FAULT_ERROR",
        "AFTER_INPUT_R2_WRITE",
        "DURING_CONTAINER_RPC_TIMEOUT"
    ]

    # Check if fault injection code leaks into standard public handler blocks
    public_handler_code = ""
    lines = worker_code.splitlines()
    in_public_route = False
    for line in lines:
        if "/powerpoint-to-pdf" in line or "/word-to-pdf" in line or "/excel-to-pdf" in line:
            in_public_route = True
        if in_public_route:
            public_handler_code += line + "\n"
            if line.strip() == "}":
                in_public_route = False

    production_fault_code_matches = 0
    matched_tokens = []
    for token in customer_route_tokens:
        if token in public_handler_code:
            production_fault_code_matches += 1
            matched_tokens.append(token)

    # Check wrangler.toml for secret binding presence in production defaults
    with open("wrangler.toml", "r", encoding="utf-8") as f:
        wrangler_content = f.read()

    production_admin_secret_binding_present = "CANARY_ADMIN_SECRET" in wrangler_content and "production" in wrangler_content

    print("-" * 70)
    print(f"GIT_SHA                                         : {git_sha}")
    print(f"WORKER_VERSION_ID                               : {worker_version_id}")
    print(f"PRODUCTION_FAULT_CODE_MATCHES                   : {production_fault_code_matches}")
    print(f"PRODUCTION_ADMIN_SECRET_BINDING_PRESENT         : {production_admin_secret_binding_present}")

    audit_summary = {
        "engineFamily": "OFFICE_TO_PDF",
        "gitSha": git_sha,
        "workerVersionId": worker_version_id,
        "runId": run_id,
        "fileHashes": hashes,
        "productionFaultCodeMatches": production_fault_code_matches,
        "productionAdminSecretBindingPresent": production_admin_secret_binding_present,
        "bundleSecurityAuditPassed": (production_fault_code_matches == 0 and not production_admin_secret_binding_present)
    }

    with open("bundle_security_audit_results.json", "w") as f:
        json.dump(audit_summary, f, indent=2)

    print("=" * 70)
    if audit_summary["bundleSecurityAuditPassed"]:
        print("BUNDLE_SECURITY_AUDIT: PASSED", flush=True)
    else:
        print("BUNDLE_SECURITY_AUDIT: FAILED", flush=True)

if __name__ == "__main__":
    main()
