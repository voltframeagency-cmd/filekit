import { SupportedLocale } from "@/config/i18n/locales";

export interface GatedNoticeI18n {
  title: string;
  badge: string;
  reason: string;
  alternativeHeading: string;
  alternative: string;
  backToTools: string;
}

export const GATED_NOTICE_I18N: Record<SupportedLocale, Record<"woff2" | "mobi" | "azw3", GatedNoticeI18n>> = {
  en: {
    woff2: {
      title: "WOFF2 Conversion Temporarily Unavailable",
      badge: "Quality Gate",
      reason: "WOFF2 conversion is temporarily disabled until standard font compression is verified.",
      alternativeHeading: "Available alternative",
      alternative: "You can convert standard TTF to WOFF 1.0 or inspect font metadata in your browser.",
      backToTools: "Explore Verified Tools"
    },
    mobi: {
      title: "Kindle MOBI Conversion Temporarily Unavailable",
      badge: "Quality Gate",
      reason: "MOBI conversion is temporarily disabled until Kindle format compatibility is verified.",
      alternativeHeading: "Available alternative",
      alternative: "Convert standard EPUB to PDF directly in your browser with complete privacy.",
      backToTools: "Explore Verified Tools"
    },
    azw3: {
      title: "AZW3 Conversion Temporarily Unavailable",
      badge: "Quality Gate",
      reason: "AZW3 conversion is temporarily disabled until Kindle format compatibility is verified.",
      alternativeHeading: "Available alternative",
      alternative: "Convert standard EPUB to PDF directly in your browser with complete privacy.",
      backToTools: "Explore Verified Tools"
    }
  },
  es: {
    woff2: {
      title: "Conversión WOFF2 no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión WOFF2 está pausada temporalmente hasta validar la compresión estándar.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Puedes convertir TTF a WOFF 1.0 o inspeccionar metadatos en tu navegador.",
      backToTools: "Ver herramientas disponibles"
    },
    mobi: {
      title: "Conversión MOBI no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión MOBI está pausada hasta validar la compatibilidad con libros Kindle.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad.",
      backToTools: "Ver herramientas disponibles"
    },
    azw3: {
      title: "Conversión AZW3 no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión AZW3 está pausada hasta validar la compatibilidad con el formato Kindle.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad.",
      backToTools: "Ver herramientas disponibles"
    }
  },
  "es-419": {
    woff2: {
      title: "Conversión WOFF2 no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión WOFF2 está pausada temporalmente hasta validar la compresión estándar.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Puedes convertir TTF a WOFF 1.0 o inspeccionar metadatos en tu navegador.",
      backToTools: "Ver herramientas disponibles"
    },
    mobi: {
      title: "Conversión MOBI no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión MOBI está pausada hasta validar la compatibilidad con libros Kindle.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad.",
      backToTools: "Ver herramientas disponibles"
    },
    azw3: {
      title: "Conversión AZW3 no disponible temporalmente",
      badge: "Control de calidad",
      reason: "La conversión AZW3 está pausada hasta validar la compatibilidad con el formato Kindle.",
      alternativeHeading: "Alternativa disponible",
      alternative: "Convierte libros EPUB a PDF directamente en tu navegador con total privacidad.",
      backToTools: "Ver herramientas disponibles"
    }
  },
  de: {
    woff2: {
      title: "WOFF2-Konvertierung vorübergehend nicht verfügbar",
      badge: "Qualitätsprüfung",
      reason: "Die WOFF2-Konvertierung ist vorübergehend deaktiviert, bis die Standard-Komprimierung verifiziert ist.",
      alternativeHeading: "Verfügbare Alternative",
      alternative: "Konvertieren Sie TTF zu WOFF 1.0 oder prüfen Sie Schrift-Metadaten direkt im Browser.",
      backToTools: "Verfügbare Werkzeuge entdecken"
    },
    mobi: {
      title: "MOBI-Konvertierung vorübergehend nicht verfügbar",
      badge: "Qualitätsprüfung",
      reason: "Die MOBI-Konvertierung ist pausiert, bis die Kindle-Kompatibilität vollständig verifiziert ist.",
      alternativeHeading: "Verfügbare Alternative",
      alternative: "Konvertieren Sie EPUB-Dateien direkt im Browser sicher in PDF.",
      backToTools: "Verfügbare Werkzeuge entdecken"
    },
    azw3: {
      title: "AZW3-Konvertierung vorübergehend nicht verfügbar",
      badge: "Qualitätsprüfung",
      reason: "Die AZW3-Konvertierung ist pausiert, bis die Kindle-Format-Kompatibilität vollständig verifiziert ist.",
      alternativeHeading: "Verfügbare Alternative",
      alternative: "Konvertieren Sie EPUB-Dateien direkt im Browser sicher in PDF.",
      backToTools: "Verfügbare Werkzeuge entdecken"
    }
  },
  fr: {
    woff2: {
      title: "Conversion WOFF2 temporairement indisponible",
      badge: "Contrôle qualité",
      reason: "La conversion WOFF2 est suspendue jusqu'à vérification de la compression standard.",
      alternativeHeading: "Alternative disponible",
      alternative: "Convertissez vos polices TTF en WOFF 1.0 ou consultez leurs métadonnées dans votre navigateur.",
      backToTools: "Découvrir les outils disponibles"
    },
    mobi: {
      title: "Conversion MOBI temporairement indisponible",
      badge: "Contrôle qualité",
      reason: "La conversion MOBI est suspendue jusqu'à validation de la compatibilité avec les fichiers Kindle.",
      alternativeHeading: "Alternative disponible",
      alternative: "Convertissez vos fichiers EPUB en PDF directement dans votre navigateur.",
      backToTools: "Découvrir les outils disponibles"
    },
    azw3: {
      title: "Conversion AZW3 temporairement indisponible",
      badge: "Contrôle qualité",
      reason: "La conversion AZW3 est suspendue jusqu'à validation de la compatibilité avec le format Kindle.",
      alternativeHeading: "Alternative disponible",
      alternative: "Convertissez vos fichiers EPUB en PDF directement dans votre navigateur.",
      backToTools: "Découvrir les outils disponibles"
    }
  },
  it: {
    woff2: {
      title: "Conversione WOFF2 temporaneamente non disponibile",
      badge: "Controllo qualità",
      reason: "La conversione WOFF2 è sospesa fino alla verifica della compressione standard.",
      alternativeHeading: "Alternativa disponibile",
      alternative: "Converti file TTF in WOFF 1.0 o esamina i metadati direttamente nel browser.",
      backToTools: "Esplora gli strumenti disponibili"
    },
    mobi: {
      title: "Conversione MOBI temporaneamente non disponibile",
      badge: "Controllo qualità",
      reason: "La conversione MOBI è sospesa fino alla verifica della compatibilità con i libri Kindle.",
      alternativeHeading: "Alternativa disponibile",
      alternative: "Converti file EPUB in PDF nel tuo browser con la massima privacy.",
      backToTools: "Esplora gli strumenti disponibili"
    },
    azw3: {
      title: "Conversione AZW3 temporaneamente non disponibile",
      badge: "Controllo qualità",
      reason: "La conversione AZW3 è sospesa fino alla verifica della compatibilità con il formato Kindle.",
      alternativeHeading: "Alternativa disponibile",
      alternative: "Converti file EPUB in PDF nel tuo browser con la massima privacy.",
      backToTools: "Esplora gli strumenti disponibili"
    }
  },
  pt: {
    woff2: {
      title: "Conversão WOFF2 temporariamente indisponível",
      badge: "Controlo de qualidade",
      reason: "A conversão WOFF2 está pausada até validação da compressão padrão.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta ficheiros TTF para WOFF 1.0 diretamente no seu navegador.",
      backToTools: "Ver ferramentas disponíveis"
    },
    mobi: {
      title: "Conversão MOBI temporariamente indisponível",
      badge: "Controlo de qualidade",
      reason: "A conversão MOBI está pausada até validação de compatibilidade com o formato Kindle.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta livros EPUB para PDF no navegador de forma privada.",
      backToTools: "Ver ferramentas disponíveis"
    },
    azw3: {
      title: "Conversão AZW3 temporariamente indisponível",
      badge: "Controlo de qualidade",
      reason: "A conversão AZW3 está pausada até validação de compatibilidade com o formato Kindle.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta livros EPUB para PDF no navegador de forma privada.",
      backToTools: "Ver ferramentas disponíveis"
    }
  },
  "pt-BR": {
    woff2: {
      title: "Conversão WOFF2 temporariamente indisponível",
      badge: "Controle de qualidade",
      reason: "A conversão WOFF2 está pausada até validação da compressão padrão.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta arquivos TTF para WOFF 1.0 diretamente no seu navegador.",
      backToTools: "Ver ferramentas disponíveis"
    },
    mobi: {
      title: "Conversão MOBI temporariamente indisponível",
      badge: "Controle de qualidade",
      reason: "A conversão MOBI está pausada até validação de compatibilidade com o formato Kindle.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta livros EPUB para PDF no navegador com total privacidade.",
      backToTools: "Ver ferramentas disponíveis"
    },
    azw3: {
      title: "Conversão AZW3 temporariamente indisponível",
      badge: "Controle de qualidade",
      reason: "A conversão AZW3 está pausada até validação de compatibilidade com o formato Kindle.",
      alternativeHeading: "Alternativa disponível",
      alternative: "Converta livros EPUB para PDF no navegador com total privacidade.",
      backToTools: "Ver ferramentas disponíveis"
    }
  },
  nl: {
    woff2: {
      title: "WOFF2-conversie tijdelijk niet beschikbaar",
      badge: "Kwaliteitscontrole",
      reason: "WOFF2-conversie is tijdelijk uitgeschakeld totdat standaardcompressie is geverifieerd.",
      alternativeHeading: "Beschikbaar alternatief",
      alternative: "Converteer TTF naar WOFF 1.0 rechtstreeks in uw browser.",
      backToTools: "Bekijk beschikbare tools"
    },
    mobi: {
      title: "MOBI-conversie tijdelijk niet beschikbaar",
      badge: "Kwaliteitscontrole",
      reason: "MOBI-conversie is gepauzeerd totdat Kindle-compatibiliteit is bevestigd.",
      alternativeHeading: "Beschikbaar alternatief",
      alternative: "Converteer EPUB naar PDF direct in uw browser.",
      backToTools: "Bekijk beschikbare tools"
    },
    azw3: {
      title: "AZW3-conversie tijdelijk niet beschikbaar",
      badge: "Kwaliteitscontrole",
      reason: "AZW3-conversie is gepauzeerd totdat Kindle-compatibiliteit is bevestigd.",
      alternativeHeading: "Beschikbaar alternatief",
      alternative: "Converteer EPUB naar PDF direct in uw browser.",
      backToTools: "Bekijk beschikbare tools"
    }
  },
  ar: {
    woff2: {
      title: "تحويل WOFF2 غير متاح مؤقتاً",
      badge: "مراقبة الجودة",
      reason: "تم إيقاف تحويل WOFF2 مؤقتاً حتى يتم التحقق من خوارزمية الضغط القياسية.",
      alternativeHeading: "البديل المتاح",
      alternative: "يمكنك تحويل خطوط TTF إلى WOFF 1.0 مباشرة في المتصفح.",
      backToTools: "استكشف الأدوات المتاحة"
    },
    mobi: {
      title: "تحويل MOBI غير متاح مؤقتاً",
      badge: "مراقبة الجودة",
      reason: "تم إيقاف تحويل MOBI مؤقتاً حتى يتم التحقق من التوافق التام مع كتب Kindle.",
      alternativeHeading: "البديل المتاح",
      alternative: "يمكنك تحويل كتب EPUB إلى PDF في المتصفح بخصوصية تامة.",
      backToTools: "استكشف الأدوات المتاحة"
    },
    azw3: {
      title: "تحويل AZW3 غير متاح مؤقتاً",
      badge: "مراقبة الجودة",
      reason: "تم إيقاف تحويل AZW3 مؤقتاً حتى يتم التحقق من التوافق مع تنسيق Kindle.",
      alternativeHeading: "البديل المتاح",
      alternative: "يمكنك تحويل كتب EPUB إلى PDF في المتصفح بخصوصية تامة.",
      backToTools: "استكشف الأدوات المتاحة"
    }
  },
  he: {
    woff2: {
      title: "המרת WOFF2 אינה זמינה זמנית",
      badge: "בקרת איכות",
      reason: "המרת WOFF2 מושבתת זמנית עד לאימות דחיסת הגופנים התקנית.",
      alternativeHeading: "חלופה זמינה",
      alternative: "ניתן להמיר גופני TTF ל-WOFF 1.0 ישירות בדפדפן.",
      backToTools: "גלה כלים זמינים"
    },
    mobi: {
      title: "המרת MOBI אינה זמינה זמנית",
      badge: "בקרת איכות",
      reason: "המרת MOBI מושבתת זמנית עד לאימות התאימות לקבצי Kindle.",
      alternativeHeading: "חלופה זמינה",
      alternative: "המר ספרי EPUB ל-PDF ישירות בדפדפן שלך בפרטיות מלאה.",
      backToTools: "גלה כלים זמינים"
    },
    azw3: {
      title: "המרת AZW3 אינה זמינה זמנית",
      badge: "בקרת איכות",
      reason: "המרת AZW3 מושבתת זמנית עד לאימות התאימות לתבנית Kindle.",
      alternativeHeading: "חלופה זמינה",
      alternative: "המר ספרי EPUB ל-PDF ישירות בדפדפן שלך בפרטיות מלאה.",
      backToTools: "גלה כלים זמינים"
    }
  },
  hi: {
    woff2: {
      title: "WOFF2 रूपांतरण अस्थायी रूप से अनुपलब्ध है",
      badge: "गुणवत्ता जांच",
      reason: "मानक फ़ॉन्ट संपीड़न सत्यापित होने तक WOFF2 रूपांतरण अस्थायी रूप से अक्षम है।",
      alternativeHeading: "उपलब्ध विकल्प",
      alternative: "आप अपने ब्राउज़र में TTF को WOFF 1.0 में बदल सकते हैं।",
      backToTools: "उपलब्ध टूल्स देखें"
    },
    mobi: {
      title: "MOBI रूपांतरण अस्थायी रूप से अनुपलब्ध है",
      badge: "गुणवत्ता जांच",
      reason: "Kindle फ़ाइल अनुकूलता सत्यापित होने तक MOBI रूपांतरण अक्षम है।",
      alternativeHeading: "उपलब्ध विकल्प",
      alternative: "ब्राउज़र में पूर्ण गोपनीयता के साथ EPUB को PDF में बदलें।",
      backToTools: "उपलब्ध टूल्स देखें"
    },
    azw3: {
      title: "AZW3 रूपांतरण अस्थायी रूप से अनुपलब्ध है",
      badge: "गुणवत्ता जांच",
      reason: "Kindle प्रारूप अनुकूलता सत्यापित होने तक AZW3 रूपांतरण अक्षम है।",
      alternativeHeading: "उपलब्ध विकल्प",
      alternative: "ब्राउज़र में पूर्ण गोपनीयता के साथ EPUB को PDF में बदलें।",
      backToTools: "उपलब्ध टूल्स देखें"
    }
  },
  ja: {
    woff2: {
      title: "WOFF2変換は一時的に利用できません",
      badge: "品質管理",
      reason: "標準フォント圧縮の検証が完了するまで、WOFF2変換は一時的に停止しています。",
      alternativeHeading: "利用可能な代替ツール",
      alternative: "ブラウザ上でTTFからWOFF 1.0への変換をご利用いただけます。",
      backToTools: "利用可能なツールを見る"
    },
    mobi: {
      title: "MOBI変換は一時的に利用できません",
      badge: "品質管理",
      reason: "Kindle形式との互換性検証が完了するまで、MOBI変換は一時的に停止しています。",
      alternativeHeading: "利用可能な代替ツール",
      alternative: "ブラウザ内で安全にEPUBからPDFへの変換をご利用いただけます。",
      backToTools: "利用可能なツールを見る"
    },
    azw3: {
      title: "AZW3変換は一時的に利用できません",
      badge: "品質管理",
      reason: "Kindle形式との互換性検証が完了するまで、AZW3変換は一時的に停止しています。",
      alternativeHeading: "利用可能な代替ツール",
      alternative: "ブラウザ内で安全にEPUBからPDFへの変換をご利用いただけます。",
      backToTools: "利用可能なツールを見る"
    }
  },
  ko: {
    woff2: {
      title: "WOFF2 변환을 일시적으로 사용할 수 없습니다",
      badge: "품질 기준",
      reason: "표준 폰트 압축 규격 검증 완료 시까지 WOFF2 변환이 일시적으로 제한됩니다.",
      alternativeHeading: "사용 가능한 대안",
      alternative: "브라우저에서 직접 TTF를 WOFF 1.0으로 변환할 수 있습니다.",
      backToTools: "사용 가능한 도구 보기"
    },
    mobi: {
      title: "MOBI 변환을 일시적으로 사용할 수 없습니다",
      badge: "품질 기준",
      reason: "킨들 형식 호환성 검증 완료 시까지 MOBI 변환이 일시적으로 제한됩니다.",
      alternativeHeading: "사용 가능한 대안",
      alternative: "브라우저에서 완전한 보안과 함께 EPUB을 PDF로 변환하세요.",
      backToTools: "사용 가능한 도구 보기"
    },
    azw3: {
      title: "AZW3 변환을 일시적으로 사용할 수 없습니다",
      badge: "품질 기준",
      reason: "Kindle 형식 호환성 검증 완료 시까지 AZW3 변환이 일시적으로 제한됩니다.",
      alternativeHeading: "사용 가능한 대안",
      alternative: "브라우저에서 완전한 보안과 함께 EPUB을 PDF로 변환하세요.",
      backToTools: "사용 가능한 도구 보기"
    }
  },
  "zh-CN": {
    woff2: {
      title: "WOFF2 转换暂时无法使用",
      badge: "质量保障",
      reason: "在标准字体压缩验证完成前，WOFF2 转换功能暂时下线。",
      alternativeHeading: "推荐替代方案",
      alternative: "您可以在浏览器中直接将 TTF 转换为 WOFF 1.0。",
      backToTools: "查看可用工具"
    },
    mobi: {
      title: "MOBI 转换暂时无法使用",
      badge: "质量保障",
      reason: "在 Kindle 电子书兼容性验证完成前，MOBI 转换功能暂时下线。",
      alternativeHeading: "推荐替代方案",
      alternative: "可在浏览器中直接将 EPUB 转换为 PDF，绝不上载文件。",
      backToTools: "查看可用工具"
    },
    azw3: {
      title: "AZW3 转换暂时无法使用",
      badge: "质量保障",
      reason: "在 Kindle 格式兼容性验证完成前，AZW3 转换功能暂时下线。",
      alternativeHeading: "推荐替代方案",
      alternative: "可在浏览器中直接将 EPUB 转换为 PDF，绝不上载文件。",
      backToTools: "查看可用工具"
    }
  },
  "zh-TW": {
    woff2: {
      title: "WOFF2 轉換暫時無法使用",
      badge: "品質保障",
      reason: "在標準字型壓縮驗證完成前，WOFF2 轉換功能暫時下線。",
      alternativeHeading: "推薦替代方案",
      alternative: "您可以在瀏覽器中直接將 TTF 轉換為 WOFF 1.0。",
      backToTools: "瀏覽可用工具"
    },
    mobi: {
      title: "MOBI 轉換暫時無法使用",
      badge: "品質保障",
      reason: "在 Kindle 電子書相容性驗證完成前，MOBI 轉換功能暫時下線。",
      alternativeHeading: "推薦替代方案",
      alternative: "可在瀏覽器中直接將 EPUB 轉換為 PDF，絕不上傳檔案。",
      backToTools: "瀏覽可用工具"
    },
    azw3: {
      title: "AZW3 轉換暫時無法使用",
      badge: "品質保障",
      reason: "在 Kindle 格式相容性驗證完成前，AZW3 轉換功能暫時下線。",
      alternativeHeading: "推薦替代方案",
      alternative: "可在瀏覽器中直接將 EPUB 轉換為 PDF，絕不上傳檔案。",
      backToTools: "瀏覽可用工具"
    }
  }
} as any;
