import sys

path = 'src/utils/privacy/PrivacyWorkspace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = [70, 127, 203, 240, 281, 289, 295, 332, 368, 385, 420, 460, 497, 537]
for t in targets:
    sys.stdout.buffer.write(f"\n--- Line {t} ---\n".encode('utf-8'))
    for i in range(max(0, t-3), min(len(lines), t+12)):
        sys.stdout.buffer.write(f"{i+1}: {lines[i]}".encode('utf-8'))
