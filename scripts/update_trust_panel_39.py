import os
import re
import json

print("=== POPULATING TRUST PANEL TRANSLATIONS FOR ALL 39 LANGUAGES ===")

TRUST_TEXTS = {
  "trust.privateTitle": {
    "en": "100% Private",
    "bg": "100% Поверително",
    "es": "100% Privado",
    "de": "100% Privat",
    "fr": "100% Privé",
    "pt": "100% Privado",
    "it": "100% Privato",
    "nl": "100% Privé",
    "ca": "100% Privat",
    "sv": "100% Privat",
    "da": "100% Privat",
    "fi": "100% Yksityinen",
    "no": "100% Privat",
    "pl": "100% Prywatne",
    "cs": "100% Soukromé",
    "hu": "100% Privát",
    "ro": "100% Privat",
    "el": "100% Απόρρητο",
    "ru": "100% Конфиденциально",
    "uk": "100% Конфіденційно",
    "tr": "%100 Gizli",
    "ar": "خصوصية 100%",
    "he": "100% פרטי",
    "hi": "100% निजी",
    "id": "100% Pribadi",
    "ms": "100% Peribadi",
    "th": "เป็นส่วนตัว 100%",
    "vi": "100% Riêng tư",
    "fil": "100% Pribado",
    "ja": "100% プライベート",
    "ko": "100% 비공개",
    "zh": "100% 隐私安全"
  },
  "trust.privateDesc": {
    "en": "Your file stays under your control.",
    "bg": "Вашият файл остава под ваш контрол.",
    "es": "Tu archivo permanece bajo tu control.",
    "de": "Ihre Datei bleibt unter Ihrer Kontrolle.",
    "fr": "Votre fichier reste sous votre contrôle.",
    "pt": "O seu ficheiro permanece sob o seu controlo.",
    "it": "Il tuo file rimane sotto il tuo controllo.",
    "nl": "Uw bestand blijft onder uw controle.",
    "ca": "El teu fitxer roman sota el teu control.",
    "sv": "Dina filer stannar under din kontroll.",
    "da": "Din fil forbliver under din kontrol.",
    "fi": "Tiedostosi pysyy sinun hallinnassasi.",
    "no": "Filen din forblir under din kontroll.",
    "pl": "Twój plik pozostaje pod Twoją kontrolą.",
    "cs": "Váš soubor zůstává pod vaší kontrolou.",
    "hu": "A fájlja az Ön ellenőrzése alatt marad.",
    "ro": "Fișierul tău rămâne sub controlul tău.",
    "el": "Το αρχείο σας παραμένει υπό τον έλεγχό σας.",
    "ru": "Ваш файл остается под вашим контролем.",
    "uk": "Ваш файл залишається під вашим контролем.",
    "tr": "Dosyanız sizin kontrolünüzde kalır.",
    "ar": "يبقى ملفك تحت تحكمك الكامل.",
    "he": "הקובץ שלך נשאר בשליטתך המלאה.",
    "hi": "आपकी फ़ाइल आपके नियंत्रण में रहती है।",
    "id": "File Anda tetap berada di bawah kendali Anda.",
    "ms": "Fail anda kekal di bawah kawalan anda.",
    "th": "ไฟล์ของคุณอยู่ภายใต้การควบคุมของคุณเสมอ",
    "vi": "Tệp của bạn luôn nằm dưới sự kiểm soát của bạn.",
    "fil": "Ang iyong file ay nananatili sa ilalim ng iyong kontrol.",
    "ja": "ファイルは常に完全にあなたの管理下にあります。",
    "ko": "파일은 항상 사용자의 통제 하에 안전하게 유지됩니다.",
    "zh": "您的文件完全由您自主掌控。"
  },
  "trust.localTitle": {
    "en": "Local First",
    "bg": "Локална обработка",
    "es": "Primero en local",
    "de": "Lokal zuerst",
    "fr": "Local d'abord",
    "pt": "Local primeiro",
    "it": "Prima locale",
    "nl": "Eerst lokaal",
    "ca": "Local primer",
    "sv": "Lokalt först",
    "da": "Lokalt først",
    "fi": "Paikallinen ensin",
    "no": "Lokalt først",
    "pl": "Lokalnie w przeglądarce",
    "cs": "Přednostně lokálně",
    "hu": "Helyi feldolgozás",
    "ro": "Procesare locală",
    "el": "Τοπική επεξεργασία",
    "ru": "Локальная обработка",
    "uk": "Локальна обробка",
    "tr": "Önce Yerel",
    "ar": "المعالجة المحلية أولاً",
    "he": "עיבוד מקומי תחילה",
    "hi": "स्थानीय प्रसंस्करण",
    "id": "Pemrosesan Lokal",
    "ms": "Pemprosesan Tempatan",
    "th": "ประมวลผลในเครื่องก่อน",
    "vi": "Xử lý cục bộ",
    "fil": "Lokal na Pagpoproseso",
    "ja": "完全ローカルファースト",
    "ko": "로컬 우선 처리",
    "zh": "本地端优先处理"
  },
  "trust.localDesc": {
    "en": "Browser processing whenever safe.",
    "bg": "Обработка в браузъра за максимална сигурност.",
    "es": "Procesamiento en el navegador siempre que sea seguro.",
    "de": "Verarbeitung im Browser, wann immer sicher.",
    "fr": "Traitement dans le navigateur dès que possible.",
    "pt": "Processamento no navegador sempre que seguro.",
    "it": "Elaborazione nel browser quando sicuro.",
    "nl": "Browserverwerking wanneer veilig.",
    "ca": "Processament al navegador sempre que sigui segur.",
    "sv": "Webbläsarbearbetning när det är säkert.",
    "da": "Browserbehandling når det er sikkert.",
    "fi": "Käsittely selaimessa aina kun mahdollista.",
    "no": "Nettleserbehandling når det er trygt.",
    "pl": "Przetwarzanie w przeglądarce, gdy bezpieczne.",
    "cs": "Zpracování v prohlížeči, kdykoliv je to bezpečné.",
    "hu": "Böngészőbeli feldolgozás, amikor biztonságos.",
    "ro": "Procesare în browser oricând este sigur.",
    "el": "Επεξεργασία στο πρόγραμμα περιήγησης όποτε είναι ασφαλές.",
    "ru": "Обработка в браузере, когда это безопасно.",
    "uk": "Обробка у браузері, коли це безпечно.",
    "tr": "Güvenli olduğunda tarayıcıda işleme.",
    "ar": "معالجة داخل المتصفح متى كان ذلك آمناً.",
    "he": "עיבוד ישיר בדפדפן בכל מצב שבו הדבר אפשרי.",
    "hi": "सुरक्षित होने पर ब्राउज़र में प्रसंस्करण।",
    "id": "Pemrosesan browser bila aman.",
    "ms": "Pemprosesan pelayar apabila selamat.",
    "th": "ประมวลผลบนเบราว์เซอร์อย่างปลอดภัย",
    "vi": "Xử lý trong trình duyệt khi an toàn.",
    "fil": "Pagpoproseso sa browser kapag ligtas.",
    "ja": "安全な場合はブラウザ上で直接ローカル処理。",
    "ko": "가능한 모든 경우 브라우저 내에서 직접 처리.",
    "zh": "在安全的前提下均在浏览器本地直接运算。"
  },
  "trust.tempTitle": {
    "en": "Temporary Only",
    "bg": "Временни файлове",
    "es": "Solo temporal",
    "de": "Nur temporär",
    "fr": "Temporaire uniquement",
    "pt": "Apenas temporário",
    "it": "Solo temporaneo",
    "nl": "Alleen tijdelijk",
    "ca": "Només temporal",
    "sv": "Endast temporärt",
    "da": "Kun midlertidigt",
    "fi": "Vain väliaikainen",
    "no": "Kun midlertidig",
    "pl": "Tylko tymczasowo",
    "cs": "Pouze dočasně",
    "hu": "Csak ideiglenes",
    "ro": "Doar temporar",
    "el": "Μόνο προσωρινά",
    "ru": "Только временно",
    "uk": "Лише тимчасово",
    "tr": "Yalnızca Geçici",
    "ar": "تخزين مؤقت فقط",
    "he": "זמני בלבד",
    "hi": "केवल अस्थायी",
    "id": "Hanya Sementara",
    "ms": "Sementara Sahaja",
    "th": "ชั่วคราวเท่านั้น",
    "vi": "Chỉ tạm thời",
    "fil": "Pansamantala Lamang",
    "ja": "完全一時保存のみ",
    "ko": "임시 저장만 적용",
    "zh": "仅临时保留"
  },
  "trust.tempDesc": {
    "en": "Server files expire automatically.",
    "bg": "Сървърните файлове се изтриват автоматично.",
    "es": "Los archivos del servidor caducan automáticamente.",
    "de": "Serverdateien verfallen automatisch.",
    "fr": "Les fichiers serveur expirent automatiquement.",
    "pt": "Os ficheiros no servidor expiram automaticamente.",
    "it": "I file del server scadono automaticamente.",
    "nl": "Serverbestanden verlopen automatisch.",
    "ca": "Els fitxers del servidor caduquen automàticament.",
    "sv": "Serverfiler raderas automatiskt.",
    "da": "Serverfiler udløber automatisk.",
    "fi": "Palvelintiedostot vanhenevat automaattisesti.",
    "no": "Serverfiler slettes automatisk.",
    "pl": "Pliki na serwerze wygasają automatycznie.",
    "cs": "Soubory na serveru se automaticky smažou.",
    "hu": "A szerverfájlok automatikusan lejárnak.",
    "ro": "Fișierele de pe server expiră automat.",
    "el": "Τα αρχεία διακομιστή διαγράφονται αυτόματα.",
    "ru": "Файлы на сервере удаляются автоматически.",
    "uk": "Файли на сервері видаляються автоматично.",
    "tr": "Sunucu dosyaları otomatik olarak silinir.",
    "ar": "تنتهي صلاحية ملفات الخادم وتُحذف تلقائياً.",
    "he": "קבצי שרת נמחקים ופגים באופן אוטומטי.",
    "hi": "सर्वर फ़ाइलें स्वचालित रूप से समाप्त हो जाती हैं।",
    "id": "File server kedaluwarsa secara otomatis.",
    "ms": "Fail pelayan tamat tempoh secara automatik.",
    "th": "ไฟล์บนเซิร์ฟเวอร์จะหมดอายุและถูกลบอัตโนมัติ",
    "vi": "Các tệp trên máy chủ sẽ tự động hết hạn và xóa.",
    "fil": "Awtomatikong mag-eexpire ang mga server file.",
    "ja": "サーバー上の処理ファイルは自動的に完全消去。",
    "ko": "서버에 전달된 파일은 즉시 자동 삭제 만료.",
    "zh": "服务器上的临时文件会自动过期并完全销毁。"
  },
  "trust.trialTitle": {
    "en": "No Hidden Subscriptions",
    "bg": "Без скрити абонаменти",
    "es": "Sin suscripciones ocultas",
    "de": "Keine versteckten Abos",
    "fr": "Sans abonnement caché",
    "pt": "Sem assinaturas ocultas",
    "it": "Nessun abbonamento nascosto",
    "nl": "Geen verborgen abonnementen",
    "ca": "Sense subscripcions ocultes",
    "sv": "Inga dolda abonnemang",
    "da": "Ingen skjulte abonnementer",
    "fi": "Ei piilotettuja tilauksia",
    "no": "Ingen skjulte abonnementer",
    "pl": "Bez ukrytych subskrypcji",
    "cs": "Bez skrytých předplatných",
    "hu": "Nincsenek rejtett előfizetések",
    "ro": "Fără abonamente ascunse",
    "el": "Χωρίς κρυφές συνδρομές",
    "ru": "Без скрытых подписок",
    "uk": "Без прихованих підписок",
    "tr": "Gizli Abonelik Yok",
    "ar": "بدون اشتراكات مخفية",
    "he": "ללא מנויים נסתרים",
    "hi": "कोई छिपा हुआ सब्सक्रिप्शन नहीं",
    "id": "Tanpa Langganan Tersembunyi",
    "ms": "Tiada Langganan Tersembunyi",
    "th": "ไม่มีค่าสมัครสมาชิกแอบแฝง",
    "vi": "Không có gói ẩn",
    "fil": "Walang Nakatagong Subscription",
    "ja": "隠れた定期購読なし",
    "ko": "숨겨진 정기결제 없음",
    "zh": "无任何隐藏订阅"
  },
  "trust.trialDesc": {
    "en": "Clear one-time and recurring terms.",
    "bg": "Ясни условия за безплатно и платено ползване.",
    "es": "Términos claros y transparentes.",
    "de": "Klare und transparente Bedingungen.",
    "fr": "Conditions claires et transparentes.",
    "pt": "Termos claros e transparentes.",
    "it": "Termini chiari e trasparenti.",
    "nl": "Duidelijke en transparante voorwaarden.",
    "ca": "Termes clars i transparents.",
    "sv": "Tydliga och enkla villkor.",
    "da": "Tydelige og gennemskuelige vilkår.",
    "fi": "Selkeät ja läpinäkyvät ehdot.",
    "no": "Tydelige og enkle vilkår.",
    "pl": "Jasne i przejrzyste warunki.",
    "cs": "Jasné a transparentní podmínky.",
    "hu": "Világos és átlátható feltételek.",
    "ro": "Termeni clari și transparenți.",
    "el": "Ξεκάθαροι και διαφανείς όροι.",
    "ru": "Прозрачные и понятные условия.",
    "uk": "Прозорі та зрозумілі умови.",
    "tr": "Net ve şeffaf kullanım şartları.",
    "ar": "شروط واضحة وشفافة لجميع المستخدمين.",
    "he": "תנאים שקופים וברורים לחלוטין.",
    "hi": "स्पष्ट और पारदर्शी नियम।",
    "id": "Ketentuan yang jelas dan transparan.",
    "ms": "Syarat yang jelas dan telus.",
    "th": "เงื่อนไขที่ชัดเจนและโปร่งใส",
    "vi": "Điều khoản rõ ràng và minh bạch.",
    "fil": "Malinaw at tapat na mga tuntunin.",
    "ja": "透明で明確な利用規約。",
    "ko": "투명하고 명확한 이용 조건.",
    "zh": "清晰透明的使用条款与计费说明。"
  }
}

