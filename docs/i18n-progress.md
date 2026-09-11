# FileKit Localization Leaks Progress & Checkpoint

## 1. Executive Summary & Inventory
This document tracks the incremental detection, remediation, and verification of localization leaks across FileKit. Progress is maintained on disk across small, resumable batches adhering to the shared surface sequence:
**Navigation → Uploaders → Trust Panel → Headings → Tool States**.

Target initial test locales to reproduce and eliminate leaks:
- **Bulgarian (`bg`)** (Cyrillic Slavic)
- **Norwegian (`no`)** (Nordic Germanic)

---

## 2. Categorized Leak Inventory

### Type 1: Hardcoded User-Facing English
| Source File | Component / Context | Offending Code / Text | Remediation Strategy |
|---|---|---|---|
| `src/components/navigation/DesktopMegaMenu.tsx` | Convert & Mega Menu container | `aria-label="Convert Tools"`, `aria-label={megaMenu?.label \|\| "Mega Menu"}` | Add localized aria-labels via dictionary |
| `src/components/navigation/MobileNavigation.tsx` | Drawer container & close button | `aria-label="Mobile Navigation Menu"`, `aria-label="Close navigation menu"` | Add localized aria-labels via dictionary |
| `src/components/navigation/SiteHeader.tsx` | Live search dropdown header | `<span>Matching Tools</span>`, `<span>{count} found</span>` | Add translation keys `nav.searchMatching` and `nav.searchFound` |
| `src/components/navigation/SiteHeader.tsx` | Search input fallback placeholder | `placeholder={t("nav.searchPlaceholder") \|\| "Search tools (e.g. merge, png)..."}` | Ensure `nav.searchPlaceholder` resolves in all locales; clean fallback |
| `src/components/navigation/SiteHeader.tsx` | Mobile menu hamburger button | Fallback `aria-label="Open navigation menu"` for unlisted locales (`no`, `bg`, `es`, etc.) | Add localized `aria-label` lookup |
| `src/components/navigation/SiteHeader.tsx` | Tool search autocomplete catalog | `ALL_SEARCHABLE_TOOLS` contains hardcoded English names and descriptions | Provide localized tool name and tag resolution |
| `src/components/image-tools/ExactImageTargetPage.tsx` | File inspection & notices | `"ℹ PNG files are processed safely..."`, `"Target Size Limit:"`, `"Original:"` | Move to dictionary keys |
| `src/components/image-tools/ExactImageTargetPage.tsx` | Actions & metric labels | `"Compressing below..."`, `"Download Image (< ${target})"`, `"Process Another"`, `"Original"`, `"New Size"` | Move to dictionary keys |
| `src/components/image-tools/ImageCompressionWorkspace.tsx` | Workspace status badges & buttons | Fallback to English for non-Chinese (`no`, `bg`, etc.): `"Choose Another"`, `"Updating Preview..."`, `"Adjust Settings"`, etc. | Replace inline ternaries with unified dictionary calls |

### Type 2: Missing Translation Keys
| Key | Context / Surface | Affected Locales | Required Action |
|---|---|---|---|
| `nav.resize` | Top Nav & Mobile Menu | Missing from `UiTranslations.nav` interface; only 8 locales had inline hacks | Add to `UiTranslations.nav` and dictionary across all locales |
| `nav.pricing` | Top Nav & Mobile Menu | Missing from `UiTranslations.nav` interface; only 8 locales had inline hacks | Add to `UiTranslations.nav` and dictionary across all locales |
| `nav.searchMatching` | SiteHeader search auto-complete | All locales | Define key in shared translation registry |
| `nav.searchFound` | SiteHeader search auto-complete | All locales | Define key in shared translation registry |
| `nav.openMenu` | Mobile menu burger button aria-label | `no`, `bg`, `de`, `fr`, `es`, `it`, `pt`, etc. | Add localized label to navigation dictionary |
| `nav.closeMenu` | Mobile drawer close button aria-label | All non-English locales | Add localized label to navigation dictionary |
| `nav.convertTools` | Desktop mega-menu region aria-label | All non-English locales | Add localized label to navigation dictionary |
| `workspace.changeFile` | Tool uploaders & workspaces | `no`, `bg`, etc. fallback to English | Wire up `t("workspace.changeFile")` consistently |

