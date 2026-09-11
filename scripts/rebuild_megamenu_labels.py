import os
import re

print("=== REBUILDING MegaMenu getLocalizedLinkLabel WITH COMPLETE 39-LOCALE COVERAGE ===")

with open('src/components/navigation/DesktopMegaMenu.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace getLocalizedLinkLabel implementation
old_func_start = '  const getLocalizedLinkLabel = (label: string, href?: string): string => {'
old_func_end = '    return label;\n  };'

start_idx = code.find(old_func_start)
end_idx = code.find(old_func_end, start_idx) + len(old_func_end)

new_func = '''  const getLocalizedLinkLabel = (label: string, href?: string): string => {
    const shortLocale = activeLocale.split("-")[0];

    // 1. Direct dictionary exact match
    if (EXACT_TOOL_LABELS[label]) {
      const exactMatch = EXACT_TOOL_LABELS[label][activeLocale] || EXACT_TOOL_LABELS[label][shortLocale];
      if (exactMatch) return exactMatch;
    }

    // 2. Format pair conversion (e.g. "JPG to PNG", "PDF to JPG", "TIFF to PDF", "DWG to PDF")
    if (label.includes(" to ")) {
      const [rawSource, rawTarget] = label.split(" to ");
      if (rawSource && rawTarget) {
        let source = rawSource.trim();
        let target = rawTarget.trim();

        const pairKey = `${source} to ${target}`;
        if (EXACT_TOOL_LABELS[pairKey]) {
          const match = EXACT_TOOL_LABELS[pairKey][activeLocale] || EXACT_TOOL_LABELS[pairKey][shortLocale];
          if (match) return match;
        }

        const dict = VERB_DICTIONARY[activeLocale as SupportedLocale];
        const PREPOSITIONS: Record<string, string> = {
          ar: "إلى",
          bg: "в",
          cs: "na",
          da: "til",
          de: "in",
          el: "σε",
          es: "a",
          "es-419": "a",
          fi: "muotoon",
          fil: "patungo sa",
          fr: "en",
          he: "ל-",
          hi: "में",
          hu: "formátumba",
          id: "ke",
          it: "in",
          ja: "→",
          ko: "→",
          lt: "į",
          lv: "par",
          ms: "kepada",
          nl: "naar",
          no: "til",
          pl: "na",
          pt: "para",
          "pt-BR": "para",
          ro: "în",
          ru: "в",
          sk: "na",
          sl: "v",
          sv: "till",
          th: "เป็น",
          tr: "→",
          uk: "у",
          vi: "sang",
          "zh-CN": "转",
          "zh-TW": "轉"
        };

        const toPrep = PREPOSITIONS[activeLocale] || PREPOSITIONS[shortLocale] || dict?.to || "to";

        const NOUN_MAP: Record<string, Record<string, string>> = {
          Image: {
            bg: "Изображение",
            cs: "Obrázek",
            de: "Bild",
            es: "Imagen",
            fr: "Image",
            hu: "Kép",
            it: "Immagine",
            pl: "Obraz",
            pt: "Imagem",
            ro: "Imagine",
            ru: "Изображение",
            sv: "Bild",
            uk: "Зображення"
          },
          Text: {
            bg: "Текст",
            cs: "Text",
            de: "Text",
            es: "Texto",
            fr: "Texte",
            hu: "Szöveg",
            it: "Testo",
            pl: "Tekst",
            pt: "Texto",
            ro: "Text",
            ru: "Текст",
            sv: "Text",
            uk: "Текст"
          }
        };

        if (NOUN_MAP[source]?.[activeLocale] || NOUN_MAP[source]?.[shortLocale]) {
          source = NOUN_MAP[source][activeLocale] || NOUN_MAP[source][shortLocale];
        }
        if (NOUN_MAP[target]?.[activeLocale] || NOUN_MAP[target]?.[shortLocale]) {
          target = NOUN_MAP[target][activeLocale] || NOUN_MAP[target][shortLocale];
        }

        return `${source} ${toPrep} ${target}`;
      }
    }

    return label;
  };'''

code = code[:start_idx] + new_func + code[end_idx:]

with open('src/components/navigation/DesktopMegaMenu.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("[OK] DesktopMegaMenu.tsx getLocalizedLinkLabel rebuilt with 39-locale preposition & noun mapping!")
