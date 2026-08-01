const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;

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
    res.end(JSON.stringify({ status: 'ok', engine: 'LibreOffice' }));
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

      const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const workDir = path.join('/tmp', jobId);
      fs.mkdirSync(workDir, { recursive: true });

      const inputPath = path.join(workDir, 'input.docx');
      const outputPath = path.join(workDir, 'input.pdf');

      fs.writeFileSync(inputPath, buffer);

      const startTime = Date.now();
      const cmd = `libreoffice --headless --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to pdf "${inputPath}" --outdir "${workDir}"`;

      // Non-blocking async execution
      const result = await runCommand(cmd, { timeout: 30000 });
      const durationMs = Date.now() - startTime;

      if (result.exitCode === 0 && fs.existsSync(outputPath)) {
        const pdfBytes = fs.readFileSync(outputPath);
        
        try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}

        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'X-LibreOffice-Exit-Code': '0',
          'X-LibreOffice-Duration-Ms': String(durationMs),
          'X-LibreOffice-Stdout': Buffer.from(result.stdout || '').toString('base64'),
        });
        res.end(pdfBytes);
      } else {
        try { fs.rmSync(workDir, { recursive: true, force: true }); } catch {}

        res.writeHead(500, {
          'Content-Type': 'application/json',
          'X-LibreOffice-Exit-Code': String(result.exitCode),
        });
        res.end(JSON.stringify({
          error: 'LIBREOFFICE_CONVERSION_FAILED',
          exitCode: result.exitCode,
          stderr: result.stderr,
          stdout: result.stdout
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
});
