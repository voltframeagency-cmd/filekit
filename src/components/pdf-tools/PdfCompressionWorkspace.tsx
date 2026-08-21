"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import TrustPanel from "@/components/layout/TrustPanel";
import { LocalPdfEngineAdapter } from "@/utils/engine/LocalPdfEngineAdapter";
import { VerificationResult, ProcessingJob, ProcessingProgressEvent, ProcessingFailure } from "@/utils/engine/types";
import { PdfCompressionMode, PdfRouteConfig } from "@/config/pdfCompressionRoutes";
import { useLanguage } from "@/components/layout/LanguageContext";

export type QualityPriority = "BETTER_QUALITY" | "BALANCED" | "SMALLER_FILE";

export interface PdfCompressionWorkspaceProps {
  routeConfig: PdfRouteConfig;
  initialTargetValue?: string;
  initialTargetUnit?: "kb" | "mb";
}

const MIN_BYTES = 100 * 1024; // 100 KB
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

const workspaceI18n: Record<string, {
  dropPdf: string;
  supportsPdf: string;
  privacyPdf: string;
  originalSize: string;
  chooseAnother: string;
  compressing: string;
  noBeneficial: string;
  targetNotMet: string;
  alreadyBelow: string;
  compressedOk: string;
  noReductionDesc: string;
  original: string;
  newSize: string;
  pages: string;
  reduction: string;
  processingLocal: string;
  downloadOriginal: string;
  downloadBest: string;
  downloadCompressed: string;
  adjustSettings: string;
  settingsTitle: string;
  compressionGoal: string;
  betterQuality: string;
  betterQualityDesc: string;
  balanced: string;
  balancedDesc: string;
  smallerFile: string;
  smallerFileDesc: string;
  targetFileSize: string;
  quickTargets: string;
  targetOutcome: string;
  below2mb: string;
  targetOutcomeDesc: string;
  compressBtn: string;
  recompressBtn: string;
  compressingBtn: string;
}> = {
  en: {
    dropPdf: "Drop your PDF document here or browse",
    supportsPdf: "Supports standard PDF documents up to 50 MB",
    privacyPdf: "🔒 Your PDF is processed locally in your browser memory and is not uploaded.",
    originalSize: "Original Size",
    chooseAnother: "Choose Another",
    compressing: "Compressing PDF locally...",
    noBeneficial: "No beneficial reduction",
    targetNotMet: "We reduced the PDF, but could not reach requested size safely",
    alreadyBelow: "Your PDF is already below requested size",
    compressedOk: "PDF compressed successfully",
    noReductionDesc: "This PDF is already efficiently compressed with the selected settings. The original file has been preserved.",
    original: "Original",
    newSize: "New Size",
    pages: "Pages",
    reduction: "Reduction",
    processingLocal: "Processing: Local Browser",
    downloadOriginal: "Download Original PDF",
    downloadBest: "Download Best Result",
    downloadCompressed: "Download Compressed PDF",
    adjustSettings: "Adjust Settings",
    settingsTitle: "PDF Compression Settings",
    compressionGoal: "Compression Goal",
    betterQuality: "Better quality",
    betterQualityDesc: "Preserves more visual detail",
    balanced: "Balanced",
    balancedDesc: "Recommended for most documents",
    smallerFile: "Smaller file",
    smallerFileDesc: "Prioritizes stronger file-size reduction",
    targetFileSize: "Target File Size",
    quickTargets: "Quick Targets:",
    targetOutcome: "Target Outcome",
    below2mb: "Below 2 MB",
    targetOutcomeDesc: "This tool automatically optimizes your PDF document to fit below 2 MB for easy email and upload compatibility.",
    compressBtn: "Compress PDF",
    recompressBtn: "Recompress PDF",
    compressingBtn: "Compressing PDF...",
  },
  ar: {
    dropPdf: "اسحب مستند PDF هنا أو تصفّح",
    supportsPdf: "يدعم مستندات PDF القياسية حتى 50 ميجابايت",
    privacyPdf: "🔒 تتم معالجة ملف PDF محلياً في ذاكرة المتصفح ولا يتم رفعه.",
    originalSize: "الحجم الأصلي",
    chooseAnother: "اختر ملفاً آخر",
    compressing: "جارِ ضغط PDF محلياً...",
    noBeneficial: "لا يوجد تقليل مفيد",
    targetNotMet: "تم تقليل حجم PDF لكن لم نتمكن من الوصول للحجم المطلوب بأمان",
    alreadyBelow: "ملف PDF الخاص بك أقل من الحجم المطلوب بالفعل",
    compressedOk: "تم ضغط PDF بنجاح",
    noReductionDesc: "ملف PDF هذا مضغوط بكفاءة بالفعل مع الإعدادات المحددة. تم الحفاظ على الملف الأصلي.",
    original: "الأصلي",
    newSize: "الحجم الجديد",
    pages: "الصفحات",
    reduction: "التقليل",
    processingLocal: "المعالجة: المتصفح المحلي",
    downloadOriginal: "تحميل PDF الأصلي",
    downloadBest: "تحميل أفضل نتيجة",
    downloadCompressed: "تحميل PDF المضغوط",
    adjustSettings: "تعديل الإعدادات",
    settingsTitle: "إعدادات ضغط PDF",
    compressionGoal: "هدف الضغط",
    betterQuality: "جودة أفضل",
    betterQualityDesc: "يحافظ على المزيد من التفاصيل المرئية",
    balanced: "متوازن",
    balancedDesc: "موصى به لمعظم المستندات",
    smallerFile: "ملف أصغر",
    smallerFileDesc: "يُعطي أولوية لتقليل حجم الملف",
    targetFileSize: "حجم الملف المستهدف",
    quickTargets: "أهداف سريعة:",
    targetOutcome: "النتيجة المستهدفة",
    below2mb: "أقل من 2 ميجابايت",
    targetOutcomeDesc: "تعمل هذه الأداة على تحسين مستند PDF ليكون أقل من 2 ميجابايت لسهولة الإرسال والرفع.",
    compressBtn: "ضغط PDF",
    recompressBtn: "إعادة ضغط PDF",
    compressingBtn: "جارِ ضغط PDF...",
  },
  tr: {
    dropPdf: "PDF belgenizi buraya bırakın veya seçin",
    supportsPdf: "50 MB'a kadar standart PDF belgelerini destekler",
    privacyPdf: "🔒 PDF'iniz tarayıcınızda yerel olarak işlenir ve yüklenmez.",
    originalSize: "Orijinal Boyut",
    chooseAnother: "Başka Seç",
    compressing: "PDF yerel olarak sıkıştırılıyor...",
    noBeneficial: "Faydalı küçültme yok",
    targetNotMet: "PDF küçültüldü ancak istenen boyuta güvenli şekilde ulaşılamadı",
    alreadyBelow: "PDF'iniz zaten istenen boyutun altında",
    compressedOk: "PDF başarıyla sıkıştırıldı",
    noReductionDesc: "Bu PDF seçili ayarlarla zaten verimli şekilde sıkıştırılmış. Orijinal dosya korunmuştur.",
    original: "Orijinal",
    newSize: "Yeni Boyut",
    pages: "Sayfalar",
    reduction: "Küçültme",
    processingLocal: "İşlem: Yerel Tarayıcı",
    downloadOriginal: "Orijinal PDF'i İndir",
    downloadBest: "En İyi Sonucu İndir",
    downloadCompressed: "Sıkıştırılmış PDF'i İndir",
    adjustSettings: "Ayarları Düzenle",
    settingsTitle: "PDF Sıkıştırma Ayarları",
    compressionGoal: "Sıkıştırma Hedefi",
    betterQuality: "Daha iyi kalite",
    betterQualityDesc: "Daha fazla görsel detay korur",
    balanced: "Dengeli",
    balancedDesc: "Çoğu belge için önerilir",
    smallerFile: "Daha küçük dosya",
    smallerFileDesc: "Daha güçlü dosya küçültmeye öncelik verir",
    targetFileSize: "Hedef Dosya Boyutu",
    quickTargets: "Hızlı Hedefler:",
    targetOutcome: "Hedef Sonuç",
    below2mb: "2 MB altı",
    targetOutcomeDesc: "Bu araç, e-posta ve yükleme uyumluluğu için PDF'nizi otomatik olarak 2 MB altına optimize eder.",
    compressBtn: "PDF'i Sıkıştır",
    recompressBtn: "PDF'i Yeniden Sıkıştır",
    compressingBtn: "PDF sıkıştırılıyor...",
  },
  sv: {
    dropPdf: "Dra och släpp ditt PDF-dokument här eller bläddra",
    supportsPdf: "Stöder standard PDF-dokument upp till 50 MB",
    privacyPdf: "🔒 Din PDF bearbetas lokalt i webbläsarens minne och laddas inte upp.",
    originalSize: "Originalstorlek",
    chooseAnother: "Välj en annan",
    compressing: "Komprimerar PDF lokalt...",
    noBeneficial: "Ingen fördelaktig minskning",
    targetNotMet: "Vi minskade PDF:en men kunde inte nå begärd storlek säkert",
    alreadyBelow: "Din PDF är redan under begärd storlek",
    compressedOk: "PDF komprimerad framgångsrikt",
    noReductionDesc: "Denna PDF är redan effektivt komprimerad med valda inställningar. Originalfilen har bevarats.",
    original: "Original",
    newSize: "Ny storlek",
    pages: "Sidor",
    reduction: "Minskning",
    processingLocal: "Bearbetning: Lokal webbläsare",
    downloadOriginal: "Ladda ner original-PDF",
    downloadBest: "Ladda ner bästa resultat",
    downloadCompressed: "Ladda ner komprimerad PDF",
    adjustSettings: "Justera inställningar",
    settingsTitle: "PDF-komprimeringsinställningar",
    compressionGoal: "Komprimeringsmål",
    betterQuality: "Bättre kvalitet",
    betterQualityDesc: "Bevarar mer visuell detalj",
    balanced: "Balanserad",
    balancedDesc: "Rekommenderas för de flesta dokument",
    smallerFile: "Mindre fil",
    smallerFileDesc: "Prioriterar starkare filstorleksminskning",
    targetFileSize: "Målfilstorlek",
    quickTargets: "Snabbval:",
    targetOutcome: "Målresultat",
    below2mb: "Under 2 MB",
    targetOutcomeDesc: "Detta verktyg optimerar automatiskt ditt PDF-dokument till under 2 MB för enkel e-post- och uppladdningskompatibilitet.",
    compressBtn: "Komprimera PDF",
    recompressBtn: "Komprimera igen",
    compressingBtn: "Komprimerar PDF...",
  },
  es: {
    dropPdf: "Suelta tu documento PDF aquí o busca",
    supportsPdf: "Admite documentos PDF estándar de hasta 50 MB",
    privacyPdf: "🔒 Tu PDF se procesa localmente en la memoria del navegador y no se sube.",
    originalSize: "Tamaño original",
    chooseAnother: "Elegir otro",
    compressing: "Comprimiendo PDF localmente...",
    noBeneficial: "Sin reducción beneficiosa",
    targetNotMet: "Redujimos el PDF pero no se pudo alcanzar el tamaño solicitado de forma segura",
    alreadyBelow: "Tu PDF ya está por debajo del tamaño solicitado",
    compressedOk: "PDF comprimido exitosamente",
    noReductionDesc: "Este PDF ya está comprimido eficientemente con la configuración seleccionada. El archivo original se ha preservado.",
    original: "Original",
    newSize: "Nuevo tamaño",
    pages: "Páginas",
    reduction: "Reducción",
    processingLocal: "Procesamiento: Navegador local",
    downloadOriginal: "Descargar PDF original",
    downloadBest: "Descargar mejor resultado",
    downloadCompressed: "Descargar PDF comprimido",
    adjustSettings: "Ajustar configuración",
    settingsTitle: "Configuración de compresión PDF",
    compressionGoal: "Objetivo de compresión",
    betterQuality: "Mejor calidad",
    betterQualityDesc: "Preserva más detalle visual",
    balanced: "Equilibrado",
    balancedDesc: "Recomendado para la mayoría de documentos",
    smallerFile: "Archivo más pequeño",
    smallerFileDesc: "Prioriza una mayor reducción de tamaño",
    targetFileSize: "Tamaño objetivo",
    quickTargets: "Objetivos rápidos:",
    targetOutcome: "Resultado objetivo",
    below2mb: "Menos de 2 MB",
    targetOutcomeDesc: "Esta herramienta optimiza automáticamente tu PDF para que sea menor de 2 MB.",
    compressBtn: "Comprimir PDF",
    recompressBtn: "Recomprimir PDF",
    compressingBtn: "Comprimiendo PDF...",
  },
  fr: {
    dropPdf: "Déposez votre document PDF ici ou parcourir",
    supportsPdf: "Prend en charge les documents PDF standard jusqu'à 50 Mo",
    privacyPdf: "🔒 Votre PDF est traité localement dans la mémoire de votre navigateur et n'est pas téléchargé.",
    originalSize: "Taille originale",
    chooseAnother: "Choisir un autre",
    compressing: "Compression du PDF en cours...",
    noBeneficial: "Aucune réduction bénéfique",
    targetNotMet: "Le PDF a été réduit mais la taille demandée n'a pas pu être atteinte en toute sécurité",
    alreadyBelow: "Votre PDF est déjà en dessous de la taille demandée",
    compressedOk: "PDF compressé avec succès",
    noReductionDesc: "Ce PDF est déjà compressé efficacement avec les paramètres sélectionnés. Le fichier original a été préservé.",
    original: "Original",
    newSize: "Nouvelle taille",
    pages: "Pages",
    reduction: "Réduction",
    processingLocal: "Traitement : Navigateur local",
    downloadOriginal: "Télécharger le PDF original",
    downloadBest: "Télécharger le meilleur résultat",
    downloadCompressed: "Télécharger le PDF compressé",
    adjustSettings: "Ajuster les paramètres",
    settingsTitle: "Paramètres de compression PDF",
    compressionGoal: "Objectif de compression",
    betterQuality: "Meilleure qualité",
    betterQualityDesc: "Préserve plus de détails visuels",
    balanced: "Équilibré",
    balancedDesc: "Recommandé pour la plupart des documents",
    smallerFile: "Fichier plus petit",
    smallerFileDesc: "Priorité à une réduction de taille plus forte",
    targetFileSize: "Taille cible",
    quickTargets: "Cibles rapides :",
    targetOutcome: "Résultat cible",
    below2mb: "Moins de 2 Mo",
    targetOutcomeDesc: "Cet outil optimise automatiquement votre PDF pour qu'il soit inférieur à 2 Mo.",
    compressBtn: "Compresser le PDF",
    recompressBtn: "Recompresser le PDF",
    compressingBtn: "Compression du PDF...",
  },
  de: {
    dropPdf: "PDF-Dokument hier ablegen oder durchsuchen",
    supportsPdf: "Unterstützt Standard-PDF-Dokumente bis 50 MB",
    privacyPdf: "🔒 Ihre PDF wird lokal im Browser-Speicher verarbeitet und nicht hochgeladen.",
    originalSize: "Originalgröße",
    chooseAnother: "Andere wählen",
    compressing: "PDF wird lokal komprimiert...",
    noBeneficial: "Keine vorteilhafte Reduzierung",
    targetNotMet: "Die PDF wurde reduziert, aber die gewünschte Größe konnte nicht sicher erreicht werden",
    alreadyBelow: "Ihre PDF liegt bereits unter der gewünschten Größe",
    compressedOk: "PDF erfolgreich komprimiert",
    noReductionDesc: "Diese PDF ist mit den gewählten Einstellungen bereits effizient komprimiert. Die Originaldatei wurde beibehalten.",
    original: "Original",
    newSize: "Neue Größe",
    pages: "Seiten",
    reduction: "Reduzierung",
    processingLocal: "Verarbeitung: Lokaler Browser",
    downloadOriginal: "Original-PDF herunterladen",
    downloadBest: "Bestes Ergebnis herunterladen",
    downloadCompressed: "Komprimierte PDF herunterladen",
    adjustSettings: "Einstellungen anpassen",
    settingsTitle: "PDF-Komprimierungseinstellungen",
    compressionGoal: "Komprimierungsziel",
    betterQuality: "Bessere Qualität",
    betterQualityDesc: "Erhält mehr visuelle Details",
    balanced: "Ausgewogen",
    balancedDesc: "Empfohlen für die meisten Dokumente",
    smallerFile: "Kleinere Datei",
    smallerFileDesc: "Priorisiert stärkere Dateigrößenreduzierung",
    targetFileSize: "Zieldateigröße",
    quickTargets: "Schnellziele:",
    targetOutcome: "Zielergebnis",
    below2mb: "Unter 2 MB",
    targetOutcomeDesc: "Dieses Tool optimiert Ihr PDF-Dokument automatisch auf unter 2 MB.",
    compressBtn: "PDF komprimieren",
    recompressBtn: "PDF erneut komprimieren",
    compressingBtn: "PDF wird komprimiert...",
  },
  pt: {
    dropPdf: "Solte o seu documento PDF aqui ou procure",
    supportsPdf: "Suporta documentos PDF padrão até 50 MB",
    privacyPdf: "🔒 Seu PDF é processado localmente na memória do navegador e não é enviado.",
    originalSize: "Tamanho original",
    chooseAnother: "Escolher outro",
    compressing: "Comprimindo PDF localmente...",
    noBeneficial: "Sem redução benéfica",
    targetNotMet: "Reduzimos o PDF mas não conseguimos atingir o tamanho solicitado com segurança",
    alreadyBelow: "Seu PDF já está abaixo do tamanho solicitado",
    compressedOk: "PDF comprimido com sucesso",
    noReductionDesc: "Este PDF já está comprimido de forma eficiente com as configurações selecionadas. O arquivo original foi preservado.",
    original: "Original",
    newSize: "Novo tamanho",
    pages: "Páginas",
    reduction: "Redução",
    processingLocal: "Processamento: Navegador local",
    downloadOriginal: "Baixar PDF original",
    downloadBest: "Baixar melhor resultado",
    downloadCompressed: "Baixar PDF comprimido",
    adjustSettings: "Ajustar configurações",
    settingsTitle: "Configurações de compressão PDF",
    compressionGoal: "Objetivo de compressão",
    betterQuality: "Melhor qualidade",
    betterQualityDesc: "Preserva mais detalhes visuais",
    balanced: "Equilibrado",
    balancedDesc: "Recomendado para a maioria dos documentos",
    smallerFile: "Arquivo menor",
    smallerFileDesc: "Prioriza maior redução de tamanho",
    targetFileSize: "Tamanho alvo",
    quickTargets: "Alvos rápidos:",
    targetOutcome: "Resultado alvo",
    below2mb: "Abaixo de 2 MB",
    targetOutcomeDesc: "Esta ferramenta otimiza automaticamente seu PDF para ficar abaixo de 2 MB.",
    compressBtn: "Comprimir PDF",
    recompressBtn: "Recomprimir PDF",
    compressingBtn: "Comprimindo PDF...",
  },
  it: {
    dropPdf: "Trascina il tuo documento PDF qui o sfoglia",
    supportsPdf: "Supporta documenti PDF standard fino a 50 MB",
    privacyPdf: "🔒 Il tuo PDF viene elaborato localmente nella memoria del browser e non viene caricato.",
    originalSize: "Dimensione originale",
    chooseAnother: "Scegli un altro",
    compressing: "Compressione PDF in corso...",
    noBeneficial: "Nessuna riduzione utile",
    targetNotMet: "Il PDF è stato ridotto ma non è stato possibile raggiungere la dimensione richiesta in sicurezza",
    alreadyBelow: "Il tuo PDF è già sotto la dimensione richiesta",
    compressedOk: "PDF compresso con successo",
    noReductionDesc: "Questo PDF è già compresso in modo efficiente con le impostazioni selezionate. Il file originale è stato preservato.",
    original: "Originale",
    newSize: "Nuova dimensione",
    pages: "Pagine",
    reduction: "Riduzione",
    processingLocal: "Elaborazione: Browser locale",
    downloadOriginal: "Scarica PDF originale",
    downloadBest: "Scarica miglior risultato",
    downloadCompressed: "Scarica PDF compresso",
    adjustSettings: "Regola impostazioni",
    settingsTitle: "Impostazioni compressione PDF",
    compressionGoal: "Obiettivo compressione",
    betterQuality: "Qualità migliore",
    betterQualityDesc: "Preserva più dettagli visivi",
    balanced: "Bilanciato",
    balancedDesc: "Consigliato per la maggior parte dei documenti",
    smallerFile: "File più piccolo",
    smallerFileDesc: "Priorità a una maggiore riduzione delle dimensioni",
    targetFileSize: "Dimensione obiettivo",
    quickTargets: "Obiettivi rapidi:",
    targetOutcome: "Risultato obiettivo",
    below2mb: "Sotto 2 MB",
    targetOutcomeDesc: "Questo strumento ottimizza automaticamente il tuo PDF per essere inferiore a 2 MB.",
    compressBtn: "Comprimi PDF",
    recompressBtn: "Ricomprimi PDF",
    compressingBtn: "Compressione PDF...",
  },
  ja: {
    dropPdf: "PDFドキュメントをここにドロップまたは参照",
    supportsPdf: "50 MBまでの標準PDFドキュメントをサポート",
    privacyPdf: "🔒 PDFはブラウザのメモリでローカルに処理され、アップロードされません。",
    originalSize: "元のサイズ",
    chooseAnother: "別を選択",
    compressing: "PDFをローカルで圧縮中...",
    noBeneficial: "有益な削減なし",
    targetNotMet: "PDFは縮小されましたが、要求サイズに安全に到達できませんでした",
    alreadyBelow: "PDFは既に要求サイズ以下です",
    compressedOk: "PDF圧縮成功",
    noReductionDesc: "このPDFは選択した設定で既に効率的に圧縮されています。元のファイルは保存されています。",
    original: "元",
    newSize: "新サイズ",
    pages: "ページ",
    reduction: "削減",
    processingLocal: "処理: ローカルブラウザ",
    downloadOriginal: "元のPDFをダウンロード",
    downloadBest: "最良結果をダウンロード",
    downloadCompressed: "圧縮PDFをダウンロード",
    adjustSettings: "設定を調整",
    settingsTitle: "PDF圧縮設定",
    compressionGoal: "圧縮目標",
    betterQuality: "より良い品質",
    betterQualityDesc: "より多くの視覚的詳細を保持",
    balanced: "バランス",
    balancedDesc: "ほとんどのドキュメントに推奨",
    smallerFile: "より小さいファイル",
    smallerFileDesc: "ファイルサイズ削減を優先",
    targetFileSize: "目標ファイルサイズ",
    quickTargets: "クイック目標:",
    targetOutcome: "目標結果",
    below2mb: "2 MB以下",
    targetOutcomeDesc: "このツールはPDFを2 MB以下に自動最適化します。",
    compressBtn: "PDFを圧縮",
    recompressBtn: "PDFを再圧縮",
    compressingBtn: "PDF圧縮中...",
  },
  ko: {
    dropPdf: "PDF 문서를 여기에 놓거나 찾아보기",
    supportsPdf: "50 MB까지 표준 PDF 문서 지원",
    privacyPdf: "🔒 PDF는 브라우저 메모리에서 로컬로 처리되며 업로드되지 않습니다.",
    originalSize: "원본 크기",
    chooseAnother: "다른 파일 선택",
    compressing: "PDF를 로컬에서 압축 중...",
    noBeneficial: "유익한 감소 없음",
    targetNotMet: "PDF가 줄었지만 요청 크기에 안전하게 도달하지 못했습니다",
    alreadyBelow: "PDF가 이미 요청 크기 이하입니다",
    compressedOk: "PDF 압축 성공",
    noReductionDesc: "이 PDF는 선택한 설정으로 이미 효율적으로 압축되어 있습니다.",
    original: "원본",
    newSize: "새 크기",
    pages: "페이지",
    reduction: "감소",
    processingLocal: "처리: 로컬 브라우저",
    downloadOriginal: "원본 PDF 다운로드",
    downloadBest: "최상의 결과 다운로드",
    downloadCompressed: "압축 PDF 다운로드",
    adjustSettings: "설정 조정",
    settingsTitle: "PDF 압축 설정",
    compressionGoal: "압축 목표",
    betterQuality: "더 나은 품질",
    betterQualityDesc: "더 많은 시각적 디테일 보존",
    balanced: "균형",
    balancedDesc: "대부분의 문서에 권장",
    smallerFile: "더 작은 파일",
    smallerFileDesc: "더 강한 파일 크기 감소 우선",
    targetFileSize: "목표 파일 크기",
    quickTargets: "빠른 목표:",
    targetOutcome: "목표 결과",
    below2mb: "2 MB 이하",
    targetOutcomeDesc: "이 도구는 PDF를 2 MB 이하로 자동 최적화합니다.",
    compressBtn: "PDF 압축",
    recompressBtn: "PDF 재압축",
    compressingBtn: "PDF 압축 중...",
  },
};

