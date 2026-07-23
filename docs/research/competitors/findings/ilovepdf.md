# iLovePDF Competitor Audit Findings

## 1. Overview
- **Slug**: `ilovepdf`
- **URL**: `https://www.ilovepdf.com`
- **Category**: Full-Suite PDF Utility
- **Audited Tools**: Merge PDF, Split PDF, Compress PDF, PDF to Word, PDF to JPG, Image to PDF.

## 2. Interaction & Workflow Analysis
- **Clicks to Upload**: 1 click (Big red primary button `Select PDF files` or Drag & Drop).
- **Clicks to Process**: 1 click (Secondary red floating action button).
- **Clicks to Download**: 1 click (`Download compressed PDF` or direct auto-trigger).
- **Route Changes**: Moves from `/compress_pdf` to `/download/xxxx` step upon processing completion.
- **Source File Retention**: Source file is purged from browser memory upon task completion. Retry requires creating a new session or re-uploading.
- **Live Preview**: Thumbnail rendering for page order; no live quality/compression preview before processing.
- **Batch Support**: Full multi-file batch upload support.

## 3. Visual System & Components
- **Color Palette**: Crimson Red (`#E53238`), Soft Off-White Cards (`#F4F4F5`), Slate Dark Text (`#0F172A`).
- **Typography**: Clean geometric sans-serif (`Inter`/`Roboto`), heavy heading weights.
- **Upload Component**: Centered red drop button with Google Drive & Dropbox integration buttons.
- **Icon / SVG System**: Two-tone pastel rounded square badges with bold directional vector arrows.

## 4. Monetization & Trust Communication
- **Monetization**: Freemium model. Free users get access to basic tools, but large batch sizes, high file limits, or OCR require Premium subscription or login.
- **Trust Messaging**: Privacy notice states *"Files are automatically deleted within 2 hours"*. Reliance on server-side deletion timer.

## 5. FileKit Recommendations
- **ADAPT**: Clear category pill filters (`All`, `Workflows`, `Organize`, `Optimize`, `Convert`).
- **AVOID**: Forced route changes to separate download URLs; FileKit retains the user in the same workspace.
