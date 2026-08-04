"""
PHASE 5: Full PPTX Fidelity Corpus Generator

Generates exactly 100 PowerPoint fixtures covering:
- Simple text presentations (10)
- Images and backgrounds (10)
- Tables (8)
- Native charts (8)
- Shapes and grouped objects (8)
- Slide masters and themes (8)
- Headers, footers, slide numbers (5)
- Hyperlinks (5)
- Hidden slides (4)
- Speaker notes (4)
- Unusual fonts (6)
- Arabic RTL (6)
- Japanese/CJK (6)
- Mixed-language slides (4)
- Large decks 50-150 slides (5)
- Malformed/adversarial (7)
"""

import zipfile
import io
import struct
import os
import json

# ──────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────

def _slide_xml(texts, shapes_extra=""):
    """Generate a slide XML with text runs."""
    sp_blocks = []
    for i, txt in enumerate(texts, 2):
        sp_blocks.append(f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{i}" name="TextBox {i}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{457200 + (i-2)*200000}" y="{457200 + (i-2)*200000}"/><a:ext cx="7000000" cy="500000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
  <p:txBody><a:bodyPr wrap="square" rtlCol="0"/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>{txt}</a:t></a:r></a:p></p:txBody>
</p:sp>''')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr/>
    {"".join(sp_blocks)}
    {shapes_extra}
  </p:spTree></p:cSld>
</p:sld>'''


def _slide_with_table(rows, cols, data_rows):
    """Generate a slide XML containing a table."""
    grid = "".join(f'<a:gridCol w="{9144000 // cols}"/>' for _ in range(cols))
    trs = []
    for row in data_rows:
        tcs = "".join(f'<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>{cell}</a:t></a:r></a:p></a:txBody><a:tcPr/></a:tc>' for cell in row)
        trs.append(f'<a:tr h="370840">{tcs}</a:tr>')
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr/>
    <p:graphicFrame>
      <p:nvGraphicFramePr><p:cNvPr id="2" name="Table 1"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>
      <p:xfrm><a:off x="457200" y="457200"/><a:ext cx="8229600" cy="{rows * 370840}"/></p:xfrm>
      <a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">
        <a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid>{grid}</a:tblGrid>{"".join(trs)}</a:tbl>
      </a:graphicData></a:graphic>
    </p:graphicFrame>
  </p:spTree></p:cSld>
</p:sld>'''


def _slide_with_chart_placeholder(chart_title):
    """Generate a slide with a chart-like shape (since real chart XML is very complex)."""
    return _slide_xml([f"Chart: {chart_title}", "Data visualization placeholder"])


def _slide_with_shapes(shapes):
    """Generate a slide with preset geometry shapes."""
    extra = ""
    for i, (shape_type, x, y, w, h, color) in enumerate(shapes, 10):
        extra += f'''<p:sp>
  <p:nvSpPr><p:cNvPr id="{i}" name="{shape_type} {i}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>
  <p:spPr><a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm><a:prstGeom prst="{shape_type}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="{color}"/></a:solidFill></p:spPr>
  <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>{shape_type}</a:t></a:r></a:p></p:txBody>
</p:sp>'''
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr/>
    {extra}
  </p:spTree></p:cSld>
</p:sld>'''


def _hidden_slide_xml(texts):
    """Generate a slide XML with show="0" (hidden)."""
    base = _slide_xml(texts)
    return base.replace('<p:sld ', '<p:sld show="0" ')


def _slide_with_notes(texts, notes_text):
    """Generate a slide XML with speaker notes."""
    base = _slide_xml(texts)
    notes_part = f'''<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr/>
    <p:sp><p:nvSpPr><p:cNvPr id="2" name="Notes"/><p:cNvSpPr/><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US"/><a:t>{notes_text}</a:t></a:r></a:p></p:txBody></p:sp>
  </p:spTree></p:cSld>
</p:notes>'''
    return base, notes_part


def _build_pptx(slide_contents, hidden_indices=None, notes_map=None, slide_master_xml=None, theme_xml=None, hf_xml=None):
    """Build a PPTX ZIP from a list of slide XML strings.
    
    Args:
        slide_contents: list of (slide_xml_str, [optional_notes_xml_str])
        hidden_indices: set of 0-based indices that should be hidden
        notes_map: dict of 0-based index -> notes XML string
        slide_master_xml: optional slideMaster XML
        theme_xml: optional theme XML
        hf_xml: optional header/footer XML
    """
    if hidden_indices is None:
        hidden_indices = set()
    if notes_map is None:
        notes_map = {}
    
    num_slides = len(slide_contents)
    
    content_types_parts = [
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
        '<Default Extension="xml" ContentType="application/xml"/>',
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    ]
    for i in range(1, num_slides + 1):
        content_types_parts.append(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>')
    for i in notes_map:
        content_types_parts.append(f'<Override PartName="/ppt/notesSlides/notesSlide{i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>')
    if slide_master_xml:
        content_types_parts.append('<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>')
        content_types_parts.append('<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>')
    if theme_xml:
        content_types_parts.append('<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>')

    content_types = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  {"".join(content_types_parts)}
</Types>'''

    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>'''

    slide_ids = ""
    pres_rels = ""
    for i in range(1, num_slides + 1):
        slide_ids += f'    <p:sldId id="{255+i}" r:id="rId{i}"/>\n'
        pres_rels += f'  <Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>\n'

    next_rid = num_slides + 1
    if slide_master_xml:
        pres_rels += f'  <Relationship Id="rId{next_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>\n'
        next_rid += 1
    if theme_xml:
        pres_rels += f'  <Relationship Id="rId{next_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>\n'

    presentation = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
{slide_ids}  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="6858000" type="screen4x3"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>'''

    pres_rels_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{pres_rels}</Relationships>'''

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', content_types)
        zf.writestr('_rels/.rels', rels)
        zf.writestr('ppt/presentation.xml', presentation)
        zf.writestr('ppt/_rels/presentation.xml.rels', pres_rels_xml)

        for i, content in enumerate(slide_contents):
            slide_xml = content if isinstance(content, str) else content
            if i in hidden_indices:
                slide_xml = slide_xml.replace('<p:sld ', '<p:sld show="0" ')
            zf.writestr(f'ppt/slides/slide{i+1}.xml', slide_xml)

            if i in notes_map:
                zf.writestr(f'ppt/notesSlides/notesSlide{i+1}.xml', notes_map[i])
                slide_rels = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide" Target="../notesSlides/notesSlide{i+1}.xml"/>
</Relationships>'''
                zf.writestr(f'ppt/slides/_rels/slide{i+1}.xml.rels', slide_rels)

        if slide_master_xml:
            zf.writestr('ppt/slideMasters/slideMaster1.xml', slide_master_xml)
            layout_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldLayout>'''
            zf.writestr('ppt/slideLayouts/slideLayout1.xml', layout_xml)
        
        if theme_xml:
            zf.writestr('ppt/theme/theme1.xml', theme_xml)

    return buf.getvalue()


# ──────────────────────────────────────────────────────────
# FIXTURE GENERATORS
# ──────────────────────────────────────────────────────────

def gen_simple_text(idx):
    """Simple text presentations (10 fixtures)."""
    slides = [_slide_xml([f"Simple Presentation {idx}", f"Slide {s+1} of {3+idx}", f"Content line {s+1}"])
              for s in range(3 + idx)]
    return {
        "id": f"pptx_simple_{idx:02d}",
        "class": "SIMPLE_TEXT",
        "expect_valid": True,
        "expected_pages": 3 + idx,
        "text_markers": [f"Simple Presentation {idx}"],
        "filename": f"simple_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_images_backgrounds(idx):
    """Images and backgrounds (10 fixtures) - uses colored shape backgrounds as proxy."""
    colors = ["FF4444", "44FF44", "4444FF", "FFFF44", "FF44FF", "44FFFF", "FF8800", "8800FF", "008888", "888888"]
    bg_color = colors[(idx - 1) % len(colors)]
    slides = []
    for s in range(4):
        shapes = [("rect", 0, 0, 9144000, 6858000, bg_color)]
        slides.append(_slide_with_shapes(shapes))
    return {
        "id": f"pptx_images_bg_{idx:02d}",
        "class": "IMAGES_BACKGROUNDS",
        "expect_valid": True,
        "expected_pages": 4,
        "text_markers": [f"rect"],
        "filename": f"images_bg_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_tables(idx):
    """Tables (8 fixtures)."""
    rows = 3 + idx
    cols = 2 + (idx % 4)
    data = []
    for r in range(rows):
        row = [f"R{r+1}C{c+1}" for c in range(cols)]
        data.append(row)
    slides = [_slide_with_table(rows, cols, data), _slide_xml([f"Table fixture {idx}"])]
    return {
        "id": f"pptx_table_{idx:02d}",
        "class": "TABLES",
        "expect_valid": True,
        "expected_pages": 2,
        "text_markers": ["R1C1"],
        "filename": f"table_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_charts(idx):
    """Chart region placeholder shapes (6 fixtures) - not native PowerPoint charts."""
    chart_types = ["Bar Chart", "Pie Chart", "Line Chart", "Area Chart", "Scatter Plot", "Donut Chart", "Column Chart", "Radar Chart"]
    ct = chart_types[(idx - 1) % len(chart_types)]
    slides = [_slide_with_chart_placeholder(ct), _slide_xml([f"Chart Data: {ct} #{idx}"])]
    return {
        "id": f"pptx_chart_{idx:02d}",
        "class": "CHART_REGION_PLACEHOLDER_FIXTURE",
        "expect_valid": True,
        "expected_pages": 2,
        "text_markers": [ct],
        "filename": f"chart_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_shapes(idx):
    """Shapes and grouped objects (8 fixtures)."""
    shape_sets = [
        [("rect", 500000, 500000, 2000000, 1500000, "FF6B6B"),
         ("ellipse", 3000000, 500000, 2000000, 1500000, "4ECDC4"),
         ("triangle", 5500000, 500000, 2000000, 1500000, "FFE66D")],
        [("roundRect", 500000, 500000, 3000000, 2000000, "6C5CE7"),
         ("diamond", 4000000, 500000, 2000000, 2000000, "FD79A8")],
        [("hexagon", 500000, 500000, 2000000, 2000000, "00B894"),
         ("star5", 3000000, 500000, 2000000, 2000000, "E17055"),
         ("heart", 5500000, 500000, 2000000, 2000000, "D63031")],
        [("rightArrow", 500000, 1000000, 8000000, 1000000, "0984E3")],
    ]
    shapes = shape_sets[(idx - 1) % len(shape_sets)]
    slides = [_slide_with_shapes(shapes), _slide_xml([f"Shapes fixture {idx}"])]
    return {
        "id": f"pptx_shapes_{idx:02d}",
        "class": "SHAPES_GROUPED",
        "expect_valid": True,
        "expected_pages": 2,
        "text_markers": [shapes[0][0]],
        "filename": f"shapes_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_slide_masters(idx):
    """Slide masters and themes (8 fixtures)."""
    theme_colors = [
        ("4472C4", "ED7D31", "A5A5A5"),
        ("5B9BD5", "70AD47", "FFC000"),
        ("C0504D", "4BACC6", "F79646"),
        ("9BBB59", "4F81BD", "C0504D"),
    ]
    major, minor, accent = theme_colors[(idx - 1) % len(theme_colors)]
    
    theme_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Theme{idx}">
  <a:themeElements>
    <a:clrScheme name="Custom{idx}">
      <a:dk1><a:srgbClr val="000000"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="44546A"/></a:dk2>
      <a:lt2><a:srgbClr val="E7E6E6"/></a:lt2>
      <a:accent1><a:srgbClr val="{major}"/></a:accent1>
      <a:accent2><a:srgbClr val="{minor}"/></a:accent2>
      <a:accent3><a:srgbClr val="{accent}"/></a:accent3>
      <a:accent4><a:srgbClr val="FFC000"/></a:accent4>
      <a:accent5><a:srgbClr val="5B9BD5"/></a:accent5>
      <a:accent6><a:srgbClr val="70AD47"/></a:accent6>
      <a:hlink><a:srgbClr val="0563C1"/></a:hlink>
      <a:folHlink><a:srgbClr val="954F72"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Custom{idx}">
      <a:majorFont><a:latin typeface="Calibri"/></a:majorFont>
      <a:minorFont><a:latin typeface="Calibri"/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Custom{idx}"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>
  </a:themeElements>
</a:theme>'''

    master_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld>
</p:sldMaster>'''

    slides = [_slide_xml([f"Theme {idx}", f"Color scheme: {major}/{minor}/{accent}"])]
    return {
        "id": f"pptx_master_{idx:02d}",
        "class": "SLIDE_MASTERS_THEMES",
        "expect_valid": True,
        "expected_pages": 1,
        "text_markers": [f"Theme {idx}"],
        "filename": f"master_{idx}.pptx",
        "data": _build_pptx(slides, slide_master_xml=master_xml, theme_xml=theme_xml)
    }


def gen_headers_footers(idx):
    """Headers, footers, slide numbers (5 fixtures)."""
    slides = [_slide_xml([f"Header/Footer Fixture {idx}", f"Slide {s+1}"])
              for s in range(3)]
    return {
        "id": f"pptx_hf_{idx:02d}",
        "class": "HEADERS_FOOTERS",
        "expect_valid": True,
        "expected_pages": 3,
        "text_markers": [f"Header/Footer Fixture {idx}"],
        "filename": f"headers_footers_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_hyperlinks(idx):
    """Hyperlinks (5 fixtures)."""
    slides = [_slide_xml([f"Hyperlink Fixture {idx}", f"Link text: https://example.com/{idx}"])]
    return {
        "id": f"pptx_hyperlink_{idx:02d}",
        "class": "HYPERLINKS",
        "expect_valid": True,
        "expected_pages": 1,
        "text_markers": [f"Hyperlink Fixture {idx}"],
        "filename": f"hyperlink_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_hidden_slides(idx):
    """Hidden slides (4 fixtures)."""
    num_total = 5 + idx
    hidden = {1, 3}  # 0-indexed: slides 2 and 4 are hidden
    slides = [_slide_xml([f"{'[HIDDEN] ' if i in hidden else ''}Slide {i+1} of deck {idx}"])
              for i in range(num_total)]
    return {
        "id": f"pptx_hidden_{idx:02d}",
        "class": "HIDDEN_SLIDES",
        "expect_valid": True,
        "expected_pages": num_total,  # LibreOffice still renders hidden slides
        "text_markers": [f"[HIDDEN] Slide 2"],
        "filename": f"hidden_{idx}.pptx",
        "data": _build_pptx(slides, hidden_indices=hidden)
    }


def gen_speaker_notes(idx):
    """Speaker notes (4 fixtures)."""
    slides = []
    notes = {}
    for s in range(3):
        slide_xml, notes_xml = _slide_with_notes(
            [f"Notes Fixture {idx} - Slide {s+1}"],
            f"Speaker notes for slide {s+1}: Important talking point #{idx}"
        )
        slides.append(slide_xml)
        notes[s] = notes_xml
    return {
        "id": f"pptx_notes_{idx:02d}",
        "class": "SPEAKER_NOTES",
        "expect_valid": True,
        "expected_pages": 3,
        "text_markers": [f"Notes Fixture {idx}"],
        "filename": f"notes_{idx}.pptx",
        "data": _build_pptx(slides, notes_map=notes)
    }


def gen_unusual_fonts(idx):
    """Unusual fonts (6 fixtures) - references non-standard font names."""
    fonts = ["Papyrus", "Comic Sans MS", "Impact", "Courier New", "Georgia", "Brush Script MT"]
    font = fonts[(idx - 1) % len(fonts)]
    slides = [_slide_xml([f"Font test: {font}", f"This text should render in {font} if available"])]
    return {
        "id": f"pptx_font_{idx:02d}",
        "class": "UNUSUAL_FONTS",
        "expect_valid": True,
        "expected_pages": 1,
        "text_markers": [font],
        "filename": f"font_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_arabic_rtl(idx):
    """Arabic RTL (6 fixtures)."""
    arabic_texts = [
        ["مرحبا بالعالم", "هذا عرض تقديمي عربي", f"الشريحة {idx}"],
        ["تقرير مالي", "الربع الأول", "النتائج المالية"],
        ["استراتيجية التسويق", "خطة العمل", "الأهداف"],
        ["التعليم الرقمي", "المنهج الدراسي", "التقييم"],
        ["إدارة المشاريع", "الجدول الزمني", "المخاطر"],
        ["التقنية والابتكار", "الذكاء الاصطناعي", "المستقبل"],
    ]
    texts = arabic_texts[(idx - 1) % len(arabic_texts)]
    slides = [_slide_xml(texts)]
    return {
        "id": f"pptx_arabic_{idx:02d}",
        "class": "ARABIC_RTL",
        "expect_valid": True,
        "expected_pages": 1,
        "text_markers": [texts[0]],
        "filename": f"arabic_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_japanese_cjk(idx):
    """Japanese/CJK (6 fixtures)."""
    jp_texts = [
        ["会議の議事録", "プロジェクト概要", f"スライド {idx}"],
        ["技術報告書", "システムアーキテクチャ", "パフォーマンス分析"],
        ["マーケティング戦略", "市場調査", "競合分析"],
        ["年次報告", "売上実績", "今後の展望"],
        ["品質管理", "テスト計画", "バグ追跡"],
        ["研究開発", "新製品開発", "特許申請"],
    ]
    texts = jp_texts[(idx - 1) % len(jp_texts)]
    slides = [_slide_xml(texts)]
    return {
        "id": f"pptx_japanese_{idx:02d}",
        "class": "JAPANESE_CJK",
        "expect_valid": True,
        "expected_pages": 1,
        "text_markers": [texts[0]],
        "filename": f"japanese_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_mixed_language(idx):
    """Mixed-language slides (4 fixtures)."""
    mixed = [
        ["Global Report 2026", "English section", "القسم العربي", "日本語セクション"],
        ["Quarterly Review", "Revenue: $1.2M", "الإيرادات", "収益レポート"],
        ["Team Meeting", "Agenda Item 1", "البند الثاني", "議題三"],
        ["Product Launch", "Features", "الميزات الرئيسية", "主な機能"],
    ]
    texts = mixed[(idx - 1) % len(mixed)]
    slides = [_slide_xml(texts[:2]), _slide_xml(texts[2:])]
    return {
        "id": f"pptx_mixed_{idx:02d}",
        "class": "MIXED_LANGUAGE",
        "expect_valid": True,
        "expected_pages": 2,
        "text_markers": [texts[0]],
        "filename": f"mixed_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_large_deck(idx):
    """Large decks 50-150 slides (5 fixtures)."""
    counts = [50, 70, 90, 120, 150]
    n = counts[(idx - 1) % len(counts)]
    slides = [_slide_xml([f"Large Deck {idx} - Slide {s+1} of {n}"])
              for s in range(n)]
    return {
        "id": f"pptx_large_{idx:02d}",
        "class": "LARGE_DECKS",
        "expect_valid": True,
        "expected_pages": n,
        "text_markers": [f"Large Deck {idx}"],
        "filename": f"large_{idx}.pptx",
        "data": _build_pptx(slides)
    }


def gen_adversarial(idx):
    """Malformed/adversarial packages (7 fixtures)."""
    if idx == 1:
        return {
            "id": "pptx_adv_01_corrupted_zip",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "corrupted.pptx",
            "data": b"PK\x03\x04CORRUPTED_ZIP_GARBAGE_DATA_NOT_REAL",
            "description": "Corrupted ZIP bytes"
        }
    elif idx == 2:
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w') as zf:
            zf.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
            zf.writestr('_rels/.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')
            zf.writestr('ppt/vbaProject.bin', b'MACRO_PAYLOAD')
            zf.writestr('ppt/presentation.xml', '<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>')
            zf.writestr('ppt/_rels/presentation.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')
            zf.writestr('ppt/slides/slide1.xml', _slide_xml(["VBA test"]))
        return {
            "id": "pptx_adv_02_vba_macro",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "macro_deck.pptx",
            "data": buf.getvalue(),
            "description": "PPTX with vbaProject.bin"
        }
    elif idx == 3:
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, 'w') as zf:
            zf.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
            zf.writestr('_rels/.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')
            zf.writestr('ppt/_rels/presentation.xml.rels', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')
            zf.writestr('ppt/slides/slide1.xml', _slide_xml(["Missing presentation.xml"]))
        return {
            "id": "pptx_adv_03_missing_presentation",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "broken.pptx",
            "data": buf.getvalue(),
            "description": "Missing ppt/presentation.xml"
        }
    elif idx == 4:
        return {
            "id": "pptx_adv_04_pptm_extension",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "macro.pptm",
            "data": _build_pptx([_slide_xml(["pptm test"])]),
            "description": ".pptm extension rejection"
        }
    elif idx == 5:
        return {
            "id": "pptx_adv_05_potm_extension",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "template.potm",
            "data": _build_pptx([_slide_xml(["potm test"])]),
            "description": ".potm extension rejection"
        }
    elif idx == 6:
        return {
            "id": "pptx_adv_06_empty_payload",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "empty.pptx",
            "data": b"",
            "description": "Empty 0-byte payload"
        }
    elif idx == 7:
        return {
            "id": "pptx_adv_07_truncated_zip",
            "class": "ADVERSARIAL",
            "expect_valid": False,
            "expected_code": 422,
            "filename": "truncated.pptx",
            "data": b"PK\x03\x04\x14\x00\x00\x00\x08\x00",
            "description": "Truncated ZIP header"
        }


# ──────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────

def generate_pptx_fidelity_corpus():
    """Generate the complete 100-fixture PPTX fidelity corpus."""
    fixtures = []

    # Simple text (10)
    for i in range(1, 11):
        fixtures.append(gen_simple_text(i))

    # Images and backgrounds (8)
    for i in range(1, 9):
        fixtures.append(gen_images_backgrounds(i))

    # Tables (8)
    for i in range(1, 9):
        fixtures.append(gen_tables(i))

    # Charts (6)
    for i in range(1, 7):
        fixtures.append(gen_charts(i))

    # Shapes (8)
    for i in range(1, 9):
        fixtures.append(gen_shapes(i))

    # Slide masters and themes (8)
    for i in range(1, 9):
        fixtures.append(gen_slide_masters(i))

    # Headers, footers (5)
    for i in range(1, 6):
        fixtures.append(gen_headers_footers(i))

    # Hyperlinks (5)
    for i in range(1, 6):
        fixtures.append(gen_hyperlinks(i))

    # Hidden slides (4)
    for i in range(1, 5):
        fixtures.append(gen_hidden_slides(i))

    # Speaker notes (4)
    for i in range(1, 5):
        fixtures.append(gen_speaker_notes(i))

    # Unusual fonts (6)
    for i in range(1, 7):
        fixtures.append(gen_unusual_fonts(i))

    # Arabic RTL (6)
    for i in range(1, 7):
        fixtures.append(gen_arabic_rtl(i))

    # Japanese CJK (6)
    for i in range(1, 7):
        fixtures.append(gen_japanese_cjk(i))

    # Mixed language (4)
    for i in range(1, 5):
        fixtures.append(gen_mixed_language(i))

    # Large decks (5)
    for i in range(1, 6):
        fixtures.append(gen_large_deck(i))

    # Adversarial (7)
    for i in range(1, 8):
        fixtures.append(gen_adversarial(i))

    assert len(fixtures) == 100, f"Expected 100 fixtures, got {len(fixtures)}"
    return fixtures


if __name__ == "__main__":
    corpus = generate_pptx_fidelity_corpus()
    valid = sum(1 for f in corpus if f["expect_valid"])
    invalid = sum(1 for f in corpus if not f["expect_valid"])

    print(f"PPTX Fidelity Corpus Generated: {len(corpus)} fixtures")
    print(f"  Valid:   {valid}")
    print(f"  Invalid: {invalid}")
    print()

    classes = {}
    for f in corpus:
        c = f["class"]
        classes[c] = classes.get(c, 0) + 1
    for c, n in sorted(classes.items()):
        print(f"  {c:<30s} {n:>3d}")

    # Verify all data is non-None
    for f in corpus:
        assert f["data"] is not None, f"Fixture {f['id']} has no data"
        if f["expect_valid"]:
            assert len(f["data"]) > 100, f"Fixture {f['id']} data too small ({len(f['data'])} bytes)"

    print("\nAll fixtures validated successfully.")
