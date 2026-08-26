"use client";

import React, { useState, useEffect } from "react";
import { ArchiveEngine, ArchiveEntry } from "./ArchiveEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface ArchiveWorkspaceProps {
  mode: "extract" | "create" | "tar-to-zip" | "rar-to-zip" | "extract-rar" | "7z-to-zip";
  title?: string;
  description?: string;
  embedded?: boolean;
}

export function ArchiveWorkspace({ mode, title, description, embedded = true }: ArchiveWorkspaceProps) {
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
  const [files, setFiles] = useState<File[]>([]);
  const [extractedEntries, setExtractedEntries] = useState<ArchiveEntry[]>([]);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customZipName, setCustomZipName] = useState<string>("archive.zip");

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFiles(selectedFiles);
    setError(null);
    setOutputBlob(null);
    setOutputUrl(null);
    setExtractedEntries([]);

    if ((mode === "extract" || mode === "extract-rar") && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        const entries = mode === "extract-rar" ? ArchiveEngine.extractRar(buf) : ArchiveEngine.extractZip(buf);
        if (entries.length === 0) {
          setError(
            isSwedish
              ? "Inga filer hittades i arkivet eller så är arkivet tomt."
              : isDanish
              ? "Ingen filer fundet i arkivet eller arkivet er tomt."
              : isFinnish
              ? "Arkistosta ei löytynyt purettavia tiedostoja tai arkisto on tyhjä."
              : isCatalan
              ? "No s'han trobat fitxers descomprimibles a l'arxiu o l'arxiu és buit."
              : isDutch
              ? "Geen uitgepakte bestanden gevonden in het archief of het archief is leeg."
              : isItalian
              ? "Nessun file decomprimibile trovato nell'archivio o l'archivio è vuoto."
              : isPortuguese
              ? "Nenhum ficheiro descompactável encontrado no arquivo ou o arquivo está vazio."
              : isFrench
              ? "Aucun fichier décompressible trouvé dans l'archive ou l'archive est vide."
              : isGerman
              ? "Keine entpackbaren Dateien im Archiv gefunden oder Archiv ist leer."
              : isSpanish
              ? "No se encontraron archivos en el archivo o está vacío."
              : "No uncompressed files found in archive or archive is empty."
          );
        } else {
          setExtractedEntries(entries);
        }
      } catch (err) {
        console.error(err);
        setError(
          isSwedish
            ? "Kunde inte läsa arkivfilen."
            : isDanish
            ? "Kunne ikke læse arkivfilen."
            : isFinnish
            ? "Arkistotiedoston lukeminen epäonnistui."
            : isCatalan
            ? "Error en llegir el fitxer d'arxiu."
            : isDutch
            ? "Kan archiefbestand niet lezen."
            : isItalian
            ? "Impossibile leggere il file di archivio."
            : isPortuguese
            ? "Falha ao ler o ficheiro de arquivo."
            : isFrench
            ? "Échec de la lecture du fichier d'archive."
            : isGerman
            ? "Fehler beim Lesen der Archivdatei."
            : isSpanish
            ? "Error al leer el archivo."
            : "Failed to read archive file."
        );
      } finally {
        setLoading(false);
      }
    } else if ((mode === "tar-to-zip" || mode === "rar-to-zip" || mode === "7z-to-zip") && selectedFiles.length > 0) {
      setLoading(true);
      try {
        const buf = new Uint8Array(await selectedFiles[0].arrayBuffer());
        let zipBytes: Uint8Array;
        if (mode === "rar-to-zip") {
          zipBytes = ArchiveEngine.rarToZip(buf);
        } else if (mode === "7z-to-zip") {
          zipBytes = ArchiveEngine.sevenZipToZip(buf);
        } else {
          zipBytes = ArchiveEngine.tarToZip(buf);
        }

        const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        setOutputBlob(blob);
        setOutputUrl(url);
        setOutputFileName(selectedFiles[0].name.replace(/\.(tar|tar\.gz|tgz|rar|7z)$/i, "") + ".zip");
      } catch (err) {
        console.error(err);
        setError(
          isSwedish
            ? "Kunde inte konvertera arkivet till ZIP."
            : isDanish
            ? "Kunne ikke konvertere arkivet til ZIP."
            : isFinnish
            ? "Arkiston muuntaminen ZIP-muotoon epäonnistui."
            : isCatalan
            ? "Error en convertir l'arxiu a ZIP."
            : isDutch
            ? "Kan archief niet naar ZIP converteren."
            : isItalian
            ? "Impossibile convertire in ZIP."
            : isPortuguese
            ? "Falha ao converter para ZIP."
            : isFrench
            ? "Échec de la conversion en ZIP."
            : isGerman
            ? "Fehler beim Konvertieren in ZIP."
            : isSpanish
            ? "Error al convertir a ZIP."
            : "Failed to convert archive to ZIP."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const entries: { name: string; data: Uint8Array }[] = [];
      for (const f of files) {
        const buf = new Uint8Array(await f.arrayBuffer());
        entries.push({ name: f.name, data: buf });
      }

      const zipBytes = ArchiveEngine.createZip(entries);
      const blob = new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" });
      const url = URL.createObjectURL(blob);

      setOutputBlob(blob);
      setOutputUrl(url);
      const outName = customZipName.endsWith(".zip") ? customZipName : `${customZipName}.zip`;
      setOutputFileName(outName);
    } catch (err) {
      console.error(err);
      setError(
        isSwedish
          ? "Kunde inte skapa ZIP-arkivet."
          : isDanish
          ? "Kunne ikke oprette ZIP-arkivet."
          : isFinnish
          ? "ZIP-arkiston luominen epäonnistui."
          : isCatalan
          ? "Error en crear el fitxer ZIP."
          : isDutch
          ? "Kan ZIP-archief niet maken."
          : isItalian
          ? "Impossibile creare l'archivio ZIP."
          : isPortuguese
          ? "Falha ao criar o arquivo ZIP."
          : isFrench
          ? "Échec de la création de l'archive ZIP."
          : isGerman
          ? "Fehler beim Erstellen des ZIP-Archivs."
          : isSpanish
          ? "Error al crear archivo ZIP."
          : "Failed to create ZIP archive."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadEntry = (entry: ArchiveEntry) => {
    const blob = new Blob([entry.data as unknown as BlobPart]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = entry.name.split("/").pop() || entry.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${embedded ? "" : "p-6"}`}>
      {!embedded && (
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title || (mode === "extract" ? "Extract ZIP Online" : mode === "create" ? "Create ZIP Archive" : "Convert TAR to ZIP")}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {description || "100% In-Browser · Fast, Private & Zero Server Uploads"}
          </p>
        </div>
      )}

      {files.length === 0 ? (
        <div
          className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-fk-2xl p-10 text-center cursor-pointer transition-all duration-200"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
              handleFilesSelected(droppedFiles);
            }
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = mode === "create";
            input.accept = mode === "extract" ? ".zip" : mode === "tar-to-zip" ? ".tar,.tar.gz,.tgz" : "*/*";
            input.onchange = (e) => {
              const fileList = (e.target as HTMLInputElement).files;
              if (fileList && fileList.length > 0) {
                handleFilesSelected(Array.from(fileList));
              }
            };
            input.click();
          }}
        >
          <div className="w-14 h-14 mx-auto mb-3 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-base block">
            {mode === "create" 
              ? (isSwedish
                  ? "Släpp filer för att packa dem i ett ZIP-arkiv"
                  : isDanish
                  ? "Slip filer for at pakke dem i et ZIP-arkiv"
                  : isFinnish
                  ? "Pudota tiedostot pakataksesi ne ZIP-arkistoon"
                  : isCatalan
                  ? "Arrossega fitxers per empaquetar-los en un ZIP"
                  : isDutch
                  ? "Sleep bestanden om ze samen te voegen in een ZIP"
                  : isItalian
                  ? "Trascina i file per comprimerli in ZIP"
                  : isPortuguese
                  ? "Arrastar ficheiros para comprimir em ZIP"
                  : isFrench
                  ? "Déposer les fichiers pour les compresser en ZIP"
                  : isGerman
                  ? "Dateien ablegen, um sie als ZIP zu packen"
                  : isSpanish
                  ? "Suelta archivos para comprimirlos en ZIP"
                  : "Drop files to zip together") 
              : (isSwedish
                  ? "Välj arkivfil att extrahera eller konvertera"
                  : isDanish
                  ? "Vælg arkivfil til udpakning eller konvertering"
                  : isFinnish
                  ? "Valitse purettava tai muunnettava arkisto"
                  : isCatalan
                  ? "Selecciona l'arxiu per extreure o convertir"
                  : isDutch
                  ? "Selecteer het archief om uit te pakken of te converteren"
                  : isItalian
                  ? "Seleziona l'archivio da estrarre o convertire"
                  : isPortuguese
                  ? "Selecionar o arquivo para extrair ou converter"
                  : isFrench
                  ? "Sélectionner l'archive à extraire ou convertir"
                  : isGerman
                  ? "Archivdatei zum Entpacken oder Konvertieren auswählen"
                  : isSpanish
                  ? "Selecciona el archivo para extraer o convertir"
                  : "Select archive file to extract")}
          </span>
          <span className="text-xs text-slate-400 mt-1 block">
            {mode === "create" 
              ? (isSwedish
                  ? "Stöder alla filformat (flerfilsval)"
                  : isDanish
                  ? "Understøtter alle filformater (flere filer tilladt)"
                  : isFinnish
                  ? "Tukee kaikkia tiedostomuotoja (monivalinta sallittu)"
                  : isCatalan
                  ? "Admet tots els formats de fitxer (selecció múltiple)"
                  : isDutch
                  ? "Ondersteunt alle bestandsformaten (meervoudige selectie)"
                  : isItalian
                  ? "Supporta tutti i formati di file (selezione multipla)"
                  : isPortuguese
                  ? "Suporta todos os formatos de ficheiro (seleção múltipla)"
                  : isFrench
                  ? "Prend en charge tous les formats de fichiers (sélection multiple)"
                  : isGerman
                  ? "Unterstützt alle Dateiformate (Mehrfachauswahl)"
                  : isSpanish
                  ? "Admite todos los formatos de archivo (Selección múltiple)"
                  : "Supports all file formats (Multi-file enabled)") 
              : (isSwedish
                  ? "100% lokal behandling i webbläsaren"
                  : isDanish
                  ? "100% lokal behandling i din browser"
                  : isFinnish
                  ? "100% paikallinen käsittely selaimessasi"
                  : isCatalan
                  ? "Processament 100% local i privat al navegador"
                  : isDutch
                  ? "100% lokale verwerking in uw browser"
                  : isItalian
                  ? "Elaborazione 100% privata e locale nel browser"
                  : isPortuguese
                  ? "Processamento 100% privado e local no seu navegador"
                  : isFrench
                  ? "Traitement 100% privé et local dans votre navigateur"
                  : isGerman
                  ? "100% lokale Verarbeitung in Ihrem Browser"
                  : isSpanish
                  ? "Procesamiento 100% privado en tu navegador"
                  : "Processed locally inside your browser")}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-fk-lg border border-slate-200">
            <div>
              <span className="text-sm font-bold text-slate-800">
                {isSwedish
                  ? `${files.length} fil${files.length > 1 ? "er" : ""} vald${files.length > 1 ? "a" : ""}`
                  : isDanish
                  ? `${files.length} fil${files.length > 1 ? "er" : ""} valgt`
                  : isFinnish
                  ? `${files.length} tiedosto${files.length > 1 ? "a" : ""} valittu`
                  : isCatalan
                  ? `${files.length} fitxer${files.length > 1 ? "s" : ""} seleccionat${files.length > 1 ? "s" : ""}`
                  : isDutch
                  ? `${files.length} bestand${files.length > 1 ? "en" : ""} geselecteerd`
                  : isItalian
                  ? `${files.length} file selezionat${files.length > 1 ? "i" : "o"}`
                  : isPortuguese
                  ? `${files.length} ficheiro${files.length > 1 ? "s" : ""} selecionado${files.length > 1 ? "s" : ""}`
                  : isFrench
                  ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""}`
                  : isGerman
                  ? `${files.length} Datei${files.length > 1 ? "en" : ""} ausgewählt`
                  : isSpanish
                  ? `${files.length} archivo${files.length > 1 ? "s" : ""} seleccionado${files.length > 1 ? "s" : ""}`
                  : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
              </span>
              <span className="text-xs text-slate-500 block">
                Total: {((files.reduce((acc, f) => acc + f.size, 0)) / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={() => {
                setFiles([]);
                setExtractedEntries([]);
                setOutputBlob(null);
                setOutputUrl(null);
              }}
              className="text-xs text-red-600 hover:text-red-800 font-semibold px-3 py-1.5 rounded hover:bg-red-50"
            >
              {isSwedish ? "Återställ" : isDanish ? "Nulstil" : isFinnish ? "Nollaa" : isCatalan ? "Reiniciar" : isDutch ? "Opnieuw instellen" : isItalian ? "Reimposta" : isPortuguese ? "Repor" : isFrench ? "Réinitialiser" : isGerman ? "Zurücksetzen" : isSpanish ? "Reiniciar" : "Reset"}
            </button>
          </div>

          {mode === "create" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">
                  {isSwedish ? "Arkivnamn:" : isDanish ? "Arkivnavn:" : isFinnish ? "Arkiston nimi:" : isCatalan ? "Nom de l'arxiu:" : isDutch ? "Archiefnaam:" : isItalian ? "Nome archivio:" : isPortuguese ? "Nome do arquivo:" : isFrench ? "Nom de l'archive :" : isGerman ? "Archivname:" : isSpanish ? "Nombre del archivo:" : "Archive Name:"}
                </label>
                <input
                  type="text"
                  value={customZipName}
                  onChange={(e) => setCustomZipName(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-fk-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleCreateZip}
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-fk-lg shadow-fk-button transition-all text-base flex items-center justify-center gap-2"
              >
                {loading
                  ? (isSwedish
                      ? "Komprimerar filer till ZIP..."
                      : isDanish
                      ? "Komprimerer filer til ZIP..."
                      : isFinnish
                      ? "Pakataan tiedostoja ZIP-muotoon..."
                      : isCatalan
                      ? "Comprimint fitxers en un ZIP..."
                      : isDutch
                      ? "Bestanden worden ingepakt in ZIP..."
                      : isItalian
                      ? "Compressione dei file in ZIP in corso..."
                      : isPortuguese
                      ? "A comprimir ficheiros em ZIP..."
                      : isFrench
                      ? "Compression des fichiers en ZIP..."
                      : isGerman
                      ? "Dateien werden in ZIP gepackt..."
                      : isSpanish
                      ? "Comprimiendo archivos en ZIP..."
                      : "Compressing files into ZIP...")
                  : (isSwedish
                      ? "Skapa ZIP-arkiv"
                      : isDanish
                      ? "Opret ZIP-arkiv"
                      : isFinnish
                      ? "Luo ZIP-arkisto"
                      : isCatalan
                      ? "Crear arxiu ZIP"
                      : isDutch
                      ? "ZIP-archief maken"
                      : isItalian
                      ? "Crea archivio ZIP"
                      : isPortuguese
                      ? "Criar arquivo ZIP"
                      : isFrench
                      ? "Créer l'archive ZIP"
                      : isGerman
                      ? "ZIP-Archiv erstellen"
                      : isSpanish
                      ? "Crear archivo ZIP"
                      : "Create ZIP Archive")}
              </button>
            </div>
          )}

          {mode === "extract" && extractedEntries.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-800">
                {isSwedish
                  ? `Extraherade filer (${extractedEntries.length}):`
                  : isDanish
                  ? `Udtrukne filer (${extractedEntries.length}):`
                  : isFinnish
                  ? `Puretut tiedostot (${extractedEntries.length}):`
                  : isCatalan
                  ? `Fitxers extrets (${extractedEntries.length}):`
                  : isDutch
                  ? `Uitgepakte bestanden (${extractedEntries.length}):`
                  : isItalian
                  ? `File estratti (${extractedEntries.length}):`
                  : isPortuguese
                  ? `Ficheiros extraídos (${extractedEntries.length}):`
                  : isFrench
                  ? `Fichiers extraits (${extractedEntries.length}) :`
                  : isGerman
                  ? `Entpackte Dateien (${extractedEntries.length}):`
                  : isSpanish
                  ? `Archivos extraídos (${extractedEntries.length}):`
                  : `Extracted Files (${extractedEntries.length}):`}
              </span>
              <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-fk-lg divide-y divide-slate-100">
                {extractedEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-mono text-slate-700 truncate max-w-[240px] sm:max-w-xs">{entry.name}</span>
                    <button
                      onClick={() => downloadEntry(entry)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold rounded"
                    >
                      {isSwedish ? "Ladda ner" : isDanish ? "Download" : isFinnish ? "Lataa" : isCatalan ? "Descarregar" : isDutch ? "Downloaden" : isItalian ? "Scarica" : isPortuguese ? "Descarregar" : isFrench ? "Télécharger" : isGerman ? "Herunterladen" : isSpanish ? "Descargar" : "Download"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {outputUrl && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-fk-lg flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-emerald-900 block truncate">
                  {isSwedish
                    ? `✓ ZIP klar: ${outputFileName}`
                    : isDanish
                    ? `✓ ZIP klar: ${outputFileName}`
                    : isFinnish
                    ? `✓ ZIP valmis: ${outputFileName}`
                    : isCatalan
                    ? `✓ ZIP a punt: ${outputFileName}`
                    : isDutch
                    ? `✓ ZIP gereed: ${outputFileName}`
                    : isItalian
                    ? `✓ ZIP pronto: ${outputFileName}`
                    : isPortuguese
                    ? `✓ ZIP pronto: ${outputFileName}`
                    : isFrench
                    ? `✓ ZIP prêt : ${outputFileName}`
                    : isGerman
                    ? `✓ ZIP bereit: ${outputFileName}`
                    : isSpanish
                    ? `✓ ZIP listo: ${outputFileName}`
                    : `✓ Ready ZIP: ${outputFileName}`}
                </span>
                <span className="text-xs text-emerald-700">
                  {isSwedish
                    ? `Storlek: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% I webbläsaren`
                    : isDanish
                    ? `Størrelse: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% I browseren`
                    : isFinnish
                    ? `Koko: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Selaimessa`
                    : isCatalan
                    ? `Mida: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Al navegador`
                    : isDutch
                    ? `Grootte: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In browser`
                    : isItalian
                    ? `Dimensione: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Nel browser`
                    : isPortuguese
                    ? `Tamanho: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% No navegador`
                    : isFrench
                    ? `Taille : ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} Mo · 100% Dans le navigateur`
                    : isGerman
                    ? `Größe: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% Im Browser`
                    : isSpanish
                    ? `Tamaño: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% En el navegador`
                    : `Size: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% In-Browser`}
                </span>
              </div>
              <a
                href={outputUrl}
                download={outputFileName}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-fk-md shadow-sm text-center"
              >
                {isSwedish ? "Ladda ner ZIP" : isDanish ? "Download ZIP" : isFinnish ? "Lataa ZIP" : isCatalan ? "Descarregar ZIP" : isDutch ? "ZIP downloaden" : isItalian ? "Scarica ZIP" : isPortuguese ? "Descarregar ZIP" : isFrench ? "Télécharger le ZIP" : isGerman ? "ZIP herunterladen" : isSpanish ? "Descargar ZIP" : "Download ZIP"}
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
