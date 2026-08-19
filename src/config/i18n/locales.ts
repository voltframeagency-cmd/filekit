/**
 * locales.ts
 * 
 * 39-Language Global Benchmark configuration for FileKit:
 * Encompassing Western Europe, Americas, APAC, MENA, Nordics, and Eastern Europe.
 */

export type SupportedLocale =
  | "en"
  | "es"
  | "de"
  | "fr"
  | "pt"
  | "pt-BR"
  | "it"
  | "nl"
  | "sv"
  | "da"
  | "fi"
  | "no"
  | "pl"
  | "cs"
  | "hu"
  | "ro"
  | "bg"
  | "el"
  | "sk"
  | "sl"
  | "ru"
  | "uk"
  | "tr"
  | "ar"
  | "he"
  | "hi"
  | "id"
  | "ms"
  | "th"
  | "vi"
  | "fil"
  | "ja"
  | "ko"
  | "zh-CN"
  | "zh-TW"
  | "ca"
  | "es-419"
  | "lv"
  | "lt";

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  hreflang: string;
  flag: string;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Middle East & Africa";
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  // Western / Default
  en: { code: "en", name: "English", nativeName: "English", direction: "ltr", hreflang: "en", flag: "🇺🇸", region: "Americas" },
  es: { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", hreflang: "es", flag: "🇪🇸", region: "Europe" },
  "es-419": { code: "es-419", name: "Spanish (Latin America)", nativeName: "Español (Latinoamérica)", direction: "ltr", hreflang: "es-419", flag: "🇲🇽", region: "Americas" },
  de: { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr", hreflang: "de", flag: "🇩🇪", region: "Europe" },
  fr: { code: "fr", name: "French", nativeName: "Français", direction: "ltr", hreflang: "fr", flag: "🇫🇷", region: "Europe" },
  pt: { code: "pt", name: "Portuguese (Portugal)", nativeName: "Português", direction: "ltr", hreflang: "pt", flag: "🇵🇹", region: "Europe" },
  "pt-BR": { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", direction: "ltr", hreflang: "pt-BR", flag: "🇧🇷", region: "Americas" },
  it: { code: "it", name: "Italian", nativeName: "Italiano", direction: "ltr", hreflang: "it", flag: "🇮🇹", region: "Europe" },
  nl: { code: "nl", name: "Dutch", nativeName: "Nederlands", direction: "ltr", hreflang: "nl", flag: "🇳🇱", region: "Europe" },
  ca: { code: "ca", name: "Catalan", nativeName: "Català", direction: "ltr", hreflang: "ca", flag: "🇪🇸", region: "Europe" },

  // Nordics
  sv: { code: "sv", name: "Swedish", nativeName: "Svenska", direction: "ltr", hreflang: "sv", flag: "🇸🇪", region: "Europe" },
  da: { code: "da", name: "Danish", nativeName: "Dansk", direction: "ltr", hreflang: "da", flag: "🇩🇰", region: "Europe" },
  fi: { code: "fi", name: "Finnish", nativeName: "Suomi", direction: "ltr", hreflang: "fi", flag: "🇫🇮", region: "Europe" },
  no: { code: "no", name: "Norwegian", nativeName: "Norsk", direction: "ltr", hreflang: "no", flag: "🇳🇴", region: "Europe" },

  // Central & Eastern Europe
  pl: { code: "pl", name: "Polish", nativeName: "Polski", direction: "ltr", hreflang: "pl", flag: "🇵🇱", region: "Europe" },
  cs: { code: "cs", name: "Czech", nativeName: "Čeština", direction: "ltr", hreflang: "cs", flag: "🇨🇿", region: "Europe" },
  hu: { code: "hu", name: "Hungarian", nativeName: "Magyar", direction: "ltr", hreflang: "hu", flag: "🇭🇺", region: "Europe" },
  ro: { code: "ro", name: "Romanian", nativeName: "Română", direction: "ltr", hreflang: "ro", flag: "🇷🇴", region: "Europe" },
  bg: { code: "bg", name: "Bulgarian", nativeName: "Български", direction: "ltr", hreflang: "bg", flag: "🇧🇬", region: "Europe" },
  el: { code: "el", name: "Greek", nativeName: "Ελληνικά", direction: "ltr", hreflang: "el", flag: "🇬🇷", region: "Europe" },
  sk: { code: "sk", name: "Slovak", nativeName: "Slovenčina", direction: "ltr", hreflang: "sk", flag: "🇸🇰", region: "Europe" },
  sl: { code: "sl", name: "Slovenian", nativeName: "Slovenščina", direction: "ltr", hreflang: "sl", flag: "🇸🇮", region: "Europe" },
  ru: { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr", hreflang: "ru", flag: "🇷🇺", region: "Europe" },
  uk: { code: "uk", name: "Ukrainian", nativeName: "Українська", direction: "ltr", hreflang: "uk", flag: "🇺🇦", region: "Europe" },
  lv: { code: "lv", name: "Latvian", nativeName: "Latviešu", direction: "ltr", hreflang: "lv", flag: "🇱🇻", region: "Europe" },
  lt: { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", direction: "ltr", hreflang: "lt", flag: "🇱🇹", region: "Europe" },

  // Middle East & Mediterranean
  tr: { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr", hreflang: "tr", flag: "🇹🇷", region: "Middle East & Africa" },
  ar: { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", hreflang: "ar", flag: "🇸🇦", region: "Middle East & Africa" },
  he: { code: "he", name: "Hebrew", nativeName: "עברית", direction: "rtl", hreflang: "he", flag: "🇮🇱", region: "Middle East & Africa" },

  // Asia-Pacific
  hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी", direction: "ltr", hreflang: "hi", flag: "🇮🇳", region: "Asia-Pacific" },
  id: { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr", hreflang: "id", flag: "🇮🇩", region: "Asia-Pacific" },
  ms: { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", direction: "ltr", hreflang: "ms", flag: "🇲🇾", region: "Asia-Pacific" },
  th: { code: "th", name: "Thai", nativeName: "ไทย", direction: "ltr", hreflang: "th", flag: "🇹🇭", region: "Asia-Pacific" },
  vi: { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", direction: "ltr", hreflang: "vi", flag: "🇻🇳", region: "Asia-Pacific" },
  fil: { code: "fil", name: "Filipino", nativeName: "Filipino", direction: "ltr", hreflang: "fil", flag: "🇵🇭", region: "Asia-Pacific" },
  ja: { code: "ja", name: "Japanese", nativeName: "日本語", direction: "ltr", hreflang: "ja", flag: "🇯🇵", region: "Asia-Pacific" },
  ko: { code: "ko", name: "Korean", nativeName: "한국어", direction: "ltr", hreflang: "ko", flag: "🇰🇷", region: "Asia-Pacific" },
  "zh-CN": { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文", direction: "ltr", hreflang: "zh-CN", flag: "🇨🇳", region: "Asia-Pacific" },
  "zh-TW": { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", direction: "ltr", hreflang: "zh-TW", flag: "🇹🇼", region: "Asia-Pacific" }
};

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const ALL_LOCALES: SupportedLocale[] = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[];

export const NON_DEFAULT_LOCALES: SupportedLocale[] = ALL_LOCALES.filter(
  (locale) => locale !== DEFAULT_LOCALE
);

export function getLocaleDirection(locale: SupportedLocale): "ltr" | "rtl" {
  return SUPPORTED_LOCALES[locale]?.direction || "ltr";
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return locale in SUPPORTED_LOCALES;
}
