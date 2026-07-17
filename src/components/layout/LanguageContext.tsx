"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar" | "tr";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.allTools": "All Tools",
    "nav.compress": "Compress",
    "nav.convert": "Convert",
    "nav.merge": "Merge",
    "nav.image": "Image",
    "nav.organize": "Organize",
    "nav.searchPlaceholder": "Search tools...",
    "nav.allToolsBtn": "All tools",
    
    "hero.title1": "Fix the file.",
    "hero.title2": "Finish the upload.",
    "hero.subtitle1": "18 precise file tools for compression, conversion,",
    "hero.subtitle2": "merging, resizing and organization. No account required.",
    
    "homepage.searchPlaceholder": "Find the right tool for your task...",
    "homepage.privateTitle": "Private by design",
    "homepage.privateDesc": "Files stay with you",
    "homepage.localTitle": "Processed locally",
    "homepage.localDesc": "Whenever possible",
    "homepage.fallbackTitle": "Secure fallback",
    "homepage.fallbackDesc": "TLS-protected transfer",
    "homepage.dropAnywhere": "Drop a file anywhere",
    "homepage.chooseFile": "Choose File",
    "homepage.orChoose": "or choose a file from your device",
    "homepage.methodShown": "Your processing method is shown before anything starts.",
    "homepage.popularTools": "Popular tools",
    "homepage.browseAll": "Browse all tools →",
    "homepage.footerNote": "Free basic tools. Premium exports from €4.99. No hidden trials.",
    
    "tool.compress.desc": "Make PDFs smaller",
    "tool.merge.title": "Merge PDF",
    "tool.merge.desc": "Combine PDF files",
    "tool.resize.title": "Resize Image",
    "tool.resize.desc": "Exact pixels or KB",
    "tool.convert.title": "Image Converter",
    "tool.convert.desc": "JPG, PNG, WEBP",
    "tool.pdfToWord.title": "PDF to Word",
    "tool.pdfToWord.desc": "Editable DOCX output",
    "tool.allTools.title": "All 18 Tools",
    "tool.allTools.desc": "Explore the full suite",

    "breadcrumb.home": "Home",
    "breadcrumb.compress": "Compress PDF",
    "compress.title": "Compress PDF below 2 MB",
    "compress.subtitle": "Make your PDF smaller while preserving the best achievable quality.",
    
    "badge.local": "Processed on this device",
    "workspace.dropHere": "Drop your PDF here",
    "workspace.pdfOnly": "PDF only · Routing is based on file complexity and device capability",
    "workspace.stayOnDevice": "Your PDF stays on this device whenever local processing is safe.",
    "workspace.askBeforeTransfer": "FileKit will ask before any temporary server transfer.",
    
    "trust.privateTitle": "100% Private",
    "trust.privateDesc1": "Your file stays under your",
    "trust.privateDesc2": "control.",
    "trust.localTitle": "Local First",
    "trust.localDesc1": "Browser processing whenever",
    "trust.localDesc2": "safe.",
    "trust.tempTitle": "Temporary Only",
    "trust.tempDesc1": "Server files expire",
    "trust.tempDesc2": "automatically.",
    "trust.trialTitle": "No Hidden Trials",
    "trust.trialDesc1": "Clear one-time and recurring",
    "trust.trialDesc2": "terms.",
    
    "workspace.troubleText": "Having trouble? Secure temporary processing is available only with your consent.",
    "workspace.targetSize": "Target size",
    "workspace.recommended": "Under 2 MB (Recommended)",
    "workspace.qualityNote": "We will reduce file size while maintaining the best possible quality.",
    "workspace.compressBtn": "Compress PDF",
    "workspace.localReady": "Local processing is ready.",
    "workspace.notLeftDevice": "Your file has not left this device.",
    "workspace.remove": "Remove",
    
    "paywall.title": "Unlock Download",
    "paywall.subtitle": "This file has been compressed. Choose a plan to unlock the download.",
    "paywall.resultVerified": "Result Verified",
    "paywall.fileLabel": "Document Name",
    "paywall.originalLabel": "Original Size",
    "paywall.outputLabel": "New Size",
    "paywall.changeLabel": "Size Change",
    "paywall.pagesLabel": "Pages",
    "paywall.locationLabel": "Processing Location",
    "paywall.localLocation": "Local (On device)",
    "paywall.serverLocation": "Server (Cloud)",
    "paywall.tlsGuarantee": "Encrypted in transit using TLS",
    "paywall.single.title": "Single Premium Export",
    "paywall.single.billing": "Does not renew",
    "paywall.single.tagline": "One file. One payment. No subscription.",
    "paywall.pass.title": "24-Hour Pass",
    "paywall.pass.billing": "Does not renew",
    "paywall.pass.tagline": "Includes 10 server credits.",
    "paywall.pass.badge": "Best value",
    "paywall.pro.title": "Pro Monthly",
    "paywall.pro.billing": "Renews monthly",
    "paywall.pro.tagline": "Cancel before next billing date.",
    "paywall.ctaUnlock": "Unlock Download",
    "paywall.ctaSelect": "Select a Plan to Unlock",
    "paywall.pending": "Creating secure checkout...",
    "paywall.cancel": "Cancel and Reset",
    
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe"
  },
  ar: {
    "nav.allTools": "جميع الأدوات",
    "nav.compress": "ضغط",
    "nav.convert": "تحويل",
    "nav.merge": "دمج",
    "nav.image": "صور",
    "nav.organize": "تنظيم",
    "nav.searchPlaceholder": "ابحث عن الأدوات...",
    "nav.allToolsBtn": "كل الأدوات",
    
    "hero.title1": "أصلح الملف.",
    "hero.title2": "أكمل عملية الرفع.",
    "hero.subtitle1": "18 أداة دقيقة للملفات للضغط، التحويل،",
    "hero.subtitle2": "الدمج، تغيير الحجم والتنظيم. لا يلزم حساب.",
    
    "homepage.searchPlaceholder": "ابحث عن الأداة المناسبة لمهمتك...",
    "homepage.privateTitle": "خصوصية بطبيعتها",
    "homepage.privateDesc": "ملفاتك تبقى معك",
    "homepage.localTitle": "معالجة محليّة",
    "homepage.localDesc": "كلما كان ذلك ممكنًا",
    "homepage.fallbackTitle": "خيار احتياطي آمن",
    "homepage.fallbackDesc": "نقل محمي بـ TLS",
    "homepage.dropAnywhere": "اسحب الملف في أي مكان",
    "homepage.chooseFile": "اختر ملفاً",
    "homepage.orChoose": "أو اختر ملفاً من جهازك",
    "homepage.methodShown": "تظهر طريقة المعالجة قبل البدء في أي شيء.",
    "homepage.popularTools": "الأدوات الشائعة",
    "homepage.browseAll": "تصفح جميع الأدوات ←",
    "homepage.footerNote": "أدوات أساسية مجانية. صادرات مميزة تبدأ من 4.99 يورو. لا تجارب مخفية.",
    
    "tool.compress.desc": "تصغير حجم ملفات PDF",
    "tool.merge.title": "دمج PDF",
    "tool.merge.desc": "دمج ملفات PDF المتعددة",
    "tool.resize.title": "تغيير الحجم",
    "tool.resize.desc": "بكسل أو كيلوبايت محدد",
    "tool.convert.title": "تحويل الصور",
    "tool.convert.desc": "JPG, PNG, WEBP",
    "tool.pdfToWord.title": "PDF إلى Word",
    "tool.pdfToWord.desc": "ملف DOCX قابل للتعديل",
    "tool.allTools.title": "جميع الأدوات الـ 18",
    "tool.allTools.desc": "استكشف المجموعة الكاملة",

    "breadcrumb.home": "الرئيسية",
    "breadcrumb.compress": "ضغط PDF",
    "compress.title": "ضغط PDF لأقل من 2 ميجابايت",
    "compress.subtitle": "قلل حجم ملف PDF مع الحفاظ على أفضل جودة ممكنة.",
    
    "badge.local": "معالج على هذا الجهاز",
    "workspace.dropHere": "اسحب ملف PDF هنا",
    "workspace.pdfOnly": "PDF فقط · يعتمد التوجيه على تعقيد الملف وقدرة الجهاز",
    "workspace.stayOnDevice": "يظل ملف PDF الخاص بك على هذا الجهاز طالما كانت المعالجة المحلية آمنة.",
    "workspace.askBeforeTransfer": "سيطلب FileKit الإذن قبل أي نقل مؤقت للخادم.",
    
    "trust.privateTitle": "خصوصية 100%",
    "trust.privateDesc1": "يبقى ملفك تحت كامل",
    "trust.privateDesc2": "سيطرتك.",
    "trust.localTitle": "محلي أولاً",
    "trust.localDesc1": "معالجة المتصفح كلما كانت",
    "trust.localDesc2": "آمنة.",
    "trust.tempTitle": "مؤقت فقط",
    "trust.tempDesc1": "تنتهي صلاحية ملفات الخادم",
    "trust.tempDesc2": "تلقائيًا.",
    "trust.trialTitle": "بدون تجارب مخفية",
    "trust.trialDesc1": "شروط دفع واضحة لمرة واحدة",
    "trust.trialDesc2": "أو متكررة.",
    
    "workspace.troubleText": "تواجه مشكلة؟ المعالجة المؤقتة الآمنة للخادم متاحة فقط بموافقتك.",
    "workspace.targetSize": "الحجم المستهدف",
    "workspace.recommended": "أقل من 2 ميجابايت (موصى به)",
    "workspace.qualityNote": "سنقوم بتقليل حجم الملف مع الحفاظ على أفضل جودة ممكنة.",
    "workspace.compressBtn": "ضغط PDF",
    "workspace.localReady": "المعالجة المحلية جاهزة.",
    "workspace.notLeftDevice": "لم يغادر ملفك هذا الجهاز.",
    "workspace.remove": "إزالة",
    
    "paywall.title": "فتح التحميل",
    "paywall.subtitle": "تم ضغط هذا الملف. اختر خطة لفتح تحميل الملف.",
    "paywall.resultVerified": "تم التحقق من النتيجة",
    "paywall.fileLabel": "اسم المستند",
    "paywall.originalLabel": "الحجم الأصلي",
    "paywall.outputLabel": "الحجم الجديد",
    "paywall.changeLabel": "تغير الحجم",
    "paywall.pagesLabel": "الصفحات",
    "paywall.locationLabel": "موقع المعالجة",
    "paywall.localLocation": "محلي (على الجهاز)",
    "paywall.serverLocation": "خادم (سحابي)",
    "paywall.tlsGuarantee": "مشفر أثناء الانتقال باستخدام TLS",
    "paywall.single.title": "تصدير مميز لمرة واحدة",
    "paywall.single.billing": "لا يتجدد",
    "paywall.single.tagline": "ملف واحد. دفعة واحدة. بدون اشتراك.",
    "paywall.pass.title": "صلاحية 24 ساعة",
    "paywall.pass.billing": "لا تتجدد",
    "paywall.pass.tagline": "تتضمن 10 أرصدة للخادم.",
    "paywall.pass.badge": "أفضل قيمة",
    "paywall.pro.title": "برو شهري",
    "paywall.pro.billing": "يتجدد شهريًا",
    "paywall.pro.tagline": "إلغاء قبل تاريخ الفوترة القادم.",
    "paywall.ctaUnlock": "فتح التحميل",
    "paywall.ctaSelect": "اختر خطة لفتح التحميل",
    "paywall.pending": "جاري إنشاء الدفع الآمن...",
    "paywall.cancel": "إلغاء وإعادة تعيين",
    
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe"
  },
  tr: {
    "nav.allTools": "Tüm Araçlar",
    "nav.compress": "Sıkıştır",
    "nav.convert": "Dönüştür",
    "nav.merge": "Birleştir",
    "nav.image": "Görsel",
    "nav.organize": "Düzenle",
    "nav.searchPlaceholder": "Araçları ara...",
    "nav.allToolsBtn": "Tüm araçlar",
    
    "hero.title1": "Dosyayı düzelt.",
    "hero.title2": "Yüklemeyi tamamla.",
    "hero.subtitle1": "Sıkıştırma, dönüştürme, birleştirme, yeniden boyutlandırma",
    "hero.subtitle2": "ve düzenleme için 18 hassas araç. Hesap gerekmez.",
    
    "homepage.searchPlaceholder": "Göreviniz için doğru aracı bulun...",
    "homepage.privateTitle": "Tasarım gereği gizli",
    "homepage.privateDesc": "Dosyalar sizde kalır",
    "homepage.localTitle": "Yerel olarak işlenir",
    "homepage.localDesc": "Mümkün olduğunda",
    "homepage.fallbackTitle": "Güvenli geçiş",
    "homepage.fallbackDesc": "TLS korumalı aktarım",
    "homepage.dropAnywhere": "Dosyayı herhangi bir yere bırakın",
    "homepage.chooseFile": "Dosya Seç",
    "homepage.orChoose": "veya cihazınızdan bir dosya seçin",
    "homepage.methodShown": "İşleme yönteminiz başlamadan önce gösterilir.",
    "homepage.popularTools": "Popüler araçlar",
    "homepage.browseAll": "Tüm araçlara göz atın →",
    "homepage.footerNote": "Ücretsiz temel araçlar. Premium dışa aktarmalar 4,99 €'dan başlar. Gizli denemeler yoktur.",
    
    "tool.compress.desc": "PDF'leri küçültün",
    "tool.merge.title": "PDF Birleştir",
    "tool.merge.desc": "PDF dosyalarını birleştirin",
    "tool.resize.title": "Görsel Yeniden Boyutlandır",
    "tool.resize.desc": "Tam piksel veya KB",
    "tool.convert.title": "Görsel Dönüştürücü",
    "tool.convert.desc": "JPG, PNG, WEBP",
    "tool.pdfToWord.title": "PDF'ten Word'e",
    "tool.pdfToWord.desc": "Düzenlenebilir DOCX çıktısı",
    "tool.allTools.title": "Tüm 18 Araç",
    "tool.allTools.desc": "Tüm paketi keşfedin",

    "breadcrumb.home": "Ana Sayfa",
    "breadcrumb.compress": "PDF Sıkıştır",
    "compress.title": "PDF dosyasını 2 MB'ın altına sıkıştırın",
    "compress.subtitle": "PDF dosyanızı en iyi kalitede küçültün.",
    
    "badge.local": "Bu cihazda işlendi",
    "workspace.dropHere": "PDF'inizi buraya bırakın",
    "workspace.pdfOnly": "Yalnızca PDF · Yönlendirme dosya karmaşıklığına ve cihaz özelliklerine bağlıdır",
    "workspace.stayOnDevice": "Yerel işleme güvenli olduğunda PDF'iniz bu cihazda kalır.",
    "workspace.askBeforeTransfer": "FileKit geçici sunucu aktarımından önce izin isteyecektir.",
    
    "trust.privateTitle": "%100 Gizli",
    "trust.privateDesc1": "Dosyanız tamamen sizin",
    "trust.privateDesc2": "kontrolünüzde kalır.",
    "trust.localTitle": "Önce Yerel",
    "trust.localDesc1": "Güvenli olduğunda tarayıcıda",
    "trust.localDesc2": "işleme.",
    "trust.tempTitle": "Yalnızca Geçici",
    "trust.tempDesc1": "Sunucu dosyaları otomatik olarak",
    "trust.tempDesc2": "silinir.",
    "trust.trialTitle": "Gizli Deneme Yok",
    "trust.trialDesc1": "Net bir kerelik ve yenilenen",
    "trust.trialDesc2": "koşullar.",
    
    "workspace.troubleText": "Sorun mu yaşıyorsunuz? Güvenli geçici sunucu işlemi yalnızca onayınızla gerçekleştirilir.",
    "workspace.targetSize": "Hedef boyut",
    "workspace.recommended": "2 MB Altı (Önerilen)",
    "workspace.qualityNote": "En iyi kalitede dosya boyutunu düşüreceğiz.",
    "workspace.compressBtn": "PDF Sıkıştır",
    "workspace.localReady": "Yerel işlem hazır.",
    "workspace.notLeftDevice": "Dosyanız bu cihazdan ayrılmadı.",
    "workspace.remove": "Kaldır",
    
    "paywall.title": "İndirmeyi Aç",
    "paywall.subtitle": "Bu dosya sıkıştırıldı. İndirmeyi açmak için bir plan seçin.",
    "paywall.resultVerified": "Sonuç Doğrulandı",
    "paywall.fileLabel": "Belge Adı",
    "paywall.originalLabel": "Orijinal Boyut",
    "paywall.outputLabel": "Yeni Boyut",
    "paywall.changeLabel": "Boyut Değişimi",
    "paywall.pagesLabel": "Sayfa",
    "paywall.locationLabel": "İşlem Yeri",
    "paywall.localLocation": "Yerel (Cihazda)",
    "paywall.serverLocation": "Sunucu (Bulut)",
    "paywall.tlsGuarantee": "TLS ile aktarım sırasında şifrelenir",
    "paywall.single.title": "Tek Seferlik Premium Dışa Aktarım",
    "paywall.single.billing": "Yenilenmez",
    "paywall.single.tagline": "Tek dosya. Tek ödeme. Abonelik yok.",
    "paywall.pass.title": "24 Saatlik Geçiş",
    "paywall.pass.billing": "Yenilenmez",
    "paywall.pass.tagline": "10 sunucu kredisi içerir.",
    "paywall.pass.badge": "En iyi değer",
    "paywall.pro.title": "Aylık Pro",
    "paywall.pro.billing": "Aylık yenilenir",
    "paywall.pro.tagline": "Bir sonraki fatura tarihinden önce iptal edin.",
    "paywall.ctaUnlock": "İndirmeyi Aç",
    "paywall.ctaSelect": "Kilidi Açmak için Plan Seçin",
    "paywall.pending": "Güvenli ödeme oluşturuluyor...",
    "paywall.cancel": "İptal Et ve Sıfırla",
    
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [direction, setDirection] = useState<Direction>("ltr");

  useEffect(() => {
    // Check local storage or document attributes
    const savedLang = localStorage.getItem("fk-lang") as Language;
    if (savedLang && ["en", "ar", "tr"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("fk-lang", lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
