import { SupportedLocale } from "../i18n/locales";
import { CATEGORY_TRANSLATIONS, ToolFamilyKey } from "./categories";
import { HOW_TO_STEPS } from "./howToSteps";
import { FAMILY_FAQS } from "./familyFaqs";
import { getEntityDefinition } from "./entityDefinitions";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolSeoContent {
  howToSteps: HowToStep[];
  faqs: FaqItem[];
  entityDefinition: string;
  category: string;
}

export function detectToolFamily(slug: string): ToolFamilyKey {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  if (normSlug.includes("dwg") || normSlug.includes("dxf")) {
    return "cad";
  }
  if (normSlug.includes("ai-to") || normSlug.includes("eps-to") || normSlug.includes("psd-to")) {
    return "vector";
  }
  if (normSlug.includes("srt") || normSlug.includes("vtt")) {
    return "subtitles";
  }
  if (normSlug.includes("pages-to") || normSlug.includes("numbers-to") || normSlug.includes("keynote-to")) {
    return "apple";
  }
  if (
    normSlug.includes("image") ||
    normSlug.includes("jpg") ||
    normSlug.includes("png") ||
    normSlug.includes("webp") ||
    normSlug.includes("heic") ||
    normSlug.includes("avif") ||
    normSlug.includes("ico") ||
    normSlug.includes("bmp") ||
    normSlug.includes("svg") ||
    normSlug.includes("crop") ||
    normSlug.includes("resize") ||
    normSlug.includes("rotate-image") ||
    normSlug.includes("flip") ||
    normSlug.includes("grayscale") ||
    normSlug.includes("invert") ||
    normSlug.includes("blur") ||
    normSlug.includes("strip-exif")
  ) {
    return "image";
  }
  if (
    normSlug.includes("audio") ||
    normSlug.includes("video") ||
    normSlug.includes("mp3") ||
    normSlug.includes("wav") ||
    normSlug.includes("flac") ||
    normSlug.includes("m4a") ||
    normSlug.includes("ogg") ||
    normSlug.includes("mp4") ||
    normSlug.includes("mov") ||
    normSlug.includes("avi") ||
    normSlug.includes("mkv") ||
    normSlug.includes("webm") ||
    normSlug.includes("wmv") ||
    normSlug.includes("mute") ||
    normSlug.includes("speed") ||
    normSlug.includes("volume")
  ) {
    return "audio_video";
  }
  return "pdf";
}

export function getToolSeoContent(slug: string, toolTitle: string, locale: string = "en"): ToolSeoContent {
  const family = detectToolFamily(slug);

  // Exact matching preserving case for compound locales (e.g. pt-BR, zh-CN, zh-TW, es-419)
  const validLocale = (locale in CATEGORY_TRANSLATIONS.pdf
    ? locale
    : locale.toLowerCase() in CATEGORY_TRANSLATIONS.pdf
    ? locale.toLowerCase()
    : "en") as SupportedLocale;
  const category = CATEGORY_TRANSLATIONS[family][validLocale] || CATEGORY_TRANSLATIONS[family]["en"];
  const howToSteps = HOW_TO_STEPS[validLocale] || HOW_TO_STEPS[locale as SupportedLocale] || HOW_TO_STEPS["en"];
  
  const famFaqs = FAMILY_FAQS[family] || FAMILY_FAQS.pdf;
  const faqs = (famFaqs[validLocale] || famFaqs[locale as SupportedLocale] || famFaqs.en || []) as FaqItem[];
  
  const entityDefinition = getEntityDefinition(family, toolTitle, validLocale);

  return { category, entityDefinition, howToSteps, faqs };
}