### Type 3: English Fallback Despite a Localized Route
| Source File | Root Cause | Impact | Fix |
|---|---|---|---|
| `src/components/layout/LanguageContext.tsx` | Step 3 in `t()` (lines 2032–2040) falls back to `UI_TRANSLATIONS["en"]` before Step 4 (tool/nav hardcoded maps) | Any 2-part key present in English returns English before custom language handlers run | Reorder resolution logic or populate `UI_TRANSLATIONS` comprehensively |
| `src/components/layout/LanguageContext.tsx` | Lines 2130–2168: `nav.resize` and `nav.pricing` only check 8 languages (`zh`, `es`, `pt`, `de`, `fr`, `it`, `ar`, `tr`) | `no`, `bg`, `pl`, `cs`, `nl`, `sv`, `da`, `fi`, `ro`, `ru`, `uk`, etc. receive English "Resize" / "Pricing" | Move into dictionary and support `no`, `bg`, etc. |
| `src/components/layout/LanguageContext.tsx` | Lines 2043–2128: `tool.*` and `breadcrumb.*` fallbacks only cover 7 languages | Cyrillic (`bg`, `ru`, `uk`), Nordic (`no`, `sv`, `da`, `fi`), etc. drop to English | Systematize resolution |

### Type 4: Incorrect Locale Propagation or Normalization
| Source File | Issue | Fix |
|---|---|---|
| `src/components/navigation/SiteHeader.tsx` | Live search tool link generator uses `language` from context instead of route `activeLocale` | Use `activeLocale` consistently so route locale is preserved on navigation |
| `scripts/audit_all_locales.mjs` | `TEST_LOCALES` array omitted Norwegian (`no`) | Add `no` to test suite |
| `scripts/audit_all_locales.mjs` | Audit script falsely claimed `100% CLEAN` across all locales based solely on 10 static SSR strings | Clarify output to accurately describe tested scope |

### Type 5: Mixed-Language Generated Sentences
| Source File | Issue | Example | Fix |
|---|---|---|---|
| `src/components/navigation/DesktopMegaMenu.tsx` & `MobileNavigation.tsx` | `NOUN_MAP` missing `no`, `da`, `fi`, `sk`, `sl`, `el`, `tr`, `ar`, `he`, `hi`, etc. | On `/no`, `"Image to PDF"` became `"Image til PDF"` | Add complete noun translations for `no` (`Bilde`), `bg` (`Изображение`), etc., plus exact tool label overrides |
| `src/components/image-tools/ExactImageTargetPage.tsx` | Interpolated target strings | `"Target: " + config.targetLabel + " max"` mixed with localized notice | Use complete sentence templates with placeholder replacement |

### Type 6: Outdated Screenshots / Untested Interactive States
| Artifact / Flow | Status | Action Required |
|---|---|---|
| Menu dropdowns & search modal | Untested in SSR audit | Add client interactive verification |
| Tool workspace state changes | Untested in SSR audit | Add fixture-based client checks |

---

## 3. Completed Batches & Validation Log

### Batch 1: Navigation Shared Surface Wiring (`no` & `bg` + core shared headers)
- **Scope**:
  - `src/components/navigation/megaMenuTranslations.ts`:
    - Add localized aria-labels (`convertTools`, `megaMenu`, `openMenu`, `closeMenu`).
    - Add `EXACT_TOOL_LABELS` entries for `"Image to PDF"`, `"Image to WebP"`, `"PDF to Image"`.
    - Expand `NOUN_MAP` to include Norwegian (`no`: `Bilde`, `Tekst`) and verify Bulgarian (`bg`: `Изображение`, `Текст`).
  - `src/components/navigation/DesktopMegaMenu.tsx`:
    - Localize aria-label for region.
    - Remove duplicate `NOUN_MAP`, import from shared module.
  - `src/components/navigation/MobileNavigation.tsx`:
    - Localize aria-labels for dialog and close button.
    - Import `NOUN_MAP` from shared module.
  - `src/components/navigation/SiteHeader.tsx`:
    - Localize mobile burger `aria-label`.
    - Localize live search dropdown header (`Matching Tools`, `{count} found`).
    - Localize `itemLabel` for `nav.resize` and `nav.pricing` for `no` and `bg`.
  - `src/components/layout/LanguageContext.tsx`:
    - Add translations for `nav.resize` and `nav.pricing` for `no` (`Endre størrelse`, `Priser`) and `bg` (`Преоразмеряване`, `Цени`).
  - `scripts/audit_all_locales.mjs`:
    - Include `no` in `TEST_LOCALES`.
    - Correct success message to specify SSR static pattern coverage only.
