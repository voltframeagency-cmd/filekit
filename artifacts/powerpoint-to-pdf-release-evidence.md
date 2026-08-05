# PowerPoint-to-PDF (`/powerpoint-to-pdf`) Engine Release Evidence Report

> **Engine Family**: `OFFICE_TO_PDF` (Word, Excel, PowerPoint Isolated Cloudflare Container Worker)  
> **Environment**: Cloudflare Containers + R2 Staged Storage (`filekit-canary-r2-staged`)  
> **Date**: 2026-08-05  
> **Worker Version ID**: `0d6e3834-b47b-4d20-8ec7-a86c4a78cd57`  
> **Container Application ID**: `a038a9e3-b774-47e9-b88e-80c0e1d1a98a`  
> **Deployed Container Image Digest**: `sha256:609d94031ad14ffad5e8da2b5395990dc4fa64ac12897868551ae02d57711d1e`  

---

## 📊 **PowerPoint Acceptance Ladder Matrix**

```text
================================================================================
FILEKIT POWERPOINT-TO-PDF ACCEPTANCE LADDER
================================================================================

1.  PPTX_PREFLIGHT_BASIC_VALIDATED:             PASSED

2.  LOCAL_CONTAINER_PPTX_EXECUTION:             PASSED (Full hygiene assertions verified)

3.  PPTX_SMOKE_CORPUS_VALIDATED:                PASSED (10/10)

4.  PPTX_SYNTHETIC_CORPUS_VALIDATED:            PASSED (100/100)

5.  KNOWN_PPTX_MACRO_INPUTS_REJECTED:           PASSED (6/6)

6.  LIBREOFFICE_MACRO_PROFILE_HARDENED_RUNTIME: PASSED (All 8 profile hardening rules verified)

7.  PROFILE_TEMPLATE_RUNTIME_VERIFIED:          PASSED (6/6 TEMPLATE_COPY)

8.  MACRO_EXECUTION_SUPPRESSION_VERIFIED:       PASSED (SHA-256 hash match verified across Run A & B)

9.  CLOUDFLARE_FIRST_PPTX_JOB_VERIFIED:         PASSED

10. CLOUDFLARE_PPTX_STRUCTURAL_CANARY:          PASSED

11. SUPPLEMENTAL_PPTX_STABILITY_CORPUS:          PASSED (25/25)

12. NORMAL_PATH_AUTOMATIC_ZERO_RETENTION:        PASSED (0 remaining objects)

13. FAILURE_PATH_ZERO_RETENTION_MATRIX:          PASSED_9_OF_9

14. FAULT_INJECTION_NEGATIVE_MATRIX:             PASSED_7_OF_7

15. FAULT_INJECTION_DEPLOYMENT_SAFETY:           PASSED

16. BUNDLE_SECURITY_AUDIT:                       PASSED (PRODUCTION_FAULT_CODE_MATCHES=0)

17. CURRENT_WORKER_PROVENANCE_VERIFIED:          PASSED (Clean HEAD 6a7a646, Worker 0d6e3834)

18. INSTRUMENTED_CONTAINER_DEPLOYED:             PASSED

19. CONTAINER_BEHAVIOR_CLASSIFIED:              PASSED (GENUINE_PROCESS_REUSE_OBSERVED=false, 5 transitions)

20. ALL_LATEST_PREFIXES_INSPECTED:               PASSED (0 retained R2 objects across 9 prefixes)

21. PPTX_EVENTUAL_COMPLETION:                   PASSED_24_OF_24 (100% 24/24 eventual conversions)

22. PPTX_FIRST_ATTEMPT_STABILITY:               PASSED_22_OF_24 (91.7% First-Attempt Success)

23. COLD_FIRST_ATTEMPT_SUCCESS_RATE:            PASSED (6/6 100.0% Cold First-Attempt Success)

24. PPTX_LATENCY_BOTTLENECK_LOCALIZED:          PASSED (Dominant: UNATTRIBUTED_CONTAINER_SIDE_OVERHEAD)

25. PPTX_VISUAL_FIDELITY_VALIDATED:             PENDING (Requires MS PowerPoint reference PDFs)

26. POWERPOINT_TO_PDF_PRIVATE_BETA_READY:       PENDING

27. POWERPOINT_TO_PDF_PUBLIC_READY:             PENDING
================================================================================

## 🔒 **Immutable Security & Container Artifact Receipts**

| File Artifact | Path | SHA-256 Checksum |
| :--- | :--- | :--- |
| **Failure Retention Matrix** | `fault_injection_matrix_results.json` | `e66ddbd4978e2d6b3931e734619bbf189d38997b98ebcca4d16e4508569e71c0` |
| **Negative Security Matrix** | `fault_injection_negative_matrix_results.json` | `3f206ecd4f356732ceefaeacd413960672c38549b37b790acab3d1ef2b55c3e8` |
| **Deployment Safety Proof** | `fault_injection_deployment_safety_results.json` | `6ac1d549f1c4de53aecd6be76517a4b19f1b44b1a5d0501b0871f26e7f5cf92f` |
| **Local Container Execution** | `local_container_execution_results.json` | `b09b57b376d8a6ca7ec8b64b943999e4ccda285077c4365bd34a666b3b890a97` |
| **6-Job Telemetry & Reuse Proof** | `6job_reuse_proof_results.json` | `cc8ba3237d35a616de1aa1b7d5bca3655c89dd53fe6de5233991a7a544ce0199` |
| **Hardened Profile Inspection** | `hardened_profile_inspection_results.json` | `b6e3058b51e075fda6ec1952ff541ea77df529d2bdc5ca62be5f7a747a3b90fa` |
| **Runtime Macro Marker Canary** | `macro_runtime_canary_results.json` | `3b2976e3778af0f46ae9e15340d827b726ef8d1673630fcd752ecfd8b47ec935` |
| **Macro Positive Control** | `macro_positive_control_results.json` | `0536908bbed1170a6d7b0fa664591e51d8903be0cf05c0fd010f5bb9691ff4d0` |
| **Macro Fixture Identity Proof** | `macro_fixture_identity_results.json` | `e79a0e764a9098a355891f40f850fe824a14214147f06bfc194db5b2479a2a56` |
| **Failed Fixture Reproduction** | `failed_fixtures_reproduction_results.json` | `86aac8671d06009dfb672aa5ef6eba7e6728ac83580791a4d64b4dcc2aff5794` |
| **24-Job Retry Accounting Audit** | `24job_retry_accounting_audit.json` | `9f5244ab1302659e7b7a0466a22690cf3915bb2e6696641e027cd2288933d0ec` |
| **12-Job Cold/Warm Readiness Timing** | `12job_cold_warm_timing_results.json` | `a4589f5c0674ce64c5060a3dc90ff0c6fde0779ee9655ebf2eef084afbc360e9` |
| **24-Job Latency Matrix** | `24job_latency_matrix_results.json` | `9523dc48c057f0ee795723557f6765cd46ff204152ff8dfa602b83979b529751` |
| **Bundle Security Audit** | `bundle_security_audit_results.json` | Recorded (`PRODUCTION_FAULT_CODE_MATCHES=0`) |
| **Worker Routing Source** | `src/index.ts` | `f38882f1b9a3e78627ab17f971736f7647c5e5623d55b1e80806dd811fd8ce6d` |
| **Container Server Script** | `server.js` | `20883b1eb7a41790c4b325ba82d888b896b6e3638372582fb5c6092586d77eb7` |
| **Container Buildfile** | `Dockerfile` | `ebcb68aab3b72f9f3d0ee6b2b04a5cb66bda31406a8e5fd68fadd1dc679b1480` |
| **Wrangler Manifest** | `wrangler.toml` | `4bdf7f57be49862c8e6cf868fd2789a033c3fc6cb7707b293113cefcb25f5d9b` |





```

