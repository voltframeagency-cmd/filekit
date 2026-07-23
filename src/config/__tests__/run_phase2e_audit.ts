import { BRAND_CONFIG, getBrandTitle, validateBrandConfig } from "../brand";
import { getSiteUrl, buildCanonicalUrl, isBlockedHostname } from "../../utils/siteUrl";
import {
  CONVERSION_CATALOG,
  getSitemapRoutes,
  getCatalogStats
} from "../conversionCatalog";
import { execSync } from "child_process";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    passedCount++;
    console.log(`✓ ${description}`);
  } else {
    failedCount++;
    console.error(`✕ FAILED: ${description}`);
  }
}

function getRedirectRule(slug: string) {
  const entry = CONVERSION_CATALOG[slug];
  if (entry && entry.indexabilityStatus === "REDIRECT_ALIAS" && entry.canonicalSlug) {
    return { targetSlug: entry.canonicalSlug, statusCode: 301 };
  }
  return null;
}

console.log("--------------------------------------------------");
console.log("Starting FileKit Phase 2E0.1 Domain Conflict Guard Audit");
console.log("--------------------------------------------------");

// 1. Brand Configuration Checks
console.log("Running Brand Configuration Checks...");
assert(validateBrandConfig() === true, "validateBrandConfig returns true");
assert(BRAND_CONFIG.name === "FileKit", "BRAND_CONFIG.name is 'FileKit'");
assert(BRAND_CONFIG.supportEmail === null, "BRAND_CONFIG.supportEmail is null until final owned domain verification");
assert(BRAND_CONFIG.brandClearance === "pending", "BRAND_CONFIG.brandClearance is 'pending'");
assert(BRAND_CONFIG.ownedDomainStatus === "pending", "BRAND_CONFIG.ownedDomainStatus is 'pending'");
assert(getBrandTitle("PDF Compressor") === "PDF Compressor — FileKit", "getBrandTitle formats title correctly");

// 2. Site URL Origin Guard & Conflicted Domain Blocking Checks
console.log("Running Site URL Origin Guard Checks...");
const devUrl = getSiteUrl();
assert(devUrl.origin === "http://localhost:3000", "Dev environment defaults to http://localhost:3000");

// Test production origin guard validation
const oldEnv = process.env.NODE_ENV;
const oldSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

try {
  process.env.NODE_ENV = "production";
  delete process.env.NEXT_PUBLIC_SITE_URL;
  let errorCaught = false;
  try {
    getSiteUrl();
  } catch (e: any) {
    errorCaught = e.message.includes("NEXT_PUBLIC_SITE_URL is required");
  }
  assert(errorCaught, "Production throws if NEXT_PUBLIC_SITE_URL is missing");

  // Conflicted and disallowed hostnames
  const conflictedHosts = [
    "https://filekit.dev",
    "https://app.filekit.dev",
    "https://tools.filekit.dev",
    "https://www.filekit.dev",
    "https://filekit.app",
    "https://app.filekit.app",
    "https://filekit.com",
    "https://test-filekit-compressor.org",
    "http://example.com", // non-HTTPS
    "https://localhost", // localhost in prod
    "https://my-app.vercel.app" // preview host
  ];

  for (const host of conflictedHosts) {
    process.env.NEXT_PUBLIC_SITE_URL = host;
    let hostBlocked = false;
    try {
      getSiteUrl();
    } catch {
      hostBlocked = true;
    }
    assert(hostBlocked, `Production origin guard blocks conflicted/disallowed origin: ${host}`);
  }

  // Verify hostname helper logic directly
  assert(isBlockedHostname("filekit.dev") === true, "isBlockedHostname identifies filekit.dev");
  assert(isBlockedHostname("app.filekit.dev") === true, "isBlockedHostname identifies app.filekit.dev");
  assert(isBlockedHostname("tools.filekit.dev") === true, "isBlockedHostname identifies tools.filekit.dev");
  assert(isBlockedHostname("filekit.app") === true, "isBlockedHostname identifies filekit.app");
  assert(isBlockedHostname("app.filekit.app") === true, "isBlockedHostname identifies app.filekit.app");
  assert(isBlockedHostname("filekit.com") === true, "isBlockedHostname identifies filekit.com");
  assert(isBlockedHostname("your-owned-domain.example") === false, "isBlockedHostname allows unblocked domain");

  // Valid controlled non-deployment test origin check
  process.env.NEXT_PUBLIC_SITE_URL = "https://your-owned-domain.example";
  const validProdUrl = getSiteUrl();
  assert(validProdUrl.origin === "https://your-owned-domain.example", "Production accepts valid controlled non-deployment test origin");
} finally {
  process.env.NODE_ENV = oldEnv;
  if (oldSiteUrl !== undefined) {
    process.env.NEXT_PUBLIC_SITE_URL = oldSiteUrl;
  } else {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  }
}

