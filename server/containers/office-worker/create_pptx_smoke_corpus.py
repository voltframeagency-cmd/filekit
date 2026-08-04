import zipfile
import io

def build_openxml_pptx(title="Slide Deck", num_slides=3, text_prefix="Slide", include_vba=False, include_encrypted=False, missing_part=None, custom_strings=None, include_speaker_notes=False):
    if include_encrypted:
        buf = io.BytesIO()
        buf.write(b'PK\x03\x04')
        buf.write(b'<EncryptedPackage xmlns="http://schemas.microsoft.com/office/2006/encryption"/>')
        return buf.getvalue()

    content_types_slides = ""
    presentation_slides = ""
    presentation_rels = ""

    for s in range(1, num_slides + 1):
        content_types_slides += f'  <Override PartName="/ppt/slides/slide{s}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>\n'
        presentation_slides += f'    <p:sldId id="{255 + s}" r:id="rId{s}"/>\n'
        presentation_rels += f'  <Relationship Id="rId{s}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{s}.xml"/>\n'

    content_types = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
{content_types_slides}</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>'''

    presentation = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
{presentation_slides}  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>'''

    presentation_rels_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{presentation_rels}</Relationships>'''

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        if missing_part != '[Content_Types].xml':
            zf.writestr('[Content_Types].xml', content_types)
        if missing_part != '_rels/.rels':
            zf.writestr('_rels/.rels', rels)
        if missing_part != 'ppt/presentation.xml':
            zf.writestr('ppt/presentation.xml', presentation)
        if missing_part != 'ppt/_rels/presentation.xml.rels':
            zf.writestr('ppt/_rels/presentation.xml.rels', presentation_rels_xml)

        if include_vba:
            zf.writestr('ppt/vbaProject.bin', b'PROHIBITED_VBA_MACRO_STREAM_MARKER')

        for s in range(1, num_slides + 1):
            slide_text = f"{text_prefix} {s}: {title}"
            if custom_strings and (s - 1) < len(custom_strings):
                slide_text = custom_strings[s - 1]

            slide_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr/>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title {s}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>{slide_text}</a:t></a:r></a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>'''
            zf.writestr(f'ppt/slides/slide{s}.xml', slide_xml)

    return buf.getvalue()


def generate_pptx_smoke_corpus():
    """Generate a small PowerPoint smoke test corpus (10 fixtures)."""
    fixtures = []

    # 3 Simple presentations
    for i in range(1, 4):
        fixtures.append({
            "id": f"pptx_simple_{i:02d}",
            "class": "SIMPLE_PRESENTATION",
            "expect_valid": True,
            "filename": f"simple_deck_{i}.pptx",
            "data": build_openxml_pptx(title=f"Simple Deck {i}", num_slides=3 + i, text_prefix=f"Slide{i}")
        })

    # 2 Many-slide presentations
    for i in range(1, 3):
        fixtures.append({
            "id": f"pptx_many_slides_{i:02d}",
            "class": "MANY_SLIDES",
            "expect_valid": True,
            "filename": f"many_slides_{i}.pptx",
            "data": build_openxml_pptx(title=f"Many Slides {i}", num_slides=10 + (i * 5), text_prefix=f"BigDeck{i}")
        })

    # 2 Multilingual presentations
    multilingual = [
        ["日本語プレゼン", "スライド1", "スライド2"],
        ["العرض العربي", "الشريحة الأولى", "الشريحة الثانية"]
    ]
    for i, strings in enumerate(multilingual, 1):
        fixtures.append({
            "id": f"pptx_multilingual_{i:02d}",
            "class": "MULTILINGUAL",
            "expect_valid": True,
            "filename": f"multilingual_{i}.pptx",
            "data": build_openxml_pptx(title=strings[0], num_slides=len(strings), custom_strings=strings)
        })

    # 3 Invalid / Adversarial
    fixtures.append({
        "id": "pptx_adv_01_macro_pptm",
        "class": "INVALID_ADVERSARIAL",
        "expect_valid": False,
        "expected_code": 422,
        "filename": "malicious.pptm",
        "data": build_openxml_pptx(),
        "description": "Disallowed .pptm filename header"
    })
    fixtures.append({
        "id": "pptx_adv_02_vba_project",
        "class": "INVALID_ADVERSARIAL",
        "expect_valid": False,
        "expected_code": 422,
        "filename": "vba_deck.pptx",
        "data": build_openxml_pptx(include_vba=True),
        "description": "OpenXML PPTX containing vbaProject.bin"
    })
    fixtures.append({
        "id": "pptx_adv_03_missing_presentation",
        "class": "INVALID_ADVERSARIAL",
        "expect_valid": False,
        "expected_code": 422,
        "filename": "broken_deck.pptx",
        "data": build_openxml_pptx(missing_part='ppt/presentation.xml'),
        "description": "OpenXML PPTX missing ppt/presentation.xml"
    })

    return fixtures


if __name__ == "__main__":
    corp = generate_pptx_smoke_corpus()
    print(f"Successfully generated PowerPoint smoke corpus ({len(corp)} fixtures).")
    valid_cnt = sum(1 for f in corp if f["expect_valid"])
    invalid_cnt = sum(1 for f in corp if not f["expect_valid"])
    print(f"Valid presentations: {valid_cnt}, Invalid/Adversarial: {invalid_cnt}")
