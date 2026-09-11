import sys

path = 'src/components/pdf-editor/PdfPageEditorWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'actionButtonText' in line or 'PdfSelectionToolbar' in line or 'Process PDF' in line:
        sys.stdout.buffer.write(f"{idx+1}: {line.strip()}\n".encode('utf-8'))
