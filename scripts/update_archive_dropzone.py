import sys

path = 'src/utils/archive/ArchiveWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Line 334+: Drop files to zip together
c = c.replace(
    ': isPolish\n                  ? "Upuść pliki, aby spakować je do archiwum ZIP"',
    ': isRussian\n                  ? "Перетащите файлы для упаковки в ZIP-архив"\n                  : isUkrainian\n                  ? "Перетягніть файли для пакування в ZIP-архів"\n                  : isSlovak\n                  ? "Pretiahnite súbory na zabalenie do ZIP archívu"\n                  : isSlovenian\n                  ? "Povlecite datoteke, da jih stisnete v ZIP arhiv"\n                  : isBulgarian\n                  ? "Пуснете файлове, за да ги пакетирате в ZIP архив"\n                  : isPolish\n                  ? "Upuść pliki, aby spakować je do archiwum ZIP"'
)

# 2. Line 370+: Select archive file to extract
c = c.replace(
    ': isPolish\n                  ? "Wybierz plik archiwum do wyodrębnienia lub konwersji"',
    ': isRussian\n                  ? "Выберите архив для распаковки или конвертации"\n                  : isUkrainian\n                  ? "Виберіть архівний файл для розпакування або конвертації"\n                  : isSlovak\n                  ? "Vyberte súbor archívu na extrakciu alebo konverziu"\n                  : isSlovenian\n                  ? "Izberite arhivsko datoteko za ekstrakcijo ali pretvorbo"\n                  : isBulgarian\n                  ? "Изберете архивен файл за извличане или преобразуване"\n                  : isPolish\n                  ? "Wybierz plik archiwum do wyodrębnienia lub konwersji"'
)

# 3. Line 407+: Supports all file formats
c = c.replace(
    ': isPolish\n                  ? "Obsługuje wszystkie formaty plików (wielokrotny wybór)"',
    ': isRussian\n                  ? "Поддерживает все форматы файлов (множественный выбор)"\n                  : isUkrainian\n                  ? "Підтримує всі формати файлів (множинний вибір)"\n                  : isSlovak\n                  ? "Podporuje všetky formáty súborov (viacnásobný výber)"\n                  : isSlovenian\n                  ? "Podpira vse oblike datotek (večkratna izbira)"\n                  : isBulgarian\n                  ? "Поддържа всички файлови формати (множествен избор)"\n                  : isPolish\n                  ? "Obsługuje wszystkie formaty plików (wielokrotny wybór)"'
)

# 4. Line 443+: Processed locally inside your browser
c = c.replace(
    ': isPolish\n                  ? "Przetwarzanie w 100% lokalnie w przeglądarce"',
    ': isRussian\n                  ? "100% локальная обработка в вашем браузере"\n                  : isUkrainian\n                  ? "100% локальна обробка у вашому браузері"\n                  : isSlovak\n                  ? "100% lokálne spracovanie vo vašom prehliadači"\n                  : isSlovenian\n                  ? "100 % lokalna obdelava v vašem brskalniku"\n                  : isBulgarian\n                  ? "100% локална обработка във вашия браузър"\n                  : isPolish\n                  ? "Przetwarzanie w 100% lokalnie w przeglądarce"'
)

# 5. Line 484+: X files selected
c = c.replace(
    ': isPolish\n                  ? `${files.length} ${files.length === 1 ? "plik wybrany" : "plików wybranych"}`',
    ': isRussian\n                  ? `${files.length} ${files.length === 1 ? "файл выбран" : "файлов выбрано"}`\n                  : isUkrainian\n                  ? `${files.length} ${files.length === 1 ? "файл вибрано" : "файлів вибрано"}`\n                  : isSlovak\n                  ? `${files.length} ${files.length === 1 ? "súbor vybraný" : "súborov vybraných"}`\n                  : isSlovenian\n                  ? `${files.length} ${files.length === 1 ? "datoteka izbrana" : "datotek izbranih"}`\n                  : isBulgarian\n                  ? `${files.length} ${files.length === 1 ? "избран файл" : "избрани файла"}`\n                  : isPolish\n                  ? `${files.length} ${files.length === 1 ? "plik wybrany" : "plików wybranych"}`'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Dropzone text updated with Russian, Ukrainian, Slovak, Slovenian, Bulgarian")
