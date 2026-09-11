import sys

with open('src/utils/archive/ArchiveWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'Drop archive' in line or 'Drop file' in line or 'drag' in line.lower() or 'drop' in line.lower():
        sys.stdout.buffer.write(f"Line {idx+1}: {repr(line.strip())}\n".encode('utf-8'))
