# Launch Catalog Reconciliation and Quality Audit Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Authoritatively classify all 133 catalog routes into launch-ready, gated, and experimental tiers, enforce gating for WOFF2 and unverified Kindle conversions across navigation, search, recommendations, and sitemaps, verify core PDF/image outputs using independent readers, and preserve the passing CI gate throughout.

**Architecture:** Maintain a single source of truth in `src/config/conversionCatalog.ts` with explicit `IndexabilityStatus` (`INDEXABLE` vs `NOINDEX` vs `REDIRECT_ALIAS` vs `NOT_PUBLIC`) and `ConversionRouteStatus`. Reconcile `src/config/navigation.ts` and `SiteHeader.tsx` so customer-facing navigation and live search exclusively expose launch-ready tools. Validate core processing engines against real fixtures using independent parser libraries and document boundary conditions.

**Tech Stack:** Next.js 16 (Turbopack), TypeScript 5, React 19, pdf-lib, pdfjs-dist, Playwright, Node.js 22.

---

### Task 1: Audit & Classify Catalog Inventory (133 Tools)

**Files:**
- Audit: `src/config/conversionCatalog.ts`
- Script: `scripts/audit_tool_inventory.ts`

**Step 1: Write an inventory audit script**
Create `scripts/audit_tool_inventory.ts` to inspect all 133 routes and partition them into:
1. **Launch-Ready (116 tools):** Fully functional local or server engines, interactive UI, verified output, complete metadata, and full 39-locale localization.
2. **Gated (4 tools):** `/ttf-to-woff2`, `/woff2-to-ttf`, `/mobi-to-pdf`, `/azw3-to-pdf`. Functional or under evaluation, but held behind `GatedToolNotice` due to font container or PalmDOC parsing validation limits. Must be `NOINDEX`, `navigationEnabled: false`, `sitemapEnabled: false`.
3. **Redirect Aliases (11 tools):** Legacy/convenience URL aliases (`/pdf-to-jpeg`, `/docx-to-pdf`, etc.) canonicalized with HTTP 301 / metadata pointing to primary routes.
4. **Experimental / Planned (2 tools):** `/sign-pdf`, `/add-image-to-pdf` (`NOT_PUBLIC`, `PLANNED`).

**Step 2: Run script to verify classifications**
Run: `npx tsx scripts/audit_tool_inventory.ts`
Expected: Clear output breaking down 116 launch-ready, 4 gated, 11 aliases, and 2 planned tools.

---

### Task 2: Gate WOFF2 and Kindle Conversions in Catalog & Navigation

**Files:**
- Modify: `src/config/conversionCatalog.ts` (lines ~1419–1502)
- Modify: `src/config/navigation.ts` (lines ~173–175)

**Step 1: Update `src/config/conversionCatalog.ts`**
For `/ttf-to-woff2`, `/woff2-to-ttf`, `/mobi-to-pdf`, and `/azw3-to-pdf`:
- Set `indexabilityStatus: "NOINDEX"`
- Set `navigationEnabled: false`
- Set `sitemapEnabled: false`
- Set `implementationStatus: "FUNCTIONAL"` (or keep as gated functional)

**Step 2: Update `src/config/navigation.ts`**
Remove `/ttf-to-woff2` and `/woff2-to-ttf` from `CONVERTER_NAVIGATION_GROUPS` under `archive-tools`. Ensure `/mobi-to-pdf` and `/azw3-to-pdf` are not listed.

**Step 3: Verify Gated Routes Still Render Localized Notices**
Ensure direct access to `/ttf-to-woff2`, `/woff2-to-ttf`, `/mobi-to-pdf`, and `/azw3-to-pdf` continues to render `GatedToolNotice` with localized explanations and back-to-tools actions across all 39 locales.

---

### Task 3: Reconcile Live Header Search & Recommendations

**Files:**
- Modify: `src/components/navigation/SiteHeader.tsx`
- Modify: `src/config/conversionCatalog.ts` (review `relatedRoutes`)

