import sys

path = 'src/utils/ebook/EbookWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update props interface
c = c.replace(
    'interface EbookWorkspaceProps {\n  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";\n  title?: string;\n  description?: string;\n  embedded?: boolean;\n}',
    'interface EbookWorkspaceProps {\n  mode: "epub-to-pdf" | "pdf-to-epub" | "mobi-to-pdf" | "azw3-to-pdf";\n  title?: string;\n  description?: string;\n  embedded?: boolean;\n  language?: string;\n}'
)

# 2. Update signature & language extraction
old_sig = 'export function EbookWorkspace({ mode, title, description, embedded = true }: EbookWorkspaceProps) {\n  const { language } = useLanguage();'
new_sig = '''export function EbookWorkspace({ mode, title, description, embedded = true, language: propLang }: EbookWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";'''

c = c.replace(old_sig, new_sig)

# 3. Conversion error (Line 86)
c = c.replace(
    ': isPolish\n          ? "Nie udało się przekonwertować e-booka na PDF. Upewnij się, że plik nie posiada zabezpieczenia DRM."',
    ': isRussian\n          ? "Не удалось конвертировать электронную книгу в PDF. Убедитесь, что файл не защищен DRM."\n          : isUkrainian\n          ? "Не вдалося конвертувати електронну книгу в PDF. Переконайтеся, що файл не захищений DRM."\n          : isSlovak\n          ? "Nepodarilo sa skonvertovať e-knihu na PDF. Uistite sa, že súbor nie je chránený DRM."\n          : isSlovenian\n          ? "E-knjige ni bilo mogoče pretvoriti v PDF. Prepričajte se, da datoteka nima zaščite DRM."\n          : isBulgarian\n          ? "Неуспешно конвертиране на електронната книга в PDF. Уверете се, че файлът няма DRM защита."\n          : isPolish\n          ? "Nie udało się przekonwertować e-booka na PDF. Upewnij się, że plik nie posiada zabezpieczenia DRM."'
)

# 4. Dropzone select ebook (Line 162)
c = c.replace(
    ': isPolish\n              ? `Wybierz plik e-booka (${getAcceptExtensions().toUpperCase()})`',
    ': isRussian\n              ? `Выберите файл электронной книги (${getAcceptExtensions().toUpperCase()})`\n              : isUkrainian\n              ? `Виберіть файл електронної книги (${getAcceptExtensions().toUpperCase()})`\n              : isSlovak\n              ? `Vyberte súbor e-knihy (${getAcceptExtensions().toUpperCase()})`\n              : isSlovenian\n              ? `Izberite datoteko e-knjige (${getAcceptExtensions().toUpperCase()})`\n              : isBulgarian\n              ? `Изберете файл с електронна книга (${getAcceptExtensions().toUpperCase()})`\n              : isPolish\n              ? `Wybierz plik e-booka (${getAcceptExtensions().toUpperCase()})`'
)

# 5. Dropzone privacy subtitle (Line 199)
c = c.replace(
    ': isPolish\n              ? "Bez przesyłania na serwer · W 100% prywatna konwersja w przeglądarce"',
    ': isRussian\n              ? "Без отправки на сервер · 100% приватная конвертация в браузере"\n              : isUkrainian\n              ? "Без завантаження на сервер · 100% приватна конвертація у браузері"\n              : isSlovak\n              ? "Žiadne nahrávanie na server · 100% súkromná konverzia v prehliadači"\n              : isSlovenian\n              ? "Brez nalaganja na strežnik · 100 % zasebna pretvorba v brskalniku"\n              : isBulgarian\n              ? "Без качване на сървър · 100% частно конвертиране в браузъра"\n              : isPolish\n              ? "Bez przesyłania na serwer · W 100% prywatna konwersja w przeglądarce"'
)

# 6. Change file button (Line 249)
c = c.replace(
    '{isNorwegian ? "Endre fil" : isPolish ? "Zmień plik"',
    '{isRussian ? "Изменить файл" : isUkrainian ? "Змінити файл" : isSlovak ? "Zmeniť súbor" : isSlovenian ? "Spremeni datoteko" : isBulgarian ? "Промяна на файла" : isNorwegian ? "Endre fil" : isPolish ? "Zmień plik"'
)

# 7. Rendering pages... (Line 259)
c = c.replace(
    ': isPolish\n                  ? "Renderowanie stron e-booka do PDF..."',
    ': isRussian\n                  ? "Рендеринг страниц электронной книги в PDF..."\n                  : isUkrainian\n                  ? "Рендеринг сторінок електронної книги в PDF..."\n                  : isSlovak\n                  ? "Vykresľovanie stránok e-knihy do PDF..."\n                  : isSlovenian\n                  ? "Upodabljanje strani e-knjige v PDF..."\n                  : isBulgarian\n                  ? "Визуализиране на страници от електронна книга в PDF..."\n                  : isPolish\n                  ? "Renderowanie stron e-booka do PDF..."'
)

# 8. Converted status (Line 302)
c = c.replace(
    ': isPolish\n                    ? `✓ Skonwertowano: ${outputFileName}`',
    ': isRussian\n                    ? `✓ Сконвертировано: ${outputFileName}`\n                    : isUkrainian\n                    ? `✓ Сконвертовано: ${outputFileName}`\n                    : isSlovak\n                    ? `✓ Skonvertované: ${outputFileName}`\n                    : isSlovenian\n                    ? `✓ Pretvorjeno: ${outputFileName}`\n                    : isBulgarian\n                    ? `✓ Конвертирано: ${outputFileName}`\n                    : isPolish\n                    ? `✓ Skonwertowano: ${outputFileName}`'
)

# 9. Size info (Line 339)
c = c.replace(
    ': isPolish\n                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`',
    ': isRussian\n                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · Документ PDF`\n                    : isUkrainian\n                    ? `Розмір: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · Документ PDF`\n                    : isSlovak\n                    ? `Veľkosť: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`\n                    : isSlovenian\n                    ? `Velikost: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`\n                    : isBulgarian\n                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · PDF документ`\n                    : isPolish\n                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · Dokument PDF`'
)

# 10. Download PDF button (Line 379)
c = c.replace(
    '{isNorwegian ? "Last ned PDF" : isPolish ? "Pobierz PDF"',
    '{isRussian ? "Скачать PDF" : isUkrainian ? "Завантажити PDF" : isSlovak ? "Stiahnuť PDF" : isSlovenian ? "Prenesi PDF" : isBulgarian ? "Изтеглете PDF" : isNorwegian ? "Last ned PDF" : isPolish ? "Pobierz PDF"'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("EbookWorkspace successfully updated with Russian, Ukrainian, Slovak, Slovenian, Bulgarian")
