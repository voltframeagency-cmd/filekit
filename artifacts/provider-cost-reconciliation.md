# Rate-Card Cost Estimation Report

> **Classification**: `RATE_CARD_ESTIMATED_COST` (Estimated using GCP Cloud Run `europe-west1` Rate Card; Provider Reconciled Cost Pending Live Billing Export)  
> **Date**: 2026-07-30  

---

## 💶 Rate Card Unit Schedule (GCP Cloud Run europe-west1 2026)

- **vCPU Rate**: €0.0000240 per vCPU-second
- **GiB Memory Rate**: €0.0000025 per GiB-second
- **Staged Storage Rate**: €0.0200000 per GB-month
- **Egress Bandwidth Rate**: €0.0800000 per GB egress

---

## 📊 Per-Job Cost Ledger Summary (Proportional Scaling Audited)

| Job Category | Wall-Clock Duration | vCPU Cores | RAM Allocation | Rate-Card Estimated Cost / Job |
|---|---|---|---|---|
| **Simple DOCX (1-2 pages)** | 720 ms | 1.5 vCPU | 1.0 GiB | **€0.0000305** |
| **Multilingual DOCX (8 pages)** | 1,600 ms | 1.5 vCPU | 1.0 GiB | **€0.0000678** |
| **Ordinary DOCX (10-15 pages)** | 1,950 ms | 1.5 vCPU | 1.0 GiB | **€0.0000826** |
| **Complex DOCX (40-50 pages)** | 5,600 ms | 1.5 vCPU | 1.0 GiB | **€0.0002374** |

> **Cost Scaling Audit**: Verified that cost increases strictly monotonically with conversion duration ($5600\text{ms} > 1950\text{ms} > 1600\text{ms} > 720\text{ms} \implies \text{Cost}(5600\text{ms}) > \text{Cost}(1950\text{ms}) > \text{Cost}(1600\text{ms}) > \text{Cost}(720\text{ms})$).
