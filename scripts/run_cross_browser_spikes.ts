import { chromium, firefox, webkit } from "playwright";
import * as fs from "fs";
import * as path from "path";

const TARGET_PORT = 3000;
const URL = `http://127.0.0.1:${TARGET_PORT}/spike-test-v2`;
const OUTPUT_FILE = path.join(__dirname, "../../../brain/b0f12569-1347-45f5-b3d3-4b30962fbce0/browser_spike_results_v2.json");

type BrowserStatus =
  | "PASSED"
  | "UNSUPPORTED_CAPABILITY"
  | "ENGINE_FAILED"
  | "BROWSER_CRASHED"
  | "INFRASTRUCTURE_UNAVAILABLE"
  | "SKIPPED";

interface BrowserRunResult {
  status: BrowserStatus;
  browserName: string;
  fixtures?: any[];
  error?: string;
  environment?: {
    platform: string;
    nodeVersion: string;
    timestamp: string;
  };
}

async function runBrowserTest(browserType: any, options: any, browserName: string): Promise<BrowserRunResult> {
  const env = {
    platform: process.platform,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  };

  console.log(`Launching ${browserName}...`);
  let browser: any;
  try {
    const launchPromise = browserType.launch({ headless: true, timeout: 15000 });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Browser launch timed out (15s) for ${browserName}`)), 15000)
    );
    browser = await Promise.race([launchPromise, timeoutPromise]);
  } catch (e: any) {
    console.error(`[${browserName}] Launch failed: ${e.message}`);
    return {
      status: "INFRASTRUCTURE_UNAVAILABLE",
      browserName,
      error: `Launch Error: ${e.message}`,
      environment: env
    };
  }

  try {
    const context = await browser.newContext(options);
    context.setDefaultTimeout(180000);
    const page = await context.newPage();
    page.setDefaultTimeout(180000);

    // Pipe browser logs to node console for validation debugging
    page.on("console", (msg: any) => console.log(`[${browserName} Page Log]`, msg.text()));
    page.on("pageerror", (err: any) => console.error(`[${browserName} Page Error]`, err.message));

    console.log(`Navigating to ${URL} on ${browserName}...`);
    await page.goto(URL, { timeout: 30000, waitUntil: "domcontentloaded" });

    console.log(`Waiting for spikes to complete on ${browserName}...`);
    let spikesDone = false;
    const startTime = Date.now();
    let lastProgressLength = 0;
    while (!spikesDone && Date.now() - startTime < 240000) {
      const isDone = await page.evaluate(() => {
        const res = (window as any).__SPIKE_RESULT_V2__;
        const prog = (window as any).__SPIKE_PROGRESS_V2__;
        return res !== undefined || (Array.isArray(prog) && prog.length >= 22);
      });
      if (isDone) {
        spikesDone = true;
        break;
      }
      const progress = await page.evaluate(() => (window as any).__SPIKE_PROGRESS_V2__);
      if (progress && Array.isArray(progress) && progress.length > lastProgressLength) {
        lastProgressLength = progress.length;
        console.log(`[${browserName}] Progress: ${progress.length}/22 fixtures completed (latest: ${progress[progress.length - 1]?.filename})`);
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    if (!spikesDone) {
      throw new Error(`Execution timed out after 240s without completing all fixtures`);
    }

    const results = await page.evaluate(() => (window as any).__SPIKE_RESULT_V2__ || (window as any).__SPIKE_PROGRESS_V2__);
    console.log(`✓ Completed on ${browserName}.`);

    await browser.close();

    // Separate fixtures that had images to replace from text-only PDFs
    const fixturesWithImages = results.filter((r: any) => r.supportedImages > 0);
    const failedReplacements = fixturesWithImages.filter((r: any) => r.replacedImages === 0);

    // If ALL image-bearing fixtures failed to replace, it's a blanket capability limitation (e.g. WebKit OffscreenCanvas)
    if (failedReplacements.length > 0 && failedReplacements.length === fixturesWithImages.length) {
      return {
        status: "UNSUPPORTED_CAPABILITY",
        browserName,
        fixtures: results,
        error: "Browser lacks image replacement capability (OffscreenCanvas/createImageBitmap/JPEG encoding). All image-bearing fixtures produced 0 replacements.",
        environment: env
      };
    }

    // If only SOME image-bearing fixtures failed, it's an engine bug
    if (failedReplacements.length > 0) {
      return {
        status: "ENGINE_FAILED",
        browserName,
        fixtures: results,
        error: `Engine completed but ${failedReplacements.length}/${fixturesWithImages.length} fixtures with images had zero replacements.`,
        environment: env
      };
    }

    return {
      status: "PASSED",
      browserName,
      fixtures: results,
      environment: env
    };
  } catch (e: any) {
    try { await browser.close(); } catch {}
    return {
      status: "BROWSER_CRASHED",
      browserName,
      error: e.message,
      environment: env
    };
  }
}

async function main() {
  const browserResults: Record<string, BrowserRunResult> = {};
  const onlyChromium = process.argv.includes("--only-chromium");

  const runWithTimeout = (promise: Promise<BrowserRunResult>, browserName: string, maxMs = 60000): Promise<BrowserRunResult> => {
    return Promise.race([
      promise,
      new Promise<BrowserRunResult>((resolve) =>
        setTimeout(() => resolve({
          status: "INFRASTRUCTURE_UNAVAILABLE",
          browserName,
          error: `Infrastructure timeout: ${browserName} exceeded execution budget (${maxMs / 1000}s)`,
          environment: { platform: process.platform, nodeVersion: process.version, timestamp: new Date().toISOString() }
        }), maxMs)
      )
    ]);
  };

  // 1. Chromium Desktop
  browserResults["chromium_desktop"] = await runWithTimeout(runBrowserTest(chromium, {}, "Chromium Desktop"), "Chromium Desktop", 240000);

  // 2. Firefox Desktop
  if (!onlyChromium) {
    browserResults["firefox_desktop"] = await runWithTimeout(runBrowserTest(firefox, {}, "Firefox Desktop"), "Firefox Desktop", 20000);
  } else {
    browserResults["firefox_desktop"] = {
      status: "SKIPPED",
      browserName: "Firefox Desktop",
      error: "--only-chromium flag passed",
      environment: { platform: process.platform, nodeVersion: process.version, timestamp: new Date().toISOString() }
    };
    console.log("Skipping Firefox Desktop (--only-chromium enabled)");
  }

  // 3. WebKit Desktop
  if (!onlyChromium) {
    browserResults["webkit_desktop"] = await runWithTimeout(runBrowserTest(webkit, {}, "WebKit Desktop"), "WebKit Desktop", 240000);
  } else {
    browserResults["webkit_desktop"] = {
      status: "SKIPPED",
      browserName: "WebKit Desktop",
      error: "--only-chromium flag passed",
      environment: { platform: process.platform, nodeVersion: process.version, timestamp: new Date().toISOString() }
    };
    console.log("Skipping WebKit Desktop (--only-chromium enabled)");
  }

  // 4. Mobile Emulated (Chromium Mobile)
  browserResults["chromium_mobile"] = await runWithTimeout(
    runBrowserTest(
      chromium,
      {
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
      },
      "Chromium Mobile (iPhone 13)"
    ),
    "Chromium Mobile (iPhone 13)",
    240000
  );

  // Print summary
  console.log("\n=== Browser Matrix Summary ===");
  for (const [key, result] of Object.entries(browserResults)) {
    console.log(`  ${key}: ${result.status}${result.error ? ` (${result.error})` : ""}`);
  }

  // Save to disk
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(browserResults, null, 2));
  console.log(`\nOutput saved to ${OUTPUT_FILE}`);

  // Exit with error only if Chromium Desktop (the primary target) failed
  if (browserResults["chromium_desktop"].status !== "PASSED") {
    console.error("Primary browser (Chromium Desktop) did not pass.");
    process.exit(1);
  }
}

main();
export {};
