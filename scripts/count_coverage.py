with open('src/components/navigation/megaMenuTranslations.ts', 'r', encoding='utf-8') as f:
    code = f.read()

LOCALES = [
    'en', 'es', 'es-419', 'de', 'fr', 'pt', 'pt-BR', 'it', 'nl', 'ca',
    'sv', 'da', 'fi', 'no', 'pl', 'cs', 'hu', 'ro', 'bg', 'el',
    'sk', 'sl', 'ru', 'uk', 'lv', 'lt', 'tr', 'ar', 'he', 'hi',
    'id', 'ms', 'th', 'vi', 'fil', 'ja', 'ko', 'zh-CN', 'zh-TW'
]

print("=== MEGA MENU TRANSLATION COVERAGE ===")
for loc in LOCALES:
    count = code.count(f'"{loc}":') + code.count(f'{loc}:')
    print(f'{loc:6s}: {count:3d} entries')
