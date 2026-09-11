import sys

path = 'src/components/pdf-overlay/PdfOverlayWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines[120:230]):
    sys.stdout.buffer.write(f"{idx+121}: {line}".encode('utf-8'))
