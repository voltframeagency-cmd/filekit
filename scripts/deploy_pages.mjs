#!/usr/bin/env node
/**
 * Explicit Cloudflare Pages Deployment Wrapper
 * Prevents wrangler.toml collision by copying the target environment's Wrangler config
 * into place only during the deploy command and restoring wrangler.toml immediately in a finally block.
 *
 * Usage:
 *   node scripts/deploy_pages.mjs staging
 *   node scripts/deploy_pages.mjs production
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const target = (process.argv[2] || '').toLowerCase();
if (target !== 'staging' && target !== 'production') {
  console.error('Usage: node scripts/deploy_pages.mjs <staging|production>');
  process.exit(1);
}

const ROOT = process.cwd();
const WRANGLER_TOML = path.join(ROOT, 'wrangler.toml');
const WRANGLER_PROD_TOML = path.join(ROOT, 'wrangler.production.toml');
const DIST_DIR = path.join(ROOT, 'dist-staging');

const originalStagingToml = fs.readFileSync(WRANGLER_TOML, 'utf8');
const prodToml = fs.readFileSync(WRANGLER_PROD_TOML, 'utf8');

// Verify expected D1 database IDs before deploying
if (!originalStagingToml.includes('682e90a1-f70f-41a4-a60c-ecc928c9f057')) {
  console.error('FATAL: wrangler.toml is missing staging D1 database_id 682e90a1-f70f-41a4-a60c-ecc928c9f057');
  process.exit(1);
}
if (!prodToml.includes('c8890d8e-4632-453c-9a1d-102a0bff0e14')) {
  console.error('FATAL: wrangler.production.toml is missing production D1 database_id c8890d8e-4632-453c-9a1d-102a0bff0e14');
  process.exit(1);
}

const projectName = target === 'production' ? 'filekit-prod' : 'filekit-staging';

try {
  console.log(`\n▶ [1/2] Preparing distribution for [${target.toUpperCase()}] (${projectName})...`);
  execSync('node scripts/prepare_staging_distribution.mjs', { stdio: 'inherit' });

  if (target === 'production') {
    fs.writeFileSync(WRANGLER_TOML, prodToml, 'utf8');
    console.log('✓ Activated wrangler.production.toml for filekit-prod deployment');
  } else {
    console.log('✓ Verified wrangler.toml for filekit-staging deployment');
  }

  console.log(`\n▶ [2/2] Deploying to Cloudflare Pages project "${projectName}"...`);
  execSync(
    `npx wrangler pages deploy dist-staging --project-name=${projectName} --branch=main --commit-dirty=true`,
    { stdio: 'inherit' }
  );
} finally {
  // Always restore staging wrangler.toml and clean up dist-staging
  fs.writeFileSync(WRANGLER_TOML, originalStagingToml, 'utf8');
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
}
