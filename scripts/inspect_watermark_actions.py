import sys

path = 'src/components/pdf-overlay/PdfWatermarkControls.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines[250:320]):
    sys.stdout.buffer.write(f"{idx+251}: {line}".encode('utf-8'))
