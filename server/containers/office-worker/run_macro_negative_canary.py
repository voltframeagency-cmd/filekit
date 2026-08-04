"""
PHASE 4: Macro Negative-Execution Canary

Creates a controlled macro-bearing fixture and submits it to the live
Cloudflare Worker to verify that:
1. The preflight rejects the file (deep VBA stream detection)
2. No marker file is created on the container filesystem
3. No retained R2 objects exist

The macro payload is harmless: it only attempts to create a marker file
at /tmp/macro_canary_marker.txt. No network access, no external commands.
"""

import urllib.request
import urllib.error
import json
import struct
import io
import time
import os
import uuid
import zipfile
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/convert"
INSPECT_ENDPOINT = "https://filekit-office-worker-canary.voltframeagency.workers.dev/internal/canary/inspect"
BEARER_TOKEN = os.environ.get("CANARY_BEARER_TOKEN", "")
if not BEARER_TOKEN:
    raise ValueError("CANARY_BEARER_TOKEN environment variable is required")
RUN_ID = f"run_macro_canary_{uuid.uuid4().hex[:8]}"


def build_xlsx_with_vba_project():
    """Build a minimal .xlsx ZIP that contains a vbaProject.bin entry.
    
    This simulates a macro-enabled workbook submitted with .xlsx extension.
    The preflight should detect vbaProject.bin in the ZIP entries and reject it.
    """
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Valid OpenXML structure
        zf.writestr('[Content_Types].xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="bin" ContentType="application/vnd.ms-office.vbaProject"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>''')
        zf.writestr('_rels/.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>''')
        zf.writestr('xl/workbook.xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>''')
        zf.writestr('xl/_rels/workbook.xml.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vbaProject" Target="vbaProject.bin"/>
</Relationships>''')
        zf.writestr('xl/worksheets/sheet1.xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    <row r="1"><c r="A1" t="s"><v>0</v></c></row>
  </sheetData>
</worksheet>''')

        # The harmless macro payload:
        # In a real VBA project this would contain compiled VBA code.
        # We embed a text-based marker that describes the intended behavior
        # so the fixture is documented even though it will be rejected at preflight.
        macro_marker = (
            b"CANARY_MACRO_PAYLOAD\n"
            b"Sub Auto_Open()\n"
            b"  Open \"/tmp/macro_canary_marker.txt\" For Output As #1\n"
            b"  Print #1, \"MACRO_EXECUTED_CANARY_FAILURE\"\n"
            b"  Close #1\n"
            b"End Sub\n"
        )
        zf.writestr('xl/vbaProject.bin', macro_marker)
    
    return buf.getvalue()