- **Files Modified**:
  - `src/components/navigation/megaMenuTranslations.ts`
  - `src/components/navigation/DesktopMegaMenu.tsx`
  - `src/components/navigation/MobileNavigation.tsx`
  - `src/components/navigation/SiteHeader.tsx`
  - `src/components/layout/LanguageContext.tsx`
  - `scripts/audit_all_locales.mjs`
- **Validation**:
  - Local dev server verification on `/no` and `/bg`.
  - Tested via `npx tsx scripts/test_navigation_batch.mjs`:
    - 20 unit assertions covering `NOUN_MAP`, `EXACT_TOOL_LABELS`, `NAV_ACCESSIBILITY_LABELS`, `SEARCH_HEADER_LABELS`, and `formatFoundCount`.
    - 7 live SSR HTML checks verifying Norwegian (`Endre størrelse`, `Priser`, `Åpne navigasjonsmeny`, no `Image til PDF`) and Bulgarian (`Преоразмеряване`, `Цени`, `Отваряне на навигационното меню`).
- **Results**: Completed & Validated (27/27 passed, 0 failures).

### Batch 2: Upload Controls Surface (`UploadDropzone.tsx`, `UploadWorkspace.tsx`, `LanguageContext.tsx`, `officeTranslations.ts`, `PdfCompressionWorkspace.tsx`)
- **Scope**:
  - `src/components/upload/UploadDropzone.tsx`:
    - Fixed inverted fallback priority on non-generic dropzones (`workspace.dropHere` prioritized over `workspace.selectFile` for `<h3>`, preventing duplicate "Select File" on heading and button).
    - Hardened `workspace.freeNotice` fallback to gracefully fall back to `trust.badge1`.
  - `src/components/layout/LanguageContext.tsx`:
    - Added full 39-locale dictionary for `common.or` (eliminating `"common.or"` raw key leak on `/no/pdf-to-jpg`, `/bg/pdf-to-jpg`, etc.).
    - Added full 39-locale dictionary for `workspace.supportsPdf` ("Supports PDF up to 50 MB" / "Støtter PDF opptil 50 MB" / "Поддържа PDF до 50 MB").
    - Added full 39-locale dictionary for `breadcrumb.home` ("Home" / "Hjem" / "Начало" / "Inicio" / etc.).
    - Added Norwegian (`no`) and Bulgarian (`bg`) tool and breadcrumb handlers (`breadcrumb.compress`, `tool.merge.*`, `tool.compress.*`, `tool.split.*`, `tool.rotate.*`, `tool.watermark.*`, `tool.resize.*`, `tool.pdfToWord.*`).
    - Added `workspace.askBeforeTransfer`, `workspace.troubleText`, and `workspace.compressBtn` for `no` and `bg`.
  - `src/components/office-tools/officeTranslations.ts`:
    - Added complete `no` (Norwegian) entry to `OFFICE_I18N` (eliminating English `"High-fidelity LibreOffice microVM conversion with 0% data retention"` on `/no/word-to-pdf`, `/no/powerpoint-to-pdf`, `/no/excel-to-pdf`).
  - `src/components/pdf-tools/PdfCompressionWorkspace.tsx`:
    - Added complete `no` and `bg` entries to `workspaceI18n` dictionary (dropzone titles, button labels, progress, target labels).
- **Files Modified**:
  - `src/components/upload/UploadDropzone.tsx`
  - `src/components/layout/LanguageContext.tsx`
  - `src/components/office-tools/officeTranslations.ts`
  - `src/components/pdf-tools/PdfCompressionWorkspace.tsx`
  - `scripts/test_upload_batch.mjs`
