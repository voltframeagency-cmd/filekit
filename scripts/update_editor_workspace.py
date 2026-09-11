import sys

path = 'src/components/pdf-editor/PdfPageEditorWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Pass language to PdfSelectionToolbar
c = c.replace(
    '<PdfSelectionToolbar\n              pageItems={pageItems}',
    '<PdfSelectionToolbar\n              language={language}\n              pageItems={pageItems}'
)

# Localize bottom sticky button "({activePages.length} Pages)"
old_btn = '{actionButtonText} ({activePages.length} Pages)'
new_btn = '''{actionButtonText} ({activePages.length} {
                  language === "ru" ? "страниц" :
                  language === "uk" ? "сторінок" :
                  language === "el" ? "σελίδες" :
                  language === "sk" ? "strán" :
                  language === "sl" ? "strani" :
                  language === "bg" ? "страници" : "Pages"
                })'''
c = c.replace(old_btn, new_btn)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("PdfPageEditorWorkspace updated with language pass-down")
