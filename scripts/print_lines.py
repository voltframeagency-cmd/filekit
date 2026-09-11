import sys

with open('src/utils/archive/ArchiveWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(320, 390):
    sys.stdout.buffer.write(f"{i+1}: {lines[i]}".encode('utf-8'))
