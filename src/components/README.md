# FileKit Components Directory Structure

This folder contains the reusable UI components for FileKit, structured according to Stockholm Utility Minimalism guidelines:

- `common/` - Core UI primitives (Buttons, Badges, Modals, Loading Spinnings, Tooltips).
- `upload/` - Upload workspace-specific components (Drag & Drop Zone, File Cards, File list, upload progress bar).
- `workspace/` - Interactive file modification controls (Settings panel, processing result summary, preview elements).
- `layout/` - Shell elements (Header with language selectors, Footer with privacy policy links, navigation grids).
- `paywall/` - Result-first monetization cards, pricing grids, billing passes.

## Design System Tokens
All components must use variables defined in `globals.css` or via Tailwind class extensions (e.g., `bg-fk-bg`, `text-fk-text`, `rounded-fk-md`).
