# Cloudflare Containers + R2 Storage Least-Privilege Canary Deployment Guide

## 1. Wrangler Authentication & R2 Bucket Binding (No Broad JSON Keys Required)

```bash
# Authenticate Wrangler CLI locally
npx wrangler login

# Create Cloudflare R2 Canary Bucket
npx wrangler r2 bucket create filekit-canary-r2-staged

# Configure R2 bucket CORS for scoped signed uploads
npx wrangler r2 bucket cors set filekit-canary-r2-staged --file=server/containers/office-worker/r2-cors.json
```

---

## 2. Deploy Container Worker via Cloudflare Containers

```bash
# Deploy container worker with 1 vCPU, 1 GiB RAM, concurrency = 1
npx wrangler deploy server/containers/office-worker/wrangler.toml
```

---

## 3. Teardown Protocol

```bash
# Delete Cloudflare worker & R2 bucket
npx wrangler delete --name filekit-office-worker-canary
npx wrangler r2 bucket delete filekit-canary-r2-staged
```
