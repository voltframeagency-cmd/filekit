"use client";

import React, { useState, useEffect } from "react";
import { EbookEngine } from "./EbookEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface EbookWorkspaceProps {
  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";
  title?: string;
  description?: string;
  embedded?: boolean;
}

export function EbookWorkspace({ mode, title, description, embedded = true }: EbookWorkspaceProps) {
  const { language } = useLanguage();
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
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const getAcceptExtensions = () => {
    if (mode === "epub-to-pdf") return ".epub";
    if (mode === "mobi-to-pdf") return ".mobi";
    if (mode === "azw3-to-pdf") return ".azw3,.azw";
    return ".epub,.mobi,.azw3,.azw";
  };

  const handleFileSelected = async (selectedFile: File) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setFile(selectedFile);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setLoading(true);

    try {
      const buf = new Uint8Array(await selectedFile.arrayBuffer());
      let pdfBytes: Uint8Array;

      if (mode === "mobi-to-pdf") {
        pdfBytes = await EbookEngine.mobiToPdf(buf);
      } else if (mode === "azw3-to-pdf") {
        pdfBytes = await EbookEngine.azw3ToPdf(buf);
      } else {
        pdfBytes = await EbookEngine.epubToPdf(buf);
      }

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      setOutputFileName(selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf");
    } catch (err) {
      console.error(err);
      setError(
        isSwedish
          ? "Kunde inte konvertera e-boken till PDF. Kontrollera att filen inte har DRM-skydd."
          : isDanish
          ? "Kunne ikke konvertere e-bogen til PDF. Sørg for, at filen er DRM-fri."
          : isFinnish
          ? "E-kirjan muuntaminen PDF-muotoon epäonnistui. Varmista, että tiedosto on DRM-vapaa."
          : isCatalan
          ? "Error en convertir l'eBook a PDF. Assegura't que el fitxer no tingui protecció DRM."
          : isDutch
          ? "Kan eBook niet naar PDF converteren. Zorg ervoor dat het bestand DRM-vrij is."
          : isItalian
          ? "Impossibile convertire l'eBook in PDF. Assicurati che il file non sia protetto da DRM."
          : isPortuguese
          ? "Falha ao converter o eBook em PDF. Certifique-se de que o ficheiro não tem proteção DRM."
          : isFrench
          ? "Échec de la conversion de l'eBook en PDF. Veuillez vérifier que le fichier est sans DRM."
          : isGerman
          ? "Fehler beim Konvertieren des E-Books in PDF. Bitte stellen Sie sicher, dass die Datei nicht DRM-geschützt ist."
          : isSpanish
          ? "Error al convertir el libro electrónico a PDF. Asegúrate de que el archivo no tenga DRM."
          : "Failed to convert eBook to PDF. Please ensure the file is DRM-free."
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
            {title || (mode === "epub-to-pdf" ? "Convert EPUB to PDF" : mode === "mobi-to-pdf" ? "Convert MOBI to PDF" : "Convert AZW3 to PDF")}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || "High-Fidelity Document Rendering · 100% In-Browser & Private"}
          </p>
        </div>
      )}

      {!file ? (
        <div
          className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-fk-xl p-8 sm:p-12 text-center bg-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = getAcceptExtensions();
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList[0]) {
                handleFileSelected(fileList[0]);
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {isSwedish
              ? `Välj e-boksfil (${getAcceptExtensions().toUpperCase()})`
              : isDanish
              ? `Vælg e-bogsfil (${getAcceptExtensions().toUpperCase()})`
              : isFinnish
              ? `Valitse e-kirjatiedosto (${getAcceptExtensions().toUpperCase()})`
              : isCatalan
              ? `Selecciona el fitxer d'eBook (${getAcceptExtensions().toUpperCase()})`
              : isDutch
              ? `Selecteer e-bookbestand (${getAcceptExtensions().toUpperCase()})`
              : isItalian
              ? `Seleziona file eBook (${getAcceptExtensions().toUpperCase()})`
              : isPortuguese
              ? `Selecionar ficheiro de eBook (${getAcceptExtensions().toUpperCase()})`
              : isFrench
              ? `Sélectionner un fichier eBook (${getAcceptExtensions().toUpperCase()})`
              : isGerman
              ? `E-Book-Datei auswählen (${getAcceptExtensions().toUpperCase()})`
              : isSpanish
              ? `Selecciona archivo de eBook (${getAcceptExtensions().toUpperCase()})`
              : `Select eBook File (${getAcceptExtensions().toUpperCase()})`}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {isSwedish
              ? "Inga serveruppladdningar · 100% privat konvertering i webbläsaren"
              : isDanish
              ? "Ingen serveruploads · 100% privat konvertering i browseren"
              : isFinnish
              ? "Ei palvelinlatauksia · 100% yksityinen muunnos selaimessa"
              : isCatalan
              ? "Sense càrregues a servidors · Conversió privada al 100% al navegador"
              : isDutch
              ? "Geen uploads naar servers · 100% privé conversie in browser"
              : isItalian
              ? "Nessun caricamento su server · Conversione privata al 100% nel browser"
              : isPortuguese
              ? "Sem envios para servidores · Conversão 100% privada no navegador"
              : isFrench
              ? "Aucun transfert vers un serveur · Conversion 100% privée dans le navigateur"
              : isGerman
              ? "Kein Server-Upload · Private Konvertierung im Browser"
              : isSpanish
              ? "Sin subida a servidores · Conversión privada en el navegador"
              : "Zero Server Uploads · 100% In-Browser Private Conversion"}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800 block truncate">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isSwedish ? "Byt fil" : isDanish ? "Skift fil" : isFinnish ? "Vaihda tiedosto" : isCatalan ? "Canviar fitxer" : isDutch ? "Bestand wijzigen" : isItalian ? "Cambia file" : isPortuguese ? "Alterar ficheiro" : isFrench ? "Changer de fichier" : isGerman ? "Datei ändern" : isSpanish ? "Cambiar archivo" : "Change File"}
            </button>
          </div>

          {loading && (
            <div className="p-6 bg-slate-50 rounded-fk-lg border border-slate-200 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-slate-700">
                {isSwedish
                  ? "Renderar e-bokssidor till PDF..."
                  : isDanish
                  ? "Gengiver e-bogssider til PDF..."
                  : isFinnish
                  ? "Renderoidaan e-kirjan sivuja PDF-muotoon..."
                  : isCatalan
                  ? "Renderitzant pàgines d'eBook a PDF..."
                  : isDutch
                  ? "E-bookpagina's renderen naar PDF..."
                  : isItalian
                  ? "Rendering delle pagine dell'eBook in PDF..."
                  : isPortuguese
                  ? "A converter páginas do eBook em PDF..."
                  : isFrench
                  ? "Conversion des pages de l'eBook en PDF..."
                  : isGerman
                  ? "E-Book wird in PDF gerendert..."
                  : isSpanish
                  ? "Renderizando libro a PDF..."
                  : "Rendering eBook pages to PDF..."}
              </span>
            </div>
          )}

          {outputUrl && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-amber-900 block">
                  {isSwedish
                    ? `✓ Konverterad: ${outputFileName}`
                    : isDanish
                    ? `✓ Konverteret: ${outputFileName}`
                    : isFinnish
                    ? `✓ Muunnettu: ${outputFileName}`
                    : isCatalan
                    ? `✓ Convertit: ${outputFileName}`
                    : isDutch
                    ? `✓ Geconverteerd: ${outputFileName}`
                    : isItalian
                    ? `✓ Convertito: ${outputFileName}`
                    : isPortuguese
                    ? `✓ Convertido: ${outputFileName}`
                    : isFrench
                    ? `✓ Converti : ${outputFileName}`
                    : isGerman
                    ? `✓ Konvertiert: ${outputFileName}`
                    : isSpanish
                    ? `✓ Convertido: ${outputFileName}`
                    : `✓ Converted: ${outputFileName}`}
                </span>
                <span className="text-xs text-amber-700">
                  {isSwedish
                    ? `Storlek: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument`
                    : isDanish
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-dokument`
                    : isFinnish
                    ? `Koko: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-asiakirja`
                    : isCatalan
                    ? `Mida: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Document PDF`
                    : isDutch
                    ? `Grootte: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF-document`
                    : isItalian
                    ? `Dimensione: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Documento PDF`
                    : isPortuguese
                    ? `Tamanho: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Documento PDF`
                    : isFrench
                    ? `Taille : ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} Mo · Document PDF`
                    : isGerman
                    ? `Größe: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF`
                    : isSpanish
                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF`
                    : `Size: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF Document`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isSwedish ? "Ladda ner PDF" : isDanish ? "Download PDF" : isFinnish ? "Lataa PDF" : isCatalan ? "Descarregar PDF" : isDutch ? "PDF downloaden" : isItalian ? "Scarica PDF" : isPortuguese ? "Descarregar PDF" : isFrench ? "Télécharger le PDF" : isGerman ? "PDF herunterladen" : isSpanish ? "Descargar PDF" : "Download PDF"}
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
