import { CONVERSION_CATALOG, getSitemapRoutes } from "../src/config/conversionCatalog";
import siteSitemap from "../src/app/sitemap";

function discoverMatrix() {
  const sitemapUrls = siteSitemap().map(s => s.url);
  const catalogFrozen = Object.entries(CONVERSION_CATALOG)
    .filter(([_, e]) => e.implementationStatus === "PRODUCTION_FROZEN" && e.indexabilityStatus === "INDEXABLE")
    .map(([slug, _]) => slug);

  const coreRoutes = [
    "/",
    "/compress-pdf",
    "/compress-pdf-to-size",
    "/compress-pdf-to-2mb",
    "/compress-image",
    "/compress-image-to-size",
    "/compress-image-to-100kb",
    "/compress-image-to-200kb",
    "/compress-image-to-500kb",
    "/compress-image-to-1mb"
  ];

  console.log("==================================================================");
  console.log("            FILEKIT DISCOVERY & CAPABILITY MATRIX                 ");
  console.log("==================================================================");
  console.log(`CURRENT_FUNCTIONAL_TOOLS: ${coreRoutes.length + catalogFrozen.length}`);
  console.log(`- Core/Compressors (10):  ${coreRoutes.join(", ")}`);
  console.log(`- Catalog Live (${catalogFrozen.length}):       ${catalogFrozen.sort().join(", ")}`);
  console.log("==================================================================");

  // Group by capability family
  const byFamily: Record<string, string[]> = {};
  for (const slug of catalogFrozen) {
    const entry = CONVERSION_CATALOG[slug as keyof typeof CONVERSION_CATALOG];
    const fam = entry.family;
    if (!byFamily[fam]) byFamily[fam] = [];
    byFamily[fam].push(slug);
  }

  console.log("\n--- Current Capabilities by Family ---");
  for (const [fam, routes] of Object.entries(byFamily)) {
    console.log(`[${fam}] (${routes.length} tools): ${routes.join(", ")}`);
  }
}

discoverMatrix();
