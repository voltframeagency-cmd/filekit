import sys

path = 'src/components/pdf-overlay/PdfWatermarkControls.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add language prop to PdfWatermarkControlsProps
c = c.replace(
    'interface PdfWatermarkControlsProps {\n  config: WatermarkConfig;',
    'interface PdfWatermarkControlsProps {\n  language?: string;\n  config: WatermarkConfig;'
)

# 2. Update component signature
old_sig = 'export const PdfWatermarkControls: React.FC<PdfWatermarkControlsProps> = ({\n  config,'
new_sig = '''export const PdfWatermarkControls: React.FC<PdfWatermarkControlsProps> = ({
  language = "en",
  config,'''
c = c.replace(old_sig, new_sig)

# 3. Add language helper flags right after isApplyDisabled
flags = '''  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isGreek = language === "el";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";'''
c = c.replace('  const isApplyDisabled = isProcessing || !!validationError;', f'  const isApplyDisabled = isProcessing || !!validationError;\n{flags}')

# 4. Localize Watermark Type label
c = c.replace(
    '        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">\n          Watermark Type\n        </label>',
    '''        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {isRussian ? "Тип водяного знака" : isUkrainian ? "Тип водяного знака" : isGreek ? "Τύπος υδατογραφήματος" : isSlovak ? "Typ vodoznaku" : isSlovenian ? "Vrsta vodnega žiga" : isBulgarian ? "Тип воден знак" : "Watermark Type"}
        </label>'''
)

# 5. Localize Text Watermark button
c = c.replace(
    '            Text Watermark\n          </button>',
    '            {isRussian ? "Текстовый водяной знак" : isUkrainian ? "Текстовий водяний знак" : isGreek ? "Υδατογράφημα κειμένου" : isSlovak ? "Textový vodoznak" : isSlovenian ? "Besedilni vodni žig" : isBulgarian ? "Текстов воден знак" : "Text Watermark"}\n          </button>'
)

# 6. Localize Image Logo button
c = c.replace(
    '            Image Logo\n          </button>',
    '            {isRussian ? "Логотип / Изображение" : isUkrainian ? "Логотип / Зображення" : isGreek ? "Λογότυπο / Εικόνα" : isSlovak ? "Logo / Obrázok" : isSlovenian ? "Logotip / Slika" : isBulgarian ? "Лого / Изображение" : "Image Logo"}\n          </button>'
)

# 7. Localize Watermark Text label
c = c.replace(
    '            <label className="block text-xs font-medium text-slate-400 mb-1">\n              Watermark Text\n            </label>',
    '''            <label className="block text-xs font-medium text-slate-400 mb-1">
              {isRussian ? "Текст водяного знака" : isUkrainian ? "Текст водяного знака" : isGreek ? "Κείμενο υδατογραφήματος" : isSlovak ? "Text vodoznaku" : isSlovenian ? "Besedilo vodnega žiga" : isBulgarian ? "Текст на водния знак" : "Watermark Text"}
            </label>'''
)

# 8. Localize Font Color
c = c.replace(
    '              <label className="block text-xs font-medium text-slate-400 mb-1">\n                Font Color\n              </label>',
    '''              <label className="block text-xs font-medium text-slate-400 mb-1">
                {isRussian ? "Цвет шрифта" : isUkrainian ? "Колір шрифту" : isGreek ? "Χρώμα γραμματοσειράς" : isSlovak ? "Farba písma" : isSlovenian ? "Barva pisave" : isBulgarian ? "Цвят на шрифта" : "Font Color"}
              </label>'''
)

# 9. Localize Font Size
c = c.replace(
    'Font Size ({config.fontSize || 36} pt)',
    '{isRussian ? `Размер шрифта (${config.fontSize || 36} пт)` : isUkrainian ? `Розмір шрифту (${config.fontSize || 36} пт)` : isGreek ? `Μέγεθος (${config.fontSize || 36} pt)` : isSlovak ? `Veľkosť písma (${config.fontSize || 36} pt)` : isSlovenian ? `Velikost pisave (${config.fontSize || 36} pt)` : isBulgarian ? `Размер на шрифта (${config.fontSize || 36} pt)` : `Font Size (${config.fontSize || 36} pt)`}'
)

