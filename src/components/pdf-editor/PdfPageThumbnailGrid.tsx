"use client";

import React from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PageOperationItem } from "@/utils/pdf-editor/types";
import { PdfPageThumbnail } from "./PdfPageThumbnail";

interface PdfPageThumbnailGridProps {
  items: PageOperationItem[];
  documentBuffers: Uint8Array[];
  pdfDocProxies?: Record<number, pdfjsLib.PDFDocumentProxy>;
  onRotate: (id: string, direction: "cw" | "ccw") => void;
  onToggleDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const PdfPageThumbnailGrid: React.FC<PdfPageThumbnailGridProps> = ({
  items,
  documentBuffers,
  pdfDocProxies = {},
  onRotate,
  onToggleDelete,
  onToggleSelect,
  onReorder,
}) => {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData("text/plain");
    if (!fromIndexStr) return;
    const fromIndex = parseInt(fromIndexStr, 10);
    if (!isNaN(fromIndex)) {
      onReorder(fromIndex, toIndex);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
      {items.map((item, idx) => {
        const docBuffer = documentBuffers[item.sourceDocIndex];
        const pdfProxy = pdfDocProxies[item.sourceDocIndex] || null;

        return (
          <div
            key={item.id}
            draggable={!item.isDeleted}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, idx)}
            className="cursor-move"
          >
            <PdfPageThumbnail
              item={item}
              docBuffer={docBuffer}
              pdfDocProxy={pdfProxy}
              displayIndex={idx}
              totalDisplayPages={items.length}
              onRotate={onRotate}
              onToggleDelete={onToggleDelete}
              onToggleSelect={onToggleSelect}
              onMovePage={onReorder}
            />
          </div>
        );
      })}
    </div>
  );
};
