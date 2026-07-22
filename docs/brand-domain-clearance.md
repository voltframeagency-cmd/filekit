# Brand & Domain Clearance Audit — Project FileKit

> **Status**: **CLEARANCE PENDING**
> **Current Build Tag**: `phase2b4-origin-guard`

---

## ⚠️ 1. Commercial Brand & Domain Collision Assessment

1. **Unowned Production Domain**:
   - `filekit.app` is an active platform operated by Flikko Technologies in India, hosting digital content monetization and file sharing software.
   - Native mobile applications exist on iOS and Android under the **FileKit** brand.
   - `filekit.com` is a branded short-domain redirect placeholder.

2. **Product Identity Risk**:
   - Deploying an in-browser compression utility under `filekit.app` or `filekit.com` creates canonical hostname pollution, search engine indexing conflicts, and user confusion.

---

## 📋 2. Strategic Founder Directives

- **Origin Hard Guard**: The production build configuration strictly rejects `filekit.app` and `filekit.com` as canonical origins.
- **Mandatory Environment Variable**: `NEXT_PUBLIC_SITE_URL` must be explicitly configured with an owned, cleared domain prior to live deployment.
- **Pre-Launch Renaming Strategy**: Name clearance and domain acquisition must occur before search engine submission, backlink indexation, or user traffic accumulation.

---

## 🔒 3. Release Sequence Requirements

```text
[1] Select & Clear Owned Brand / Domain
    ↓
[2] Configure DNS & HTTPS Infrastructure
    ↓
[3] Set NEXT_PUBLIC_SITE_URL=<cleared-owned-domain>
    ↓
[4] Deploy Engine & Verify HTTP 200 Routes
    ↓
[5] Submit /sitemap.xml to Search Engines
```
