"use client";

import React, { useState } from "react";
import ProcessingModeBadge from "@/components/common/ProcessingModeBadge";
import { useLanguage } from "@/components/layout/LanguageContext";

export interface OfficeConverterWorkspaceProps {
  toolTitle: string;
  toolSlug: string;
  apiEndpoint: string;
  acceptedExtensions: string;
  documentTypeLabel: string; // e.g. "Word Document", "PowerPoint Presentation", "Excel Spreadsheet"
}

export const OfficeConverterWorkspace: React.FC<OfficeConverterWorkspaceProps> = ({
  toolTitle,
  toolSlug,
  apiEndpoint,
  acceptedExtensions,
  documentTypeLabel,
}) => {
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

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [progressStage, setProgressStage] = useState<string>("Ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    downloadUrl: string;
    outputSizeBytes: number;
    durationMs: number;
    fileName: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResult(null);
    setSourceFile(file);
  };

  const handleInitiateConversion = () => {
    if (!sourceFile) return;
    if (!hasConsented) {
      setShowConsentModal(true);
    } else {
      executeServerConversion();
    }
  };

  const executeServerConversion = async () => {
    if (!sourceFile) return;

    setShowConsentModal(false);
    setIsProcessing(true);
    setErrorMessage(null);
    setProgressStage(
      isSwedish
        ? "Ansluter till isolerad microVM..."
        : isDanish
        ? "Forbinder til isoleret microVM..."
        : isFinnish
        ? "Yhdistetään eristettyyn microVM:ään..."
        : isCatalan
        ? "Connectant a la microVM aïllada..."
        : isDutch
        ? "Verbinding maken met geïsoleerde microVM..."
        : isItalian
        ? "Connessione alla microVM isolata in corso..."
        : isPortuguese
        ? "A ligar à microVM isolada..."
        : isFrench
        ? "Connexion à la microVM isolée..."
        : isGerman
        ? "Verbindung zur isolierten MicroVM wird hergestellt..."
        : isSpanish
        ? "Conectando a microVM aislada..."
        : "Connecting to isolated microVM..."
    );

    try {
      const formData = new FormData();
      formData.append("file", sourceFile);

      setProgressStage(
        isSwedish
          ? "Renderar dokumentets sidor..."
          : isDanish
          ? "Gengiver dokumentets sider..."
          : isFinnish
          ? "Renderoidaan asiakirjan sivuja..."
          : isCatalan
          ? "Renderitzant pàgines del document..."
          : isDutch
          ? "Documentpagina's renderen..."
          : isItalian
          ? "Rendering delle pagine del documento..."
          : isPortuguese
          ? "A renderizar páginas do documento..."
          : isFrench
          ? "Rendu des pages du document..."
          : isGerman
          ? "Dokumentseiten werden gerendert..."
          : isSpanish
          ? "Renderizando páginas del documento..."
          : "Rendering Office document pages..."
      );

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(
          errJson.error ||
            (isSwedish
              ? `Serverkonvertering misslyckades (${response.status})`
              : isDanish
              ? `Serverkonvertering mislykkedes (${response.status})`
              : isFinnish
              ? `Palvelinmuunnos epäonnistui (${response.status})`
              : isCatalan
              ? `Error en la conversió del servidor (${response.status})`
              : isDutch
              ? `Server-conversiefout (${response.status})`
              : isItalian
              ? `Errore nella conversione del server (${response.status})`
              : isPortuguese
              ? `Erro na conversão do servidor (${response.status})`
              : isFrench
              ? `Erreur de conversion sur le serveur (${response.status})`
              : isGerman
              ? `Server-Konvertierungsfehler (${response.status})`
              : isSpanish
              ? `Error en la conversión del servidor (${response.status})`
              : `Server conversion failed (${response.status})`)
        );
      }

      setProgressStage(
        isSwedish
          ? "Verifierar resulterande PDF-fil..."
          : isDanish
          ? "Verificerer resulterende PDF-fil..."
          : isFinnish
          ? "Tarkistetaan tuloksena olevaa PDF-tiedostoa..."
          : isCatalan
          ? "Verificant fitxer PDF resultant..."
          : isDutch
          ? "Resulterende PDF controleren..."
          : isItalian
          ? "Verifica del file PDF risultante..."
          : isPortuguese
          ? "A verificar ficheiro PDF resultante..."
          : isFrench
          ? "Vérification du flux PDF..."
          : isGerman
          ? "PDF-Ausgabe wird überprüft..."
          : isSpanish
          ? "Verificando archivo PDF resultante..."
          : "Verifying PDF output stream..."
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error ||
            (isSwedish
              ? "Kunde inte konvertera dokumentet."
              : isDanish
              ? "Kunne ikke konvertere dokumentet."
              : isFinnish
              ? "Asiakirjan muuntaminen epäonnistui."
              : isCatalan
              ? "Error en convertir el document."
              : isDutch
              ? "Kan document niet converteren."
              : isItalian
              ? "Impossibile convertire il documento."
              : isPortuguese
              ? "Falha ao converter o documento."
              : isFrench
              ? "Échec de la conversion du document."
              : isGerman
              ? "Fehler beim Konvertieren des Dokuments."
              : isSpanish
              ? "Error al convertir el documento."
              : "Failed to convert document.")
        );
      }

      setResult({
        downloadUrl: data.downloadSignedUrl,
        outputSizeBytes: data.outputSizeBytes,
        durationMs: data.executionDurationMs,
        fileName: sourceFile.name.replace(/\.[^/.]+$/, ".pdf"),
      });
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (isSwedish
            ? "Ett oväntat fel uppstod vid konverteringen."
            : isDanish
            ? "Der opstod en uventet fejl under konverteringen."
            : isFinnish
            ? "Muunnoksen aikana tapahtui odottamaton virhe."
            : isCatalan
            ? "S'ha produït un error inesperat durant la conversió."
            : isDutch
            ? "Er is een onverwachte fout opgetreden tijdens de conversie."
            : isItalian
            ? "Si è verificato un errore imprevisto durante la conversione."
            : isPortuguese
            ? "Ocorreu um erro inesperado durante a conversão."
            : isFrench
            ? "Une erreur inattendue est survenue lors de la conversion."
            : isGerman
            ? "Ein unerwarteter Fehler ist bei der Konvertierung aufgetreten."
            : isSpanish
            ? "Ocurrió un error inesperado durante la conversión."
            : "An unexpected error occurred during conversion.")
      );
    } finally {
      setIsProcessing(false);
      setProgressStage("Ready");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl.startsWith("http") ? result.downloadUrl : "#";
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Upload Zone */}
      {!sourceFile && (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/50 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 hover:border-fk-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl">
            📊
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-white">
              {isSwedish
                ? "Välj dokument att konvertera"
                : isDanish
                ? "Vælg dokument til konvertering"
                : isFinnish
                ? "Valitse muunnettava asiakirja"
                : isCatalan
                ? "Selecciona el document a convertir"
                : isDutch
                ? "Selecteer het document om te converteren"
                : isItalian
                ? "Seleziona il documento da convertire"
                : isPortuguese
                ? "Selecionar o documento para converter"
                : isFrench
                ? "Sélectionner le document à convertir"
                : isGerman
                ? "Dokument zum Konvertieren auswählen"
                : isSpanish
                ? "Selecciona el documento para convertir"
                : `Select ${documentTypeLabel}`}
            </h2>
            <p className="text-sm text-slate-400">
              {isSwedish
                ? "Högprecisionskonvertering i isolerad microVM med 0% datalagring."
                : isDanish
                ? "Højpræcisionskonvertering i isoleret microVM med 0% datalagring."
                : isFinnish
                ? "Huipputarkka muunnos eristetyssä microVM:ssä 0% tiedon säilytyksellä."
                : isCatalan
                ? "Conversió d'alta fidelitat amb microVM aïllada i 0% de retenció de dades."
                : isDutch
                ? "Zeer nauwkeurige conversie met geïsoleerde microVM en 0% gegevensretentie."
                : isItalian
                ? "Conversione ad alta fedeltà con microVM isolata e 0% di conservazione dei dati."
                : isPortuguese
                ? "Conversão de alta fidelidade com microVM isolada e 0% de retenção de dados."
                : isFrench
                ? "Conversion haute fidélité via microVM isolée et 0% de rétention de données."
                : isGerman
                ? "Hochpräzise Konvertierung in isolierter MicroVM mit 0% Datenspeicherung."
                : isSpanish
                ? "Conversión segura de alta fidelidad con microVM aislada y 0% de retención de datos."
                : "High-fidelity LibreOffice microVM conversion with 0% data retention."}
            </p>
          </div>
          <label className="cursor-pointer bg-fk-primary hover:bg-fk-primary/90 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-fk-primary/20">
            {isSwedish ? "Välj fil" : isDanish ? "Vælg fil" : isFinnish ? "Valitse tiedosto" : isCatalan ? "Triar fitxer" : isDutch ? "Kies bestand" : isItalian ? "Scegli file" : isPortuguese ? "Escolher ficheiro" : isFrench ? "Choisir un fichier" : isGerman ? "Datei wählen" : isSpanish ? "Elegir archivo" : `Choose ${documentTypeLabel} File`}
            <input type="file" accept={acceptedExtensions} className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      )}

      {/* Editor Workspace */}
      {sourceFile && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 shadow-xl">
          {/* File Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-sm">
                DOC
              </div>
              <div>
                <h3 className="font-semibold text-white truncate max-w-xs">{sourceFile.name}</h3>
                <p className="text-xs text-slate-400">{(sourceFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ProcessingModeBadge mode="server" />
              <button
                onClick={() => {
                  setSourceFile(null);
                  setResult(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition"
              >
                {isSwedish ? "Byt fil" : isDanish ? "Skift fil" : isFinnish ? "Vaihda tiedosto" : isCatalan ? "Canviar fitxer" : isDutch ? "Bestand wijzigen" : isItalian ? "Cambia file" : isPortuguese ? "Alterar ficheiro" : isFrench ? "Changer de fichier" : isGerman ? "Datei ändern" : isSpanish ? "Cambiar archivo" : "Change File"}
              </button>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
            <span className="text-blue-400 text-lg">🛡️</span>
            <div className="text-xs text-slate-300 flex flex-col gap-1 leading-relaxed">
              <span className="font-bold text-white">
                {isSwedish
                  ? "Isolerad mikrovirtuell maskin-sandbox"
                  : isDanish
                  ? "Isoleret mikrovirtuel maskine-sandbox"
                  : isFinnish
                  ? "Eristetty microVM-hiekkalaatikko"
                  : isCatalan
                  ? "Entorn aïllat en microVM efímera"
                  : isDutch
                  ? "Geïsoleerde microVM-sandbox"
                  : isItalian
                  ? "Ambiente isolato in microVM effimera"
                  : isPortuguese
                  ? "Ambiente isolado em microVM efémera"
                  : isFrench
                  ? "Bac à sable MicroVM éphémère"
                  : isGerman
                  ? "Isolierte MicroVM-Sandbox"
                  : isSpanish
                  ? "Entorno aislado en microVM efímera"
                  : "Ephemeral MicroVM Sandbox"}
              </span>
              <span>
                {isSwedish
                  ? "Dokumentbehandlingen körs i en isolerad microVM-container. Filer krypteras under överföring och raderas automatiskt ur minnet direkt efter konverteringen."
                  : isDanish
                  ? "Dokumentbehandlingen kører i en isoleret microVM-container. Filer krypteres under overførsel og slettes automatisk fra hukommelsen umiddelbart efter konvertering."
                  : isFinnish
                  ? "Asiakirjan käsittely suoritetaan eristetyssä microVM-kontissa. Tiedostot salataan siirron aikana ja poistetaan automaattisesti muistista välittömästi muunnoksen jälkeen."
                  : isCatalan
                  ? "El processament del document s'executa en un contenidor microVM aïllat. Els fitxers s'encripten en trànsit i s'eliminen automàticament de la memòria immediatament després de la conversió."
                  : isDutch
                  ? "Documentverwerking wordt uitgevoerd in een geïsoleerde microVM-container. Bestanden worden versleuteld verzonden en direct na de conversie automatisch uit het geheugen verwijderd."
                  : isItalian
                  ? "L'elaborazione del documento viene eseguita in un container microVM isolato. I file sono crittografati in transito ed eliminati automaticamente dalla memoria subito dopo la conversione."
                  : isPortuguese
                  ? "O processamento do documento é executado num contentor microVM isolado. Os ficheiros são encriptados em trânsito e eliminados automaticamente da memória imediatamente após a conversão."
                  : isFrench
                  ? "Le traitement du document s'exécute dans un conteneur microVM isolé. Les fichiers sont chiffrés en transit et purgés automatiquement de la mémoire immédiatement après la conversion."
                  : isGerman
                  ? "Die Dokumentverarbeitung erfolgt in einer isolierten MicroVM. Dateien werden verschlüsselt übertragen und sofort nach der Konvertierung automatisch aus dem Speicher gelöscht."
                  : isSpanish
                  ? "El renderizado del documento se ejecuta en un contenedor aislado. Los archivos están cifrados en tránsito y se eliminan automáticamente de la memoria inmediatamente tras la conversión."
                  : "Office document rendering runs in an isolated container microVM. Files are encrypted in transit and purged automatically from cloud memory immediately after conversion."}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action Button */}
          {!result && (
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleInitiateConversion}
              className="w-full bg-fk-primary hover:bg-fk-primary/90 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-fk-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{progressStage}</span>
                </>
              ) : isSwedish ? (
                "Konvertera till PDF"
              ) : isDanish ? (
                "Konverter til PDF"
              ) : isFinnish ? (
                "Muunna PDF-muotoon"
              ) : isCatalan ? (
                "Convertir a PDF"
              ) : isDutch ? (
                "Converteren naar PDF"
              ) : isItalian ? (
                "Converti in PDF"
              ) : isPortuguese ? (
                "Converter para PDF"
              ) : isFrench ? (
                "Convertir en PDF"
              ) : isGerman ? (
                "In PDF konvertieren"
              ) : isSpanish ? (
                "Convertir a PDF"
              ) : (
                "Convert to PDF"
              )}
            </button>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isSwedish
                      ? "Konverterad till PDF"
                      : isDanish
                      ? "Konverteret til PDF med succes"
                      : isFinnish
                      ? "Muunnettu PDF-muotoon onnistuneesti"
                      : isCatalan
                      ? "Convertit a PDF amb èxit"
                      : isDutch
                      ? "Succesvol geconverteerd naar PDF"
                      : isItalian
                      ? "Convertito in PDF con successo"
                      : isPortuguese
                      ? "Convertido para PDF com sucesso"
                      : isFrench
                      ? "Converti en PDF avec succès"
                      : isGerman
                      ? "Erfolgreich in PDF konvertiert"
                      : isSpanish
                      ? "Convertido a PDF exitosamente"
                      : "Converted to PDF Successfully"}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isSwedish
                      ? `Bearbetad på ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Tillfällig container rensad`
                      : isDanish
                      ? `Behandlet på ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Midlertidig container ryddet`
                      : isFinnish
                      ? `Käsitelty ajassa ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Väliaikainen kontti tyhjennetty`
                      : isCatalan
                      ? `Processat en ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenidor esborrat`
                      : isDutch
                      ? `Gerenderd in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Container gewist`
                      : isItalian
                      ? `Elaborato in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Container eliminato`
                      : isPortuguese
                      ? `Processado em ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contentor eliminado`
                      : isFrench
                      ? `Rendu en ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} Ko • Conteneur éphémère purgé`
                      : isGerman
                      ? `Gerendert in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Container gelöscht`
                      : isSpanish
                      ? `Procesado en ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Contenedor purgado`
                      : `Rendered in ${result.durationMs}ms • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • Ephemeral container purged`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition shadow-lg"
              >
                {isSwedish ? "Ladda ner PDF" : isDanish ? "Download PDF" : isFinnish ? "Lataa PDF" : isCatalan ? "Descarregar PDF" : isDutch ? "PDF downloaden" : isItalian ? "Scarica PDF" : isPortuguese ? "Descarregar PDF" : isFrench ? "Télécharger le PDF" : isGerman ? "PDF herunterladen" : isSpanish ? "Descargar PDF" : "Download PDF"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Consent Before Upload Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-blue-400">
              <span className="text-2xl">🔒</span>
              <h3 className="font-bold text-white text-lg">
                {isSwedish
                  ? "Meddelande om säker serverkonvertering"
                  : isDanish
                  ? "Meddelelse om sikker serverkonvertering"
                  : isFinnish
                  ? "Ilmoitus suojatusta palvelinmuunnoksesta"
                  : isCatalan
                  ? "Avís de conversió segura al servidor"
                  : isDutch
                  ? "Kennisgeving over veilige serverconversie"
                  : isItalian
                  ? "Avviso di conversione sicura su server"
                  : isPortuguese
                  ? "Aviso de conversão segura no servidor"
                  : isFrench
                  ? "Avis de conversion sécurisée sur serveur"
                  : isGerman
                  ? "Sicherer Server-Konvertierungshinweis"
                  : isSpanish
                  ? "Aviso de conversión segura en servidor"
                  : "Secure Server Conversion Notice"}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isSwedish
                ? "Denna dokumentkonvertering kräver en isolerad moln-microVM för att säkerställa fullständig typografi- och layouttrohet. Din fil bearbetas i minnet och raderas omedelbart efteråt."
                : isDanish
                ? "Denne dokumentkonvertering kræver en isoleret cloud-microVM for at sikre fuldstændig typografi- og layoutnøjagtighed. Din fil behandles i hukommelsen og slettes umiddelbart bagefter."
                : isFinnish
                ? "Tämä asiakirjamuunnos vaatii eristetyn pilvi-microVM:n täydellisen typografia- ja asettelutarkkuuden varmistamiseksi. Tiedostosi käsitellään muistissa ja poistetaan välittömästi sen jälkeen."
                : isCatalan
                ? "Aquesta conversió de document requereix una microVM aïllada al núvol per garantir la màxima fidelitat tipogràfica i de disseny. El teu fitxer es processarà a la memòria i s'eliminarà immediatament."
                : isDutch
                ? "Voor deze documentconversie is een geïsoleerde cloud-microVM vereist om volledige typografie- en lay-outnauwkeurigheid te garanderen. Uw bestand wordt in het geheugen verwerkt en direct daarna gewist."
                : isItalian
                ? "Questa conversione di documenti richiede una microVM isolata nel cloud per garantire la massima fedeltà tipografica e di layout. Il file viene elaborato in memoria ed eliminato immediatamente dopo."
                : isPortuguese
                ? "Esta conversão de documento requer uma microVM isolada na nuvem para garantir a máxima fidelidade tipográfica e de layout. O seu ficheiro é processado na memória e eliminado imediatamente a seguir."
                : isFrench
                ? "Cette conversion de document nécessite une microVM cloud isolée pour garantir une fidélité typographique et de mise en page totale. Votre fichier sera traité en mémoire et purgé immédiatement."
                : isGerman
                ? "Diese Dokumentkonvertierung erfordert eine isolierte MicroVM in der Cloud, um maximale Typografie- und Layout-Treue zu gewährleisten. Ihre Datei wird im Speicher verarbeitet und sofort danach gelöscht."
                : isSpanish
                ? "Este documento requiere conversión en una microVM aislada para garantizar la máxima fidelidad tipográfica y de diseño. Tu archivo se procesa en memoria y se elimina automáticamente inmediatamente después."
                : "This document conversion requires an isolated cloud microVM to ensure complete typography and layout fidelity. Your file will be processed in memory and purged immediately."}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition"
              >
                {isSwedish ? "Avbryt" : isDanish ? "Annuller" : isFinnish ? "Peruuta" : isCatalan ? "Cancel·lar" : isDutch ? "Annuleren" : isItalian ? "Annulla" : isPortuguese ? "Cancelar" : isFrench ? "Annuler" : isGerman ? "Abbrechen" : isSpanish ? "Cancelar" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasConsented(true);
                  executeServerConversion();
                }}
                className="px-5 py-2 text-xs font-bold bg-fk-primary hover:bg-fk-primary/90 text-white rounded-lg shadow-lg transition"
              >
                {isSwedish ? "Auktorisera och konvertera" : isDanish ? "Godkend og konverter" : isFinnish ? "Valtuuta ja muunna" : isCatalan ? "Autoritzar i convertir" : isDutch ? "Autoriseren en converteren" : isItalian ? "Autorizza e converti" : isPortuguese ? "Autorizar e converter" : isFrench ? "Autoriser et convertir" : isGerman ? "Autorisieren & Konvertieren" : isSpanish ? "Autorizar y convertir" : "Authorize & Convert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
