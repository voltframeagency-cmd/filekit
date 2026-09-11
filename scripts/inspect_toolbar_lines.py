import sys

path = 'src/components/pdf-editor/PdfSelectionToolbar.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines[50:180]):
    sys.stdout.buffer.write(f"{idx+51}: {line}".encode('utf-8'))
