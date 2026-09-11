import re

# 1. Update UniversalToolPage.tsx to pass language={locale}
path = 'src/components/layout/UniversalToolPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Pass language={locale} to PdfOverlayWorkspace
c = c.replace('<PdfOverlayWorkspace />', '<PdfOverlayWorkspace language={locale} />')

# Pass language={locale} to ArchiveWorkspace
c = re.sub(
    r'<ArchiveWorkspace\s+mode=\{mode\}\s+title=\{meta\.title\}\s+description=\{meta\.description\}\s*/>',
    '<ArchiveWorkspace\n          mode={mode}\n          title={meta.title}\n          description={meta.description}\n          language={locale}\n        />',
    c
)

# Pass language={locale} to PrivacyWorkspace
c = re.sub(
    r'<PrivacyWorkspace\s+title=\{meta\.title\}\s+description=\{meta\.description\}\s*/>',
    '<PrivacyWorkspace\n          title={meta.title}\n          description={meta.description}\n          language={locale}\n        />',
    c
)

# Pass language={locale} to EbookWorkspace
c = re.sub(
    r'<EbookWorkspace\s+mode=\{ebookMode\}\s+title=\{meta\.title\}\s+description=\{meta\.description\}\s*/>',
    '<EbookWorkspace\n          mode={ebookMode}\n          title={meta.title}\n          description={meta.description}\n          language={locale}\n        />',
    c
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated UniversalToolPage.tsx successfully")
