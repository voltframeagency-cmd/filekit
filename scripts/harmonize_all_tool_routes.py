import os

app_dir = 'src/app'
entries = os.listdir(app_dir)
converted = 0

for e in sorted(entries):
    p = os.path.join(app_dir, e)
    if os.path.isdir(p):
        if e.startswith('[') or e.startswith('(') or e in ['api', 'dev', 'sv']:
            continue
        page_p = os.path.join(p, 'page.tsx')
        if not os.path.exists(page_p):
            continue

        slug = f"/{e}"
        content = f'''"use client";

import React from "react";
import UniversalToolPage from "@/components/layout/UniversalToolPage";

export default function Page() {{
  return <UniversalToolPage slug="{slug}" locale="en" />;
}}
'''
        with open(page_p, "w", encoding="utf-8") as f:
            f.write(content)
        converted += 1

print(f"Successfully harmonized {converted} static tool routes to UniversalToolPage!")
