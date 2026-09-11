with open('src/utils/archive/ArchiveWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'isGreek' in line:
        print(f"Line {idx+1}: {line.strip()[:80]}")
