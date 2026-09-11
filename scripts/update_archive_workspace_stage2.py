import re

path = 'src/utils/archive/ArchiveWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Helper to find where isPolish is used in ternaries and inline expressions
# 1. Reset button
c = c.replace(
    '{isNorwegian ? "Tilbakestill" : isPolish ? "Resetuj"',
    '{isRussian ? "Сбросить" : isUkrainian ? "Скинути" : isSlovak ? "Resetovať" : isSlovenian ? "Ponastavi" : isBulgarian ? "Нулиране" : isNorwegian ? "Tilbakestill" : isPolish ? "Resetuj"'
)

# 2. Archive Name:
c = c.replace(
    '{isNorwegian ? "Arkivnavn:" : isPolish ? "Nazwa archiwum:"',
    '{isRussian ? "Имя архива:" : isUkrainian ? "Назва архіву:" : isSlovak ? "Názov archívu:" : isSlovenian ? "Ime arhiva:" : isBulgarian ? "Име на архива:" : isNorwegian ? "Arkivnavn:" : isPolish ? "Nazwa archiwum:"'
)

# 3. Download entry button
c = c.replace(
    '{isNorwegian ? "Last ned" : isPolish ? "Pobierz"',
    '{isRussian ? "Скачать" : isUkrainian ? "Завантажити" : isSlovak ? "Stiahnuť" : isSlovenian ? "Prenesi" : isBulgarian ? "Изтегляне" : isNorwegian ? "Last ned" : isPolish ? "Pobierz"'
)

# 4. Download ZIP button
c = c.replace(
    '{isNorwegian ? "Last ned ZIP" : isPolish ? "Pobierz ZIP"',
    '{isRussian ? "Скачать ZIP" : isUkrainian ? "Завантажити ZIP" : isSlovak ? "Stiahnuť ZIP" : isSlovenian ? "Prenesi ZIP" : isBulgarian ? "Изтеглете ZIP" : isNorwegian ? "Last ned ZIP" : isPolish ? "Pobierz ZIP"'
)

# 5. Failed to extract archive error
c = c.replace(
    ': isPolish\n      ? "Nie udało się wyodrębnić archiwum. Plik może być uszkodzony lub w nieobsługiwanym formacie."',
    ': isRussian\n      ? "Не удалось извлечь архив. Файл может быть поврежден или имеет неподдерживаемый формат."\n      : isUkrainian\n      ? "Не вдалося витягти архів. Файл може бути пошкодженим або мати непідтримуваний формат."\n      : isSlovak\n      ? "Nepodarilo sa extrahovať archív. Súbor môže byť poškodený alebo v nepodporovanom formáte."\n      : isSlovenian\n      ? "Arhiva ni bilo mogoče ekstrahirati. Datoteka je morda poškodovana ali v nepodprti obliki."\n      : isBulgarian\n      ? "Неуспешно извличане на архива. Файлът може да е повреден или в неподдържан формат."\n      : isPolish\n      ? "Nie udało się wyodrębnić archiwum. Plik może być uszkodzony lub w nieobsługiwanym formacie."'
)

# 6. Failed to create ZIP error
c = c.replace(
    ': isPolish\n      ? "Nie udało się utworzyć archiwum ZIP. Spróbuj ponownie z mniejszą liczbą plików."',
    ': isRussian\n      ? "Не удалось создать ZIP-архив. Попробуйте снова с меньшим количеством файлов."\n      : isUkrainian\n      ? "Не вдалося створити ZIP-архів. Спробуйте ще раз із меншою кількістю файлів."\n      : isSlovak\n      ? "Nepodarilo sa vytvoriť ZIP archív. Skúste to znova s menším počtom súborov."\n      : isSlovenian\n      ? "Ustvarjanje arhiva ZIP ni uspelo. Poskusite znova z manj datotekami."\n      : isBulgarian\n      ? "Неуспешно създаване на ZIP архив. Опитайте отново с по-малко файлове."\n      : isPolish\n      ? "Nie udało się utworzyć archiwum ZIP. Spróbuj ponownie z mniejszą liczbą plików."'
)

