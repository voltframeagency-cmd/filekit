import { PageOperationItem, PageRotation } from "./types";

/**
 * Pure functions for manipulating page state arrays.
 */

export function generateInitialPageItems(
  docIndex: number,
  pageCount: number,
  fileName?: string
): PageOperationItem[] {
  const items: PageOperationItem[] = [];
  for (let i = 0; i < pageCount; i++) {
    items.push({
      id: `doc-${docIndex}-page-${i}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sourceDocIndex: docIndex,
      sourceFileName: fileName || `Document-${docIndex + 1}.pdf`,
      originalPageIndex: i,
      currentRotation: 0,
      isSelected: false,
      isDeleted: false,
    });
  }
  return items;
}

export function reorderPages(
  pages: PageOperationItem[],
  fromIndex: number,
  toIndex: number
): PageOperationItem[] {
  if (
    fromIndex < 0 ||
    fromIndex >= pages.length ||
    toIndex < 0 ||
    toIndex >= pages.length ||
    fromIndex === toIndex
  ) {
    return pages;
  }
  const updated = [...pages];
  const [movedItem] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, movedItem);
  return updated;
}

export function rotatePage(
  pages: PageOperationItem[],
  pageId: string,
  direction: "cw" | "ccw"
): PageOperationItem[] {
  return pages.map((page) => {
    if (page.id !== pageId) return page;
    const delta = direction === "cw" ? 90 : -90;
    let next = (page.currentRotation + delta) % 360;
    if (next < 0) next += 360;
    return { ...page, currentRotation: next as PageRotation };
  });
}

export function toggleDeletePage(
  pages: PageOperationItem[],
  pageId: string
): PageOperationItem[] {
  return pages.map((page) =>
    page.id === pageId ? { ...page, isDeleted: !page.isDeleted } : page
  );
}

export function toggleSelectPage(
  pages: PageOperationItem[],
  pageId: string
): PageOperationItem[] {
  return pages.map((page) =>
    page.id === pageId ? { ...page, isSelected: !page.isSelected } : page
  );
}

export function setAllSelected(
  pages: PageOperationItem[],
  selected: boolean
): PageOperationItem[] {
  return pages.map((page) => ({ ...page, isSelected: selected }));
}

export function invertSelection(
  pages: PageOperationItem[]
): PageOperationItem[] {
  return pages.map((page) => ({ ...page, isSelected: !page.isSelected }));
}

export function bulkRotate(
  pages: PageOperationItem[],
  direction: "cw" | "ccw",
  selectedOnly: boolean
): PageOperationItem[] {
  return pages.map((page) => {
    if (selectedOnly && !page.isSelected) return page;
    const delta = direction === "cw" ? 90 : -90;
    let next = (page.currentRotation + delta) % 360;
    if (next < 0) next += 360;
    return { ...page, currentRotation: next as PageRotation };
  });
}

export function rotateOddPages(
  pages: PageOperationItem[],
  direction: "cw" | "ccw"
): PageOperationItem[] {
  return pages.map((page, index) => {
    // 1-indexed odd pages (index 0, 2, 4...)
    if ((index + 1) % 2 === 0) return page;
    const delta = direction === "cw" ? 90 : -90;
    let next = (page.currentRotation + delta) % 360;
    if (next < 0) next += 360;
    return { ...page, currentRotation: next as PageRotation };
  });
}

export function rotateEvenPages(
  pages: PageOperationItem[],
  direction: "cw" | "ccw"
): PageOperationItem[] {
  return pages.map((page, index) => {
    // 1-indexed even pages (index 1, 3, 5...)
    if ((index + 1) % 2 !== 0) return page;
    const delta = direction === "cw" ? 90 : -90;
    let next = (page.currentRotation + delta) % 360;
    if (next < 0) next += 360;
    return { ...page, currentRotation: next as PageRotation };
  });
}

export function bulkDelete(
  pages: PageOperationItem[],
  selectedOnly: boolean
): PageOperationItem[] {
  return pages.map((page) => {
    if (selectedOnly && !page.isSelected) return page;
    return { ...page, isDeleted: true };
  });
}

export function restoreDeletedPages(
  pages: PageOperationItem[]
): PageOperationItem[] {
  return pages.map((page) => ({ ...page, isDeleted: false }));
}

export function sortPagesByFileName(
  pages: PageOperationItem[]
): PageOperationItem[] {
  return [...pages].sort((a, b) => {
    const nameA = a.sourceFileName || "";
    const nameB = b.sourceFileName || "";
    const comp = nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: "base" });
    if (comp !== 0) return comp;
    return a.originalPageIndex - b.originalPageIndex;
  });
}

export function parsePageRangeString(
  rangeStr: string,
  totalItems: number
): number[] {
  const indices = new Set<number>();
  if (!rangeStr.trim()) return [];

  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalItems, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          indices.add(i - 1); // convert 1-based to 0-based
        }
      }
    } else {
      const val = parseInt(trimmed, 10);
      if (!isNaN(val) && val >= 1 && val <= totalItems) {
        indices.add(val - 1);
      }
    }
  }
  return Array.from(indices).sort((a, b) => a - b);
}
