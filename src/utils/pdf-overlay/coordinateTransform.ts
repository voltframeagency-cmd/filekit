import { WatermarkConfig, WatermarkPositionPreset } from "./types";

export interface WatermarkBounds {
  width: number;
  height: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export interface WatermarkPlacementItem {
  x: number; // PDF points (bottom-left origin)
  y: number; // PDF points (bottom-left origin)
  width: number; // PDF points
  height: number; // PDF points
  rotationDegrees: number;
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
 * Single Unified Placement Algorithm shared between Preview & Export Engine.
 * Computes exact PDF point placement items for single or tiled positions.
 */
export function buildWatermarkPlacementPlan(
  config: WatermarkConfig,
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  margin: number = 36
): WatermarkPlacementItem[] {
  const { width: pageW, height: pageH } = pageDim;
  const rotationDegrees = config.rotationAngle || 0;
  const rotBounds = getRotatedWatermarkBounds(markBounds.width, markBounds.height, rotationDegrees);
  const { width: markW, height: markH } = rotBounds;

  if (config.positionPreset === "tile") {
    const coordsList: Array<{ x: number; y: number }> = [];
    const stepX = markW + 80;
    const stepY = markH + 80;

    for (let y = margin; y <= pageH - markH; y += stepY) {
      for (let x = margin; x <= pageW - markW; x += stepX) {
        coordsList.push({ x, y });
      }
    }

    if (coordsList.length === 0) {
      coordsList.push({
        x: Math.max(margin, (pageW - markW) / 2),
        y: Math.max(margin, (pageH - markH) / 2),
      });
    }

    return coordsList.map((c) => ({
      x: c.x,
      y: c.y,
      width: markBounds.width,
      height: markBounds.height,
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
      x = config.customX !== undefined ? config.customX : Math.max(margin, (pageW - markW) / 2);
      y = config.customY !== undefined ? config.customY : Math.max(margin, (pageH - markH) / 2);
      break;

    case "center":
    default:
      x = Math.max(margin, (pageW - markW) / 2);
      y = Math.max(margin, (pageH - markH) / 2);
      break;
  }

  return [
    {
      x,
      y,
      width: markBounds.width,
      height: markBounds.height,
      rotationDegrees,
    },
  ];
}

/**
 * Retained for backwards compatibility in existing utility calls.
 */
export function calculateWatermarkCoordinates(
  positionPreset: WatermarkPositionPreset,
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  customX?: number,
  customY?: number,
  margin: number = 36,
  rotationAngle: number = 0
): { x: number; y: number } {
  const plan = buildWatermarkPlacementPlan(
    { positionPreset, customX, customY, rotationAngle } as any,
    pageDim,
    markBounds,
    margin
  );
  return { x: plan[0].x, y: plan[0].y };
}

export function generateTileGridCoordinates(
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  paddingX: number = 72,
  paddingY: number = 72,
  rotationAngle: number = 0
): Array<{ x: number; y: number }> {
  const plan = buildWatermarkPlacementPlan(
    { positionPreset: "tile", rotationAngle } as any,
    pageDim,
    markBounds,
    36
  );
  return plan.map((item) => ({ x: item.x, y: item.y }));
}
