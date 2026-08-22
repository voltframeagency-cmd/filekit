import fs from "fs";
import path from "path";

// Master 39-Locale FAQs and Entity Generator
const LOCALES = [
  "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
  "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el",
  "sk", "sl", "ru", "uk", "lv", "lt", "tr", "ar", "he", "hi",
  "id", "ms", "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW"
] as const;

type Locale = typeof LOCALES[number];

console.log("Writing complete 39-locale FAQ knowledge base...");
