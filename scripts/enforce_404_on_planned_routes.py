import os

routes = [
    'sign-pdf',
    'add-image-to-pdf',
    'crop-pdf',
    'add-page-numbers-to-pdf',
    'word-to-pdf',
    'excel-to-pdf',
    'powerpoint-to-pdf',
    'ocr-pdf',
    'image-to-text',
    'make-pdf-searchable',
    'pdf-to-word',
    'pdf-to-excel',
    'pdf-to-powerpoint',
    'heic-to-jpg',
    'heic-to-png',
    'avif-to-jpg',
    'png-to-ico',
]

base_dir = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\app'

template = '''import { notFound } from "next/navigation";

export default function PlannedRoutePage() {
  // Product-Access Governance: Return HTTP 404 for PLANNED routes
  // until workspace, engine connection, and release evidence pass.
  notFound();
}
'''

for route in routes:
    file_path = os.path.join(base_dir, route, 'page.tsx')
    if os.path.exists(file_path):
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(template)

print(f'Successfully updated {len(routes)} planned route page.tsx files to trigger notFound() (HTTP 404)!')