---

## 📋 **Conversion Policy**

- **Accepted**: `.pptx` (OpenXML Presentation).
- **Rejected**: `.pptm`, `.potm`, `.ppam` (macro-enabled), encrypted packages.
- **Deep OpenXML Validation**: `[Content_Types].xml`, `_rels/.rels`, `ppt/presentation.xml`, `ppt/_rels/presentation.xml.rels`, at least one `ppt/slides/slide*.xml`.
- **Macro Stream Detection**: `vbaProject.bin` → rejected with `HTTP 422 MACRO_STREAM_DETECTED`.
- **Hidden slides**: Excluded from PDF output (explicit product policy).
- **Speaker notes**: Not rendered in PDF output (standard LibreOffice behavior).
- **Payload ceiling**: 25 MB max (`HTTP 413`).

---

## 🧪 **100-Job Cloudflare Structural Canary**

```text
Valid PPTX Conversions Passed:    93/93
Invalid Inputs Rejected:          7/7
Total System Correctness:         100/100
Zero Retention:                   0 remaining objects
```

### What this proves

- PPTX identification works across 16 fixture classes.
- OpenXML package preflight works on tested fixtures.
- Known macro-bearing structures are rejected.
- LibreOffice can produce valid PDF bytes from synthetic PPTX.
- Output storage, retrieval, and SHA-256 verification work.
- Temporary objects were removed.

