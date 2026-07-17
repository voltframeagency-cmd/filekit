"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { useRouter } from "next/navigation";

interface ToolItem {
  id: string;
  nameKey: string;
  descKey: string;
  route: string;
  iconBg: string;
  iconColor: string;
  iconPath: React.ReactNode;
}

export default function ToolSearch() {
  const { t } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus input on '/' keydown
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // List of tools for search
  const tools: ToolItem[] = [
    {
      id: "compress-pdf",
      nameKey: "breadcrumb.compress",
      descKey: "tool.compress.desc",
      route: "/compress-pdf",
      iconBg: "bg-red-50 dark:bg-red-950/20",
      iconColor: "text-red-600 dark:text-red-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l6-6m0 0l6 6m-6-6v12m0 0l-3-3m3 3l3-3"
        />
      ),
    },
    {
      id: "merge-pdf",
      nameKey: "tool.merge.title",
      descKey: "tool.merge.desc",
      route: "#",
      iconBg: "bg-amber-50 dark:bg-amber-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      ),
    },
    {
      id: "resize-image",
      nameKey: "tool.resize.title",
      descKey: "tool.resize.desc",
      route: "#",
      iconBg: "bg-green-50 dark:bg-green-950/20",
      iconColor: "text-green-600 dark:text-green-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v16.5h16.5M12 12h4.5m-4.5 0v4.5"
        />
      ),
    },
    {
      id: "image-converter",
      nameKey: "tool.convert.title",
      descKey: "tool.convert.desc",
      route: "#",
      iconBg: "bg-cyan-50 dark:bg-cyan-950/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      ),
    },
    {
      id: "pdf-to-word",
      nameKey: "tool.pdfToWord.title",
      descKey: "tool.pdfToWord.desc",
      route: "#",
      iconBg: "bg-blue-50 dark:bg-blue-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconPath: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      ),
    },
  ];

  // Filter tools based on query
  const filteredTools = tools.filter((tool) => {
    const name = t(tool.nameKey).toLowerCase();
    const desc = t(tool.descKey).toLowerCase();
    const search = query.toLowerCase();
    return name.includes(search) || desc.includes(search);
  });

  const showDropdown = isFocused && query.length > 0;

  // Handle key navigation inside dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredTools.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectTool(filteredTools[activeIndex]);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  const selectTool = (tool: ToolItem) => {
    setQuery("");
    setIsFocused(false);
    if (tool.route !== "#") {
      router.push(tool.route);
    }
  };

  return (
    <div className="relative w-full max-w-[270px]">
      <div className="relative flex items-center">
        {/* Search icon */}
        <svg
          className="absolute left-3 w-4 h-4 text-fk-text-subtle pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={t("nav.searchPlaceholder")}
          onKeyDown={handleKeyDown}
          className="w-full h-[38px] pl-9 pr-8 text-[13px] bg-white border border-fk-border rounded-fk-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary focus-visible:border-transparent transition-all duration-150"
        />

        {/* Keyboard shortcut Badge */}
        {!query && (
          <div className="absolute right-3 flex items-center justify-center w-5 h-5 bg-fk-surface-muted border border-fk-border rounded-md pointer-events-none">
            <span className="text-[11px] font-bold text-fk-text-muted">/</span>
          </div>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 mt-1.5 w-full bg-white border border-fk-border shadow-md rounded-fk-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-100"
        >
          {filteredTools.length > 0 ? (
            <div className="py-1">
              {filteredTools.map((tool, idx) => (
                <button
                  key={tool.id}
                  onClick={() => selectTool(tool)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150 ${
                    idx === activeIndex
                      ? "bg-fk-surface-muted"
                      : "hover:bg-fk-surface-muted"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${tool.iconBg} ${tool.iconColor}`}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      {tool.iconPath}
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-fk-text truncate">
                      {t(tool.nameKey)}
                    </span>
                    <span className="text-[11px] text-fk-text-subtle truncate">
                      {t(tool.descKey)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-center text-[12px] text-fk-text-muted">
              No tools found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
