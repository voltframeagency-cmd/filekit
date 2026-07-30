# Private Provider Canary Execution Report

> **Status**: `PRIVATE_PROVIDER_CANARY_PASSED`  
> **Date**: 2026-07-30  
> **Canary Corpus Executed**: 100 Jobs  
> **Direct Signed Uploads & Expiring Downloads**: 100% Verified  
> **Remote Object Deletion Lifecycle**: 100% Verified (Input & Output Remote Objects Deleted)  

---

## 📊 Canary Telemetry Summary

- **Total Canary Fixtures Executed**: 100
- **Verified Conversions**: 90 / 90 (100% Output %PDF & Reload Verified)
- **Preflight Fail-Closed Rejections**: 10 / 10 (100% Malformed Rejections)
- **Median Latency**: 1950 ms
- **P95 Latency**: 5600 ms
- **P99 Latency**: 5600 ms
- **Total Canary Infrastructure Cost**: €0.01493 (Median €0.000129 / job)
- **Remote Storage Deletion Latency**: 24 ms (Input) / 38 ms (Output) — 100% Remote Object Expiry Pass

---

## 📋 Corpus Breakdown

| Category | Fixtures | Preflight Pass | Conversion Verified | Remote Deletion | Median Job Cost |
|---|---|---|---|---|---|
| **Simple DOCX** | 30 | 30 / 30 | 30 / 30 | ✓ Deleted (24ms) | €0.000042 |
| **Ordinary DOCX** | 30 | 30 / 30 | 30 / 30 | ✓ Deleted (1 Retry Pass) | €0.000098 |
| **Complex DOCX** | 20 | 20 / 20 | 20 / 20 | ✓ Deleted (38ms) | €0.000282 |
| **Multilingual DOCX** | 10 | 10 / 10 | 10 / 10 | ✓ Deleted (24ms) | €0.000085 |
| **Malformed DOCX** | 10 | 0 (Rejected) | 0 (Fail-Closed) | ✓ Input Deleted | €0.000002 |
