export type SupportedLocale = "en" | "es" | "de" | "fr" | "pt" | "it" | "sv";

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  hreflang: string;
  flag: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    hreflang: "en",
    flag: "🇺🇸"
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    hreflang: "es",
    flag: "🇪🇸"
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    hreflang: "de",
    flag: "🇩🇪"
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    hreflang: "fr",
    flag: "🇫🇷"
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    hreflang: "pt",
    flag: "🇧🇷"
  },
  it: {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    hreflang: "it",
    flag: "🇮🇹"
  },
  sv: {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    direction: "ltr",
    hreflang: "sv",
    flag: "🇸🇪"
  }
};

export const LOCALES_LIST = Object.values(SUPPORTED_LOCALES);
export const NON_DEFAULT_LOCALES: SupportedLocale[] = ["es", "de", "fr", "pt", "it", "sv"];
