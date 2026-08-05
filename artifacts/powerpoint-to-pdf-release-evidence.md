# PowerPoint-to-PDF (`/powerpoint-to-pdf`) Engine Release Evidence Report

> **Engine Family**: `OFFICE_TO_PDF` (Word, Excel, PowerPoint Isolated Cloudflare Container Worker)  
> **Environment**: Cloudflare Containers + R2 Staged Storage (`filekit-canary-r2-staged`)  
> **Date**: 2026-08-05  
> **Worker Version ID**: `cac4df97-0316-4982-8378-c530dd57673a`  

---

## 📊 **PowerPoint Acceptance Ladder Matrix**

```text
================================================================================
FILEKIT POWERPOINT-TO-PDF ACCEPTANCE LADDER
================================================================================

1.  PPTX_PREFLIGHT_BASIC_VALIDATED:             PASSED

2.  LOCAL_CONTAINER_PPTX_EXECUTION:             PENDING
    Reason: Docker Desktop daemon off

3.  PPTX_SMOKE_CORPUS_VALIDATED:                PASSED (10/10)

4.  PPTX_SYNTHETIC_CORPUS_VALIDATED:            PASSED (100/100)

5.  KNOWN_PPTX_MACRO_INPUTS_REJECTED:           PASSED (6/6)

6.  LIBREOFFICE_MACRO_PROFILE_HARDENED:
    SOURCE IMPLEMENTED
    DEPLOYED RUNTIME PENDING

7.  PROFILE_TEMPLATE_RUNTIME_VERIFIED:          PENDING

8.  MACRO_NEGATIVE_EXECUTION_CANARY:            PENDING
    Preflight rejection observed (6/6), but LibreOffice runtime
    macro protections were not exercised. Marker-file test required.

9.  CLOUDFLARE_FIRST_PPTX_JOB_VERIFIED:         PASSED

10. CLOUDFLARE_PPTX_STRUCTURAL_CANARY:          PASSED
    93/93 valid conversions
    7/7 expected security rejections
    0 corrupted outputs
    0 unexplained 5xx
    0 retained objects

11. SUPPLEMENTAL_PPTX_STABILITY_CORPUS:          PASSED (25/25)
    Structural PDF validation metrics verified.

12. NORMAL_PATH_AUTOMATIC_ZERO_RETENTION:        PASSED (0 remaining objects)

13. FAILURE_PATH_ZERO_RETENTION_MATRIX:          PASSED_9_OF_9
    Verified zero retained R2 objects across all 9 fault injection stages.

14. FAULT_INJECTION_NEGATIVE_MATRIX:             PASSED_7_OF_7
    Dedicated FAULT_INJECTION_DISABLED test and normalized route security verified.

15. FAULT_INJECTION_DEPLOYMENT_SAFETY:           PASSED
    Verified deployment-level default-off requirement (CANARY_FAULT_INJECTION_ENABLED=true binding required).

16. CONTAINER_REUSE_CONFIRMED:                  PENDING INSTRUMENTED IMAGE

17. PPTX_VISUAL_FIDELITY_VALIDATED:             PENDING
    Requires independent reference rendering comparison with MS PowerPoint.

18. PPTX_LATENCY_CAUSE_CLASSIFIED:              PENDING

19. POWERPOINT_TO_PDF_PRIVATE_BETA_READY:       PENDING

20. POWERPOINT_TO_PDF_PUBLIC_READY:             PENDING
================================================================================
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
