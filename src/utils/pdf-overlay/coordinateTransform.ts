import { WatermarkPositionPreset } from "./types";

export interface WatermarkBounds {
  width: number;
  height: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export interface CalculatedCoordinates {
  x: number;
  y: number;
}

/**
 * Calculates the bounding box dimensions of a watermark rotated by angleDegrees.
 */
export function getRotatedWatermarkBounds(
  width: number,
  height: number,
  angleDegrees: number
): WatermarkBounds {
  const rad = (angleDegrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  };
}

/**
 * Calculates bottom-left origin PDF page coordinates (x, y) for watermark placement.
 * Accounts for rotated watermark bounding box.
 */
export function calculateWatermarkCoordinates(
  positionPreset: WatermarkPositionPreset,
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  customX?: number,
  customY?: number,
  margin: number = 36, // 0.5 inch margin in points
  rotationAngle: number = 0
): CalculatedCoordinates {
  const rotBounds = getRotatedWatermarkBounds(markBounds.width, markBounds.height, rotationAngle);
  const { width: pageW, height: pageH } = pageDim;
  const { width: markW, height: markH } = rotBounds;

  switch (positionPreset) {
    case "center":
      return {
        x: Math.max(margin, (pageW - markW) / 2),
        y: Math.max(margin, (pageH - markH) / 2),
      };

    case "top-left":
      return {
        x: margin,
        y: Math.max(margin, pageH - markH - margin),
      };

    case "top-right":
      return {
        x: Math.max(margin, pageW - markW - margin),
        y: Math.max(margin, pageH - markH - margin),
      };

    case "bottom-left":
      return {
        x: margin,
        y: margin,
      };

    case "bottom-right":
      return {
        x: Math.max(margin, pageW - markW - margin),
        y: margin,
      };

    case "custom":
      return {
        x: customX !== undefined ? customX : Math.max(margin, (pageW - markW) / 2),
        y: customY !== undefined ? customY : Math.max(margin, (pageH - markH) / 2),
      };

    default:
      return {
        x: Math.max(margin, (pageW - markW) / 2),
        y: Math.max(margin, (pageH - markH) / 2),
      };
  }
}

/**
 * Generates tiled grid coordinates across page dimensions for "tile" position preset.
 */
export function generateTileGridCoordinates(
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  paddingX: number = 72,
  paddingY: number = 72,
  rotationAngle: number = 0
): CalculatedCoordinates[] {
  const rotBounds = getRotatedWatermarkBounds(markBounds.width, markBounds.height, rotationAngle);
  const coords: CalculatedCoordinates[] = [];
  const stepX = rotBounds.width + paddingX;
  const stepY = rotBounds.height + paddingY;

  for (let y = 36; y < pageDim.height - rotBounds.height; y += stepY) {
    for (let x = 36; x < pageDim.width - rotBounds.width; x += stepX) {
      coords.push({ x, y });
    }
  }

  if (coords.length === 0) {
    coords.push({
      x: Math.max(18, (pageDim.width - rotBounds.width) / 2),
      y: Math.max(18, (pageDim.height - rotBounds.height) / 2),
    });
  }

  return coords;
}
