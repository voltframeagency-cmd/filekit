import re

path = 'src/utils/archive/ArchiveWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update ArchiveWorkspaceProps
c = c.replace(
    '  mode: "extract" | "create" | "tar-to-zip" | "rar-to-zip" | "extract-rar" | "7z-to-zip";\n  title?: string;\n  description?: string;\n  embedded?: boolean;',
    '  mode: "extract" | "create" | "tar-to-zip" | "rar-to-zip" | "extract-rar" | "7z-to-zip";\n  title?: string;\n  description?: string;\n  embedded?: boolean;\n  language?: string;'
)

# 2. Update component signature & language extraction
old_sig = 'export function ArchiveWorkspace({ mode, title, description, embedded = true }: ArchiveWorkspaceProps) {\n  const { language } = useLanguage();'
new_sig = '''export function ArchiveWorkspace({ mode, title, description, embedded = true, language: propLang }: ArchiveWorkspaceProps) {
  const { language: ctxLang } = useLanguage();
  const language = propLang || ctxLang || "en";
  const isRussian = language === "ru";
  const isUkrainian = language === "uk";
  const isSlovak = language === "sk";
  const isSlovenian = language === "sl";
  const isBulgarian = language === "bg";'''

c = c.replace(old_sig, new_sig)

# Let's inspect where error and status strings are:
# Line 65: No files found
c = c.replace(
    ': isPolish\n      ? "Nie znaleziono plików w archiwum lub archiwum jest puste."',
    ': isRussian\n      ? "В архиве не найдено файлов или архив пуст."\n      : isUkrainian\n      ? "В архіві не знайдено файлів або архів порожній."\n      : isSlovak\n      ? "V archíve sa nenašli žiadne súbory alebo je archív prázdny."\n      : isSlovenian\n      ? "V arhivu ni bilo najdenih datotek ali pa je arhiv prazen."\n      : isBulgarian\n      ? "В архива не са намерени файлове или архивът е празен."\n      : isPolish\n      ? "Nie znaleziono plików w archiwum lub archiwum jest puste."'
)

# Line 105+: Failed to extract
# Let's check other ternary blocks
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Stage 1 ArchiveWorkspace updated")
