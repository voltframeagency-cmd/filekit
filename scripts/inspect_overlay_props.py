import sys

with open('src/components/pdf-overlay/PdfOverlayWorkspace.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('export const PdfOverlayWorkspace')
print(c[idx:idx+400])