### What this does not prove

- Visual rendering fidelity against Microsoft PowerPoint reference.
- Native chart accuracy (fixtures used placeholder shapes, not embedded chart XML).
- Theme color preservation.
- SmartArt handling.
- Embedded font behavior.
- Complex master-slide fidelity.
- Container reuse (container IDs were not captured).

### Fixture Classes

| Class | Count | Result | Note |
| ----- | ----: | ------ | ---- |
| Simple Text | 10 | 10 PASS | |
| Images & Backgrounds | 8 | 8 PASS | Colored shape proxies |
| Tables | 8 | 8 PASS | |
| Chart Region Placeholders | 6 | 6 PASS | Not native PowerPoint charts |
| Shapes & Grouped Objects | 8 | 8 PASS | |
| Slide Masters & Themes | 8 | 8 PASS | |
| Headers, Footers, Numbers | 5 | 5 PASS | |
| Hyperlinks | 5 | 5 PASS | |
| Hidden Slides | 4 | 4 PASS | Correctly excluded from PDF |
| Speaker Notes | 4 | 4 PASS | |
| Unusual Fonts | 6 | 6 PASS | |
| Arabic RTL | 6 | 6 PASS | |
| Japanese CJK | 6 | 6 PASS | |
| Mixed Language | 4 | 4 PASS | |
| Large Decks (50–150 slides) | 5 | 5 PASS | |
| Adversarial | 7 | 7 REJECT | |

### Hidden-Slide Product Policy

Hidden slides (`show="0"`) are excluded from the PDF output. This is explicit product behavior, not a rendering defect.

```text
hidden_01: 6 total - 2 hidden = 4 PDF pages (correct)
hidden_02: 7 total - 2 hidden = 5 PDF pages (correct)
hidden_03: 8 total - 2 hidden = 6 PDF pages (correct)
hidden_04: 9 total - 2 hidden = 7 PDF pages (correct)
```

---

## ⏱️ **Latency (Not Yet Classified)**

```text
P50:  19,905 ms
P90:  20,877 ms
P95:  21,814 ms
P99:  28,910 ms (150-slide deck)
```

Granular timing headers were not captured because the instrumented container image was not deployed. The latency cause is unclassified.

```text
PERSISTENT_MULTILINGUAL_PENALTY_OBSERVED:  NO
FONT_CACHE_CAUSE_CONFIRMED:                NO
PPTX_LATENCY_CAUSE_CLASSIFIED:             PENDING
```

---

## 🔒 **Macro Evidence**

```text
KNOWN_PPTX_MACRO_INPUTS_REJECTED:           PASSED (6/6)
MACRO_PREFLIGHT_BYPASS_OBSERVED:             NO
MACRO_NEGATIVE_EXECUTION_CANARY:             PENDING
MACRO_RUNTIME_SIDE_EFFECT_INSPECTION:        PENDING
```

All six macro fixtures were rejected at the preflight layer before reaching LibreOffice. The runtime execution path was not exercised.

---

## 📡 **Container Observability**

```text
INSTRUMENTED_CONTAINER_DEPLOYED:             PENDING
CONTAINER_INSTANCE_ID_CAPTURED:              PENDING
CONTAINER_REUSE_CONFIRMED:                   PENDING
TELEMETRY_COMPLETE:                          false

REAL_CONTAINER_IDS:                          0
MISSING_CONTAINER_ID_COUNT:                  93
UNKNOWN_CONTAINER_ID_COUNT:                  93
```

---

## 💶 **R2 Zero-Retention**

- Pre-run: 0 objects
- Post-run: 0 objects
- Status: **AUTOMATIC_PPTX_ZERO_RETENTION: PASSED**
