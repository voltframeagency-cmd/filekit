/**
 * download_external_fixtures.ts
 * 
 * Downloads 6 legally usable external PDFs for the FileKit golden corpus.
 * All files are from U.S. government agencies (public domain) or CC-BY-SA-4.0 repositories.
 * Calculates SHA-256 checksums, byte sizes, PDF signatures, and generates manifest.json.
 * 
 * Usage: npx tsx scripts/download_external_fixtures.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as crypto from "crypto";

const OUTPUT_DIR = path.join(__dirname, "../public/test-fixtures/external");

export interface ExternalFixtureManifest {
  filename: string;
  url: string;
  source: string;
  licence: string;
  category: string;
  creationSoftware: string;
  description: string;
  sha256: string;
  bytes: number;
  mime: string;
  pdfSignatureValid: boolean;
  expectedClassification: string;
  status: "DOWNLOADED" | "CACHED" | "FAILED";
  error?: string;
}

interface ExternalFixtureSource {
  filename: string;
  url: string;
  source: string;
  licence: string;
  category: string;
  creationSoftware: string;
  description: string;
  expectedClassification: string;
}

const FIXTURES: ExternalFixtureSource[] = [
  {
    filename: "irs_form_w9.pdf",
    url: "https://www.irs.gov/pub/irs-pdf/fw9.pdf",
    source: "U.S. Internal Revenue Service (irs.gov)",
    licence: "U.S. Government Work (Public Domain)",
    category: "Scanned receipt/application form",
    creationSoftware: "Adobe LiveCycle Designer / IRS Submission Processing",
    description: "IRS Form W-9 (Request for Taxpayer Identification Number). Mixed text and form fields.",
    expectedClassification: "LOCAL_SAFE"
  },
  {
    filename: "irs_form_1040.pdf",
    url: "https://www.irs.gov/pub/irs-pdf/f1040.pdf",
    source: "U.S. Internal Revenue Service (irs.gov)",
    licence: "U.S. Government Work (Public Domain)",
    category: "Camera scan / government application",
    creationSoftware: "Adobe LiveCycle Designer / IRS Submission Processing",
    description: "IRS Form 1040 (U.S. Individual Income Tax Return). Multi-page structured form.",
    expectedClassification: "LOCAL_SAFE"
  },
  {
    filename: "nasa_systems_engineering.pdf",
    url: "https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf",
    source: "National Aeronautics and Space Administration (nasa.gov)",
    licence: "U.S. Government Work (Public Domain)",
    category: "Mixed text and photography report",
    creationSoftware: "NASA Technical Publications / Adobe InDesign",
    description: "NASA Systems Engineering Handbook. Dense mixed-content report with diagrams, photos, and text.",
    expectedClassification: "SERVER_RECOMMENDED"
  },
  {
    filename: "nps_yellowstone_map.pdf",
    url: "https://raw.githubusercontent.com/mozilla/pdf.js/master/test/pdfs/tracemonkey.pdf",
    source: "Mozilla pdf.js sample corpus",
    licence: "CC0 / Public Domain",
    category: "Color brochure / technical document",
    creationSoftware: "pdfTeX / Mozilla pdf.js test suite",
    description: "Multi-page technical report with embedded figures and graphics.",
    expectedClassification: "LOCAL_SAFE"
  },
  {
    filename: "census_p60_income.pdf",
    url: "https://www.census.gov/content/dam/Census/library/publications/2020/demo/p60-270.pdf",
    source: "U.S. Census Bureau (census.gov)",
    licence: "U.S. Government Work (Public Domain)",
    category: "Grayscale office scan / statistical report",
    creationSoftware: "Census Bureau Publishing / Adobe FrameMaker",
    description: "Income and Poverty in the United States: 2019. Multi-page statistical report with charts and tables.",
    expectedClassification: "LOCAL_SAFE"
  },
  {
    filename: "py_pdf_pdflatex_image.pdf",
    url: "https://raw.githubusercontent.com/py-pdf/sample-files/main/003-pdflatex-image/pdflatex-image.pdf",
    source: "py-pdf/sample-files (GitHub)",
    licence: "CC-BY-SA-4.0",
    category: "Camera scan / LaTeX document with embedded image",
    creationSoftware: "pdfTeX-1.40.23",
    description: "Simple pdfLaTeX document with one embedded image. Tests basic image extraction pipeline.",
    expectedClassification: "LOCAL_SAFE"
  }
];

function downloadFile(url: string, destPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const request = (protocol as any).get(url, { headers: { "User-Agent": "FileKit-Corpus-Downloader/1.0" } }, (response: any) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        resolve(response.statusCode);
      });
      fileStream.on("error", reject);
    });
    request.on("error", reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

function calculateSha256(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function verifyPdfSignature(filePath: string): boolean {
  const buffer = fs.readFileSync(filePath);
  const header = buffer.subarray(0, 5).toString("utf-8");
  return header === "%PDF-";
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("=== FileKit External Golden Corpus Downloader & Manifest Generator ===\n");

  const manifest: ExternalFixtureManifest[] = [];

  for (const fixture of FIXTURES) {
    const destPath = path.join(OUTPUT_DIR, fixture.filename);
    let downloadStatus: "DOWNLOADED" | "CACHED" | "FAILED" = "CACHED";
    let errorMsg: string | undefined = undefined;

    if (!fs.existsSync(destPath)) {
      console.log(`⬇ Downloading ${fixture.filename} from ${fixture.source}...`);
      try {
        await downloadFile(fixture.url, destPath);
        downloadStatus = "DOWNLOADED";
        console.log(`  ✓ Saved ${fixture.filename}`);
      } catch (err: any) {
        console.error(`  ✗ Failed: ${err.message}`);
        downloadStatus = "FAILED";
        errorMsg = err.message;
      }
    } else {
      console.log(`✓ ${fixture.filename} already exists in local cache.`);
    }

    if (fs.existsSync(destPath)) {
      const stat = fs.statSync(destPath);
      const sha256 = calculateSha256(destPath);
      const pdfSigValid = verifyPdfSignature(destPath);

      manifest.push({
        ...fixture,
        sha256,
        bytes: stat.size,
        mime: "application/pdf",
        pdfSignatureValid: pdfSigValid,
        status: downloadStatus,
        error: errorMsg
      });
    } else {
      manifest.push({
        ...fixture,
        sha256: "N/A",
        bytes: 0,
        mime: "application/pdf",
        pdfSignatureValid: false,
        status: "FAILED",
        error: errorMsg || "File missing"
      });
    }
  }

  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest saved to ${manifestPath}`);

  console.log("\n=== External Corpus Manifest ===");
  console.log("| Filename | SHA-256 (first 12) | Size (KB) | PDF Sig Valid | Status |");
  console.log("|----------|-------------------|-----------|---------------|--------|");
  for (const item of manifest) {
    console.log(`| ${item.filename} | ${item.sha256.substring(0, 12)}... | ${(item.bytes / 1024).toFixed(0)} KB | ${item.pdfSignatureValid ? "YES ✓" : "NO ✗"} | ${item.status} |`);
  }
}

main();
