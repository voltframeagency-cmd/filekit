"use client";

import React, { useState, useEffect } from "react";
import { MetadataEngine, DetectedMetadata } from "./MetadataEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface PrivacyWorkspaceProps {
  title?: string;
  description?: string;
  embedded?: boolean;
}

export function PrivacyWorkspace({ title, description, embedded = true }: PrivacyWorkspaceProps) {
  const { language } = useLanguage();
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";
  const isItalian = language === "it";
  const isDutch = language === "nl";
  const isCatalan = language === "ca";

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
        isCatalan
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
        isCatalan
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
            {isCatalan
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
              : "Select Photo to Strip Metadata"}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isCatalan
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
              : "Supports JPG, PNG, and WebP (Zero uploads to servers)"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* File & Privacy Audit Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isCatalan ? "Detalls del fitxer" : isDutch ? "Bestandsdetails" : isItalian ? "Dettagli del file" : isPortuguese ? "Detalhes do ficheiro" : isFrench ? "Détails du fichier" : isGerman ? "Dateidetails" : isSpanish ? "Detalles del archivo" : "File Details"}
              </span>
              <span className="text-sm font-semibold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {isCatalan ? "Metadades detectades" : isDutch ? "Gedetecteerde metagegevens" : isItalian ? "Metadati rilevati" : isPortuguese ? "Metadados detetados" : isFrench ? "Métadonnées détectées" : isGerman ? "Erkannte Metadaten" : isSpanish ? "Metadatos detectados" : "Detected Metadata"}
              </span>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasGps ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  {isCatalan
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
                    : `GPS Location: ${metadata?.hasGps ? "Detected (Vulnerable)" : "Clean"}`}
                </span>
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${metadata?.hasExif ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"}`}>
                  {isCatalan
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
                    : `EXIF Device Tags: ${metadata?.hasExif ? "Detected" : "None"}`}
                </span>
                {metadata?.cameraMake && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                    {isCatalan ? "Càmera:" : isDutch ? "Camera:" : isItalian ? "Fotocamera:" : isPortuguese ? "Câmara:" : isFrench ? "Appareil :" : isGerman ? "Kamera:" : isSpanish ? "Cámara:" : "Camera:"} {metadata.cameraMake}
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
                ? (isCatalan
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
                    : "Sanitizing image...")
                : (isCatalan
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
                    : "Strip All EXIF & GPS Metadata")}
            </button>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block">
                  {isCatalan
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
                    : "✓ Photo Sanitized (Zero GPS, Device, or Serial Tags)"}
                </span>
                <span className="text-xs text-emerald-700">
                  {isCatalan
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
                    : `Ready to download: clean_${file.name}`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={`clean_${file.name}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isCatalan ? "Descarregar foto neta" : isDutch ? "Opgeschoonde foto downloaden" : isItalian ? "Scarica foto pulita" : isPortuguese ? "Descarregar foto limpa" : isFrench ? "Télécharger la photo nettoyée" : isGerman ? "Bereinigtes Foto herunterladen" : isSpanish ? "Descargar foto limpia" : "Download Clean Photo"}
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
