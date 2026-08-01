# Cloudflare vs GCP Cost Reconciliation Report

> **Classification**: `RATE_CARD_UPPER_BOUND_ESTIMATE` (Published Cloudflare 2026 Rate Card vs Live Usage Allowances)  
> **Date**: 2026-08-01  

---

## 💶 Published Cloudflare Container Rates & Included Allowances

| Resource Dimension | Included Monthly Allowance | Additional Usage Rate Card | Lite Instance Value (2,340s Wall Time) |
|---|---|---|---|
| **CPU** | 375 vCPU-minutes | $0.000020 / vCPU-second | $0.002925 (Upper bound @ 1/16 vCPU) |
| **Memory** | 25 GiB-hours | **$0.0000025 / GiB-second** | $0.0014625 (Provisioned @ 256 MiB) |
| **Disk** | 200 GB-hours | $0.00000007 / GB-second | $0.0003276 (Provisioned @ 2 GB) |
| **Durable Objects** | 400,000 GB-seconds | $0.0000025 / GB-second | Included ($0.00 overage) |

---

## 📊 Summary Cost Presentation

- **FIXED MONTHLY COST**: **$5.00 plus applicable tax**
- **ACTUAL USAGE OVERAGE**: **$0.00**
- **RATE_CARD_UPPER_BOUND_ESTIMATE**: **~$0.00472 total**
- **EFFECTIVE FIXED COST ALLOCATION**:
  - 100 jobs: **$0.0500 / job**
  - 1,000 jobs: **$0.0050 / job**
  - 10,000 jobs: **$0.0005 / job**
- **PROVIDER_MEASURED_MARGINAL_COST**: **PENDING** (Cloudflare dashboard export)