# 7. Converting tar/rar/7z error
c = c.replace(
    ': isPolish\n      ? `Nie udało się przekonwertować ${mode.split("-")[0].toUpperCase()} na ZIP. Sprawdź integralność archiwum.`',
    ': isRussian\n      ? `Не удалось преобразовать ${mode.split("-")[0].toUpperCase()} в ZIP. Проверьте целостность архива.`\n      : isUkrainian\n      ? `Не вдалося перетворити ${mode.split("-")[0].toUpperCase()} на ZIP. Перевірте цілісність архіву.`\n      : isSlovak\n      ? `Nepodarilo sa skonvertovať ${mode.split("-")[0].toUpperCase()} na ZIP. Skontrolujte integritu archívu.`\n      : isSlovenian\n      ? `Pretvorba ${mode.split("-")[0].toUpperCase()} v ZIP ni uspela. Preverite integriteto arhiva.`\n      : isBulgarian\n      ? `Неуспешно преобразуване на ${mode.split("-")[0].toUpperCase()} в ZIP. Проверете целостта на архива.`\n      : isPolish\n      ? `Nie udało się przekonwertować ${mode.split("-")[0].toUpperCase()} na ZIP. Sprawdź integralność archiwum.`'
)

# 8. Dropzone main title
c = c.replace(
    ': isPolish\n      ? "Upuść plik archiwum tutaj lub kliknij, aby przeglądać"',
    ': isRussian\n      ? "Перетащите архив сюда или нажмите для выбора"\n      : isUkrainian\n      ? "Перетягніть архів сюди або натисніть для вибору"\n      : isSlovak\n      ? "Pretiahnite archív sem alebo kliknite pre výber"\n      : isSlovenian\n      ? "Povlecite arhiv sem ali kliknite za brskanje"\n      : isBulgarian\n      ? "Пуснете архива тук или кликнете за избор"\n      : isPolish\n      ? "Upuść plik archiwum tutaj lub kliknij, aby przeglądać"'
)

# 9. Dropzone multiple files title
c = c.replace(
    ': isPolish\n      ? "Upuść pliki tutaj, aby utworzyć ZIP, lub kliknij, aby przeglądać"',
    ': isRussian\n      ? "Перетащите файлы сюда для создания ZIP или нажмите для выбора"\n      : isUkrainian\n      ? "Перетягніть файли сюди для створення ZIP або натисніть для вибору"\n      : isSlovak\n      ? "Pretiahnite súbory sem a vytvorte ZIP alebo kliknite pre výber"\n      : isSlovenian\n      ? "Povlecite datoteke sem, da ustvarite ZIP, ali kliknite za brskanje"\n      : isBulgarian\n      ? "Пуснете файлове тук за създаване на ZIP или кликнете за избор"\n      : isPolish\n      ? "Upuść pliki tutaj, aby utworzyć ZIP, lub kliknij, aby przeglądać"'
)

# 10. Dropzone subtitle for extraction
c = c.replace(
    ': isPolish\n      ? "Obsługuje ZIP, TAR, GZ, TGZ (w 100% lokalnie i bezpiecznie)"',
    ': isRussian\n      ? "Поддерживает ZIP, TAR, GZ, TGZ (100% локально и безопасно)"\n      : isUkrainian\n      ? "Підтримує ZIP, TAR, GZ, TGZ (100% локально та безпечно)"\n      : isSlovak\n      ? "Podporuje ZIP, TAR, GZ, TGZ (100% lokálne a bezpečne)"\n      : isSlovenian\n      ? "Podpira ZIP, TAR, GZ, TGZ (100 % lokalno in varno)"\n      : isBulgarian\n      ? "Поддържа ZIP, TAR, GZ, TGZ (100% локално и сигурно)"\n      : isPolish\n      ? "Obsługuje ZIP, TAR, GZ, TGZ (w 100% lokalnie i bezpiecznie)"'
)

# 11. Dropzone subtitle for specific formats
c = c.replace(
    ': isPolish\n      ? `Przekonwertuj archiwum ${mode.split("-")[0].toUpperCase()} bezpośrednio na ZIP w przeglądarce`',
    ': isRussian\n      ? `Конвертируйте архив ${mode.split("-")[0].toUpperCase()} прямо в ZIP в браузере`\n      : isUkrainian\n      ? `Конвертуйте архів ${mode.split("-")[0].toUpperCase()} безпосередньо в ZIP у браузері`\n      : isSlovak\n      ? `Konvertujte archív ${mode.split("-")[0].toUpperCase()} priamo na ZIP vo vašom prehliadači`\n      : isSlovenian\n      ? `Pretvorite arhiv ${mode.split("-")[0].toUpperCase()} neposredno v ZIP v brskalniku`\n      : isBulgarian\n      ? `Преобразувайте архив ${mode.split("-")[0].toUpperCase()} директно в ZIP във вашия браузър`\n      : isPolish\n      ? `Przekonwertuj archiwum ${mode.split("-")[0].toUpperCase()} bezpośrednio na ZIP w przeglądarce`'
)

