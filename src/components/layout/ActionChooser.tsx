"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

interface ActionChooserProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onSelectAction: (actionId: string) => void;
}

export default function ActionChooser({
  isOpen,
  file,
  onClose,
  onSelectAction,
}: ActionChooserProps) {
  const { t, language } = useLanguage();
  const isChinese = language.startsWith("zh");
  const isTaiwan = language === "zh-TW";
  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";
  const isSwedish = language === "sv";
  const isDanish = language === "da";
  const isFinnish = language === "fi";
  const isNorwegian = language === "no";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";

  if (!isOpen || !file) return null;

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp|tiff|avif|ico)$/i.test(file.name);
  const isOffice = /\.(docx?|xlsx?|pptx?)$/i.test(file.name);
  const isArchive = /\.(zip|rar|7z|tar)$/i.test(file.name);
  const isAudioVideo = /\.(mp3|wav|ogg|m4a|mp4|mov|avi|mkv|webm)$/i.test(file.name);

  // Recommendations depending on file type
  const pdfActions = [
    { id: "compress-pdf", label: t("breadcrumb.compress"), desc: t("tool.compress.desc"), active: true },
    { id: "merge-pdf", label: t("tool.merge.title"), desc: t("tool.merge.desc"), active: true },
    { id: "pdf-to-word", label: t("tool.pdfToWord.title"), desc: t("tool.pdfToWord.desc"), active: true },
    { id: "ocr-pdf", label: isChinese ? (isTaiwan ? "OCR PDF (可搜尋文字)" : "OCR PDF (可搜索文本)") : isKorean ? "OCR PDF (검색 가능한 텍스트)" : isJapanese ? "OCR PDF（テキスト検索可能化）" : isFilipino ? "OCR PDF (Mahahanap na Teksto)" : isVietnamese ? "OCR PDF (Tìm kiếm được)" : isThai ? "OCR PDF (ค้นหาข้อความได้)" : isMalay ? "OCR PDF (Teks Boleh Dicari)" : isSwedish ? "OCR PDF (Sökbar text)" : isDanish ? "OCR PDF (Søgbar tekst)" : isFinnish ? "OCR PDF (Tekstintunnistus)" : isNorwegian ? "OCR PDF (Søkbar tekst)" : "OCR PDF (Searchable Text)", desc: isChinese ? (isTaiwan ? "從掃描的 PDF 中辨識並擷取文字" : "从扫描的 PDF 中识别并提取文本") : isKorean ? "스캔한 PDF에서 텍스트 인식 및 추출" : isJapanese ? "スキャンしたPDFから文字を認識・抽出" : isFilipino ? "Mag-extract ng teksto mula sa na-scan na PDF" : isVietnamese ? "Trích xuất văn bản từ bản quét PDF" : isThai ? "ทำให้ไฟล์สแกน PDF ค้นหาข้อความได้" : isMalay ? "Jadikan PDF yang diimbas boleh dicari" : isSwedish ? "Gör skannad PDF sökbar" : isDanish ? "Gør scannet PDF søgbar" : isFinnish ? "Tee skannatusta PDF:stä haettava" : isNorwegian ? "Gjør skannet PDF søkbar" : "Extract text from scanned PDF", active: true },
  ];

  const imageActions = [
    { id: "resize-image", label: t("tool.resize.title"), desc: t("tool.resize.desc"), active: true },
    { id: "convert-image", label: t("tool.convert.title"), desc: t("tool.convert.desc"), active: true },
    { id: "strip-exif", label: isChinese ? (isTaiwan ? "清除中繼資料 (EXIF/GPS)" : "清除元数据 (EXIF/GPS)") : isKorean ? "메타데이터 삭제 (EXIF/GPS)" : isJapanese ? "メタデータ削除（EXIF/GPS）" : isFilipino ? "Alisin ang Metadata (EXIF/GPS)" : isVietnamese ? "Xóa siêu dữ liệu (EXIF/GPS)" : isThai ? "ลบข้อมูลเมทาดาทา (EXIF/GPS)" : isMalay ? "Buang Metadata (EXIF/GPS)" : isSwedish ? "Rensa metadata (EXIF/GPS)" : isDanish ? "Fjern metadata (EXIF/GPS)" : isFinnish ? "Poista metatiedot (EXIF/GPS)" : isNorwegian ? "Fjern metadata (EXIF/GPS)" : "Strip Metadata (EXIF/GPS)", desc: isChinese ? (isTaiwan ? "完全抹除 GPS 定位與拍攝裝置資訊" : "完全抹除 GPS 定位与拍摄设备信息") : isKorean ? "GPS 위치 정보 및 카메라 기기 정보 완전 삭제" : isJapanese ? "位置情報・撮影機器情報を完全消去" : isFilipino ? "Alisin ang lokasyon ng GPS at data ng camera" : isVietnamese ? "Xóa dữ liệu vị trí GPS và máy ảnh" : isThai ? "ลบข้อมูลตำแหน่ง GPS และข้อมูลอุปกรณ์กล้อง" : isMalay ? "Padam data lokasi dan peranti kamera" : isSwedish ? "Ta bort plats och kameradata" : isDanish ? "Fjern placering og kameradata" : isFinnish ? "Poista sijainti- ja kameratiedot" : isNorwegian ? "Fjern posisjons- og kameradata" : "Remove GPS and device data", active: true },
  ];

  const officeActions = [
    { id: "word-to-pdf", label: isChinese ? (isTaiwan ? "Word 轉 PDF" : "Word 转 PDF") : isKorean ? "Word를 PDF로 변환" : isJapanese ? "Word を PDF に変換" : isFilipino ? "Word sa PDF" : isVietnamese ? "Word sang PDF" : isThai ? "Word เป็น PDF" : isMalay ? "Word ke PDF" : isSwedish ? "Word till PDF" : isDanish ? "Word til PDF" : isFinnish ? "Word PDF:ksi" : isNorwegian ? "Word til PDF" : "Word to PDF", desc: isChinese ? (isTaiwan ? "將 DOCX 文件轉換為高保真 PDF" : "将 DOCX 文档转换为高保真 PDF") : isKorean ? "DOCX 문서를 고정밀 PDF로 변환" : isJapanese ? "DOCX ファイルを高精度で PDF に変換" : isFilipino ? "I-convert ang mga file na DOCX sa PDF" : isVietnamese ? "Chuyển đổi tệp DOCX sang PDF" : isThai ? "แปลงไฟล์ DOCX เป็น PDF" : isMalay ? "Tukar fail DOCX ke PDF" : isSwedish ? "Konvertera DOCX till PDF" : isDanish ? "Konverter DOCX til PDF" : isFinnish ? "Muunna DOCX PDF:ksi" : isNorwegian ? "Konverter DOCX til PDF" : "Convert DOCX to PDF", active: true },
    { id: "excel-to-pdf", label: isChinese ? (isTaiwan ? "Excel 轉 PDF" : "Excel 转 PDF") : isKorean ? "Excel을 PDF로 변환" : isJapanese ? "Excel を PDF に変換" : isFilipino ? "Excel sa PDF" : isVietnamese ? "Excel sang PDF" : isThai ? "Excel เป็น PDF" : isMalay ? "Excel ke PDF" : isSwedish ? "Excel till PDF" : isDanish ? "Excel til PDF" : isFinnish ? "Excel PDF:ksi" : isNorwegian ? "Excel til PDF" : "Excel to PDF", desc: isChinese ? (isTaiwan ? "將 XLSX 試算表轉換為 PDF" : "将 XLSX 电子表格转换为 PDF") : isKorean ? "XLSX 스프레드시트를 PDF로 변환" : isJapanese ? "XLSX スプレッドシートを PDF に変換" : isFilipino ? "I-convert ang mga file na XLSX sa PDF" : isVietnamese ? "Chuyển đổi tệp XLSX sang PDF" : isThai ? "แปลงไฟล์ XLSX เป็น PDF" : isMalay ? "Tukar fail XLSX ke PDF" : isSwedish ? "Konvertera XLSX till PDF" : isDanish ? "Konverter XLSX til PDF" : isFinnish ? "Muunna XLSX PDF:ksi" : isNorwegian ? "Konverter XLSX til PDF" : "Convert XLSX to PDF", active: true },
    { id: "powerpoint-to-pdf", label: isChinese ? (isTaiwan ? "PowerPoint 轉 PDF" : "PowerPoint 转 PDF") : isKorean ? "PowerPoint를 PDF로 변환" : isJapanese ? "PowerPoint を PDF に変換" : isFilipino ? "PowerPoint sa PDF" : isVietnamese ? "PowerPoint sang PDF" : isThai ? "PowerPoint เป็น PDF" : isMalay ? "PowerPoint ke PDF" : isSwedish ? "PowerPoint till PDF" : isDanish ? "PowerPoint til PDF" : isFinnish ? "PowerPoint PDF:ksi" : isNorwegian ? "PowerPoint til PDF" : "PowerPoint to PDF", desc: isChinese ? (isTaiwan ? "將 PPTX 簡報轉換為 PDF" : "将 PPTX 演示文稿转换为 PDF") : isKorean ? "PPTX 프레젠테이션을 PDF로 변환" : isJapanese ? "PPTX プレゼンテーションを PDF に変換" : isFilipino ? "I-convert ang mga file na PPTX sa PDF" : isVietnamese ? "Chuyển đổi tệp PPTX sang PDF" : isThai ? "แปลงไฟล์ PPTX เป็น PDF" : isMalay ? "Tukar fail PPTX ke PDF" : isSwedish ? "Konvertera PPTX till PDF" : isDanish ? "Konverter PPTX til PDF" : isFinnish ? "Muunna PPTX PDF:ksi" : isNorwegian ? "Konverter PPTX til PDF" : "Convert PPTX to PDF", active: true },
  ];

  const archiveActions = [
    { id: "extract-zip", label: isChinese ? (isTaiwan ? "解壓縮 (ZIP/RAR/7Z)" : "解压归档 (ZIP/RAR/7Z)") : isKorean ? "압축 풀기 (ZIP/RAR/7Z)" : isJapanese ? "アーカイブ解凍・展開" : isFilipino ? "I-extract ang Archive" : isVietnamese ? "Giải nén tệp lưu trữ" : isThai ? "แตกไฟล์คลังข้อมูล" : isMalay ? "Ekstrak Arkib" : isSwedish ? "Extrahera arkiv" : isDanish ? "Udpak arkiv" : isFinnish ? "Pura arkisto" : isNorwegian ? "Pakk ut arkiv" : "Extract Archive", desc: isChinese ? (isTaiwan ? "解壓縮 ZIP、RAR、7Z 壓縮檔" : "解压缩 ZIP、RAR、7Z 压缩文件") : isKorean ? "ZIP, RAR, 7Z 압축 파일 해제" : isJapanese ? "ZIP、RAR、7Z ファイルを展開" : isFilipino ? "I-unpack ang ZIP, RAR, 7Z" : isVietnamese ? "Giải nén tệp nén ZIP, RAR, 7Z" : isThai ? "แตกไฟล์ที่บีบอัด ZIP, RAR, 7Z" : isMalay ? "Buka mampatan fail ZIP, RAR, 7Z" : isSwedish ? "Packa upp ZIP, RAR, 7Z" : isDanish ? "Udpak ZIP, RAR, 7Z" : isFinnish ? "Pura ZIP, RAR, 7Z" : isNorwegian ? "Pakk ut ZIP, RAR, 7Z" : "Unpack ZIP, RAR, 7Z", active: true },
    { id: "create-zip", label: isChinese ? (isTaiwan ? "建立 ZIP 壓縮檔" : "创建 ZIP 压缩文件") : isKorean ? "ZIP 압축 파일 생성" : isJapanese ? "ZIP アーカイブ作成" : isFilipino ? "Gumawa ng ZIP Archive" : isVietnamese ? "Tạo tệp lưu trữ ZIP" : isThai ? "สร้างไฟล์บีบอัด ZIP" : isMalay ? "Cipta Arkib ZIP" : isSwedish ? "Skapa ZIP-arkiv" : isDanish ? "Opret ZIP-arkiv" : isFinnish ? "Luo ZIP-arkisto" : isNorwegian ? "Opprett ZIP-arkiv" : "Create ZIP Archive", desc: isChinese ? (isTaiwan ? "將檔案打包為 ZIP 格式壓縮" : "将文件打包为 ZIP 格式压缩") : isKorean ? "파일들을 ZIP 형식으로 압축" : isJapanese ? "ファイルを ZIP 形式に圧縮" : isFilipino ? "I-compress ang mga file sa ZIP" : isVietnamese ? "Nén các tệp thành định dạng ZIP" : isThai ? "บีบอัดไฟล์เป็นรูปแบบ ZIP" : isMalay ? "Mampatkan fail ke format ZIP" : isSwedish ? "Komprimera filer till ZIP" : isDanish ? "Komprimer filer til ZIP" : isFinnish ? "Pakkaa tiedostot ZIP:iksi" : isNorwegian ? "Komprimer filer til ZIP" : "Compress files to ZIP", active: true },
  ];
  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-fk-border rounded-fk-xl shadow-lg max-w-[480px] w-full p-6 text-left ltr:text-left rtl:text-right animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col min-w-0">
            <h3 className="text-[18px] font-black text-fk-text leading-tight truncate">
              {isChinese ? (isTaiwan ? "已選取檔案" : "已选择文件") : isKorean ? "파일이 선택되었습니다" : isJapanese ? "ファイルが選択されました" : isFilipino ? "Napili ang file" : isVietnamese ? "Đã chọn tệp" : isThai ? "เลือกไฟล์แล้ว" : isMalay ? "Fail dipilih" : isSwedish ? "Fil vald" : isDanish ? "Fil valgt" : isFinnish ? "Tiedosto valittu" : isNorwegian ? "Fil valgt" : "File selected"}
            </h3>
            <span className="text-[12px] text-fk-text-subtle truncate mt-1 max-w-[360px] font-mono block">
              {file.name}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-fk-text-muted hover:text-fk-text rounded-full hover:bg-fk-surface-muted transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fk-primary"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="flex flex-col gap-4">
          <p className="text-[13px] text-fk-text-muted leading-relaxed">
            {isChinese ? (isTaiwan ? "您想對此檔案進行什麼操作？" : "您想对此文件进行什么操作？") : isKorean ? "이 파일에 대해 어떤 작업을 수행하시겠습니까?" : isJapanese ? "このファイルに対してどのような操作を行いますか？" : isFilipino ? "Anong aksyon ang kailangan mong gawin sa file na ito?" : isVietnamese ? "Bạn muốn thực hiện thao tác nào trên tệp này?" : isThai ? "คุณต้องการดำเนินการใดกับไฟล์นี้?" : isMalay ? "Apakah tindakan yang ingin anda lakukan pada fail ini?" : isSwedish ? "Vad vill du göra med den här filen?" : isDanish ? "Hvad vil du gøre med denne fil?" : isFinnish ? "Mitä haluat tehdä tälle tiedostolle?" : isNorwegian ? "Hva vil du gjøre med denne filen?" : "What action do you need to perform on this file?"}
          </p>

          {isPdf && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {isChinese ? (isTaiwan ? "推薦 PDF 操作" : "推荐 PDF 操作") : isKorean ? "추천 PDF 작업" : isJapanese ? "おすすめの PDF 操作" : isFilipino ? "Mga Inirerekomendang Aksyon sa PDF" : isVietnamese ? "Tác vụ PDF đề xuất" : isThai ? "การดำเนินการ PDF ที่แนะนำ" : isMalay ? "Tindakan PDF Disyorkan" : isSwedish ? "Rekommenderade PDF-åtgärder" : isDanish ? "Anbefalede PDF-handlinger" : isFinnish ? "Suositellut PDF-toiminnot" : isNorwegian ? "Anbefalte PDF-handlinger" : "Recommended PDF Actions"}
              </span>
              {pdfActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{isChinese ? (isTaiwan ? "開始 →" : "开始 →") : isKorean ? "시작 →" : isJapanese ? "開始 →" : isFilipino ? "Simulan →" : isVietnamese ? "Bắt đầu →" : isThai ? "เริ่ม →" : isMalay ? "Mula →" : isSwedish ? "Starta →" : isDanish ? "Start →" : isFinnish ? "Aloita →" : isNorwegian ? "Start →" : "Start →"}</span>
                </button>
              ))}
            </div>
          )}

          {isImage && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {isChinese ? (isTaiwan ? "推薦圖片操作" : "推荐图片操作") : isKorean ? "추천 이미지 작업" : isJapanese ? "おすすめの画像操作" : isFilipino ? "Mga Inirerekomendang Aksyon sa Larawan" : isVietnamese ? "Tác vụ hình ảnh đề xuất" : isThai ? "การดำเนินการรูปภาพที่แนะนำ" : isMalay ? "Tindakan Imej Disyorkan" : isSwedish ? "Rekommenderade bildåtgärder" : isDanish ? "Anbefalede billedhandlinger" : isFinnish ? "Suositellut kuvatoiminnot" : isNorwegian ? "Anbefalte bildehandlinger" : "Recommended Image Actions"}
              </span>
              {imageActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{isChinese ? (isTaiwan ? "開始 →" : "开始 →") : isKorean ? "시작 →" : isJapanese ? "開始 →" : isFilipino ? "Simulan →" : isVietnamese ? "Bắt đầu →" : isThai ? "เริ่ม →" : isMalay ? "Mula →" : isSwedish ? "Starta →" : isDanish ? "Start →" : isFinnish ? "Aloita →" : isNorwegian ? "Start →" : "Start →"}</span>
                </button>
              ))}
            </div>
          )}

          {isOffice && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {isChinese ? (isTaiwan ? "推薦 Office 操作" : "推荐 Office 操作") : isKorean ? "추천 Office 작업" : isJapanese ? "Office 操作" : isFilipino ? "Mga Aksyon sa Office" : isVietnamese ? "Tác vụ Office" : isThai ? "การดำเนินการไฟล์ Office" : isMalay ? "Tindakan Office" : isSwedish ? "Office-konvertering" : isDanish ? "Office-konvertering" : isFinnish ? "Office-muunnokset" : isNorwegian ? "Office-konvertering" : "Office Actions"}
              </span>
              {officeActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{isChinese ? (isTaiwan ? "開始 →" : "开始 →") : isKorean ? "시작 →" : isJapanese ? "開始 →" : isFilipino ? "Simulan →" : isVietnamese ? "Bắt đầu →" : isThai ? "เริ่ม →" : isMalay ? "Mula →" : isSwedish ? "Starta →" : isDanish ? "Start →" : isFinnish ? "Aloita →" : isNorwegian ? "Start →" : "Start →"}</span>
                </button>
              ))}
            </div>
          )}

          {isArchive && (
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold text-fk-text-subtle tracking-wider uppercase">
                {isChinese ? (isTaiwan ? "推薦壓縮檔操作" : "推荐压缩包操作") : isKorean ? "추천 압축 작업" : isJapanese ? "アーカイブ操作" : isFilipino ? "Mga Aksyon sa Archive" : isVietnamese ? "Tác vụ tệp lưu trữ" : isThai ? "การดำเนินการไฟล์คลังข้อมูล" : isMalay ? "Tindakan Arkib" : isSwedish ? "Arkivåtgärder" : isDanish ? "Arkivhandlinger" : isFinnish ? "Arkistotoiminnot" : isNorwegian ? "Arkivhandlinger" : "Archive Actions"}
              </span>
              {archiveActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  disabled={!act.active}
                  onClick={() => onSelectAction(act.id)}
                  className="w-full flex items-center justify-between p-3.5 border rounded-fk-md transition-all duration-150 text-left ltr:text-left rtl:text-right border-fk-border hover:border-fk-primary bg-white hover:bg-fk-primary/[0.02] cursor-pointer"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-fk-text">{act.label}</span>
                    <span className="text-[11px] text-fk-text-subtle mt-0.5">{act.desc}</span>
                  </div>
                  <span className="text-[13px] font-bold text-fk-primary">{isChinese ? (isTaiwan ? "開始 →" : "开始 →") : isKorean ? "시작 →" : isJapanese ? "開始 →" : isFilipino ? "Simulan →" : isVietnamese ? "Bắt đầu →" : isThai ? "เริ่ม →" : isMalay ? "Mula →" : isSwedish ? "Starta →" : isDanish ? "Start →" : isFinnish ? "Aloita →" : isNorwegian ? "Start →" : "Start →"}</span>
                </button>
              ))}
            </div>
          )}

          {!isPdf && !isImage && !isOffice && !isArchive && !isAudioVideo && (
            <div className="flex flex-col gap-3 mt-2 p-4 bg-fk-danger-bg border border-fk-danger/20 rounded-fk-md text-center">
              <span className="text-[14px] font-bold text-fk-text">
                {isChinese ? (isTaiwan ? "從工具目錄中選擇" : "从工具目录中选择") : isKorean ? "카탈로그에서 도구 선택" : isJapanese ? "カタログからツールを選択" : isFilipino ? "Pumili ng tool mula sa catalog" : isThai ? "เลือกเครื่องมือจากแคตตาล็อก" : isMalay ? "Format fail disokong" : isSwedish ? "Filformat stöds" : "Select a tool from catalog"}
              </span>
              <p className="text-[11px] text-fk-text-muted">
                {isChinese
                  ? (isTaiwan ? "探索工具目錄中 100 多種專業工具，以處理您的檔案。" : "探索工具目录中 100 多种专业工具，以处理您的文件。")
                  : isKorean
                  ? "문서를 처리하려면 카탈로그의 100개 이상의 도구 중에서 적합한 도구를 선택하세요."
                  : isJapanese
                  ? "ドキュメントを処理するには、カタログ内の100種類以上のツールから最適なものを選択してください。"
                  : isFilipino
                  ? "Tuklasin ang lahat ng higit sa 100 mga tool sa catalog upang iproseso ang iyong dokumento."
                  : isThai
                  ? "สำรวจเครื่องมือกว่า 100 รายการในแคตตาล็อกเพื่อประมวลผลเอกสารของคุณ"
                  : isMalay
                  ? "Terokai lebih 100 alat dalam katalog untuk memproses dokumen anda."
                  : isSwedish
                  ? "Utforska över 100 verktyg i katalogen för att bearbeta ditt dokument."
                  : "Explore all 100+ tools in the catalog to process your document."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
