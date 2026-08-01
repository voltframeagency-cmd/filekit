# Rate-Card Cost Estimation Report

> **Classification**: `RATE_CARD_UPPER_BOUND_ESTIMATE` (Provider-Measured Cost Pending Cloudflare Dashboard Export)  
> **Date**: 2026-08-01  

---

## 📊 Status Matrix & Cost Governance

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

## 💶 Cloudflare Lite Container Upper-Bound Resource Schedule

For the 100-job canary run (2,340 wall-seconds total):

- **vCPU Rate**: $0.000020 per vCPU-second (1/16 vCPU $\implies$ $0.002925)
- **GiB Memory Rate**: **$0.0000025 per GiB-second** (256 MiB RAM $\implies$ $0.0014625)
- **Disk Rate**: $0.00000007 per GB-second (2 GB Disk $\implies$ $0.0003276)
- **Combined Upper-Bound Rate-Card Estimate**: **~$0.00472**
- **Actual Billed Usage Overage**: **$0.00** (Inside plan allowances)
- **Fixed Monthly Subscription**: **$5.00 plus tax**

> **Cost Scaling Audit**: Verified that cost increases strictly monotonically with conversion duration ($5600\text{ms} > 1950\text{ms} > 1600\text{ms} > 720\text{ms} \implies \text{Cost}(5600\text{ms}) > \text{Cost}(1950\text{ms}) > \text{Cost}(1600\text{ms}) > \text{Cost}(720\text{ms})$). Upper-bound calculation is labeled `RATE_CARD_UPPER_BOUND_ESTIMATE` until provider dashboard export is available.
