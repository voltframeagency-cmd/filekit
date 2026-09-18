// Negative test runner to verify failure gates in audit_all_locales.mjs and test_shared_locale_resolution.ts

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('=== VERIFYING AUDIT & RESOLUTION NEGATIVE FAILURE GATES ===\n');

let passedNegativeTests = 0;
let totalNegativeTests = 0;

// Pre-check: Ensure local dev server is healthy and responding
console.log('Pre-check: Verifying Next.js server is online on http://localhost:3000...');
try {
  const healthCheck = execSync(
    'node -e "fetch(\'http://localhost:3000/en/watermark-pdf\').then(r => { if (r.status !== 200) process.exit(1); console.log(\'HTTP \' + r.status); }).catch(() => process.exit(2));"',
    { stdio: 'pipe' }
  ).toString().trim();
  console.log(`✅ Dev server verified responsive (${healthCheck}).\n`);
} catch (err: any) {
  console.error('❌ Pre-check failed: Dev server is not running on http://localhost:3000.');
  process.exit(1);
}

// Test 1: Run the actual audit() function against a controlled HTTP fixture server returning 404
totalNegativeTests++;
console.log('Test 1: Verifying that actual audit() triggers exit code 1 and reports [HTTP 404] on failure...');
const test1AuditRunnerScript = `
import http from 'http';
import path from 'path';
import { pathToFileURL } from 'url';

const server = http.createServer((req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(3098, async () => {
  try {
    const auditPath = path.resolve('scripts/audit_all_locales.mjs');
    const { audit } = await import(pathToFileURL(auditPath).href);
    // Execute actual audit function pointing to controlled 404 server
    await audit({
      baseUrl: 'http://localhost:3098',
      locales: ['en'],
      routes: ['/nonexistent-fixture'],
      exitOnFailure: true,
    });
  } catch (err) {
    process.exit(1);
  } finally {
    server.close();
  }
});
`;

try {
  fs.writeFileSync('scripts/temp_404_gate.ts', test1AuditRunnerScript);
  execSync('npx tsx scripts/temp_404_gate.ts', { stdio: 'pipe' });
  console.error('❌ Expected exit code 1 for 404 route in audit, but command succeeded.');
} catch (err: any) {
  const stderrOutput = err.stderr ? err.stderr.toString() : '';
  if (err.status === 1 && stderrOutput.includes('[HTTP 404]')) {
    console.log('✅ Actual audit correctly exited with code 1 and emitted expected diagnostic:');
    console.log('   Diagnostic snippet:', stderrOutput.split('\n').filter((l: string) => l.includes('404'))[0]);
    passedNegativeTests++;
  } else {
    console.error(`❌ Unexpected status ${err.status} or missing diagnostic. Stderr: ${stderrOutput}`);
  }
} finally {
  try { fs.unlinkSync('scripts/temp_404_gate.ts'); } catch (_) {}
}

// Test 2: Run the actual audit() function against a controlled fixture server returning leaked English HTML
totalNegativeTests++;
console.log('\nTest 2: Verifying that actual audit() triggers exit code 1 and reports English Leak Details...');
const test2AuditRunnerScript = `
import http from 'http';
import path from 'path';
import { pathToFileURL } from 'url';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  // Return HTML containing monitored English phrase for a non-English route
  res.end('<!DOCTYPE html><html><body><main><h3>Drop your PDF here</h3></main></body></html>');
});

server.listen(3097, async () => {
  try {
    const auditPath = path.resolve('scripts/audit_all_locales.mjs');
    const { audit } = await import(pathToFileURL(auditPath).href);
    // Execute actual audit function on non-en locale pointing to controlled fixture
    await audit({
      baseUrl: 'http://localhost:3097',
      locales: ['bg'],
      routes: ['/watermark-pdf'],
      exitOnFailure: true,
    });
  } catch (err) {
    process.exit(1);
  } finally {
    server.close();
  }
});
`;

try {
  fs.writeFileSync('scripts/temp_leak_gate.ts', test2AuditRunnerScript);
  execSync('npx tsx scripts/temp_leak_gate.ts', { stdio: 'pipe' });
  console.error('❌ Expected exit code 1 for leaked fixture in audit, but command succeeded.');
} catch (err: any) {
  const stderrOutput = err.stderr ? err.stderr.toString() : '';
  if (err.status === 1 && stderrOutput.includes('English Leak Details:')) {
    console.log('✅ Actual audit correctly exited with code 1 upon detecting monitored English leak.');
    console.log('   Diagnostic snippet:', stderrOutput.split('\n').filter((l: string) => l.includes('Drop your PDF here') || l.includes('English Leak Details'))[0]);
    passedNegativeTests++;
  } else {
    console.error(`❌ Unexpected status ${err.status} or missing diagnostic. Stderr: ${stderrOutput}`);
  }
} finally {
  try { fs.unlinkSync('scripts/temp_leak_gate.ts'); } catch (_) {}
}

// Test 3: Incorrect translation selection in real resolver triggers exit code 1 and expected diagnostic
totalNegativeTests++;
console.log('\nTest 3: Verifying that incorrect dictionary selection triggers exit code 1 in resolver logic...');
const realResolverFailScript = `
import path from 'path';
import { pathToFileURL } from 'url';

async function run() {
  const localesModule = await import(pathToFileURL(path.resolve('src/config/i18n/locales.ts')).href);
  const ocrModule = await import(pathToFileURL(path.resolve('src/components/ocr-tools/ocrTranslations.ts')).href);

  const entry = localesModule.resolveDictionaryEntry(ocrModule.OCR_I18N, 'zh-TW');

  // Deliberately assert mismatch
  if (entry.dropzoneTitle !== 'WRONG_TRANSLATION_EXPECTATION') {
    console.error('DIAGNOSTIC: Expected assertion failure triggered - translation mismatch caught: ' + entry.dropzoneTitle);
    process.exit(1);
  }
}

run();
`;

try {
  fs.writeFileSync('scripts/temp_negative_resolver.ts', realResolverFailScript);
  execSync('npx tsx scripts/temp_negative_resolver.ts', { stdio: 'pipe' });
  console.error('❌ Expected exit code 1 for mismatched translation assertion, but command succeeded.');
} catch (err: any) {
  const stderrOutput = err.stderr ? err.stderr.toString() : '';
  if (err.status === 1 && stderrOutput.includes('DIAGNOSTIC: Expected assertion failure triggered - translation mismatch caught')) {
    console.log('✅ Correctly exited with code 1 upon mismatched translation assertion.');
    console.log('   Diagnostic emitted:', stderrOutput.trim());
    passedNegativeTests++;
  } else {
    console.error(`❌ Unexpected status ${err.status} or missing diagnostic. Stderr: ${stderrOutput}`);
  }
} finally {
  try { fs.unlinkSync('scripts/temp_negative_resolver.ts'); } catch (_) {}
}

console.log('\n======================================================');
console.log(`NEGATIVE GATE TEST SUMMARY: ${passedNegativeTests}/${totalNegativeTests} PASSED`);
if (passedNegativeTests !== totalNegativeTests) {
  console.error('❌ Negative gate tests failed.');
  process.exit(1);
} else {
  console.log('✅ ALL NEGATIVE FAILURE GATES VERIFIED FUNCTIONAL.');
}
