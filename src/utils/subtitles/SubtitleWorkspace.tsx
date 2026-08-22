"use client";

import React, { useState, useEffect } from "react";
import { SubtitleEngine } from "./SubtitleEngine";
import { useLanguage } from "@/components/layout/LanguageContext";

interface SubtitleWorkspaceProps {
  mode: "srt-to-vtt" | "vtt-to-srt";
  title: string;
  subtitle: string;
  embedded?: boolean;
}

export default function SubtitleWorkspace({ mode, title, subtitle, embedded = true }: SubtitleWorkspaceProps) {
  const { language } = useLanguage();
  const isSpanish = language === "es" || language === "es-419";

  const [file, setFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError(null);
    setLoading(true);

    try {
      const text = await selected.text();
      setInputText(text);

      let converted = "";
      let outName = "";
      if (mode === "srt-to-vtt") {
        converted = SubtitleEngine.srtToVtt(text);
        outName = selected.name.replace(/\.srt$/i, "") + ".vtt";
      } else {
        converted = SubtitleEngine.vttToSrt(text);
        outName = selected.name.replace(/\.vtt$/i, "") + ".srt";
      }

      setOutputText(converted);
      setDownloadName(outName);

      const mime = mode === "srt-to-vtt" ? "text/vtt" : "text/plain";
      const blob = new Blob([converted], { type: mime });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(isSpanish ? "Error al procesar y convertir el archivo de subtítulos." : "Failed to parse and convert subtitle file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!embedded && (
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-fk-text">{title}</h2>
          <p className="text-sm text-fk-text-muted">{subtitle}</p>
        </div>
      )}

      <div className="bg-white border border-fk-border rounded-fk-xl shadow-sm p-6 space-y-6">
        <div className="border-2 border-dashed border-fk-border hover:border-blue-500 rounded-xl p-8 text-center transition-all bg-slate-50/50">
          <input
            type="file"
            id="subtitle-upload"
            accept={mode === "srt-to-vtt" ? ".srt,text/plain" : ".vtt,text/vtt,text/plain"}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="subtitle-upload"
            className="cursor-pointer flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
              📄
            </div>
            <span className="text-base font-bold text-slate-800">
              {file
                ? file.name
                : isSpanish
                ? `Selecciona archivo de subtítulos ${mode === "srt-to-vtt" ? ".SRT" : ".VTT"}`
                : `Select ${mode === "srt-to-vtt" ? ".SRT" : ".VTT"} subtitle file`}
            </span>
            <span className="text-xs text-slate-400">
              {isSpanish ? "100% En el navegador · Conversión instantánea y privada" : "100% In-Browser · Private & Instant Conversion"}
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        {outputText && downloadUrl && (
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">
                {isSpanish ? "Vista previa de la conversión:" : "Conversion Preview:"}
              </span>
              <a
                href={downloadUrl}
                download={downloadName}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>{isSpanish ? `Descargar ${downloadName}` : `Download ${downloadName}`}</span>
                <span className="text-xs">↓</span>
              </a>
            </div>

            <textarea
              readOnly
              value={outputText}
              className="w-full h-48 p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-800 overflow-y-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