- **Validation**:
  - Tested via `npx tsx scripts/test_upload_batch.mjs`:
    - 8 unit assertions covering `OFFICE_I18N.no` and `OFFICE_I18N.bg`.
    - 25 live SSR HTML assertions across `/no/compress-pdf`, `/bg/compress-pdf`, `/no/word-to-pdf`, `/no/pdf-to-jpg`, `/bg/pdf-to-jpg`, `/no`, `/bg`.
    - 0 failures (33/33 passed).
  - Whole-fleet audit via `node scripts/audit_all_locales.mjs`:
    - 36 locales × 32 routes = 1152 checks, 0 leaks detected across all locales (all previously failing Norwegian routes now 100% clean).
  - Browser visual inspection via `browser_subagent`:
    - Navigated live to `/no`, `/no/compress-pdf`, and root `/`.
    - Confirmed zero English leak strings in top nav, uploader heading, buttons, or trust badges.
    - Captured visual screenshot artifacts: `no_home_top`, `no_home_bottom`, `no_compress_pdf`, `root_home`.
- **Results**: Completed & Validated (33/33 targeted tests passed, 1152/1152 fleet audit checks passed, live browser visually verified).

### Batch: OCR Workspace Surface (`OcrPdfWorkspace.tsx` & `ocrTranslations.ts`)
- **Scope**:
  - Replaced inline 12-language ternaries with a stable, complete dictionary module: `src/components/ocr-tools/ocrTranslations.ts`.
  - Populated all 39 canonical supported locales (`en`, `es`, `es-419`, `de`, `fr`, `pt`, `pt-BR`, `it`, `nl`, `ca`, `sv`, `da`, `fi`, `no`, `pl`, `cs`, `hu`, `ro`, `bg`, `el`, `sk`, `sl`, `ru`, `uk`, `tr`, `ar`, `he`, `hi`, `id`, `ms`, `th`, `vi`, `fil`, `ja`, `ko`, `zh-CN`, `zh-TW`, `lv`, `lt`).
  - Preserved distinct wording for mixed/scanned document uploaders ("Select Scanned Document or Image" / "Choose PDF or Image").
  - Preserved in-browser client privacy claims ("100% private in-browser OCR. Files never leave your browser.") across all 39 languages matching actual processing reality.
  - Implemented dynamic pluralization in `completedSummary(pages, ms)` matching language grammar rules.
  - Replaced all inline ternaries in `src/components/ocr-tools/OcrPdfWorkspace.tsx`:
    - Dropzone heading (`tr.dropzoneTitle`)
    - Privacy subtext (`tr.dropzonePrivacy`)
    - Choose file button (`tr.chooseButton`)
    - Change file button (`tr.changeFile`)
    - Progress stages (`tr.initialReading`, `tr.recognizing`)
    - Process button (`tr.recognizeBtn`)
    - Error message fallback (`tr.errorOcrFailed`)
    - Completed summary card (`tr.completedSummary`)
    - Copy text button & copied state (`tr.copyText`, `tr.copied`)
    - Download TXT button (`tr.downloadTxt`)
    - Download Searchable PDF button (`tr.downloadSearchablePdf`)
    - Extracted text box label (`tr.extractedTextLabel`)
- **Files Modified / Created**:
  - `src/components/ocr-tools/ocrTranslations.ts` (NEW)
  - `src/components/ocr-tools/OcrPdfWorkspace.tsx` (MODIFIED)
  - `scripts/test_ocr_batch.mjs` (NEW)
- **Validation**:
  - Tested via `npx tsx scripts/test_ocr_batch.mjs`:
    - 39/39 canonical locales checked for 13 string keys + function key: 100% complete, 0 empty strings.
    - Live SSR HTML assertions on `/bg/pdf-to-text`, `/ru/pdf-to-text`, `/hi/pdf-to-text`, `/no/pdf-to-text`, and `/bg/image-to-text`: 0 English dropzone leaks detected.
  - Browser interactive hydration audit via `browser_subagent`:
    - Navigated to `http://localhost:3000/bg/pdf-to-text`: Verified Bulgarian text (`"Изберете сканиран документ или изображение"`, `"100% поверително OCR в браузъра. Файловете никога не напускат вашето устройство."`, `"Изберете PDF или изображение"`).
    - Navigated to `http://localhost:3000/ru/pdf-to-text`: Verified Russian text (`"Выберите отсканированный документ или изображение"`, `"100% конфиденциальное OCR в браузере. Файлы никогда не покидают ваше устройство."`, `"Выбрать PDF или изображение"`).
    - Navigated to `http://localhost:3000/hi/pdf-to-text`: Verified Hindi text (`"स्कैन किया गया दस्तावेज़ या छवि चुनें"`, `"ब्राउज़र में 100% निजी OCR। फ़ाइलें कभी भी आपके डिवाइस से बाहर नहीं जाती हैं।"`, `"PDF या छवि चुनें"`).
    - Verified zero English leaks in workspace zone after full React hydration.
    - Generated visual screenshot artifacts: `bg_pdf_to_text`, `ru_pdf_to_text`, `hi_pdf_to_text`, and video recording `ocr_workspace_audit`.
