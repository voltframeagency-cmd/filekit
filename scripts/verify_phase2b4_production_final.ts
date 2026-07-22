import { chromium } from "playwright";
import { getSiteUrl, buildCanonicalUrl } from "../src/utils/siteUrl";

const BASE_URL = "http://localhost:3000";

async function verifyOriginGuard() {
  console.log("======================================================================");
  console.log("PHASE 2B4 ORIGIN GUARD & DOMAIN CLEARANCE AUDIT");
  console.log("======================================================================\n");

  // Test 1: Unit Validation of Origin Hard Guard
  console.log("[Test 1] Strict Origin Guard Validation...");
  
  // Test fallback/missing rejection in production
  const originalEnv = process.env.NODE_ENV;
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_SITE_URL;
    try {
      getSiteUrl();
      console.error("  ❌ FAILED: Missing NEXT_PUBLIC_SITE_URL did not throw in production");
      process.exit(1);
    } catch (err: any) {
      console.log(`  ✓ Missing NEXT_PUBLIC_SITE_URL threw in production: "${err.message}"`);
    }

    process.env.NEXT_PUBLIC_SITE_URL = "https://filekit.app";
    try {
      getSiteUrl();
      console.error("  ❌ FAILED: Unowned filekit.app origin did not throw in production");
      process.exit(1);
    } catch (err: any) {
      console.log(`  ✓ Unowned filekit.app origin threw in production: "${err.message}"`);
    }

    process.env.NEXT_PUBLIC_SITE_URL = "https://my-owned-file-compressor.org";
    const validUrl = getSiteUrl();
    console.log(`  ✓ Valid custom origin approved: "${validUrl.origin}"`);
  } finally {
    process.env.NODE_ENV = originalEnv;
    if (originalSiteUrl) process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    else delete process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Test 2: Playwright Integration & JSON-LD Category Audit
  console.log("\n[Test 2] Playwright Integration & JSON-LD UtilitiesApplication Audit...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/compress-pdf`, { waitUntil: "networkidle" });
  const jsonLdContent = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? JSON.parse(el.textContent || "{}") : null;
  });

  console.log(`  ✓ /compress-pdf JSON-LD applicationCategory: "${jsonLdContent?.applicationCategory}"`);
  if (jsonLdContent?.applicationCategory !== "UtilitiesApplication") {
    console.error("  ❌ FAILED: applicationCategory is not UtilitiesApplication");
    process.exit(1);
  }

  await page.close();
  await browser.close();

  console.log("\n======================================================================");
  console.log("PHASE 2B4 ORIGIN GUARD AUDIT PASSED 100%!");
  console.log("======================================================================");
}

verifyOriginGuard();
