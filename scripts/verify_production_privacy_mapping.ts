import { CONVERSION_CATALOG } from "../src/config/conversionCatalog";

interface ToolPrivacyAudit {
  slug: string;
  family: string;
  processingMode: "local" | "server" | "hybrid";
  engineId: string;
  hasServerUpload: boolean;
  disclosureTag: string;
}

export function auditProductionPrivacyMapping(): {
  totalTools: number;
  localToolsCount: number;
  serverToolsCount: number;
  tools: ToolPrivacyAudit[];
} {
  const indexableEntries = Object.values(CONVERSION_CATALOG).filter(
    (e) => e.indexabilityStatus === "INDEXABLE" && e.implementationStatus === "PRODUCTION_FROZEN"
  );

  const tools: ToolPrivacyAudit[] = indexableEntries.map((e) => {
    const isServer = e.processingMode === "server";
    return {
      slug: e.slug,
      family: e.family,
      processingMode: e.processingMode,
      engineId: e.engineId,
      hasServerUpload: isServer,
      disclosureTag: isServer ? "EPHEMERAL_SERVER_SANDBOX" : "BROWSER_LOCAL_ONLY"
    };
  });

  const localToolsCount = tools.filter((t) => t.processingMode === "local").length;
  const serverToolsCount = tools.filter((t) => t.processingMode === "server").length;

  return {
    totalTools: tools.length,
    localToolsCount,
    serverToolsCount,
    tools
  };
}

if (require.main === module) {
  const audit = auditProductionPrivacyMapping();
  console.log("==================================================");
  console.log("PRODUCTION PROCESSING & PRIVACY MAPPING AUDIT");
  console.log("==================================================");
  console.log(`Total Launch-Ready Tools: ${audit.totalTools}`);
  console.log(`Local Processing Tools:   ${audit.localToolsCount}`);
  console.log(`Server Processing Tools:  ${audit.serverToolsCount}`);
  console.log("--------------------------------------------------");

  const hybridToolsCount = audit.tools.filter((t) => t.processingMode === "hybrid").length;
  console.log(`Hybrid Processing Tools:  ${hybridToolsCount}`);
  if (hybridToolsCount > 0) {
    console.log("Hybrid Tools:", audit.tools.filter(t => t.processingMode === "hybrid").map(t => `${t.slug} (${t.family})`));
  }
  console.log("--------------------------------------------------");

  console.log("\nSERVER-PROCESSED TOOLS (18 routes):");
  audit.tools.filter(t => t.processingMode === "server").forEach(t => {
    console.log(`  - ${t.slug} [${t.family}] -> Engine: ${t.engineId}`);
  });
}