def build_ole2_with_vba_stream():
    """Build a minimal OLE2 compound binary that contains VBA directory entries.
    
    This simulates a legacy .xls file with embedded macros submitted via
    application/octet-stream. The preflight should detect _VBA_PROJECT or
    VBA stream names in the OLE2 directory and reject it.
    """
    # OLE2 Compound Binary File header (magic bytes) + minimal structure
    # with embedded VBA stream name markers
    buf = io.BytesIO()
    # OLE2 magic
    buf.write(b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1')
    # Minor version, major version
    buf.write(struct.pack('<HH', 0x003E, 0x0003))
    # Byte order (little-endian)
    buf.write(struct.pack('<H', 0xFFFE))
    # Sector size power (512 bytes = 2^9)
    buf.write(struct.pack('<H', 0x0009))
    # Mini sector size power (64 bytes = 2^6)
    buf.write(struct.pack('<H', 0x0006))
    # Reserved + padding to fill header
    buf.write(b'\x00' * 38)
    # Total FAT sectors, first directory sector SECID, etc.
    buf.write(struct.pack('<I', 1))  # total FAT sectors
    buf.write(struct.pack('<I', 0))  # first directory sector
    buf.write(b'\x00' * 8)
    # First mini FAT sector: none
    buf.write(struct.pack('<i', -2))
    buf.write(struct.pack('<I', 0))
    # First DIFAT sector: none
    buf.write(struct.pack('<i', -2))
    buf.write(struct.pack('<I', 0))
    # DIFAT array (109 entries)
    buf.write(struct.pack('<i', 1))  # first FAT sector at sector 1
    buf.write(struct.pack('<i', -1) * 108)
    
    # Pad to 512 bytes (sector 0 = header)
    current = buf.tell()
    if current < 512:
        buf.write(b'\x00' * (512 - current))
    
    # Sector 0: Directory entries (512 bytes)
    dir_sector = io.BytesIO()
    
    # Root Entry (128 bytes)
    root_name = 'Root Entry'.encode('utf-16-le')
    dir_sector.write(root_name + b'\x00' * (64 - len(root_name)))
    dir_sector.write(struct.pack('<H', len(root_name) + 2))  # name size
    dir_sector.write(struct.pack('<B', 5))  # type: root
    dir_sector.write(struct.pack('<B', 1))  # color: black
    dir_sector.write(struct.pack('<iii', -1, -1, 1))  # left, right, child
    dir_sector.write(b'\x00' * 36)  # CLSID + state bits + timestamps
    dir_sector.write(struct.pack('<iI', -2, 0))  # start sector, size
    
    # Workbook Entry (128 bytes) - makes it look like Excel
    wb_name = 'Workbook'.encode('utf-16-le')
    dir_sector.write(wb_name + b'\x00' * (64 - len(wb_name)))
    dir_sector.write(struct.pack('<H', len(wb_name) + 2))
    dir_sector.write(struct.pack('<B', 2))  # type: stream
    dir_sector.write(struct.pack('<B', 1))
    dir_sector.write(struct.pack('<iii', -1, 2, -1))  # left, right(VBA), child
    dir_sector.write(b'\x00' * 36)
    dir_sector.write(struct.pack('<iI', -2, 0))
    
    # _VBA_PROJECT Entry (128 bytes) - THE CANARY: this should trigger rejection
    vba_name = '_VBA_PROJECT'.encode('utf-16-le')
    dir_sector.write(vba_name + b'\x00' * (64 - len(vba_name)))
    dir_sector.write(struct.pack('<H', len(vba_name) + 2))
    dir_sector.write(struct.pack('<B', 2))  # type: stream
    dir_sector.write(struct.pack('<B', 0))
    dir_sector.write(struct.pack('<iii', -1, -1, -1))
    dir_sector.write(b'\x00' * 36)
    dir_sector.write(struct.pack('<iI', -2, 0))
    
    # Pad directory to 512 bytes
    dir_data = dir_sector.getvalue()
    if len(dir_data) < 512:
        dir_data += b'\x00' * (512 - len(dir_data))
    buf.write(dir_data)
    
    # Sector 1: FAT (512 bytes)
    fat = io.BytesIO()
    fat.write(struct.pack('<i', -2))  # sector 0: end of chain (directory)
    fat.write(struct.pack('<i', -3))  # sector 1: FAT sector
    fat_data = fat.getvalue()
    fat_data += b'\xff' * (512 - len(fat_data))
    buf.write(fat_data)
    
    return buf.getvalue()


def build_pptx_with_vba_project():
    """Build a minimal .pptx ZIP that contains a vbaProject.bin entry."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>''')
        zf.writestr('_rels/.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>''')
        zf.writestr('ppt/presentation.xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst>
</p:presentation>''')
        zf.writestr('ppt/_rels/presentation.xml.rels', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide1.xml"/>
</Relationships>''')
        zf.writestr('ppt/slides/slide1.xml', '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sld>''')
        # VBA project binary
        zf.writestr('ppt/vbaProject.bin', b"CANARY_PPTX_MACRO_PAYLOAD")
    return buf.getvalue()


def submit_fixture(fixture_id, data, content_type, filename, expect_rejection):
    """Submit a fixture and return result dict."""
    headers = {
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "Content-Type": content_type,
        "User-Agent": "FileKitMacroCanary/1.0",
        "X-Canary-Run-ID": RUN_ID,
        "X-Canary-Job-Index": "1",
        "X-File-Name": filename
    }
    req = urllib.request.Request(ENDPOINT, data=data, headers=headers, method="POST")
    start = time.time()

    try:
        with urllib.request.urlopen(req) as res:
            wall_ms = (time.time() - start) * 1000.0
            body = res.read()
            if expect_rejection:
                return {
                    "id": fixture_id,
                    "status": "UNEXPECTED_PASS",
                    "http_code": res.status,
                    "wall_ms": wall_ms,
                    "detail": "Expected rejection but got HTTP 200"
                }
            else:
                return {
                    "id": fixture_id,
                    "status": "PASS",
                    "http_code": res.status,
                    "wall_ms": wall_ms
                }
    except urllib.error.HTTPError as e:
        wall_ms = (time.time() - start) * 1000.0
        body = e.read().decode('utf-8', errors='replace')
        try:
            detail = json.loads(body)
        except:
            detail = body

        if expect_rejection and e.code in [400, 415, 422]:
            return {
                "id": fixture_id,
                "status": "CORRECTLY_REJECTED",
                "http_code": e.code,
                "wall_ms": wall_ms,
                "error": detail.get("error", str(detail)) if isinstance(detail, dict) else str(detail),
                "detail": detail
            }
        else:
            return {
                "id": fixture_id,
                "status": "UNEXPECTED_ERROR",
                "http_code": e.code,
                "wall_ms": wall_ms,
                "error": str(detail)
            }


def main():
    print("=" * 60, flush=True)
    print(f"MACRO NEGATIVE-EXECUTION CANARY (Run ID: {RUN_ID})", flush=True)
    print("=" * 60, flush=True)
    print(flush=True)

    # Pre-run R2 inspection
    insp_url = f"{INSPECT_ENDPOINT}?runId={RUN_ID}"
    insp_req = urllib.request.Request(insp_url, headers={
        "Authorization": f"Bearer {BEARER_TOKEN}",
        "User-Agent": "FileKitMacroCanary/1.0"
    })
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        print(f"Pre-run R2 inspection: {insp['remainingObjectCount']} objects", flush=True)

    results = []

    # ── TEST 1: XLSX with vbaProject.bin via octet-stream ──
    print("\n── Test 1: XLSX with vbaProject.bin (via application/octet-stream) ──", flush=True)
    xlsx_vba = build_xlsx_with_vba_project()
    r1 = submit_fixture(
        "macro_xlsx_vba_octet_stream",
        xlsx_vba,
        "application/octet-stream",
        "canary_workbook.xlsx",
        expect_rejection=True
    )
    results.append(r1)
    print(f"  Result: {r1['status']} (HTTP {r1['http_code']}, {r1.get('error', '-')})", flush=True)

    # ── TEST 2: XLSX with vbaProject.bin via spreadsheet MIME ──
    print("\n── Test 2: XLSX with vbaProject.bin (via spreadsheet MIME) ──", flush=True)
    r2 = submit_fixture(
        "macro_xlsx_vba_spreadsheet_mime",
        xlsx_vba,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "canary_workbook.xlsx",
        expect_rejection=True
    )
    results.append(r2)
    print(f"  Result: {r2['status']} (HTTP {r2['http_code']}, {r2.get('error', '-')})", flush=True)

    # ── TEST 3: OLE2 .xls with _VBA_PROJECT stream ──
    print("\n── Test 3: OLE2 binary with _VBA_PROJECT stream (via octet-stream) ──", flush=True)
    ole2_vba = build_ole2_with_vba_stream()
    r3 = submit_fixture(
        "macro_ole2_vba_project_stream",
        ole2_vba,
        "application/octet-stream",
        "canary_legacy.xls",
        expect_rejection=True
    )
    results.append(r3)
    print(f"  Result: {r3['status']} (HTTP {r3['http_code']}, {r3.get('error', '-')})", flush=True)

    # ── TEST 4: PPTX with vbaProject.bin ──
    print("\n── Test 4: PPTX with vbaProject.bin (via presentation MIME) ──", flush=True)
    pptx_vba = build_pptx_with_vba_project()
    r4 = submit_fixture(
        "macro_pptx_vba_project",
        pptx_vba,
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "canary_deck.pptx",
        expect_rejection=True
    )
    results.append(r4)
    print(f"  Result: {r4['status']} (HTTP {r4['http_code']}, {r4.get('error', '-')})", flush=True)

    # ── TEST 5: .xlsm extension rejection ──
    print("\n── Test 5: .xlsm extension (format rejection before magic bytes) ──", flush=True)
    r5 = submit_fixture(
        "macro_xlsm_extension",
        xlsx_vba,  # content doesn't matter, extension triggers first
        "application/octet-stream",
        "canary_macro.xlsm",
        expect_rejection=True
    )
    results.append(r5)
    print(f"  Result: {r5['status']} (HTTP {r5['http_code']}, {r5.get('error', '-')})", flush=True)

    # ── TEST 6: .pptm extension rejection ──
    print("\n── Test 6: .pptm extension (format rejection before magic bytes) ──", flush=True)
    r6 = submit_fixture(
        "macro_pptm_extension",
        pptx_vba,
        "application/octet-stream",
        "canary_macro.pptm",
        expect_rejection=True
    )
    results.append(r6)
    print(f"  Result: {r6['status']} (HTTP {r6['http_code']}, {r6.get('error', '-')})", flush=True)

    # Post-run R2 inspection
    print("\n── Post-run R2 inspection ──", flush=True)
    with urllib.request.urlopen(insp_req) as r:
        insp = json.loads(r.read().decode('utf-8'))
        post_orphan = insp['remainingObjectCount']
        print(f"  Remaining objects: {post_orphan} (Target: 0)", flush=True)

    # Summary
    correct_rejections = sum(1 for r in results if r['status'] == 'CORRECTLY_REJECTED')
    unexpected = [r for r in results if r['status'] != 'CORRECTLY_REJECTED']

    print("\n" + "=" * 60, flush=True)
    print("MACRO NEGATIVE-EXECUTION CANARY SUMMARY", flush=True)
    print("=" * 60, flush=True)
    print(f"Total fixtures:         {len(results)}", flush=True)
    print(f"Correctly rejected:     {correct_rejections}/{len(results)}", flush=True)
    print(f"Retained R2 objects:    {post_orphan}", flush=True)

    if unexpected:
        print(f"\nUNEXPECTED RESULTS:", flush=True)
        for u in unexpected:
            print(f"  {u['id']}: {u['status']} (HTTP {u['http_code']})", flush=True)

    all_rejected = correct_rejections == len(results)
    zero_retention = post_orphan == 0

    print(flush=True)
    print("REJECTION DEFENSE SUMMARY:", flush=True)
    print(f"  KNOWN_MACRO_INPUTS_REJECTED:     {'PASSED' if all_rejected else 'FAILED'}", flush=True)
    print(f"  AUTOMATIC_ZERO_RETENTION:        {'PASSED' if zero_retention else 'FAILED'}", flush=True)

    if all_rejected and zero_retention:
        print(f"\nMACRO_NEGATIVE_EXECUTION_CANARY:   PASSED (preflight rejection layer)", flush=True)
        print("  Note: All macro fixtures were rejected at the preflight layer", flush=True)
        print("  before reaching LibreOffice. Container filesystem marker-file", flush=True)
        print("  inspection requires the instrumented container image (Phase 1).", flush=True)
    else:
        print(f"\nMACRO_NEGATIVE_EXECUTION_CANARY:   FAILED", flush=True)

    print("=" * 60, flush=True)

    # Save results
    summary = {
        "runId": RUN_ID,
        "totalFixtures": len(results),
        "correctRejections": correct_rejections,
        "retainedObjects": post_orphan,
        "results": results,
        "status": "PASSED_PREFLIGHT_LAYER" if (all_rejected and zero_retention) else "FAILED"
    }
    with open("macro_canary_results.json", "w") as f:
        json.dump(summary, f, indent=2)


if __name__ == "__main__":
    main()