- **Results**: Completed & Validated (39/39 locales complete, 5/5 SSR live route tests clean, 3/3 browser hydrated visual inspections passed).

### Batch: Privacy Workspace Surface (`PrivacyWorkspace.tsx` & `privacyTranslations.ts`)
- **Scope**:
  - Replaced inline 15-language ternaries in `src/utils/privacy/PrivacyWorkspace.tsx` with a dedicated 39-locale dictionary: `src/utils/privacy/privacyTranslations.ts`.
  - Populated all 39 canonical supported locales (`en`, `es`, `es-419`, `de`, `fr`, `pt`, `pt-BR`, `it`, `nl`, `ca`, `sv`, `da`, `fi`, `no`, `pl`, `cs`, `hu`, `ro`, `bg`, `el`, `sk`, `sl`, `ru`, `uk`, `tr`, `ar`, `he`, `hi`, `id`, `ms`, `th`, `vi`, `fil`, `ja`, `ko`, `zh-CN`, `zh-TW`, `lv`, `lt`).
  - Covered all 16 privacy workspace keys:
    - Uploader title & format notice (`tr.selectPhoto`, `tr.supportsNotice`)
    - Error messages (`tr.errorInspect`, `tr.errorStrip`)
    - Audit panel labels (`tr.fileDetails`, `tr.detectedMetadata`, `tr.gpsDetected`, `tr.gpsClean`, `tr.exifDetected`, `tr.exifClean`, `tr.cameraLabel`)
    - Process button states (`tr.sanitizing`, `tr.stripBtn`)
    - Success card & download button (`tr.successTitle`, `tr.readyDownload`, `tr.downloadBtn`)
- **Files Modified / Created**:
  - `src/utils/privacy/privacyTranslations.ts` (NEW)
  - `src/utils/privacy/PrivacyWorkspace.tsx` (MODIFIED)
  - `scripts/test_privacy_batch.mjs` (NEW)
- **Validation**:
  - Tested via `npx tsx scripts/test_privacy_batch.mjs`:
    - 39/39 canonical locales checked: 100% key completeness, 0 missing or empty strings.
    - Live SSR assertions on `/ms/strip-exif`, `/id/strip-exif`, `/fil/strip-exif`, `/bg/strip-exif`, `/ru/strip-exif`, `/hi/strip-exif`, `/no/strip-exif`: 0 English leaks detected.
  - Browser interactive hydration audit via `browser_subagent`:
    - Navigated to `http://localhost:3000/ms/strip-exif`: Verified Malay copy (`"Pilih Foto untuk Memadamkan Metadata"`, `"Menyokong JPG, PNG dan WebP (Sifar muat naik ke pelayan)"`).
    - Navigated to `http://localhost:3000/id/strip-exif`: Verified Indonesian copy (`"Pilih Foto untuk Menghapus Metadata"`, `"Mendukung JPG, PNG, dan WebP (Tanpa unggah ke server)"`).
    - Navigated to `http://localhost:3000/fil/strip-exif`: Verified Filipino copy (`"Pumili ng Larawan para Alisin ang Metadata"`, `"Sumusuporta sa JPG, PNG, at WebP (Walang pag-upload sa server)"`).
    - Captured screenshot artifacts: `ms_strip_exif`, `id_strip_exif`, `fil_strip_exif`, and video recording `privacy_workspace_audit`.
- **Results**: Completed & Validated (39/39 locales complete, 7/7 SSR live route tests clean, 3/3 browser hydrated visual inspections passed).

