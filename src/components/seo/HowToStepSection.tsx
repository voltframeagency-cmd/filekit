"use client";

import React from "react";
import { HowToStep } from "@/config/seo/toolFaqs";
import { useLanguage } from "@/components/layout/LanguageContext";

interface HowToStepSectionProps {
  toolTitle: string;
  steps: HowToStep[];
}

export function HowToStepSection({ toolTitle, steps }: HowToStepSectionProps) {
  const { t, language } = useLanguage();
  if (!steps || steps.length === 0) return null;

  const lowerTitle = toolTitle.toLowerCase();
  const isCompressRoute = lowerTitle.includes('compress') || lowerTitle.includes('sıkıştır') || lowerTitle.includes('comprimir') || lowerTitle.includes('komprimera') || lowerTitle.includes('ضغط');
  const isConvertRoute = lowerTitle.includes('to') || lowerTitle.includes('convert') || lowerTitle.includes('dönüştür') || lowerTitle.includes('konvertera') || lowerTitle.includes('تحويل') || lowerTitle.includes('→') || lowerTitle.includes('till') || lowerTitle.includes('a ') || lowerTitle.includes('in ');
  const isImageRoute = lowerTitle.includes('image') || lowerTitle.includes('jpg') || lowerTitle.includes('png') || lowerTitle.includes('webp') || lowerTitle.includes('foto') || lowerTitle.includes('bild') || lowerTitle.includes('صورة');

  // Clean brand suffixes and marketing slogans from title for natural heading fluency
  const cleanTitle = toolTitle
    .replace(/ \| FileKit$/i, "")
    .replace(/\(FileKit\)$/i, "")
    .replace(/Ücretsiz Çevrimiçi/i, "")
    .replace(/مجاناً أونلاين/i, "")
    .replace(/Online Gratis/i, "")
    .replace(/Gratis en Línea/i, "")
    .replace(/Gratuit en Ligne/i, "")
    .replace(/Kostenlos Online/i, "")
    .replace(/Online Free/i, "")
    .replace(/Free Online/i, "")
    .replace(/^Dönüştür /i, "")
    .replace(/^تحويل /i, "")
    .replace(/^Convertir /i, "")
    .replace(/^Convert /i, "")
    .replace(/^Konvertieren /i, "")
    .replace(/ konvertieren$/i, "")
    .replace(/^Image \(JPG\/PNG\/WebP\) in Sanitized Image/i, "EXIF-Metadaten entfernen")
    .replace(/\s+/g, " ")
    .trim();

  // Complete 39-Locale Headings, Badges, and Drag-Drop dictionaries
  const HOWTO_HEADINGS: Record<string, (title: string) => string> = {
    sv: (t) => `Så här använder du ${t} i 3 enkla steg`,
    da: (t) => `Sådan bruger du ${t} i 3 enkle trin`,
    fi: (t) => `Näin käytät ${t} -työkalua 3 yksinkertaisessa vaiheessa`,
    no: (t) => `Slik bruker du ${t} i 3 enkle trinn`,
    nl: (t) => `Hoe ${t} te gebruiken in 3 eenvoudige stappen`,
    pl: (t) => `Jak używać ${t} w 3 prostych krokach`,
    cs: (t) => `Jak používat ${t} ve 3 jednoduchých krocích`,
    hu: (t) => `Hogyan használd a következőt: ${t} 3 egyszerű lépésben`,
    ro: (t) => `Cum să utilizați ${t} în 3 pași simpli`,
    bg: (t) => `Как да използвате ${t} в 3 лесни стъпки`,
    el: (t) => `Πώς να χρησιμοποιήσετε το ${t} σε 3 απλά βήματα`,
    sk: (t) => `Ako používať ${t} v 3 jednoduchých krokoch`,
    sl: (t) => `Kako uporabljati ${t} v 3 preprostih korakih`,
    ru: (t) => `Как использовать ${t} за 3 простых шага`,
    uk: (t) => `Як використовувати ${t} у 3 простих кроки`,
    lv: (t) => `Kā lietot ${t} 3 vienkāršos soļos`,
    lt: (t) => `Kaip naudotis ${t} atlikus 3 paprastus veiksmus`,
    ar: (t) => `كيفية استخدام ${t} في 3 خطوات بسيطة`,
    he: (t) => `כיצד להשתמש ב-${t} ב-3 שלבים פשוטים`,
    tr: (t) => `3 Basit Adımda ${t} Nasıl Kullanılır`,
    pt: (t) => `Como usar ${t} em 3 passos simples`,
    "pt-BR": (t) => `Como usar ${t} em 3 passos simples`,
    es: (t) => `Cómo usar ${t} en 3 sencillos pasos`,
    "es-419": (t) => `Cómo usar ${t} en 3 sencillos pasos`,
    de: (t) => `So verwenden Sie ${t} in 3 einfachen Schritten`,
    fr: (t) => `Comment utiliser ${t} en 3 étapes simples`,
    it: (t) => `Come utilizzare ${t} in 3 semplici passaggi`,
    ca: (t) => `Com utilitzar ${t} en 3 passos senzills`,
    hi: (t) => `3 सरल चरणों में ${t} का उपयोग कैसे करें`,
    id: (t) => `Cara menggunakan ${t} dalam 3 langkah mudah`,
    ms: (t) => `Cara menggunakan ${t} dalam 3 langkah mudah`,
    th: (t) => `วิธีใช้ ${t} ใน 3 ขั้นตอนง่ายๆ`,
    vi: (t) => `Cách sử dụng ${t} trong 3 bước đơn giản`,
    fil: (t) => `Paano gamitin ang ${t} sa 3 simpleng hakbang`,
    ja: (t) => `3つの簡単なステップで ${t} を使用する方法`,
    ko: (t) => `간단한 3단계로 ${t} 사용하는 방법`,
    "zh-CN": (t) => `只需简单3步即可使用 ${t}`,
    "zh-TW": (t) => `只需簡單3步即可使用 ${t}`,
  };

  const HOWTO_BADGES: Record<string, string> = {
    sv: "SNABBGUIDE",
    da: "HURTIG GUIDE",
    fi: "PIKAOPAS",
    no: "HURTIGVEILEDNING",
    nl: "SNELLE GIDS",
    pl: "SZYBKI PRZEWODNIK",
    cs: "STRUČNÝ NÁVOD",
    hu: "GYORS ÚTMUTATÓ",
    ro: "GHID RAPID",
    bg: "БЪРЗО РЪКОВОДСТВО",
    el: "ΓΡΗΓΟΡΟΣ ΟΔΗΓΟΣ",
    sk: "RÝCHLY NÁVOD",
    sl: "HITRI VODNIK",
    ru: "БЫСТРОЕ РУКОВОДСТВО",
    uk: "ШВИДКИЙ ПОСІБНИК",
    lv: "ĪSĀ PAMĀCĪBA",
    lt: "TRUMPAS VADOVAS",
    ar: "دليل سريع",
    he: "מדריך מהיר",
    tr: "HIZLI REHBER",
    pt: "GUIA RÁPIDO",
    "pt-BR": "GUIA RÁPIDO",
    es: "GUÍA RÁPIDA",
    "es-419": "GUÍA RÁPIDA",
    de: "KURZANLEITUNG",
    fr: "GUIDE RAPIDE",
    it: "GUIDA RAPIDA",
    ca: "GUIA RÀPIDA",
    hi: "त्वरित गाइड",
    id: "PANDUAN CEPAT",
    ms: "PANDUAN RINGKAS",
    th: "คู่มือด่วน",
    vi: "HƯỚNG DẪN NHANH",
    fil: "MABILIS NA GABAY",
    ja: "クイックガイド",
    ko: "빠른 가이드",
    "zh-CN": "快速指南",
    "zh-TW": "快速指南",
  };

  const DRAG_DROP_LABELS: Record<string, string> = {
    sv: "Dra och släpp eller bläddra",
    da: "Træk & slip eller gennemse",
    fi: "Vedä ja pudota tai selaa",
    no: "Dra og slipp eller bla gjennom",
    nl: "Sleep en zet neer of blader",
    pl: "Przeciągnij i upuść lub przeglądaj",
    cs: "Přetáhněte nebo procházejte",
    hu: "Húzza ide vagy tallózzon",
    ro: "Trageți și plasați sau căutați",
    bg: "Плъзнете и пуснете или прегледайте",
    el: "Σύρετε και αφήστε ή περιηγηθείτε",
    sk: "Presuňte myšou alebo prehľadávajte",
    sl: "Povlecite in spustite ali prebrskajte",
    ru: "Перетащите или выберите",
    uk: "Перетягніть або виберіть",
    lv: "Velciet un nometiet vai pārlūkojiet",
    lt: "Vilkite ir numeskite arba naršykite",
    tr: "Sürükleyip bırakın veya seçin",
    ar: "اسحب وأفلت أو تصفح",
    he: "גרור ושחרר או עיין",
    es: "Arrastra y suelta o busca",
    "es-419": "Arrastra y suelta o busca",
    pt: "Arraste e solte ou procure",
    "pt-BR": "Arraste e solte ou procure",
    fr: "Glisser-déposer ou parcourir",
    de: "Ziehen & Ablegen oder Suchen",
    it: "Trascina e rilascia o sfoglia",
    ca: "Arrossega i deixa anar o cerca",
    hi: "खींचें और छोड़ें या ब्राउज़ करें",
    id: "Tarik & lepas atau telusuri",
    ms: "Seret & lepas atau semak imbas",
    th: "ลากและวางหรือเรียกดู",
    vi: "Kéo và thả hoặc duyệt",
    fil: "I-drag at i-drop o mag-browse",
    ja: "ドラッグ＆ドロップまたは参照",
    ko: "드래그 앤 드롭 또는 찾아보기",
    "zh-CN": "拖放或浏览文件",
    "zh-TW": "拖放或瀏覽檔案",
  };

  const getHeading = () => {
    const fn = HOWTO_HEADINGS[language];
    if (fn) return fn(cleanTitle);
    return `How to Use ${cleanTitle} in 3 Simple Steps`;
  };

  const getBadge = () => {
    return HOWTO_BADGES[language] || "QUICK GUIDE";
  };

  const getDragDropLabel = () => {
    return DRAG_DROP_LABELS[language] || "Drag & drop or browse";
  };

  return (
    <section
      aria-labelledby="howto-heading"
      className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-xl space-y-8"
      itemScope
      itemType="https://schema.org/HowTo"
    >
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
          {getBadge()}
        </span>
        <h2 id="howto-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans" itemProp="name">
          {getHeading()}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left ltr:text-left rtl:text-right">
        {steps.map((step, idx) => (
          <div
            key={idx}
            id={`step-${idx + 1}`}
            className="group relative bg-[#f8faf9] border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            itemScope
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            {/* Mockup Graphic Header */}
            <div className="relative aspect-[451/330] w-full overflow-hidden border-b border-blue-100/60 bg-[#eff6ff]">
              <div className="absolute inset-0 h-full w-full [&>svg]:h-full [&>svg]:w-full">
                {idx === 0 && (
                  <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                    <image href="/brand-assets/how-it-works/zendocs-step-6.svg" width="100%" height="100%" />
                    {/* Pill backing to cleanly cover underlying artwork without overlap */}
                    <rect
                      x="90"
                      y="207"
                      width="272"
                      height="28"
                      rx="14"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                    <text
                      x="226"
                      y="221"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fill: 'rgba(30, 41, 59, 0.85)',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {getDragDropLabel()}
                    </text>
                  </svg>
                )}
                {idx === 1 && (
                  <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                    {isCompressRoute ? (
                      <g id="compress-graphic-step2">
                        <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                        <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                        {/* Top Left Header */}
                        <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                        <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                        {/* Floating Tooltip Box with Beak */}
                        <path fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" d="M 60 48 H 392 A 14 14 0 0 1 406 62 V 98 A 14 14 0 0 1 392 112 H 234 L 226 122 L 218 112 H 60 A 14 14 0 0 1 46 98 V 62 A 14 14 0 0 1 60 48 Z" />
                        <line stroke="#000000" strokeWidth="4.5" strokeLinecap="round" x1="78" y1="80" x2="226" y2="80" />
                        <line stroke="#d1d5db" strokeWidth="4.5" strokeLinecap="round" x1="226" y1="80" x2="374" y2="80" />
                        <line stroke="#000000" strokeWidth="1.5" strokeLinecap="round" x1="86" y1="93" x2="86" y2="99" />
                        <line stroke="#000000" strokeWidth="1.5" strokeLinecap="round" x1="366" y1="93" x2="366" y2="99" />
                        <circle fill="#ffffff" stroke="#000000" strokeWidth="2" cx="226" cy="80" r="13" />
                        <g id="compress-cursor" transform="translate(227, 81)">
                          <path d="M0,0 L0,18 L4.5,13.5 L9,21 L12,19.5 L7.5,12 L13.5,12 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                          <path d="M0,0 L0,18 L4.5,13.5 L9,21 L12,19.5 L7.5,12 L13.5,12 Z" fill="#000000" />
                        </g>

                        {/* Previews Left & Right */}
                        <g id="left-preview">
                          <rect fill="#d8e6fe" x="30" y="138" width="174" height="150" rx="16" />
                          <g clipPath="url(#left-clip-step2)">
                            <clipPath id="left-clip-step2"><rect x="30" y="138" width="174" height="150" rx="16" /></clipPath>
                            <circle fill="#bfdbfe" cx="80" cy="162" r="15" />
                            <path fill="#d0e1fe" d="M 166 166 a 6 6 0 0 0 -6 -5 a 9 9 0 0 0 -13 2 a 6 6 0 0 0 -5 7 h 24 z" />
                            <polygon fill="#a5c7fe" points="100,242 148,174 204,242" />
                            <polygon fill="#80b3ff" points="30,242 86,182 156,242" />
                            <polygon fill="#3b82f6" points="56,214 47,242 65,242" />
                            <polygon fill="#3b82f6" points="56,198 49,218 63,218" />
                            <polygon fill="#3b82f6" points="74,222 67,242 81,242" />
                            <polygon fill="#3b82f6" points="74,210 69,226 79,226" />
                            <path fill="#91c4fd" d="M 30 238 Q 80 244 114 254 T 204 256 L 204 274 A 16 16 0 0 1 188 288 L 46 288 A 16 16 0 0 1 30 274 Z" />
                            <path fill="#e2eeff" d="M 204 262 Q 136 266 94 276 T 30 286 L 30 288 L 188 288 A 16 16 0 0 0 204 272 Z" />
                          </g>
                        </g>

                        {/* Connector Arrow */}
                        <circle fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" cx="226" cy="213" r="13" />
                        <path stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 221 213 H 229 M 226 209 L 230 213 L 226 217" />

                        {/* Right Preview */}
                        <g id="right-preview">
                          <rect fill="#d8e6fe" x="248" y="138" width="174" height="150" rx="16" />
                          <g clipPath="url(#right-clip-step2)">
                            <clipPath id="right-clip-step2"><rect x="248" y="138" width="174" height="150" rx="16" /></clipPath>
                            <circle fill="#bfdbfe" cx="298" cy="162" r="15" />
                            <path fill="#d0e1fe" d="M 384 166 a 6 6 0 0 0 -6 -5 a 9 9 0 0 0 -13 2 a 6 6 0 0 0 -5 7 h 24 z" />
                            <polygon fill="#a5c7fe" points="318,242 366,174 422,242" />
                            <polygon fill="#80b3ff" points="248,242 304,182 374,242" />
                            <polygon fill="#3b82f6" points="274,214 265,242 283,242" />
                            <polygon fill="#3b82f6" points="274,198 267,218 281,218" />
                            <polygon fill="#3b82f6" points="292,222 285,242 299,242" />
                            <polygon fill="#3b82f6" points="292,210 287,226 297,226" />
                            <path fill="#91c4fd" d="M 248 238 Q 298 244 332 254 T 422 256 L 422 274 A 16 16 0 0 1 406 288 L 264 288 A 16 16 0 0 1 248 274 Z" />
                            <path fill="#e2eeff" d="M 422 262 Q 354 266 312 276 T 248 286 L 248 288 L 406 288 A 16 16 0 0 0 422 272 Z" />
                          </g>
                        </g>

                        {/* Bottom Pills */}
                        <rect fill="#e2ecfe" x="90" y="296" width="54" height="15" rx="6" />
                        <rect fill="#e2ecfe" x="308" y="296" width="54" height="15" rx="6" />
                        <circle fill="#2563eb" cx="117" cy="303" r="3.5" />
                        <circle fill="#16a34a" cx="335" cy="303" r="3.5" />
                      </g>
                    ) : (
                      <g id="convert-graphic-step2">
                        <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                        <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                        {/* Top Left Header */}
                        <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                        <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                        {/* Inner Main Card Container */}
                        <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="42" y="54" width="368" height="238" rx="14" />

                        {/* Option 1: Selected JPG Photo Format */}
                        <g id="option-jpg-step2">
                          <rect fill="#f4f8ff" stroke="#3b82f6" strokeWidth="1.5" x="60" y="80" width="100" height="142" rx="12" />
                          <g clipPath="url(#jpg-clip-step2)">
                            <clipPath id="jpg-clip-step2"><rect x="76" y="100" width="68" height="60" rx="10" /></clipPath>
                            <rect fill="#3b82f6" x="76" y="100" width="68" height="60" rx="10" />
                            <circle fill="#ffffff" cx="91" cy="115" r="6" />
                            <polygon fill="#2563eb" points="106,160 124,130 144,160" />
                            <polygon fill="#1d4ed8" points="76,160 98,136 124,160" />
                          </g>
                          <circle fill="#ffffff" stroke="#3b82f6" strokeWidth="2" cx="110" cy="190" r="9" />
                          <circle fill="#3b82f6" cx="110" cy="190" r="4.5" />
                        </g>

                        {/* Option 2: Unselected PNG Checkerboard Format */}
                        <g id="option-png-step2">
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="176" y="80" width="100" height="142" rx="12" />
                          <g clipPath="url(#png-clip-step2)">
                            <clipPath id="png-clip-step2"><rect x="192" y="100" width="68" height="60" rx="10" /></clipPath>
                            <rect fill="#dbeafe" x="192" y="100" width="68" height="60" rx="10" />
                            <rect fill="#bfdbfe" x="192" y="100" width="17" height="15" />
                            <rect fill="#bfdbfe" x="226" y="100" width="17" height="15" />
                            <rect fill="#bfdbfe" x="209" y="115" width="17" height="15" />
                            <rect fill="#bfdbfe" x="243" y="115" width="17" height="15" />
                            <rect fill="#bfdbfe" x="192" y="130" width="17" height="15" />
                            <rect fill="#bfdbfe" x="226" y="130" width="17" height="15" />
                            <rect fill="#bfdbfe" x="209" y="145" width="17" height="15" />
                            <rect fill="#bfdbfe" x="243" y="145" width="17" height="15" />
                          </g>
                          <circle fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" cx="226" cy="190" r="8" />
                        </g>

                        {/* Option 3: Unselected PDF Document Format */}
                        <g id="option-pdf-step2">
                          <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="292" y="80" width="100" height="142" rx="12" />
                          <g id="pdf-icon-step2">
                            <path fill="#dbeafe" d="M 320 100 H 348 L 360 112 V 152 A 8 8 0 0 1 352 160 H 320 A 8 8 0 0 1 312 152 V 108 A 8 8 0 0 1 320 100 Z" />
                            <polygon fill="#a5c7fe" points="348,100 360,112 348,112" />
                            <polygon fill="#60a5fa" points="320,150 330,138 340,150" />
                            <polygon fill="#3b82f6" points="334,150 344,142 352,150" />
                          </g>
                          <circle fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" cx="342" cy="190" r="8" />
                        </g>

                        {/* Bottom Action Button */}
                        <rect fill="#2563eb" x="146" y="244" width="160" height="30" rx="8" />
                      </g>
                    )}
                  </svg>
                )}
                {idx === 2 && (
                  <svg viewBox="0 0 451.97 330.33" className="block h-full w-full" aria-hidden="true">
                    <g id="download-graphic-step3">
                      <rect fill="#f5f7fc" x="0" y="0" width="451.97" height="330.33" rx="18" ry="18" />
                      <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="12" y="12" width="427.97" height="306.33" rx="16" ry="16" />

                      {/* Top Left Header */}
                      <circle fill="#dbe6f8" cx="36" cy="36" r="10" />
                      <rect fill="#e4ecfa" x="54" y="31" width="100" height="10" rx="5" />

                      {/* Inner Main Card Container */}
                      <rect fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" x="42" y="54" width="368" height="238" rx="14" />

                      {/* Centered Hero Preview Card */}
                      <g id="hero-preview-step3">
                        <rect fill="#eff6ff" x="166" y="74" width="120" height="116" rx="16" />
                        <g clipPath="url(#hero-clip-step3)">
                          <clipPath id="hero-clip-step3"><rect x="166" y="74" width="120" height="116" rx="16" /></clipPath>
                          <circle fill="#60a5fa" cx="196" cy="102" r="10" />
                          <polygon fill="#3b82f6" points="212,176 250,118 286,176" />
                          <polygon fill="#2563eb" points="166,176 198,134 236,176" />
                          <path fill="#dbeafe" d="M 166 168 Q 206 172 236 178 T 286 180 V 190 L 166 190 Z" />
                        </g>
                      </g>

                      {/* Overlaid Download Badge Circle */}
                      <g id="download-badge-step3">
                        <circle fill="#3b82f6" stroke="#ffffff" strokeWidth="3.5" cx="260" cy="162" r="23" />
                        <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="260" y1="151" x2="260" y2="165" />
                        <path stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 254 160 L 260 166 L 266 160" />
                        <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="252" y1="171" x2="268" y2="171" />
                      </g>

                      {/* Bottom Action Button */}
                      <g id="action-button-step3">
                        <rect fill="#2563eb" x="76" y="226" width="300" height="42" rx="10" />
                        <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="226" y1="236" x2="226" y2="248" />
                        <path stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M 220 243 L 226 249 L 232 243" />
                        <line stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" x1="216" y1="254" x2="236" y2="254" />
                      </g>
                    </g>
                  </svg>
                )}
              </div>
            </div>

            {/* Step Title and Body Description */}
            <div className="p-6 space-y-2 bg-white flex-1 flex flex-col justify-start" dir="auto">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  {idx + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans tracking-tight" itemProp="name">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mt-1" itemProp="text">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
