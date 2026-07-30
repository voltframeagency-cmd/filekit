import os

routes_data = [
    ('sign-pdf', 'SignPdfPage', 'Sign PDF Online', 'PDF Tools'),
    ('add-image-to-pdf', 'AddImageToPdfPage', 'Add Image to PDF', 'PDF Tools'),
    ('crop-pdf', 'CropPdfPage', 'Crop PDF Pages', 'PDF Tools'),
    ('add-page-numbers-to-pdf', 'AddPageNumbersPage', 'Add Page Numbers to PDF', 'PDF Tools'),
    ('word-to-pdf', 'WordToPdfPage', 'Convert Word to PDF', 'Office to PDF'),
    ('excel-to-pdf', 'ExcelToPdfPage', 'Convert Excel to PDF', 'Office to PDF'),
    ('powerpoint-to-pdf', 'PowerPointToPdfPage', 'Convert PowerPoint to PDF', 'Office to PDF'),
    ('ocr-pdf', 'OcrPdfPage', 'OCR PDF Converter', 'OCR Engine'),
    ('image-to-text', 'ImageToTextPage', 'Extract Text from Image', 'OCR Engine'),
    ('make-pdf-searchable', 'MakePdfSearchablePage', 'Make PDF Searchable', 'OCR Engine'),
    ('pdf-to-word', 'PdfToWordPage', 'Convert PDF to Word', 'PDF to Office'),
    ('pdf-to-excel', 'PdfToExcelPage', 'Convert PDF to Excel', 'PDF to Office'),
    ('pdf-to-powerpoint', 'PdfToPowerPointPage', 'Convert PDF to PowerPoint', 'PDF to Office'),
    ('heic-to-jpg', 'HeicToJpgPage', 'Convert HEIC to JPG', 'Image Converter'),
    ('heic-to-png', 'HeicToPngPage', 'Convert HEIC to PNG', 'Image Converter'),
    ('avif-to-jpg', 'AvifToJpgPage', 'Convert AVIF to JPG', 'Image Converter'),
    ('png-to-ico', 'PngToIcoPage', 'Convert PNG to ICO', 'Image Converter'),
]

base_dir = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\app'

template = '''"use client";

import React from "react";
import SiteHeader from "@/components/navigation/SiteHeader";
import AppFooter from "@/components/layout/AppFooter";
import {{ ToolContentRenderer }} from "@/components/seo/ToolContentRenderer";
import {{ toolContentRegistry }} from "@/lib/seo/contentRegistry";
import {{ buildCanonicalUrl }} from "@/utils/siteUrl";

export default function {component_name}() {{
  const cfg = toolContentRegistry["{operation_id}"];

  const jsonLd = {{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": cfg?.metaTitle || "{default_h1}",
    "url": buildCanonicalUrl("/{operation_id}"),
    "description": cfg?.metaDescription || "{default_h1} online",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All"
  }};

  return (
    <div className="flex flex-col min-h-screen bg-fk-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{{{ __html: JSON.stringify(jsonLd) }}}}
      />
      <SiteHeader />

      <main className="flex-1 flex flex-col gap-6 md:gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 py-6 md:py-12">
        <section className="flex flex-col gap-1.5 max-w-[840px] mx-auto w-full text-left ltr:text-left rtl:text-right px-2">
          <span className="text-blue-900 bg-white/90 px-3 py-1 rounded-full w-fit font-mono text-[11px] font-bold uppercase shadow-sm">
            {tag_label}
          </span>
          <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-white leading-[1.1] tracking-tight drop-shadow-sm">
            {{cfg?.h1 || "{default_h1}"}}
          </h1>
          <p className="text-[13px] md:text-[15px] font-medium text-blue-100 leading-relaxed">
            {{cfg?.directAnswer || "Process {default_h1} securely."}}
          </p>
        </section>

        <ToolContentRenderer operationId="{operation_id}" />
      </main>

      <AppFooter />
    </div>
  );
}}
'''

for op_id, comp_name, h1_title, tag in routes_data:
    dir_path = os.path.join(base_dir, op_id)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, 'page.tsx')
    content = template.format(
        component_name=comp_name,
        operation_id=op_id,
        default_h1=h1_title,
        tag_label=tag
    )
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f'Successfully created {len(routes_data)} app routes under src/app!')
