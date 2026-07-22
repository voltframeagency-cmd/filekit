import { CONVERSION_CATALOG, getSitemapRoutes, getCatalogStats } from "../conversionCatalog";

async function runCatalogTests() {
  console.log("--------------------------------------------------");
  console.log("Starting FileKit Conversion Catalog SEO Tests");
  console.log("--------------------------------------------------");

  const sitemapRoutes = getSitemapRoutes();

  // 1. Sitemap Inclusion Rules
  if (!sitemapRoutes.includes("/convert-image")) throw new Error("Indexable route missing from sitemap: /convert-image");
  if (!sitemapRoutes.includes("/jpg-to-png")) throw new Error("Indexable route missing from sitemap: /jpg-to-png");
  if (!sitemapRoutes.includes("/pdf-to-image")) throw new Error("Indexable route missing from sitemap: /pdf-to-image");
  if (!sitemapRoutes.includes("/image-to-pdf")) throw new Error("Indexable route missing from sitemap: /image-to-pdf");

  if (sitemapRoutes.includes("/word-to-pdf")) throw new Error("Unbuilt PLANNED route incorrectly included in sitemap: /word-to-pdf");
  if (sitemapRoutes.includes("/pdf-to-jpeg")) throw new Error("REDIRECT_ALIAS route incorrectly included in sitemap: /pdf-to-jpeg");
  if (sitemapRoutes.includes("/pdf-to-picture")) throw new Error("REDIRECT_ALIAS route incorrectly included in sitemap: /pdf-to-picture");
  console.log("✓ Sitemap inclusion rules verified.");

  // 2. Canonical Slug Rules for Redirect Aliases
  const aliases = Object.values(CONVERSION_CATALOG).filter((e) => e.indexabilityStatus === "REDIRECT_ALIAS");
  aliases.forEach((alias) => {
    if (!alias.canonicalSlug) throw new Error(`Alias missing canonicalSlug: ${alias.slug}`);
    const target = CONVERSION_CATALOG[alias.canonicalSlug];
    if (!target) throw new Error(`Alias target does not exist: ${alias.canonicalSlug}`);
    if (target.indexabilityStatus !== "INDEXABLE") throw new Error(`Alias target is not INDEXABLE: ${alias.canonicalSlug}`);
    if (target.implementationStatus !== "PRODUCTION_FROZEN") throw new Error(`Alias target is not PRODUCTION_FROZEN: ${alias.canonicalSlug}`);
  });
  console.log("✓ Redirect alias canonical target rules verified.");

  // 3. Catalog Stats Audit
  const stats = getCatalogStats();
  console.log(`✓ Total Catalog Entries: ${stats.totalEntries}`);
  console.log(`✓ Production Frozen Count: ${stats.productionFrozenCount}`);
  console.log(`✓ Indexable Routes: ${stats.indexableCount}`);
  console.log(`✓ Redirect Aliases: ${stats.redirectAliasCount}`);
  console.log(`✓ Planned Future Routes: ${stats.plannedCount}`);

  console.log("--------------------------------------------------");
  console.log("ALL CONVERSION CATALOG SEO TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runCatalogTests().catch((err) => {
  console.error("Catalog test failed:", err);
  process.exit(1);
});
