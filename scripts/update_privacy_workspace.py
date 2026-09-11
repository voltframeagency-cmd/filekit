import re

path = 'src/utils/privacy/PrivacyWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update props interface
c = c.replace(
    'interface PrivacyWorkspaceProps {\n  title?: string;\n  description?: string;\n  embedded?: boolean;\n}',
    'interface PrivacyWorkspaceProps {\n  title?: string;\n  description?: string;\n  embedded?: boolean;\n  language?: string;\n}'
)

# 2. Update signature & language flags
old_sig = 'export function PrivacyWorkspace({ title, description, embedded = true }: PrivacyWorkspaceProps) {\n  const { language } = useLanguage();'
new_sig = '''export function PrivacyWorkspace({ title, description, embedded = true, language: propLang }: PrivacyWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";'''

c = c.replace(old_sig, new_sig)

# 3. Inspect metadata error (Line 70)
c = c.replace(
    ': isPolish\n          ? "Nie udało się sprawdzić metadanych pliku."',
    ': isRussian\n          ? "Не удалось проверить метаданные файла."\n          : isUkrainian\n          ? "Не вдалося перевірити метадані файлу."\n          : isSlovak\n          ? "Nepodarilo sa skontrolovať metadáta súboru."\n          : isSlovenian\n          ? "Metapodatkov datoteke ni bilo mogoče pregledati."\n          : isBulgarian\n          ? "Неуспешна проверка на метаданните на файла."\n          : isPolish\n          ? "Nie udało się sprawdzić metadanych pliku."'
)

# 4. Strip metadata error (Line 127)
c = c.replace(
    ': isPolish\n          ? "Nie udało się usunąć metadanych z pliku."',
    ': isRussian\n          ? "Не удалось удалить метаданные из файла."\n          : isUkrainian\n          ? "Не вдалося вилучити метадані з файлу."\n          : isSlovak\n          ? "Nepodarilo sa odstrániť metadáta zo súboru."\n          : isSlovenian\n          ? "Metapodatkov ni bilo mogoče odstraniti iz datoteke."\n          : isBulgarian\n          ? "Неуспешно премахване на метаданните от файла."\n          : isPolish\n          ? "Nie udało się usunąć metadanych z pliku."'
)

# 5. Dropzone title (Line 203)
c = c.replace(
    ': isPolish\n              ? "Wybierz zdjęcia, aby usunąć metadane"',
    ': isRussian\n              ? "Выберите фотографии для удаления метаданных"\n              : isUkrainian\n              ? "Виберіть фотографії для вилучення метаданих"\n              : isSlovak\n              ? "Vyberte fotografie na odstránenie metadát"\n              : isSlovenian\n              ? "Izberite fotografije za odstranitev metapodatkov"\n              : isBulgarian\n              ? "Изберете снимки за премахване на метаданни"\n              : isPolish\n              ? "Wybierz zdjęcia, aby usunąć metadane"'
)

# 6. Dropzone subtitle (Line 240)
c = c.replace(
    ': isPolish\n              ? "Obsługuje JPG, PNG i WebP (100% prywatne przetwarzanie)"',
    ': isRussian\n              ? "Поддерживает JPG, PNG и WebP (100% приватная обработка)"\n              : isUkrainian\n              ? "Підтримує JPG, PNG та WebP (100% приватна обробка)"\n              : isSlovak\n              ? "Podporuje JPG, PNG a WebP (100% súkromné spracovanie)"\n              : isSlovenian\n              ? "Podpira JPG, PNG in WebP (100 % zasebna obdelava)"\n              : isBulgarian\n              ? "Поддържа JPG, PNG и WebP (100% частна обработка)"\n              : isPolish\n              ? "Obsługuje JPG, PNG i WebP (100% prywatne przetwarzanie)"'
)

# 7. File Details (Line 281)
c = c.replace(
    '{isNorwegian ? "Fildetaljer" : isPolish ? "Szczegóły pliku"',
    '{isRussian ? "Сведения о файле" : isUkrainian ? "Відомості про файл" : isSlovak ? "Podrobnosti o súbore" : isSlovenian ? "Podrobnosti o datoteki" : isBulgarian ? "Подробности за файла" : isNorwegian ? "Fildetaljer" : isPolish ? "Szczegóły pliku"'
)

# 8. Detected metadata (Line 289)
c = c.replace(
    '{isNorwegian ? "Oppdagede metadata" : isPolish ? "Wykryte metadane"',
    '{isRussian ? "Обнаруженные метаданные" : isUkrainian ? "Виявлені метадані" : isSlovak ? "Zistené metadáta" : isSlovenian ? "Zaznani metapodatki" : isBulgarian ? "Открити метаданни" : isNorwegian ? "Oppdagede metadata" : isPolish ? "Wykryte metadane"'
)

# 9. GPS location string (Line 295)
c = c.replace(
    ': isPolish\n                    ? `Lokalizacja GPS: ${metadata?.hasGps ? "Wykryta (Zagrożenie)" : "Czysta"}`',
    ': isRussian\n                    ? `Геолокация GPS: ${metadata?.hasGps ? "Обнаружена (Риск)" : "Чисто"}`\n                    : isUkrainian\n                    ? `Геолокація GPS: ${metadata?.hasGps ? "Виявлено (Ризик)" : "Чисто"}`\n                    : isSlovak\n                    ? `Poloha GPS: ${metadata?.hasGps ? "Zistená (Riziko)" : "Čistá"}`\n                    : isSlovenian\n                    ? `Lokacija GPS: ${metadata?.hasGps ? "Zaznana (Tveganje)" : "Čisto"}`\n                    : isBulgarian\n                    ? `GPS местоположение: ${metadata?.hasGps ? "Открито (Риск)" : "Чисто"}`\n                    : isPolish\n                    ? `Lokalizacja GPS: ${metadata?.hasGps ? "Wykryta (Zagrożenie)" : "Czysta"}`'
)

