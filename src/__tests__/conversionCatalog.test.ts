import { CONVERSION_CATALOG, getSitemapRoutes, getCatalogStats } from "@/config/conversionCatalog";

describe("Programmatic SEO Conversion Catalog Tests", () => {
  it("should enforce that ONLY production-frozen & indexable routes appear in sitemap", () => {
    const sitemapRoutes = getSitemapRoutes();
    
    // Check indexable routes are in sitemap
    expect(sitemapRoutes).toContain("/convert-image");
    expect(sitemapRoutes).toContain("/jpg-to-png");
    expect(sitemapRoutes).toContain("/pdf-to-image");
    expect(sitemapRoutes).toContain("/image-to-pdf");

    // Check planned and alias routes are NOT in sitemap
    expect(sitemapRoutes).not.toContain("/word-to-pdf");
    expect(sitemapRoutes).not.toContain("/heic-to-jpg");
    expect(sitemapRoutes).not.toContain("/pdf-to-jpeg");
    expect(sitemapRoutes).not.toContain("/pdf-to-picture");
  });

  it("should enforce that all REDIRECT_ALIAS entries have valid canonicalSlug pointing to INDEXABLE routes", () => {
    const aliases = Object.values(CONVERSION_CATALOG).filter(
      (e) => e.indexabilityStatus === "REDIRECT_ALIAS"
    );

    aliases.forEach((alias) => {
      expect(alias.canonicalSlug).toBeDefined();
      const target = CONVERSION_CATALOG[alias.canonicalSlug!];
      expect(target).toBeDefined();
      expect(target.indexabilityStatus).toBe("INDEXABLE");
      expect(target.implementationStatus).toBe("PRODUCTION_FROZEN");
    });
  });

  it("should report correct catalog statistics", () => {
    const stats = getCatalogStats();
    expect(stats.totalEntries).toBeGreaterThanOrEqual(20);
    expect(stats.productionFrozenCount).toBe(15);
    expect(stats.indexableCount).toBe(13);
    expect(stats.redirectAliasCount).toBe(2);
    expect(stats.plannedCount).toBeGreaterThanOrEqual(9);
  });
});