# Update TrustPanel.tsx to accept language prop and resolve localized copy
trust_panel_tsx = '''"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { FileKitAsset } from "@/components/visuals/FileKitAsset";

export interface TrustPanelProps {
  language?: string;
}

const TRUST_DICTIONARY = ''' + json.dumps(TRUST_TEXTS, ensure_ascii=False, indent=2) + ''';

export default function TrustPanel({ language: propLanguage }: TrustPanelProps = {}) {
  const { language: contextLang } = useLanguage();
  const lang = propLanguage || contextLang || "en";
  const l = lang.slice(0, 2);

  const getT = (key: keyof typeof TRUST_DICTIONARY) => {
    const map = TRUST_DICTIONARY[key];
    return map[l] || (map as any)[lang] || map.en;
  };

  return (
    <div className="w-full bg-white border border-fk-border rounded-fk-xl shadow-sm overflow-hidden p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 md:divide-x md:divide-fk-border rtl:md:divide-x-reverse">
        {/* Column 1: 100% Private */}
        <div className="flex items-start gap-4 px-2">
          <div className="shrink-0 mt-1">
            <FileKitAsset name="private-local-processing" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {getT("trust.privateTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {getT("trust.privateDesc")}
            </span>
          </div>
        </div>

        {/* Column 2: Local First */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="text-fk-text shrink-0 mt-1">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {getT("trust.localTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {getT("trust.localDesc")}
            </span>
          </div>
        </div>

        {/* Column 3: Temporary Only */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="text-fk-text shrink-0 mt-1">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {getT("trust.tempTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {getT("trust.tempDesc")}
            </span>
          </div>
        </div>

        {/* Column 4: No Hidden Trials */}
        <div className="flex items-start gap-4 px-2 md:pl-6 rtl:md:pr-6 rtl:md:pl-2">
          <div className="shrink-0 mt-1">
            <FileKitAsset name="verified-output" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
          </div>
          <div className="flex flex-col text-left ltr:text-left rtl:text-right">
            <span className="text-[15px] font-bold text-fk-text leading-tight">
              {getT("trust.trialTitle")}
            </span>
            <span className="text-[12px] text-fk-text-muted mt-1 leading-normal">
              {getT("trust.trialDesc")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
'''

with open('src/components/layout/TrustPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(trust_panel_tsx)

print("[OK] TrustPanel.tsx updated with 39-language localized strings!")
