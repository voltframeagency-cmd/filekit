"use client";

import React, { useState, useEffect } from "react";
import { MetadataEngine, DetectedMetadata } from "./MetadataEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface PrivacyWorkspaceProps {
  title?: string;
  description?: string;
  embedded?: boolean;
  language?: string;
}

export function PrivacyWorkspace({ title, description, embedded = true, language: propLang }: PrivacyWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const isJapanese = language === "ja";
  const isKorean = language === "ko";
  const isTaiwan = language === "zh-TW" || (language as string).toLowerCase() === "zh-tw";
  const isSimplifiedChinese = !isTaiwan && (language === "zh-CN" || (language as string).toLowerCase() === "zh-cn" || language.startsWith("zh"));
  const isChinese = isTaiwan || isSimplifiedChinese;
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";
  const isItalian = language === "it";
  const isDutch = language === "nl";
  const isCatalan = language === "ca";
  const isSwedish = language === "sv";
  const isDanish = language === "da";
  const isFinnish = language === "fi";

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<DetectedMetadata | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [previewUrl, outputUrl]);

  const handleFileSelected = async (selectedFile: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      const detected = MetadataEngine.inspectMetadata(buf);
      setMetadata(detected);
    } catch (err) {
      console.error(err);
      setError(
        isSwedish
          ? "Kunde inte granska filens metadata."
          : isDanish
          ? "Kunne ikke inspicere filens metadata."
          : isFinnish
          ? "Tiedoston metatietojen tarkistaminen epäonnistui."
          : isCatalan
          ? "Error en analitzar les metadades del fitxer."
          : isDutch
          ? "Kan bestandsmetagegevens niet inspecteren."
          : isItalian
          ? "Impossibile analizzare i metadati del file."
          : isPortuguese
          ? "Falha ao inspecionar os metadados do ficheiro."
          : isFrench
          ? "Échec de l'analyse des métadonnées du fichier."
          : isGerman
          ? "Fehler beim Lesen der Dateimetadaten."
          : isSpanish
          ? "Error al inspeccionar los metadatos del archivo."
          : "Failed to inspect file metadata."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStripMetadata = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      const cleanBytes = MetadataEngine.stripMetadata(buf, file.type);
      const blob = new Blob([cleanBytes as unknown as BlobPart], { type: file.type || "image/jpeg" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
    } catch (err) {
      console.error(err);
      setError(
        isSwedish
          ? "Kunde inte ta bort metadata från filen."
          : isDanish
          ? "Kunne ikke fjerne metadata fra filen."
          : isFinnish
          ? "Metatietojen poistaminen tiedostosta epäonnistui."
          : isCatalan
          ? "Error en eliminar les metadades del fitxer."
          : isDutch
          ? "Kan metagegevens niet van het bestand verwijderen."
          : isItalian
          ? "Impossibile rimuovere i metadati dal file."
          : isPortuguese
          ? "Falha ao remover os metadados do ficheiro."
          : isFrench
          ? "Échec de la suppression des métadonnées du fichier."
          : isGerman
          ? "Fehler beim Entfernen der Metadaten."
          : isSpanish
          ? "Error al eliminar los metadatos del archivo."
          : "Failed to strip metadata from file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-fk-xl shadow-fk-card border border-slate-100">
      {!embedded && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || "Strip EXIF & Photo Metadata"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"}
          </p>
        </div>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpeg,image/png,image/webp";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {isJapanese
              ? "メタデータを削除する写真を選択"
              : isKorean
              ? "메타데이터를 삭제할 사진 선택"
              : isSwedish
              ? "Välj foton för att ta bort metadata"
              : isDanish
              ? "Vælg fotos for at fjerne metadata"
              : isFinnish
              ? "Valitse kuvat metatietojen poistamiseksi"
              : isCatalan
              ? "Selecciona fotos per eliminar les metadades"
              : isDutch
              ? "Selecteer foto om metagegevens te verwijderen"
              : isItalian
              ? "Seleziona foto per rimuovere i metadati"
              : isPortuguese
              ? "Selecionar foto para remover metadados"
              : isFrench
              ? "Sélectionner une photo pour supprimer les métadonnées"
              : isGerman
              ? "Foto auswählen, um Metadaten zu entfernen"
              : isSpanish
              ? "Selecciona foto para eliminar metadatos"
              : isTaiwan
              ? "選取相片以清除中繼資料"
              : isSimplifiedChinese
              ? "选择照片以清除元数据"
              : "Select Photo to Strip Metadata"}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isJapanese
              ? "JPG、PNG、WebPに対応（サーバーへの送信なし・100%ローカル処理）"
              : isKorean
              ? "JPG, PNG, WebP 지원 (서버 전송 없음 · 100% 로컬 처리)"
              : isSwedish
              ? "Stöder JPG, PNG och WebP (100% privat bearbetning)"
              : isDanish
              ? "Understøtter JPG, PNG og WebP (100% privat behandling)"
              : isFinnish
              ? "Tukee JPG, PNG ja WebP (100% yksityinen käsittely)"
              : isCatalan
              ? "Admet JPG, PNG i WebP (Processament 100% privat)"
              : isDutch
              ? "Ondersteunt JPG, PNG en WebP (100% privéverwerking)"
              : isItalian
              ? "Supporta JPG, PNG e WebP (Elaborazione 100% privata)"
              : isPortuguese
              ? "Suporta JPG, PNG e WebP (Processamento 100% privado)"
              : isFrench
              ? "Prend en charge JPG, PNG et WebP (Traitement 100% privé)"
              : isGerman
              ? "Unterstützt JPG, PNG und WebP (100% private Verarbeitung)"
              : isSpanish
              ? "Admite JPG, PNG y WebP (Procesamiento 100% privado)"
              : isTaiwan
              ? "支援 JPG、PNG 與 WebP（100% 本機處理，絕不上傳至伺服器）"
              : isSimplifiedChinese
              ? "支持 JPG、PNG 和 WebP（100%本地处理，零服务器上传）"
              : "Supports JPG, PNG, and WebP (Zero uploads to servers)"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* File & Privacy Audit Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isJapanese ? "ファイル詳細" : isKorean ? "파일 정보" : isSwedish ? "Fildetaljer" : isDanish ? "Fildetaljer" : isFinnish ? "Tiedoston tiedot" : isCatalan ? "Detalls del fitxer" : isDutch ? "Bestandsdetails" : isItalian ? "Dettagli del file" : isPortuguese ? "Detalhes do ficheiro" : isFrench ? "Détails du fichier" : isGerman ? "Dateidetails" : isSpanish ? "Detalles del archivo" : isTaiwan ? "檔案詳細資訊" : isSimplifiedChinese ? "文件详细信息" : "File Details"}
              </span>
              <span className="text-sm font-semibold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isJapanese ? "検出されたメタデータ" : isKorean ? "감지된 메타데이터" : isSwedish ? "Upptäckta metadata" : isDanish ? "Registrerede metadata" : isFinnish ? "Havaitut metatiedot" : isCatalan ? "Metadades detectades" : isDutch ? "Gedetecteerde metagegevens" : isItalian ? "Metadati rilevati" : isPortuguese ? "Metadados detetados" : isFrench ? "Métadonnées détectées" : isGerman ? "Erkannte Metadaten" : isSpanish ? "Metadatos detectados" : isTaiwan ? "偵測到的中繼資料" : isSimplifiedChinese ? "检测到的元数据" : "Detected Metadata"}
              </span>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasGps ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  {isJapanese
                    ? `GPS位置情報: ${metadata?.hasGps ? "検出（漏洩リスク）" : "なし（安全）"}`
                    : isKorean
                    ? `GPS 위치: ${metadata?.hasGps ? "감지됨 (유출 위험)" : "없음 (안전)"}`
                    : isSwedish
                    ? `GPS-position: ${metadata?.hasGps ? "Upptäckt (Risk)" : "Ren"}`
                    : isDanish
                    ? `GPS-placering: ${metadata?.hasGps ? "Registreret (Risiko)" : "Ren"}`
                    : isFinnish
                    ? `GPS-sijainti: ${metadata?.hasGps ? "Havaittu (Riski)" : "Puhdas"}`
                    : isCatalan
                    ? `Ubicació GPS: ${metadata?.hasGps ? "Detectada (Risc)" : "Neta"}`
                    : isDutch
                    ? `GPS-locatie: ${metadata?.hasGps ? "Gedetecteerd (Risico)" : "Schoon"}`
                    : isItalian
                    ? `Posizione GPS: ${metadata?.hasGps ? "Rilevata (Rischio)" : "Pulita"}`
                    : isPortuguese
                    ? `Localização GPS: ${metadata?.hasGps ? "Detetada (Risco)" : "Limpa"}`
                    : isFrench
                    ? `Position GPS : ${metadata?.hasGps ? "Détectée (Risque)" : "Aucune"}`
                    : isGerman
                    ? `GPS-Ort: ${metadata?.hasGps ? "Erkannt (Sicherheitsrisiko)" : "Bereinigt"}`
                    : isSpanish
                    ? `Ubicación GPS: ${metadata?.hasGps ? "Detectada" : "Limpia"}`
                    : isTaiwan
                    ? `GPS 位置資訊：${metadata?.hasGps ? "已偵測（隱私外洩風險）" : "無（安全）"}`
                    : isSimplifiedChinese
                    ? `GPS 位置：${metadata?.hasGps ? "已检测（泄露风险）" : "无（安全）"}`
                    : `GPS Location: ${metadata?.hasGps ? "Detected (Vulnerable)" : "Clean"}`}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasExif ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  {isJapanese
                    ? `EXIFタグ: ${metadata?.hasExif ? "検出" : "なし"}`
                    : isKorean
                    ? `EXIF 태그: ${metadata?.hasExif ? "감지됨" : "없음"}`
                    : isSwedish
                    ? `EXIF-taggar: ${metadata?.hasExif ? "Upptäckta" : "Inga"}`
                    : isDanish
                    ? `EXIF-tags: ${metadata?.hasExif ? "Registreret" : "Ingen"}`
                    : isFinnish
                    ? `EXIF-tunnisteet: ${metadata?.hasExif ? "Havaittu" : "Ei mitään"}`
                    : isCatalan
                    ? `Etiquetes EXIF: ${metadata?.hasExif ? "Detectades" : "Cap"}`
                    : isDutch
                    ? `EXIF-tags: ${metadata?.hasExif ? "Gedetecteerd" : "Geen"}`
                    : isItalian
                    ? `Tag EXIF: ${metadata?.hasExif ? "Rilevati" : "Nessuno"}`
                    : isPortuguese
                    ? `Etiquetas EXIF: ${metadata?.hasExif ? "Detetadas" : "Nenhuma"}`
                    : isFrench
                    ? `Balises EXIF : ${metadata?.hasExif ? "Détectées" : "Aucune"}`
                    : isGerman
                    ? `EXIF-Geräte-Tags: ${metadata?.hasExif ? "Erkannt" : "Keine"}`
                    : isSpanish
                    ? `Etiquetas EXIF: ${metadata?.hasExif ? "Detectadas" : "Ninguna"}`
                    : isTaiwan
                    ? `EXIF 標籤：${metadata?.hasExif ? "已偵測" : "無"}`
                    : isSimplifiedChinese
                    ? `EXIF 标签：${metadata?.hasExif ? "已检测" : "无"}`
                    : `EXIF Device Tags: ${metadata?.hasExif ? "Detected" : "None"}`}
                </span>
                {metadata?.cameraMake && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                    {isJapanese ? "カメラ:" : isKorean ? "카메라:" : isSwedish ? "Kamera:" : isDanish ? "Kamera:" : isFinnish ? "Kamera:" : isCatalan ? "Càmera:" : isDutch ? "Camera:" : isItalian ? "Fotocamera:" : isPortuguese ? "Câmara:" : isFrench ? "Appareil :" : isGerman ? "Kamera:" : isSpanish ? "Cámara:" : isTaiwan ? "相機：" : isSimplifiedChinese ? "相机：" : "Camera:"} {metadata.cameraMake}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!outputUrl ? (
            <button
              onClick={handleStripMetadata}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold rounded-fk-lg shadow-fk-button transition-all text-base flex items-center justify-center gap-2"
            >
              {loading
                ? (isJapanese
                    ? "画像を処理中..."
                    : isKorean
                    ? "이미지 처리 중..."
                    : isSwedish
                    ? "Rensar bild..."
                    : isDanish
                    ? "Renser billede..."
                    : isFinnish
                    ? "Puhdistetaan kuvaa..."
                    : isCatalan
                    ? "Netejant imatge..."
                    : isDutch
                    ? "Afbeelding wordt opgeschoond..."
                    : isItalian
                    ? "Pulizia dell'immagine in corso..."
                    : isPortuguese
                    ? "A limpar imagem..."
                    : isFrench
                    ? "Nettoyage de l'image en cours..."
                    : isGerman
                    ? "Bild wird bereinigt..."
                    : isSpanish
                    ? "Limpiando imagen..."
                    : isTaiwan
                    ? "正在處理相片..."
                    : isSimplifiedChinese
                    ? "正在处理照片..."
                    : "Sanitizing image...")
                : (isJapanese
                    ? "すべてのEXIF・GPSメタデータを削除"
                    : isKorean
                    ? "모든 EXIF 및 GPS 메타데이터 삭제"
                    : isSwedish
                    ? "Ta bort alla EXIF- och GPS-metadata"
                    : isDanish
                    ? "Fjern alle EXIF- og GPS-metadata"
                    : isFinnish
                    ? "Poista kaikki EXIF- ja GPS-metatiedot"
                    : isCatalan
                    ? "Eliminar totes les metadades EXIF i GPS"
                    : isDutch
                    ? "Alle EXIF- en GPS-metagegevens verwijderen"
                    : isItalian
                    ? "Rimuovi tutti i metadati EXIF e GPS"
                    : isPortuguese
                    ? "Remover todos os metadados EXIF e GPS"
                    : isFrench
                    ? "Supprimer toutes les métadonnées EXIF et GPS"
                    : isGerman
                    ? "Alle EXIF- und GPS-Metadaten entfernen"
                    : isSpanish
                    ? "Eliminar todos los metadatos EXIF e GPS"
                    : isTaiwan
                    ? "清除所有 EXIF 與 GPS 中繼資料"
                    : isSimplifiedChinese
                    ? "清除所有 EXIF 与 GPS 元数据"
                    : "Strip All EXIF & GPS Metadata")}
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block">
                  {isJapanese
                    ? "✓ 画像の処理が完了しました！すべてのメタデータが削除されました。"
                    : isKorean
                    ? "✓ 이미지 처리 완료! 모든 메타데이터가 삭제되었습니다."
                    : isSwedish
                    ? "✓ Foto rensat (Inga GPS- eller kameradata)"
                    : isDanish
                    ? "✓ Foto renset (Ingen GPS- eller kameradata)"
                    : isFinnish
                    ? "✓ Kuva puhdistettu (Ei GPS- tai kameratietoja)"
                    : isCatalan
                    ? "✓ Foto netejada (Sense dades de GPS o càmera)"
                    : isDutch
                    ? "✓ Foto opgeschoond (Geen GPS- of cameragegevens)"
                    : isItalian
                    ? "✓ Foto pulita (Nessun dato GPS o fotocamera)"
                    : isPortuguese
                    ? "✓ Foto limpa (Sem GPS nem dados da câmara)"
                    : isFrench
                    ? "✓ Photo nettoyée (Aucun tag GPS, appareil ou numéro de série)"
                    : isGerman
                    ? "✓ Foto bereinigt (Keine GPS-, Geräte- oder Seriennummer-Tags)"
                    : isSpanish
                    ? "✓ Foto sanitizada (Sin GPS ni datos de cámara)"
                    : isTaiwan
                    ? "✓ 相片中繼資料已清除！所有 GPS 與相機資料已移除。"
                    : isSimplifiedChinese
                    ? "✓ 照片元数据已清除！所有 GPS 与相机信息已移除。"
                    : "✓ Photo Sanitized (Zero GPS, Device, or Serial Tags)"}
                </span>
                <span className="text-xs text-emerald-700">
                  {isJapanese
                    ? `ダウンロード準備完了: clean_${file.name}`
                    : isKorean
                    ? `다운로드 준비 완료: clean_${file.name}`
                    : isSwedish
                    ? `Klar att ladda ner: clean_${file.name}`
                    : isDanish
                    ? `Klar til download: clean_${file.name}`
                    : isFinnish
                    ? `Valmis ladattavaksi: clean_${file.name}`
                    : isCatalan
                    ? `A punt per descarregar: clean_${file.name}`
                    : isDutch
                    ? `Gereed om te downloaden: clean_${file.name}`
                    : isItalian
                    ? `Pronto per il download: clean_${file.name}`
                    : isPortuguese
                    ? `Pronto para descarregar: clean_${file.name}`
                    : isFrench
                    ? `Prêt à télécharger : clean_${file.name}`
                    : isGerman
                    ? `Bereit zum Download: clean_${file.name}`
                    : isSpanish
                    ? `Listo para descargar: clean_${file.name}`
                    : isTaiwan
                    ? `準備下載：clean_${file.name}`
                    : isSimplifiedChinese
                    ? `准备下载：clean_${file.name}`
                    : `Ready to download: clean_${file.name}`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={`clean_${file.name}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isJapanese ? "削除済み写真をダウンロード" : isKorean ? "정리된 사진 다운로드" : isSwedish ? "Ladda ner rensat foto" : isDanish ? "Download renset foto" : isFinnish ? "Lataa puhdistettu kuva" : isCatalan ? "Descarregar foto neta" : isDutch ? "Opgeschoonde foto downloaden" : isItalian ? "Scarica foto pulita" : isPortuguese ? "Descarregar foto limpa" : isFrench ? "Télécharger la photo nettoyée" : isGerman ? "Bereinigtes Foto herunterladen" : isSpanish ? "Descargar foto limpia" : isTaiwan ? "下載已清除中繼資料相片" : isSimplifiedChinese ? "下载已清除元数据照片" : "Download Clean Photo"}
              </a>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-fk-md">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
