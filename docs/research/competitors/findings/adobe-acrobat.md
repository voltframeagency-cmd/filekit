# Adobe Acrobat Online Competitor Audit Findings

## 1. Overview
- **Slug**: `adobe-acrobat`
- **URL**: `https://www.adobe.com/acrobat/online.html`
- **Category**: Enterprise PDF Suite
- **Audited Tools**: Compress PDF, Merge PDF, Fill & Sign, PDF to Word, PDF to JPG.

## 2. Interaction & Workflow Analysis
- **Clicks to Upload**: 1 click (`Select a file`).
- **Clicks to Process**: 1 click (`Compress` / `Convert`).
- **Clicks to Download**: **Blocked by mandatory Account Sign-In**.
- **Source File Retention**: File is held in cloud storage if signed in; lost if non-authenticated.
- **Live Preview**: PDF document layout viewer.

## 3. Visual System & Components
- **Color Palette**: Adobe Red (`#FA0F00`), Clean White background, Dark Gray text (`#2C2C2C`).
- **Typography**: Corporate Adobe Clean typeface.
- **Card System**: Structured rectangular outline containers with thin-line vector icons.

## 4. Monetization & Trust Communication
- **Monetization Trap**: Mandatory **Adobe Sign-In / Account Creation wall** before downloading converted files. High user drop-off.
- **Trust Messaging**: Leveraging legacy authority (*"From Adobe, the inventor of the PDF format"*).

## 5. FileKit Recommendations
- **AVOID**: Mandatory sign-in gates before download.
- **ADAPT**: Clear category tabs (`Generative AI`, `Convert`, `Edit`, `Sign & Protect`).
