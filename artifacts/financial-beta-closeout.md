# FileKit Word-to-PDF Final Private-Beta Cost Closeout Report

> **Engine**: `OFFICE_TO_PDF` (Word-to-PDF Isolated Cloudflare Container Worker)  
> **Environment**: Cloudflare Containers + R2 Staged Storage (`filekit-canary-r2-staged`)  
> **Date**: 2026-08-01  
> **Governance Tag**: `governance-freeze-v1`  
> **Final Status**: `PRIVATE_BETA_FINANCIAL_READY: PASSED_WITH_CAP`  

---

## 📊 Authoritative Status Accounting Matrix

```text
================================================================================
           FILEKIT AUTHORITATIVE PRIVATE-BETA GOVERNANCE MATRIX
================================================================================

PUBLIC PRODUCT & FUNCTIONAL COVERAGE
  Canonical Functional Tool Routes:          29   (29 Functional Routes; Core Engines Evidenced)
  PDFAid Functional Intents Covered:          19 / 84 (22.6% True Functional Coverage)
  Public Tool Count (Sitemap & Nav):          29
  Operational Public Engine Families:          6 / 11

ENGINE CLOSEOUT CLASSIFICATION LADDER
  1. CLOUDFLARE_PRIVATE_CANARY:              PASSED (90/90 Valid Conversions & 10/10 Preflight Rejections)
  2. AUTOMATIC_ZERO_RETENTION_VERIFIED:      PASSED (0 Remaining R2 Objects After Execution)
  3. PRIVATE_BETA_TECHNICAL_READY:           PASSED (End-to-End Container & R2 Storage Lifecycle Validated)
  4. PRIVATE_BETA_FINANCIAL_READY:           PASSED_WITH_CAP (Strictly Capped 100-Job Private Beta)
  5. CLOUDFLARE_PROVIDER_MEASURED:           PENDING (Awaiting Live Cloudflare Dashboard Usage Export)
  6. CLOUDFLARE_COST_RECONCILED:             PENDING (Awaiting Usage Reconciliation Against Telemetry)
  7. SCALE_FINANCIAL_MODEL:                  PENDING (Enforced Scale Gate Before Raising Beta Cap)
================================================================================
```

---

## 🔐 1. Security Authorization Complete Proof (5-Gate Audit)

The security audit evaluates 3 negative rejection paths and 2 positive authorization paths without outputting or exposing credentials:

| Test Case | Request Parameters | Authentication Input | Expected Outcome | Audit Result |
|---|---|---|---|---|
| **Test 1: Old Token Rejection** | `/internal/canary/convert` (POST) | `Bearer filekit_canary_secret_2026` | HTTP 401 Unauthorized | **PASSED** (`401`) |
| **Test 2: Random Token Rejection** | `/internal/canary/convert` (POST) | `Bearer random_token_999` | HTTP 401 Unauthorized | **PASSED** (`401`) |
| **Test 3: Invalid Admin Secret** | `/internal/admin/canary-runs/cleanup` | `X-Canary-Admin-Secret: wrong_secret` | HTTP 401 Unauthorized | **PASSED** (`401`) |
| **Test 4: Current Bearer Token (Positive)** | `/internal/canary/convert` (POST) | Rotated Bearer Token (env) | Authorized Preflight Check | **PASSED** (`422` validated) |
| **Test 5: Current Admin Secret (Positive)** | `/internal/admin/canary-runs/cleanup` | Active Admin Secret (`dryRun: true`) | Authorized Dry-Run (HTTP 200) | **PASSED** (`200 OK`) |

> **Security Gate Conclusion**: The security gate is complete and verified from both sides (rejecting unauthorized requests while successfully authorizing valid requests). Zero secrets were printed or logged during execution.

---

## 💶 2. Container Memory Rate Correction & Resource Value Upper Bound

### Published Cloudflare Container Rates & Included Allowances

```text
CPU:         375 vCPU-minutes included
             $0.000020 per additional vCPU-second

Memory:      25 GiB-hours included
             $0.0000025 per additional GiB-second (Corrected from $0.0000028)

Disk:        200 GB-hours included
             $0.00000007 per additional GB-second

Durable Obj: 400,000 GB-seconds included
```

### Lite Container Specification & Rate-Card Resource Allocation

A `lite` container instance provides:
- **vCPU**: 1/16 vCPU
- **Memory**: 256 MiB RAM (0.25 GiB)
- **Disk**: 2 GB Disk

For **2,340 wall-clock seconds** (100-job canary run total duration):

```text
CPU Upper Bound:
2,340s × (1/16 vCPU) × $0.000020 = $0.002925

Memory Resource Value:
2,340s × 0.25 GiB × $0.0000025 = $0.0014625

Disk Resource Value:
2,340s × 2.0 GB × $0.00000007 = $0.0003276

--------------------------------------------------
Combined Rate-Card Upper-Bound Estimate: ~$0.0047151 (~$0.00472)
```

> **Calculation Label**: `RATE_CARD_UPPER_BOUND_ESTIMATE`  
> **Actual Billed Incremental Overage**: **$0.00** (Usage remained strictly inside included plan allowances).

