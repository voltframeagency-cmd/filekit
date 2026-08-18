export interface ExtractedImageItem {
  id: string;
  pageIndex: number;
  width: number;
  height: number;
  format: "png" | "jpeg";
  data: Uint8Array;
  sizeBytes: number;
}

export interface BlankPageOptions {
  position: "start" | "end" | "after-each" | "custom";
  customPageIndex?: number; // 1-indexed
  pageWidth?: number;
  pageHeight?: number;
}

export interface DuplicatePagesOptions {
  mode: "all-consecutive" | "all-appended" | "selected";
  selectedPageNumbers?: number[]; // 1-indexed
}

export interface PdfTextExtractionResult {
  text: string;
  pageCount: number;
  pageTexts: string[];
}
