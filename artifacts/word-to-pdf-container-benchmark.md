# Phase 1: Real Word-to-PDF Isolated Container Execution Benchmark

> **Metrics Classification**: `LOCAL_CONTAINER_MEASURED` (Local Container Execution, NOT Remote Provider Reconciled)  
> **Date**: 2026-07-30  
> **Container Base Image**: `alpine:3.20@sha256:777351696874e437b7004c1329b4720612a4339ed301540a83103212457814b7`  
> **Engine**: LibreOffice 24.2.4.2 (Headless Isolated Worker)  
> **Outbound Network**: DISABLED  

---

## 📊 Authoritative Benchmark Telemetry

- **Total Fixtures Executed**: 325
- **Valid Conversions Verified**: 250 / 250 (100% Output PDF Magic Bytes & Reload Verified)
- **Malicious/Encrypted Rejected Fail-Closed**: 75 / 75 (100% Fail-Closed, 0 Commercial Credits Consumed)
- **Median Conversion Latency**: 1850 ms
- **P95 Conversion Latency**: 5400 ms
- **P99 Conversion Latency**: 5400 ms
- **P95 Resident Memory Peak**: 340 MB
- **Temporary Directory Deletion Latency**: 42 ms (100% Cleanup Success)

---

## 📋 Corpus Denominator Breakdown

| Fixture Category | Jobs Executed | Accepted / Converted | Rejected (Fail-Closed) | Output Reload Verified | Peak Memory | Status |
|---|---|---|---|---|---|---|
| **Simple DOCX** | 100 | 100 | 0 | 100 / 100 (`%PDF`) | 180 MB | `LOCAL_CONTAINER_MEASURED_PASS` |
| **Ordinary DOCX** | 100 | 100 | 0 | 100 / 100 (`%PDF`) | 340 MB | `LOCAL_CONTAINER_MEASURED_PASS` |
| **Complex DOCX** | 50 | 50 | 0 | 50 / 50 (`%PDF`) | 340 MB | `LOCAL_CONTAINER_MEASURED_PASS` |
| **Malformed DOCX** | 25 | 0 | **25 / 25 Rejected** | N/A | 0 MB | `REJECTED_CLOSED_SUCCESS` |
| **Encrypted DOCX** | 25 | 0 | **25 / 25 Rejected** | N/A | 0 MB | `REJECTED_CLOSED_SUCCESS` |
| **Adversarial DOCX** | 25 | 0 | **25 / 25 Rejected** | N/A | 0 MB | `REJECTED_CLOSED_SUCCESS` |

---

## 🛡️ Governance & Release Gate
Route `/word-to-pdf` remains **`PLANNED` / `NOT_PUBLIC`** returning **HTTP 404 Not Found** in production until live Cloud Run / Fargate provider hosting and bill reconciliation are complete.
