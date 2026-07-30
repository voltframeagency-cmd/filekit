"use client";

import React, { useState, useMemo } from 'react';
import { fileKitAssets, FileKitAssetName } from '@/components/visuals/assetRegistry';
import { FileKitAsset } from '@/components/visuals/FileKitAsset';
import { InlineIcon } from '@/components/visuals/InlineIcon';

export default function DevBrandAssetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewScale, setPreviewScale] = useState<number>(140);
  const [bgTheme, setBgTheme] = useState<'light' | 'slate' | 'black' | 'grid'>('light');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedAssetForModal, setSelectedAssetForModal] = useState<FileKitAssetName | null>(null);

  const assetKeys = useMemo(() => Object.keys(fileKitAssets) as FileKitAssetName[], []);

  const filteredAssetKeys = useMemo(() => {
    return assetKeys.filter((key) => {
      const asset = fileKitAssets[key];
      const matchesSearch =
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || asset.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [assetKeys, searchQuery, selectedCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 border border-blue-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <InlineIcon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                FileKit Visual Asset System
              </h1>
              <span className="text-xs px-3 py-1 bg-blue-600/90 text-white font-mono rounded-full font-semibold shadow-sm">
                34 Launch Assets
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
              Creative Developer Inspection Suite &amp; Visual Asset Gallery. Test dark/light themes, optical scale previews, and copy component snippets.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SVGO &amp; PNG Ready
            </span>
          </div>
        </div>

        {/* Toolbar & Controls Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800 backdrop-blur">
          {/* 1. Search Bar */}
          <div className="relative">
            <label className="text-[11px] font-mono text-slate-400 block mb-1">SEARCH ASSETS</label>
            <input
              type="text"
              placeholder="Search by name, alt, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* 2. Category Filter */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">CATEGORY FILTER</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="all">All Categories (34)</option>
              <option value="conversion">Conversions &amp; Office Tools (13)</option>
              <option value="pdf-tool">PDF Tools &amp; Security (11)</option>
              <option value="how-it-works">How It Works (6)</option>
              <option value="benefit">Trust &amp; Benefits (2)</option>
              <option value="hero">Hero Graphics (2)</option>
            </select>
          </div>

          {/* 3. Surface Theme Switcher */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">PREVIEW BACKGROUND</label>
            <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setBgTheme('light')}
                className={`text-[10px] font-mono py-1 rounded transition ${bgTheme === 'light' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Light
              </button>
              <button
                onClick={() => setBgTheme('slate')}
                className={`text-[10px] font-mono py-1 rounded transition ${bgTheme === 'slate' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Slate
              </button>
              <button
                onClick={() => setBgTheme('black')}
                className={`text-[10px] font-mono py-1 rounded transition ${bgTheme === 'black' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Black
              </button>
              <button
                onClick={() => setBgTheme('grid')}
                className={`text-[10px] font-mono py-1 rounded transition ${bgTheme === 'grid' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Grid
              </button>
            </div>
          </div>

          {/* 4. Scale Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>PREVIEW SCALE</span>
              <span className="text-blue-400 font-bold">{previewScale}px</span>
            </div>
            <input
              type="range"
              min="48"
              max="240"
              step="8"
              value={previewScale}
              onChange={(e) => setPreviewScale(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
            />
          </div>
        </div>
      </header>

      {/* Main Asset Gallery */}
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <span>Showing {filteredAssetKeys.length} of 34 Assets</span>
          </h2>
        </div>

        {filteredAssetKeys.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <p className="text-sm">No visual assets found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssetKeys.map((key) => {
              const meta = fileKitAssets[key];

              // Background class generator
              const getBgClass = () => {
                switch (bgTheme) {
                  case 'light':
                    return 'bg-white border-slate-200';
                  case 'slate':
                    return 'bg-slate-900 border-slate-800';
                  case 'black':
                    return 'bg-black border-slate-900';
                  case 'grid':
                    return 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 border-slate-800';
                  default:
                    return 'bg-white border-slate-200';
                }
              };

              return (
                <div
                  key={key}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-3 border-b border-slate-800/80 pb-3">
                    <div>
                      <h3 className="font-mono text-sm font-bold text-blue-400 flex items-center gap-1.5">
                        <span>{key}{meta.path.substring(meta.path.lastIndexOf('.'))}</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{meta.alt}</p>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {meta.category}
                    </span>
                  </div>

                  {/* Canvas Preview Area */}
                  <div
                    className={`rounded-lg border p-4 flex flex-col items-center justify-center min-h-[160px] transition-all duration-200 relative group ${getBgClass()}`}
                  >
                    <div style={{ width: `${previewScale}px`, height: 'auto' }}>
                      <FileKitAsset name={key} priority={true} className="w-full h-auto object-contain" />
                    </div>

                    <span className="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950/70 text-slate-400 border border-slate-800 backdrop-blur opacity-0 group-hover:opacity-100 transition">
                      {meta.viewBox}
                    </span>
                  </div>

                  {/* Actions & Code Copiers */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(`<FileKitAsset name="${key}" />`, 'React Component')
                      }
                      className="flex-1 text-[11px] font-mono py-1.5 px-2 bg-slate-950 hover:bg-blue-600 hover:text-white text-slate-300 rounded border border-slate-800 transition flex items-center justify-center gap-1.5"
                    >
                      <InlineIcon name="check" size={12} />
                      <span>Copy React Code</span>
                    </button>

                    <button
                      onClick={() => setSelectedAssetForModal(key)}
                      className="text-[11px] font-mono py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Asset Inspection Modal */}
      {selectedAssetForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-blue-400">
                  {selectedAssetForModal}{fileKitAssets[selectedAssetForModal].path.substring(fileKitAssets[selectedAssetForModal].path.lastIndexOf('.'))}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {fileKitAssets[selectedAssetForModal].alt}
                </p>
              </div>
              <button
                onClick={() => setSelectedAssetForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-center min-h-[140px]">
                <FileKitAsset
                  name={selectedAssetForModal}
                  priority={true}
                  className="max-h-[120px] w-auto h-auto"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CATEGORY</span>
                  <span className="text-slate-200 font-semibold uppercase">
                    {fileKitAssets[selectedAssetForModal].category}
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VIEWBOX</span>
                  <span className="text-slate-200 font-semibold">
                    {fileKitAssets[selectedAssetForModal].viewBox}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  STATIC ASSET PATH
                </label>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={fileKitAssets[selectedAssetForModal].path}
                    className="bg-transparent text-xs font-mono text-slate-300 w-full focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        fileKitAssets[selectedAssetForModal].path,
                        'Asset Path'
                      )
                    }
                    className="text-[10px] font-mono px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 shrink-0"
                  >
                    Copy Path
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAssetForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