# 10. Localize Select Logo Image
c = c.replace(
    '            <label className="block text-xs font-medium text-slate-400 mb-1">\n              Select Logo Image (PNG / JPEG)\n            </label>',
    '''            <label className="block text-xs font-medium text-slate-400 mb-1">
              {isRussian ? "Выберите изображение логотипа (PNG / JPEG)" : isUkrainian ? "Виберіть логотип (PNG / JPEG)" : isGreek ? "Επιλέξτε λογότυπο (PNG / JPEG)" : isSlovak ? "Vyberte obrázok loga (PNG / JPEG)" : isSlovenian ? "Izberite sliko logotipa (PNG / JPEG)" : isBulgarian ? "Изберете лого изображение (PNG / JPEG)" : "Select Logo Image (PNG / JPEG)"}
            </label>'''
)

# 11. Localize Apply To Pages
c = c.replace(
    '        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">\n          Apply To Pages\n        </label>',
    '''        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
          {isRussian ? "Применить к страницам" : isUkrainian ? "Застосувати до сторінок" : isGreek ? "Εφαρμογή σε σελίδες" : isSlovak ? "Použiť na strany" : isSlovenian ? "Uporabi za strani" : isBulgarian ? "Прилагане към страници" : "Apply To Pages"}
        </label>'''
)

# 12. Localize page mode buttons
old_modes = '''              {mode === "all"
                ? "All Pages"
                : mode === "odd"
                ? "Odd Pages Only"
                : mode === "even"
                ? "Even Pages Only"
                : "Custom Range"}'''

new_modes = '''              {mode === "all"
                ? (isRussian ? "Все страницы" : isUkrainian ? "Усі сторінки" : isGreek ? "Όλες οι σελίδες" : isSlovak ? "Všetky strany" : isSlovenian ? "Vse strani" : isBulgarian ? "Всички страници" : "All Pages")
                : mode === "odd"
                ? (isRussian ? "Только нечетные" : isUkrainian ? "Лише непарні" : isGreek ? "Μόνο μονές" : isSlovak ? "Len nepárne" : isSlovenian ? "Samo lihe" : isBulgarian ? "Само нечетни" : "Odd Pages Only")
                : mode === "even"
                ? (isRussian ? "Только четные" : isUkrainian ? "Лише парні" : isGreek ? "Μόνο ζυγές" : isSlovak ? "Len párne" : isSlovenian ? "Samo sode" : isBulgarian ? "Само четни" : "Even Pages Only")
                : (isRussian ? "Свой диапазон" : isUkrainian ? "Власний діапазон" : isGreek ? "Προσαρμοσμένο εύρος" : isSlovak ? "Vlastný rozsah" : isSlovenian ? "Obseg po meri" : isBulgarian ? "Персонализиран обхват" : "Custom Range")}'''
c = c.replace(old_modes, new_modes)

# 13. Localize CTA button
old_cta = '''          {isProcessing ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Applying Watermark...
            </>
          ) : (
            "Apply Watermark"
          )}'''

new_cta = '''          {isProcessing ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {isRussian ? "Применение водяного знака..." : isUkrainian ? "Застосування водяного знака..." : isGreek ? "Εφαρμογή υδατογραφήματος..." : isSlovak ? "Aplikovanie vodoznaku..." : isSlovenian ? "Uporaba vodnega žiga..." : isBulgarian ? "Прилагане на воден знак..." : "Applying Watermark..."}
            </>
          ) : (
            isRussian ? "Добавить водяной знак" : isUkrainian ? "Додати водяний знак" : isGreek ? "Εφαρμογή υδατογραφήματος" : isSlovak ? "Pridať vodoznak" : isSlovenian ? "Dodaj vodni žig" : isBulgarian ? "Добавяне на воден знак" : "Apply Watermark"
          )}'''
c = c.replace(old_cta, new_cta)

# 14. Localize Reset button
c = c.replace(
    '        <button\n          type="button"\n          onClick={onResetWorkspace}\n          className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"\n        >\n          Reset\n        </button>',
    '''        <button
          type="button"
          onClick={onResetWorkspace}
          className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition"
        >
          {isRussian ? "Сбросить" : isUkrainian ? "Скинути" : isGreek ? "Επαναφορά" : isSlovak ? "Resetovať" : isSlovenian ? "Ponastavi" : isBulgarian ? "Нулиране" : "Reset"}
        </button>'''
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("PdfWatermarkControls localization completed successfully")
