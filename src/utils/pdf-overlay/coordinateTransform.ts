import { WatermarkConfig, WatermarkPositionPreset } from "./types";

export interface WatermarkBounds {
  width: number;
  height: number;
}

export interface RotatedWatermarkBounds extends WatermarkBounds {
  originOffsetX: number;
  originOffsetY: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export interface PageCropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatermarkPlacementItem {
  visualX: number; // PDF points (visual placement)
  visualY: number; // PDF points (visual placement)
  x: number; // Alias for visualX
  y: number; // Alias for visualY
  width: number; // PDF points
  height: number; // PDF points
  rotationDegrees: number;
}

// Standard Type 1 Helvetica-Bold Glyph Widths (per 1000 units of text size)
const HELVETICA_BOLD_WIDTHS: Record<number, number> = {
  32: 278, 33: 333, 34: 474, 35: 556, 36: 556, 37: 889, 38: 722, 39: 238,
  40: 333, 41: 333, 42: 389, 43: 584, 44: 278, 45: 333, 46: 278, 47: 278,
  48: 556, 49: 556, 50: 556, 51: 556, 52: 556, 53: 556, 54: 556, 55: 556, 56: 556, 57: 556,
  58: 333, 59: 333, 60: 584, 61: 584, 62: 584, 63: 556, 64: 975,
  65: 722, 66: 722, 67: 722, 68: 722, 69: 667, 70: 611, 71: 778, 72: 778, 73: 278,
  74: 556, 75: 722, 76: 611, 77: 833, 78: 722, 79: 778, 80: 667, 81: 778, 82: 722,
  83: 667, 84: 611, 85: 722, 86: 667, 87: 944, 88: 667, 89: 667, 90: 611,
  97: 556, 98: 611, 99: 556, 100: 611, 101: 556, 102: 333, 103: 611, 104: 611, 105: 278,
  106: 278, 107: 556, 108: 278, 109: 833, 110: 611, 111: 611, 112: 611, 113: 611, 114: 389,
  115: 556, 116: 333, 117: 611, 118: 556, 119: 778, 120: 556, 121: 556, 122: 500
};

/**
 * Deterministically measures the exact text width of Helvetica-Bold in PDF points.
 */
export function measureHelveticaBoldTextWidth(text: string, fontSize: number): number {
  if (!text) return 0;
  let totalUnits = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const unitWidth = HELVETICA_BOLD_WIDTHS[code] || 600;
    totalUnits += unitWidth;
  }
  return (totalUnits * fontSize) / 1000;
}

/**
 * Calculates rotated watermark dimensions and origin offsets across all 4 rotated corner vertices.
 */
export function getRotatedWatermarkBoundsWithOffsets(
  w: number,
  h: number,
  angleDegrees: number
): RotatedWatermarkBounds {
  const rad = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Four vertices of unrotated rectangle around (0,0) origin
  const v1 = { x: 0, y: 0 };
  const v2 = { x: w * cos, y: w * sin };
  const v3 = { x: -h * sin, y: h * cos };
  const v4 = { x: w * cos - h * sin, y: w * sin + h * cos };

  const xs = [v1.x, v2.x, v3.x, v4.x];
  const ys = [v1.y, v2.y, v3.y, v4.y];

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    width: maxX - minX,
    height: maxY - minY,
    originOffsetX: -minX,
    originOffsetY: -minY,
  };
}

export function getRotatedWatermarkBounds(
  width: number,
  height: number,
  angleDegrees: number
): WatermarkBounds {
  const res = getRotatedWatermarkBoundsWithOffsets(width, height, angleDegrees);
  return { width: res.width, height: res.height };
}

/**
 * Converts visual watermark angle to raw PDF stream drawing angle accounting for page rotation (/Rotate 0, 90, 180, 270 deg).
 */
export function convertVisualToRawDrawingAngle(
  visualAngle: number,
  pageRotationAngle: number
): number {
  const normPageRot = ((pageRotationAngle % 360) + 360) % 360;
  const rawAngle = (visualAngle - normPageRot + 360) % 360;
  return rawAngle;
}

/**
 * Maps visual page placement coordinates (xVisual, yVisual) to raw PDF stream coordinates accounting for /Rotate (0, 90, 180, 270 deg) and CropBox origin.
 */
export function transformVisualToPdfCoordinates(
  xVisual: number,
  yVisual: number,
  markW: number,
  markH: number,
  pageW: number,
  pageH: number,
  rawW: number = pageW,
  rawH: number = pageH,
  rotationAngle: number = 0,
  cropBox: PageCropBox = { x: 0, y: 0, width: rawW, height: rawH }
): { x: number; y: number } {
  const normAngle = ((rotationAngle % 360) + 360) % 360;
  let x = cropBox.x + xVisual;
  let y = cropBox.y + yVisual;

  switch (normAngle) {
    case 90:
      x = cropBox.x + yVisual;
      y = cropBox.y + (pageW - xVisual - markW);
      break;
    case 180:
      x = cropBox.x + (pageW - xVisual - markW);
      y = cropBox.y + (pageH - yVisual - markH);
      break;
    case 270:
      x = cropBox.x + (pageH - yVisual - markH);
      y = cropBox.y + xVisual;
      break;
    case 0:
    default:
      x = cropBox.x + xVisual;
      y = cropBox.y + yVisual;
      break;
  }

  return { x, y };
}

