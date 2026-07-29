<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:filekit-asset-rules -->
# FileKit SVG Theming and Optimization Rules

## Asset Delivery Modes
- **Route Illustrations & Multi-color Conversion Graphics**: Static optimized SVGs under `public/brand-assets/`.
- **Single-color & Theme-Sensitive Interface Icons**: Inline React SVG components using `currentColor` or CSS theme tokens (`--icon-primary`, `--icon-muted`, etc.).
- **Animated Processing Icons**: Inline SVG components driven by CSS animations.

## Dark Mode Behavior
- Do NOT rely on `currentColor` inside SVG files loaded via `<img>` tags (it does not inherit page CSS across shadow/img boundary).
- Use inline React SVG components when icons require theme adaptation.
- File format colors remain **fixed** across light/dark themes:
  - PDF: `#FF4D4F`
  - Word: `#2563EB`
  - Excel: `#22A06B`
  - Image: `#8B7CF6`

## SVGO Optimization Safeguards
- `removeDimensions: true`, `removeViewBox: false` (preserve `viewBox`).
- `prefixIds: true` (prevent ID collisions across inline SVGs).
- Preserve accessibility titles/descriptions and gradients/masks/clip paths.
- No external font or raster image dependencies.
<!-- END:filekit-asset-rules -->

