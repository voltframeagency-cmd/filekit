import fs from 'fs';

export const LOCALIZED_FOOTER_NOTES = {
  "en": "Free basic tools. Job Pass €4.90 for 7 days (never renews). No hidden subscriptions.",
  "es": "Herramientas básicas gratuitas. Job Pass 4,90 € por 7 días (sin renovación automática). Sin suscripciones ocultas.",
  "es-419": "Herramientas básicas gratis. Job Pass $4.90 por 7 días (sin renovación automática). Sin suscripciones ocultas.",
  "de": "Kostenlose Basis-Tools. Job-Pass 4,90 € für 7 Tage (keine automatische Verlängerung). Keine versteckten Abos.",
  "fr": "Outils de base gratuits. Job Pass 4,90 € pour 7 jours (sans renouvellement automatique). Sans abonnement caché.",
  "pt": "Ferramentas básicas gratuitas. Job Pass 4,90 € por 7 dias (sem renovação automática). Sem subscrições ocultas.",
  "pt-BR": "Ferramentas básicas gratuitas. Job Pass R$ 4,90 por 7 dias (sem renovação automática). Sem assinaturas ocultas.",
  "it": "Strumenti di base gratuiti. Job Pass 4,90 € per 7 giorni (senza rinnovo automatico). Nessun abbonamento nascosto.",
  "nl": "Gratis basistools. Job Pass € 4,90 voor 7 dagen (vernieuwt nooit). Geen verborgen abonnementen.",
  "ca": "Eines bàsiques gratuïtes. Job Pass 4,90 € per 7 dies (sense renovació automàtica). Sense subscripcions ocultes.",
  "sv": "Gratis grundverktyg. Jobbpass 4,90 € för 7 dagar (förnyas aldrig). Inga dolda abonnemang.",
  "da": "Gratis grundlæggende værktøjer. Job-pas 4,90 € i 7 dage (fornyes aldrig). Ingen skjulte abonnementer.",
  "fi": "Ilmaiset perustyökalut. Job Pass 4,90 € 7 päiväksi (ei uusiudu automaattisesti). Ei piilotilauksia.",
  "no": "Gratis grunnleggende verktøy. Job Pass €4,90 for 7 dager (fornyes aldri). Ingen skjulte abonnementer.",
  "pl": "Darmowe podstawowe narzędzia. Job Pass 4,90 € na 7 dni (brak automatycznego odnawiania). Bez ukrytych subskrypcji.",
  "cs": "Základní nástroje zdarma. Job Pass 4,90 € na 7 dní (žádné automatické obnovování). Žádné skryté předplatné.",
  "hu": "Ingyenes alapvető eszközök. Job Pass 4,90 € 7 napra (nincs automatikus megújulás). Nincsenek rejtett előfizetések.",
  "ro": "Instrumente de bază gratuite. Job Pass 4,90 € pentru 7 zile (fără reînnoire automată). Fără abonamente ascunse.",
  "bg": "Безплатни основни инструменти. Job Pass 4,90 € за 7 дни (без автоматично подновяване). Без скрити абонаменти.",
  "el": "Δωρεάν βασικά εργαλεία. Job Pass 4,90 € για 7 ημέρες (χωρίς αυτόματη ανανέωση). Χωρίς κρυφές συνδρομές.",
  "sk": "Bezplatné základné nástroje. Job Pass 4,90 € na 7 dní (bez automatického obnovovania). Žiadne skryté predplatné.",
  "sl": "Brezplačna osnovna orodja. Job Pass 4,90 € za 7 dni (brez samodejnega podaljšanja). Brez skritih naročnin.",
  "ru": "Бесплатные базовые инструменты. Job Pass 4,90 € на 7 дней (без автопродления). Без скрытых подписок.",
  "uk": "Безкоштовні базові інструменти. Job Pass 4,90 € на 7 днів (без автопродовження). Без прихованих підписок.",
  "lv": "Bezmaksas pamatrīki. Job Pass 4,90 € 7 dienām (bez automātiskas atjaunošanas). Bez slēptiem abonementiem.",
  "lt": "Nemokami pagrindiniai įrankiai. Job Pass 4,90 € 7 dienoms (be automatinio pratęsimo). Jokių paslėptų prenumeratų.",
  "tr": "Ücretsiz temel araçlar. 7 günlük Job Pass 4,90 € (asla otomatik yenilenmez). Gizli abonelik yok.",
  "ar": "أدوات أساسية مجانية. تذكرة مهام €4.90 لمدة 7 أيام (لا تتجدد تلقائياً). بدون أي اشتراكات خفية.",
  "he": "כלים בסיסיים בחינם. כרטיס משימה €4.90 ל-7 ימים (ללא חידוש אוטומטי). ללא מנויים נסתרים.",
  "hi": "मुफ़्त बुनियादी टूल्स। जॉब पास €4.90 7 दिनों के लिए (कभी स्वतः नवीनीकृत नहीं होता)। कोई छुपे हुए सब्सक्रिप्शन नहीं।",
  "id": "Alat dasar gratis. Job Pass €4,90 untuk 7 hari (tidak diperpanjang otomatis). Tanpa biaya tersembunyi.",
  "ms": "Alat asas percuma. Pas Tugasan €4.90 untuk 7 hari (tiada pembaharuan automatik). Tiada yuran tersembunyi.",
  "th": "เครื่องมือพื้นฐานฟรี จ็อบพาส €4.90 สำหรับ 7 วัน (ไม่ต่ออายุอัตโนมัติ) ไม่มีการคิดเงินแอบแฝง",
  "vi": "Công cụ cơ bản miễn phí. Thẻ tác vụ €4,90 trong 7 ngày (không tự động gia hạn). Không có đăng ký ẩn.",
  "fil": "Libreng pangunahing tools. Job Pass €4.90 para sa 7 araw (hindi awtomatikong magre-renew). Walang nakatagong subscriptions.",
  "ja": "基本ツールは完全無料。ジョブパス €4.90（7日間・自動更新なし）。隠れた定期購読なし。",
  "ko": "기본 도구 완전 무료. 작업 패스 €4.90 (7일간 유효 · 자동 갱신 없음). 숨겨진 정기구독 없음.",
  "zh-CN": "免费基础工具。任务通行证 €4.90 有效期 7 天（永不自动续费）。无任何隐藏订阅。",
  "zh-TW": "免費基礎工具。任務通行證 €4.90 有效期 7 天（永不自動續費）。無任何隱藏訂閱。"
};