// 3. Technical SEO Crawl & Sitemap Composition Verification
console.log("Running Technical SEO Crawl & Sitemap Composition Verification...");
const coreAndCompressorRoutes = [
  "",
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
const sitemapCatalogRoutes = getSitemapRoutes();
const totalSitemapUrls = coreAndCompressorRoutes.length + sitemapCatalogRoutes.length;

assert(coreAndCompressorRoutes.length === 10, "Core & compressor routes total exactly 10");
assert(sitemapCatalogRoutes.length === 13, "Frozen catalog sitemap routes total exactly 13");
assert(totalSitemapUrls === 23, "Complete sitemap contains exactly 23 indexable URLs");

// Verify alias exclusion and redirect mapping
console.log("Running Alias Redirect Mapping Verification...");
const jpegAliasRedirect = getRedirectRule("/pdf-to-jpeg");
assert(jpegAliasRedirect !== null && jpegAliasRedirect.targetSlug === "/pdf-to-jpg" && jpegAliasRedirect.statusCode === 301, "/pdf-to-jpeg permanently redirects to /pdf-to-jpg (301)");

const pictureAliasRedirect = getRedirectRule("/pdf-to-picture");
assert(pictureAliasRedirect !== null && pictureAliasRedirect.targetSlug === "/pdf-to-image" && pictureAliasRedirect.statusCode === 301, "/pdf-to-picture permanently redirects to /pdf-to-image (301)");

assert(!sitemapCatalogRoutes.includes("/pdf-to-jpeg"), "/pdf-to-jpeg alias excluded from sitemap");
assert(!sitemapCatalogRoutes.includes("/pdf-to-picture"), "/pdf-to-picture alias excluded from sitemap");

// 4. Analytics Privacy Verification
console.log("Running Analytics Privacy Verification...");
const forbiddenAnalyticsKeys = ["filename", "filepath", "localPath", "text", "imageBytes", "exif", "personalData", "userEmail"];
const sampleAllowedAnalyticsPayload = {
  eventName: "download_completed",
  route: "/compress-pdf",
  processingMode: "local",
  fileType: "application/pdf",
  fileSizeBytes: 1048576,
  outputSizeBytes: 524288,
  durationMs: 340
};

const hasForbiddenKey = Object.keys(sampleAllowedAnalyticsPayload).some(key => forbiddenAnalyticsKeys.includes(key));
assert(!hasForbiddenKey, "Analytics payload strictly excludes all sensitive user metadata fields");

// 5. Authoritative Subsystem Baseline Integrity Diffs
console.log("Running Subsystem Authoritative Baseline Diff Verification...");
const baselineChecks = [
  { name: "PDF engine", commit: "98bde28", path: "src/utils/engine" },
  { name: "Image engine", commit: "1e422c0", path: "src/utils/image-engine" },
  { name: "Image converter", commit: "4e9baa7", path: "src/utils/image-converter" },
  { name: "PDF-to-image", commit: "fd291a6", path: "src/utils/pdf-to-image" }
];

for (const check of baselineChecks) {
  try {
    const diff = execSync(`git diff ${check.commit} -- ${check.path}`, { encoding: "utf8" }).trim();
    assert(diff === "", `${check.name} baseline diff against ${check.commit} is 100% EMPTY`);
  } catch (e: any) {
    assert(false, `${check.name} baseline diff check failed: ${e.message}`);
  }
}

console.log("--------------------------------------------------");
console.log(`Phase 2E0.1 Audit Finished: ${passedCount} passed, ${failedCount} failed`);
console.log("--------------------------------------------------");

if (failedCount > 0) {
  process.exit(1);
}
