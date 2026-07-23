# FileKit Prioritized UX Recommendation Backlog

## 1. Classification Methodology

- **ADOPT**: High usability gain, low implementation risk, 100% compliant with local-first principles.
- **ADAPT**: Proven competitor pattern adapted specifically for FileKit's local architecture.
- **AVOID**: Dark patterns, forced signups, fake progress counters, ad clickbait, silent server uploads.
- **TEST**: Promising interaction concepts requiring user evidence after live deployment.

---

## 2. Prioritized Action Backlog

### P0 (Critical Usability & Task Completion)

1. **Retain Source File Buffer in Local Workspace Memory [ADOPT]**
   - *Problem*: Changing compression quality or format targets currently forces file re-selection.
   - *Solution*: Keep original `ArrayBuffer` / `File` handle in React state until workspace explicit reset.
   - *Affected Components*: `useWorkspaceState.ts`, `UploadWorkspace.tsx`.
   - *Engine Impact*: None (Zero engine changes required).

2. **In-Place Workspace Retry & Adjustment Action [ADOPT]**
   - *Problem*: Result card only offered "Download" or "Cancel/Reset".
   - *Solution*: Add non-destructive "Adjust Settings" button that preserves the generated result while unlocking setting controls for instant re-execution.
   - *Affected Components*: `VerifiedResultCard.tsx`, `UploadWorkspace.tsx`.
   - *Engine Impact*: None.

---

### P1 (High Impact UX & Trust Polish)

3. **Visual Thumbnail Page Grid for PDF Organization Suite [ADAPT]**
   - *Problem*: Text-only page inputs (e.g. `"1-5"`) create uncertainty when selecting, splitting, or deleting pages.
   - *Solution*: Render low-res PDF page thumbnails using local PDF.js canvas renderer in a responsive visual grid. Support drag-to-reorder, click-to-delete, and hover-to-rotate.
   - *Affected Components*: `PdfOrganizationWorkspace.tsx`, `PdfPageThumbnailGrid.tsx`.
   - *Engine Impact*: None (Uses standard `pdf-lib` manipulation methods).

4. **Next-Step Cross-Tool Action Prompt [ADAPT]**
   - *Problem*: User completes PDF compression and wants to convert it to images or split pages, but must manually download and navigate away.
   - *Solution*: Add contextual "Next Action" links on `VerifiedResultCard` (e.g. *"Convert to JPG"*, *"Split Pages"*).
   - *Affected Components*: `VerifiedResultCard.tsx`.
   - *Engine Impact*: None.

---

### P2 (Useful Polish)

5. **Split-Screen Quality Comparison Inspector for Image Compression [TEST]**
   - *Problem*: Users cannot visually verify if image quality degraded slightly after compression without downloading.
   - *Solution*: Squoosh-style interactive image comparison slider for single-image compression.
   - *Affected Components*: `ImageCompressionWorkspace.tsx`.
   - *Engine Impact*: None.

---

## 3. DO NOT BUILD (Explicit Anti-Patterns)

- ❌ **Forced Account Creation / Sign-In Walls** (Adobe Acrobat pattern) — Conflicts with local-first privacy.
- ❌ **Fake Animated Percentage Counters** — FileKit uses true, deterministic progress stages.
- ❌ **Aggressive Hourly / Daily Task Ceilings** (Sejda / Smallpdf walls) — Degrades tool utility.
- ❌ **Deceptive Ad Banner Placement** (FreeConvert / TinyWow pattern) — Harms user trust.
- ❌ **Silent Server Fallback** — Local processing failures must present clear recovery choices, never silent file uploads.

---

## 4. Proposed PDF Organization Workspace Specification

For Track B (`/merge-pdf`, `/split-pdf`, `/extract-pdf-pages`, `/delete-pdf-pages`, `/reorder-pdf-pages`, `/rotate-pdf-pages`):

- **Shared Visual Component**: `PdfOrganizationWorkspace.tsx`
- **Interaction Flow**:
  1. `Drag & Drop PDF(s)` into local dropzone.
  2. `Local PDF.js Renderer` generates fast 150px page thumbnails.
  3. `Interactive Page Grid`:
     - Hover page: Show ↺ Rotate Left, ↻ Rotate Right, 🗑 Delete.
     - Drag handle: Smooth reordering within grid.
     - Select mode: Checkboxes for Range Split / Page Extraction.
  4. `Action Button`: "Download Merged PDF", "Download Selected Pages", "Download Rotated PDF".
  5. `Processing`: Executes locally via `pdf-lib` in background worker / micro-task loop.
