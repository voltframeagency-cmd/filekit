import zipfile
import io

def create_xlsx_bytes(title="Excel Canary Sheet", rows=5, columns=3, num_sheets=1, text_prefix="Data"):
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
        zf.writestr('[Content_Types].xml', content_types)
        zf.writestr('_rels/.rels', rels)
        zf.writestr('xl/workbook.xml', workbook)
        zf.writestr('xl/_rels/workbook.xml.rels', workbook_rels_xml)

        for s in range(1, num_sheets + 1):
            sheet_rows = ""
            # Header Row
            sheet_rows += f'<row r="1">'
            for c in range(1, columns + 1):
                col_name = chr(64 + c)
                sheet_rows += f'<c r="{col_name}1" t="inlineStr"><is><t>{title} Col {col_name}</t></is></c>'
            sheet_rows += f'</row>'

            # Data Rows
            for r in range(2, rows + 2):
                sheet_rows += f'<row r="{r}">'
                for c in range(1, columns + 1):
                    col_name = chr(64 + c)
                    val = f"{text_prefix}_{s}_{r}_{c}"
                    sheet_rows += f'<c r="{col_name}{r}" t="inlineStr"><is><t>{val}</t></is></c>'
                sheet_rows += f'</row>'

            sheet_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
{sheet_rows}  </sheetData>
</worksheet>'''
            zf.writestr(f'xl/worksheets/sheet{s}.xml', sheet_xml)

    return buf.getvalue()

if __name__ == "__main__":
    b = create_xlsx_bytes("Sample Workbook", rows=3, columns=3, num_sheets=2)
    with open("sample_excel_canary.xlsx", "wb") as f:
        f.write(b)
    print(f"Generated sample_excel_canary.xlsx ({len(b)} bytes)")
