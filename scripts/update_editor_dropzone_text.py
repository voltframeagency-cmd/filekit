import sys

path = 'src/components/pdf-editor/PdfPageEditorWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_block = '''          <h3 className="text-lg font-bold text-slate-200 mb-1">
            {t("workspace.dropHere") || (targetRoute === "/merge-pdf" ? "Drop PDF documents here" : "Drop PDF document here")}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {t("workspace.pdfOnly") || "Supports local PDF document manipulation up to 100 MB"}
          </p>'''

new_block = '''          <h3 className="text-lg font-bold text-slate-200 mb-1">
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
              : t("workspace.dropHere") || (targetRoute === "/merge-pdf" ? "Drop PDF documents here" : "Drop PDF document here")}
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            {language === "ru"
              ? "Локальная обработка документов PDF до 100 МБ"
              : language === "uk"
              ? "Локальна обробка документів PDF до 100 МБ"
              : language === "el"
              ? "Τοπική επεξεργασία εγγράφων PDF έως 100 MB"
              : language === "sk"
              ? "Lokálne spracovanie PDF dokumentov až do 100 MB"
              : language === "sl"
              ? "Lokalna obdelava dokumentov PDF do 100 MB"
              : language === "bg"
              ? "Локална обработка на PDF документи до 100 MB"
              : t("workspace.pdfOnly") || "Supports local PDF document manipulation up to 100 MB"}
          </p>'''

c = c.replace(old_block, new_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Dropzone title and notice updated")
