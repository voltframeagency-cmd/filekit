import re

with open("src/config/seo/toolFaqs.ts", "r", encoding="utf-8") as f:
    code = f.read()

# Replace getToolSeoContent preamble
preamble_target = """export function getToolSeoContent(slug: string, toolTitle: string, locale: string = "en"): ToolSeoContent {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const loc = locale.toLowerCase();"""

preamble_replacement = """export function getToolSeoContent(slug: string, toolTitle: string, locale: string = "en"): ToolSeoContent {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const loc = locale.toLowerCase();

  let family: ToolFamilyKey = "pdf";
  if (normSlug.includes("dwg") || normSlug.includes("dxf")) {
    family = "cad";
  } else if (normSlug.includes("ai-to") || normSlug.includes("eps-to") || normSlug.includes("psd-to")) {
    family = "vector";
  } else if (normSlug.includes("srt") || normSlug.includes("vtt")) {
    family = "subtitles";
  } else if (normSlug.includes("pages-to") || normSlug.includes("numbers-to") || normSlug.includes("keynote-to")) {
    family = "apple";
  } else if (
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
    family = "image";
  } else if (
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
    family = "audio_video";
  }

  const validLocale = (loc in CATEGORY_TRANSLATIONS.pdf ? loc : "en") as SupportedLocale;
  const category = CATEGORY_TRANSLATIONS[family][validLocale] || CATEGORY_TRANSLATIONS[family]["en"];
  const howToSteps = HOW_TO_STEPS[validLocale] || HOW_TO_STEPS["en"];"""

if preamble_target in code:
    code = code.replace(preamble_target, preamble_replacement)
    with open("src/config/seo/toolFaqs.ts", "w", encoding="utf-8") as f:
        f.write(code)
    print("Successfully refactored preamble in toolFaqs.ts")
else:
    print("Preamble target not found")
