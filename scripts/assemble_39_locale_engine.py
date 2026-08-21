import json
import os

LOCALES = [
  "en", "es", "es-419", "de", "fr", "pt", "pt-BR", "it", "nl", "ca",
  "sv", "da", "fi", "no", "pl", "cs", "hu", "ro", "bg", "el",
  "sk", "sl", "ru", "uk", "lv", "lt", "tr", "ar", "he", "hi",
  "id", "ms", "th", "vi", "fil", "ja", "ko", "zh-CN", "zh-TW"
]

print(f"Total locales to generate for each family: {len(LOCALES)}")
