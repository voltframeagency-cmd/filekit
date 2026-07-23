# Squoosh Competitor Audit Findings

## 1. Overview
- **Slug**: `squoosh`
- **URL**: `https://squoosh.app`
- **Category**: 100% Client-Side Image Compressor (Google Chrome Labs)
- **Audited Tools**: Image Compression, WebP/AVIF/MozJPEG Encoding.

## 2. Interaction & Workflow Analysis
- **Clicks to Upload**: 1 click (Drop image or click upload).
- **Clicks to Process**: **0 clicks (Instant auto-encoding upon file drop)**.
- **Clicks to Download**: 1 click (`Download`).
- **Live Preview**: Interactive side-by-side split-screen comparison bar. Adjusting quality sliders debounces in 150ms with instant visual and file size delta feedback.
- **Source File Retention**: Original image buffer is retained in local browser memory; settings can be adjusted continuously without re-uploading.

## 3. Visual System & Components
- **Color Palette**: Dark Slate (`#1A1A1A`), Vibrant Pink/Magenta accent (`#EE2A7B`).
- **Architecture**: 100% WebAssembly & Web Workers. Operates offline after initial load.

## 4. Monetization & Trust Communication
- **Monetization**: 100% Open Source; zero ads, zero paywalls, zero accounts.
- **Trust Messaging**: *"Your images never leave your browser"*.

## 5. FileKit Recommendations
- **ADOPT**: 100% in-memory source buffer retention, client-side zero-upload privacy trust messaging, debounced control updates.
- **ADAPT**: Side-by-side image comparison bar.
