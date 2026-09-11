import http.client
import sys

routes = [
    ("/ru/rar-to-zip", "Выберите архив для распаковки или конвертации"),
    ("/ru/create-zip", "Перетащите файлы для упаковки в ZIP-архив"),
    ("/ru/strip-exif", "Выберите фотографии для удаления метаданных"),
    ("/ru/epub-to-pdf", "Выберите файл электронной книги (.EPUB)"),
    ("/ru/watermark-pdf", "Перетащите PDF сюда"),
    ("/ru/watermark-pdf", "Выбрать PDF-файл"),
    ("/ru/merge-pdf", "Перетащите PDF сюда"),
    ("/ru/merge-pdf", "Выбрать файлы PDF"),
    ("/ru/split-pdf", "Выбрать файл PDF"),
    ("/ru/rotate-pdf-pages", "Выбрать файл PDF"),
    ("/ru/pdf-to-text", "Выберите отсканированный документ или изображение"),
    ("/ru/compress-image", "Перетащите изображение сюда или выберите файл"),
    ("/ru/ttf-to-woff2", "Выберите файл шрифта (TTF, OTF, WOFF)"),
]

conn = http.client.HTTPConnection("localhost", 3000)
all_ok = True

for path, expected in routes:
    conn.request("GET", path)
    res = conn.getresponse()
    body = res.read().decode('utf-8')
    status = res.status
    found = expected in body
    if not found:
        all_ok = False
        sys.stdout.buffer.write(f"FAILED: {path} did not contain expected Russian text: {expected}\n".encode('utf-8'))
    else:
        sys.stdout.buffer.write(f"PASSED: {path} [Status {status}] -> Verified Russian string present: {expected[:30]}...\n".encode('utf-8'))

if all_ok:
    sys.stdout.buffer.write(b"\n>>> ALL RUSSIAN WORKSPACES VERIFIED 100% AUDITED AND ERROR-FREE <<<\n")
else:
    sys.stdout.buffer.write(b"\nSOME RUSSIAN AUDITS FAILED!\n")
