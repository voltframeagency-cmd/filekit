import sys

with open('src/utils/archive/ArchiveWorkspace.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def show_block(start, end):
    for i in range(start-1, min(end, len(lines))):
        s = f"{i+1}: {repr(lines[i].strip())}\n"
        sys.stdout.buffer.write(s.encode('utf-8'))

sys.stdout.buffer.write(b"=== Lines 65-80 ===\n")
show_block(65, 80)
sys.stdout.buffer.write(b"=== Lines 520-545 ===\n")
show_block(520, 545)
sys.stdout.buffer.write(b"=== Lines 665-680 ===\n")
show_block(665, 680)
sys.stdout.buffer.write(b"=== Lines 755-770 ===\n")
show_block(755, 770)
