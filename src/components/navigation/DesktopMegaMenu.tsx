"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNavItem } from "@/config/navigation";

export interface DesktopMegaMenuProps {
  navItem: TopNavItem;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function DesktopMegaMenu({
  navItem,
  isOpen,
  onClose,
  triggerRef
}: DesktopMegaMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const megaMenu = navItem.megaMenu;
  if (!megaMenu || !isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      // Ignore clicks on trigger button or its children
      if (target instanceof Element && target.closest(`[aria-controls="${megaMenu.id}"]`)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Use setTimeout so the current click/mousedown that opened the menu does not trigger close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, triggerRef, megaMenu.id]);

  return (
    <div
      id={megaMenu.id}
      ref={menuRef}
      role="region"
      aria-label={megaMenu.label}
      className="absolute top-full ltr:left-0 rtl:right-0 mt-2 w-[540px] bg-white border border-fk-border rounded-fk-xl p-6 shadow-md z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="grid grid-cols-2 gap-8">
        {megaMenu.groups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-fk-text-subtle uppercase tracking-wider">
              {group.title}
            </span>

            {/* Primary Tool Link */}
            {group.primaryLink && (
              <Link
                href={group.primaryLink.href}
                onClick={onClose}
                className={`flex flex-col p-2.5 rounded-fk-md transition-colors hover:bg-fk-surface-muted ${
                  pathname === group.primaryLink.href
                    ? "bg-fk-surface-muted font-bold text-fk-primary"
                    : "text-fk-text"
                }`}
              >
                <span className="text-[14px] font-bold">{group.primaryLink.label}</span>
                <span className="text-[12px] text-fk-text-muted font-normal mt-0.5">
                  {group.title === "IMAGE"
                    ? "Optimize JPEGs, PNGs, and WebPs locally"
                    : "Shrink PDFs below 2 MB in browser"}
                </span>
              </Link>
            )}

            {/* Secondary Tool Link */}
            {group.secondaryLink && (
              <Link
                href={group.secondaryLink.href}
                onClick={onClose}
                className={`p-2.5 text-[13px] font-bold rounded-fk-md transition-colors hover:bg-fk-surface-muted ${
                  pathname === group.secondaryLink.href
                    ? "text-fk-primary bg-fk-surface-muted"
                    : "text-fk-text-muted"
                }`}
              >
                {group.secondaryLink.label}
              </Link>
            )}

            {/* Subgroups (Popular Target Sizes) */}
            {group.subgroups?.map((sg, sIdx) => (
              <div key={sIdx} className="flex flex-col gap-2 mt-2 pt-2 border-t border-fk-border">
                {sg.label && (
                  <span className="text-[11px] font-bold text-fk-text-subtle uppercase">
                    {sg.label}
                  </span>
                )}
                <div className="grid grid-cols-2 gap-1.5">
                  {sg.items.map((item, iIdx) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        onClick={onClose}
                        className={`px-3 py-1.5 rounded-fk-md text-[12px] font-bold text-center border transition-colors ${
                          isActive
                            ? "bg-fk-primary text-white border-fk-primary"
                            : "bg-fk-bg text-fk-text border-fk-border hover:border-fk-primary"
                        }`}
                      >
                        {"\u2066"}{item.label}{"\u2069"}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
