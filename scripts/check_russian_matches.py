import sys

with open('src/utils/archive/ArchiveWorkspace.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('isRussian')
while idx != -1:
    line_start = c.rfind('\n', 0, idx) + 1
    line_end = c.find('\n', idx)
    snippet = c[line_start:line_end].strip()
    sys.stdout.buffer.write(f"Match: {snippet}\n".encode('utf-8'))
    idx = c.find('isRussian', idx + 1)
