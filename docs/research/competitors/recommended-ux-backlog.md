# FileKit Reconciled UX Backlog & Source Retention Audit

## 1. Source Retention Workspace Audit

All 5 core FileKit workspaces were audited for source buffer retention behavior during parameter adjustments, after output generation, and upon workspace reset:

| Workspace | Source Retained During Adjustment | Source Retained After Output | Re-Upload Required for Setting Change | Full Reset Behavior | Status / Classification |
|---|---|---|---|---|---|
| **ImageCompressionWorkspace** | Yes | Yes | No | Intentionally clears source | Intentional & Correct |
| **PdfCompressionWorkspace** | Yes | Yes | No | Intentionally clears source | Intentional & Correct |
| **ImageConverterWorkspace** | Yes | Yes | No | Intentionally clears source | Intentional & Correct |
| **PdfToImageWorkspace** | Yes | Yes | No | Intentionally clears source | Intentional & Correct |
| **ImageToPdfWorkspace** | Yes | Yes | No | Intentionally clears source | Intentional & Correct |

* **Finding**: FileKit's existing 5 workspaces already retain source buffers during setting tuning. The "Choose Different File" action intentionally clears the workspace for a clean new task. No source-retention defects were identified in existing workspaces.

---

## 2. Reconciled Backlog

### P0 — Critical Usability Improvements
* **P0-1: Audit Existing Image Comparison Slider [AUDIT]**:
  - *Context*: FileKit already contains a frozen `ImageComparisonSlider.tsx` (Commit: `5a721d4`, Tag: `phase2b2-image-comparison-final`).
  - *Recommendation*: Audit and refine `ImageComparisonSlider.tsx` against Squoosh for accessibility, mobile touch response, interaction clarity, and visual precision. Do NOT build a duplicate slider.

---

### P1 — High-Impact UX & Trust Polish
* **P1-1: Visual Thumbnail Grid for PDF Organization Suite [ADAPT]**:
  - *Priority*: P1 research-backed interaction pattern.
  - *Requires*: New PDF Organization engine family.
  - *Frozen engine modifications*: No.
  - *New engine and workspace work*: Yes.
  - *Proposed Components*: `PdfPageThumbnailGrid.tsx` rendering 150px PDF.js canvas thumbnails with hover rotate/delete buttons and drag-reordering for `/merge-pdf`, `/split-pdf`, `/extract-pdf-pages`, `/delete-pdf-pages`, `/reorder-pdf-pages`, and `/rotate-pdf-pages`.

* **P1-2: Multi-Stage Status Indicator [ADOPT]**:
  - *Recommendation*: Stage labels (`1. Inspecting File` → `2. Processing Locally` → `3. Verifying Artifact`) to improve progress feedback.

* **P1-3: Next-Step Contextual Links [ADAPT]**:
  - *Recommendation*: Contextual next-tool suggestions on `VerifiedResultCard` (e.g. *"Convert to JPG"*, *"Split Pages"*).

---

### DO NOT BUILD (Explicit Anti-Patterns)
* ❌ Mandatory account creation or sign-in gates before download.
* ❌ Deceptive $1 auto-renewing trial traps.
* ❌ Fake animated progress percentages.
* ❌ Deceptive banner ad placement next to CTAs.
