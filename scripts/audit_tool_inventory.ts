import { CONVERSION_CATALOG } from "../src/config/conversionCatalog";

interface InventoryTier {
  slug: string;
  family: string;
  inputFormat: string;
  outputFormat: string;
  processingMode: string;
  engineId: string;
  status: string;
  indexability: string;
  navEnabled: boolean;
  sitemapEnabled: boolean;
}

const entries = Object.values(CONVERSION_CATALOG);

const launchCandidates: InventoryTier[] = [];
const gated: InventoryTier[] = [];
const aliases: InventoryTier[] = [];
const experimental: InventoryTier[] = [];

const GATED_SLUGS = new Set([
  "/ttf-to-woff2",
  "/woff2-to-ttf",
  "/mobi-to-pdf",
  "/azw3-to-pdf",
]);

for (const e of entries) {
  const item: InventoryTier = {
    slug: e.slug,
    family: e.family,
    inputFormat: e.inputFormat,
    outputFormat: e.outputFormat,
    processingMode: e.processingMode,
    engineId: e.engineId,
    status: e.implementationStatus,
    indexability: e.indexabilityStatus,
    navEnabled: e.navigationEnabled,
    sitemapEnabled: e.sitemapEnabled,
  };

  if (e.indexabilityStatus === "REDIRECT_ALIAS") {
    aliases.push(item);
  } else if (e.implementationStatus === "PLANNED" || e.indexabilityStatus === "NOT_PUBLIC") {
    experimental.push(item);
  } else if (GATED_SLUGS.has(e.slug)) {
    gated.push(item);
  } else {
    launchCandidates.push(item);
  }
}

console.log("==================================================");
console.log("AUTHORITATIVE FILEKIT TOOL INVENTORY AUDIT");
console.log("==================================================");
console.log(`Total Catalog Entries: ${entries.length}`);
console.log(`- Launch Candidate Tools: ${launchCandidates.length} (pending linked output verification)`);
console.log(`- Gated Tools:            ${gated.length}`);
console.log(`- Redirect Aliases:       ${aliases.length}`);
console.log(`- Experimental/Planned:   ${experimental.length}`);
console.log(`Sum: ${launchCandidates.length + gated.length + aliases.length + experimental.length}`);
console.log("==================================================");

console.log("\n[GATED TOOLS]");
gated.forEach((g) => console.log(`  ${g.slug.padEnd(20)} [${g.family}] Mode: ${g.processingMode} Status: ${g.status} Index: ${g.indexability}`));

console.log("\n[EXPERIMENTAL / PLANNED TOOLS]");
experimental.forEach((ex) => console.log(`  ${ex.slug.padEnd(20)} [${ex.family}] Mode: ${ex.processingMode} Status: ${ex.status} Index: ${ex.indexability}`));

console.log("\n[REDIRECT ALIASES]");
aliases.forEach((a) => console.log(`  ${a.slug.padEnd(20)} -> canonical in catalog`));

console.log("\n[LAUNCH CANDIDATES BREAKDOWN BY FAMILY]");
const families: Record<string, number> = {};
launchCandidates.forEach((t) => {
  families[t.family] = (families[t.family] || 0) + 1;
});
for (const [f, count] of Object.entries(families)) {
  console.log(`  ${f.padEnd(22)}: ${count} tools`);
}
