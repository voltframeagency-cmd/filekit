# FileKit Component System Opportunities

## 1. Executive Summary

This document details component-level opportunities identified during the competitor research audit. All proposed component enhancements preserve FileKit's core architecture: **100% client-side Web Workers/WASM processing**, **zero server uploads**, and **frozen core engine contracts**.

---

## 2. Proposed Component Enhancements

### A. `UploadDropzone.tsx` & `UploadWorkspace.tsx`
- **Competitor Inspiration**: CloudConvert (central drop card) + PDFAid (2-column trust checkmarks).
- **Opportunity**: Enhance the empty state dropzone to include an explicit 2-column layout:
  - Left Column: Trust checkmarks (`✓ 100% In-Browser`, `✓ Zero Server Uploads`, `✓ Instant Download`).
  - Right Column: High-contrast dashed drop target with primary action button (`Select PDF files` / `Select Images`).

### B. `VerifiedResultCard.tsx`
- **Competitor Inspiration**: Squoosh (instant re-compression) + Convertio (next tool actions).
- **Opportunity**: Add a non-destructive `"Adjust Settings"` secondary action button and contextual *"Next Tool"* suggestion links (e.g. *"Convert to JPG"*, *"Split Pages"*).

### C. `PdfPageThumbnailGrid.tsx` (New Component for PDF Organization)
- **Competitor Inspiration**: Sejda (visual thumbnail grid) + PDF24 (zero paywall drag-and-drop page editing).
- **Opportunity**: Create a responsive visual grid component rendering low-res 150px PDF page thumbnails using local PDF.js canvas rendering.
  - Controls per thumbnail: Hover rotate (90° steps), hover delete, drag handle for reordering.

### D. `StageStatusIndicator.tsx` (Processing Feedback)
- **Competitor Inspiration**: CloudConvert stage labels (`Uploading` → `Processing` → `Finished`).
- **Opportunity**: Replace static progress spinners with a multi-stage status indicator: `1. Inspecting File` → `2. Processing Locally` → `3. Verifying Artifact`.
