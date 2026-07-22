import { ImageToPdfMargin, ImageToPdfOrientation, ImageToPdfPageSize, ImageToPdfPlacement } from "./types";

export interface PageBounds {
  pageWidth: number; // in PDF points (1/72 inch)
  pageHeight: number; // in PDF points
  marginPt: number;
}

export interface ImageDrawBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class PageLayoutCalculator {
  static getMarginPoints(margin: ImageToPdfMargin): number {
    switch (margin) {
      case "NONE":
        return 0;
      case "SMALL":
        return 18; // 0.25 inch
      case "MEDIUM":
        return 36; // 0.5 inch
    }
  }

  static calculatePageBounds(
    pageSize: ImageToPdfPageSize,
    orientation: ImageToPdfOrientation,
    margin: ImageToPdfMargin,
    imageWidth: number,
    imageHeight: number,
    rotation: 0 | 90 | 180 | 270
  ): PageBounds {
    const marginPt = this.getMarginPoints(margin);

    // Account for effective image orientation after rotation
    const effectiveWidth = rotation === 90 || rotation === 270 ? imageHeight : imageWidth;
    const effectiveHeight = rotation === 90 || rotation === 270 ? imageWidth : imageHeight;

    if (pageSize === "FIT_IMAGE") {
      // Natural image dimensions in points (assuming 72 DPI base scale)
      return {
        pageWidth: effectiveWidth + marginPt * 2,
        pageHeight: effectiveHeight + marginPt * 2,
        marginPt
      };
    }

    // Standard page dimensions (A4 or Letter) in points
    let baseWidth = pageSize === "A4" ? 595.28 : 612; // A4: 210x297mm, Letter: 8.5x11 in
    let baseHeight = pageSize === "A4" ? 841.89 : 792;

    let isLandscape = false;
    if (orientation === "AUTO") {
      isLandscape = effectiveWidth > effectiveHeight;
    } else if (orientation === "LANDSCAPE") {
      isLandscape = true;
    }

    const pageWidth = isLandscape ? Math.max(baseWidth, baseHeight) : Math.min(baseWidth, baseHeight);
    const pageHeight = isLandscape ? Math.min(baseWidth, baseHeight) : Math.max(baseWidth, baseHeight);

    return {
      pageWidth,
      pageHeight,
      marginPt
    };
  }

  static calculateImageDrawBounds(
    pageBounds: PageBounds,
    placement: ImageToPdfPlacement,
    imageWidth: number,
    imageHeight: number,
    rotation: 0 | 90 | 180 | 270
  ): ImageDrawBounds {
    const { pageWidth, pageHeight, marginPt } = pageBounds;
    const availWidth = pageWidth - marginPt * 2;
    const availHeight = pageHeight - marginPt * 2;

    const effectiveWidth = rotation === 90 || rotation === 270 ? imageHeight : imageWidth;
    const effectiveHeight = rotation === 90 || rotation === 270 ? imageWidth : imageHeight;

    const imgAspect = effectiveWidth / effectiveHeight;
    const availAspect = availWidth / availHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (placement === "CONTAIN") {
      if (imgAspect > availAspect) {
        drawWidth = availWidth;
        drawHeight = availWidth / imgAspect;
      } else {
        drawHeight = availHeight;
        drawWidth = availHeight * imgAspect;
      }
    } else {
      // COVER (Fill page, may crop)
      if (imgAspect > availAspect) {
        drawHeight = availHeight;
        drawWidth = availHeight * imgAspect;
      } else {
        drawWidth = availWidth;
        drawHeight = availWidth / imgAspect;
      }
    }

    // Center image within available margin area
    const x = marginPt + (availWidth - drawWidth) / 2;
    const y = marginPt + (availHeight - drawHeight) / 2;

    return {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    };
  }
}
