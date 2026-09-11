import sys

path = 'src/components/pdf-overlay/PdfOverlayWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Replace interface and signature
c = c.replace(
    'export const PdfOverlayWorkspace: React.FC = () => {\n  const { t } = useLanguage();',
    'interface PdfOverlayWorkspaceProps {\n  language?: string;\n}\n\nexport const PdfOverlayWorkspace: React.FC<PdfOverlayWorkspaceProps> = ({ language: propLang }) => {\n  const { t, language: ctxLang } = useLanguage();\n  const language = propLang || ctxLang || "en";'
)

# Replace t("workspace.dropHere") and t("workspace.pdfOnly") and t("workspace.selectFile")
old_dropzone = '''          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {t("workspace.dropHere") || "Drop your PDF here"}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {t("workspace.pdfOnly") || "or click to browse from your computer (Up to 100 MB)"}
          </p>
          <span className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition">
            {t("workspace.selectFile") || "Select PDF File"}
          </span>'''

new_dropzone = '''          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {language === "ru"
              ? "Перетащите PDF сюда"
              : language === "uk"
              ? "Перетягніть PDF сюди"
              : language === "el"
              ? "Σύρετε το PDF σας εδώ"
              : language === "sk"
              ? "Presuňte PDF sem"
              : language === "sl"
              ? "Povlecite PDF sem"
              : language === "bg"
              ? "Пуснете вашия PDF тук"
              : t("workspace.dropHere") || "Drop your PDF here"}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            {language === "ru"
              ? "или нажмите для выбора с компьютера (до 100 МБ)"
              : language === "uk"
              ? "або натисніть для вибору з комп’ютера (до 100 МБ)"
              : language === "el"
              ? "ή κάντε κλικ για περιήγηση (έως 100 MB)"
              : language === "sk"
              ? "alebo kliknite a vyberte z počítača (až 100 MB)"
              : language === "sl"
              ? "ali kliknite za brskanje po računalniku (do 100 MB)"
              : language === "bg"
              ? "или кликнете за преглед от компютъра (до 100 MB)"
              : t("workspace.pdfOnly") || "or click to browse from your computer (Up to 100 MB)"}
          </p>
          <span className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition">
            {language === "ru"
              ? "Выбрать PDF-файл"
              : language === "uk"
              ? "Вибрати PDF-файл"
              : language === "el"
              ? "Επιλέξτε αρχείο PDF"
              : language === "sk"
              ? "Vybrať PDF súbor"
              : language === "sl"
              ? "Izberite datoteko PDF"
              : language === "bg"
              ? "Изберете PDF файл"
              : t("workspace.selectFile") || "Select PDF File"}
          </span>'''

c = c.replace(old_dropzone, new_dropzone)

# Also pass language to PdfWatermarkControls
c = c.replace(
    '<PdfWatermarkControls\n              config={watermarkConfig}',
    '<PdfWatermarkControls\n              language={language}\n              config={watermarkConfig}'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated PdfOverlayWorkspace props and dropzone strings")
