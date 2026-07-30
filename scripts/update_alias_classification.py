import os

catalog_path = r'C:\Users\mahdi\.gemini\antigravity-ide\scratch\filekit\src\config\conversionCatalog.ts'

with open(catalog_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace /jpeg-to-png classification to PRODUCTION_FROZEN & REDIRECT_ALIAS
target = '''  "/jpeg-to-png": {
    slug: "/jpeg-to-png",
    inputFormat: "JPEG",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PLANNED",
    indexabilityStatus: "NOT_PUBLIC",
    canonicalSlug: "/jpg-to-png",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },'''

replacement = '''  "/jpeg-to-png": {
    slug: "/jpeg-to-png",
    inputFormat: "JPEG",
    outputFormat: "PNG",
    family: "image-conversion",
    engineId: "shared-image-converter-v1",
    processingMode: "local",
    implementationStatus: "PRODUCTION_FROZEN",
    indexabilityStatus: "REDIRECT_ALIAS",
    canonicalSlug: "/jpg-to-png",
    navigationEnabled: false,
    sitemapEnabled: false,
    localizationEnabled: false
  },'''

if target in text:
    text = text.replace(target, replacement)
    with open(catalog_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated /jpeg-to-png to PRODUCTION_FROZEN / REDIRECT_ALIAS cleanly!")
else:
    print("Target string for /jpeg-to-png not found or already updated.")
