export interface OcrWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OcrLine {
  text: string;
  words: OcrWord[];
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OcrPageResult {
  pageNumber: number;
  width: number;
  height: number;
  text: string;
  lines: OcrLine[];
}

export interface OcrExecutionResult {
  fileName: string;
  totalPages: number;
  pages: OcrPageResult[];
  fullText: string;
  searchablePdfBuffer?: ArrayBuffer;
  durationMs: number;
}
