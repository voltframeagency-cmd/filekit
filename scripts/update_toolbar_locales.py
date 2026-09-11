import sys

path = 'src/components/pdf-editor/PdfSelectionToolbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add language prop
c = c.replace(
    'interface PdfSelectionToolbarProps {\n  pageItems: PageOperationItem[];',
    'interface PdfSelectionToolbarProps {\n  language?: string;\n  pageItems: PageOperationItem[];'
)

# 2. Update component signature
old_sig = 'export const PdfSelectionToolbar: React.FC<PdfSelectionToolbarProps> = ({\n  pageItems,'
new_sig = '''export const PdfSelectionToolbar: React.FC<PdfSelectionToolbarProps> = ({
  language = "en",
  pageItems,'''
c = c.replace(old_sig, new_sig)

# 3. Add language flags
flags = '''  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isGreek = language === "el";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";'''
c = c.replace('  const deletedPages = pageItems.filter((p) => p.isDeleted);', f'  const deletedPages = pageItems.filter((p) => p.isDeleted);\n{flags}')

# 4. Page counts (lines 73-89)
old_counts = '''            <span className="text-blue-400 font-mono text-sm font-bold">
              {activePages.length}
            </span>{" "}
            active pages{" "}
            <span className="text-slate-500 font-normal">
              (Total: {pageItems.length})
            </span>
          </div>

          {selectedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-medium">
              {selectedPages.length} selected
            </span>
          )}

          {deletedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-700/50 font-medium">
              {deletedPages.length} deleted
            </span>
          )}'''

new_counts = '''            <span className="text-blue-400 font-mono text-sm font-bold">
              {activePages.length}
            </span>{" "}
            {isRussian ? "активных страниц" : isUkrainian ? "активних сторінок" : isGreek ? "ενεργές σελίδες" : isSlovak ? "aktívnych strán" : isSlovenian ? "aktivnih strani" : isBulgarian ? "активни страници" : "active pages"}{" "}
            <span className="text-slate-500 font-normal">
              ({isRussian ? "Всего" : isUkrainian ? "Всього" : isGreek ? "Σύνολο" : isSlovak ? "Celkovo" : isSlovenian ? "Skupaj" : isBulgarian ? "Общо" : "Total"}: {pageItems.length})
            </span>
          </div>

          {selectedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50 font-medium">
              {selectedPages.length} {isRussian ? "выбрано" : isUkrainian ? "вибрано" : isGreek ? "επιλεγμένες" : isSlovak ? "vybraných" : isSlovenian ? "izbranih" : isBulgarian ? "избрани" : "selected"}
            </span>
          )}

          {deletedPages.length > 0 && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-700/50 font-medium">
              {deletedPages.length} {isRussian ? "удалено" : isUkrainian ? "вилучено" : isGreek ? "διαγραμμένες" : isSlovak ? "odstránených" : isSlovenian ? "izbrisanih" : isBulgarian ? "изтрити" : "deleted"}
            </span>
          )}'''
c = c.replace(old_counts, new_counts)

# 5. Add More PDFs button
c = c.replace(
    '                Add More PDFs\n                <input',
    '                {isRussian ? "Добавить еще PDF" : isUkrainian ? "Додати ще PDF" : isGreek ? "Προσθήκη PDF" : isSlovak ? "Pridať ďalšie PDF" : isSlovenian ? "Dodaj več PDF" : isBulgarian ? "Добавяне на още PDF" : "Add More PDFs"}\n                <input'
)

# 6. Sort by Filename
c = c.replace(
    '                  Sort by Filename\n                </button>',
    '                  {isRussian ? "Сортировать по имени" : isUkrainian ? "Сортувати за назвою" : isGreek ? "Ταξινόμηση κατά όνομα" : isSlovak ? "Zoradiť podľa názvu" : isSlovenian ? "Razvrsti po imenu" : isBulgarian ? "Сортиране по име" : "Sort by Filename"}\n                </button>'
)

# 7. Select All, Deselect All, Invert
c = c.replace(
    '            Select All\n          </button>',
    '            {isRussian ? "Выбрать все" : isUkrainian ? "Вибрати все" : isGreek ? "Επιλογή όλων" : isSlovak ? "Vybrať všetko" : isSlovenian ? "Izberi vse" : isBulgarian ? "Избери всички" : "Select All"}\n          </button>'
)

c = c.replace(
    '            Deselect All\n          </button>',
    '            {isRussian ? "Снять выбор" : isUkrainian ? "Зняти вибір" : isGreek ? "Αποεπιλογή" : isSlovak ? "Zrušiť výber" : isSlovenian ? "Prekliči izbiro" : isBulgarian ? "Отмени избора" : "Deselect All"}\n          </button>'
)

c = c.replace(
    '            Invert\n          </button>',
    '            {isRussian ? "Инвертировать" : isUkrainian ? "Інвертувати" : isGreek ? "Αντιστροφή" : isSlovak ? "Invertovať" : isSlovenian ? "Obrni izbiro" : isBulgarian ? "Инвертиране" : "Invert"}\n          </button>'
)

