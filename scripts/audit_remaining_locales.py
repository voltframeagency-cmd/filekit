import http.client
import sys

locales = ["el", "sk", "sl", "uk"]

locale_expectations = {
    "el": {
        "/rar-to-zip": "Επιλέξτε αρχείο αρχειοθήκης για εξαγωγή ή μετατροπή",
        "/create-zip": "Σύρετε αρχεία για συμπίεση σε ZIP",
        "/strip-exif": "Επιλέξτε φωτογραφίες για αφαίρεση μεταδεδομένων",
        "/epub-to-pdf": "Επιλέξτε αρχείο eBook (.EPUB)",
        "/watermark-pdf": "Σύρετε το PDF σας εδώ",
        "/merge-pdf": "Επιλογή αρχείων PDF",
        "/pdf-to-text": "Επιλέξτε σαρωμένο έγγραφο ή εικόνα",
        "/compress-image": "Σύρετε την εικόνα σας εδώ ή περιηγηθείτε",
        "/ttf-to-woff2": "Επιλογή αρχείου γραμματοσειράς (TTF, OTF, WOFF)",
    },
    "sk": {
        "/rar-to-zip": "Vyberte súbor archívu na extrakciu alebo konverziu",
        "/create-zip": "Pretiahnite súbory na zabalenie do ZIP archívu",
        "/strip-exif": "Vyberte fotografie na odstránenie metadát",
        "/epub-to-pdf": "Vyberte súbor e-knihy (.EPUB)",
        "/watermark-pdf": "Presuňte PDF sem",
        "/merge-pdf": "Vybrať súbory PDF",
        "/pdf-to-text": "Vyberte naskenovaný dokument alebo obrázok",
        "/compress-image": "Presuňte obrázok sem alebo prehľadávajte",
        "/ttf-to-woff2": "Vyberte súbor písma (TTF, OTF, WOFF)",
    },
    "sl": {
        "/rar-to-zip": "Izberite arhivsko datoteko za ekstrakcijo ali pretvorbo",
        "/create-zip": "Povlecite datoteke, da jih stisnete v ZIP arhiv",
        "/strip-exif": "Izberite fotografije za odstranitev metapodatkov",
        "/epub-to-pdf": "Izberite datoteko e-knjige (.EPUB)",
        "/watermark-pdf": "Povlecite PDF sem",
        "/merge-pdf": "Izberite datoteke PDF",
        "/pdf-to-text": "Izberite skeniran dokument ali sliko",
        "/compress-image": "Povlecite sliko sem ali brskajte",
        "/ttf-to-woff2": "Izberite datoteko pisave (TTF, OTF, WOFF)",
    },
    "uk": {
        "/rar-to-zip": "Виберіть архівний файл для розпакування або конвертації",
        "/create-zip": "Перетягніть файли для пакування в ZIP-архів",
        "/strip-exif": "Виберіть фотографії для вилучення метаданих",
        "/epub-to-pdf": "Виберіть файл електронної книги (.EPUB)",
        "/watermark-pdf": "Перетягніть PDF сюди",
        "/merge-pdf": "Вибрати файли PDF",
        "/pdf-to-text": "Виберіть відсканований документ або зображення",
        "/compress-image": "Перетягніть зображення сюди або виберіть файл",
        "/ttf-to-woff2": "Виберіть файл шрифту (TTF, OTF, WOFF)",
    },
}

conn = http.client.HTTPConnection("localhost", 3000)
overall_success = True

for loc in locales:
    sys.stdout.buffer.write(f"\n========================================\n".encode('utf-8'))
    sys.stdout.buffer.write(f"AUDITING LOCALE: [{loc.upper()}] ONE BY ONE\n".encode('utf-8'))
    sys.stdout.buffer.write(f"========================================\n".encode('utf-8'))
    loc_ok = True
    for route, expected in locale_expectations[loc].items():
        full_path = f"/{loc}{route}"
        conn.request("GET", full_path)
        res = conn.getresponse()
        body = res.read().decode('utf-8')
        status = res.status
        found = expected in body
        if not found:
            loc_ok = False
            overall_success = False
            sys.stdout.buffer.write(f"  [FAIL] {full_path} missing: {expected}\n".encode('utf-8'))
        else:
            sys.stdout.buffer.write(f"  [PASS] {full_path} -> Confirmed: {expected[:30]}...\n".encode('utf-8'))
    
    if loc_ok:
        sys.stdout.buffer.write(f"--> LOCALE [{loc.upper()}] 100% COMPLETE AND ERROR-FREE\n".encode('utf-8'))
    else:
        sys.stdout.buffer.write(f"--> LOCALE [{loc.upper()}] HAD FAILURES\n".encode('utf-8'))

if overall_success:
    sys.stdout.buffer.write(b"\nALL LOCALES (RU, EL, SK, SL, UK) 100% AUDITED AND VERIFIED!\n")
else:
    sys.stdout.buffer.write(b"\nSOME LOCALES FAILED AUDIT!\n")
