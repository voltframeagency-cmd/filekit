const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = 8080;
const CONTAINER_INSTANCE_ID = `container_${os.hostname()}_${Date.now()}`;
const CONTAINER_PROCESS_BOOT_ID = `boot_${os.hostname()}_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
const TEMPLATE_PROFILE_DIR = '/home/filekit/soffice_profile_template/user';

function runCommand(cmd, opts) {
  return new Promise((resolve) => {
    exec(cmd, opts, (error, stdout, stderr) => {
      resolve({
        exitCode: error ? (error.code || 1) : 0,
        stdout: stdout || '',
        stderr: stderr || (error ? error.message : '')
      });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', engine: 'LibreOffice', containerInstanceId: CONTAINER_INSTANCE_ID }));
    return;
  }

  if (req.method === 'POST' && req.url === '/convert') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      if (buffer.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'EMPTY_PAYLOAD' }));
        return;
      }

      const timings = {};
      const jobStart = Date.now();

      const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const workDir = path.join('/tmp', jobId);
      const profileDir = path.join('/tmp', jobId + '_profile');
      const profileUserDir = path.join(profileDir, 'user');
      
      // Phase 1: Profile initialization (copy template or create fresh)
      const profileStart = Date.now();
      fs.mkdirSync(workDir, { recursive: true });

      const templateExists = fs.existsSync(TEMPLATE_PROFILE_DIR);
      if (templateExists) {
        // Fast path: copy pre-seeded read-only template
        fs.cpSync(path.join(TEMPLATE_PROFILE_DIR, '..'), profileDir, { recursive: true });
        timings.profileMethod = 'TEMPLATE_COPY';
      } else {
        // Fallback: create and seed fresh profile
        fs.mkdirSync(profileUserDir, { recursive: true });
        const registryXcu = `<?xml version="1.0" encoding="UTF-8"?>
<oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="MacroSecurityLevel" oor:type="xs:int"><value>3</value></prop></item>
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="DisableMacrosExecution" oor:type="xs:boolean"><value>true</value></prop></item>
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="SecureURL" oor:type="oor:string-list"><value/></prop></item>
  <item oor:path="/org.openoffice.Office.Common/Security/Scripting"><prop oor:name="ExecutePlugins" oor:type="xs:boolean"><value>false</value></prop></item>
</oor:items>`;
        fs.writeFileSync(path.join(profileUserDir, 'registrymodifications.xcu'), registryXcu);
        timings.profileMethod = 'FRESH_CREATE';
      }
      timings.profileInitMs = Date.now() - profileStart;

      // Phase 2: Format detection
      let inputFilename = 'input.docx';
      let detectedFormat = 'DOCX';
      if (buffer.length >= 8 && buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0) {
        inputFilename = 'input.xls';
        detectedFormat = 'XLS_OLE2';
      } else if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04) {
        const strBuf = buffer.toString('binary', 0, Math.min(buffer.length, 4096));
        if (strBuf.includes('xl/') || strBuf.includes('workbook') || strBuf.includes('sheet')) {
          inputFilename = 'input.xlsx';
          detectedFormat = 'XLSX_OPENXML';
        } else if (strBuf.includes('ppt/') || strBuf.includes('presentation') || strBuf.includes('slide')) {
          inputFilename = 'input.pptx';
          detectedFormat = 'PPTX_OPENXML';
        } else {
          inputFilename = 'input.docx';
          detectedFormat = 'DOCX_OPENXML';
        }
      }

      const inputPath = path.join(workDir, inputFilename);
      const expectedPdfName = inputFilename.replace(/\.[^.]+$/, '.pdf');
      const outputPath = path.join(workDir, expectedPdfName);

      fs.writeFileSync(inputPath, buffer);

      // Phase 3: LibreOffice conversion
      const loStart = Date.now();
      const profileUri = 'file://' + profileDir.replace(/\\/g, '/');
      const cmd = `libreoffice "-env:UserInstallation=${profileUri}" --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to pdf "${inputPath}" --outdir "${workDir}"`;

      const result = await runCommand(cmd, { timeout: 30000 });
      timings.libreOfficeMs = Date.now() - loStart;

      // Phase 4: Cleanup
      const cleanupStart = Date.now();
      const cleanup = () => {
        try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}
        try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch {}
      };

      timings.totalJobMs = Date.now() - jobStart;

      if (result.exitCode === 0 && fs.existsSync(outputPath)) {
        const pdfBytes = fs.readFileSync(outputPath);
        cleanup();
        timings.cleanupMs = Date.now() - cleanupStart;

        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'X-LibreOffice-Exit-Code': '0',
          'X-LibreOffice-Duration-Ms': String(timings.libreOfficeMs),
          'X-Profile-Init-Ms': String(timings.profileInitMs),
          'X-Profile-Method': timings.profileMethod,
          'X-Total-Job-Ms': String(timings.totalJobMs),
          'X-Container-Instance-Id': CONTAINER_INSTANCE_ID,
          'X-Container-Process-Boot-Id': CONTAINER_PROCESS_BOOT_ID,
          'X-Detected-Format': detectedFormat,
          'X-LibreOffice-Stdout': Buffer.from(result.stdout || '').toString('base64'),
        });
        res.end(pdfBytes);
      } else {
        cleanup();
        timings.cleanupMs = Date.now() - cleanupStart;

        res.writeHead(500, {
          'Content-Type': 'application/json',
          'X-LibreOffice-Exit-Code': String(result.exitCode),
          'X-Container-Instance-Id': CONTAINER_INSTANCE_ID,
          'X-Container-Process-Boot-Id': CONTAINER_PROCESS_BOOT_ID,
        });
        res.end(JSON.stringify({
          error: 'LIBREOFFICE_CONVERSION_FAILED',
          exitCode: result.exitCode,
          stderr: result.stderr,
          stdout: result.stdout,
          timings,
          detectedFormat
        }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'NOT_FOUND' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`OfficeWorker LibreOffice Container HTTP Server listening on port ${PORT}`);
  console.log(`Container Instance ID: ${CONTAINER_INSTANCE_ID}`);
  console.log(`Template profile exists: ${fs.existsSync(TEMPLATE_PROFILE_DIR)}`);
});
