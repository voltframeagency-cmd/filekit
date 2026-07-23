# Competitor Workflow & Interaction Measurement Matrix

## 1. Quantitative Interaction Benchmark Table

| Competitor | Primary Focus | Clicks to Upload | Clicks to Process | Clicks to Download | Re-upload Required for Retry? | Live Preview? | Batch Support? | Monetization Interruption | Local vs Server Processing |
|---|---|---|---|---|---|---|---|---|---|
| **Squoosh** | Image Compression | 1 | 0 (Auto) | 1 | No (Instant memory retention) | Yes (Split-screen slider) | No | None (Open Source) | 100% Client-Side (WASM/Worker) |
| **iLovePDF** | PDF Tools Suite | 1 | 1 | 1 | Yes (Requires new task session) | No (Thumbnails only) | Yes | Hourly task cap / Premium upsell | Server Processing (2hr deletion) |
| **Smallpdf** | PDF Tools Suite | 1 | 1 | 1 | Yes | No | Yes (Pro only) | 2-task daily hard paywall | Server Processing |
| **Adobe Acrobat** | PDF Tools | 1 | 1 | 2 (Signup forced) | Yes | Partial | No | Forced Sign-In Gate | Server Processing |
| **PDF24 Tools** | PDF Tools Suite | 1 | 1 | 1 | No | Yes (Grid view) | Yes | None (Free/Ad-supported) | Server / Local Desktop App |
| **Sejda** | PDF Organization | 1 | 1 | 1 | No | Yes (Interactive visual grid) | Yes | 3 tasks/hour ceiling | Server Processing |
| **CloudConvert** | Format Conversion | 1 | 2 | 1 | No | No | Yes | Daily minutes limit | Server Processing |
| **Convertio** | Format Conversion | 1 | 1 | 1 | No | No | Yes | File size limit (100MB free) | Server Processing |
| **FreeConvert** | Format Conversion | 1 | 2 | 1 | No | No | Yes | Ad density & file size limits | Server Processing |
| **TinyWow** | PDF & File Tools | 1 | 1 | 1 | Yes | No | Partial | Bot/CAPTCHA verification gates | Server Processing |
| **OptiPic** | Image Optimization | 1 | 1 | 1 | No | Technical Delta | Yes | Account credits system | Server Processing |

---

## 2. Standardized Task Workflow Mechanics

### Workflow A: Image Compression & Quality Tuning
- **Squoosh Model**:
  - `Select File` → `Instant Auto-Encode` → `Adjust Slider (150ms debounce)` → `Download`.
  - *Strength*: Side-by-side comparison bar lets users visually inspect artifacting before downloading.
  - *Weakness*: Lack of multi-file batch queueing.

### Workflow B: PDF Compression & Size Targeting
- **PDF24 & iLovePDF Model**:
  - `Upload PDF` → `Select Preset (Extreme / Recommended / Low)` → `Click Compress` → `Download`.
  - *Strength*: Simple 3-option preset reduces decision fatigue.
  - *Weakness*: Users cannot target an exact file size (e.g. "Compress under 2 MB") without trial and error.

### Workflow C: Image Format Conversion (JPG/PNG/WebP)
- **CloudConvert & Convertio Model**:
  - `Select Files` → `Choose Output Format from Dropdown` → `Click Convert` → `Download All (ZIP or Individual)`.
  - *Strength*: High clarity on target output extension.
  - *Weakness*: Server processing queue causes 3–10s latency even for small images.

### Workflow D: PDF Organization (Merge, Split, Rotate, Delete, Reorder)
- **Sejda & PDF24 Visual Grid Model**:
  - `Upload PDFs` → `Interactive Thumbnail Grid Rendered` → `Drag-to-Reorder / Hover-to-Rotate / Click-to-Delete` → `Click Process` → `Download`.
  - *Strength*: Visual page thumbnails give complete spatial awareness of page placement.
  - *Weakness*: Sejda cuts off processing with a strict 3-task/hour hard paywall.
