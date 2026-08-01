import urllib.request
import json
import os
import time
import zipfile
import io

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "filekit_canary_secret_2026_rotated")
RUN_ID = f"smoke_freeze_{int(time.time())}"

def create_sample_docx():
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>'''
    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>'''
    document = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Post-Freeze Private Beta Verification Document</w:t></w:r></w:p>
  </w:body>
</w:document>'''
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', content_types)
        zf.writestr('_rels/.rels', rels)
        zf.writestr('word/document.xml', document)
    return buf.getvalue()

def main():
    print("==========================================================")
    print(f"POST-FREEZE PRIVATE BETA SMOKE TEST (Run ID: {RUN_ID})")
    print("==========================================================")
    
    docx_bytes = create_sample_docx()
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "User-Agent": "FileKitCanaryRunner/1.0",
        "X-Canary-Run-ID": RUN_ID,
        "X-Canary-Job-Index": "1"
    }

    req = urllib.request.Request(ENDPOINT, data=docx_bytes, headers=headers, method="POST")
    with urllib.request.urlopen(req) as res:
        assert res.status == 200, f"Expected 200 OK, got {res.status}"
        telemetry = json.loads(res.read().decode('utf-8'))
        print(f"1. Conversion Status: HTTP 200 OK")
        print(f"   - Container Duration: {telemetry['containerDurationMs']}ms")
        print(f"   - Total Wall Time: {telemetry['totalWallTimeMs']}ms")
        print(f"2. PDF Magic Bytes Verified: {telemetry['pdfMagicBytesVerified']} [PASS]")
        assert telemetry['pdfMagicBytesVerified'] is True

        print(f"3. Output SHA-256 Readback Matched: {telemetry['sha256Matched']} [PASS]")
        assert telemetry['sha256Matched'] is True

        print(f"4. Input R2 Deletion Status: {telemetry['inputCleanup']['head']} / {telemetry['inputCleanup']['get']} [PASS]")
        assert telemetry['inputCleanup']['head'] == "NOT_FOUND" and telemetry['inputCleanup']['get'] == "NOT_FOUND"

        print(f"5. Output R2 Deletion Status: {telemetry['outputCleanup']['head']} / {telemetry['outputCleanup']['get']} [PASS]")
        assert telemetry['outputCleanup']['head'] == "NOT_FOUND" and telemetry['outputCleanup']['get'] == "NOT_FOUND"

    # Prefix Inspection Check
    inspect_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(inspect_url, headers={"Authorization": f"Bearer {BEARER_TOKEN}", "User-Agent": "FileKitCanaryRunner/1.0"})
    with urllib.request.urlopen(insp_req) as r:
        insp_data = json.loads(r.read().decode('utf-8'))
        remaining = insp_data['remainingObjectCount']
        print(f"6. Remaining R2 Prefix Objects: {remaining} [PASS]")
        assert remaining == 0, f"Expected 0 remaining objects, got {remaining}"

    print("==========================================================")
    print("POST_FREEZE_SMOKE_VERIFIED: PASSED")
    print("==========================================================")

if __name__ == "__main__":
    main()
