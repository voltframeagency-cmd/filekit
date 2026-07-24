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
 * Calculates bottom-left origin PDF page coordinates (x, y) for watermark placement.
 */
export function calculateWatermarkCoordinates(
  positionPreset: WatermarkPositionPreset,
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  customX?: number,
  customY?: number,
  margin: number = 36 // 0.5 inch margin in points
): CalculatedCoordinates {
  const { width: pageW, height: pageH } = pageDim;
  const { width: markW, height: markH } = markBounds;

  switch (positionPreset) {
    case "center":
      return {
        x: (pageW - markW) / 2,
        y: (pageH - markH) / 2,
      };

    case "top-left":
      return {
        x: margin,
        y: pageH - markH - margin,
      };

    case "top-right":
      return {
        x: pageW - markW - margin,
        y: pageH - markH - margin,
      };

    case "bottom-left":
      return {
        x: margin,
        y: margin,
      };

    case "bottom-right":
      return {
        x: pageW - markW - margin,
        y: margin,
      };

    case "custom":
      return {
        x: customX !== undefined ? customX : (pageW - markW) / 2,
        y: customY !== undefined ? customY : (pageH - markH) / 2,
      };

    default:
      return {
        x: (pageW - markW) / 2,
        y: (pageH - markH) / 2,
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
  paddingY: number = 72
): CalculatedCoordinates[] {
  const coords: CalculatedCoordinates[] = [];
  const stepX = markBounds.width + paddingX;
  const stepY = markBounds.height + paddingY;

  for (let y = 36; y < pageDim.height - markBounds.height; y += stepY) {
    for (let x = 36; x < pageDim.width - markBounds.width; x += stepX) {
      coords.push({ x, y });
    }
  }

  if (coords.length === 0) {
    coords.push({
      x: (pageDim.width - markBounds.width) / 2,
      y: (pageDim.height - markBounds.height) / 2,
    });
  }

  return coords;
}
