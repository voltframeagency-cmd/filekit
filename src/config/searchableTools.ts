import { CONVERSION_CATALOG } from "./conversionCatalog";

export interface SearchableToolItem {
  name: string;
  route: string;
  tag: string;
  desc: string;
}

/**
 * Returns the authoritative list of launch candidate tools for discovery and live search indexing.
 * Dynamically generated from the catalog, strictly excluding gated, planned, or alias routes.
 */
export function getSearchableTools(): SearchableToolItem[] {
  const launchCandidates = Object.values(CONVERSION_CATALOG).filter(
    (entry) =>
      entry.indexabilityStatus === "INDEXABLE" &&
      entry.sitemapEnabled === true &&
      entry.implementationStatus === "PRODUCTION_FROZEN"
  );

  // Core compressor preset routes
  const coreTools: SearchableToolItem[] = [
    { name: "Compress PDF", route: "/compress-pdf", tag: "PDF", desc: "Reduce PDF file size in browser" },
    { name: "Compress PDF to 2 MB", route: "/compress-pdf-to-2mb", tag: "PDF", desc: "Shrink PDF below 2 MB target size" },
    { name: "Compress PDF to Custom Size", route: "/compress-pdf-to-size", tag: "PDF", desc: "Compress PDF to exact target size" },
    { name: "Compress Image", route: "/compress-image", tag: "IMAGE", desc: "Reduce photo file sizes up to 80%" },
    { name: "Compress Image to 100 KB", route: "/compress-image-to-100kb", tag: "IMAGE", desc: "Compress image below 100 KB" },
    { name: "Compress Image to 200 KB", route: "/compress-image-to-200kb", tag: "IMAGE", desc: "Compress image below 200 KB" },
    { name: "Compress Image to 500 KB", route: "/compress-image-to-500kb", tag: "IMAGE", desc: "Compress image below 500 KB" },
    { name: "Compress Image to 1 MB", route: "/compress-image-to-1mb", tag: "IMAGE", desc: "Compress photo below 1 MB" },
    { name: "Compress Image to Custom Size", route: "/compress-image-to-size", tag: "IMAGE", desc: "Compress image to exact target KB or MB" },
  ];

  const catalogTools: SearchableToolItem[] = launchCandidates.map((tool) => {
    const rawParts = tool.slug.replace(/^\//, "").split("-");
    const name = rawParts
      .map((part) => {
        const lower = part.toLowerCase();
        if (lower === "to" || lower === "and" || lower === "from") return lower;
        if (lower.length <= 4) return lower.toUpperCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(" ");

    const tag = tool.family.split("-")[0].toUpperCase();
    const desc = tool.uniqueOutcomeDefinition || `Convert ${tool.inputFormat} to ${tool.outputFormat}`;

    return {
      name,
      route: tool.slug,
      tag,
      desc,
    };
  });

  const seenRoutes = new Set<string>();
  const results: SearchableToolItem[] = [];
  for (const item of [...coreTools, ...catalogTools]) {
    if (!seenRoutes.has(item.route)) {
      seenRoutes.add(item.route);
      results.push(item);
    }
  }
  return results;
}

export const ALL_SEARCHABLE_TOOLS: SearchableToolItem[] = getSearchableTools();