---

## 📦 3. Reconciled R2 Operation Ledger

Derived directly from runtime application counters (`r2Operations`) across the 100-job canary run (90 successful conversions, 10 fail-closed rejections, 1 pre-run inspect, 1 post-run inspect):

| R2 Operation Type | Per-Job Count | Run Total (90 Jobs + Inspections) | Cloudflare R2 Classification | Billed Cost |
|---|---|---|---|---|
| **PutObject** | 2 (Input + Output) | 180 PUTs | **Class A** | Included |
| **ListObjects** | 0 (Convert route) | 2 LISTs (Pre & Post Inspect) | **Class A** | Included |
| **GetObject** | 3 (Readback + 2 Checks) | 270 GETs | **Class B** | Included |
| **HeadObject** | 2 (Input + Output Check) | 180 HEADs | **Class B** | Included |
| **DeleteObject** | 2 (Input + Output Delete) | 180 DELETEs | **Free** | $0.00 |

### Summary R2 Ledger Totals
- **Class A Operations (PUT + LIST)**: **182**
- **Class B Operations (GET + HEAD)**: **450**
- **Delete Operations (Free)**: **180**
- **Post-Run Orphan Retention**: **0 remaining objects** (Automatic Zero-Retention Verified)

---

## 💰 4. Standardized Cost Presentation

```text
FIXED MONTHLY COST:
$5.00 plus applicable tax (Workers Paid Subscription)

ACTUAL INCREMENTAL BILLED COST:
$0.00 (Stayed within included plan allowances)

RATE_CARD_UPPER_BOUND_ESTIMATE:
Up to approximately $0.00472 total for this 100-job test

EFFECTIVE COST ALLOCATION:
100 jobs sharing $5 subscription:       $0.0500 / job
1,000 jobs sharing $5 subscription:     $0.0050 / job
10,000 jobs sharing $5 subscription:    $0.0005 / job

PROVIDER_MEASURED_MARGINAL_COST:
Pending Cloudflare dashboard export
```

---

## 🛡️ 5. Private Beta Operational Guardrails

The application and infrastructure enforce the following strict private-beta constraints:

- **Testers Limit**: 5–10 named testers.
- **Conversion Cap**: 100 total conversions (`PRIVATE_BETA_FINANCIAL_READY: PASSED_WITH_CAP`).
- **File Size Ceiling**: 25 MB maximum payload (`FILE_TOO_LARGE` HTTP 413 enforced).
- **Container Scale**: 1 Container instance maximum (`sleepAfter = "10m"`).
- **Billing**: Customer billing disabled.
- **Search Indexing**: Public indexing disabled (`X-Robots-Tag: noindex, nofollow`, `robots.txt`).

---

## 🔒 7. Private Beta Deployment Freeze Manifest

To prevent version drift during private-beta telemetry collection, the engine configuration and binaries are frozen to the following authoritative identifiers:

```text
================================================================================
               FILEKIT PRIVATE-BETA GOVERNANCE DEPLOYMENT FREEZE
================================================================================
Engine Source Commit:   cb0810b72a9c0bf862d066a576e86ddeed10c7e1
Evidence/Freeze Commit: e7ed12e4f01476dd983f4b6ad85675e4eb012a64
Worker Service Name:    filekit-office-worker-canary
Worker Version ID:      439d2cc8-7d7a-4714-bc86-c5545d57d4bd
Container Image SHA:    sha256:34858208ba2b1b6b5489a9520d4e941fbb0bbe8f6283abb64a220de4e0d0b86c
Wrangler CLI:           4.116.0
Release Tag:            word-to-pdf-private-beta-v1
Status:                 POST_FREEZE_SMOKE_VERIFIED: PASSED
Server-Side Cap:        Enforced (100 jobs max, HTTP 429 on overflow)
================================================================================
```

---

## 📋 8. Real-User Beta Job Telemetry Schema

For every conversion executed during the 100-job private beta window, the system captures the following structured telemetry record:

```json
{
  "jobId": "beta_job_string",
  "timestamp": "ISO-8601 UTC",
  "fileSize": 0,
  "pageCount": 0,
  "executionMode": "COLD_START | WARM_INSTANCE",
  "conversionDurationMs": 0,
  "outcome": "SUCCESS | PREFLIGHT_REJECTED | CONVERSION_FAILED",
  "rejectionReason": null,
  "pdfVerified": true,
  "cleanupResult": "ZERO_RETENTION_CONFIRMED",
  "userFidelityFeedback": null
}
```

---

## 💰 9. Official Financial Planning Baseline

```text
Fixed Platform Cost:       $5.00 / month plus tax (Workers Paid Plan)
Ordinary Job Budget:       $0.00010 / job (Conservatively includes edge variance & cold starts)
Current Usage Overage:     $0.00 (Inside included allowances)
Private-Beta Conversion Cap: 100 jobs maximum
```

> **Final Verdict**: **Word-to-PDF is approved for the controlled private beta.** Synthetic laboratory validation is complete. The system will now begin meeting real human documents under founder-monitored supervision.
