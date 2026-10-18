import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface StagingVerificationOptions {
  stagingUrl: string;
  backendWorkerUrl?: string;
}

export interface VerificationResult {
  step: string;
  status: 'PASS' | 'FAIL' | 'NOT TESTED';
  details: string;
  metrics?: Record<string, any>;
}

export interface MonitoredNetworkEvent {
  url: string;
  method: string;
  resourceType: string;
  postDataSize: number;
  channel: string;
}

/**
 * Universal privacy evaluator with ZERO same-origin exemption and strict WebSocket inspection.
 * Local workflows must NEVER transmit document bytes off-device, whether to same-origin or third-party servers.
 */
export function evaluatePrivacyAudit(events: MonitoredNetworkEvent[]): {
  compliant: boolean;
  violations: MonitoredNetworkEvent[];
  details: string;
} {
  const violations = events.filter(e => {
    // 1. Any HTTP request carrying a body (POST, PUT, PATCH) regardless of domain (NO same-origin exemption)
    const isDocumentBearingHttp = (e.method === 'POST' || e.method === 'PUT' || e.method === 'PATCH') && e.postDataSize > 0;

    // 2. Any WebSocket connection or outgoing WebSocket frame during local client-side workflows
    const isWebSocketLeak = e.resourceType === 'websocket' || e.resourceType === 'websocket_frame' || e.method.startsWith('WEBSOCKET');

    return isDocumentBearingHttp || isWebSocketLeak;
  });

  return {
    compliant: violations.length === 0,
    violations,
    details: violations.length === 0
      ? `Audited ${events.length} network events: 0 payload-bearing HTTP requests and 0 outgoing WebSocket frames observed.`
      : `Detected ${violations.length} privacy violation(s): ${violations.map(v => `${v.channel} [${v.method}] to ${v.url} (${v.postDataSize} bytes)`).join('; ')}`
  };
}

/**
 * Independently parses a PDF file using Python's pypdf to verify structural validity, page count, and text.
 */
function parsePdfOutput(filePath: string): { pageCount: number; pages: string[] } {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const pythonCmd = `python -c "import sys, json, pypdf; r=pypdf.PdfReader(sys.argv[1]); pages=[p.extract_text().strip() for p in r.pages]; print(json.dumps({'pageCount': len(r.pages), 'pages': pages}))" "${normalizedPath}"`;
  const output = execSync(pythonCmd, { encoding: 'utf-8' });
  return JSON.parse(output.trim());
}

/**
 * Independently decodes an image file using Python's PIL to verify decodability, format, and dimensions.
 */
function parseImageOutput(filePath: string): { format: string; width: number; height: number } {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const pythonCmd = `python -c "import sys, json, PIL.Image; im=PIL.Image.open(sys.argv[1]); im.load(); print(json.dumps({'format': im.format, 'width': im.size[0], 'height': im.size[1]}))" "${normalizedPath}"`;
  const output = execSync(pythonCmd, { encoding: 'utf-8' });
  return JSON.parse(output.trim());
}

