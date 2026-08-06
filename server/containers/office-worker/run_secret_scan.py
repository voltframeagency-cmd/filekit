import os
import sys
import json
import tempfile

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

bearer_token = os.environ.get("CANARY_BEARER_TOKEN", "")
admin_secret = os.environ.get("CANARY_ADMIN_SECRET", "")

if not bearer_token or not admin_secret:
    print("[ERROR] CANARY_BEARER_TOKEN or CANARY_ADMIN_SECRET is missing from environment.")
    sys.exit(1)

tokens_to_scan = [bearer_token, admin_secret]

# Excluded directory patterns
EXCLUDED_DIRS = {".git", "node_modules", ".venv", "__pycache__", ".wrangler", "dist", "build"}
EXCLUDED_EXTS = {".png", ".jpg", ".jpeg", ".ico", ".pdf", ".docx", ".xlsx", ".pptx", ".exe", ".zip", ".tar", ".gz", ".pyc"}

def scan_directory(dir_path):
    matches = 0
    exposed_files = []
    
    if not os.path.exists(dir_path):
        return matches, exposed_files

    for root, dirs, files in os.walk(dir_path):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in EXCLUDED_EXTS:
                continue
            
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    for token in tokens_to_scan:
                        if token and token in content:
                            matches += 1
                            exposed_files.append(filepath)
                            break
            except Exception:
                pass
                
    return matches, exposed_files

print("==========================================")
print("RECURSIVE CANARY SECRET SCAN")
print("==========================================")

# 1. Scan Repository Workspace (2 levels up from container or CWD)
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
repo_matches, repo_exposed = scan_directory(repo_root)

# 2. Scan Container / Artifact Directory
artifact_dir = os.path.abspath(os.path.dirname(__file__))
artifact_matches, artifact_exposed = scan_directory(artifact_dir)

# 3. Scan Runner Temporary Directory ($RUNNER_TEMP or OS temp)
runner_temp = os.environ.get("RUNNER_TEMP", tempfile.gettempdir())
temp_matches, temp_exposed = scan_directory(runner_temp)

total_matches = repo_matches + temp_matches
all_passed = (total_matches == 0)

results_payload = {
    "repositorySecretScanMatches": repo_matches,
    "artifactSecretScanMatches": artifact_matches,
    "temporaryFileSecretScanMatches": temp_matches,
    "totalMatches": total_matches,
    "passed": all_passed,
    "exposedFiles": repo_exposed + temp_exposed
}

with open("secret_scan_results.json", "w") as f:
    json.dump(results_payload, f, indent=2)

print(f"REPOSITORY_SECRET_SCAN_MATCHES   = {repo_matches}")
print(f"ARTIFACT_SECRET_SCAN_MATCHES     = {artifact_matches}")
print(f"TEMPORARY_FILE_SECRET_SCAN_MATCHES = {temp_matches}")
print(f"TOTAL_SECRET_SCAN_MATCHES        = {total_matches}")
print(f"SECRET_SCAN_PASSED               = {all_passed}")
print("==========================================")

if not all_passed:
    print(f"\n[FAIL CLOSED] Secret leak detected in files: {repo_exposed + temp_exposed}")
    sys.exit(1)

print("\n[SUCCESS] Secret Scan Verification Completed Cleanly.")