# 12. Dropzone subtitle for creation
c = c.replace(
    ': isPolish\n      ? "Wybierz dowolne pliki z komputera, aby skompresować je do jednego ZIP"',
    ': isRussian\n      ? "Выберите любые файлы на вашем компьютере для сжатия в единый ZIP"\n      : isUkrainian\n      ? "Виберіть будь-які файли на комп’ютері для стиснення в один ZIP"\n      : isSlovak\n      ? "Vyberte akékoľvek súbory z počítača a skomprimujte ich do jedného ZIP"\n      : isSlovenian\n      ? "Izberite poljubne datoteke iz računalnika za stiskanje v en ZIP"\n      : isBulgarian\n      ? "Изберете всякакви файлове от компютъра си за компресиране в един ZIP"\n      : isPolish\n      ? "Wybierz dowolne pliki z komputera, aby skompresować je do jednego ZIP"'
)

# 13. Compressing files into ZIP... / Create ZIP archive button
c = c.replace(
    ': isPolish\n                      ? "Kompresowanie plików do formatu ZIP..."',
    ': isRussian\n                      ? "Сжатие файлов в ZIP..."\n                      : isUkrainian\n                      ? "Стиснення файлів у ZIP..."\n                      : isSlovak\n                      ? "Komprimovanie súborov do ZIP..."\n                      : isSlovenian\n                      ? "Stiskanje datotek v ZIP..."\n                      : isBulgarian\n                      ? "Компресиране на файлове в ZIP..."\n                      : isPolish\n                      ? "Kompresowanie plików do formatu ZIP..."'
)

c = c.replace(
    ': (isNorwegian\n                      ? "Opprett ZIP-arkiv"\n                      : isPolish\n                      ? "Utwórz archiwum ZIP"',
    ': (isRussian\n                      ? "Создать ZIP-архив"\n                      : isUkrainian\n                      ? "Створити ZIP-архів"\n                      : isSlovak\n                      ? "Vytvoriť ZIP archív"\n                      : isSlovenian\n                      ? "Ustvari ZIP arhiv"\n                      : isBulgarian\n                      ? "Създаване на ZIP архив"\n                      : isNorwegian\n                      ? "Opprett ZIP-arkiv"\n                      : isPolish\n                      ? "Utwórz archiwum ZIP"'
)

# 14. Extracted files list title
c = c.replace(
    ': isPolish\n                  ? `Wyodrębnione pliki (${extractedEntries.length}):`',
    ': isRussian\n                  ? `Извлеченные файлы (${extractedEntries.length}):`\n                  : isUkrainian\n                  ? `Вилучені файли (${extractedEntries.length}):`\n                  : isSlovak\n                  ? `Extrahované súbory (${extractedEntries.length}):`\n                  : isSlovenian\n                  ? `Ekstrahirane datoteke (${extractedEntries.length}):`\n                  : isBulgarian\n                  ? `Извлечени файлове (${extractedEntries.length}):`\n                  : isPolish\n                  ? `Wyodrębnione pliki (${extractedEntries.length}):`'
)

# 15. Ready ZIP status
c = c.replace(
    ': isPolish\n                    ? `✓ ZIP gotowy: ${outputFileName}`',
    ': isRussian\n                    ? `✓ ZIP готов: ${outputFileName}`\n                    : isUkrainian\n                    ? `✓ ZIP готовий: ${outputFileName}`\n                    : isSlovak\n                    ? `✓ ZIP pripravený: ${outputFileName}`\n                    : isSlovenian\n                    ? `✓ ZIP pripravljen: ${outputFileName}`\n                    : isBulgarian\n                    ? `✓ ZIP архивът е готов: ${outputFileName}`\n                    : isPolish\n                    ? `✓ ZIP gotowy: ${outputFileName}`'
)

# 16. Size info
c = c.replace(
    ': isPolish\n                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% W przeglądarce`',
    ': isRussian\n                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · 100% В браузере`\n                    : isUkrainian\n                    ? `Розмір: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} МБ · 100% У браузері`\n                    : isSlovak\n                    ? `Veľkosť: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% V prehliadači`\n                    : isSlovenian\n                    ? `Velikost: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100 % V brskalniku`\n                    : isBulgarian\n                    ? `Размер: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% В браузъра`\n                    : isPolish\n                    ? `Rozmiar: ${((outputBlob?.size || 0) / 1024 / 1024).toFixed(2)} MB · 100% W przeglądarce`'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Stage 2 ArchiveWorkspace updated completely")
