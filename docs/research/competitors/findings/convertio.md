# Convertio Competitor Audit Findings

## 1. Overview
- **Slug**: `convertio`
- **URL**: `https://convertio.co`
- **Category**: Universal File Converter
- **Audited Tools**: Image Converter, Document Converter, PDF to Image, Image to PDF.

## 2. Interaction & Workflow Analysis
- **Clicks to Upload**: 1 click (`Choose Files`).
- **Clicks to Process**: 1 click (`Convert`).
- **Clicks to Download**: 1 click (`Download` / `Download All ZIP`).
- **Batch Processing**: Excellent multi-file batch queue with per-file format dropdowns.

## 3. Visual System & Components
- **Color Palette**: Dark Gray (`#212529`), Crimson Accent (`#E53935`), Light Gray File Rows (`#F8F9FA`).
- **UI Architecture**: Table-based batch queue showing filename, file size, target format dropdown, gear settings icon, and conversion status.

## 4. Monetization & Trust Communication
- **Monetization**: Free tier limited to 100 MB max file size per file; subscription required for larger files or unlimited concurrent tasks.
- **Trust Messaging**: 24-hour file deletion policy.

## 5. FileKit Recommendations
- **ADAPT**: Batch queue layout showing file size, format dropdowns, and individual/ZIP download actions.
