"use client";

import React, { useState } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { OcrEngine } from "@/utils/ocr-engine/OcrEngine";
import { OcrExecutionResult } from "@/utils/ocr-engine/types";
import { useLanguage } from "@/components/layout/LanguageContext";

export interface OcrPdfWorkspaceProps {
  toolTitle: string;
  toolSlug: string;
  defaultMode: "searchable_pdf" | "extract_text";
}

export const OcrPdfWorkspace: React.FC<OcrPdfWorkspaceProps> = ({
  toolTitle,
  toolSlug,
  defaultMode,
}) => {
  const { language } = useLanguage();
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";
  const isItalian = language === "it";
  const isDutch = language === "nl";

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>("Ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [result, setResult] = useState<OcrExecutionResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResult(null);
    setSourceFile(file);
  };

  const handleProcessOcr = async () => {
    if (!sourceFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setProgressStage(
      isDutch
        ? "Bestandsgegevens laden in geheugen..."
        : isItalian
        ? "Lettura dei dati del file in memoria..."
        : isPortuguese
        ? "A ler ficheiro para a memória..."
        : isFrench
        ? "Lecture du fichier en mémoire..."
        : isGerman
        ? "Datei wird in den Arbeitsspeicher geladen..."
        : isSpanish
        ? "Leyendo archivo en memoria..."
        : "Reading file data into memory..."
    );

    try {
      const buffer = await sourceFile.arrayBuffer();
      const ocrResult = await OcrEngine.processDocument(
        buffer,
        sourceFile.name,
        (percent, stage) => {
          setProgressPercent(percent);
          setProgressStage(stage);
        }
      );
      setResult(ocrResult);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (isDutch
            ? "Kan tekst in document niet herkennen."
            : isItalian
            ? "Impossibile riconoscere il testo nel documento."
            : isPortuguese
            ? "Falha ao reconhecer o texto no documento."
            : isFrench
            ? "Échec de la reconnaissance de texte dans le document."
            : isGerman
            ? "Fehler bei der Texterkennung im Dokument."
            : isSpanish
            ? "Error al reconocer texto en el documento."
            : "Failed to recognize text in document.")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyText = () => {
    if (!result?.fullText) return;
    navigator.clipboard.writeText(result.fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!result?.fullText) return;
    const blob = new Blob([result.fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sourceFile?.name.replace(/\.[^/.]+$/, ".txt") || "extracted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSearchablePdf = () => {
    if (!result?.searchablePdfBuffer) return;
    const blob = new Blob([result.searchablePdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = sourceFile?.name.replace(/\.pdf$/i, "-searchable.pdf") || "searchable.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Zone */}
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-fk-primary/10 flex items-center justify-center text-fk-primary text-2xl">
            🔍
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">
              {isDutch
                ? "Selecteer gescand document of afbeelding"
                : isItalian
                ? "Seleziona documento scansionato o immagine"
                : isPortuguese
                ? "Selecionar documento digitalizado ou imagem"
                : isFrench
                ? "Sélectionnez un document numérisé ou une image"
                : isGerman
                ? "Gescanntes Dokument oder Bild auswählen"
                : isSpanish
                ? "Selecciona documento escaneado o imagen"
                : "Select Scanned Document or Image"}
            </h2>
            <p className="text-sm text-slate-400">
              {isDutch
                ? "100% privé in-browser OCR. Bestanden verlaten nooit uw browser."
                : isItalian
                ? "OCR 100% privato nel browser. I file non lasciano mai il tuo dispositivo."
                : isPortuguese
                ? "OCR 100% privado no navegador. Os ficheiros nunca saem do seu dispositivo."
                : isFrench
                ? "OCR 100% privé dans le navigateur. Les fichiers ne quittent jamais votre appareil."
                : isGerman
                ? "100% private OCR im Browser. Dateien verlassen niemals Ihr Gerät."
                : isSpanish
                ? "OCR 100% privado en el navegador. Los archivos nunca salen de tu dispositivo."
                : "100% private in-browser OCR. Files never leave your browser."}
            </p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            {isDutch
              ? "Kies PDF of afbeelding"
              : isItalian
              ? "Scegli PDF o immagine"
              : isPortuguese
              ? "Escolher PDF ou imagem"
              : isFrench
              ? "Choisir un PDF ou une image"
              : isGerman
              ? "PDF oder Bild wählen"
              : isSpanish
              ? "Elegir PDF o imagen"
              : "Choose PDF or Image"}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* Editor Workspace */}
      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-fk-primary/10 flex items-center justify-center text-fk-primary font-bold text-sm">
                OCR
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">{(sourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="local" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setResult(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {isDutch ? "Bestand wijzigen" : isItalian ? "Cambia file" : isPortuguese ? "Alterar ficheiro" : isFrench ? "Changer de fichier" : isGerman ? "Datei ändern" : isSpanish ? "Cambiar archivo" : "Change File"}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button & Progress */}
          {!result && (
            <div className="flex flex-col gap-3">
              {isProcessing && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{progressStage}</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-fk-primary h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessOcr}
                className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50"
              >
                {isProcessing
                  ? isDutch
                    ? "OCR-tekstherkenning wordt uitgevoerd..."
                    : isItalian
                    ? "Riconoscimento OCR in corso..."
                    : isPortuguese
                    ? "A realizar reconhecimento OCR..."
                    : isFrench
                    ? "Reconnaissance OCR en cours..."
                    : isGerman
                    ? "OCR-Erkennung läuft..."
                    : isSpanish
                    ? "Realizando reconocimiento OCR..."
                    : "Performing OCR Recognition..."
                  : isDutch
                  ? "Tekst herkennen & extraheren"
                  : isItalian
                  ? "Riconosci ed estrai testo"
                  : isPortuguese
                  ? "Reconhecer e extrair texto"
                  : isFrench
                  ? "Reconnaître et extraire le texte"
                  : isGerman
                  ? "Text erkennen und extrahieren"
                  : isSpanish
                  ? "Reconocer y extraer texto"
                  : "Recognize & Extract Text"}
              </button>
            </div>
          )}

          {/* Result Output Card */}
          {result && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    {isDutch
                      ? `OCR voltooid (${result.totalPages} pagina${result.totalPages !== 1 ? "'s" : ""} in ${result.durationMs}ms)`
                      : isItalian
                      ? `OCR completato (${result.totalPages} pagin${result.totalPages !== 1 ? "e" : "a"} in ${result.durationMs}ms)`
                      : isPortuguese
                      ? `OCR concluído (${result.totalPages} página${result.totalPages !== 1 ? "s" : ""} em ${result.durationMs}ms)`
                      : isFrench
                      ? `OCR terminé (${result.totalPages} page${result.totalPages !== 1 ? "s" : ""} en ${result.durationMs}ms)`
                      : isGerman
                      ? `OCR abgeschlossen (${result.totalPages} Seite${result.totalPages !== 1 ? "n" : ""} in ${result.durationMs}ms)`
                      : isSpanish
                      ? `OCR completado (${result.totalPages} página${result.totalPages !== 1 ? "s" : ""} en ${result.durationMs}ms)`
                      : `OCR Completed (${result.totalPages} page${result.totalPages !== 1 ? "s" : ""} in ${result.durationMs}ms)`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    {copiedText
                      ? isDutch
                        ? "✓ Gekopieerd!"
                        : isItalian
                        ? "✓ Copiato!"
                        : isPortuguese
                        ? "✓ Copiado!"
                        : isFrench
                        ? "✓ Copié !"
                        : isGerman
                        ? "✓ Kopiert!"
                        : isSpanish
                        ? "✓ ¡Copiado!"
                        : "✓ Copied!"
                      : isDutch
                      ? "Tekst kopiëren"
                      : isItalian
                      ? "Copia testo"
                      : isPortuguese
                      ? "Copiar texto"
                      : isFrench
                      ? "Copier le texte"
                      : isGerman
                      ? "Text kopieren"
                      : isSpanish
                      ? "Copiar texto"
                      : "Copy Text"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition"
                  >
                    {isDutch ? ".TXT downloaden" : isItalian ? "Scarica .TXT" : isPortuguese ? "Descarregar .TXT" : isFrench ? "Télécharger .TXT" : isGerman ? ".TXT herunterladen" : isSpanish ? "Descargar .TXT" : "Download .TXT"}
                  </button>
                  {result.searchablePdfBuffer && (
                    <button
                      type="button"
                      onClick={handleDownloadSearchablePdf}
                      className="text-xs bg-fk-primary hover:bg-fk-primary/90 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-md"
                    >
                      {isDutch
                        ? "Doorzoekbare PDF downloaden"
                        : isItalian
                        ? "Scarica PDF ricercabile"
                        : isPortuguese
                        ? "Descarregar PDF pesquisável"
                        : isFrench
                        ? "Télécharger le PDF indexable"
                        : isGerman
                        ? "Durchsuchbares PDF herunterladen"
                        : isSpanish
                        ? "Descargar PDF con búsqueda"
                        : "Download Searchable PDF"}
                    </button>
                  )}
                </div>
              </div>

              {/* Extracted Text Preview Box */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isDutch ? "Geëxtraheerde tekst" : isItalian ? "Testo estratto" : isPortuguese ? "Texto extraído" : isFrench ? "Texte extrait" : isGerman ? "Extrahierter Text" : isSpanish ? "Texto extraído" : "Extracted Text"}
                </label>
                <textarea
                  readOnly
                  value={result.fullText}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
