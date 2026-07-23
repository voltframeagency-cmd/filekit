# Competitor Visual-System & Graphic Design Comparison

## 1. Aesthetic Archetypes

Across the 13 audited competitors, four distinct visual system archetypes emerge:

### A. Corporate Authority Archetype (Adobe Acrobat, iLovePDF)
- **Visual Design**: High contrast red/white branding, deep slate text (`#0F172A`), rigid grid alignments.
- **Graphic Assets**: Precision thin-line vector icons, brand logo watermarks, professional card contours.
- **Typography**: Geometric sans-serifs (`Adobe Clean`, `Inter`) with bold headers (`700`).

### B. Friendly SaaS Archetype (Smallpdf, TinyWow, Sejda)
- **Visual Design**: Vibrant pastel accent colors (Electric Blue, Soft Pink, Sunflower Yellow, Mint Green), generous whitespace, rounded container corners (`16px`).
- **Graphic Assets**: Floating 3D geometric shapes, playful illustrations, soft ambient drop shadows.
- **Typography**: Friendly rounded sans-serifs (`Circular`, `Plus Jakarta Sans`).

### C. Developer & Dark Theme Archetype (CloudConvert, Squoosh, OptiPic)
- **Visual Design**: Dark slate backgrounds (`#18181B` / `#1A1A1A`), high-contrast crimson/magenta primary accents (`#E11D48` / `#EE2A7B`).
- **Graphic Assets**: Interactive format nodes (`[Format A] -> [Format B]`), code block previews, split-screen slider dividers.
- **Typography**: Precision monospace data displays alongside clean geometric sans headers.

### D. Utilitarian Portal Archetype (PDF24 Tools, FreeConvert, ZenDocs, PDFAid)
- **Visual Design**: Dense 3-to-8 column card grids, soft blue/gray canvas backgrounds, functional borders.
- **Graphic Assets**: Hand-drawn mascot illustrations (PDF24 sheep mascot), simple dashed dropzone boxes.
- **Typography**: Standard system sans-serifs (`Arial`, `Roboto`, `Inter`).

---

## 2. Icon & SVG System Analysis

| Competitor | SVG Icon Style | Rendered Size | Scaling & Accessibility |
|---|---|---|---|
| **iLovePDF** | Two-tone pastel rounded square badges | 36×36 px | SVG vector glyphs, `aria-hidden="true"` |
| **Smallpdf** | Multi-color pastel square tiles | 40×40 px | High resolution SVG tiles, semantic alt labels |
| **Adobe Acrobat** | Thin-line red/slate vector outlines | 24×24 px | Monochromatic SVG icons with subtle red nodes |
| **PDF24 Tools** | Hand-drawn sheep mascot illustrations | 48×48 px | Raster PNG / SVG illustrations |
| **CloudConvert** | Dark mode crimson action glyphs | 20×20 px | Crisp vector inline SVGs, keyboard focusable |
| **Squoosh** | Open source pink action icons | 24×24 px | Accessible SVG icons with full keyboard aria attributes |
| **PDFAid** | Red checkmark badges & cloud upload icon | 32×32 px | SVG checkmarks and upload graphics |

---

## 3. Visual System Recommendations for FileKit

1. **Maintain FileKit Brand Palette**: Midnight Ink (`#0F172A`), Cobalt Blue (`#2563EB`), Whitespace (`#FFFFFF`).
2. **Standardized Card Badges**: Adopt iLovePDF/Smallpdf-style two-tone pastel icon badges for tool cards to establish immediate visual recognition.
3. **High-Contrast Dropzone**: Combine CloudConvert's dark slate dropzone border with PDFAid's 2-column trust checkmark layout.