# 10. EXIF tags string (Line 332)
c = c.replace(
    ': isPolish\n                    ? `Tagi EXIF: ${metadata?.hasExif ? "Wykryte" : "Brak"}`',
    ': isRussian\n                    ? `Теги EXIF: ${metadata?.hasExif ? "Обнаружены" : "Нет"}`\n                    : isUkrainian\n                    ? `Теги EXIF: ${metadata?.hasExif ? "Виявлено" : "Немає"}`\n                    : isSlovak\n                    ? `Značky EXIF: ${metadata?.hasExif ? "Zistené" : "Žiadne"}`\n                    : isSlovenian\n                    ? `Oznake EXIF: ${metadata?.hasExif ? "Zaznane" : "Brez"}`\n                    : isBulgarian\n                    ? `EXIF тагове: ${metadata?.hasExif ? "Открити" : "Няма"}`\n                    : isPolish\n                    ? `Tagi EXIF: ${metadata?.hasExif ? "Wykryte" : "Brak"}`'
)

# 11. Camera: label (Line 368)
c = c.replace(
    '{isNorwegian ? "Kamera:" : isPolish ? "Aparat:"',
    '{isRussian ? "Камера:" : isUkrainian ? "Камера:" : isSlovak ? "Fotoaparát:" : isSlovenian ? "Kamera:" : isBulgarian ? "Камера:" : isNorwegian ? "Kamera:" : isPolish ? "Aparat:"'
)

# 12. Stripping image... button text (Line 385)
c = c.replace(
    ': isPolish\n                    ? "Czyszczenie obrazu..."',
    ': isRussian\n                    ? "Очистка изображения..."\n                    : isUkrainian\n                    ? "Очищення зображення..."\n                    : isSlovak\n                    ? "Čistenie obrázka..."\n                    : isSlovenian\n                    ? "Čiščenje slike..."\n                    : isBulgarian\n                    ? "Изчистване на изображението..."\n                    : isPolish\n                    ? "Czyszczenie obrazu..."'
)

# 13. Strip all EXIF and GPS button (Line 420)
c = c.replace(
    ': isPolish\n                    ? "Usuń wszystkie metadane EXIF i GPS"',
    ': isRussian\n                    ? "Удалить все метаданные EXIF и GPS"\n                    : isUkrainian\n                    ? "Вилучити всі метадані EXIF та GPS"\n                    : isSlovak\n                    ? "Odstrániť všetky metadáta EXIF a GPS"\n                    : isSlovenian\n                    ? "Odstrani vse metapodatke EXIF in GPS"\n                    : isBulgarian\n                    ? "Премахване на всички EXIF и GPS метаданни"\n                    : isPolish\n                    ? "Usuń wszystkie metadane EXIF i GPS"'
)

# 14. Image cleaned success banner (Line 460)
c = c.replace(
    ': isPolish\n                    ? "✓ Zdjęcie wyczyszczone (Brak danych GPS lub aparatu)"',
    ': isRussian\n                    ? "✓ Фотография очищена (Данные GPS и камеры удалены)"\n                    : isUkrainian\n                    ? "✓ Фотографію очищено (Дані GPS та камери видалено)"\n                    : isSlovak\n                    ? "✓ Fotografia vyčistená (Bez údajov GPS alebo fotoaparátu)"\n                    : isSlovenian\n                    ? "✓ Slika očiščena (Brez podatkov GPS ali fotoaparata)"\n                    : isBulgarian\n                    ? "✓ Снимката е изчистена (Без данни за GPS или камера)"\n                    : isPolish\n                    ? "✓ Zdjęcie wyczyszczone (Brak danych GPS lub aparatu)"'
)

# 15. Ready to download: (Line 497)
c = c.replace(
    ': isPolish\n                    ? `Gotowe do pobrania: clean_${file.name}`',
    ': isRussian\n                    ? `Готово к скачиванию: clean_${file.name}`\n                    : isUkrainian\n                    ? `Готово до завантаження: clean_${file.name}`\n                    : isSlovak\n                    ? `Pripravené na stiahnutie: clean_${file.name}`\n                    : isSlovenian\n                    ? `Pripravljeno za prenos: clean_${file.name}`\n                    : isBulgarian\n                    ? `Готово за изтегляне: clean_${file.name}`\n                    : isPolish\n                    ? `Gotowe do pobrania: clean_${file.name}`'
)

# 16. Download Clean Photo button (Line 537)
c = c.replace(
    '{isNorwegian ? "Last ned renset bilde" : isPolish ? "Pobierz wyczyszczone zdjęcie"',
    '{isRussian ? "Скачать очищенное фото" : isUkrainian ? "Завантажити очищене фото" : isSlovak ? "Stiahnuť vyčistenú fotografiu" : isSlovenian ? "Prenesi očiščeno sliko" : isBulgarian ? "Изтеглете изчистената снимка" : isNorwegian ? "Last ned renset bilde" : isPolish ? "Pobierz wyczyszczone zdjęcie"'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("PrivacyWorkspace successfully updated with Russian, Ukrainian, Slovak, Slovenian, Bulgarian")
