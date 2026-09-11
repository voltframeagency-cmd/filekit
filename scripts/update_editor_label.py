import sys

path = 'src/components/pdf-editor/PdfPageEditorWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_code = '''          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">
            {t(targetRoute === "/merge-pdf" ? "workspace.selectFiles" : "workspace.selectFile")}
            <input
              type="file"
              multiple={targetRoute === "/merge-pdf"}'''

new_code = '''          <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition">
            {(targetRoute === "/merge-pdf" || (targetRoute as string) === "merge-pdf")
              ? (language === "ru" ? "Выбрать файлы PDF" : language === "uk" ? "Вибрати файли PDF" : language === "el" ? "Επιλογή αρχείων PDF" : language === "sk" ? "Vybrať súbory PDF" : language === "sl" ? "Izberite datoteke PDF" : language === "bg" ? "Изберете PDF файлове" : t("workspace.selectFiles") || "Select PDF Files")
              : (language === "ru" ? "Выбрать файл PDF" : language === "uk" ? "Вибрати файл PDF" : language === "el" ? "Επιλογή αρχείου PDF" : language === "sk" ? "Vybrať súbor PDF" : language === "sl" ? "Izberite datoteko PDF" : language === "bg" ? "Изберете PDF файл" : t("workspace.selectFile") || "Select PDF File")}
            <input
              type="file"
              multiple={targetRoute === "/merge-pdf" || (targetRoute as string) === "merge-pdf"}'''

c = c.replace(old_code, new_code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("PdfPageEditorWorkspace button label updated directly")
