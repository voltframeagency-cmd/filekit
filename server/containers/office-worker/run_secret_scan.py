"""
Recursive Canary Secret Scan

Scan boundaries:
- Repository workspace files: MUST NOT contain secrets
- User-created temporary files: MUST NOT contain secrets
- GitHub-managed ephemeral transport ($GITHUB_ENV, $GITHUB_OUTPUT, etc.): ALLOWED
  These are GitHub's own mechanism for passing secrets between steps and are
  expected to contain masked values.
"""
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
EXCLUDED_DIRS = {".git", "node_modules", ".venv", "__pycache__", ".wrangler", "dist", "build", "_runner_file_commands"}
EXCLUDED_EXTS = {".png", ".jpg", ".jpeg", ".ico", ".pdf", ".docx", ".xlsx", ".pptx", ".exe", ".zip", ".tar", ".gz", ".pyc"}

# GitHub-managed ephemeral transport files — these are EXPECTED to contain
# masked secret values. They are controlled by the runner, not by user code.
GITHUB_TRANSPORT_ENVS = {"GITHUB_ENV", "GITHUB_OUTPUT", "GITHUB_STEP_SUMMARY", "GITHUB_STATE", "GITHUB_PATH"}

def get_github_transport_paths():
    """Returns the set of absolute file paths used by GitHub for ephemeral secret transport."""
    paths = set()
    for env_var in GITHUB_TRANSPORT_ENVS:
        val = os.environ.get(env_var, "")
        if val and os.path.isfile(val):
            paths.add(os.path.abspath(val))
    return paths

def scan_directory(dir_path, excluded_file_paths=None):
    """Scan a directory for secret leaks, excluding specific file paths."""
    matches = 0
    exposed_files = []
    
    if excluded_file_paths is None:
        excluded_file_paths = set()

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
            abs_filepath = os.path.abspath(filepath)

            # Skip GitHub-managed ephemeral transport files
            if abs_filepath in excluded_file_paths:
                continue

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

# Get GitHub transport file paths to exclude
github_transport_paths = get_github_transport_paths()
if github_transport_paths:
    print(f"Excluding {len(github_transport_paths)} GitHub-managed transport file(s)")

# 1. Scan Repository Workspace (3 levels up from container)
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
repo_matches, repo_exposed = scan_directory(repo_root, github_transport_paths)

# 2. Scan Container / Artifact Directory
artifact_dir = os.path.abspath(os.path.dirname(__file__))
artifact_matches, artifact_exposed = scan_directory(artifact_dir, github_transport_paths)

# 3. Scan Runner Temporary Directory ($RUNNER_TEMP or OS temp)
# These are user-created temporary files, NOT GitHub transport
runner_temp = os.environ.get("RUNNER_TEMP", tempfile.gettempdir())
temp_matches, temp_exposed = scan_directory(runner_temp, github_transport_paths)

# Separate user-created temp matches from GitHub transport
# userCreatedTemporarySecretScanMatches = temp files that contain secrets
# and are NOT GitHub transport files (those were already excluded above)
user_created_temp_matches = temp_matches

total_matches = repo_matches + artifact_matches + user_created_temp_matches
all_passed = (total_matches == 0)

results_payload = {
    "repositorySecretScanMatches": repo_matches,
    "artifactSecretScanMatches": artifact_matches,
    "userCreatedTemporarySecretScanMatches": user_created_temp_matches,
    "githubTransportFilesExcluded": len(github_transport_paths),
    "totalMatches": total_matches,
    "passed": all_passed,
    "exposedFiles": repo_exposed + artifact_exposed + temp_exposed,
    "scanBoundary": {
        "repositoryFiles": "SCANNED",
        "userCreatedTempFiles": "SCANNED",
        "githubManagedTransport": "EXCLUDED_ALLOWED"
    }
}

with open("secret_scan_results.json", "w") as f:
    json.dump(results_payload, f, indent=2)

print(f"REPOSITORY_SECRET_SCAN_MATCHES              = {repo_matches}")
print(f"ARTIFACT_SECRET_SCAN_MATCHES                = {artifact_matches}")
print(f"USER_CREATED_TEMPORARY_SECRET_SCAN_MATCHES  = {user_created_temp_matches}")
print(f"GITHUB_TRANSPORT_FILES_EXCLUDED              = {len(github_transport_paths)}")
print(f"TOTAL_SECRET_SCAN_MATCHES                   = {total_matches}")
print(f"SECRET_SCAN_PASSED                          = {all_passed}")
print("==========================================")

if not all_passed:
    print(f"\n[FAIL CLOSED] Secret leak detected in files: {repo_exposed + temp_exposed}")
    sys.exit(1)

print("\n[SUCCESS] Secret Scan Verification Completed Cleanly.")