/**
 * Single Unified Placement Algorithm shared between Preview & Export Engine.
 * Supports both signature types:
 * 1) buildWatermarkPlacementPlan(config, pageDim, markBounds, margin)
 * 2) buildWatermarkPlacementPlan(config, rawW, rawH, pageRotation, cropBox, margin)
 */
export function buildWatermarkPlacementPlan(
  config: WatermarkConfig,
  param2: PageDimensions | number,
  param3: WatermarkBounds | number,
  param4: number = 0,
  param5?: PageCropBox | number,
  param6: number = 36
): WatermarkPlacementItem[] {
  let pageW = 600;
  let pageH = 800;
  let markWidth = 100;
  let markHeight = 30;
  let pageRotation = 0;
  let cropBox: PageCropBox | undefined;
  let margin = 36;

  if (typeof param2 === "object" && param2 !== null && typeof param3 === "object" && param3 !== null) {
    // Signature 1: (config, pageDim, markBounds, margin)
    pageW = param2.width;
    pageH = param2.height;
    markWidth = param3.width;
    markHeight = param3.height;
    margin = typeof param4 === "number" && param4 > 0 ? param4 : 36;
  } else {
    // Signature 2: (config, rawW, rawH, pageRotation, cropBox, margin)
    const rawW = param2 as number;
    const rawH = param3 as number;
    pageRotation = param4 as number;
    cropBox = typeof param5 === "object" ? param5 : undefined;
    margin = typeof param6 === "number" ? param6 : 36;

    const normAngle = ((pageRotation % 360) + 360) % 360;
    pageW = cropBox ? cropBox.width : rawW;
    pageH = cropBox ? cropBox.height : rawH;

    if (normAngle === 90 || normAngle === 270) {
      const tmp = pageW;
      pageW = pageH;
      pageH = tmp;
    }

    if (config.type === "text" && config.text) {
      const fontSize = config.fontSize || 36;
      markWidth = measureHelveticaBoldTextWidth(config.text, fontSize);
      markHeight = fontSize * 0.9;
    }
  }

  const rotationDegrees = config.rotationAngle || 0;
  const rotBounds = getRotatedWatermarkBoundsWithOffsets(markWidth, markHeight, rotationDegrees);
  const { width: markW, height: markH, originOffsetX, originOffsetY } = rotBounds;

  if (config.positionPreset === "tile") {
    const coordsList: Array<{ x: number; y: number }> = [];
    const stepX = markW + 80;
    const stepY = markH + 80;

    for (let y = margin; y <= pageH - markH; y += stepY) {
      for (let x = margin; x <= pageW - markW; x += stepX) {
        coordsList.push({ x: x + originOffsetX, y: y + originOffsetY });
      }
    }

    if (coordsList.length === 0) {
      coordsList.push({
        x: Math.max(margin, (pageW - markW) / 2) + originOffsetX,
        y: Math.max(margin, (pageH - markH) / 2) + originOffsetY,
      });
    }

    return coordsList.map((c) => ({
      visualX: c.x,
      visualY: c.y,
      x: c.x,
      y: c.y,
      width: markWidth,
      height: markHeight,
      rotationDegrees,
    }));
  }

  let x = Math.max(margin, (pageW - markW) / 2);
  let y = Math.max(margin, (pageH - markH) / 2);

  switch (config.positionPreset) {
    case "top-left":
      x = margin;
      y = Math.max(margin, pageH - markH - margin);
      break;

    case "top-right":
      x = Math.max(margin, pageW - markW - margin);
      y = Math.max(margin, pageH - markH - margin);
      break;

    case "bottom-left":
      x = margin;
      y = margin;
      break;

    case "bottom-right":
      x = Math.max(margin, pageW - markW - margin);
      y = margin;
      break;

    case "custom":
      x = config.customX ?? margin;
      y = config.customY ?? margin;
      break;

    case "center":
    default:
      x = Math.max(margin, (pageW - markW) / 2);
      y = Math.max(margin, (pageH - markH) / 2);
      break;
  }

  const finalX = x + originOffsetX;
  const finalY = y + originOffsetY;

  return [
    {
      visualX: finalX,
      visualY: finalY,
      x: finalX,
      y: finalY,
      width: markWidth,
      height: markHeight,
      rotationDegrees,
    },
  ];
}
