import sys

path = 'src/utils/ebook/EbookWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

sys.stdout.buffer.write(b"Total lines: " + str(len(lines)).encode('utf-8') + b"\n")
for idx, line in enumerate(lines[:50]):
    sys.stdout.buffer.write(f"{idx+1}: {line}".encode('utf-8'))
