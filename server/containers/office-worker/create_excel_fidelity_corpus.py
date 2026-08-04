import zipfile
import io

def build_openxml_xlsx(title="Worksheet", rows=5, columns=4, num_sheets=1, text_prefix="Data", orientation=None, include_chart=False, include_vba=False, include_encrypted=False, missing_part=None, custom_strings=None):
    if include_encrypted:
        buf = io.BytesIO()
        buf.write(b'PK\x03\x04')
        buf.write(b'<EncryptedPackage xmlns="http://schemas.microsoft.com/office/2006/encryption"/>')
        return buf.getvalue()

    content_types_sheets = ""
    workbook_sheets = ""
    workbook_rels = ""
    
    for s in range(1, num_sheets + 1):
        content_types_sheets += f'  <Override PartName="/xl/worksheets/sheet{s}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\n'
        workbook_sheets += f'    <sheet name="Sheet{s}" sheetId="{s}" r:id="rId{s}"/>\n'
        workbook_rels += f'  <Relationship Id="rId{s}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{s}.xml"/>\n'

    content_types = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
{content_types_sheets}</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

    workbook = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
{workbook_sheets}  </sheets>
</workbook>'''

    workbook_rels_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{workbook_rels}</Relationships>'''

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        if missing_part != '[Content_Types].xml':
            zf.writestr('[Content_Types].xml', content_types)
        if missing_part != '_rels/.rels':
            zf.writestr('_rels/.rels', rels)
        if missing_part != 'xl/workbook.xml':
            zf.writestr('xl/workbook.xml', workbook)
        if missing_part != 'xl/_rels/workbook.xml.rels':
            zf.writestr('xl/_rels/workbook.xml.rels', workbook_rels_xml)

        if include_vba:
            zf.writestr('xl/vbaProject.bin', b'PROHIBITED_VBA_MACRO_STREAM_MARKER')

        for s in range(1, num_sheets + 1):
            sheet_rows = ""
            # Header Row
            sheet_rows += f'<row r="1">'
            for c in range(1, columns + 1):
                col_name = chr(65 + ((c - 1) % 26)) if c <= 26 else f"A{chr(65 + ((c - 1) % 26))}"
                header_text = f"{title} Col {c}"
                if custom_strings and (c - 1) < len(custom_strings):
                    header_text = custom_strings[c - 1]
                sheet_rows += f'<c r="{col_name}1" t="inlineStr"><is><t>{header_text}</t></is></c>'
            sheet_rows += f'</row>'

            # Data Rows
            for r in range(2, rows + 2):
                sheet_rows += f'<row r="{r}">'
                for c in range(1, columns + 1):
                    col_name = chr(65 + ((c - 1) % 26)) if c <= 26 else f"A{chr(65 + ((c - 1) % 26))}"
                    if include_chart and c == columns:
                        sheet_rows += f'<c r="{col_name}{r}"><f>SUM(A{r}:B{r})</f><v>{r * 100}</v></c>'
                    elif r % 2 == 0:
                        sheet_rows += f'<c r="{col_name}{r}"><v>{(s * 1000) + (r * 10) + c}</v></c>'
                    else:
                        val = f"{text_prefix}_S{s}_R{r}_C{c}"
                        if custom_strings and (r - 2) < len(custom_strings):
                            val = custom_strings[(r - 2) % len(custom_strings)]
                        sheet_rows += f'<c r="{col_name}{r}" t="inlineStr"><is><t>{val}</t></is></c>'
                sheet_rows += f'</row>'

            page_setup = f'<pageSetup orientation="{orientation}"/>' if orientation else ''
            chart_drawing = '<drawing r:id="rIdChart1"/>' if include_chart else ''

            sheet_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheetData>
{sheet_rows}  </sheetData>
  {chart_drawing}
  {page_setup}
