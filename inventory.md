# FileKit Component Inventory v1.0

This inventory documents all the components required for Phase 0 based on the approved **FileKit Design System v1.0** and **FileKit PRD v2.0**. 

---

## 📦 Component Layout & Organization

All components will be created under `src/components/` and grouped by domain category:

```text
src/components/
├── common/        # General-purpose visual primitives
├── layout/        # Layout shells and global nav
├── upload/        # Upload workspace components
├── workspace/     # Interaction and processing views
└── paywall/       # Monetization cards and selections
```

---

## 1. Common Components (`src/components/common`)

### 1.1 Button (`Button.tsx`)
- **Visuals:** Stockholm minimalism, border-radius (`radius-md` = 12px), touch target $\ge$ 44px.
- **Variants:**
  - `primary`: File Blue (`--fk-primary`) bg, white text.
  - `secondary`: White surface, slate border, midnight text.
  - `tertiary`: Text action only (e.g., Cancel, Remove).
  - `destructive`: Red text/background for clear/delete actions.
- **States:** Hover (120ms ease), Active/Pressed (100ms ease), Disabled, Loading.

### 1.2 Processing Mode Badge (`ProcessingBadge.tsx`)
- **Visuals:** Restrained semantic styling with icons.
- **Variants:**
  - `local`: 🔒 **Processed on this device**. Green text/border (`--fk-success`), light green background (`--fk-success-bg`). Explains that the file never leaves the browser.
  - `server`: ☁ **Secure temporary processing**. Indigo text/border (`--fk-server`), light indigo background (`--fk-server-bg`). Explains that the file is uploaded temporarily and auto-deleted.
- **Accessibility:** Readable label, explicit text announcement for screen readers.

### 1.3 Error Alert (`ErrorAlert.tsx`)
- **Visuals:** Danger styling, red border (`--fk-danger`), light red background (`--fk-danger-bg`).
- **States:** Actionable guidelines (explains what happened, why, and gives a recovery button/action). No generic "Something went wrong" messages.

---

## 2. Layout Components (`src/components/layout`)

### 2.1 Header (`Header.tsx`)
- **Visuals:** Height $\le$ 72px, absolute visual calm.
- **Elements:**
  - FileKit Logo (horizontal mark + wordmark without glowing gradients).
  - Categorized tool search bar.
  - Language selector dropdown supporting English, Arabic (RTL), and Turkish.
  - CTA / Auth buttons ("Sign in", "Get Started").

### 2.2 Footer (`Footer.tsx`)
- **Visuals:** Restrained neutral background (`--fk-surface-muted`), subtle boundaries.
- **Elements:** 
  - Standard compliance and privacy links (explaining no permanent storage).
  - Categorized internal link sheets.

### 2.3 Tool Search (`ToolSearch.tsx`)
- **Visuals:** Triggered by `/` key shortcut, command-palette style dropdown.
- **Elements:** Search input, result list with category icons and file type badges (e.g. `PDF`, `PNG`).

---

## 3. Upload Components (`src/components/upload`)

### 3.1 Upload Zone (`UploadZone.tsx`)
- **Visuals:** Central focal container, round boundary (`radius-xl` = 24px), dashed border.
- **States:**
  - `empty`: Standard file dropzone ("Drop your file here or choose a file").
  - `drag-active`: Highlights border blue (`--fk-primary`) with animation scale transition.
  - `invalid`: Warns on wrong MIME types or file size limits.
  - `inspecting`: Reading file header metadata locally.

### 3.2 File Card (`FileCard.tsx`)
- **Visuals:** Round box (`radius-lg` = 16px).
- **Elements:** File icon, filename (truncated with tooltip), file size in monospace (`JetBrains Mono`), pages/dimensions, remove action.

---

## 4. Workspace Components (`src/components/workspace`)

### 4.1 Settings Panel (`SettingsPanel.tsx`)
- **Visuals:** Clean controls, progressive disclosure (advanced settings collapsed by default).
- **Elements:** Context-aware inputs (e.g., slider for image quality, size input fields).

### 4.2 Progress Indicator (`ProgressIndicator.tsx`)
- **Visuals:** Clean, flat progress bar.
- **States:** Uses stage indicators ("Inspecting", "Preparing", "Processing", "Verifying", "Ready"). Indeterminate bar for unmeasurable progress to ensure honest feedback.

### 4.3 Result Card (`ResultCard.tsx`)
- **Visuals:** Success verification green background/check.
- **Elements:** Original size, new size, percentage reduction, download action button, "Process Another" secondary action.

---

## 5. Paywall Components (`src/components/paywall`)

### 5.1 Paywall Grid (`Paywall.tsx` & `PaywallCard.tsx`)
- **Visuals:** Minimalist comparison layout, no fake countdowns.
- **Cards:**
  - `single`: One-off paid export ($2.99).
  - `24h`: 24-hour pass ($5.99, "No subscription. No automatic renewal" helper text).
  - `pro`: Monthly subscription ($9.99, "Best for repeat use").

---

## 🌐 Localization & RTL Expectations
1. **Flex direction & Grid mirroring:** Flexbox rows and grid systems will use logical styling (e.g. `start` and `end` instead of `left` and `right`) to work natively when `dir="rtl"` is set on `<html>` for Arabic.
2. **Typography replacement:** When Arabic language is selected, CSS font-family switches from `Inter` to `Noto Sans Arabic`.
3. **No-mirroring icons:** Global icons like locks (🔒), clouds (☁), and checkmarks (✓) must remain unmirrored, whereas navigation arrows are mirrored.
