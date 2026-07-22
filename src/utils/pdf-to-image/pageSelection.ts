export interface PageSelectionParseResult {
  isValid: boolean;
  pageNumbers: number[];
  error?: string;
}

export class PageSelectionParser {
  static parse(input: string, totalPages: number): PageSelectionParseResult {
    if (!input || input.trim() === "") {
      return {
        isValid: false,
        pageNumbers: [],
        error: "Page selection cannot be empty."
      };
    }

    const trimmed = input.trim();
    if (trimmed.toLowerCase() === "all") {
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
      return { isValid: true, pageNumbers };
    }

    const set = new Set<number>();
    const parts = trimmed.split(",");

    for (const part of parts) {
      const token = part.trim();
      if (!token) continue;

      if (token.includes("-")) {
        const rangeParts = token.split("-");
        if (rangeParts.length !== 2) {
          return {
            isValid: false,
            pageNumbers: [],
            error: `Invalid page range expression '${token}'.`
          };
        }

        const start = parseInt(rangeParts[0].trim(), 10);
        const end = parseInt(rangeParts[1].trim(), 10);

        if (isNaN(start) || isNaN(end) || start <= 0 || end <= 0 || start > end) {
          return {
            isValid: false,
            pageNumbers: [],
            error: `Invalid page range bounds '${token}'.`
          };
        }

        for (let i = start; i <= end; i++) {
          if (i <= totalPages) {
            set.add(i);
          }
        }
      } else {
        const num = parseInt(token, 10);
        if (isNaN(num) || num <= 0) {
          return {
            isValid: false,
            pageNumbers: [],
            error: `Invalid page number '${token}'.`
          };
        }

        if (num > totalPages) {
          return {
            isValid: false,
            pageNumbers: [],
            error: `Page number ${num} exceeds total document pages (${totalPages}).`
          };
        }

        set.add(num);
      }
    }

    const sorted = Array.from(set).sort((a, b) => a - b);
    if (sorted.length === 0) {
      return {
        isValid: false,
        pageNumbers: [],
        error: "No valid pages were selected."
      };
    }

    return {
      isValid: true,
      pageNumbers: sorted
    };
  }

  static formatSelection(pages: number[], totalPages: number): string {
    if (pages.length === totalPages) return "All pages";
    if (pages.length === 1) return `Page ${pages[0]}`;
    if (pages.length <= 5) return `Pages ${pages.join(", ")}`;
    return `${pages.length} selected pages`;
  }
}