# 8. Rotate 90°
c = c.replace(
    '            Rotate 90°\n          </button>',
    '            {isRussian ? "Повернуть 90°" : isUkrainian ? "Повернути 90°" : isGreek ? "Περιστροφή 90°" : isSlovak ? "Otočiť 90°" : isSlovenian ? "Zavrti 90°" : isBulgarian ? "Завъртане 90°" : "Rotate 90°"}\n          </button>'
)

# 9. Rotate Odd Pages, Rotate Even Pages
c = c.replace(
    '                  Rotate Odd Pages\n                </button>',
    '                  {isRussian ? "Повернуть нечетные" : isUkrainian ? "Повернути непарні" : isGreek ? "Περιστροφή μονών" : isSlovak ? "Otočiť nepárne" : isSlovenian ? "Zavrti lihe" : isBulgarian ? "Завърти нечетните" : "Rotate Odd Pages"}\n                </button>'
)

c = c.replace(
    '                  Rotate Even Pages\n                </button>',
    '                  {isRussian ? "Повернуть четные" : isUkrainian ? "Повернути парні" : isGreek ? "Περιστροφή ζυγών" : isSlovak ? "Otočiť párne" : isSlovenian ? "Zavrti sode" : isBulgarian ? "Завърти четните" : "Rotate Even Pages"}\n                </button>'
)

# 10. Delete
c = c.replace(
    '            Delete\n          </button>',
    '            {isRussian ? "Удалить" : isUkrainian ? "Видалити" : isGreek ? "Διαγραφή" : isSlovak ? "Odstrániť" : isSlovenian ? "Izbriši" : isBulgarian ? "Изтриване" : "Delete"}\n          </button>'
)

# 11. Restore All
c = c.replace(
    '              Restore All ({deletedPages.length})\n            </button>',
    '              {isRussian ? `Восстановить все (${deletedPages.length})` : isUkrainian ? `Відновити всі (${deletedPages.length})` : isGreek ? `Επαναφορά όλων (${deletedPages.length})` : isSlovak ? `Obnoviť všetko (${deletedPages.length})` : isSlovenian ? `Obnovi vse (${deletedPages.length})` : isBulgarian ? `Възстановяване на всички (${deletedPages.length})` : `Restore All (${deletedPages.length})`}\n            </button>'
)

# 12. Split Mode Selector
c = c.replace(
    '          <span className="text-xs text-slate-400 font-medium">Split Mode:</span>',
    '          <span className="text-xs text-slate-400 font-medium">{isRussian ? "Режим разделения:" : isUkrainian ? "Режим розділення:" : isGreek ? "Λειτουργία διαχωρισμού:" : isSlovak ? "Režim rozdelenia:" : isSlovenian ? "Način razdelitve:" : isBulgarian ? "Режим на разделяне:" : "Split Mode:"}</span>'
)

c = c.replace(
    '              Split Every Page\n            </button>',
    '              {isRussian ? "Каждую страницу" : isUkrainian ? "Кожну сторінку" : isGreek ? "Κάθε σελίδα" : isSlovak ? "Každú stranu" : isSlovenian ? "Vsako stran" : isBulgarian ? "Всяка страница" : "Split Every Page"}\n            </button>'
)

c = c.replace(
    '              Split Every N Pages\n            </button>',
    '              {isRussian ? "Каждые N страниц" : isUkrainian ? "Кожні N сторінок" : isGreek ? "Κάθε N σελίδες" : isSlovak ? "Každých N strán" : isSlovenian ? "Vsakih N strani" : isBulgarian ? "На всеки N страници" : "Split Every N Pages"}\n            </button>'
)

c = c.replace(
    '              Custom Range Selection\n            </button>',
    '              {isRussian ? "Выбор диапазона" : isUkrainian ? "Вибір діапазону" : isGreek ? "Προσαρμοσμένο εύρος" : isSlovak ? "Výber rozsahu" : isSlovenian ? "Izbira obsega" : isBulgarian ? "Избор на диапазон" : "Custom Range Selection"}\n            </button>'
)

# 13. Page Range Form
c = c.replace(
    '            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">\n              Page Range:\n            </label>',
    '            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">\n              {isRussian ? "Диапазон:" : isUkrainian ? "Діапазон:" : isGreek ? "Εύρος σελίδων:" : isSlovak ? "Rozsah:" : isSlovenian ? "Obseg strani:" : isBulgarian ? "Обхват:" : "Page Range:"}\n            </label>'
)

c = c.replace(
    '            <button\n              type="submit"\n              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"\n            >\n              Select Range\n            </button>',
    '            <button\n              type="submit"\n              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"\n            >\n              {isRussian ? "Выбрать" : isUkrainian ? "Вибрати" : isGreek ? "Επιλογή" : isSlovak ? "Vybrať" : isSlovenian ? "Izberi" : isBulgarian ? "Избор" : "Select Range"}\n            </button>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("PdfSelectionToolbar localization completed")
