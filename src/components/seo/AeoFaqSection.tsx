"use client";

import React, { useState } from "react";
import { FaqItem } from "@/config/seo/toolFaqs";
import { useLanguage } from "@/components/layout/LanguageContext";

interface AeoFaqSectionProps {
  toolTitle: string;
  faqs: FaqItem[];
}

export function AeoFaqSection({ toolTitle, faqs }: AeoFaqSectionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t, language } = useLanguage();

  if (!faqs || faqs.length === 0) return null;

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
    .replace(/\s+/g, " ")
    .trim();

  const FAQ_HEADINGS: Record<string, (title: string) => string> = {
    sv: (t) => `Vanliga frågor om ${t}`,
    da: (t) => `Ofte stillede spørgsmål om ${t}`,
    fi: (t) => `Usein kysytyt kysymykset: ${t}`,
    no: (t) => `Ofte stilte spørsmål om ${t}`,
    nl: (t) => `Veelgestelde vragen over ${t}`,
    pl: (t) => `Często zadawane pytania dotyczące ${t}`,
    cs: (t) => `Často kladené otázky o ${t}`,
    hu: (t) => `Gyakran ismételt kérdések: ${t}`,
    ro: (t) => `Întrebări frecvente despre ${t}`,
    bg: (t) => `Често задавани въпроси за ${t}`,
    el: (t) => `Συχνές ερωτήσεις σχετικά με το ${t}`,
    sk: (t) => `Často kladené otázky o ${t}`,
    sl: (t) => `Pogosta vprašanja o ${t}`,
    ru: (t) => `Часто задаваемые вопросы о ${t}`,
    uk: (t) => `Часті запитання про ${t}`,
    lv: (t) => `Biežāk uzdotie jautājumi par ${t}`,
    lt: (t) => `Dažniausiai užduodami klausimai apie ${t}`,
    ar: (t) => `أسئلة شائعة حول ${t}`,
    he: (t) => `שאלות נפוצות על ${t}`,
    tr: (t) => `${t} Hakkında Sıkça Sorulan Sorular`,
    pt: (t) => `Perguntas frequentes sobre ${t}`,
    "pt-BR": (t) => `Perguntas frequentes sobre ${t}`,
    es: (t) => `Preguntas frecuentes sobre ${t}`,
    "es-419": (t) => `Preguntas frecuentes sobre ${t}`,
    de: (t) => `Häufig gestellte Fragen zu ${t}`,
    fr: (t) => `Foire aux questions sur ${t}`,
    it: (t) => `Domande frequenti su ${t}`,
    ca: (t) => `Preguntes freqüents sobre ${t}`,
    hi: (t) => `${t} के बारे में अक्सर पूछे जाने वाले प्रश्न`,
    id: (t) => `Pertanyaan Umum tentang ${t}`,
    ms: (t) => `Soalan Lazim tentang ${t}`,
    th: (t) => `คำถามที่พบบ่อยเกี่ยวกับ ${t}`,
    vi: (t) => `Câu hỏi thường gặp về ${t}`,
    fil: (t) => `Mga Madalas Itanong Tungkol sa ${t}`,
    ja: (t) => `${t} に関するよくある質問`,
    ko: (t) => `${t} 자주 묻는 질문`,
    "zh-CN": (t) => `关于 ${t} 的常见问题`,
    "zh-TW": (t) => `關於 ${t} 的常見問題`,
  };

  const FAQ_BADGES: Record<string, string> = {
    sv: "VANLIGA FRÅGOR",
    da: "OFTE STILLEDE SPØRGSMÅL",
    fi: "USEIN KYSYTTYÄ",
    no: "OFTE STILTE SPØRSMÅL",
    nl: "VEELGESTELDE VRAGEN",
    pl: "CZĘSTO ZADAWANE PYTANIA",
    cs: "ČASTO KLADENÉ OTÁZKY",
    hu: "GYAKORI KÉRDÉSEK",
    ro: "ÎNTREBĂRI FRECVENTE",
    bg: "ЧЕСТО ЗАДАВАНИ ВЪПРОСИ",
    el: "ΣΥΧΝΕΣ ΕΡΩΤΗΣΕΙΣ",
    sk: "ČASTO KLADENÉ OTÁZKY",
    sl: "POGOSTA VPRAŠANJA",
    ru: "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ",
    uk: "ЧАСТІ ЗАПИТАННЯ",
    lv: "BIEŽĀK UZDOTIE JAUTĀJUMI",
    lt: "DUK",
    ar: "الأسئلة الشائعة",
    he: "שאלות נפוצות",
    tr: "SIKÇA SORULAN SORULAR",
    pt: "PERGUNTAS FREQUENTES",
    "pt-BR": "PERGUNTAS FREQUENTES",
    es: "PREGUNTAS FRECUENTES",
    "es-419": "PREGUNTAS FRECUENTES",
    de: "HÄUFIG GESTELLTE FRAGEN",
    fr: "QUESTIONS FRÉQUENTES",
    it: "DOMANDE FREQUENTI",
    ca: "PREGUNTES FREQÜENTS",
    hi: "अक्सर पूछे जाने वाले प्रश्न",
    id: "PERTANYAAN UMUM",
    ms: "SOALAN LAZIM",
    th: "คำถามที่พบบ่อย",
    vi: "CÂU HỎI THƯỜNG GẶP",
    fil: "MGA MADALAS ITANONG",
    ja: "よくある質問",
    ko: "자주 묻는 질문",
    "zh-CN": "常见问题",
    "zh-TW": "常見問題",
  };

  const getHeading = () => {
    const fn = FAQ_HEADINGS[language];
    if (fn) return fn(cleanTitle);
    return `Frequently Asked Questions About ${cleanTitle}`;
  };

  const getBadge = () => {
    return FAQ_BADGES[language] || "FREQUENTLY ASKED QUESTIONS";
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className="w-full max-w-5xl mx-auto my-12 p-6 sm:p-10 bg-white border border-slate-200/90 rounded-3xl shadow-xl space-y-8"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-full inline-block mb-1">
          {getBadge()}
        </span>
        <h2 id="faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {getHeading()}
        </h2>
      </div>

      <div className="space-y-4 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-[#f8faf9] ${
                isOpen
                  ? 'border-blue-300 shadow-md ring-2 ring-blue-50/80 bg-white'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
              }`}
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base font-sans hover:text-blue-700 focus:outline-none transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100/80 border border-blue-200/80 text-blue-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    Q
                  </span>
                  <span className="font-sans font-bold" itemProp="name">{faq.question}</span>
                </span>

                <span
                  className={`w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-blue-700 border-blue-200 bg-blue-50' : ''
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>

              {isOpen && (
                <div
                  className="px-6 py-5 bg-white border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <p itemProp="text">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
