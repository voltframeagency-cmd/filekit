# Excel-to-PDF (`/excel-to-pdf`) Engine Release Evidence Report

> **Engine Family**: `OFFICE_TO_PDF` (Word, Excel, PowerPoint Isolated Cloudflare Container Worker)  
> **Environment**: Cloudflare Containers + R2 Staged Storage (`filekit-canary-r2-staged`)  
> **Date**: 2026-08-03  
> **Governance Tag**: `excel-to-pdf-beta-v3-frozen`  
> **Worker Version ID**: `bf0cc6b2-68aa-4c29-955a-6f3962194cf0` (frozen)  
> **Canary Run ID**: `run_excel_2e2a6d20`  

---

## 📊 **Excel Acceptance Ladder Matrix**

```text
================================================================================
FILEKIT EXCEL-TO-PDF ACCEPTANCE LADDER
================================================================================

1. XLSX_PREFLIGHT_BASIC_VALIDATED:
   PASSED

2. LOCAL_CONTAINER_XLSX_EXECUTION:
   PASSED

3. LOCAL_XLSX_PREFLIGHT_CORPUS_VALIDATED:
   PASSED (100/100 local preflight corpus)

4. KNOWN_MACRO_INPUTS_REJECTED:
   PASSED (format rejection + stream detection)

5. LIBREOFFICE_MACRO_PROFILE_HARDENED:
   PASSED (MacroSecurityLevel=3, zero trusted, plugins disabled)

6. CLOUDFLARE_FIRST_XLSX_JOB_VERIFIED:
   PASSED

7. CLOUDFLARE_XLSX_PRIVATE_CANARY:
   PASSED — 90/90 valid + 10/10 rejected = 100/100

8. AUTOMATIC_XLSX_ZERO_RETENTION:
   PASSED — 0 remaining R2 objects

9. EXCEL_TO_PDF_PRIVATE_BETA_READY:
   PASSED_WITH_PERFORMANCE_CAP

10. EXCEL_TO_PDF_PUBLIC_READY:
    PENDING LATENCY OPTIMIZATION

PENDING (not blocking beta):
   MACRO_NEGATIVE_EXECUTION_CANARY:
   PENDING — harmless macro marker-file test not yet executed
================================================================================
```

---

## 📋 **Conversion Policy**

- **Accepted**: `.xlsx` (OpenXML), `.xls` (OLE2 Compound Binary).
- **Rejected**: `.xlsm`, `.xltm`, `.xlam` (macro-enabled), encrypted workbooks.
- **Deep OpenXML Validation**: `[Content_Types].xml`, `_rels/.rels`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels`, `xl/worksheets/sheet*.xml` required.
- **Deep OLE2 Validation**: `Workbook` or `Book` stream required. Non-Excel OLE2 rejected.
- **Macro Stream Detection**: `vbaProject.bin` (OpenXML), `_VBA_PROJECT`/`VBA`/`Macros` (OLE2) — rejected with `HTTP 422`.
- **LibreOffice Profile Isolation**: Per-job profile, `MacroSecurityLevel=3`, `DisableMacrosExecution=true`, zero trusted locations, plugins disabled.
- **Visible sheets**: included. Hidden/very-hidden: excluded.
- **Formulas**: rendered using last calculated values. No external data refresh.
- **Charts**: rendered as static PDF content.
- **Payload ceiling**: 25 MB max (`HTTP 413`).

---

## 🧪 **100-Job Cloudflare Canary Results**

```text
Valid Excel Conversions Passed: 90/90
Invalid Inputs Rejected:        10/10
Total System Correctness:       100/100
Automatic Zero-Retention:       0 remaining objects
```

---

## ⏱️ **Latency (Performance Cap Active)**

```text
P50:  23,488 ms    (target: < 5,000 ms warm)
P90:  25,899 ms    (target: < 10,000 ms warm)
P95:  26,109 ms
P99:  27,701 ms    (target: < 15,000 ms cold)
Cold starts: 88/90
```

**Root cause under investigation**: Per-job profile isolation causes LibreOffice process restart every job. Dockerfile now pre-seeds a read-only template profile. Next deployment will measure TEMPLATE_COPY vs FRESH_CREATE performance difference via granular `X-Profile-Init-Ms` / `X-LibreOffice-Duration-Ms` / `X-Container-Instance-Id` response headers.

---

## 💶 **R2 Operation Ledger**

- **Class A (PUT + LIST)**: 182
- **Class B (GET + HEAD)**: 450
- **Deletes (Free)**: 180
- **Zero Retention**: 0 remaining objects
