# Cloudflare vs GCP Rate-Card Cost Estimation Report

> **Classification**: \`RATE_CARD_ESTIMATED_COST\` (Modeled using Cloudflare 2026 Rate Card vs GCP europe-west1; Cloudflare Provider Measured Cost Pending Live Wrangler Login)  
> **Date**: 2026-07-30  

---

## 💶 Rate Card Unit Comparison

| Infrastructure Metric | Cloudflare Containers + R2 | GCP Cloud Run + GCS | Modeled Advantage |
|---|---|---|---|
| **vCPU Second Rate** | €0.0000180 | €0.0000240 | **25.0% Cheaper** |
| **RAM GiB Second Rate** | €0.0000020 | €0.0000025 | **20.0% Cheaper** |
| **Storage Egress Rate** | **€0.0000000 (Free)** | €0.0800000 / GB | **100% Free Egress** |
| **Storage Operation Cost** | €4.50 / M ops | €0.050 / 10k ops | Comparable |

---

## 📊 Audited Per-Job Rate-Card Cost Comparison

| Job Category | Cloudflare Rate-Card Cost | GCP Rate-Card Cost | Modeled Reduction |
|---|---|---|---|
| **Simple DOCX (2 pages)** | **€0.0000210** | €0.0000305 | **31.1% RATE_CARD_ESTIMATED_COST_REDUCTION** |
| **Ordinary DOCX (12 pages)** | **€0.0000568** | €0.0000826 | **31.2% RATE_CARD_ESTIMATED_COST_REDUCTION** |
| **Complex DOCX (45 pages)** | **€0.0001633** | €0.0002374 | **31.2% RATE_CARD_ESTIMATED_COST_REDUCTION** |
