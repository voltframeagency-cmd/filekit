import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

registry_file = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\lib\seo\contentRegistry.ts'

with open(registry_file, 'r', encoding='utf-8') as f:
    text = f.read()

# Extract header (types and export declaration)
header_end = text.find('export const toolContentRegistry: Record<string, ToolContentRecord> = {')
header = text[:header_end + len('export const toolContentRegistry: Record<string, ToolContentRecord> = {')]

# Extract all record blocks
records_text = text[header_end + len('export const toolContentRegistry: Record<string, ToolContentRecord> = {'):]

# Regex match individual entries
matches = list(re.finditer(r"\n\s*'([a-z0-9-]+)':\s*\{", records_text))

seen_keys = set()
unique_blocks = []

for i in range(len(matches)):
    start = matches[i].start()
    end = matches[i+1].start() if i + 1 < len(matches) else records_text.rfind('};')
    key = matches[i].group(1)

    if key not in seen_keys:
        seen_keys.add(key)
        block = records_text[start:end].rstrip()
        if not block.endswith(','):
            block += ','
        unique_blocks.append(block)

clean_content = header + '\n' + '\n'.join(unique_blocks).rstrip(',') + '\n};\n'

with open(registry_file, 'w', encoding='utf-8') as f:
    f.write(clean_content)

print(f'✓ Cleaned contentRegistry.ts! Total unique routes: {len(seen_keys)}')
