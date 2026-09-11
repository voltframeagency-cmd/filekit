import sys
import urllib.request
import re

res = urllib.request.urlopen('http://localhost:3000/ru/merge-pdf').read().decode('utf-8')

for match in re.finditer(r'<label[^>]*>(.*?)</label>', res, re.DOTALL):
    text = match.group(1).strip()
    sys.stdout.buffer.write(f"Label: {text}\n".encode('utf-8'))
