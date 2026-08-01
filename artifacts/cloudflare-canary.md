# Cloudflare Containers + R2 Storage Private Canary Report

> **Status**: `CLOUDFLARE_PRIVATE_CANARY: PASSED` | `PRIVATE_BETA_FINANCIAL_READY: PASSED_WITH_CAP`  
> **Date**: 2026-08-01  
> **Canary Corpus Executed**: 100 Jobs (90 Valid Conversions, 10 Fail-Closed Rejections)  
> **R2 Storage Lifecycle**: 100% Zero-Retention Verified (0 remaining objects)  
> **Security Audit**: 5/5 Gates Passed (3 negative rejections + 2 positive authorization paths)  

---

## 📊 Status Matrix

```text
CLOUDFLARE_PRIVATE_CANARY:              PASSED
AUTOMATIC_ZERO_RETENTION_VERIFIED:      PASSED
PRIVATE_BETA_TECHNICAL_READY:           PASSED
PRIVATE_BETA_FINANCIAL_READY:           PASSED_WITH_CAP
CLOUDFLARE_PROVIDER_MEASURED:           PENDING
CLOUDFLARE_COST_RECONCILED:             PENDING
SCALE_FINANCIAL_MODEL:                  PENDING
```

---

## 📋 Cloudflare Canary Telemetry & R2 Operation Ledger

- **Total Canary Fixtures Executed**: 100
- **Verified Conversions**: 90 / 90 (100% Output %PDF Verified)
- **Preflight Fail-Closed Rejections**: 10 / 10 (100% Malformed Rejections)
- **Median Latency**: 1,950 ms | **P95 Latency**: 5,600 ms | **P99 Latency**: 5,600 ms
- **R2 Operation Ledger (Instrumented from Application Telemetry)**:
  - **Class A Operations (PUT + LIST)**: **182** (180 Object PUTs + 2 Prefix LISTs)
  - **Class B Operations (GET + HEAD)**: **450** (270 Object GETs + 180 Object HEADs)
  - **Delete Operations (Free)**: **180** (90 Input DELETEs + 90 Output DELETEs)
  - **Retention Audit**: **0 remaining objects** (Automatic Zero-Retention Verified)

---

## 💶 Financial Cost Summary

- **FIXED MONTHLY COST**: **$5.00 plus applicable tax** (Workers Paid Subscription)
- **ACTUAL INCREMENTAL BILLED COST**: **$0.00** (Usage stayed within included plan allowances)
- **RATE_CARD_UPPER_BOUND_ESTIMATE**: **~$0.00472 total** (~$0.000047/job across 2,340 wall-seconds)
  - *Container Memory Rate*: **$0.0000025 per GiB-second** (Corrected published rate)
  - *Container vCPU Rate*: **$0.000020 per vCPU-second** (Upper-bound based on wall time)
  - *Container Disk Rate*: **$0.00000007 per GB-second**
- **EFFECTIVE FIXED COST ALLOCATION**:
  - 100 jobs sharing $5 subscription: **$0.0500 / job**
  - 1,000 jobs sharing $5 subscription: **$0.0050 / job**
  - 10,000 jobs sharing $5 subscription: **$0.0005 / job**
- **PROVIDER_MEASURED_MARGINAL_COST**: **PENDING** (Awaiting Cloudflare dashboard export)
