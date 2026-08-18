import fs from "fs";
import path from "path";
import { CONVERSION_CATALOG, getSitemapRoutes } from "../src/config/conversionCatalog";
import siteSitemap from "../src/app/sitemap";

interface RouteAuditReport {
  totalCatalogEntries: number;
  productionFrozenCount: number;
  plannedCount: number;
  indexableCount: number;
  redirectAliasCount: number;
  notPublicCount: number;
  navigationEnabledCount: number;
  sitemapEnabledCount: number;
  sitemapUrlsCount: number;
  coreRoutesCount: number;
  catalogSitemapRoutesCount: number;
  missingFilesystemRoutes: string[];
  invalidRedirectTargets: string[];
  circularRedirects: string[];
}

function runAudit() {
  const catalogEntries = Object.entries(CONVERSION_CATALOG);
  const totalCatalogEntries = catalogEntries.length;

  const productionFrozen = catalogEntries.filter(([_, e]) => e.implementationStatus === "PRODUCTION_FROZEN");
  const planned = catalogEntries.filter(([_, e]) => e.implementationStatus !== "PRODUCTION_FROZEN");
  if (planned.length > 0) {
    console.log("Non-frozen entries:", planned.map(([k, v]) => `${k} (${v.implementationStatus})`));
  }

  const indexable = catalogEntries.filter(([_, e]) => e.indexabilityStatus === "INDEXABLE");
  const redirectAlias = catalogEntries.filter(([_, e]) => e.indexabilityStatus === "REDIRECT_ALIAS");
  const notPublic = catalogEntries.filter(([_, e]) => e.indexabilityStatus === "NOT_PUBLIC");

  const navEnabled = catalogEntries.filter(([_, e]) => e.navigationEnabled);
  const sitemapEnabled = catalogEntries.filter(([_, e]) => e.sitemapEnabled);

  const catalogSitemapRoutes = getSitemapRoutes();
  const fullSitemap = siteSitemap();

  const missingFilesystemRoutes: string[] = [];
  const invalidRedirectTargets: string[] = [];
  const circularRedirects: string[] = [];

  const appDir = path.join(process.cwd(), "src", "app");

  for (const [slug, entry] of catalogEntries) {
    // 1. Filesystem existence check
    const routeFolder = slug.replace(/^\//, "");
    const pagePath = path.join(appDir, routeFolder, "page.tsx");
    if (!fs.existsSync(pagePath)) {
      missingFilesystemRoutes.push(slug);
    }

    // 2. Redirect alias integrity check
    if (entry.indexabilityStatus === "REDIRECT_ALIAS") {
      if (!entry.canonicalSlug) {
        invalidRedirectTargets.push(`${slug} -> MISSING_CANONICAL_SLUG`);
      } else {
        const targetEntry = CONVERSION_CATALOG[entry.canonicalSlug as keyof typeof CONVERSION_CATALOG];
        if (!targetEntry) {
          invalidRedirectTargets.push(`${slug} -> ${entry.canonicalSlug} (Target not in catalog)`);
        } else if (targetEntry.indexabilityStatus === "REDIRECT_ALIAS") {
          circularRedirects.push(`${slug} -> ${entry.canonicalSlug} (Target is also an alias!)`);
        } else if (targetEntry.implementationStatus !== "PRODUCTION_FROZEN") {
          invalidRedirectTargets.push(`${slug} -> ${entry.canonicalSlug} (Target not PRODUCTION_FROZEN)`);
        }
      }
    }
  }

  console.log("==================================================================");
  console.log("           FILEKIT CATALOG ARITHMETIC & RECONCILIATION            ");
  console.log("==================================================================");
  console.log(`Total Catalog Entries:           ${totalCatalogEntries}`);
  console.log(`- PRODUCTION_FROZEN:             ${productionFrozen.length}`);
  console.log(`- PLANNED:                       ${planned.length}`);
  console.log("------------------------------------------------------------------");
  console.log(`- INDEXABLE:                     ${indexable.length}`);
  console.log(`- REDIRECT_ALIAS:                ${redirectAlias.length}`);
  console.log(`- NOT_PUBLIC:                    ${notPublic.length}`);
  console.log("------------------------------------------------------------------");
  console.log(`- Navigation Enabled:            ${navEnabled.length}`);
  console.log(`- Sitemap Enabled:               ${sitemapEnabled.length}`);
  console.log(`- Catalog Sitemap Routes:        ${catalogSitemapRoutes.length}`);
  console.log(`- Site-wide Sitemap URLs:        ${fullSitemap.length}`);
  console.log("==================================================================");

  console.log("\n--- Category Breakdown ---");
  console.log(`Indexable Live Tools in Catalog: ${indexable.length}`);
  console.log(`Core / Compressor Live Routes:   10`);
  console.log(`Total Functional Live Tools:     ${indexable.length + 10} (${indexable.length} catalog + 10 core/compressors)`);
  console.log(`Total Public Sitemap URLs:       ${fullSitemap.length}`);
  console.log(`Total 308 Canonical Aliases:     ${redirectAlias.length}`);
  console.log(`Total Public App Routes:         ${fullSitemap.length + redirectAlias.length} (${fullSitemap.length} sitemap + ${redirectAlias.length} aliases)`);

  console.log("\n--- Integrity Verification ---");
  console.log(`Missing Filesystem Routes:       ${missingFilesystemRoutes.length === 0 ? "None (0)" : JSON.stringify(missingFilesystemRoutes)}`);
  console.log(`Invalid Redirect Targets:        ${invalidRedirectTargets.length === 0 ? "None (0)" : JSON.stringify(invalidRedirectTargets)}`);
  console.log(`Circular Redirects:              ${circularRedirects.length === 0 ? "None (0)" : JSON.stringify(circularRedirects)}`);
}

runAudit();
