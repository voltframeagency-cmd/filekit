import { CONVERSION_CATALOG, getSitemapRoutes as getCatalogSitemapRoutes, getCatalogStats } from "../conversionCatalog";
import siteSitemap from "../../app/sitemap";

async function runCatalogTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Conversion Catalog & Sitemap SEO Tests");
  console.log("--------------------------------------------------");

  // 1. Catalog Sitemaps Filtering
  const catalogSitemapRoutes = getCatalogSitemapRoutes();

  if (!catalogSitemapRoutes.includes("/convert-image")) throw new Error("Indexable route missing from catalog sitemap: /convert-image");
  if (!catalogSitemapRoutes.includes("/jpg-to-png")) throw new Error("Indexable route missing from catalog sitemap: /jpg-to-png");
  if (!catalogSitemapRoutes.includes("/pdf-to-image")) throw new Error("Indexable route missing from catalog sitemap: /pdf-to-image");
  if (!catalogSitemapRoutes.includes("/image-to-pdf")) throw new Error("Indexable route missing from catalog sitemap: /image-to-pdf");

  if (catalogSitemapRoutes.includes("/word-to-pdf")) throw new Error("Unbuilt PLANNED route incorrectly included in catalog sitemap: /word-to-pdf");
  if (catalogSitemapRoutes.includes("/pdf-to-jpeg")) throw new Error("REDIRECT_ALIAS route incorrectly included in catalog sitemap: /pdf-to-jpeg");
  if (catalogSitemapRoutes.includes("/pdf-to-picture")) throw new Error("REDIRECT_ALIAS route incorrectly included in catalog sitemap: /pdf-to-picture");
  console.log("✓ Catalog sitemap inclusion & exclusion rules verified.");

  // 2. Site-wide Sitemap Composition Verification
  const fullSitemap = siteSitemap();
  const fullUrls = fullSitemap.map((s) => s.url);

  // Must contain core and compressor routes
  const requiredCore = ["/", "/compress-pdf", "/compress-pdf-to-2mb", "/compress-image", "/compress-image-to-200kb"];
  requiredCore.forEach((path) => {
    const hasMatch = fullUrls.some((u) => u.endsWith(path));
    if (!hasMatch) throw new Error(`Site-wide sitemap missing core route: ${path}`);
  });

  // Must contain all 13 indexable conversion routes
  catalogSitemapRoutes.forEach((path) => {
    const hasMatch = fullUrls.some((u) => u.endsWith(path));
    if (!hasMatch) throw new Error(`Site-wide sitemap missing conversion route: ${path}`);
  });

  // Must NOT contain any planned or alias routes
  if (fullUrls.some((u) => u.endsWith("/word-to-pdf"))) throw new Error("Site-wide sitemap contains PLANNED route: /word-to-pdf");
  if (fullUrls.some((u) => u.endsWith("/pdf-to-jpeg"))) throw new Error("Site-wide sitemap contains ALIAS route: /pdf-to-jpeg");

  console.log(`✓ Site-wide sitemap composition verified: Total ${fullSitemap.length} sitemap URLs.`);

  // 3. Canonical Target Rules for Redirect Aliases
  const aliases = Object.values(CONVERSION_CATALOG).filter((e) => e.indexabilityStatus === "REDIRECT_ALIAS");
  aliases.forEach((alias) => {
    if (!alias.canonicalSlug) throw new Error(`Alias missing canonicalSlug: ${alias.slug}`);
    const target = CONVERSION_CATALOG[alias.canonicalSlug];
    if (!target) throw new Error(`Alias target does not exist: ${alias.canonicalSlug}`);
    if (target.indexabilityStatus !== "INDEXABLE") throw new Error(`Alias target is not INDEXABLE: ${alias.canonicalSlug}`);
    if (target.implementationStatus !== "PRODUCTION_FROZEN") throw new Error(`Alias target is not PRODUCTION_FROZEN: ${alias.canonicalSlug}`);
  });
  console.log("✓ Redirect alias canonical target rules verified.");

  // 4. Catalog Statistics Audit
  const stats = getCatalogStats();
  console.log(`✓ Functional production-frozen tools: ${stats.productionFrozenCount}`);
  console.log(`✓ Redirect aliases: ${stats.redirectAliasCount}`);
  console.log(`✓ Planned tools: ${stats.plannedCount}`);
  console.log(`✓ Total catalog entries: ${stats.totalEntries}`);

  console.log("--------------------------------------------------");
  console.log("ALL CONVERSION CATALOG SEO TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runCatalogTests().catch((err) => {
  console.error("Catalog test failed:", err);
  process.exit(1);
});