export default function PdfCompressionWorkspace({
  routeConfig,
  initialTargetValue = "2",
  initialTargetUnit = "mb"
}: PdfCompressionWorkspaceProps) {
  const { language } = useLanguage();
  const langKey = language?.slice(0, 2).toLowerCase() || 'en';
  const wt = workspaceI18n[langKey] || workspaceI18n.en;
  // Mode selection & controls
  const [qualityPriority, setQualityPriority] = useState<QualityPriority>("BALANCED");
  const [targetValue, setTargetValue] = useState<string>(initialTargetValue);
  const [targetUnit, setTargetUnit] = useState<"kb" | "mb">(initialTargetUnit);

  // File and result states
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Request versioning & cancellation refs
  const requestIdRef = useRef<number>(0);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const settingsSectionRef = useRef<HTMLDivElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);

  // Privacy-compliant analytics logger
  const trackEvent = (eventName: string, payload?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    const safePayload: Record<string, any> = {
      operation: routeConfig.analyticsOperation,
      mode: routeConfig.mode,
      timestamp: Date.now(),
      ...payload
    };
    delete safePayload.filename;
    delete safePayload.pdfBytes;
    delete safePayload.filePath;
    delete safePayload.signatureData;
    delete safePayload.hash;

    if ((window as any).__FILEKIT_ANALYTICS__) {
      (window as any).__FILEKIT_ANALYTICS__.push({ event: eventName, ...safePayload });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF document.");
      return;
    }

    setError(null);
    setResult(null);
    setFile(selected);

    trackEvent("file_selected", {
      inputSizeBucket: selected.size > 2 * 1024 * 1024 ? ">2MB" : "<2MB"
    });
  };

  const calculateTargetSizeBytes = (): number => {
    if (!file) return 2 * 1024 * 1024;

    if (routeConfig.mode === "FIXED_TARGET" && routeConfig.targetBytes) {
      return routeConfig.targetBytes;
    }

    if (routeConfig.mode === "GENERAL") {
      if (qualityPriority === "BETTER_QUALITY") return Math.max(MIN_BYTES, Math.round(file.size * 0.80));
      if (qualityPriority === "BALANCED") return Math.max(MIN_BYTES, Math.round(file.size * 0.50));
      return Math.max(MIN_BYTES, Math.round(file.size * 0.30));
    }

    // CUSTOM_TARGET mode calculation
    const num = parseFloat(targetValue);
    if (isNaN(num) || num <= 0) return 2 * 1024 * 1024;
    const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
    return Math.min(MAX_BYTES, Math.max(MIN_BYTES, bytes));
  };

  const handleCompress = async () => {
    if (!file) return;

    // Validate CUSTOM_TARGET inputs
    if (routeConfig.mode === "CUSTOM_TARGET") {
      const num = parseFloat(targetValue);
      const decimalCount = (targetValue.split(".")[1] || "").length;
      if (isNaN(num) || num <= 0) {
        setError("Please enter a valid numeric target size.");
        return;
      }
      if (decimalCount > 2) {
        setError("Target size supports at most 2 decimal places (e.g. 1.5 MB).");
        return;
      }
      const bytes = targetUnit === "mb" ? Math.round(num * 1024 * 1024) : Math.round(num * 1024);
      if (bytes < MIN_BYTES) {
        setError("Minimum PDF target size limit is 100 KB.");
        return;
      }
      if (bytes > MAX_BYTES) {
        setError("Maximum PDF target size limit is 50 MB.");
        return;
      }
    }

    // Abort previous active operation if running
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    activeAbortControllerRef.current = controller;

    const currentReqId = ++requestIdRef.current;
    setIsProcessing(true);
    setError(null);
    setProgressMsg("Reading PDF document...");

    const targetSizeBytes = calculateTargetSizeBytes();
    trackEvent("compression_settings_submitted", {
      targetSizeBytes,
      qualityPriority: routeConfig.mode === "GENERAL" ? qualityPriority : undefined
    });

    try {
      const adapter = new LocalPdfEngineAdapter();
      const targetSizeStr = `${targetSizeBytes}`;

      const job: ProcessingJob = {
        id: `pdf-job-${currentReqId}`,
        abortSignal: controller.signal,
        onProgress: (update: ProcessingProgressEvent) => {
          if (requestIdRef.current === currentReqId) {
            setProgressMsg(update.message);
          }
        },
        onSuccess: (ver: VerificationResult) => {
          if (requestIdRef.current !== currentReqId || controller.signal.aborted) {
            trackEvent("cancelled");
            return;
          }
          setResult(ver);
          setIsProcessing(false);
          trackEvent(ver.outcome.toLowerCase(), {
            originalSizeBytes: ver.originalSizeBytes,
            outputSizeBytes: ver.outputSizeBytes,
            pagesBefore: ver.pagesBefore
          });

          setTimeout(() => {
            resultHeadingRef.current?.focus();
          }, 100);
        },
        onError: (failure: ProcessingFailure) => {
          if (requestIdRef.current !== currentReqId || controller.signal.aborted) return;
          let msg = failure.message || "PDF compression failed.";
          if (msg.includes("REJECTED_ENCRYPTED") || failure.category === "PASSWORD_PROTECTED" || failure.category === "PDF_ENCRYPTED_OR_LOCKED") {
            msg = "Encrypted or password-protected PDFs cannot be compressed locally.";
          } else if (msg.includes("REJECTED_SIGNED") || failure.category === "UNSUPPORTED_SIGNED_DOCUMENT") {
            msg = "Digitally signed PDFs cannot be re-compressed without invalidating signatures.";
          } else if (msg.includes("MEMORY_LIMIT_EXCEEDED") || failure.category === "LOCAL_MEMORY_LIMIT") {
            msg = "This PDF document is too large to process safely in browser memory.";
          }
          setError(msg);
          setIsProcessing(false);
          trackEvent("processing_failed");
        }
      };

      await adapter.compress(file, targetSizeStr, job);
    } catch (err: any) {
      if (requestIdRef.current !== currentReqId || controller.signal.aborted) return;
      setError(err.message || "An error occurred during PDF compression.");
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !result.outputBuffer || !file) return;
    const blob = new Blob([result.outputBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${file.name.replace(/\.pdf$/i, "")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    trackEvent("download_completed", { downloadedSizeBytes: result.outputSizeBytes });
  };

  const handleAdjustSettings = () => {
    trackEvent("adjust_settings_selected");
    settingsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    const firstInput = settingsSectionRef.current?.querySelector<HTMLElement>("input, button");
    firstInput?.focus();
  };

  const handleResetWorkspace = () => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }
    requestIdRef.current++;
    setFile(null);
    setResult(null);
    setError(null);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "\u20660 Bytes\u2069";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    return `\u2066${formatted}\u2069`;
  };

  const isNoReduction = result ? result.outcome === "NO_BENEFICIAL_REDUCTION" || result.outputSizeBytes >= result.originalSizeBytes : false;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      {/* File Upload Zone (when no file selected) */}
      {!file && (
        <div className="w-full max-w-[840px] mx-auto bg-white border border-fk-border rounded-fk-xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-fk-border rounded-fk-lg p-10 text-center hover:border-fk-primary transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <svg className="w-12 h-12 text-fk-primary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="text-[15px] font-bold text-fk-text">{wt.dropPdf}</p>
            <p className="text-[12px] font-medium text-fk-text-subtle mt-1">
              {wt.supportsPdf}
            </p>
            <p className="text-[11px] font-medium text-fk-text-subtle mt-2 bg-fk-surface-muted px-3 py-1 rounded-full border border-fk-border">
              {wt.privacyPdf}
            </p>
          </div>
        </div>
      )}

      {/* Main Workspace (Side-by-Side Grid on Desktop) */}
      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Results & Document Summary (Col Span 7 on Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              {/* File Info Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-fk-border">
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-fk-text dir-auto truncate max-w-[280px] sm:max-w-[400px]">{file.name}</span>
                  <span className="text-[12px] font-mono text-fk-text-subtle mt-0.5">
                    {wt.originalSize}: {formatBytes(file.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="text-[12px] font-bold text-fk-text-muted hover:text-fk-text px-3 py-1.5 border border-fk-border rounded-fk-md bg-white hover:bg-fk-surface-muted transition-colors shrink-0"
                >
                  {wt.chooseAnother}
                </button>
              </div>

              {/* Status Header Badge */}
              <div className="flex flex-col gap-2">
                {isProcessing ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold bg-blue-50 border-blue-200 text-blue-800 w-fit animate-pulse">
                    <span>⚙️</span>
                    <span>{progressMsg || wt.compressing}</span>
                  </div>
                ) : result ? (
                  <div
                    ref={resultHeadingRef as any}
                    tabIndex={-1}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-[14px] font-bold focus:outline-none w-fit ${
                      isNoReduction
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : result.outcome === "TARGET_NOT_MET"
                        ? "bg-blue-50 border-blue-200 text-blue-800"
                        : "bg-fk-success-bg border-[#BBF7D0] text-fk-success"
                    }`}
                  >
                    <span>{isNoReduction ? "ℹ️" : result.outcome === "TARGET_NOT_MET" ? "⚠️" : "✓"}</span>
                    <span>
                      {isNoReduction
                        ? wt.noBeneficial
                        : result.outcome === "TARGET_NOT_MET"
                        ? wt.targetNotMet
                        : result.originalAlreadyWithinTarget
                        ? wt.alreadyBelow
                        : wt.compressedOk}
                    </span>
                  </div>
                ) : null}

                {!isProcessing && isNoReduction && (
                  <p className="text-[13px] text-fk-text-muted leading-relaxed">
                    {wt.noReductionDesc}
                  </p>
                )}
              </div>

              {/* Metrics Display */}
              {result && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-6 w-full p-4 bg-fk-surface-muted border border-fk-border rounded-fk-xl font-mono">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-text-subtle uppercase">{wt.original}</span>
                      <span className="text-[18px] font-bold text-fk-text mt-1">{formatBytes(result.originalSizeBytes)}</span>
                    </div>
                    <div className="text-[22px] font-light text-fk-text-subtle ltr:rotate-0 rtl:rotate-180">→</div>
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-bold text-fk-primary uppercase">{wt.newSize}</span>
                      <span className="text-[20px] font-black text-fk-primary mt-1">{formatBytes(result.outputSizeBytes)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-around p-3 bg-white border border-fk-border rounded-fk-md text-[12px] font-bold text-fk-text">
                    <span>📄 {wt.pages}: {result.pagesAfter || 1}</span>
                    <span>📉 {wt.reduction}: {result.reductionPercentage}%</span>
                    <span>🔒 {wt.processingLocal}</span>
                  </div>

                  {/* Primary Download Action Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="flex-1 h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                      {isNoReduction || (result && result.originalAlreadyWithinTarget)
                        ? wt.downloadOriginal
                        : result && result.outcome === "TARGET_NOT_MET"
                        ? wt.downloadBest
                        : wt.downloadCompressed}
                    </button>

                    <button
                      type="button"
                      onClick={handleAdjustSettings}
                      className="h-[50px] px-5 border border-fk-border hover:bg-fk-surface-muted text-fk-text font-bold rounded-fk-md text-[13px] transition-colors"
                    >
                      {wt.adjustSettings}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Settings Controls (Col Span 5 on Desktop, Sticky Top) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-20" ref={settingsSectionRef}>
            <div className="bg-white border border-fk-border rounded-fk-xl p-6 shadow-sm flex flex-col gap-6">
              <h2 className="text-[16px] font-black text-fk-text flex items-center gap-2 border-b border-fk-border pb-3">
                <span>⚙️</span>
                <span>{wt.settingsTitle}</span>
              </h2>

              {/* GENERAL MODE CONTROLS */}
              {routeConfig.mode === "GENERAL" && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">{wt.compressionGoal}</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "BETTER_QUALITY", label: wt.betterQuality, desc: wt.betterQualityDesc },
                      { key: "BALANCED", label: wt.balanced, desc: wt.balancedDesc },
                      { key: "SMALLER_FILE", label: wt.smallerFile, desc: wt.smallerFileDesc }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setQualityPriority(item.key as QualityPriority)}
                        className={`flex flex-col p-3 rounded-fk-md border text-left ltr:text-left rtl:text-right transition-colors ${
                          qualityPriority === item.key
                            ? "bg-white border-fk-primary ring-1 ring-fk-primary text-fk-text"
                            : "bg-white border-fk-border text-fk-text-muted hover:border-fk-text-subtle"
                        }`}
                      >
                        <span className="text-[13px] font-bold text-fk-text">{item.label}</span>
                        <span className="text-[11px] font-medium text-fk-text-subtle mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOM TARGET MODE CONTROLS */}
              {routeConfig.mode === "CUSTOM_TARGET" && (
                <div className="flex flex-col gap-4 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <label className="text-[13px] font-bold text-fk-text">{wt.targetFileSize}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      min="100"
                      max="52428800"
                      value={targetValue}
                      onChange={(e) => {
                        setTargetValue(e.target.value);
                        setError(null);
                      }}
                      className="w-full h-10 px-3 border border-fk-border rounded-fk-md font-mono text-[14px] font-bold text-fk-text focus:outline-none focus:border-fk-primary"
                      placeholder="2"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => {
                        setTargetUnit(e.target.value as "kb" | "mb");
                        setError(null);
                      }}
                      className="h-10 px-3 border border-fk-border rounded-fk-md font-bold text-[13px] text-fk-text bg-white focus:outline-none focus:border-fk-primary"
                    >
                      <option value="kb">KB</option>
                      <option value="mb">MB</option>
                    </select>
                  </div>

                  {/* Quick-fill Chips */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-fk-text-subtle">{wt.quickTargets}</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "500 KB", val: "500", unit: "kb" },
                        { label: "1 MB", val: "1", unit: "mb" },
                        { label: "2 MB", val: "2", unit: "mb" },
                        { label: "5 MB", val: "5", unit: "mb" }
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => {
                            setTargetValue(chip.val);
                            setTargetUnit(chip.unit as "kb" | "mb");
                          }}
                          className="px-2 py-1.5 text-[11px] font-bold border border-fk-border rounded-fk-md bg-white hover:border-fk-primary hover:text-fk-primary transition-colors text-center"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FIXED TARGET MODE CONTROLS */}
              {routeConfig.mode === "FIXED_TARGET" && (
                <div className="flex flex-col gap-3 p-4 bg-fk-surface-muted border border-fk-border rounded-fk-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-fk-text">{wt.targetOutcome}</span>
                    <span className="text-[12px] font-mono font-bold text-fk-primary bg-white px-2.5 py-1 rounded-fk-sm border border-fk-border">
                      {wt.below2mb}
                    </span>
                  </div>
                  <p className="text-[12px] font-medium text-fk-text-subtle leading-relaxed">
                    {wt.targetOutcomeDesc}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full h-[50px] bg-fk-primary hover:bg-fk-primary-hover text-white rounded-fk-md text-[14px] font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {isProcessing ? wt.compressingBtn : result ? wt.recompressBtn : wt.compressBtn}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] rounded-fk-md font-medium">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <TrustPanel />
    </div>
  );
}