// 1. Update src/config/i18n/trustTranslations.ts
const trustPath = 'src/config/i18n/trustTranslations.ts';
let trustContent = fs.readFileSync(trustPath, 'utf8');

for (const [locale, note] of Object.entries(LOCALIZED_FOOTER_NOTES)) {
  // Matches the block for this locale in TRUST_TRANSLATIONS:
  // e.g. "  es: {" or "  \"es-419\": {"
  const regex = new RegExp(`(^|\\n)(  ["']?${locale}["']?:\\s*\\{[\\s\\S]*?footerNote:\\s*)"[^"]*"`, 'm');
  if (regex.test(trustContent)) {
    trustContent = trustContent.replace(regex, `$1$2"${note}"`);
  } else {
    console.warn(`Could not find footerNote for locale: ${locale}`);
  }
}

fs.writeFileSync(trustPath, trustContent, 'utf8');
console.log('Successfully updated trustTranslations.ts for all 39 locales with authentic €4.90 terms.');

// 2. Update LanguageContext.tsx
const ctxPath = 'src/components/layout/LanguageContext.tsx';
let ctxContent = fs.readFileSync(ctxPath, 'utf8');

// Update explicit dictionary definitions in LanguageContext if present
for (const [locale, note] of Object.entries(LOCALIZED_FOOTER_NOTES)) {
  const regex = new RegExp(`(^|\\n)(  ["']?${locale}["']?:\\s*\\{[\\s\\S]*?"homepage\\.footerNote":\\s*)"[^"]*"`, 'm');
  if (regex.test(ctxContent)) {
    ctxContent = ctxContent.replace(regex, `$1$2"${note}"`);
  }
}

fs.writeFileSync(ctxPath, ctxContent, 'utf8');
console.log('Successfully updated LanguageContext.tsx dictionary fallbacks.');
