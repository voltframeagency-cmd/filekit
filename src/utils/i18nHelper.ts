import { SupportedLocale, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES } from "@/config/i18n/locales";
import { CONVERSION_CATALOG } from "@/config/conversionCatalog";
import { buildCanonicalUrl } from "@/utils/siteUrl";

// Action verbs and terms dictionary
const VERB_DICTIONARY: Record<SupportedLocale, {
  convert: string;
  compress: string;
  merge: string;
  split: string;
  rotate: string;
  crop: string;
  resize: string;
  extract: string;
  to: string;
  from: string;
  onlineFree: string;
  privacyNotice: string;
}> = {
  en: {
    convert: "Convert",
    compress: "Compress",
    merge: "Merge",
    split: "Split",
    rotate: "Rotate",
    crop: "Crop",
    resize: "Resize",
    extract: "Extract",
    to: "to",
    from: "from",
    onlineFree: "Online Free",
    privacyNotice: "100% private in-browser processing with zero server uploads."
  },
  es: {
    convert: "Convertir",
    compress: "Comprimir",
    merge: "Unir",
    split: "Dividir",
    rotate: "Rotar",
    crop: "Recortar",
    resize: "Redimensionar",
    extract: "Extraer",
    to: "a",
    from: "desde",
    onlineFree: "Online Gratis",
    privacyNotice: "Procesamiento 100% privado en tu navegador sin subir archivos."
  },
  de: {
    convert: "Konvertieren",
    compress: "Komprimieren",
    merge: "Zusammenfügen",
    split: "Trennen",
    rotate: "Drehen",
    crop: "Zuschneiden",
    resize: "Größe ändern",
    extract: "Extrahieren",
    to: "in",
    from: "von",
    onlineFree: "Kostenlos Online",
    privacyNotice: "100% private Verarbeitung direkt im Browser ohne Server-Upload."
  },
  fr: {
    convert: "Convertir",
    compress: "Compresser",
    merge: "Fusionner",
    split: "Diviser",
    rotate: "Faire pivoter",
    crop: "Rogner",
    resize: "Redimensionner",
    extract: "Extraire",
    to: "en",
    from: "de",
    onlineFree: "Gratuit en Ligne",
    privacyNotice: "Traitement 100% privé dans votre navigateur sans téléversement."
  },
  pt: {
    convert: "Converter",
    compress: "Comprimir",
    merge: "Juntar",
    split: "Dividir",
    rotate: "Girar",
    crop: "Cortar",
    resize: "Redimensionar",
    extract: "Extrair",
    to: "para",
    from: "de",
    onlineFree: "Grátis Online",
    privacyNotice: "Processamento 100% privado no navegador sem envio de arquivos."
  },
  it: {
    convert: "Converti",
    compress: "Comprimi",
    merge: "Unisci",
    split: "Dividi",
    rotate: "Ruota",
    crop: "Ritaglia",
    resize: "Ridimensiona",
    extract: "Estrai",
    to: "in",
    from: "da",
    onlineFree: "Gratis Online",
    privacyNotice: "Elaborazione 100% privata nel browser senza caricamento sul server."
  },
  sv: {
    convert: "Konvertera",
    compress: "Komprimera",
    merge: "Slå samman",
    split: "Dela upp",
    rotate: "Rotera",
    crop: "Beskär",
    resize: "Ändra storlek",
    extract: "Extrahera",
    to: "till",
    from: "från",
    onlineFree: "Gratis Online",
    privacyNotice: "100% privat bearbetning i webbläsaren utan uppladdning."
  }
};

export interface LocalizedToolMeta {
  title: string;
  description: string;
  subtitle: string;
  inLanguage: string;
  canonicalUrl: string;
}

export function getLocalizedToolMeta(slug: string, locale: SupportedLocale): LocalizedToolMeta {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const catalogEntry = CONVERSION_CATALOG[normSlug];
  const verbs = VERB_DICTIONARY[locale] || VERB_DICTIONARY.en;

  const rawInput = catalogEntry?.inputFormat || "File";
  const rawOutput = catalogEntry?.outputFormat || "File";

  // Build clean localized title
  let title = "";
  let description = "";

  if (normSlug.includes("-to-")) {
    title = `${verbs.convert} ${rawInput} ${verbs.to} ${rawOutput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.convert} ${rawInput} ${verbs.to} ${rawOutput} ${verbs.onlineFree}. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/compress-")) {
    title = `${verbs.compress} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.compress} ${rawInput} ${verbs.onlineFree} to reduce file size. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/merge-")) {
    title = `${verbs.merge} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.merge} multiple ${rawInput} files into one document. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/split-")) {
    title = `${verbs.split} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.split} ${rawInput} pages into separate documents. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/rotate-")) {
    title = `${verbs.rotate} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.rotate} ${rawInput} orientation 90, 180, or 270 degrees. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/crop-")) {
    title = `${verbs.crop} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.crop} ${rawInput} margins and dimensions. ${verbs.privacyNotice}`;
  } else if (normSlug.startsWith("/extract-")) {
    title = `${verbs.extract} ${rawInput} ${verbs.onlineFree} – FileKit`;
    description = `${verbs.extract} content from ${rawInput} archives and documents. ${verbs.privacyNotice}`;
  } else {
    // Generic fallback
    const readableSlug = normSlug.replace(/^\//, "").replace(/-/g, " ");
    title = `${readableSlug.charAt(0).toUpperCase() + readableSlug.slice(1)} ${verbs.onlineFree} – FileKit`;
    description = `${catalogEntry?.uniqueOutcomeDefinition || "Fast in-browser utility tool."} ${verbs.privacyNotice}`;
  }

  const canonicalUrl = getLocalizedUrl(normSlug, locale);

  return {
    title,
    description,
    subtitle: verbs.privacyNotice,
    inLanguage: locale,
    canonicalUrl
  };
}

export function getLocalizedUrl(slug: string, locale: SupportedLocale): string {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  if (locale === "en") {
    return buildCanonicalUrl(normSlug);
  }
  return buildCanonicalUrl(`/${locale}${normSlug}`);
}

export interface HreflangLink {
  rel: "alternate";
  hrefLang: string;
  href: string;
}

export function getHreflangLinks(slug: string): HreflangLink[] {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;
  const links: HreflangLink[] = [
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: buildCanonicalUrl(normSlug)
    },
    {
      rel: "alternate",
      hrefLang: "en",
      href: buildCanonicalUrl(normSlug)
    }
  ];

  for (const loc of NON_DEFAULT_LOCALES) {
    links.push({
      rel: "alternate",
      hrefLang: loc,
      href: buildCanonicalUrl(`/${loc}${normSlug}`)
    });
  }

  return links;
}
