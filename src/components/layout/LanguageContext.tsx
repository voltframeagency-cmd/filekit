"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SupportedLocale, getLocaleDirection, isValidLocale, SUPPORTED_LOCALES } from "@/config/i18n/locales";
import { UI_TRANSLATIONS } from "@/config/i18n/translations";

export type Language = SupportedLocale;
export type Direction = "ltr" | "rtl";

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, overrideLocale?: Language) => string;
}

const translations: Partial<Record<Language, Record<string, string>>> = {
  en: {
    "nav.allTools": "All Tools",
    "nav.compress": "Compress",
    "nav.convert": "Convert",
    "nav.merge": "Merge",
    "nav.image": "Image",
    "nav.organize": "Organize",
    "nav.resize": "Resize",
    "nav.pricing": "Pricing",
    "nav.searchPlaceholder": "Search tools...",
    "nav.allToolsBtn": "All tools",
    
    "hero.tagline": "Files on your terms.",
    "hero.title1": "Turn files into",
    "hero.title2": "exactly what you need.",
    "hero.subtitle1": "Convert, compress, resize, organize, and repair PDFs, images, Office files, archives, audio, and video.",
    "hero.subtitle2": "Files stay in your browser when possible; server processing is temporary and files are deleted automatically.",
    
    "trust.badge1": "Browser-first processing",
    "trust.badge2": "Automatic deletion after server jobs",
    "trust.badge3": "No account for basic tools",
    "trust.badge4": "Verified results",
    
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
    "tool.split.title": "Split PDF",
    "tool.split.desc": "Separate PDF pages",
    "tool.rotate.title": "Rotate PDF",
    "tool.rotate.desc": "Rotate PDF pages",
    "tool.watermark.title": "Watermark PDF",
    "tool.watermark.desc": "Add text or logo",
    "tool.resize.title": "Resize Image",
    "tool.resize.desc": "Exact pixels or KB",
    "tool.convert.title": "Image Converter",
    "tool.convert.desc": "JPG, PNG, WEBP",
    "tool.pdfToWord.title": "PDF to Word",
    "tool.pdfToWord.desc": "Editable DOCX output",
    "tool.allTools.title": "All Tools",
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
    "paywall.cancel": "Back to Result",
    "paywall.viewDetails": "View verification details",
    "paywall.localTrust": "Processed privately on this device",
    "paywall.localTrustSub": "No file upload was required",
    "paywall.serverTrust": "Encrypted in transit using TLS",
    "paywall.serverTrustSub": "Processed in an isolated environment",
    "paywall.checkoutSecure": "Secure checkout uses encrypted connections",
    
    "lang.en": "English",
    "lang.es": "Español",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe"
  },
  es: {
    "nav.allTools": "Todas las herramientas",
    "nav.compress": "Comprimir",
    "nav.convert": "Convertir",
    "nav.merge": "Unir",
    "nav.image": "Imagen",
    "nav.organize": "Organizar",
    "nav.resize": "Redimensionar",
    "nav.pricing": "Precios",
    "nav.searchPlaceholder": "Buscar más de 100 herramientas...",
    "nav.allToolsBtn": "Todas las herramientas",
    
    "hero.tagline": "Archivos a tu manera.",
    "hero.title1": "Convierte archivos en",
    "hero.title2": "exactamente lo que necesitas.",
    "hero.subtitle1": "Convierte, comprime, redimensiona, organiza y repara PDFs, imágenes, archivos de Office, audio y video.",
    "hero.subtitle2": "Los archivos permanecen en tu navegador de forma 100% privada y segura sin subir nada al servidor.",
    
    "trust.badge1": "Procesamiento en el navegador",
    "trust.badge2": "Eliminación automática en el servidor",
    "trust.badge3": "Sin necesidad de registro",
    "trust.badge4": "100% Privado y Seguro",
    
    "homepage.searchPlaceholder": "Busca la herramienta adecuada para tu tarea...",
    "homepage.privateTitle": "Privado por diseño",
    "homepage.privateDesc": "Tus archivos se quedan contigo",
    "homepage.localTitle": "Procesado localmente",
    "homepage.localDesc": "Siempre que sea posible",
    "homepage.fallbackTitle": "Respaldo seguro",
    "homepage.fallbackDesc": "Transferencia protegida por TLS",
    "homepage.dropAnywhere": "Arrastra un archivo aquí",
    "homepage.chooseFile": "Seleccionar archivo",
    "homepage.orChoose": "o elige un archivo desde tu dispositivo",
    "homepage.methodShown": "El método de procesamiento se muestra antes de comenzar.",
    "homepage.popularTools": "Herramientas populares",
    "homepage.browseAll": "Ver todas las herramientas →",
    "homepage.viewAll": "Ver todas las herramientas →",
    "homepage.footerNote": "Herramientas básicas gratuitas. Sin registros ni suscripciones ocultas.",
    
    "tool.compress.desc": "Reduce el tamaño de tus PDFs",
    "tool.merge.title": "Unir PDF",
    "tool.merge.desc": "Combina múltiples archivos PDF",
    "tool.split.title": "Dividir PDF",
    "tool.split.desc": "Separa páginas de archivos PDF",
    "tool.rotate.title": "Rotar PDF",
    "tool.rotate.desc": "Gira páginas de PDF",
    "tool.watermark.title": "Marca de agua PDF",
    "tool.watermark.desc": "Añade texto o logo al PDF",
    "tool.resize.title": "Redimensionar Imagen",
    "tool.resize.desc": "Píxeles o KB exactos",
    "tool.convert.title": "Convertidor de Imágenes",
    "tool.convert.desc": "JPG, PNG, WebP",
    "tool.pdfToWord.title": "PDF a Word",
    "tool.pdfToWord.desc": "Documento DOCX editable",
    "tool.allTools.title": "Todas las herramientas",
    "tool.allTools.desc": "Explora la suite completa",

    "breadcrumb.home": "Inicio",
    "breadcrumb.compress": "Comprimir PDF",
    "compress.title": "Comprimir PDF por debajo de 2 MB",
    "compress.subtitle": "Reduce el tamaño de tu PDF conservando la mejor calidad posible.",
    
    "badge.local": "Procesado en este dispositivo",
    "workspace.dropHere": "Arrastra tu archivo PDF aquí",
    "workspace.pdfOnly": "Solo PDF · Procesamiento 100% local en tu navegador",
    "workspace.stayOnDevice": "Tu archivo PDF nunca sale de tu dispositivo.",
    "workspace.askBeforeTransfer": "FileKit pedirá confirmación antes de cualquier transferencia.",
    
    "trust.privateTitle": "100% Privado",
    "trust.privateDesc1": "Tu archivo permanece bajo tu",
    "trust.privateDesc2": "total control.",
    "trust.localTitle": "Primero Local",
    "trust.localDesc1": "Procesamiento en el navegador",
    "trust.localDesc2": "siempre seguro.",
    "trust.tempTitle": "Solo Temporal",
    "trust.tempDesc1": "Los archivos del servidor expiran",
    "trust.tempDesc2": "automáticamente.",
    "trust.trialTitle": "Sin Suscripciones Ocultas",
    "trust.trialDesc1": "Condiciones claras y transparentes",
    "trust.trialDesc2": "sin sorpresas.",
    
    "workspace.troubleText": "¿Tienes problemas? El procesamiento seguro en servidor solo está disponible con tu consentimiento.",
    "workspace.targetSize": "Tamaño objetivo",
    "workspace.recommended": "Menos de 2 MB (Recomendado)",
    "workspace.qualityNote": "Reduciremos el tamaño del archivo manteniendo la máxima calidad.",
    "workspace.compressBtn": "Comprimir PDF",
    "workspace.localReady": "El procesamiento local está listo.",
    "workspace.notLeftDevice": "Tu archivo no ha salido de este dispositivo.",
    "workspace.selectFile": "Seleccionar Archivo PDF",
    "workspace.remove": "Eliminar",
    
    "paywall.title": "Desbloquear Descarga",
    "paywall.subtitle": "El archivo ha sido procesado con éxito. Elige una opción para descargarlo.",
    "paywall.resultVerified": "Resultado Verificado",
    "paywall.fileLabel": "Nombre del Documento",
    "paywall.originalLabel": "Tamaño Original",
    "paywall.outputLabel": "Nuevo Tamaño",
    "paywall.changeLabel": "Cambio de Tamaño",
    "paywall.pagesLabel": "Páginas",
    "paywall.locationLabel": "Ubicación del Procesamiento",
    "paywall.localLocation": "Local (En el dispositivo)",
    "paywall.serverLocation": "Servidor (Nube)",
    "paywall.tlsGuarantee": "Cifrado en tránsito mediante TLS",
    "paywall.single.title": "Exportación Individual Premium",
    "paywall.single.billing": "No se renueva",
    "paywall.single.tagline": "Un archivo. Un pago. Sin suscripción.",
    "paywall.pass.title": "Pase de 24 Horas",
    "paywall.pass.billing": "No se renueva",
    "paywall.pass.tagline": "Incluye 10 créditos de servidor.",
    "paywall.pass.badge": "Mejor valor",
    "paywall.pro.title": "Pro Mensual",
    "paywall.pro.billing": "Se renueva mensualmente",
    "paywall.pro.tagline": "Cancela en cualquier momento antes de la fecha de facturación.",
    "paywall.ctaUnlock": "Desbloquear Descarga",
    "paywall.ctaSelect": "Seleccionar Plan para Descargar",
    "paywall.pending": "Creando pago seguro...",
    "paywall.cancel": "Volver al Resultado",
    "paywall.viewDetails": "Ver detalles de verificación",
    "paywall.localTrust": "Procesado de forma privada en este dispositivo",
    "paywall.localTrustSub": "No se requirió subir el archivo",
    "paywall.serverTrust": "Cifrado en tránsito mediante TLS",
    "paywall.serverTrustSub": "Procesado en un entorno aislado",
    "paywall.checkoutSecure": "El pago seguro utiliza conexiones cifradas",
    
    "lang.en": "English",
    "lang.es": "Español",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe",
    "lang.sv": "Svenska"
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
    "paywall.cancel": "العودة إلى النتيجة",
    "paywall.viewDetails": "عرض تفاصيل التحقق",
    "paywall.localTrust": "تمت المعالجة بخصوصية على هذا الجهاز",
    "paywall.localTrustSub": "لم يكن رفع الملف مطلوبًا",
    "paywall.serverTrust": "مشفر أثناء الانتقال باستخدام TLS",
    "paywall.serverTrustSub": "تمت المعالجة في بيئة معزولة",
    "paywall.checkoutSecure": "يستخدم الدفع الآمن اتصالات مشفرة",
    
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
    "paywall.cancel": "Sonuca Geri Dön",
    "paywall.viewDetails": "Doğrulama detaylarını görüntüle",
    "paywall.localTrust": "Bu cihazda özel olarak işlendi",
    "paywall.localTrustSub": "Dosya yüklemesi gerekmedi",
    "paywall.serverTrust": "TLS ile aktarım sırasında şifrelendi",
    "paywall.serverTrustSub": "İzole bir ortamda işlendi",
    "paywall.checkoutSecure": "Güvenli ödeme şifreli bağlantılar kullanır",
    
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe",
    "lang.sv": "Svenska"
  },
  sv: {
    "nav.allTools": "Alla verktyg",
    "nav.compress": "Komprimera",
    "nav.convert": "Konvertera",
    "nav.merge": "Slå samman",
    "nav.image": "Bild",
    "nav.organize": "Ordna",
    "nav.searchPlaceholder": "Sök verktyg...",
    "nav.allToolsBtn": "Alla verktyg",
    
    "hero.tagline": "Filer på dina villkor.",
    "hero.title1": "Gör om filer till",
    "hero.title2": "exakt det du behöver.",
    "hero.subtitle1": "Konvertera, komprimera, ändra storlek, ordna och reparera PDF-filer, bilder, Office-filer, arkiv, ljud och video.",
    "hero.subtitle2": "När det går behandlas filen direkt i webbläsaren. När en server behövs sker behandlingen tillfälligt och filen raderas automatiskt.",
    
    "trust.badge1": "I webbläsaren när det går",
    "trust.badge2": "Automatisk radering efter serverjobb",
    "trust.badge3": "Inget konto för basverktyg",
    "trust.badge4": "Verifierade resultat",
    
    "homepage.searchPlaceholder": "Hitta rätt verktyg för din uppgift...",
    "homepage.privateTitle": "Integritet i grunden",
    "homepage.privateDesc": "Filer stannar hos dig",
    "homepage.localTitle": "Lokal behandling",
    "homepage.localDesc": "Närhelst det är möjligt",
    "homepage.fallbackTitle": "Säker serverreserv",
    "homepage.fallbackDesc": "TLS-skyddad överföring",
    "homepage.dropAnywhere": "Släpp en fil var som helst",
    "homepage.chooseFile": "Välj en fil",
    "homepage.orChoose": "eller välj en fil från din enhet",
    "homepage.methodShown": "Behandlingsmetoden visas innan något startar.",
    "homepage.popularTools": "Populära verktyg",
    "homepage.browseAll": "Se alla verktyg →",
    "homepage.footerNote": "Gratis basverktyg. Inget konto krävs.",
    
    "tool.compress.desc": "Gör PDF-filer mindre",
    "tool.merge.title": "Slå samman PDF",
    "tool.merge.desc": "Kombinera PDF-filer",
    "tool.resize.title": "Ändra bildstorlek",
    "tool.resize.desc": "Exakta pixlar eller KB",
    "tool.convert.title": "Bildkonverterare",
    "tool.convert.desc": "JPG, PNG, WEBP",
    "tool.pdfToWord.title": "PDF till Word",
    "tool.pdfToWord.desc": "Redigerbar DOCX",
    "tool.allTools.title": "Alla verktyg",
    "tool.allTools.desc": "Utforska hela sviten",

    "breadcrumb.home": "Hem",
    "breadcrumb.compress": "Komprimera PDF",
    "compress.title": "Komprimera PDF under 2 MB",
    "compress.subtitle": "Minska PDF-storleken med högsta möjliga kvalitet.",
    
    "badge.local": "Behandlas på denna enhet",
    "workspace.dropHere": "Släpp din PDF här",
    "workspace.pdfOnly": "Endast PDF · Behandlas i webbläsaren",
    "workspace.stayOnDevice": "Filen lämnar inte din enhet vid lokal behandling.",
    "workspace.askBeforeTransfer": "FileKit frågar alltid innan tillfällig serverbehandling.",
    
    "trust.privateTitle": "Full integritet",
    "trust.privateDesc1": "Dina filer stannar under",
    "trust.privateDesc2": "din kontroll.",
    "trust.localTitle": "I webbläsaren",
    "trust.localDesc1": "Lokal behandling direkt i",
    "trust.localDesc2": "webbläsaren.",
    "trust.tempTitle": "Automatisk radering",
    "trust.tempDesc1": "Serverfiler raderas",
    "trust.tempDesc2": "automatiskt.",
    "trust.trialTitle": "Inga dolda avgifter",
    "trust.trialDesc1": "Tydliga och ärliga",
    "trust.trialDesc2": "villkor.",
    
    "lang.en": "English",
    "lang.ar": "العربية",
    "lang.tr": "Türkçe",
    "lang.sv": "Svenska"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Extract initial language directly from URL if present
  const getPathLocale = (path?: string | null): Language => {
    if (!path) return "en";
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0 && isValidLocale(segments[0])) {
      return segments[0] as Language;
    }
    return "en";
  };

  const initialLang = getPathLocale(pathname);
  const [language, setLanguageState] = useState<Language>(initialLang);
  const [direction, setDirection] = useState<Direction>(getLocaleDirection(initialLang));

  // Sync state whenever pathname changes
  useEffect(() => {
    const urlLang = getPathLocale(pathname);
    if (urlLang !== language) {
      setLanguage(urlLang);
    } else {
      const dir = getLocaleDirection(urlLang);
      document.documentElement.dir = dir;
      document.documentElement.lang = urlLang;
    }
  }, [pathname]);

  const setLanguage = (lang: Language) => {
    if (!isValidLocale(lang)) return;
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("fk-lang", lang);
      const dir = getLocaleDirection(lang);
      setDirection(dir);
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string, overrideLocale?: Language): string => {
    const effectiveLang = overrideLocale || language;

    // 1. Direct match in active language's legacy dictionary
    const legacyActive = translations[effectiveLang]?.[key];
    if (legacyActive) return legacyActive;

    // 2. Direct match in active language's UI_TRANSLATIONS
    const currentUi = UI_TRANSLATIONS[effectiveLang];
    const parts = key.split(".");
    if (currentUi && parts.length === 2) {
      const [section, subkey] = parts;
      const sectionObj = (currentUi as unknown as Record<string, Record<string, string>>)[section];
      if (sectionObj && sectionObj[subkey]) {
        return sectionObj[subkey];
      }
    }

    // 2b. Dynamic translations for generic dropzone & workspace notices across all 39 locales
    if (key === "workspace.pdfOnly" || key === "workspace.stayOnDevice") {
      const isArabic = effectiveLang === "ar";
      const isTurkish = effectiveLang === "tr";
      const isSwedish = effectiveLang === "sv" || effectiveLang === "no" || effectiveLang === "da";
      const isGerman = effectiveLang === "de";
      const isFrench = effectiveLang === "fr";
      const isSpanish = effectiveLang === "es" || effectiveLang === "es-419";
      const isPortuguese = effectiveLang === "pt" || effectiveLang === "pt-BR";
      const isItalian = effectiveLang === "it";
      const isPolish = effectiveLang === "pl";
      const isRussian = effectiveLang === "ru" || effectiveLang === "uk";
      const isJapanese = effectiveLang === "ja";
      const isKorean = effectiveLang === "ko";
      const isChinese = effectiveLang.startsWith("zh");

      if (key === "workspace.pdfOnly") {
        if (isArabic) return "معالجة آمنة · يتم إنجاز المهام محلياً في متصفحك مباشرة";
        if (isTurkish) return "Güvenli İşlem · Görevler doğrudan tarayıcınızda yerel olarak çalıştırılır";
        if (isSwedish) return "Säker bearbetning · Uppgifter körs lokalt direkt i webbläsaren";
        if (isGerman) return "Sichere Verarbeitung · Aufgaben werden direkt im Browser ausgeführt";
        if (isFrench) return "Traitement sécurisé · Les tâches s'exécutent localement dans votre navigateur";
        if (isSpanish) return "Procesamiento seguro · Las tareas se ejecutan localmente en tu navegador";
        if (isPortuguese) return "Processamento seguro · As tarefas são executadas localmente no navegador";
        if (isItalian) return "Elaborazione sicura · Le operazioni vengono eseguite localmente nel browser";
        if (isPolish) return "Bezpieczne przetwarzanie · Zadania wykonywane lokalnie w przeglądarce";
        if (isRussian) return "Безопасная обработка · Задачи выполняются локально прямо в браузере";
        if (isJapanese) return "安全な処理 · ブラウザ内でローカルに実行されます";
        if (isKorean) return "안전한 로컬 처리 · 브라우저 내에서 직접 실행됩니다";
        if (isChinese) return "安全本地处理 · 任务直接在浏览器中执行，无需上传";
        return "Secure Processing · Operations execute locally directly in your browser";
      }

      if (key === "workspace.stayOnDevice") {
        if (isArabic) return "يظل ملفك على هذا الجهاز أثناء المعالجة المحلية الآمنة.";
        if (isTurkish) return "Yerel işleme güvenli olduğunda dosyanız bu cihazda kalır.";
        if (isSwedish) return "Filen lämnar inte din enhet vid lokal behandling.";
        if (isGerman) return "Ihre Datei verbleibt während der lokalen Verarbeitung auf Ihrem Gerät.";
        if (isFrench) return "Votre fichier reste sur votre appareil lors du traitement local.";
        if (isSpanish) return "Tu archivo permanece en tu dispositivo durante el procesamiento local.";
        if (isPortuguese) return "O seu arquivo permanece no seu dispositivo durante o processamento local.";
        if (isItalian) return "Il tuo file rimane sul tuo dispositivo durante l'elaborazione locale.";
        if (isPolish) return "Twój plik pozostaje na Twoim urządzeniu podczas przetwarzania lokalnego.";
        if (isRussian) return "Ваш файл остается на устройстве во время локальной обработки.";
        if (isJapanese) return "ローカル処理中、ファイルはお使いのデバイス内に保持されます。";
        if (isKorean) return "로컬 처리 중에는 파일이 기기를 벗어나지 않습니다.";
        if (isChinese) return "在本地安全处理过程中，您的文件绝不会离开您的设备。";
        return "Your file stays on this device whenever local processing is safe.";
      }
    }

    // 3. Fallback to English UI_TRANSLATIONS
    const enUi = UI_TRANSLATIONS["en"];
    if (parts.length === 2) {
      const [section, subkey] = parts;
      const enSectionObj = (enUi as unknown as Record<string, Record<string, string>>)[section];
      if (enSectionObj && enSectionObj[subkey]) {
        return enSectionObj[subkey];
      }
    }

    // 4. Match common tool keys across languages
    if (key.startsWith("tool.") || key.startsWith("breadcrumb.")) {
      const isArabic = effectiveLang === "ar";
      const isTurkish = effectiveLang === "tr";
      const isSpanish = effectiveLang === "es" || effectiveLang === "es-419";
      const isPortuguese = effectiveLang === "pt" || effectiveLang === "pt-BR";
      const isGerman = effectiveLang === "de";
      const isFrench = effectiveLang === "fr";
      const isItalian = effectiveLang === "it";

      if (isSpanish) {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Unir PDF";
        if (key === "tool.merge.desc") return "Combinar archivos PDF";
        if (key === "tool.compress.desc") return "Hacer los PDFs más pequeños";
        if (key === "breadcrumb.compress") return "Comprimir PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Dividir PDF";
        if (key === "tool.split.desc") return "Separar páginas de PDF";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Rotar PDF";
        if (key === "tool.rotate.desc") return "Girar páginas de PDF";
        if (key === "tool.watermark.title") return "Marca de Agua PDF";
        if (key === "tool.watermark.desc") return "Añadir texto o imagen";
        if (key === "tool.resize.title") return "Redimensionar Imagen";
        if (key === "tool.resize.desc") return "Píxeles o KB exactos";
        if (key === "tool.pdfToWord.title") return "PDF a Word";
        if (key === "tool.pdfToWord.desc") return "Salida DOCX editable";
      } else if (isPortuguese) {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Juntar PDF";
        if (key === "tool.merge.desc") return "Combinar ficheiros PDF";
        if (key === "tool.compress.desc") return "Tornar PDFs menores";
        if (key === "breadcrumb.compress") return "Comprimir PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Dividir PDF";
        if (key === "tool.split.desc") return "Separar páginas de PDF";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Girar PDF";
        if (key === "tool.rotate.desc") return "Girar páginas do PDF";
        if (key === "tool.watermark.title") return "Marca d'Água PDF";
        if (key === "tool.watermark.desc") return "Adicionar texto ou logótipo";
        if (key === "tool.resize.title") return "Redimensionar Imagem";
        if (key === "tool.resize.desc") return "Pixels ou KB exatos";
        if (key === "tool.pdfToWord.title") return "PDF para Word";
        if (key === "tool.pdfToWord.desc") return "Saída DOCX editável";
      } else if (isGerman) {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "PDF zusammenfügen";
        if (key === "tool.merge.desc") return "PDF-Dateien kombinieren";
        if (key === "tool.compress.desc") return "PDF-Dateien verkleinern";
        if (key === "breadcrumb.compress") return "PDF komprimieren";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "PDF teilen";
        if (key === "tool.split.desc") return "PDF-Seiten trennen";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "PDF drehen";
        if (key === "tool.rotate.desc") return "PDF-Seiten drehen";
        if (key === "tool.watermark.title") return "PDF-Wasserzeichen";
        if (key === "tool.watermark.desc") return "Text oder Logo hinzufügen";
        if (key === "tool.resize.title") return "Bildgröße ändern";
        if (key === "tool.resize.desc") return "Exakte Pixel oder KB";
        if (key === "tool.pdfToWord.title") return "PDF in Word";
        if (key === "tool.pdfToWord.desc") return "Bearbeitbare DOCX-Ausgabe";
      } else if (isFrench) {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Fusionner PDF";
        if (key === "tool.merge.desc") return "Combiner des fichiers PDF";
        if (key === "tool.compress.desc") return "Réduire la taille des PDF";
        if (key === "breadcrumb.compress") return "Compresser PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Diviser PDF";
        if (key === "tool.split.desc") return "Séparer les pages PDF";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Faire pivoter PDF";
        if (key === "tool.rotate.desc") return "Pivoter les pages du PDF";
        if (key === "tool.watermark.title") return "Filigrane PDF";
        if (key === "tool.watermark.desc") return "Ajouter du texte ou logo";
        if (key === "tool.resize.title") return "Redimensionner image";
        if (key === "tool.resize.desc") return "Pixels ou Ko exacts";
        if (key === "tool.pdfToWord.title") return "PDF en Word";
        if (key === "tool.pdfToWord.desc") return "Sortie DOCX modifiable";
      } else if (isItalian) {
        if (key === "tool.merge.title" || key === "breadcrumb.merge") return "Unisci PDF";
        if (key === "tool.merge.desc") return "Combina file PDF";
        if (key === "tool.compress.desc") return "Riduci dimensioni PDF";
        if (key === "breadcrumb.compress") return "Comprimi PDF";
        if (key === "tool.split.title" || key === "breadcrumb.split") return "Dividi PDF";
        if (key === "tool.split.desc") return "Separa pagine PDF";
        if (key === "tool.rotate.title" || key === "breadcrumb.rotate") return "Ruota PDF";
        if (key === "tool.rotate.desc") return "Ruota pagine PDF";
        if (key === "tool.watermark.title") return "Filigrana PDF";
        if (key === "tool.watermark.desc") return "Aggiungi testo o logo";
        if (key === "tool.resize.title") return "Ridimensiona immagine";
        if (key === "tool.resize.desc") return "Pixel o KB esatti";
        if (key === "tool.pdfToWord.title") return "PDF in Word";
        if (key === "tool.pdfToWord.desc") return "File DOCX modificabile";
      }
    }

    // 5. Dynamic lookup for top navigation links
    if (key === "nav.resize") {
      const isSpanish = effectiveLang === "es" || effectiveLang === "es-419";
      const isPortuguese = effectiveLang === "pt" || effectiveLang === "pt-BR";
      const isGerman = effectiveLang === "de";
      const isFrench = effectiveLang === "fr";
      const isItalian = effectiveLang === "it";
      const isArabic = effectiveLang === "ar";
      const isTurkish = effectiveLang === "tr";

      if (isSpanish) return "Redimensionar";
      if (isPortuguese) return "Redimensionar";
      if (isGerman) return "Größe ändern";
      if (isFrench) return "Redimensionner";
      if (isItalian) return "Ridimensiona";
      if (isArabic) return "تغيير الحجم";
      if (isTurkish) return "Yeniden Boyutlandır";
    }

    if (key === "nav.pricing") {
      const isSpanish = effectiveLang === "es" || effectiveLang === "es-419";
      const isPortuguese = effectiveLang === "pt" || effectiveLang === "pt-BR";
      const isGerman = effectiveLang === "de";
      const isFrench = effectiveLang === "fr";
      const isItalian = effectiveLang === "it";
      const isArabic = effectiveLang === "ar";
      const isTurkish = effectiveLang === "tr";

      if (isSpanish) return "Precios";
      if (isPortuguese) return "Preços";
      if (isGerman) return "Preise";
      if (isFrench) return "Tarifs";
      if (isItalian) return "Prezzi";
      if (isArabic) return "الأسعار";
      if (isTurkish) return "Fiyatlandırma";
    }

    // 6. Fallback to English legacy dictionary
    const legacyEn = translations["en"]?.[key];
    if (legacyEn) return legacyEn;

    return key;
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