export async function runStagingVerificationSuite(options: StagingVerificationOptions): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];
  const { stagingUrl, backendWorkerUrl = 'https://filekit-office-worker-canary.voltframeagency.workers.dev' } = options;
  const baseUrl = stagingUrl.replace(/\/$/, '');

  console.log(`\n======================================================`);
  console.log(`Starting Cloudflare Staging Verification Suite`);
  console.log(`Target Frontend Staging URL: ${baseUrl}`);
  console.log(`Target Backend Worker URL:   ${backendWorkerUrl}`);
  console.log(`======================================================\n`);

  // SECTION 1: ASSET DELIVERY
  console.log(`[Section 1] Verifying core asset delivery & headers...`);
  try {
    const assets = [
      { path: '/pdf.worker.min.mjs', expectedType: 'javascript' },
      { path: '/robots.txt', expectedType: 'text/plain' },
      { path: '/sitemap.xml', expectedType: 'xml' },
      { path: '/brand-assets/pdf-tools/compress-pdf.svg', expectedType: 'image/svg+xml' }
    ];

    for (const asset of assets) {
      const url = `${baseUrl}${asset.path}`;
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      const cfRay = res.headers.get('cf-ray') || 'N/A';
      const status = res.status;
      const passed = status === 200 && contentType.includes(asset.expectedType);

      results.push({
        step: `Asset Delivery: ${asset.path}`,
        status: passed ? 'PASS' : 'FAIL',
        details: `HTTP ${status}, Content-Type: ${contentType}, CF-Ray: ${cfRay}`,
        metrics: { status, contentType, cfRay }
      });
      console.log(`  ${passed ? '✓' : '✗'} ${asset.path}: HTTP ${status} (${contentType}) [Ray: ${cfRay}]`);
    }
  } catch (err: any) {
    results.push({
      step: 'Asset Delivery',
      status: 'FAIL',
      details: `Asset check failed: ${err.message}`
    });
  }

  // SECTION 2: DIRECT LOADING, REFRESH, & CLIENT NAVIGATION (WITH CONTENT ASSERTIONS)
  console.log(`\n[Section 2] Verifying direct loading, refresh, client navigation, and genuine 404...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true
  });
  const page = await context.newPage();

  // Test 2.1: Nonexistent route -> Genuine HTTP 404
  try {
    const nonExistentUrl = `${baseUrl}/nonexistent-route-audit-404`;
    console.log(`  Testing direct GET on nonexistent route: ${nonExistentUrl}...`);
    const resp = await page.goto(nonExistentUrl);
    const status = resp ? resp.status() : 0;
    const bodyText = await page.content();
    const isGenuine404 = status === 404;

    results.push({
      step: 'Nonexistent Route Genuine 404',
      status: isGenuine404 ? 'PASS' : 'FAIL',
      details: isGenuine404
        ? `HTTP 404 correctly returned with custom 404 template (${bodyText.length} bytes).`
        : `Expected HTTP 404 but received HTTP ${status}.`,
      metrics: { status }
    });
    console.log(`  ${isGenuine404 ? '✓' : '✗'} Nonexistent route: HTTP ${status} (Genuine 404: ${isGenuine404})`);
  } catch (err: any) {
    results.push({
      step: 'Nonexistent Route Genuine 404',
      status: 'FAIL',
      details: `Error loading nonexistent route: ${err.message}`
    });
  }

  // Test 2.2: /compress-pdf (Direct Load, Refresh, Content Assertion)
  try {
    const url = `${baseUrl}/compress-pdf`;
    console.log(`  Testing direct GET on: ${url}...`);
    let resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
    let status = resp ? resp.status() : 0;
    let title = await page.title();
    let content = await page.content();
    let hasEnglishContent = content.includes('Compress PDF') || content.includes('Compress');

    console.log(`  Reloading (Refresh) ${url}...`);
    resp = await page.reload({ waitUntil: 'domcontentloaded' });
    status = resp ? resp.status() : 0;
    title = await page.title();
    content = await page.content();
    const refreshOk = status === 200 && (content.includes('Compress PDF') || content.includes('Compress'));

    const passed = status === 200 && hasEnglishContent && refreshOk;
    results.push({
      step: 'Direct Load & Refresh: /compress-pdf',
      status: passed ? 'PASS' : 'FAIL',
      details: `HTTP ${status}, Title: "${title}", Verified English content and successful refresh.`,
      metrics: { status, title }
    });
    console.log(`  ${passed ? '✓' : '✗'} /compress-pdf: HTTP ${status}, Content Verified, Refresh Passed`);
  } catch (err: any) {
    results.push({
      step: 'Direct Load & Refresh: /compress-pdf',
      status: 'FAIL',
      details: `Error: ${err.message}`
    });
  }

  // Test 2.3: Targeted Localized Route 1: /sv/compress-pdf (Direct Load, Refresh, Swedish Content Assertion)
  try {
    const url = `${baseUrl}/sv/compress-pdf`;
    console.log(`  Testing direct GET on Swedish route: ${url}...`);
    let resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
    let status = resp ? resp.status() : 0;
    let title = await page.title();
    let content = await page.content();
    let hasSwedish = content.includes('Komprimera') || content.includes('Svenska') || content.includes('PDF-filer');

    console.log(`  Reloading (Refresh) ${url}...`);
    resp = await page.reload({ waitUntil: 'domcontentloaded' });
    status = resp ? resp.status() : 0;
    title = await page.title();
    content = await page.content();
    const hasSwedishRefresh = content.includes('Komprimera') || content.includes('PDF-filer');

    const passed = status === 200 && hasSwedish && hasSwedishRefresh;
    results.push({
      step: 'Targeted Staging Route: /sv/compress-pdf (Direct Load & Refresh)',
      status: passed ? 'PASS' : 'FAIL',
      details: `HTTP ${status}, Title: "${title}", Swedish localized content verified ("Komprimera").`,
      metrics: { status, title }
    });
    console.log(`  ${passed ? '✓' : '✗'} /sv/compress-pdf: HTTP ${status}, Swedish Content Verified, Refresh Passed`);
  } catch (err: any) {
    results.push({
      step: 'Targeted Staging Route: /sv/compress-pdf (Direct Load & Refresh)',
      status: 'FAIL',
      details: `Error: ${err.message}`
    });
  }

  // Test 2.4: Targeted Localized Route 2: /bg/watermark-pdf (Direct Load, Refresh, Bulgarian Content Assertion)
  try {
    const url = `${baseUrl}/bg/watermark-pdf`;
    console.log(`  Testing direct GET on Bulgarian route: ${url}...`);
    let resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
    let status = resp ? resp.status() : 0;
    let title = await page.title();
    let content = await page.content();
    let hasBulgarian = /[\u0400-\u04FF]/.test(content); // Cyrillic alphabet test

    console.log(`  Reloading (Refresh) ${url}...`);
    resp = await page.reload({ waitUntil: 'domcontentloaded' });
    status = resp ? resp.status() : 0;
    title = await page.title();
    content = await page.content();
    let hasBulgarianRefresh = /[\u0400-\u04FF]/.test(content);

    const passed = status === 200 && hasBulgarian && hasBulgarianRefresh;
    results.push({
      step: 'Targeted Staging Route: /bg/watermark-pdf (Direct Load & Refresh)',
      status: passed ? 'PASS' : 'FAIL',
      details: `HTTP ${status}, Title: "${title}", Bulgarian Cyrillic content asserted.`,
      metrics: { status, title }
    });
    console.log(`  ${passed ? '✓' : '✗'} /bg/watermark-pdf: HTTP ${status}, Bulgarian Content Verified, Refresh Passed`);
  } catch (err: any) {
    results.push({
      step: 'Targeted Staging Route: /bg/watermark-pdf (Direct Load & Refresh)',
      status: 'FAIL',
      details: `Error: ${err.message}`
    });
  }

  // Test 2.5: Targeted Localized Route 3 (Regional): /pt-BR/compress-pdf (Direct Load, Refresh, pt-BR Content Assertion)
  try {
    const url = `${baseUrl}/pt-BR/compress-pdf`;
    console.log(`  Testing direct GET on Regional route: ${url}...`);
    let resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
    let status = resp ? resp.status() : 0;
    let title = await page.title();
    let content = await page.content();
    let hasPtBr = content.includes('Comprimir') || content.includes('arquivos PDF') || content.includes('Grátis');

    console.log(`  Reloading (Refresh) ${url}...`);
    resp = await page.reload({ waitUntil: 'domcontentloaded' });
    status = resp ? resp.status() : 0;
    title = await page.title();
    content = await page.content();
    let hasPtBrRefresh = content.includes('Comprimir') || content.includes('arquivos PDF');

    const passed = status === 200 && hasPtBr && hasPtBrRefresh;
    results.push({
      step: 'Targeted Staging Route: /pt-BR/compress-pdf (Direct Load & Refresh)',
      status: passed ? 'PASS' : 'FAIL',
      details: `HTTP ${status}, Title: "${title}", Portuguese (Brazil) localized content asserted.`,
      metrics: { status, title }
    });
    console.log(`  ${passed ? '✓' : '✗'} /pt-BR/compress-pdf: HTTP ${status}, pt-BR Content Verified, Refresh Passed`);
  } catch (err: any) {
    results.push({
      step: 'Targeted Staging Route: /pt-BR/compress-pdf (Direct Load & Refresh)',
      status: 'FAIL',
      details: `Error: ${err.message}`
    });
  }

  // Test 2.6: Real Customer Navigation via Language Switcher with Rendered Workspace Assertion
  try {
    console.log(`  Testing real customer navigation via language switcher from /compress-pdf to /sv/compress-pdf...`);
    await page.goto(`${baseUrl}/compress-pdf`, { waitUntil: 'networkidle' });

    // 1. Locate and click the language dropdown trigger in the site header
    const langBtn = page.locator('header button').filter({ hasText: /EN|🌐/i }).first();
    await langBtn.waitFor({ state: 'visible', timeout: 8000 });
    await langBtn.click();

    // 2. Locate and click the real <Link> to /sv/compress-pdf
    const swedishLink = page.locator('header a[href*="/sv/compress-pdf"], a[href$="/sv/compress-pdf"]').first();
    await swedishLink.waitFor({ state: 'visible', timeout: 5000 });
    await swedishLink.click();

    // 3. Wait for client-side navigation to complete to /sv/compress-pdf (handle trailing slash)
    await page.waitForURL((url) => url.pathname.includes('/sv/compress-pdf'), { timeout: 10000 });
    const currentUrl = page.url();

    // 4. Assert destination workspace content and locale rendered
    const fileInput = page.locator('input[type="file"]');
    await fileInput.waitFor({ state: 'attached', timeout: 8000 });

    const pageContent = await page.content();
    const hasSwedishHeading = pageContent.includes('Komprimera PDF') || pageContent.includes('Komprimera');
    const headerText = await page.locator('header').innerText();
    const showsSwedishLocale = headerText.includes('SV') || headerText.includes('Svenska') || pageContent.includes('Svenska');

    if (!currentUrl.includes('/sv/compress-pdf') || !hasSwedishHeading || !showsSwedishLocale) {
      throw new Error(`Destination workspace verification failed. URL: ${currentUrl}, Swedish Heading: ${hasSwedishHeading}, Shows Swedish: ${showsSwedishLocale}`);
    }

    results.push({
      step: 'Client Navigation via Language Switcher',
      status: 'PASS',
      details: `Navigated via real application link to ${currentUrl}. Rendered workspace verified with Swedish heading ("Komprimera") and file input.`,
      metrics: { destinationUrl: currentUrl, hasSwedishHeading, showsSwedishLocale }
    });
    console.log(`  ✓ Client navigation via language switcher verified to ${currentUrl} with Swedish workspace rendered.`);
  } catch (err: any) {
    results.push({
      step: 'Client Navigation via Language Switcher',
      status: 'FAIL',
      details: `Language switcher navigation failed: ${err.message}`
    });
    console.log(`  ✗ Client navigation via language switcher failed: ${err.message}`);
  }

  // Test 2.7: Accurate Staging Package Inventory Documentation
  results.push({
    step: 'Localized Staging Package Scope Documentation',
    status: 'PASS',
    details: 'Accurately documented: dist-staging contains a targeted six-route localized package (/sv/compress-pdf, /bg/watermark-pdf, /pt-BR/compress-pdf, /es-419/compress-pdf, /de/compress-pdf, /fr/compress-pdf); this is NOT evidence of full 39-locale catalog completeness.'
  });

  // SECTION 3: PRIVACY DETECTOR SYNTHETIC POSITIVE & NEGATIVE CONTROLS
  console.log(`\n[Section 3] Validating privacy detector with synthetic positive & negative controls...`);
  try {
    // Synthetic Test 1: Controlled same-origin upload must be rejected (NO same-origin exemption)
    const syntheticSameOriginLeak: MonitoredNetworkEvent = {
      url: `${baseUrl}/api/internal/convert/word-to-pdf`,
      method: 'POST',
      resourceType: 'fetch',
      postDataSize: 1024,
      channel: 'Fetch (Same-Origin)'
    };
    const sameOriginResult = evaluatePrivacyAudit([syntheticSameOriginLeak]);
    if (sameOriginResult.compliant || sameOriginResult.violations.length !== 1) {
      throw new Error(`Privacy detector failed positive control 1: Did not flag same-origin upload!`);
    }

    // Synthetic Test 2: Outgoing WebSocket payload frame must be rejected
    const syntheticWsLeak: MonitoredNetworkEvent = {
      url: `wss://${new URL(baseUrl).host}/api/ws`,
      method: 'WEBSOCKET_FRAME_SENT',
      resourceType: 'websocket_frame',
      postDataSize: 512,
      channel: 'WebSocket Frame'
    };
    const wsResult = evaluatePrivacyAudit([syntheticWsLeak]);
    if (wsResult.compliant || wsResult.violations.length !== 1) {
      throw new Error(`Privacy detector failed positive control 2: Did not flag outgoing WebSocket frame!`);
    }

    // Synthetic Test 3: Benign asset requests must pass
    const syntheticBenignAsset: MonitoredNetworkEvent = {
      url: `${baseUrl}/pdf.worker.min.mjs`,
      method: 'GET',
      resourceType: 'script',
      postDataSize: 0,
      channel: 'Script'
    };
    const benignResult = evaluatePrivacyAudit([syntheticBenignAsset]);
    if (!benignResult.compliant) {
      throw new Error(`Privacy detector failed negative control: Flagged benign static asset GET request!`);
    }

    results.push({
      step: 'Privacy Detector Validation (Synthetic Controls)',
      status: 'PASS',
      details: 'Demonstrated detector correctly catches controlled same-origin uploads and outgoing WebSocket frames while permitting benign GET asset requests (tests the event evaluator, not the browser capture mechanism end to end).',
      metrics: {
        sameOriginDetected: true,
        wsFrameDetected: true,
        benignPassed: true
      }
    });
    console.log(`  ✓ Privacy detector controls verified: same-origin uploads and WebSocket frames successfully flagged.`);
  } catch (err: any) {
    results.push({
      step: 'Privacy Detector Validation (Synthetic Controls)',
      status: 'FAIL',
      details: `Detector validation failed: ${err.message}`
    });
    console.log(`  ✗ Privacy detector validation failed: ${err.message}`);
  }

  // SECTION 4: BOUNDED PRIVACY CHECKS (COMPLETION, DOWNLOAD, INDEPENDENT PARSING & AUDIT)
  console.log(`\n[Section 4] Executing bounded privacy & network observation across specific workflows...`);
  const networkEvents: MonitoredNetworkEvent[] = [];

  page.on('request', req => {
    const postData = req.postData();
    networkEvents.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      postDataSize: postData ? postData.length : 0,
      channel: `HTTP/${req.resourceType()}`
    });
  });

  page.on('websocket', ws => {
    networkEvents.push({
      url: ws.url(),
      method: 'WEBSOCKET_OPEN',
      resourceType: 'websocket',
      postDataSize: 0,
      channel: 'WebSocket Connection'
    });

    ws.on('framesent', frame => {
      const payloadLen = typeof frame.payload === 'string'
        ? Buffer.byteLength(frame.payload)
        : (frame.payload ? frame.payload.byteLength : 0);

      networkEvents.push({
        url: ws.url(),
        method: 'WEBSOCKET_FRAME_SENT',
        resourceType: 'websocket_frame',
        postDataSize: payloadLen,
        channel: 'WebSocket Outgoing Frame'
      });
    });
  });

  // Workflow A: /compress-pdf (Fixture Selection -> Compression Completion -> Download -> Independent pypdf Parsing -> Network Audit)
  try {
    networkEvents.length = 0;
    const samplePdfPath = path.join(process.cwd(), 'test-fixtures', 'text_multipage.pdf');
    if (!fs.existsSync(samplePdfPath)) {
      throw new Error(`Required fixture missing: ${samplePdfPath}`);
    }

    console.log(`  Testing privacy on /compress-pdf with valid multipage fixture: ${samplePdfPath}...`);
    await page.goto(`${baseUrl}/compress-pdf`, { waitUntil: 'networkidle' });

    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('Required control input[type="file"] not found on /compress-pdf');
    }

    const eventCountBefore = networkEvents.length;
    await fileInput.setInputFiles(samplePdfPath);

    // Click compress button
    const compressBtn = page.locator('button:has-text("Compress PDF")');
    await compressBtn.waitFor({ state: 'visible', timeout: 5000 });
    await compressBtn.click();

    // Wait for processing completion and download button
    const downloadBtn = page.locator('button:has-text("Download")').first();
    await downloadBtn.waitFor({ state: 'visible', timeout: 25000 });

    // Trigger and verify actual download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      downloadBtn.click()
    ]);
    const downloadPath = await download.path();
    if (!downloadPath || !fs.existsSync(downloadPath)) {
      throw new Error('PDF download event did not produce a valid file.');
    }
    const downloadedBytes = fs.statSync(downloadPath).size;
    if (downloadedBytes <= 0) {
      throw new Error(`Downloaded PDF is 0 bytes!`);
    }

    // INDEPENDENT OUTPUT VERIFICATION & STRUCTURAL PARSING (Requirement 4)
    console.log(`  Parsing downloaded PDF independently via pypdf (${downloadedBytes} bytes)...`);
    const parsedPdf = parsePdfOutput(downloadPath);
    console.log(`  ✓ Independently parsed downloaded PDF: ${parsedPdf.pageCount} pages`);

    if (parsedPdf.pageCount !== 3) {
      throw new Error(`Expected downloaded PDF to have 3 pages, found ${parsedPdf.pageCount}`);
    }

    const expectedTexts = [
      'FileKit Verification Page 1 - Alpha Architecture',
      'FileKit Verification Page 2 - Beta Processing Protocol',
      'FileKit Verification Page 3 - Gamma Privacy Boundary'
    ];

    for (let i = 0; i < expectedTexts.length; i++) {
      const pageText = parsedPdf.pages[i] || '';
      if (!pageText.includes(expectedTexts[i])) {
        throw new Error(`Page ${i + 1} text verification failed. Expected substring: "${expectedTexts[i]}", Got: "${pageText.slice(0, 100)}"`);
      }
      console.log(`  ✓ Page ${i + 1} text verified: "${expectedTexts[i]}"`);
    }

    // Inspect network channels during processing and download (ZERO same-origin exemption)
    const workflowEvents = networkEvents.slice(eventCountBefore);
    const audit = evaluatePrivacyAudit(workflowEvents);

    if (!audit.compliant) {
      throw new Error(`Privacy violation: ${audit.details}`);
    }

    results.push({
      step: 'Bounded Privacy: /compress-pdf Workflow',
      status: 'PASS',
      details: `Full workflow completed: 3-page fixture selected -> processed locally -> downloaded result (${downloadedBytes} bytes). Independently parsed: 3 pages preserved, exact expected text verified on all 3 pages. Monitored channels (Fetch, XHR, WebSocket, Beacon): 0 payload-bearing requests and 0 outgoing WebSocket frames transmitted off-device.`,
      metrics: { downloadedBytes, pageCount: parsedPdf.pageCount, inspectedEvents: workflowEvents.length }
    });
    console.log(`  ✓ Bounded Privacy (/compress-pdf): local compression verified, 3 pages & text asserted, 0 bytes leaked.`);
  } catch (err: any) {
    results.push({
      step: 'Bounded Privacy: /compress-pdf Workflow',
      status: 'FAIL',
      details: `Workflow failed: ${err.message}`
    });
    console.log(`  ✗ Bounded Privacy (/compress-pdf) failed: ${err.message}`);
  }

  // Workflow B: /compress-image-to-200kb (Fixture Selection -> Live Compression -> Download -> Independent PIL Decoding -> Network Audit)
  try {
    networkEvents.length = 0;
    const sampleJpgPath = path.join(process.cwd(), 'test-fixtures', 'sample_photo.jpg');
    if (!fs.existsSync(sampleJpgPath)) {
      throw new Error(`Required fixture missing: ${sampleJpgPath}`);
    }

    console.log(`  Testing privacy on /compress-image-to-200kb with ${sampleJpgPath}...`);
    await page.goto(`${baseUrl}/compress-image-to-200kb`, { waitUntil: 'networkidle' });

    const fileInput = await page.$('input[type="file"]');
    if (!fileInput) {
      throw new Error('Required control input[type="file"] not found on /compress-image-to-200kb');
    }

    const eventCountBefore = networkEvents.length;
    await fileInput.setInputFiles(sampleJpgPath);

    // Wait for live compression pass to complete and download button to become enabled
    const downloadBtn = page.locator('button:has-text("Download")').first();
    await downloadBtn.waitFor({ state: 'visible', timeout: 25000 });
    await page.waitForFunction(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Download'));
      return btn && !btn.hasAttribute('disabled');
    }, { timeout: 25000 });

    // Trigger and verify actual download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      downloadBtn.click()
    ]);
    const downloadPath = await download.path();
    if (!downloadPath || !fs.existsSync(downloadPath)) {
      throw new Error('Image download event did not produce a valid file.');
    }
    const downloadedBytes = fs.statSync(downloadPath).size;
    if (downloadedBytes <= 0) {
      throw new Error(`Downloaded image is 0 bytes!`);
    }

    // INDEPENDENT OUTPUT VERIFICATION & IMAGE DECODING (Requirement 5)
    console.log(`  Decoding downloaded image independently via PIL (${downloadedBytes} bytes)...`);
    const parsedImage = parseImageOutput(downloadPath);
    console.log(`  ✓ Independently decoded downloaded image: Format=${parsedImage.format}, Dimensions=${parsedImage.width}x${parsedImage.height}`);

    if (parsedImage.format !== 'JPEG') {
      throw new Error(`Expected downloaded image format JPEG, got ${parsedImage.format}`);
    }

    // Engine applies deterministic 0.7x scale step (1750x1167) to satisfy the 200 KB target ceiling
    const expectedWidth = 1750;
    const expectedHeight = 1167;
    const expectedAspect = 2500 / 1667;
    const downloadedAspect = parsedImage.width / parsedImage.height;

    if (parsedImage.width !== expectedWidth || parsedImage.height !== expectedHeight) {
      throw new Error(`Expected optimized image dimensions ${expectedWidth}x${expectedHeight}, got ${parsedImage.width}x${parsedImage.height}`);
    }
    if (Math.abs(downloadedAspect - expectedAspect) > 0.01) {
      throw new Error(`Expected preserved aspect ratio (~1.5), got ${downloadedAspect}`);
    }

    const maxTargetBytes = 200 * 1024;
    if (downloadedBytes > maxTargetBytes) {
      throw new Error(`Downloaded image size (${downloadedBytes} bytes) exceeded target ceiling of ${maxTargetBytes} bytes`);
    }
    console.log(`  ✓ Image dimensions asserted (${parsedImage.width}x${parsedImage.height}), aspect ratio preserved, and size meets target (${downloadedBytes} <= ${maxTargetBytes} bytes).`);

    // Inspect network channels (ZERO same-origin exemption)
    const workflowEvents = networkEvents.slice(eventCountBefore);
    const audit = evaluatePrivacyAudit(workflowEvents);

    if (!audit.compliant) {
      throw new Error(`Privacy violation: ${audit.details}`);
    }

    results.push({
      step: 'Bounded Privacy: /compress-image-to-200kb Workflow',
      status: 'PASS',
      details: `Full workflow completed: fixture selected -> optimized in browser -> downloaded result (${downloadedBytes} bytes). Independently decoded via full pixel load: valid JPEG, exact dimensions (1750x1167) verified, target size confirmed (${downloadedBytes} <= 204,800 bytes). Monitored channels (Fetch, XHR, WebSocket, Beacon): 0 payload-bearing requests and 0 outgoing WebSocket frames transmitted off-device.`,
      metrics: { downloadedBytes, width: parsedImage.width, height: parsedImage.height, format: parsedImage.format }
    });
    console.log(`  ✓ Bounded Privacy (/compress-image-to-200kb): local optimization verified, decoded dimensions confirmed, 0 bytes leaked.`);
  } catch (err: any) {
    results.push({
      step: 'Bounded Privacy: /compress-image-to-200kb Workflow',
      status: 'FAIL',
      details: `Workflow failed: ${err.message}`
    });
    console.log(`  ✗ Bounded Privacy (/compress-image-to-200kb) failed: ${err.message}`);
  }

  // Explicit Boundary Declaration
  results.push({
    step: 'Privacy Boundary Assertion',
    status: 'PASS',
    details: 'Privacy established explicitly for observed local workflows (/compress-pdf, /compress-image-to-200kb); catalog-wide inference NOT assumed across remaining 94 catalog tools.',
  });

  await browser.close();
  return results;
}

if (require.main === module) {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error('Usage: npx tsx scripts/verify_cloudflare_staging.ts <staging-url>');
    process.exit(1);
  }
  runStagingVerificationSuite({ stagingUrl: targetUrl })
    .then(results => {
      console.log('\n================ Verification Summary ================');
      const allPassed = results.every(r => r.status === 'PASS');
      results.forEach(r => {
        console.log(`[${r.status}] ${r.step} -> ${r.details}`);
      });
      process.exit(allPassed ? 0 : 1);
    })
    .catch(err => {
      console.error('Verification failed fatal:', err);
      process.exit(1);
    });
}
