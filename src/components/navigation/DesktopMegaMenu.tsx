"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopNavItem, CONVERTER_NAVIGATION_GROUPS } from "@/config/navigation";

export interface DesktopMegaMenuProps {
  navItem: TopNavItem;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  initialFocus?: "FIRST" | "LAST";
}

export default function DesktopMegaMenu({
  navItem,
  isOpen,
  onClose,
  triggerRef,
  initialFocus
}: DesktopMegaMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const megaMenu = navItem.megaMenu;

  useEffect(() => {
    if (!isOpen || (!megaMenu && navItem.id !== "convert")) return;

    // Handle initial focus when opened via keyboard
    if (initialFocus) {
      setTimeout(() => {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
        if (links && links.length > 0) {
          if (initialFocus === "FIRST") {
            links[0].focus();
          } else if (initialFocus === "LAST") {
            links[links.length - 1].focus();
          }
        }
      }, 50);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }

      if (!menuRef.current) return;
      const links = Array.from(menuRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"));
      if (links.length === 0) return;

      const activeIndex = links.findIndex((link) => link === document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === links.length - 1) {
          links[0].focus();
        } else {
          links[activeIndex + 1].focus();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (activeIndex === -1 || activeIndex === 0) {
          links[links.length - 1].focus();
        } else {
          links[activeIndex - 1].focus();
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        links[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        links[links.length - 1].focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        // Multi-column arrow navigation placeholder (safe for 1 column)
        e.preventDefault();
        if (activeIndex !== -1) {
          links[activeIndex].focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (triggerRef.current && triggerRef.current.contains(target)) {
        return;
      }

      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef, megaMenu, navItem.id, initialFocus]);

  if (!isOpen) return null;

  if (navItem.id === "convert") {
    return (
      <div
        id="convert-menu"
        ref={menuRef}
        role="region"
        aria-label="Convert Tools"
        className="absolute top-full ltr:left-0 rtl:right-0 mt-2 w-[640px] bg-white border border-fk-border rounded-fk-xl p-6 shadow-md z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="grid grid-cols-3 gap-6">
          {CONVERTER_NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-fk-text-subtle uppercase tracking-wider">
                {group.label}
              </span>
              <div className="flex flex-col gap-1">
                {group.links.map((link, lIdx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={lIdx}
                      href={link.href}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`px-3 py-2 text-[13px] font-bold rounded-fk-md transition-colors hover:bg-fk-surface-muted ${
                        isActive ? "text-fk-primary bg-fk-surface-muted font-bold" : "text-fk-text"
                      }`}
                    >
                      {"\u2066"}{link.label}{"\u2069"}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id={megaMenu?.id || "mega-menu"}
      ref={menuRef}
      role="region"
      aria-label={megaMenu?.label || "Mega Menu"}
      className="absolute top-full ltr:left-0 rtl:right-0 mt-2 w-[540px] bg-white border border-fk-border rounded-fk-xl p-6 shadow-md z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="grid grid-cols-2 gap-8">
        {megaMenu?.groups?.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-3">
            <span className="text-[11px] font-bold text-fk-text-subtle uppercase tracking-wider">
              {group.title}
            </span>

            {/* Primary Tool Link */}
            {group.primaryLink && (
              <Link
                href={group.primaryLink.href}
                onClick={onClose}
                aria-current={pathname === group.primaryLink.href ? "page" : undefined}
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
                aria-current={pathname === group.secondaryLink.href ? "page" : undefined}
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
                        aria-current={isActive ? "page" : undefined}
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
