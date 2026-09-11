import sys

path = 'src/utils/ebook/EbookWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = [86, 162, 199, 249, 259, 302, 339, 379]
for t in targets:
    sys.stdout.buffer.write(f"\n--- Line {t} ---\n".encode('utf-8'))
    for i in range(max(0, t-3), min(len(lines), t+12)):
        sys.stdout.buffer.write(f"{i+1}: {lines[i]}".encode('utf-8'))
