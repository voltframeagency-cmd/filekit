"use client";

import React, { useState } from "react";
import { PageOperationItem } from "@/utils/pdf-editor/types";
import { PdfPageThumbnail } from "./PdfPageThumbnail";

interface PdfPageThumbnailGridProps {
  items: PageOperationItem[];
  documentBuffers: Uint8Array[];
  onRotate: (id: string, direction: "cw" | "ccw") => void;
  onToggleDelete: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const PdfPageThumbnailGrid: React.FC<PdfPageThumbnailGridProps> = ({
  items,
  documentBuffers,
  onRotate,
  onToggleDelete,
  onToggleSelect,
  onReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-xl border border-slate-800">
        No pages to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
      {items.map((item, index) => {
        const docBuffer = documentBuffers[item.sourceDocIndex];
        const isDraggingThis = draggedIndex === index;
        const isDragOverThis = dragOverIndex === index;

        return (
          <div
            key={item.id}
            draggable={!item.isDeleted}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`transition-all duration-150 cursor-grab active:cursor-grabbing ${
              isDraggingThis ? "opacity-30 scale-95" : ""
            } ${
              isDragOverThis
                ? "border-2 border-dashed border-blue-500 scale-105 rounded-xl"
                : ""
            }`}
          >
            <PdfPageThumbnail
              item={item}
              docBuffer={docBuffer}
              displayIndex={index}
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
