"use client";

import React, { useState, useEffect } from "react";
import { FontEngine, FontMetadata } from "./FontEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface FontWorkspaceProps {
  mode: "ttf-to-woff2" | "woff2-to-ttf";
  title?: string;
  description?: string;
  embedded?: boolean;
}

export function FontWorkspace({ mode, title, description, embedded = true }: FontWorkspaceProps) {
  const { language } = useLanguage();
  const isSpanish = language === "es" || language === "es-419";
  const isGerman = language === "de";
  const isFrench = language === "fr";
  const isPortuguese = language === "pt" || language === "pt-BR";
  const isItalian = language === "it";
  const isDutch = language === "nl";
  const isCatalan = language === "ca";

  const [file, setFile] = useState<File | null>(null);
  const [fontMeta, setFontMeta] = useState<FontMetadata | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [previewText, setPreviewText] = useState<string>(
    isCatalan
      ? "Jove xef, porti whisky amb quinze carquinyolis 1234567890"
      : isDutch
      ? "Pa's wijze lynx bezag vroom het foeragerende wild 1234567890"
      : isItalian
      ? "Ma la volpe col suo balzo ha raggiunto il quieto fido 1234567890"
      : isPortuguese
      ? "A rápida raposa castanha salta sobre o cão preguiçoso 1234567890"
      : isFrench
      ? "Portez ce vieux whisky au juge blond qui fume 1234567890"
      : isGerman
      ? "Franz jagt im komplett verwahrlosten Taxi quer durch Bayern 1234567890"
      : isSpanish
      ? "El veloz murciélago hindú comía feliz cardillo y kiwi 1234567890"
      : "The quick brown fox jumps over the lazy dog 1234567890"
  );
  const [fontSize, setFontSize] = useState<number>(28);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      const meta = FontEngine.inspectFont(buf);
      setFontMeta(meta);

      // Convert
      let outBytes: Uint8Array;
      let outExt = "woff";
      if (mode === "ttf-to-woff2") {
        outBytes = FontEngine.ttfToWoff(buf);
        outExt = "woff";
      } else {
        outBytes = FontEngine.woffToTtf(buf);
        outExt = "ttf";
      }

      const blob = new Blob([outBytes as unknown as BlobPart], { type: "font/woff" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + `.${outExt}`);
    } catch (err) {
      console.error(err);
      setError(
        isCatalan
          ? "Error en convertir el tipus de lletra. Assegura't que sigui un fitxer TTF, OTF o WOFF vàlid."
          : isDutch
          ? "Kan lettertype niet converteren. Zorg ervoor dat het een geldig TTF-, OTF- of WOFF-bestand is."
          : isItalian
          ? "Impossibile convertire il font. Assicurati che sia un file TTF, OTF o WOFF valido."
          : isPortuguese
          ? "Falha ao converter a fonte. Certifique-se de que é um ficheiro TTF, OTF ou WOFF válido."
          : isFrench
          ? "Échec de la conversion de la police. Veuillez vérifier qu'il s'agit d'un fichier TTF, OTF ou WOFF valide."
          : isGerman
          ? "Fehler beim Konvertieren der Schriftart. Bitte stellen Sie sicher, dass es sich um eine gültige TTF-, OTF- oder WOFF-Datei handelt."
          : isSpanish
          ? "Error al convertir la fuente. Asegúrate de que sea un archivo TTF, OTF o WOFF válido."
          : "Failed to convert font. Please ensure it is a valid TTF, OTF, or WOFF file."
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
            {title || (mode === "ttf-to-woff2" ? "Convert TTF to WOFF2 / WOFF" : "Convert WOFF2 to TTF")}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || "High-Performance Web Font Compressor · 100% In-Browser"}
          </p>
        </div>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".ttf,.otf,.woff,.woff2";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {isCatalan
              ? "Selecciona el fitxer de tipus de lletra (TTF, OTF, WOFF)"
              : isDutch
              ? "Selecteer lettertypebestand (TTF, OTF, WOFF)"
              : isItalian
              ? "Seleziona file di font (TTF, OTF, WOFF)"
              : isPortuguese
              ? "Selecionar ficheiro de fonte (TTF, OTF, WOFF)"
              : isFrench
              ? "Sélectionner un fichier de police (TTF, OTF, WOFF)"
              : isGerman
              ? "Schriftartdatei auswählen (TTF, OTF, WOFF)"
              : isSpanish
              ? "Selecciona archivo de fuente (TTF, OTF, WOFF)"
              : "Select Font File (TTF, OTF, WOFF)"}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isCatalan
              ? "Optimitzat per a la web (0% d'emmagatzematge al servidor)"
              : isDutch
              ? "Geoptimaliseerd voor het web (100% lokaal in de browser)"
              : isItalian
              ? "Ottimizzato per il Web (0% di archiviazione sui server)"
              : isPortuguese
              ? "Otimizado para a Web (0% de armazenamento no servidor)"
              : isFrench
              ? "Optimisé pour le Web (0% de stockage sur serveur)"
              : isGerman
              ? "Für das Web optimiert (Kein Server-Tracking)"
              : isSpanish
              ? "Optimizado para la web (0% almacenamiento en servidor)"
              : "Optimized for fast web delivery (Zero server tracking)"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Font Metadata Badge */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">
                {isCatalan
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Taules: ${fontMeta?.numTables} · Mida: ${(file.size / 1024).toFixed(1)} KB`
                  : isDutch
                  ? `Formaat: ${fontMeta?.format.toUpperCase()} · Tabellen: ${fontMeta?.numTables} · Grootte: ${(file.size / 1024).toFixed(1)} KB`
                  : isItalian
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tabelle: ${fontMeta?.numTables} · Dimensione: ${(file.size / 1024).toFixed(1)} KB`
                  : isPortuguese
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tabelas: ${fontMeta?.numTables} · Tamanho: ${(file.size / 1024).toFixed(1)} KB`
                  : isFrench
                  ? `Format : ${fontMeta?.format.toUpperCase()} · Tables : ${fontMeta?.numTables} · Taille : ${(file.size / 1024).toFixed(1)} Ko`
                  : isGerman
                  ? `Format: ${fontMeta?.format.toUpperCase()} · Tabellen: ${fontMeta?.numTables} · Größe: ${(file.size / 1024).toFixed(1)} KB`
                  : isSpanish
                  ? `Formato: ${fontMeta?.format.toUpperCase()} · Tablas: ${fontMeta?.numTables} · Tamaño: ${(file.size / 1024).toFixed(1)} KB`
                  : `Format: ${fontMeta?.format.toUpperCase()} · Tables: ${fontMeta?.numTables} · Size: ${(file.size / 1024).toFixed(1)} KB`}
              </span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isCatalan ? "Canviar tipus de lletra" : isDutch ? "Lettertype wijzigen" : isItalian ? "Cambia font" : isPortuguese ? "Alterar fonte" : isFrench ? "Changer de police" : isGerman ? "Schriftart ändern" : isSpanish ? "Cambiar fuente" : "Change Font"}
            </button>
          </div>

          {/* Interactive Font Preview Box */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isCatalan ? "Vista prèvia interactiva" : isDutch ? "Live lettertypevoorbeeld" : isItalian ? "Anteprima del font" : isPortuguese ? "Pré-visualização da fonte" : isFrench ? "Aperçu de la police" : isGerman ? "Interaktive Vorschau" : isSpanish ? "Vista previa interactiva" : "Live Font Preview"}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {isCatalan ? "Mida:" : isDutch ? "Grootte:" : isItalian ? "Dimensione:" : isPortuguese ? "Tamanho:" : isFrench ? "Taille :" : isGerman ? "Größe:" : isSpanish ? "Tamaño:" : "Size:"} {fontSize}px
                </span>
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              style={{ fontSize: `${fontSize}px` }}
              rows={3}
              className="w-full p-4 border border-slate-200 rounded-fk-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 resize-none transition-colors"
            />
          </div>

          {/* Ready Download Card */}
          {outputUrl && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-purple-900 block">
                  {isCatalan
                    ? `✓ Tipus de lletra convertit: ${outputFileName}`
                    : isDutch
                    ? `✓ Lettertype geconverteerd: ${outputFileName}`
                    : isItalian
                    ? `✓ Font convertito: ${outputFileName}`
                    : isPortuguese
                    ? `✓ Fonte convertida: ${outputFileName}`
                    : isFrench
                    ? `✓ Police convertie : ${outputFileName}`
                    : isGerman
                    ? `✓ Schriftart konvertiert: ${outputFileName}`
                    : isSpanish
                    ? `✓ Fuente convertida: ${outputFileName}`
                    : `✓ Font Converted: ${outputFileName}`}
                </span>
                <span className="text-xs text-purple-700">
                  {isCatalan
                    ? `Mida: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Al navegador`
                    : isDutch
                    ? `Grootte: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In browser`
                    : isItalian
                    ? `Dimensione: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Nel browser`
                    : isPortuguese
                    ? `Tamanho: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% No navegador`
                    : isFrench
                    ? `Taille : ${((outputBlob?.size || 0) / 1024).toFixed(1)} Ko · 100% Dans le navigateur`
                    : isGerman
                    ? `Größe: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% Im Browser`
                    : isSpanish
                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% En el navegador`
                    : `Size: ${((outputBlob?.size || 0) / 1024).toFixed(1)} KB · 100% In-Browser`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isCatalan ? "Descarregar tipus de lletra" : isDutch ? "Lettertype downloaden" : isItalian ? "Scarica font" : isPortuguese ? "Descarregar fonte" : isFrench ? "Télécharger la police" : isGerman ? "Schriftart herunterladen" : isSpanish ? "Descargar fuente" : "Download Font"}
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
