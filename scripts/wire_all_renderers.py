import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

app_dir = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\app'

routes = []
for item in os.listdir(app_dir):
    full_path = os.path.join(app_dir, item)
    if os.path.isdir(full_path) and not item.startswith('_') and not item.startswith('dev'):
        page_file = os.path.join(full_path, 'page.tsx')
        if os.path.exists(page_file):
            routes.append(item)

wired_count = 0

for r in sorted(routes):
    page_file = os.path.join(app_dir, r, 'page.tsx')
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'ToolContentRenderer' in content:
        continue

    # Inject import
    import_stmt = 'import { ToolContentRenderer } from "@/components/seo/ToolContentRenderer";\n'

    # Place import at top (after use client or first imports)
    if '"use client";' in content:
        content = content.replace('"use client";\n', '"use client";\n\n' + import_stmt)
    else:
        content = import_stmt + content

    # Inject ToolContentRenderer before </main>
    if '</main>' in content:
        content = content.replace('</main>', f'  <ToolContentRenderer operationId="{r}" />\n      </main>')
    elif '</div' in content:
        # Fallback if no main tag
        last_div_pos = content.rfind('</div>')
        content = content[:last_div_pos] + f'  <ToolContentRenderer operationId="{r}" />\n    </div>' + content[last_div_pos + 6:]

    with open(page_file, 'w', encoding='utf-8') as f:
        f.write(content)

    wired_count += 1
    print(f'✓ Wired ToolContentRenderer in /{r}/page.tsx')

print(f'\nTotal pages wired in this pass: {wired_count}')
