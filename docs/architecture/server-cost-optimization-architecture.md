# Technical Specification: FileKit Server Cost Optimization Architecture (Design Scaffold)

> **Document Status**: `EXPERIMENTAL_INFRASTRUCTURE` (Design Scaffold Specification)  
> **Server Engine Status**: `PLANNED` (Infrastructure under development; 0 live server engines)

---

## Executive Summary & Strategic Thesis

Server processing for file conversion, OCR, and PDF manipulation does **not** need to be expensive. By adhering to FileKit's **Browser-First, Capability-Routing Architecture**, the server performs **only the work the browser cannot safely perform**.

```text
================================================================================
               FILEKIT ADVISORY CAPABILITY ROUTING FIREWALL
================================================================================

  Client Browser Selection
            │
            ▼
  ┌──────────────────────────────────────────────────────────┐
  │ Local Preflight Inspection (Magic Bytes, MIME, Page Count)│
  └─────────────────────────┬────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    [ LOCAL_SAFE ]                  [ SERVER_REQUIRED ]
  No server compute used          Browser Preprocessing
  - File stays on device         - Blank-Page Removal
  - Subject to device limits     - Image Downscaling / Grayscale
  - Unlimited Scale              - Text-Layer Detection
                                            │
                                            ▼
                                ┌───────────────────────┐
                                │ Server Security Gate  │
                                │ (Re-validate Inputs)  │
                                └───────────┬───────────┘
                                            │
                                            ▼
                                ┌───────────────────────┐
                                │ Complexity Lane Alloc │
                                └───────────┬───────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
         [ FAST LANE ]              [ STANDARD LANE ]            [ COMPLEX LANE ]
        - 1 vCPU / 1GB RAM          - 2 vCPU / 2GB RAM           - 4 vCPU / 8GB RAM
        - Target: ~€0.000795        - Target: ~€0.00318          - Target: ~€0.0139
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            │
                                            ▼
                                ┌───────────────────────┐
                                │ Direct Storage Flow   │
                                └───────────┬───────────┘
                                            │
                                            ▼
                                [ Customer Download ]
                                Input/Output Auto-Deleted
================================================================================
```

---

## 1. Parameterized Cost Modeling Engine

All cloud compute and storage estimates are parameterized via explicit provider variables ([serverCostOptimization.ts](file:///C:/Users/mahdi/.gemini/antigravity-ide/scratch/filekit/src/lib/engine/serverCostOptimization.ts)):

```typescript
export interface CloudProviderPricingParams {
  provider: "Google Cloud Run";
  region: "europe-west1";
  pricingDate: "2026-07-30";
  currency: "EUR";
  cpuSecondRateEUR: 0.000024;
  ramGiBSecondRateEUR: 0.0000025;
  storageGBMonthRateEUR: 0.015;
  egressGBRateEUR: 0.00; // Zero egress architecture (Cloudflare R2)
  classAOpsRateEUR: 0.0000045;
  classBOpsRateEUR: 0.00000035;
  durationAssumptionSeconds: number;
  cpuAssumptionVCPU: number;
  memoryAssumptionGiB: number;
}
```

Every output calculation is explicitly labeled:
- **`ESTIMATED`**: Modeled calculation based on provider rate assumptions.
- **`MEASURED`**: Empirical benchmark results from actual container runs.
- **`PROVIDER_RECONCILED`**: Reconciled against actual cloud billing statements.

---

## 2. 3-Tier Margin Metrics Matrix

To avoid misleading comparisons between single-job compute costs and full job passes, FileKit enforces three distinct margin metrics:

```text
Job Pass Price (25% VAT included):        €4.90
Net Revenue (after VAT):                   €3.92
Net Available Revenue (after €0.30 fee):   €3.62
Modeled Infrastructure (6 jobs @ €0.04):   €0.254
```

| Metric | Includes | Formula | Value |
|---|---|---|---|
| **1. Single-Job Compute Margin** | Engine CPU & RAM only | `(Pass Price - Single Job Compute) / Pass Price` | **> 98.0%** |
| **2. Infrastructure Contribution Margin** | Compute + Storage + Bandwidth + Scanning + Retries | `(Net Revenue - Total Infra per Pass) / Net Revenue` | **93.5%** |
| **3. Commercial Contribution Margin** | Infrastructure + VAT + Gateway Fees + Support & Refunds | `(Net Available Revenue - Total Infra per Pass) / Net Revenue` | **85.9%** |

---

## 3. Advisory Preflight vs Server Security Boundary

Client-side preflight is an **advisory cost filter**, not a security boundary. Because a malicious client can bypass browser code, the server boundary revalidates every upload:

```text
Browser Client Inspection (Advisory Cost Filter)
  └── Pre-signed Upload Request
        │
        ▼
Server Security Revalidation Boundary
  ├── Magic-byte validation
  ├── Strict MIME & extension allowlist
  ├── Archive-expansion & zip-bomb check
  ├── Malware & virus scanning
  └── Isolated single-use container execution
```

---

## 4. Approved Technical Disclosures

- **Local Execution**: *"No server compute is used for this operation."*
- **Local Privacy**: *"File content stays on the device for this operation."*
- **Local Capacity**: *"No central processing capacity is consumed, subject to device limits."*
- **Server Cost Estimates**: All cost figures are explicitly stated as **`Target Estimates`**.

---

## 5. Honest Accounting & Status Summary

```text
================================================================================
               FILEKIT READINESS ACCOUNTING SUMMARY
================================================================================
  Functional Public Tool Routes:              29   (100% Artifact Verified)
  PDFAid Functional Intents Covered:          19 / 84 (22.6% True Functional Coverage)
  Operational Engine Families:                 6 / 11
  Planned Route Shells:                       17   (PLANNED / NOT_PUBLIC)
  Planned Server Engine Families:              3   (OFFICE_TO_PDF, OCR, PDF_TO_OFFICE)
  Planned Geometry Engine Family:              1   (PDF_GEOMETRY)
  Cost Optimization Module Status:            EXPERIMENTAL_INFRASTRUCTURE (Scaffold)
  New Verified Server Engines:                 0
  New Measured Server Jobs:                    0
================================================================================
```
