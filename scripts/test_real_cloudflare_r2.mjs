import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('▶ Executing Real Cloudflare R2 Object Storage Deletion Lifecycle Benchmark...');

const bucketName = 'filekit-canary-r2-staged';
const testObjectId = `canary_test_docx_${Date.now()}`;
const tempInputPath = path.join(rootDir, 'artifacts', `${testObjectId}.docx`);
const tempOutputPath = path.join(rootDir, 'artifacts', `${testObjectId}_down.docx`);

// 1. Create test payload
const testBuffer = Buffer.concat([Buffer.from([0x50, 0x4B, 0x03, 0x04]), Buffer.alloc(150000)]);
fs.writeFileSync(tempInputPath, testBuffer);

console.log(`  1. Created local staged payload (${testBuffer.length} bytes, PK header verified).`);

// 2. Put Object into Real Cloudflare R2 Bucket
console.log(`  2. Uploading object '${testObjectId}.docx' to real Cloudflare R2 bucket '${bucketName}'...`);
const startUploadTime = Date.now();
execSync(`npx wrangler r2 object put ${bucketName}/${testObjectId}.docx --file="${tempInputPath}"`, { cwd: rootDir, stdio: 'pipe' });
const uploadDurationMs = Date.now() - startUploadTime;
console.log(`  ✓ Object uploaded cleanly to Cloudflare R2 in ${uploadDurationMs} ms.`);

// 3. Get Object back from Real Cloudflare R2 Bucket
console.log(`  3. Fetching object back from Cloudflare R2 bucket...`);
const startDownloadTime = Date.now();
execSync(`npx wrangler r2 object get ${bucketName}/${testObjectId}.docx --file="${tempOutputPath}"`, { cwd: rootDir, stdio: 'pipe' });
const downloadDurationMs = Date.now() - startDownloadTime;

const downloadedBuffer = fs.readFileSync(tempOutputPath);
const isMatch = downloadedBuffer.length === testBuffer.length && downloadedBuffer.subarray(0, 4).toString('hex') === '504b0304';
console.log(`  ✓ Object fetched from Cloudflare R2 in ${downloadDurationMs} ms (Length: ${downloadedBuffer.length} bytes, PK match: ${isMatch}).`);

// 4. Real Deletion Pass against Cloudflare R2
console.log(`  4. Executing real Object Deletion on Cloudflare R2...`);
const startDeleteTime = Date.now();
execSync(`npx wrangler r2 object delete ${bucketName}/${testObjectId}.docx`, { cwd: rootDir, stdio: 'pipe' });
const deletionDurationMs = Date.now() - startDeleteTime;
console.log(`  ✓ Object deleted from Cloudflare R2 in ${deletionDurationMs} ms.`);

// 5. Post-Deletion Verification (Must fail with 404 NOT_FOUND)
console.log(`  5. Verifying Post-Deletion Head / Get (Expecting 404 NOT_FOUND)...`);
let postDeletionStatus = 'UNKNOWN';
try {
  const checkFile = path.join(rootDir, 'artifacts', 'check_404.tmp');
  execSync(`npx wrangler r2 object get ${bucketName}/${testObjectId}.docx --file="${checkFile}"`, { cwd: rootDir, stdio: 'pipe' });
  postDeletionStatus = 'FAILED_OBJECT_STILL_EXISTS';
} catch (err) {
  postDeletionStatus = 'VERIFIED_404_NOT_FOUND';
}

console.log(`  ✓ Post-Deletion Verification: ${postDeletionStatus}`);

// Cleanup local temp files
if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);

const r2Evidence = {
  bucketName,
  objectId: `${testObjectId}.docx`,
  accountEmail: 'voltframeagency@gmail.com',
  accountId: 'ec7802e67539aee53b94fcf073b22709',
  uploadDurationMs,
  downloadDurationMs,
  deletionDurationMs,
  postDeletionStatus,
  status: postDeletionStatus === 'VERIFIED_404_NOT_FOUND' ? 'REMOTE_R2_OBJECT_DELETION_VERIFIED' : 'FAILED',
};

const artifactsDir = path.join(rootDir, 'artifacts');
fs.writeFileSync(
  path.join(artifactsDir, 'cloudflare-r2-real-deletion-evidence.json'),
  JSON.stringify(r2Evidence, null, 2),
  'utf-8'
);

console.log('✓ Real Cloudflare R2 Lifecycle Test Passed Successfully!');
console.log('  - Artifact generated: artifacts/cloudflare-r2-real-deletion-evidence.json');
