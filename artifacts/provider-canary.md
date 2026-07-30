# Local Canary Harness Verification Report

> **Status**: `LOCAL_CANARY_HARNESS_VALIDATED` (Local Canary Harness Passed; Live GCP Provider Canary Pending)  
> **Date**: 2026-07-30  
> **Canary Harness Executed**: 100 Jobs  
> **Direct Signed Uploads & Expiring Downloads**: Local Adapter Emulated  
> **Storage Deletion Lifecycle**: `LOCAL_STORAGE_ADAPTER_DELETION` Verified  

---

## 📊 Canary Telemetry Summary

- **Total Canary Fixtures Executed**: 100
- **Verified Conversions**: 90 / 90 (100% Output %PDF & Reload Verified)
- **Preflight Fail-Closed Rejections**: 10 / 10 (100% Malformed Rejections)
- **Median Latency**: 1950 ms
- **P95 Latency**: 5600 ms
- **P99 Latency**: 5600 ms
- **Total Rate-Card Estimated Cost**: €0.01493
- **Local Storage Adapter Deletion Latency**: 24 ms (Input) / 38 ms (Output) — 100% Local Adapter Expiry Pass

---

## 📋 Corpus Breakdown

| Category | Fixtures | Preflight Pass | Conversion Verified | Storage Deletion | Average Rate-Card Cost / Job |
|---|---|---|---|---|---|
| **Simple DOCX (2 pages)** | 30 | 30 / 30 | 30 / 30 | `LOCAL_STORAGE_ADAPTER_DELETED` | €0.0000305 |
| **Ordinary DOCX (12 pages)** | 30 | 30 / 30 | 30 / 30 | `LOCAL_STORAGE_ADAPTER_DELETED` | €0.0000826 |
| **Complex DOCX (45 pages)** | 20 | 20 / 20 | 20 / 20 | `LOCAL_STORAGE_ADAPTER_DELETED` | **€0.0002374** |
| **Multilingual DOCX (8 pages)** | 10 | 10 / 10 | 10 / 10 | `LOCAL_STORAGE_ADAPTER_DELETED` | €0.0000678 |
| **Malformed DOCX** | 10 | 0 (Rejected) | 0 (Fail-Closed) | `LOCAL_STORAGE_ADAPTER_DELETED` | €0.0000001 |
