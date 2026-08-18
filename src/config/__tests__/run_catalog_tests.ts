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
  if (!catalogSitemapRoutes.includes("/word-to-pdf")) throw new Error("Indexable route missing from catalog sitemap: /word-to-pdf");
  if (!catalogSitemapRoutes.includes("/ocr-pdf")) throw new Error("Indexable route missing from catalog sitemap: /ocr-pdf");
  if (!catalogSitemapRoutes.includes("/pdf-to-word")) throw new Error("Indexable route missing from catalog sitemap: /pdf-to-word");
  if (!catalogSitemapRoutes.includes("/pdf-to-excel")) throw new Error("Indexable route missing from catalog sitemap: /pdf-to-excel");
  if (!catalogSitemapRoutes.includes("/pdf-to-powerpoint")) throw new Error("Indexable route missing from catalog sitemap: /pdf-to-powerpoint");
  if (!catalogSitemapRoutes.includes("/svg-to-png")) throw new Error("Indexable route missing from catalog sitemap: /svg-to-png");
  if (!catalogSitemapRoutes.includes("/crop-image")) throw new Error("Indexable route missing from catalog sitemap: /crop-image");
  if (!catalogSitemapRoutes.includes("/resize-image")) throw new Error("Indexable route missing from catalog sitemap: /resize-image");
  if (!catalogSitemapRoutes.includes("/avif-to-png")) throw new Error("Indexable route missing from catalog sitemap: /avif-to-png");
  if (!catalogSitemapRoutes.includes("/svg-to-jpg")) throw new Error("Indexable route missing from catalog sitemap: /svg-to-jpg");
  if (!catalogSitemapRoutes.includes("/ico-to-png")) throw new Error("Indexable route missing from catalog sitemap: /ico-to-png");
  if (!catalogSitemapRoutes.includes("/rotate-image")) throw new Error("Indexable route missing from catalog sitemap: /rotate-image");
  if (!catalogSitemapRoutes.includes("/flip-image")) throw new Error("Indexable route missing from catalog sitemap: /flip-image");
  if (!catalogSitemapRoutes.includes("/reverse-pdf")) throw new Error("Indexable route missing from catalog sitemap: /reverse-pdf");
  if (!catalogSitemapRoutes.includes("/add-blank-page-to-pdf")) throw new Error("Indexable route missing from catalog sitemap: /add-blank-page-to-pdf");
  if (!catalogSitemapRoutes.includes("/duplicate-pdf-pages")) throw new Error("Indexable route missing from catalog sitemap: /duplicate-pdf-pages");
  if (!catalogSitemapRoutes.includes("/pdf-to-text")) throw new Error("Indexable route missing from catalog sitemap: /pdf-to-text");
  if (!catalogSitemapRoutes.includes("/extract-images-from-pdf")) throw new Error("Indexable route missing from catalog sitemap: /extract-images-from-pdf");
  if (!catalogSitemapRoutes.includes("/flatten-pdf")) throw new Error("Indexable route missing from catalog sitemap: /flatten-pdf");
  if (!catalogSitemapRoutes.includes("/image-to-webp")) throw new Error("Indexable route missing from catalog sitemap: /image-to-webp");
  if (!catalogSitemapRoutes.includes("/jpg-to-ico")) throw new Error("Indexable route missing from catalog sitemap: /jpg-to-ico");
  if (!catalogSitemapRoutes.includes("/bmp-to-png")) throw new Error("Indexable route missing from catalog sitemap: /bmp-to-png");
  if (!catalogSitemapRoutes.includes("/bmp-to-jpg")) throw new Error("Indexable route missing from catalog sitemap: /bmp-to-jpg");
  if (!catalogSitemapRoutes.includes("/png-to-bmp")) throw new Error("Indexable route missing from catalog sitemap: /png-to-bmp");
  if (!catalogSitemapRoutes.includes("/jpg-to-bmp")) throw new Error("Indexable route missing from catalog sitemap: /jpg-to-bmp");
  if (!catalogSitemapRoutes.includes("/gif-to-png")) throw new Error("Indexable route missing from catalog sitemap: /gif-to-png");
  if (!catalogSitemapRoutes.includes("/gif-to-jpg")) throw new Error("Indexable route missing from catalog sitemap: /gif-to-jpg");
  if (!catalogSitemapRoutes.includes("/grayscale-image")) throw new Error("Indexable route missing from catalog sitemap: /grayscale-image");
  if (!catalogSitemapRoutes.includes("/invert-image")) throw new Error("Indexable route missing from catalog sitemap: /invert-image");
  if (!catalogSitemapRoutes.includes("/blur-image")) throw new Error("Indexable route missing from catalog sitemap: /blur-image");
  if (!catalogSitemapRoutes.includes("/tiff-to-pdf")) throw new Error("Indexable route missing from catalog sitemap: /tiff-to-pdf");
  if (!catalogSitemapRoutes.includes("/convert-audio")) throw new Error("Indexable route missing from catalog sitemap: /convert-audio");
  if (!catalogSitemapRoutes.includes("/compress-audio")) throw new Error("Indexable route missing from catalog sitemap: /compress-audio");
  if (!catalogSitemapRoutes.includes("/video-to-mp3")) throw new Error("Indexable route missing from catalog sitemap: /video-to-mp3");
  if (!catalogSitemapRoutes.includes("/trim-audio")) throw new Error("Indexable route missing from catalog sitemap: /trim-audio");
  if (!catalogSitemapRoutes.includes("/merge-audio")) throw new Error("Indexable route missing from catalog sitemap: /merge-audio");
  if (!catalogSitemapRoutes.includes("/compress-video")) throw new Error("Indexable route missing from catalog sitemap: /compress-video");
  if (!catalogSitemapRoutes.includes("/convert-video")) throw new Error("Indexable route missing from catalog sitemap: /convert-video");
  if (!catalogSitemapRoutes.includes("/video-to-gif")) throw new Error("Indexable route missing from catalog sitemap: /video-to-gif");
  if (!catalogSitemapRoutes.includes("/trim-video")) throw new Error("Indexable route missing from catalog sitemap: /trim-video");
  if (!catalogSitemapRoutes.includes("/mute-video")) throw new Error("Indexable route missing from catalog sitemap: /mute-video");

  if (catalogSitemapRoutes.includes("/docx-to-pdf")) throw new Error("Unbuilt/alias route incorrectly included in catalog sitemap: /docx-to-pdf");
  if (catalogSitemapRoutes.includes("/pdf-to-jpeg")) throw new Error("REDIRECT_ALIAS route incorrectly included in catalog sitemap: /pdf-to-jpeg");
  if (catalogSitemapRoutes.includes("/pdf-to-picture")) throw new Error("REDIRECT_ALIAS route incorrectly included in catalog sitemap: /pdf-to-picture");
  console.log("✓ Catalog sitemap inclusion & exclusion rules verified.");

  // 2. Site-wide Sitemap Composition Verification
  const fullSitemap = siteSitemap();
  const fullUrls = fullSitemap.map((s) => s.url);

  // Must contain core and compressor routes
  const requiredCore = ["/", "/sv", "/compress-pdf", "/compress-pdf-to-2mb", "/compress-image", "/compress-image-to-200kb"];
  requiredCore.forEach((path) => {
    const hasMatch = fullUrls.some((u) => u.endsWith(path));
    if (!hasMatch) throw new Error(`Site-wide sitemap missing core route: ${path}`);
  });

  // Must contain all indexable conversion routes
  catalogSitemapRoutes.forEach((path) => {
    const hasMatch = fullUrls.some((u) => u.endsWith(path));
    if (!hasMatch) throw new Error(`Site-wide sitemap missing conversion route: ${path}`);
  });

  // Must NOT contain any planned or alias routes
  if (fullUrls.some((u) => u.endsWith("/docx-to-pdf"))) throw new Error("Site-wide sitemap contains ALIAS route: /docx-to-pdf");
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
  console.log(`✓ Functional production-frozen tools: ${stats.canonicalFunctionalRoutes}`);
  console.log(`✓ Redirect aliases: ${stats.activeFunctionalAliases}`);
  console.log(`✓ Planned tools: ${stats.plannedCanonicalRoutes + stats.quarantinedPlannedAliases}`);
  console.log(`✓ Total catalog entries: ${stats.totalEntries}`);

  console.log("--------------------------------------------------");
  console.log("ALL CONVERSION CATALOG SEO TESTS PASSED SUCCESSFULLY!");
  console.log("--------------------------------------------------");
}

runCatalogTests().catch((err) => {
  console.error("Catalog test failed:", err);
  process.exit(1);
});
