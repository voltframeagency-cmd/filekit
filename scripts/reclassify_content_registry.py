import os

filepath = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\lib\seo\contentRegistry.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Cut content at 'sign-pdf'
cut_pos = content.find("  'sign-pdf': {")
if cut_pos != -1:
    base_content = content[:cut_pos]
else:
    base_content = content

planned_records = '''  'sign-pdf': {
    operationId: 'sign-pdf',
    canonicalRoute: '/sign-pdf',
    templateType: 'A_PDF_OPS',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['PDF_LIB', 'CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: PDF visual signature overlay engine.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature under engineering development.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Sign PDF (Planned) | FileKit',
    metaDescription: 'Sign PDF feature currently under engineering development.',
    h1: 'Sign PDF (Planned)',
    directAnswer: 'This tool is currently in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Engineering development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is this feature live?', answer: 'No, this feature is currently in planned engineering development.' }
    ],
    relatedTools: []
  },

  'add-image-to-pdf': {
    operationId: 'add-image-to-pdf',
    canonicalRoute: '/add-image-to-pdf',
    templateType: 'A_PDF_OPS',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['PDF_LIB', 'CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF', 'JPG', 'PNG'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Image overlay onto PDF page coordinates.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Add Image to PDF (Planned) | FileKit',
    metaDescription: 'Add image to PDF feature currently under engineering development.',
    h1: 'Add Image to PDF (Planned)',
    directAnswer: 'This tool is currently in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Engineering development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is this feature live?', answer: 'No, this feature is currently in planned engineering development.' }
    ],
    relatedTools: []
  },

  'crop-pdf': {
    operationId: 'crop-pdf',
    canonicalRoute: '/crop-pdf',
    templateType: 'A_PDF_OPS',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['PDF_LIB'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: PDF CropBox page boundary modifier.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Crop PDF (Planned) | FileKit',
    metaDescription: 'Crop PDF feature currently under engineering development.',
    h1: 'Crop PDF (Planned)',
    directAnswer: 'This tool is currently in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Engineering development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is this feature live?', answer: 'No, this feature is currently in planned engineering development.' }
    ],
    relatedTools: []
  },

  'add-page-numbers-to-pdf': {
    operationId: 'add-page-numbers-to-pdf',
    canonicalRoute: '/add-page-numbers-to-pdf',
    templateType: 'A_PDF_OPS',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['PDF_LIB'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Header and footer page numbering engine.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Add Page Numbers to PDF (Planned) | FileKit',
    metaDescription: 'Page numbering feature currently under engineering development.',
    h1: 'Add Page Numbers to PDF (Planned)',
    directAnswer: 'This tool is currently in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Engineering development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is this feature live?', answer: 'No, this feature is currently in planned engineering development.' }
    ],
    relatedTools: []
  },

  'word-to-pdf': {
    operationId: 'word-to-pdf',
    canonicalRoute: '/word-to-pdf',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['DOCX', 'DOC'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: Headless LibreOffice Word conversion cluster.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Word to PDF (Planned) | FileKit',
    metaDescription: 'Word to PDF converter planned for future server release.',
    h1: 'Word to PDF (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Server cluster implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is Word to PDF available?', answer: 'No, Word to PDF conversion is in planned server development.' }
    ],
    relatedTools: []
  },

  'excel-to-pdf': {
    operationId: 'excel-to-pdf',
    canonicalRoute: '/excel-to-pdf',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['XLSX', 'XLS'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: Excel to PDF conversion cluster.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Excel to PDF (Planned) | FileKit',
    metaDescription: 'Excel to PDF converter planned for future server release.',
    h1: 'Excel to PDF (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Server cluster implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is Excel to PDF available?', answer: 'No, Excel to PDF conversion is in planned server development.' }
    ],
    relatedTools: []
  },

  'powerpoint-to-pdf': {
    operationId: 'powerpoint-to-pdf',
    canonicalRoute: '/powerpoint-to-pdf',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PPTX', 'PPT'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: PowerPoint to PDF conversion cluster.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'PowerPoint to PDF (Planned) | FileKit',
    metaDescription: 'PowerPoint to PDF converter planned for future server release.',
    h1: 'PowerPoint to PDF (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Server cluster implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is PowerPoint to PDF available?', answer: 'No, PowerPoint to PDF conversion is in planned server development.' }
    ],
    relatedTools: []
  },

  'ocr-pdf': {
    operationId: 'ocr-pdf',
    canonicalRoute: '/ocr-pdf',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: Tesseract OCR text layer generator.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'OCR PDF (Planned) | FileKit',
    metaDescription: 'OCR PDF tool planned for future server release.',
    h1: 'OCR PDF (Planned)',
    directAnswer: 'This OCR tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'OCR engine development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned OCR Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is OCR PDF available?', answer: 'No, OCR PDF is in planned engineering development.' }
    ],
    relatedTools: []
  },

  'image-to-text': {
    operationId: 'image-to-text',
    canonicalRoute: '/image-to-text',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['JPG', 'PNG'],
    outputFormat: 'TXT',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: Image OCR text extractor.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Image to Text (Planned) | FileKit',
    metaDescription: 'Image to text OCR tool planned for future release.',
    h1: 'Image to Text (Planned)',
    directAnswer: 'This OCR tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'OCR engine development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned OCR Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is Image to Text available?', answer: 'No, Image to Text is in planned development.' }
    ],
    relatedTools: []
  },

  'make-pdf-searchable': {
    operationId: 'make-pdf-searchable',
    canonicalRoute: '/make-pdf-searchable',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PDF',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: Searchable PDF text layer embedder.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'Make PDF Searchable (Planned) | FileKit',
    metaDescription: 'Searchable PDF tool planned for future release.',
    h1: 'Make PDF Searchable (Planned)',
    directAnswer: 'This OCR tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'OCR engine development planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned OCR Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is Make PDF Searchable available?', answer: 'No, this tool is in planned development.' }
    ],
    relatedTools: []
  },

  'pdf-to-word': {
    operationId: 'pdf-to-word',
    canonicalRoute: '/pdf-to-word',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'DOCX',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: PDF layout parser to Word DOCX converter.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'PDF to Word (Planned) | FileKit',
    metaDescription: 'PDF to Word converter planned for future release.',
    h1: 'PDF to Word (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Layout parser implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is PDF to Word available?', answer: 'No, PDF to Word is in planned development.' }
    ],
    relatedTools: []
  },

  'pdf-to-excel': {
    operationId: 'pdf-to-excel',
    canonicalRoute: '/pdf-to-excel',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'XLSX',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: PDF table extraction to Excel spreadsheet.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'PDF to Excel (Planned) | FileKit',
    metaDescription: 'PDF to Excel converter planned for future release.',
    h1: 'PDF to Excel (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Table parser implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is PDF to Excel available?', answer: 'No, PDF to Excel is in planned development.' }
    ],
    relatedTools: []
  },

  'pdf-to-powerpoint': {
    operationId: 'pdf-to-powerpoint',
    canonicalRoute: '/pdf-to-powerpoint',
    templateType: 'E_SERVER',
    processingMode: 'SERVER_REQUIRED',
    executionTechnologies: ['WASM'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PDF'],
    outputFormat: 'PPTX',
    fileLimits: { deviceDependent: false },
    processingDisclosure: 'Planned server feature: PDF slides to PowerPoint PPTX converter.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'PDF to PowerPoint (Planned) | FileKit',
    metaDescription: 'PDF to PowerPoint converter planned for future release.',
    h1: 'PDF to PowerPoint (Planned)',
    directAnswer: 'This server conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'Slide parser implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Server Feature', text: 'Under development.', iconAsset: 'verified-output' }
    ],
    faqs: [
      { question: 'Is PDF to PowerPoint available?', answer: 'No, PDF to PowerPoint is in planned development.' }
    ],
    relatedTools: []
  },

  'heic-to-jpg': {
    operationId: 'heic-to-jpg',
    canonicalRoute: '/heic-to-jpg',
    templateType: 'B_CONVERSION',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['CANVAS', 'OFFSCREEN_CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['HEIC'],
    outputFormat: 'JPG',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Client WASM HEIC photo decoder.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'HEIC to JPG (Planned) | FileKit',
    metaDescription: 'HEIC to JPG converter planned for future release.',
    h1: 'HEIC to JPG (Planned)',
    directAnswer: 'This image conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'WASM decoder implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Image Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is HEIC to JPG available?', answer: 'No, HEIC to JPG is in planned development.' }
    ],
    relatedTools: []
  },

  'heic-to-png': {
    operationId: 'heic-to-png',
    canonicalRoute: '/heic-to-png',
    templateType: 'B_CONVERSION',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['CANVAS', 'OFFSCREEN_CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['HEIC'],
    outputFormat: 'PNG',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Client WASM HEIC to PNG converter.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'HEIC to PNG (Planned) | FileKit',
    metaDescription: 'HEIC to PNG converter planned for future release.',
    h1: 'HEIC to PNG (Planned)',
    directAnswer: 'This image conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'WASM decoder implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Image Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is HEIC to PNG available?', answer: 'No, HEIC to PNG is in planned development.' }
    ],
    relatedTools: []
  },

  'avif-to-jpg': {
    operationId: 'avif-to-jpg',
    canonicalRoute: '/avif-to-jpg',
    templateType: 'B_CONVERSION',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['CANVAS', 'OFFSCREEN_CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['AVIF'],
    outputFormat: 'JPG',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Client AVIF image decoder.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'AVIF to JPG (Planned) | FileKit',
    metaDescription: 'AVIF to JPG converter planned for future release.',
    h1: 'AVIF to JPG (Planned)',
    directAnswer: 'This image conversion tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'AVIF decoder implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Image Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is AVIF to JPG available?', answer: 'No, AVIF to JPG is in planned development.' }
    ],
    relatedTools: []
  },

  'png-to-ico': {
    operationId: 'png-to-ico',
    canonicalRoute: '/png-to-ico',
    templateType: 'B_CONVERSION',
    processingMode: 'LOCAL_NATIVE',
    executionTechnologies: ['CANVAS'],
    implementationStatus: 'PLANNED',
    indexable: false,
    sitemapEligible: false,
    robotsDirective: 'noindex,nofollow',
    supportedInputs: ['PNG'],
    outputFormat: 'ICO',
    fileLimits: { deviceDependent: true },
    processingDisclosure: 'Planned feature: Multi-resolution ICO favicon encoder.',
    verificationMethod: 'Under development.',
    limitations: ['Planned feature.'],
    failureCases: ['Unimplemented engine.'],
    locale: 'en',
    dateReviewed: '2026-07-30',
    evidenceSources: ['FileKit Roadmap'],
    metaTitle: 'PNG to ICO (Planned) | FileKit',
    metaDescription: 'PNG to ICO converter planned for future release.',
    h1: 'PNG to ICO (Planned)',
    directAnswer: 'This favicon generator tool is in planned development.',
    howToSteps: [
      { title: '1. Feature in roadmap', text: 'ICO encoder implementation planned.', iconAsset: 'step-upload' }
    ],
    benefitsHeading: 'Planned Capability',
    benefits: [
      { title: 'Planned Favicon Feature', text: 'Under development.', iconAsset: 'private-local-processing' }
    ],
    faqs: [
      { question: 'Is PNG to ICO available?', answer: 'No, PNG to ICO is in planned development.' }
    ],
    relatedTools: []
  }
};
'''

final_code = base_content.strip() + '\n\n' + planned_records

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_code)

print('Successfully updated contentRegistry.ts to set PLANNED / NOT_PUBLIC status for all 17 planned routes!')
