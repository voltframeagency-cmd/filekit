"use client";

import React, { useState } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { BlankPageOptions, DuplicatePagesOptions, ExtractedImageItem } from "@/utils/pdf-manipulation/types";
import { PdfManipulationEngine } from "@/utils/pdf-manipulation/PdfManipulationEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

export type PdfManipulationMode =
  | "reverse"
  | "add-blank"
  | "duplicate"
  | "pdf-to-text"
  | "extract-images"
  | "flatten";

export interface PdfManipulationWorkspaceProps {
  mode: PdfManipulationMode;
  toolTitle: string;
  toolSlug: string;
  language?: string;
}

export const PdfManipulationWorkspace: React.FC<PdfManipulationWorkspaceProps> = ({
  mode,
  toolTitle,
  toolSlug,
  language: propLanguage,
}) => {
  const { language: contextLang } = useLanguage();
  const language = propLanguage || contextLang || "en";
  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";
  const isDanish = language === "da";
  const isSwedish = language === "sv";
  const isFinnish = language === "fi";
  const isNorwegian = language === "no";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";
  const isChinese = language.startsWith("zh");
  const isTaiwan = language === "zh-TW";

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Blank page options
  const [blankPosition, setBlankPosition] = useState<"start" | "end" | "after-each" | "custom">("end");
  const [customPageOffset, setCustomPageOffset] = useState<number>(1);

  // Duplicate pages options
  const [duplicateMode, setDuplicateMode] = useState<"all-consecutive" | "all-appended" | "selected">("all-consecutive");
  const [selectedPagesStr, setSelectedPagesStr] = useState<string>("1");

  // Output results
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [outputSizeBytes, setOutputSizeBytes] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImageItem[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setDownloadUrl(null);
    setExtractedText(null);
    setExtractedImages([]);

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrorMessage("Please select a valid PDF document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      setPdfBytes(new Uint8Array(buffer));
      setSourceFile(file);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to read PDF document.");
    }
  };

  const handleProcess = async () => {
    if (!sourceFile || !pdfBytes) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const baseName = sourceFile.name.replace(/\.pdf$/i, "");

    try {
      if (mode === "reverse") {
        const outBytes = await PdfManipulationEngine.reversePdf(pdfBytes);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-reversed.pdf`);
        setOutputSizeBytes(outBytes.byteLength);
      } else if (mode === "add-blank") {
        const options: BlankPageOptions = {
          position: blankPosition,
          customPageIndex: customPageOffset,
        };
        const outBytes = await PdfManipulationEngine.addBlankPage(pdfBytes, options);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-with-blank-pages.pdf`);
        setOutputSizeBytes(outBytes.byteLength);
      } else if (mode === "duplicate") {
        const selectedPages = selectedPagesStr
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n) && n > 0);

        const options: DuplicatePagesOptions = {
          mode: duplicateMode,
          selectedPageNumbers: selectedPages.length > 0 ? selectedPages : [1],
        };
        const outBytes = await PdfManipulationEngine.duplicatePages(pdfBytes, options);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-duplicated.pdf`);
        setOutputSizeBytes(outBytes.byteLength);
      } else if (mode === "pdf-to-text") {
        const textResult = await PdfManipulationEngine.extractPdfText(pdfBytes);
        setExtractedText(textResult.text);
        const blob = new Blob([textResult.text], { type: "text/plain;charset=utf-8" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-extracted.txt`);
        setOutputSizeBytes(blob.size);
      } else if (mode === "extract-images") {
        const images = await PdfManipulationEngine.extractImagesFromPdf(pdfBytes);
        if (images.length === 0) {
          setErrorMessage("No embedded raster images were found in this PDF document.");
        } else {
          setExtractedImages(images);
        }
      } else if (mode === "flatten") {
        const outBytes = await PdfManipulationEngine.flattenPdf(pdfBytes);
        const blob = new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
        setDownloadUrl(URL.createObjectURL(blob));
        setOutputFileName(`${baseName}-flattened.pdf`);
        setOutputSizeBytes(outBytes.byteLength);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred during PDF processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadSingleImage = (img: ExtractedImageItem) => {
    const blob = new Blob([img.data as unknown as BlobPart], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-image-${img.pageIndex}-${img.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Box */}
      {!sourceFile ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-fk-primary/10 flex items-center justify-center text-fk-primary mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isChinese
              ? isTaiwan ? `選取 PDF 檔案以開始${toolTitle}` : `选择 PDF 文件以开始${toolTitle}`
              : isKorean ? `${toolTitle}을(를) 시작할 PDF 파일 선택` : isJapanese ? `${toolTitle} を開始するにはPDFファイルを選択` : isFilipino ? `Pumili ng PDF file upang magsimula (${toolTitle})` : isVietnamese ? `Chọn tệp PDF để bắt đầu (${toolTitle})` : isThai ? `เลือกไฟล์ PDF เพื่อเริ่มต้น (${toolTitle})` : isMalay ? `Pilih fail PDF untuk memulakan (${toolTitle})` : isFinnish ? `Aloita valitsemalla PDF-tiedosto (${toolTitle})` : isNorwegian ? `Velg PDF for å starte (${toolTitle})` : isDanish ? `Vælg PDF for at starte (${toolTitle})` : isSwedish ? `Välj PDF för att börja (${toolTitle})` : `Select a PDF to start with ${toolTitle}`}
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            {isChinese
              ? isTaiwan ? "完全在您的裝置瀏覽器沙箱中處理。您的資料絕不會離開電腦。" : "完全在您的设备浏览器沙箱中处理。您的数据绝不会离开电脑。"
              : isKorean ? "기기의 브라우저 내에서 100% 안전하게 처리됩니다. 파일이 외부 서버로 전송되지 않습니다." : isJapanese ? "お使いのデバイス上のブラウザ内で100%安全に処理されます。ファイルが外部に送信されることはありません。" : isFilipino ? "Ganap na pinoproseso sa iyong device sa loob ng sandbox ng browser. Hindi kailanman umaalis ang iyong data sa computer." : isVietnamese ? "Xử lý hoàn toàn trên thiết bị của bạn trong môi trường cách ly của trình duyệt. Dữ liệu của bạn không bao giờ rời khỏi máy tính." : isThai ? "ประมวลผลทั้งหมดบนอุปกรณ์ของคุณภายในเบราว์เซอร์ ไฟล์ของคุณจะไม่ถูกอัปโหลด" : isMalay ? "Diproses sepenuhnya pada peranti anda dalam kotak pasir pelayar. Data anda tidak pernah meninggalkan komputer anda." : isFinnish ? "Käsitellään paikallisesti selaimessasi ilman palvelimelle lataamista." : isNorwegian ? "Behandles lokalt i nettleseren din uten opplasting." : isDanish ? "Behandles lokalt i din browser uden upload." : isSwedish ? "Bearbetas lokalt i din webbläsare utan uppladdning." : "Processes entirely on your device inside your browser sandbox. Your data never leaves your computer."}
          </p>
          <label className="mt-4 bg-fk-primary hover:bg-fk-primary/90 text-white font-bold px-6 py-3 rounded-xl cursor-pointer transition shadow-lg shadow-fk-primary/25">
            {isChinese
              ? isTaiwan ? "選擇 PDF 文件" : "选择 PDF 文件"
              : isKorean ? "PDF 파일 선택" : isJapanese ? "PDFファイルを選択" : isFilipino ? "Pumili ng PDF File" : isVietnamese ? "Chọn tệp PDF" : isThai ? "เลือกไฟล์ PDF" : isMalay ? "Pilih Fail PDF" : isFinnish ? "Valitse PDF-tiedosto" : isNorwegian ? "Velg PDF-fil" : isDanish ? "Vælg PDF-fil" : isSwedish ? "Välj PDF-fil" : "Choose PDF Document"}
            <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6">
          {/* File summary banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                PDF
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">{(sourceFile.size / 1024).toFixed(1)} KB • {isChinese ? (isTaiwan ? "本機安全處理" : "本地安全处理") : isKorean ? "안전한 로컬 처리" : isJapanese ? "ローカル保護" : isFilipino ? "Ligtas sa Lokal" : isThai ? "ปลอดภัยในเครื่อง" : isMalay ? "Selamat Setempat" : "Local Safe"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="local" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setPdfBytes(null);
                  setDownloadUrl(null);
                  setExtractedText(null);
                  setExtractedImages([]);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {isChinese ? (isTaiwan ? "更換 PDF" : "更换 PDF") : isKorean ? "PDF 변경" : isJapanese ? "PDFを変更" : isFilipino ? "Palitan ang PDF" : isVietnamese ? "Đổi PDF" : isThai ? "เปลี่ยน PDF" : isMalay ? "Tukar PDF" : isFinnish ? "Vaihda PDF" : isNorwegian ? "Bytt PDF" : isDanish ? "Skift PDF" : isSwedish ? "Byt PDF" : "Change PDF"}
              </button>
            </div>
          </div>

          {/* Mode Controls */}
          {mode === "add-blank" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                {isChinese ? (isTaiwan ? "空白頁面插入位置:" : "空白页面插入位置:") : isKorean ? "빈 페이지 삽입 위치:" : isJapanese ? "空白ページの挿入位置:" : isFilipino ? "Posisyon ng Pagsingit ng Blangkong Pahina:" : isVietnamese ? "Vị trí chèn trang trống:" : isThai ? "ตำแหน่งการแทรกหน้าว่าง:" : isMalay ? "Kedudukan Sisipan Halaman Kosong:" : isFinnish ? "Tyhjän sivun sijainti:" : isNorwegian ? "Posisjon for tom side:" : isDanish ? "Position for tom side:" : isSwedish ? "Position för tom sida:" : "Blank Page Insertion Position:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "end", label: isChinese ? (isTaiwan ? "末尾" : "末尾") : isKorean ? "끝" : isJapanese ? "末尾" : isFilipino ? "Sa Dulo" : isVietnamese ? "Ở cuối" : isThai ? "ที่ส่วนท้าย" : isMalay ? "Di Akhir" : isFinnish ? "Loppuun" : isNorwegian ? "Til slutt" : isDanish ? "Til sidst" : isSwedish ? "I slutet" : "At the End" },
                  { id: "start", label: isChinese ? (isTaiwan ? "開頭" : "开头") : isKorean ? "시작" : isJapanese ? "先頭" : isFilipino ? "Sa Simula" : isVietnamese ? "Ở đầu" : isThai ? "ที่ส่วนหน้า" : isMalay ? "Di Awal" : isFinnish ? "Alkuun" : isNorwegian ? "I starten" : isDanish ? "I starten" : isSwedish ? "I början" : "At the Start" },
                  { id: "after-each", label: isChinese ? (isTaiwan ? "每頁之後" : "每页之后") : isKorean ? "모든 페이지 뒤" : isJapanese ? "各ページの直後" : isFilipino ? "Pagkatapos ng Bawat Pahina" : isVietnamese ? "Sau mỗi trang" : isThai ? "หลังทุกหน้า" : isMalay ? "Selepas Setiap Halaman" : isFinnish ? "Jokaisen sivun jälkeen" : isNorwegian ? "Etter hver side" : isDanish ? "Efter hver side" : isSwedish ? "Efter varje sida" : "After Every Page" },
                  { id: "custom", label: isChinese ? (isTaiwan ? "指定頁碼後" : "指定页码后") : isKorean ? "지정 페이지 뒤" : isJapanese ? "指定ページ" : isFilipino ? "Pasadya na Pahina" : isVietnamese ? "Số trang tùy chỉnh" : isThai ? "กำหนดเลขหน้าเอง" : isMalay ? "Nombor Halaman Tersuai" : isFinnish ? "Mukautettu sivunumero" : isNorwegian ? "Egendefinert sidetall" : isDanish ? "Brugerdefineret sidetal" : isSwedish ? "Anpassat sidnummer" : "Custom Page Offset" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setBlankPosition(pos.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      blankPosition === pos.id ? "bg-fk-primary text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              {blankPosition === "custom" && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-400">
                    {isChinese ? (isTaiwan ? "在此頁碼之後插入空白頁:" : "在此页码之后插入空白页:") : isKorean ? "지정된 페이지 번호 뒤에 빈 페이지 삽입:" : isJapanese ? "指定ページ番号の後に空白ページを挿入:" : isFilipino ? "Magpasok ng blangkong pahina pagkatapos ng numerong:" : isThai ? "แทรกหน้าว่างหลังจากหน้าที่:" : isMalay ? "Masukkan halaman kosong selepas nombor halaman:" : isFinnish ? "Lisää tyhjä sivu sivunumeron jälkeen:" : isNorwegian ? "Sett inn tom side etter sidetall:" : isDanish ? "Indsæt tom side efter sidetal:" : isSwedish ? "Infoga tom sida efter sidnummer:" : "Insert blank page after page number:"}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={customPageOffset}
                    onChange={(e) => setCustomPageOffset(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
              )}
            </div>
          )}

          {mode === "duplicate" && (
            <div className="flex flex-col gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                {isChinese ? (isTaiwan ? "頁面複製模式:" : "页面复制模式:") : isKorean ? "페이지 복제 모드:" : isJapanese ? "複製モード:" : isFilipino ? "Paraan ng Pagkopya:" : isThai ? "โหมดการทำซ้ำ:" : isMalay ? "Mod Penggandaan:" : isFinnish ? "Kahdentamistapa:" : isNorwegian ? "Dupliseringsmetode:" : isDanish ? "Duplikeringsmetode:" : isSwedish ? "Dupliceringsläge:" : "Duplication Mode:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all-consecutive", label: isChinese ? (isTaiwan ? "每頁連續複製 (1, 1, 2, 2...)" : "每页连续复制 (1, 1, 2, 2...)") : isKorean ? "각 페이지 연속 복제 (1, 1, 2, 2...)" : isJapanese ? "各ページを連続して複製 (1, 1, 2, 2...)" : isFilipino ? "Kopyahin ang Bawat Pahina nang Sunod-sunod (1, 1, 2, 2...)" : isThai ? "ทำซ้ำทุกหน้าเรียงต่อกัน (1, 1, 2, 2...)" : isMalay ? "Gandakan Setiap Halaman (1, 1, 2, 2...)" : isFinnish ? "Kahdenna jokainen sivu (1, 1, 2, 2...)" : isNorwegian ? "Dupliser hver side (1, 1, 2, 2...)" : isDanish ? "Dupliker hver side (1, 1, 2, 2...)" : isSwedish ? "Duplicera varje sida (1, 1, 2, 2...)" : "Duplicate Each Page (1, 1, 2, 2...)" },
                  { id: "all-appended", label: isChinese ? (isTaiwan ? "在末尾附加完整複本" : "在末尾附加完整副本") : isKorean ? "전체 사본을 끝에 추가" : isJapanese ? "全体のコピーを末尾に追加" : isFilipino ? "Idagdag ang Buong Kopya sa Dulo" : isThai ? "เพิ่มสำเนาทั้งหมดต่อท้าย" : isMalay ? "Tambah Salinan Penuh di Akhir" : isFinnish ? "Lisää koko kopio loppuun" : isNorwegian ? "Legg til full kopi til slutt" : isDanish ? "Tilføj fuld kopi til sidst" : isSwedish ? "Lägg till full kopia i slutet" : "Append Full Copy at End" },
                  { id: "selected", label: isChinese ? (isTaiwan ? "僅複製選定頁面" : "仅复制选定页面") : isKorean ? "선택한 페이지만 복제" : isJapanese ? "選択したページのみ複製" : isFilipino ? "Kopyahin Lamang ang mga Napiling Pahina" : isThai ? "ทำซ้ำเฉพาะหน้าที่เลือก" : isMalay ? "Gandakan Halaman Terpilih Sahaja" : isFinnish ? "Kahdenna vain valitut sivut" : isNorwegian ? "Dupliser kun valgte sider" : isDanish ? "Dupliker kun valgte sider" : isSwedish ? "Duplicera endast valda sidor" : "Duplicate Selected Pages Only" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDuplicateMode(m.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      duplicateMode === m.id ? "bg-fk-primary text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {duplicateMode === "selected" && (
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs text-slate-400">
                    {isChinese ? (isTaiwan ? "欲複製的頁碼 (以逗點分隔，例如: 1, 3, 5):" : "要复制的页码 (用逗号分隔，例如: 1, 3, 5):") : isKorean ? "복제할 페이지 번호 (쉼표로 구분, 예: 1, 3, 5):" : isJapanese ? "複製するページ番号（カンマ区切り、例: 1, 3, 5）:" : isFilipino ? "Mga numero ng pahina na kokopyahin (pinaghihiwalay ng kuwit, hal. 1, 3, 5):" : isThai ? "หมายเลขหน้าที่ต้องการทำซ้ำ (คั่นด้วยจุลภาค เช่น 1, 3, 5):" : isMalay ? "Nombor halaman untuk digandakan (dipisahkan koma, cth. 1, 3, 5):" : isFinnish ? "Kahdennettavat sivunumerot (esim. 1, 3, 5):" : isNorwegian ? "Sidetall som skal dupliseres (f.eks. 1, 3, 5):" : isDanish ? "Sidetal, der skal duplikeres (f.eks. 1, 3, 5):" : isSwedish ? "Sidnummer att duplicera (t.ex. 1, 3, 5):" : "Page numbers to duplicate (comma-separated, e.g. 1, 3, 5):"}
                  </label>
                  <input
                    type="text"
                    value={selectedPagesStr}
                    onChange={(e) => setSelectedPagesStr(e.target.value)}
                    placeholder="1, 3, 5"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-fk-primary"
                  />
                </div>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!downloadUrl && extractedImages.length === 0 && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleProcess}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isChinese ? (isTaiwan ? "本機裝置處理中..." : "本机设备处理中...") : isKorean ? "기기에서 처리 중..." : isJapanese ? "このデバイス上で処理中..." : isFilipino ? "Pinoproseso sa device na ito..." : isVietnamese ? "Đang xử lý trên thiết bị này..." : isThai ? "กำลังประมวลผลบนอุปกรณ์นี้..." : isMalay ? "Memproses pada peranti ini..." : isFinnish ? "Käsitellään tällä laitteella..." : isNorwegian ? "Behandler på denne enheten..." : isDanish ? "Behandler på denne enhed..." : isSwedish ? "Bearbetar på denna enhet..." : "Processing on this device..."}</span>
                </>
              ) : mode === "reverse" ? (
                isChinese ? (isTaiwan ? "反轉 PDF 頁面順序" : "反转 PDF 页面顺序") : isKorean ? "PDF 페이지 순서 반전" : isJapanese ? "PDFのページ順を反転" : isFilipino ? "Baligtarin ang Pagkakasunod-sunod ng mga Pahina" : isVietnamese ? "Đảo ngược thứ tự trang PDF" : isThai ? "กลับลำดับหน้า PDF" : isMalay ? "Balikkan Susunan Halaman PDF" : isFinnish ? "Käännä PDF:n sivujärjestys" : isNorwegian ? "Omvendt PDF-siderekkefølge" : isDanish ? "Omvend PDF-siderækkefølge" : isSwedish ? "Vänd PDF-sidordning" : "Reverse PDF Pages"
              ) : mode === "add-blank" ? (
                isChinese ? (isTaiwan ? "插入空白頁" : "插入空白页") : isKorean ? "빈 페이지 삽입" : isJapanese ? "空白ページを挿入" : isFilipino ? "Magpasok ng Blangkong Pahina" : isVietnamese ? "Chèn trang trống" : isThai ? "แทรกหน้าว่าง" : isMalay ? "Masukkan Halaman Kosong" : isFinnish ? "Lisää tyhjä sivu" : isNorwegian ? "Sett inn tom side" : isDanish ? "Indsæt tom(me) side(r)" : isSwedish ? "Infoga tom sida" : "Insert Blank Page(s)"
              ) : mode === "duplicate" ? (
                isChinese ? (isTaiwan ? "複製 PDF 頁面" : "复制 PDF 页面") : isKorean ? "PDF 페이지 복제" : isJapanese ? "PDFページを複製" : isFilipino ? "Kopyahin ang mga Pahina ng PDF" : isVietnamese ? "Nhân bản trang PDF" : isThai ? "ทำซ้ำหน้า PDF" : isMalay ? "Gandakan Halaman PDF" : isFinnish ? "Kahdenna PDF-sivut" : isNorwegian ? "Dupliser PDF-sider" : isDanish ? "Dupliker PDF-sider" : isSwedish ? "Duplicera PDF-sidor" : "Duplicate PDF Pages"
              ) : mode === "pdf-to-text" ? (
                isChinese ? (isTaiwan ? "擷取文字" : "提取文本") : isKorean ? "텍스트 추출" : isJapanese ? "テキストを抽出" : isFilipino ? "I-extract ang Teksto" : isVietnamese ? "Trích xuất văn bản" : isThai ? "แยกข้อความ" : isMalay ? "Ekstrak Teks" : isFinnish ? "Pura teksti" : isNorwegian ? "Pakk ut tekst" : isDanish ? "Udtræk tekst" : isSwedish ? "Extrahera text" : "Extract Text"
              ) : mode === "extract-images" ? (
                isChinese ? (isTaiwan ? "擷取圖片" : "提取图片") : isKorean ? "이미지 추출" : isJapanese ? "画像を抽出" : isFilipino ? "I-extract ang mga Larawan" : isVietnamese ? "Trích xuất hình ảnh" : isThai ? "แยกรูปภาพ" : isMalay ? "Ekstrak Imej" : isFinnish ? "Pura kuvat" : isNorwegian ? "Pakk ut bilder" : isDanish ? "Udtræk billeder" : isSwedish ? "Extrahera bilder" : "Extract Images"
              ) : (
                isChinese ? (isTaiwan ? "平面化 PDF 表單" : "合并扁平化 PDF 表单") : isKorean ? "PDF 양식 병합 (플래트닝)" : isJapanese ? "PDFフォームをフラット化" : isFilipino ? "I-flatten ang Form ng PDF" : isVietnamese ? "Làm phẳng biểu mẫu PDF" : isThai ? "ผสานแบบฟอร์ม PDF" : isMalay ? "Ratakan Borang PDF" : isFinnish ? "Litistä PDF-lomake" : isNorwegian ? "Flat ut PDF-skjema" : isDanish ? "Fladgør PDF-formular" : isSwedish ? "Platta till PDF" : "Flatten PDF Form"
              )}
            </button>
          )}

          {/* PDF to Text Viewer */}
          {extractedText !== null && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  {isChinese ? (isTaiwan ? "擷取出的文字內容:" : "提取的文本内容:") : isKorean ? "추출된 텍스트:" : isJapanese ? "抽出されたテキスト:" : isFilipino ? "Nilalaman ng Na-extract na Teksto:" : isVietnamese ? "Nội dung văn bản đã trích xuất:" : isThai ? "เนื้อหาข้อความที่แยกได้:" : isMalay ? "Kandungan Teks Diekstrak:" : isFinnish ? "Pura teksti:" : isNorwegian ? "Utdratt tekst:" : isDanish ? "Udtrukket tekst:" : isSwedish ? "Extraherat textinnehåll:" : "Extracted Text Content:"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="text-xs font-bold text-fk-primary hover:text-white bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-lg transition"
                >
                  {isCopied ? (isChinese ? (isTaiwan ? "✓ 已複製！" : "✓ 已复制！") : isKorean ? "✓ 복사되었습니다!" : isJapanese ? "✓ コピーしました！" : isFilipino ? "✓ Nakopya!" : "✓ Disalin!") : isChinese ? (isTaiwan ? "📋 複製所有文字" : "📋 复制全部文本") : isKorean ? "📋 전체 텍스트 복사" : isJapanese ? "📋 すべてのテキストをコピー" : isFilipino ? "📋 Kopyahin ang Lahat ng Teksto" : isVietnamese ? "📋 Sao chép toàn bộ văn bản" : isThai ? "📋 คัดลอกข้อความทั้งหมด" : isMalay ? "📋 Salin Semua Teks" : isFinnish ? "📋 Kopioi kaikki teksti" : isNorwegian ? "📋 Kopier all tekst" : isDanish ? "📋 Kopiér al tekst" : isSwedish ? "📋 Kopiera all text" : "📋 Copy All Text"}
                </button>
              </div>
              <textarea
                readOnly
                value={extractedText}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none select-all leading-relaxed"
              />
            </div>
          )}

          {/* Extracted Images Viewer */}
          {extractedImages.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">
                  {isChinese ? (isTaiwan ? `已成功擷取 ${extractedImages.length} 張圖片` : `已成功提取 ${extractedImages.length} 张图片`) : isKorean ? `${extractedImages.length}개의 이미지가 성공적으로 추출되었습니다` : isJapanese ? `${extractedImages.length} 枚の画像を正常に抽出しました` : isFilipino ? `Matagumpay na na-extract ang ${extractedImages.length} na larawan` : isVietnamese ? `Trích xuất thành công ${extractedImages.length} hình ảnh` : isThai ? `แยกรูปภาพสำเร็จ ${extractedImages.length} รูป` : isMalay ? `Berjaya mengekstrak ${extractedImages.length} imej` : isFinnish ? `Purettu ${extractedImages.length} kuva(a)` : isNorwegian ? `Pakket ut ${extractedImages.length} bilde(r)` : isDanish ? `Udtrak ${extractedImages.length} billede(r)` : isSwedish ? `Extraherade ${extractedImages.length} bild(er)` : `Extracted ${extractedImages.length} Image(s)`}
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {extractedImages.map((img) => {
                  const blob = new Blob([img.data as unknown as BlobPart], { type: "image/png" });
                  const url = URL.createObjectURL(blob);
                  return (
                    <div key={img.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                      <img src={url} alt={`Page ${img.pageIndex}`} className="h-32 object-contain rounded-lg bg-slate-900" />
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{isChinese ? (isTaiwan ? `第 ${img.pageIndex} 頁` : `第 ${img.pageIndex} 页`) : isKorean ? `페이지 ${img.pageIndex}` : isJapanese ? `ページ ${img.pageIndex}` : isFilipino ? `Pahina ${img.pageIndex}` : isVietnamese ? `Trang ${img.pageIndex}` : isThai ? `หน้า ${img.pageIndex}` : isMalay ? `Halaman ${img.pageIndex}` : isFinnish ? `Sivu ${img.pageIndex}` : `Side ${img.pageIndex}`}</span>
                        <span>{img.width}×{img.height}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleImage(img)}
                        className="w-full bg-fk-primary/80 hover:bg-fk-primary text-white text-xs font-bold py-1.5 rounded-lg transition"
                      >
                        {isChinese ? (isTaiwan ? "下載 PNG" : "下载 PNG") : isKorean ? "PNG 다운로드" : isJapanese ? "PNGをダウンロード" : isFilipino ? "I-download ang PNG" : isVietnamese ? "Tải xuống PNG" : isThai ? "ดาวน์โหลด PNG" : isMalay ? "Muat Turun PNG" : "Download PNG"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Download Result Card */}
          {downloadUrl && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isChinese ? (isTaiwan ? "處理完成" : "处理完成") : isKorean ? "처리가 완료되었습니다" : isJapanese ? "処理が完了しました" : isFilipino ? "Tapos na ang Operasyon" : isVietnamese ? "Thao tác hoàn tất" : isThai ? "การดำเนินการเสร็จสมบูรณ์" : isMalay ? "Operasi Selesai" : isFinnish ? "Toiminto valmis" : isNorwegian ? "Handling fullført" : isDanish ? "Handling fuldført" : isSwedish ? "Åtgärd slutförd" : "Operation Complete"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {outputFileName} • {(outputSizeBytes / 1024).toFixed(1)} KB • {isChinese ? (isTaiwan ? "100% 本機端安全處理" : "100% 本地端安全处理") : isKorean ? "100% 로컬 처리 완료" : isJapanese ? "100% ローカルで処理済み" : isFilipino ? "100% na naproseso nang lokal" : isVietnamese ? "Được xử lý 100% cục bộ" : isThai ? "ประมวลผลในเครื่อง 100%" : isMalay ? "Diproses 100% secara setempat" : isFinnish ? "Käsitelty 100% paikallisesti" : isNorwegian ? "Behandlet 100% lokalt" : isDanish ? "Behandlet 100% lokalt" : isSwedish ? "Bearbetad 100% lokalt" : "Processed 100% locally"}
                  </p>
                </div>
              </div>
              <a
                href={downloadUrl}
                download={outputFileName}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition text-center shadow-lg"
              >
                {isChinese ? (isTaiwan ? "下載檔案" : "下载文件") : isKorean ? "파일 다운로드" : isJapanese ? "ファイルをダウンロード" : isFilipino ? "I-download ang File" : isVietnamese ? "Tải xuống tệp" : isThai ? "ดาวน์โหลดไฟล์" : isMalay ? "Muat Turun Fail" : isFinnish ? "Lataa tiedosto" : isNorwegian ? "Last ned fil" : isDanish ? "Download fil" : isSwedish ? "Ladda ner fil" : "Download File"}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
