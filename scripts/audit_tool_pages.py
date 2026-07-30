import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

app_dir = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\app'
registry_file = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\lib\seo\contentRegistry.ts'

with open(registry_file, 'r', encoding='utf-8') as f:
    registry_text = f.read()

# Match operationId keys in registry
registered_keys = set(re.findall(r"'([a-z0-9-]+)':\s*\{", registry_text))

routes = []
for item in os.listdir(app_dir):
    full_path = os.path.join(app_dir, item)
    if os.path.isdir(full_path) and not item.startswith('_') and not item.startswith('dev'):
        page_file = os.path.join(full_path, 'page.tsx')
        if os.path.exists(page_file):
            routes.append(item)

print(f'=== FILEKIT TOOL PAGES AUDIT REPORT ({len(routes)} Routes) ===\n')
print(f'{"Route":<30} | {"Registry Entry":<15} | {"ToolContentRenderer":<20} | {"Status":<10}')
print('-' * 80)

fully_ready = []
missing_registry = []
missing_renderer = []

for r in sorted(routes):
    page_file = os.path.join(app_dir, r, 'page.tsx')
    with open(page_file, 'r', encoding='utf-8') as f:
        content = f.read()

    has_reg = r in registered_keys
    has_render = 'ToolContentRenderer' in content

    if has_reg and has_render:
        status = '✅ LIVE'
        fully_ready.append(r)
    else:
        status = '⚠️ NEEDS WIRING'

    if not has_reg:
        missing_registry.append(r)
    if not has_render:
        missing_renderer.append(r)

    print(f'/{r:<29} | {str(has_reg):<15} | {str(has_render):<20} | {status}')

print('\n' + '=' * 80)
print('AUDIT SUMMARY:')
print(f'  • Total Tool Routes: {len(routes)}')
print(f'  • Fully Wired (Registry + UI Component): {len(fully_ready)}')
print(f'  • Needs Registry Entry: {len(missing_registry)}')
print(f'  • Needs Renderer in page.tsx: {len(missing_renderer)}')