**Step 1: Reconcile Live Header Search**
Update `ALL_SEARCHABLE_TOOLS` in `SiteHeader.tsx` so that:
- Gated tools (`/ttf-to-woff2`, `/woff2-to-ttf`, `/mobi-to-pdf`, `/azw3-to-pdf`) do not appear in auto-complete.
- Aliases and planned tools are excluded.
- The search index comprehensively represents the launch-ready suite.

**Step 2: Audit Recommendations (`relatedRoutes`)**
Ensure `relatedRoutes` arrays across all catalog entries reference only launch-ready routes.

---

### Task 4: Reconcile Catalog Tests & CI Assertions

**Files:**
- Modify: `src/config/__tests__/run_catalog_tests.ts`
- Modify: `src/config/__tests__/universal_pseo_uniformity.test.ts`
- Modify: `src/config/__tests__/i18n_catalog.test.ts`

**Step 1: Update Indexable Route Assertions**
- Update indexable route count expectation from 120 to 116 (120 minus 4 gated tools).
- In `run_catalog_tests.ts`, assert that `/ttf-to-woff2`, `/woff2-to-ttf`, `/mobi-to-pdf`, and `/azw3-to-pdf` are excluded from the sitemap (`sitemapEnabled === false`).
- In `universal_pseo_uniformity.test.ts`, update the minimum indexable threshold to 116 and verify all 116 have complete hreflang, metadata, and JSON-LD schemas.
- In `i18n_catalog.test.ts`, update expected sitemap counts (116 conversion routes + 9 core compressor routes = 125 unique routes × 39 locales = 4,875 URLs + static core).

**Step 2: Run Unit and Catalog Test Suite**
Run: `npm test`
Expected: 100% pass across all 20,000+ assertions.

---

### Task 5: Independent Verification of Core PDF & Image Outputs

**Files:**
- Create: `scripts/verify_core_output_quality.ts`
- Test fixtures: `test-fixtures/*.pdf`, sample images

**Step 1: Write Automated Quality Verification Script**
Implement independent reader checks:
1. **PDF Compression & Optimization:** Load compressed buffer into `pdfjs-dist` and `pdf-lib`. Assert valid cross-reference tables, page count preservation, and absence of corrupted streams.
2. **PDF Page Organization (Merge, Split, Rotate, Delete, Watermark, Flatten):** Verify structural validity, page ordering, and correct page dimensions using `pdf-lib`.
3. **Image Conversions (JPG, PNG, WebP, BMP, ICO):** Verify magic bytes, image dimensions, and valid decodability.
4. **Document Unsupported Edge Cases:**
   - Encrypted / password-protected PDFs (`encrypted_aes256.pdf`, `password_protected.pdf`) correctly trigger `PDF_ENCRYPTED_OR_LOCKED`.
   - Digitally signed documents correctly trigger `UNSUPPORTED_SIGNED_DOCUMENT`.
   - Damaged / zero-byte payloads correctly reject in <5ms.

**Step 2: Execute Verification Script**
Run: `npx tsx scripts/verify_core_output_quality.ts`
Expected: All output checks pass; boundary constraints documented.

---

### Task 6: Comprehensive Documentation & CI Verification

**Files:**
- Create: `docs/launch-catalog-authoritative-inventory.md`
- Run: Full CI regression pipeline (`npm test`, `npm run build`, `npm run test:i18n:ssr`, `npm run test:e2e:i18n`)

**Step 1: Generate Authoritative Inventory Document**
Document all 133 tools in `docs/launch-catalog-authoritative-inventory.md`, specifying:
- Category / Family
- Slug & Output Format
- Engine ID & Execution Mode (Local Browser vs Server Container)
- Status (Launch-Ready, Gated, Redirect Alias, Experimental)
- Quality Audit Results & Known Unsupported Cases

**Step 2: Run Full Local Verification**
Run:
1. `npm test`
2. `npm run build`
3. `npm run test:i18n:ssr`
4. `npm run test:e2e:i18n`

**Step 3: Commit and Push to GitHub**
Push to `phase2-local-pdf-engine` and verify GitHub Actions executes with a clean green check.
