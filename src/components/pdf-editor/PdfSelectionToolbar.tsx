"use client";

import React, { useState } from "react";
import { PageOperationItem, PdfEditorRouteTarget, PdfSplitMode } from "@/utils/pdf-editor/types";
import { parsePageRangeString } from "@/utils/pdf-editor/pageOperations";

interface PdfSelectionToolbarProps {
  language?: string;
  pageItems: PageOperationItem[];
  targetRoute: PdfEditorRouteTarget;
  splitMode?: PdfSplitMode;
  splitEveryN?: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onInvertSelection: () => void;
  onBulkRotate: (direction: "cw" | "ccw") => void;
  onRotateOddPages?: (direction: "cw" | "ccw") => void;
  onRotateEvenPages?: (direction: "cw" | "ccw") => void;
  onSortByFilename?: () => void;
  onBulkDelete: () => void;
  onRestoreAll: () => void;
  onApplyRangeSelection?: (selectedIndices: number[]) => void;
  onSetSplitMode?: (mode: PdfSplitMode, n?: number) => void;
  onAddFiles?: (files: FileList) => void;
}

export const PdfSelectionToolbar: React.FC<PdfSelectionToolbarProps> = ({
  language = "en",
  pageItems,
  targetRoute,
  splitMode = "range",
  splitEveryN = 2,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onBulkRotate,
  onRotateOddPages,
  onRotateEvenPages,
  onSortByFilename,
  onBulkDelete,
  onRestoreAll,
  onApplyRangeSelection,
  onSetSplitMode,
  onAddFiles,
}) => {
  const [rangeText, setRangeText] = useState("");
  const [everyNInput, setEveryNInput] = useState(splitEveryN);

  const activePages = pageItems.filter((p) => !p.isDeleted);
  const selectedPages = pageItems.filter((p) => p.isSelected && !p.isDeleted);
  const deletedPages = pageItems.filter((p) => p.isDeleted);
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isGreek = language === "el";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";
  const isHindi = language === "hi";
  const isIndonesian = language === "id";
  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";
  const isChinese = language.startsWith("zh");
  const isTaiwan = language === "zh-TW";

  const handleApplyRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onApplyRangeSelection || !rangeText.trim()) return;
    const indices = parsePageRangeString(rangeText, pageItems.length);
    onApplyRangeSelection(indices);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onAddFiles) {
      onAddFiles(e.target.files);
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Page Counts & Selection Badges */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold text-slate-300">
            <span className="text-blue-400 font-mono text-sm font-bold">
              {activePages.length}
            </span>{" "}
            {isChinese ? (isTaiwan ? "個有效頁面" : "个有效页面") : isJapanese ? "有効なページ" : isKorean ? "활성 페이지" : isRussian ? "активных страниц" : isUkrainian ? "активних сторінок" : isGreek ? "ενεργές σελίδες" : isSlovak ? "aktívnych strán" : isSlovenian ? "aktivnih strani" : isBulgarian ? "активни страници" : isHindi ? "सक्रिय पृष्ठ" : isIndonesian ? "halaman aktif" : isMalay ? "halaman aktif" : isVietnamese ? "trang đang hoạt động" : isThai ? "หน้าที่ใช้งานอยู่" : isFilipino ? "aktibong mga pahina" : "active pages"}{" "}
            <span className="text-slate-500 font-normal">
              ({isChinese ? (isTaiwan ? "總計" : "总计") : isJapanese ? "合計" : isKorean ? "전체" : isRussian ? "Всего" : isUkrainian ? "Всього" : isGreek ? "Σύνολο" : isSlovak ? "Celkovo" : isSlovenian ? "Skupaj" : isBulgarian ? "Общо" : isHindi ? "कुल" : isIndonesian ? "Total" : isMalay ? "Jumlah" : isVietnamese ? "Tổng số" : isThai ? "ทั้งหมด" : isFilipino ? "Kabuuan" : "Total"}: {pageItems.length})
            </span>
          </div>

          {selectedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-medium">
              {selectedPages.length} {isChinese ? (isTaiwan ? "已選" : "已选") : isJapanese ? "選択中" : isKorean ? "선택됨" : isRussian ? "выбрано" : isUkrainian ? "вибрано" : isGreek ? "επιλεγμένες" : isSlovak ? "vybraných" : isSlovenian ? "izbranih" : isBulgarian ? "избрани" : isHindi ? "चयनित" : isIndonesian ? "dipilih" : isMalay ? "dipilih" : isVietnamese ? "đã chọn" : isThai ? "เลือกแล้ว" : isFilipino ? "napili" : "selected"}
            </span>
          )}

          {deletedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-700/50 font-medium">
              {deletedPages.length} {isChinese ? (isTaiwan ? "已刪除" : "已删除") : isJapanese ? "削除済み" : isKorean ? "삭제됨" : isRussian ? "удалено" : isUkrainian ? "вилучено" : isGreek ? "διαγραμμένες" : isSlovak ? "odstránených" : isSlovenian ? "izbrisanih" : isBulgarian ? "изтрити" : isHindi ? "हटाए गए" : isIndonesian ? "dihapus" : isMalay ? "dipadam" : isVietnamese ? "đã xóa" : isThai ? "ลบแล้ว" : isFilipino ? "tinanggal" : "deleted"}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Files for Merge */}
          {targetRoute === "/merge-pdf" && onAddFiles && (
            <>
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {isChinese ? (isTaiwan ? "新增更多 PDF" : "添加更多 PDF") : isJapanese ? "さらにPDFを追加" : isKorean ? "PDF 파일 추가" : isRussian ? "Добавить еще PDF" : isUkrainian ? "Додати ще PDF" : isGreek ? "Προσθήκη PDF" : isSlovak ? "Pridať ďalšie PDF" : isSlovenian ? "Dodaj več PDF" : isBulgarian ? "Добавяне на още PDF" : isHindi ? "और PDF जोड़ें" : isIndonesian ? "Tambah File PDF" : isMalay ? "Tambah Fail PDF" : isVietnamese ? "Thêm tệp PDF" : isThai ? "เพิ่มไฟล์ PDF" : isFilipino ? "Magdagdag ng Higit Pang PDF" : "Add More PDFs"}
                <input
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {onSortByFilename && (
                <button
                  type="button"
                  onClick={onSortByFilename}
                  title="Sort merged pages alphabetically by filename"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  {isChinese ? (isTaiwan ? "按檔名排序" : "按文件名排序") : isJapanese ? "ファイル名順に並べ替え" : isKorean ? "파일명 순 정렬" : isRussian ? "Сортировать по имени" : isUkrainian ? "Сортувати за назвою" : isGreek ? "Ταξινόμηση κατά όνομα" : isSlovak ? "Zoradiť podľa názvu" : isSlovenian ? "Razvrsti po imenu" : isBulgarian ? "Сортиране по име" : isHindi ? "फ़ाइल नाम से क्रमबद्ध करें" : isIndonesian ? "Urutkan berdasarkan nama" : isMalay ? "Susun mengikut nama fail" : isVietnamese ? "Sắp xếp theo tên tệp" : isThai ? "เรียงตามชื่อไฟล์" : isFilipino ? "Ayusin ayon sa Pangalan ng File" : "Sort by Filename"}
                </button>
              )}
            </>
          )}

          {/* Selection Toggles */}
          <button
            type="button"
            onClick={onSelectAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {isChinese ? (isTaiwan ? "全選" : "全选") : isJapanese ? "すべて選択" : isKorean ? "전체 선택" : isRussian ? "Выбрать все" : isUkrainian ? "Вибрати все" : isGreek ? "Επιλογή όλων" : isSlovak ? "Vybrať všetko" : isSlovenian ? "Izberi vse" : isBulgarian ? "Избери всички" : isHindi ? "सभी चुनें" : isIndonesian ? "Pilih Semua" : isMalay ? "Pilih Semua" : isVietnamese ? "Chọn tất cả" : isThai ? "เลือกทั้งหมด" : isFilipino ? "Piliin Lahat" : "Select All"}
          </button>

          <button
            type="button"
            onClick={onDeselectAll}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {isChinese ? (isTaiwan ? "取消全選" : "取消全选") : isJapanese ? "選択を解除" : isKorean ? "선택 해제" : isRussian ? "Снять выбор" : isUkrainian ? "Зняти вибір" : isGreek ? "Αποεπιλογή" : isSlovak ? "Zrušiť výber" : isSlovenian ? "Prekliči izbiro" : isBulgarian ? "Отмени избора" : isHindi ? "चयन हटाएं" : isIndonesian ? "Batal Pilih" : isMalay ? "Nyahpilih Semua" : isVietnamese ? "Bỏ chọn tất cả" : isThai ? "ยกเลิกการเลือก" : isFilipino ? "Huwag Piliin Lahat" : "Deselect All"}
          </button>

          <button
            type="button"
            onClick={onInvertSelection}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            {isChinese ? (isTaiwan ? "反選" : "反选") : isJapanese ? "選択を反転" : isKorean ? "선택 반전" : isRussian ? "Инвертировать" : isUkrainian ? "Інвертувати" : isGreek ? "Αντιστροφή" : isSlovak ? "Invertovať" : isSlovenian ? "Obrni izbiro" : isBulgarian ? "Инвертиране" : isHindi ? "चयन उलटें" : isIndonesian ? "Balikkan Pilihan" : isMalay ? "Songsangkan Pilihan" : isVietnamese ? "Đảo vùng chọn" : isThai ? "สลับการเลือก" : isFilipino ? "Baligtarin ang Pili" : "Invert"}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Bulk Rotate */}
          <button
            type="button"
            onClick={() => onBulkRotate("cw")}
            title="Rotate selected or all pages 90° Clockwise"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
            {isChinese ? (isTaiwan ? "旋轉 90°" : "旋转 90°") : isJapanese ? "90° 回転" : isKorean ? "90° 회전" : isRussian ? "Повернуть 90°" : isUkrainian ? "Повернути 90°" : isGreek ? "Περιστροφή 90°" : isSlovak ? "Otočiť 90°" : isSlovenian ? "Zavrti 90°" : isBulgarian ? "Завъртане 90°" : isHindi ? "90° घुमाएँ" : isIndonesian ? "Putar 90°" : isMalay ? "Putar 90°" : isVietnamese ? "Xoay 90°" : isThai ? "หมุน 90°" : isFilipino ? "Paikutin nang 90°" : "Rotate 90°"}
          </button>

          {/* Odd/Even Rotations for Rotate PDF Route */}
          {targetRoute === "/rotate-pdf-pages" && (
            <>
              {onRotateOddPages && (
                <button
                  type="button"
                  onClick={() => onRotateOddPages("cw")}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  {isChinese ? (isTaiwan ? "旋轉奇數頁" : "旋转奇数页") : isJapanese ? "奇数ページを回転" : isKorean ? "홀수 페이지 회전" : isRussian ? "Повернуть нечетные" : isUkrainian ? "Повернути непарні" : isGreek ? "Περιστροφή μονών" : isSlovak ? "Otočiť nepárne" : isSlovenian ? "Zavrti lihe" : isBulgarian ? "Завърти нечетните" : isHindi ? "विषम पृष्ठ घुमाएँ" : isIndonesian ? "Putar Halaman Ganjil" : isMalay ? "Putar Halaman Ganjil" : isVietnamese ? "Xoay trang lẻ" : isThai ? "หมุนหน้าคี่" : isFilipino ? "Paikutin ang mga Kakaibang Pahina" : "Rotate Odd Pages"}
                </button>
              )}
              {onRotateEvenPages && (
                <button
                  type="button"
                  onClick={() => onRotateEvenPages("cw")}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  {isChinese ? (isTaiwan ? "旋轉偶數頁" : "旋转偶数页") : isJapanese ? "偶数ページを回転" : isKorean ? "짝수 페이지 회전" : isRussian ? "Повернуть четные" : isUkrainian ? "Повернути парні" : isGreek ? "Περιστροφή ζυγών" : isSlovak ? "Otočiť párne" : isSlovenian ? "Zavrti sode" : isBulgarian ? "Завърти четните" : isHindi ? "सम पृष्ठ घुमाएँ" : isIndonesian ? "Putar Halaman Genap" : isMalay ? "Putar Halaman Genap" : isVietnamese ? "Xoay trang chẵn" : isThai ? "หมุนหน้าคู่" : isFilipino ? "Paikutin ang mga Tukol na Pahina" : "Rotate Even Pages"}
                </button>
              )}
            </>
          )}

          {/* Bulk Delete */}
          <button
            type="button"
            onClick={onBulkDelete}
            title="Delete selected or all active pages"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 text-xs font-medium transition flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isChinese ? (isTaiwan ? "刪除" : "删除") : isJapanese ? "削除" : isKorean ? "삭제" : isRussian ? "Удалить" : isUkrainian ? "Видалити" : isGreek ? "Διαγραφή" : isSlovak ? "Odstrániť" : isSlovenian ? "Izbriši" : isBulgarian ? "Изтриване" : isHindi ? "हटाएँ" : isIndonesian ? "Hapus" : isMalay ? "Padam" : isVietnamese ? "Xóa" : isThai ? "ลบ" : isFilipino ? "Tanggalin" : "Delete"}
          </button>

          {/* Restore Deleted */}
          {deletedPages.length > 0 && (
            <button
              type="button"
              onClick={onRestoreAll}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-xs font-semibold transition"
            >
              {isChinese ? (isTaiwan ? `全部還原 (${deletedPages.length})` : `全部恢复 (${deletedPages.length})`) : isJapanese ? `すべて復元 (${deletedPages.length})` : isKorean ? `모두 복원 (${deletedPages.length})` : isRussian ? `Восстановить все (${deletedPages.length})` : isUkrainian ? `Відновити всі (${deletedPages.length})` : isGreek ? `Επαναφορά όλων (${deletedPages.length})` : isSlovak ? `Obnoviť všetko (${deletedPages.length})` : isSlovenian ? `Obnovi vse (${deletedPages.length})` : isBulgarian ? `Възстановяване на всички (${deletedPages.length})` : isHindi ? `सभी पुनर्स्थापित करें (${deletedPages.length})` : isIndonesian ? `Pulihkan Semua (${deletedPages.length})` : isMalay ? `Pulihkan Semua (${deletedPages.length})` : isVietnamese ? `Khôi phục tất cả (${deletedPages.length})` : isThai ? `กู้คืนทั้งหมด (${deletedPages.length})` : isFilipino ? `Ibalik Lahat (${deletedPages.length})` : `Restore All (${deletedPages.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Split Mode Selector for Split PDF */}
      {targetRoute === "/split-pdf" && onSetSplitMode && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
          <span className="text-xs text-slate-400 font-medium">{isChinese ? (isTaiwan ? "分割模式:" : "分割模式:") : isJapanese ? "分割モード:" : isKorean ? "분할 모드:" : isRussian ? "Режим разделения:" : isUkrainian ? "Режим розділення:" : isGreek ? "Λειτουργία διαχωρισμού:" : isSlovak ? "Režim rozdelenia:" : isSlovenian ? "Način razdelitve:" : isBulgarian ? "Режим на разделяне:" : isHindi ? "विभाजन मोड:" : isIndonesian ? "Mode Pisah:" : isMalay ? "Mod Pemisahan:" : isThai ? "โหมดการแยก:" : isFilipino ? "Paraan ng Paghati:" : "Split Mode:"}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSetSplitMode("every-page")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "every-page"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {isChinese ? (isTaiwan ? "所有頁面" : "所有页面") : isJapanese ? "すべてのページ" : isKorean ? "모든 페이지" : isRussian ? "Каждую страницу" : isUkrainian ? "Кожну сторінку" : isGreek ? "Κάθε σελίδα" : isSlovak ? "Každú stranu" : isSlovenian ? "Vsako stran" : isBulgarian ? "Всяка страница" : isHindi ? "प्रत्येक पृष्ठ विभाजित करें" : isIndonesian ? "Pisah Setiap Halaman" : isMalay ? "Setiap Halaman" : isThai ? "แยกทุกหน้า" : isFilipino ? "Hatiin Bawat Pahina" : "Split Every Page"}
            </button>

            <button
              type="button"
              onClick={() => onSetSplitMode("every-n-pages", everyNInput)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "every-n-pages"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {isChinese ? (isTaiwan ? "每 N 頁" : "每 N 页") : isJapanese ? "Nページごと" : isKorean ? "N페이지마다" : isRussian ? "Каждые N страниц" : isUkrainian ? "Кожні N сторінок" : isGreek ? "Κάθε N σελίδες" : isSlovak ? "Každých N strán" : isSlovenian ? "Vsakih N strani" : isBulgarian ? "На всеки N страници" : isHindi ? "प्रत्येक N पृष्ठ विभाजित करें" : isIndonesian ? "Pisah Setiap N Halaman" : isMalay ? "Setiap N Halaman" : isThai ? "แยกทุก N หน้า" : isFilipino ? "Hatiin Bawat N Pahina" : "Split Every N Pages"}
            </button>

            {splitMode === "every-n-pages" && (
              <input
                type="number"
                min={1}
                max={50}
                value={everyNInput}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setEveryNInput(val);
                  onSetSplitMode("every-n-pages", val);
                }}
                className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg font-mono"
              />
            )}

            <button
              type="button"
              onClick={() => onSetSplitMode("range")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                splitMode === "range"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {isChinese ? (isTaiwan ? "自訂範圍" : "自定义范围") : isJapanese ? "範囲を指定" : isKorean ? "범위 지정" : isRussian ? "Выбор диапазона" : isUkrainian ? "Вибір діапазону" : isGreek ? "Προσαρμοσμένο εύρος" : isSlovak ? "Výber rozsahu" : isSlovenian ? "Izbira obsega" : isBulgarian ? "Избор на диапазон" : isHindi ? "कस्टम रेंज चयन" : isIndonesian ? "Pilihan Rentang Kustom" : isMalay ? "Pilihan Julat Khas" : isThai ? "เลือกช่วงหน้า" : isFilipino ? "Pasadya na Pagpili ng Saklaw" : "Custom Range Selection"}
            </button>
          </div>
        </div>
      )}

      {/* Page Range Parser for Split / Extract */}
      {(targetRoute === "/extract-pdf-pages" ||
        (targetRoute === "/split-pdf" && splitMode === "range")) &&
        onApplyRangeSelection && (
          <form
            onSubmit={handleApplyRange}
            className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
          >
            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {isChinese ? (isTaiwan ? "頁面範圍:" : "页面范围:") : isJapanese ? "ページ範囲:" : isKorean ? "페이지 범위:" : isRussian ? "Диапазон:" : isUkrainian ? "Діапазон:" : isGreek ? "Εύρος σελίδων:" : isSlovak ? "Rozsah:" : isSlovenian ? "Obseg strani:" : isBulgarian ? "Обхват:" : isHindi ? "पृष्ठ रेंज:" : isIndonesian ? "Rentang Halaman:" : isMalay ? "Julat Halaman:" : isThai ? "ช่วงหน้า:" : isFilipino ? "Saklaw ng Pahina:" : "Page Range:"}
            </label>
            <input
              type="text"
              value={rangeText}
              onChange={(e) => setRangeText(e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {isChinese ? (isTaiwan ? "選取" : "选取") : isJapanese ? "選択" : isKorean ? "선택" : isRussian ? "Выбрать" : isUkrainian ? "Вибрати" : isGreek ? "Επιλογή" : isSlovak ? "Vybrať" : isSlovenian ? "Izberi" : isBulgarian ? "Избор" : isHindi ? "रेंज चुनें" : isIndonesian ? "Pilih Rentang" : isMalay ? "Pilih Julat" : isThai ? "เลือกช่วง" : isFilipino ? "Piliin ang Saklaw" : "Select Range"}
            </button>
          </form>
        )}
    </div>
  );
};