</worksheet>'''
            zf.writestr(f'xl/worksheets/sheet{s}.xml', sheet_xml)

    return buf.getvalue()

def build_ole2_xls(include_workbook=True, include_vba=False):
    buf = io.BytesIO()
    buf.write(b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1')
    buf.write(b'\x00' * 504) # Header padding
    
    dir_sector = io.BytesIO()
    
    # Root Entry
    dir_sector.write("Root Entry".encode('utf-16le') + b'\x00' * (64 - len("Root Entry".encode('utf-16le'))))
    dir_sector.write(b'\x00' * 64)
    
    if include_workbook:
        wb_name = "Workbook".encode('utf-16le')
        dir_sector.write(wb_name + b'\x00' * (64 - len(wb_name)))
        dir_sector.write(b'\x00' * 64)
    else:
        doc_name = "WordDocument".encode('utf-16le')
        dir_sector.write(doc_name + b'\x00' * (64 - len(doc_name)))
        dir_sector.write(b'\x00' * 64)

    if include_vba:
        vba_name = "_VBA_PROJECT".encode('utf-16le')
        dir_sector.write(vba_name + b'\x00' * (64 - len(vba_name)))
        dir_sector.write(b'\x00' * 64)

    buf.write(dir_sector.getvalue())
    return buf.getvalue()

def generate_100_corpus():
    fixtures = []

    # Class 1: Simple Tables (20 workbooks)
    for i in range(1, 21):
        fixtures.append({
            "id": f"xlsx_simple_{i:02d}",
            "class": "SIMPLE_TABLES",
            "expect_valid": True,
            "filename": f"simple_table_{i}.xlsx",
            "data": build_openxml_xlsx(title=f"Simple Table {i}", rows=5 + (i % 5), columns=4, text_prefix=f"Val{i}")
        })

    # Class 2: Multi-Sheet Workbooks (20 workbooks)
    for i in range(1, 21):
        num_sheets = 2 + (i % 7) # 2 to 8 sheets
        fixtures.append({
            "id": f"xlsx_multisheet_{i:02d}",
            "class": "MULTI_SHEETS",
            "expect_valid": True,
            "filename": f"multisheet_{i}.xlsx",
            "data": build_openxml_xlsx(title=f"MultiSheet {i}", rows=8, columns=4, num_sheets=num_sheets, text_prefix=f"Multi{i}")
        })

    # Class 3: Wide Worksheets (15 workbooks)
    for i in range(1, 16):
        num_cols = 15 + (i * 2) # 17 to 43 columns
        fixtures.append({
            "id": f"xlsx_widesheet_{i:02d}",
            "class": "WIDE_SHEETS",
            "expect_valid": True,
            "filename": f"widesheet_{i}.xlsx",
            "data": build_openxml_xlsx(title=f"Wide Sheet {i}", rows=6, columns=num_cols, text_prefix=f"WCol{i}")
        })

    # Class 4: Charts and Formulas (15 workbooks)
    for i in range(1, 16):
        fixtures.append({
            "id": f"xlsx_charts_formulas_{i:02d}",
            "class": "CHARTS_FORMULAS",
            "expect_valid": True,
            "filename": f"chart_formula_{i}.xlsx",
            "data": build_openxml_xlsx(title=f"Chart Formula {i}", rows=10, columns=5, include_chart=True, text_prefix=f"Calc{i}")
        })

    # Class 5: Print Areas & Orientation (10 workbooks)
    for i in range(1, 11):
        orientation = "landscape" if i % 2 == 0 else "portrait"
        fixtures.append({
            "id": f"xlsx_print_orient_{i:02d}",
            "class": "PRINT_ORIENTATION",
            "expect_valid": True,
            "filename": f"print_orient_{i}.xlsx",
            "data": build_openxml_xlsx(title=f"Print Orient {i}", rows=12, columns=6, orientation=orientation, text_prefix=f"Print{i}")
        })

    # Class 6: Multilingual (10 workbooks)
    multilingual_samples = [
        ["日本語テスト", "データ_01", "東京", "大阪"],
        ["中文测试", "数据_02", "北京", "上海"],
        ["اختبار اللغة العربية", "بيانات_03", "الرياض", "دبي"],
        ["Тестовая таблица", "Данные_04", "Москва", "СПб"],
        ["Tableau Français", "Données_05", "Paris", "Lyon"],
        ["Deutscher Test", "Daten_06", "München", "Berlin"],
        ["Tabela Portuguesa", "Dados_07", "Lisboa", "Porto"],
        ["Prueba en Español", "Datos_08", "Madrid", "Barcelona"],
        ["한국어 테스트", "데이터_09", "서울", "부산"],
        ["Türkçe Tablo", "Veri_10", "İstanbul", "Ankara"]
    ]
    for i in range(1, 11):
        strings = multilingual_samples[i - 1]
        fixtures.append({
            "id": f"xlsx_multilingual_{i:02d}",
            "class": "MULTILINGUAL",
            "expect_valid": True,
            "filename": f"multilingual_{i}.xlsx",
            "data": build_openxml_xlsx(title=strings[0], rows=5, columns=4, custom_strings=strings)
        })

    # Class 7: Invalid & Adversarial (10 workbooks)
    adversarial_cases = [
        {"id": "xlsx_adv_01_corrupted_zip", "expected_code": 422, "data": b"INVALID_CORRUPTED_NON_ZIP_BYTES", "desc": "Corrupted non-ZIP bytes"},
        {"id": "xlsx_adv_02_macro_xlsm", "expected_code": 422, "data": build_openxml_xlsx(include_vba=True), "desc": "OpenXML containing vbaProject.bin"},
        {"id": "xlsx_adv_03_missing_workbook_xml", "expected_code": 422, "data": build_openxml_xlsx(missing_part='xl/workbook.xml'), "desc": "OpenXML missing xl/workbook.xml"},
        {"id": "xlsx_adv_04_missing_content_types", "expected_code": 422, "data": build_openxml_xlsx(missing_part='[Content_Types].xml'), "desc": "OpenXML missing [Content_Types].xml"},
        {"id": "xlsx_adv_05_ole2_non_excel", "expected_code": 422, "data": build_ole2_xls(include_workbook=False), "desc": "OLE2 binary lacking Workbook stream"},
        {"id": "xlsx_adv_06_ole2_vba_macro", "expected_code": 422, "data": build_ole2_xls(include_workbook=True, include_vba=True), "desc": "OLE2 binary with _VBA_PROJECT stream"},
        {"id": "xlsx_adv_07_encrypted_package", "expected_code": 422, "data": build_openxml_xlsx(include_encrypted=True), "desc": "Encrypted OpenXML Package"},
        {"id": "xlsx_adv_08_disallowed_extension", "expected_code": 422, "filename": "malicious.xlsm", "data": build_openxml_xlsx(), "desc": "Disallowed .xlsm filename header"},
        {"id": "xlsx_adv_09_empty_payload", "expected_code": 400, "data": b"", "desc": "Empty 0-byte payload"},
        {"id": "xlsx_adv_10_truncated_zip", "expected_code": 422, "data": build_openxml_xlsx()[:100], "desc": "Truncated ZIP header"}
    ]

    for adv in adversarial_cases:
        fixtures.append({
            "id": adv["id"],
            "class": "INVALID_ADVERSARIAL",
            "expect_valid": False,
            "expected_code": adv.get("expected_code", 422),
            "filename": adv.get("filename", "adversarial_file.xlsx"),
            "data": adv["data"],
            "description": adv["desc"]
        })

    return fixtures

if __name__ == "__main__":
    corp = generate_100_corpus()
    print(f"Successfully generated 100-workbook fidelity corpus ({len(corp)} fixtures).")
    valid_cnt = sum(1 for f in corp if f["expect_valid"])
    invalid_cnt = sum(1 for f in corp if not f["expect_valid"])
    print(f"Valid workbooks: {valid_cnt}, Invalid/Adversarial workbooks: {invalid_cnt}")
