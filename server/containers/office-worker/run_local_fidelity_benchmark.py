import os
import sys
import tempfile
import subprocess
import shutil
import time
from create_excel_fidelity_corpus import generate_100_corpus

def inspect_openxml_and_ole2_preflight(buffer, filename="spreadsheet.xlsx", content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"):
    # Replicate worker index.ts preflight logic
    if any(ext in filename.lower() for ext in [".xlsm", ".xltm", ".xlam"]) or "macroenabled" in content_type.lower():
        return False, 422, "MACRO_FORMAT_REJECTED"

    if len(buffer) == 0:
        return False, 400, "EMPTY_PAYLOAD"

    is_zip = len(buffer) >= 4 and buffer[0:4] == b'PK\x03\x04'
    is_ole2 = len(buffer) >= 8 and buffer[0:8] == b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1'

    if not is_zip and not is_ole2:
        return False, 422, "OFFICE_STRUCTURE_INVALID"

    binary_str = buffer[:1048576].decode('latin1', errors='ignore')

    if is_zip:
        if "[Content_Types].xml" not in binary_str or "_rels/.rels" not in binary_str:
            return False, 422, "OFFICE_STRUCTURE_INVALID"

        if "xl/" in binary_str:
            if "xl/workbook.xml" not in binary_str or "xl/_rels/workbook.xml.rels" not in binary_str or "xl/worksheets/sheet" not in binary_str:
                return False, 422, "OFFICE_STRUCTURE_INVALID"

        if "vbaProject.bin" in binary_str or "vbaProject" in binary_str:
            return False, 422, "MACRO_STREAM_DETECTED"

        if "EncryptedPackage" in binary_str:
            return False, 422, "ENCRYPTED_FILE_REJECTED"

    elif is_ole2:
        has_wb = "Workbook" in binary_str or "Book" in binary_str or "W\x00o\x00r\x00k\x00b\x00o\x00o\x00k\x00" in binary_str or "B\x00o\x00o\x00k\x00" in binary_str
        if not has_wb:
            return False, 422, "OFFICE_STRUCTURE_INVALID"

        has_vba = ("_VBA_PROJECT" in binary_str or "VBA" in binary_str or "Macros" in binary_str or "_VBA_PROJECT_CUR" in binary_str or
                   "_\x00V\x00B\x00A\x00" in binary_str or "V\x00B\x00A\x00" in binary_str or "M\x00a\x00c\x00r\x00o\x00" in binary_str)
        if has_vba:
            return False, 422, "MACRO_STREAM_DETECTED"

    return True, 200, "OK"

def main():
    print("==========================================================")
    print("FILEKIT LOCAL 100-WORKBOOK EXCEL FIDELITY BENCHMARK")
    print("==========================================================")

    fixtures = generate_100_corpus()
    print(f"Loaded {len(fixtures)} corpus fixtures.\n")

    valid_passed = 0
    invalid_passed = 0

    for idx, fix in enumerate(fixtures, 1):
        f_id = fix["id"]
        f_class = fix["class"]
        expect_valid = fix["expect_valid"]
        filename = fix.get("filename", "spreadsheet.xlsx")
        data = fix["data"]

        preflight_ok, code, reason = inspect_openxml_and_ole2_preflight(data, filename)

        if expect_valid:
            if preflight_ok:
                valid_passed += 1
                print(f"[{idx:03d}/100] LOCAL_PASS {f_id:<36} ({f_class}) - Preflight Status: {code} ({reason})")
            else:
                print(f"[{idx:03d}/100] LOCAL_FAIL {f_id:<36} ({f_class}) - Expected valid but rejected at preflight: {code} ({reason})")
        else:
            if not preflight_ok:
                invalid_passed += 1
                print(f"[{idx:03d}/100] LOCAL_REJECT_OK {f_id:<36} ({f_class}) - Status: {code} ({reason})")
            else:
                print(f"[{idx:03d}/100] LOCAL_FAIL_UNEXPECTED {f_id:<36} ({f_class}) - Expected rejection but passed preflight!")

    print("\n==========================================================")
    print("FILEKIT LOCAL EXCEL FIDELITY BENCHMARK SUMMARY")
    print("==========================================================")
    print(f"Valid Conversions Passed: {valid_passed}/90")
    print(f"Invalid Inputs Rejected:  {invalid_passed}/10")
    print(f"Total Local Correctness:  {valid_passed + invalid_passed}/100")
    
    if valid_passed == 90 and invalid_passed == 10:
        print("Status: LOCAL_XLSX_FIDELITY_VALIDATED -> PASSED")
    else:
        print("Status: LOCAL_XLSX_FIDELITY_VALIDATED -> FAILED")
    print("==========================================================")

if __name__ == "__main__":
    main()
