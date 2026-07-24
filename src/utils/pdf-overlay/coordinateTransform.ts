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
  x: number; // PDF points (visual placement)
  y: number; // PDF points (visual placement)
  width: number; // PDF points
  height: number; // PDF points
  rotationDegrees: number;
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
  rawW: number,
  rawH: number,
  rotationAngle: number = 0,
  cropBox: PageCropBox = { x: 0, y: 0, width: pageW, height: pageH }
): { x: number; y: number; rawDrawingAngle: number } {
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

  return {
    x,
    y,
    rawDrawingAngle: convertVisualToRawDrawingAngle(0, normAngle),
  };
}

/**
 * Single Unified Placement Algorithm shared between Preview & Export Engine.
 * Computes exact PDF point placement items for single or tiled positions within CropBox bounds.
 */
export function buildWatermarkPlacementPlan(
  config: WatermarkConfig,
  pageDim: PageDimensions,
  markBounds: WatermarkBounds,
  margin: number = 36
): WatermarkPlacementItem[] {
  const { width: pageW, height: pageH } = pageDim;
  const rotationDegrees = config.rotationAngle || 0;
  const rotBounds = getRotatedWatermarkBoundsWithOffsets(markBounds.width, markBounds.height, rotationDegrees);
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
      x: x + originOffsetX,
      y: y + originOffsetY,
      width: markBounds.width,
      height: markBounds.height,
      rotationDegrees,
    },
  ];
}

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
