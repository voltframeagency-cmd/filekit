import sys

path = 'src/utils/ebook/EbookWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'isPolish' in line or 'isGreek' in line:
        sys.stdout.buffer.write(f"Line {idx+1}: {line.strip()[:80]}\n".encode('utf-8'))