### Batch: PDF Compression Workspace (`PdfCompressionWorkspace.tsx`)
- **Scope**:
  - Eliminated English leaks caused by 16-locale restriction in `PdfCompressionWorkspace.tsx` (`workspaceI18n`).
  - Added dedicated translation module `src/components/pdf-tools/pdfCompressionTranslations.ts` supporting all 39 canonical FileKit locales with 46 keys per locale:
    - Dropzone and file support labels (`dropPdf`, `supportsPdf`, `privacyPdf`, `originalSize`, `chooseAnother`)
    - Processing states, result badges and descriptions (`compressing`, `noBeneficial`, `targetNotMet`, `alreadyBelow`, `compressedOk`, `noReductionDesc`)
    - Metrics panel (`original`, `newSize`, `pages`, `reduction`, `processingLocal`)
    - Download and adjustment action buttons (`downloadOriginal`, `downloadBest`, `downloadCompressed`, `adjustSettings`)
    - Settings panel and compression goals (`settingsTitle`, `compressionGoal`, `betterQuality`, `betterQualityDesc`, `balanced`, `balancedDesc`, `smallerFile`, `smallerFileDesc`)
    - Target file size controls (`targetFileSize`, `quickTargets`, `targetOutcome`, `below2mb`, `targetOutcomeDesc`)
    - Submit buttons (`compressBtn`, `recompressBtn`, `compressingBtn`)
    - Localized validation, progress and memory error messages (`errInvalidPdf`, `errInvalidNumber`, `errDecimalPlaces`, `errMinSize`, `errMaxSize`, `readingPdf`, `errEncrypted`, `errSigned`, `errMemory`, `errGeneric`)
  - Refactored `src/components/pdf-tools/PdfCompressionWorkspace.tsx` to consume `PDF_COMPRESSION_I18N`.
  - Passed route language to `TrustPanel` preventing hydration delay or fallback.
- **Files Modified / Created**:
  - `src/components/pdf-tools/pdfCompressionTranslations.ts` (NEW)
  - `src/components/pdf-tools/PdfCompressionWorkspace.tsx` (MODIFIED)
  - `scripts/test_pdf_compression_batch.mjs` (NEW)
- **Validation**:
  - Tested via `npx tsx scripts/test_pdf_compression_batch.mjs`:
    - 39/39 canonical locales checked: 100% key completeness (46/46 keys per locale), 0 missing or empty strings.
    - Live SSR assertions on `/vi/compress-pdf-to-size`, `/sk/compress-pdf`, `/lt/compress-pdf-to-size`, `/hi/compress-pdf-to-size`, `/ms/compress-pdf`, `/id/compress-pdf-to-size`, `/fil/compress-pdf-to-size`, `/ru/compress-pdf`, `/th/compress-pdf-to-size`, `/ja/compress-pdf`, `/ar/compress-pdf`: 100% localized, 0 English leaks.
  - Browser interactive hydration audit via `browser_subagent`:
    - Navigated to `http://localhost:3000/vi/compress-pdf-to-size`: Verified complete Vietnamese interface (`"Thả tài liệu PDF của bạn vào đây hoặc chọn tệp"`, `"Hỗ trợ tài liệu PDF tiêu chuẩn lên đến 50 MB"`, `"Nén PDF Miễn phí Trực tuyến"`).
    - Navigated to `http://localhost:3000/ms/strip-exif`: Verified complete Malay interface (`"Pilih Foto untuk Memadamkan Metadata"`, `"Padam Metadata EXIF dan GPS dari Gambar Percuma Dalam Talian"`).
    - Captured screenshot artifacts: `vietnamese_pdf_compression`, `malay_strip_exif`, and video recordings.
- **Results**: Completed & Validated (39/39 locales complete, 11/11 live SSR route tests passed, browser hydrated visual inspections verified).

---

## 4. Unresolved Issues & Backlog
1. **Remaining Workspace Components Batch**:
   - `AudioWorkspace`, `VideoWorkspace`, `ImageWorkspace`, `ArchiveWorkspace`, `FontWorkspace`, `EbookWorkspace`.
2. **Generated Headings and Metadata Batch**:
   - Address noun translation and capitalization (`parts[0].toUpperCase()` -> `IMAGE`) in `i18nHelper.ts`.
   - Separate file-format nouns (`PDF`, `PNG`, `MP3` remain invariant) from language nouns (`Text`, `Image` requiring localized forms).
3. **Trust Panel & Shared Surfaces Batch**:
   - Audit `TrustPanel.tsx`, `TRUST_TRANSLATIONS`, and `PrivacyAssuranceRow.tsx`.

---

## 5. Exact Next Batch
- **Next Batch**: Remaining Workspace Components (`AudioWorkspace.tsx` and `VideoWorkspace.tsx`).





