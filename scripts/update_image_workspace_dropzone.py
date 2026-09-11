import os

with open('src/components/image-tools/ImageCompressionWorkspace.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Keys to add:
# lv, lt, he, hi, id, ms, th, vi, fil, zh

add_titles = '''                  lv: 'Ievelciet attēlu šeit vai pārlūkojiet',
                  lt: 'Nutempkite vaizdą čia arba naršykite',
                  he: 'גרור את התמונה לכאן או עיין',
                  hi: 'अपनी इमेज यहाँ छोड़ें या ब्राउज़ करें',
                  id: 'Tarik gambar Anda ke sini atau telusuri',
                  ms: 'Lepaskan imej anda di sini atau semak imbas',
                  th: 'ลากรูปภาพมาวางที่นี่หรือเรียกดู',
                  vi: 'Kéo thả hình ảnh vào đây hoặc duyệt tệp',
                  fil: 'I-drop ang iyong larawan dito o mag-browse',
                  zh: '将图片拖放到此处或浏览选择',
                  ja: '画像をここにドロップまたは参照','''

code = code.replace("ja: '画像をここにドロップまたは参照',", add_titles)

add_subtitles = '''                  lv: 'Atbalsta JPG, PNG un statisku WebP līdz 50 MB',
                  lt: 'Palaiko JPG, PNG ir statinį WebP iki 50 MB',
                  he: 'תומך ב-JPG, PNG ו-WebP סטטי עד 50 MB',
                  hi: 'JPG, PNG और 50 MB तक के स्थिर WebP का समर्थन करता है',
                  id: 'Mendukung JPG, PNG, dan WebP statis hingga 50 MB',
                  ms: 'Menyokong JPG, PNG dan WebP statik sehingga 50 MB',
                  th: 'รองรับ JPG, PNG และ WebP แบบคงที่สูงสุด 50 MB',
                  vi: 'Hỗ trợ JPG, PNG và WebP tĩnh lên đến 50 MB',
                  fil: 'Sumusuporta sa JPG, PNG, at static na WebP hanggang 50 MB',
                  zh: '支持 JPG、PNG 和高达 50 MB 的静态 WebP',
                  ja: 'JPG、PNG、静的WebP（50 MBまで）をサポート','''

code = code.replace("ja: 'JPG、PNG、静的WebP（50 MBまで）をサポート',", add_subtitles)

add_privacy = '''                  lv: '🔒 Jūsu attēls tiek apstrādāts lokāli pārlūkprogrammā un netiek augšupielādēts.',
                  lt: '🔒 Jūsų vaizdas apdorojamas lokaliai naršyklėje ir nėra įkeliamas.',
                  he: '🔒 התמונה שלך מעובדת מקומית בדפדפן ואינה מועלית לשרת.',
                  hi: '🔒 आपकी इमेज आपके ब्राउज़र में स्थानीय रूप से प्रोसेस होती है और अपलोड नहीं होती है।',
                  id: '🔒 Gambar Anda diproses secara lokal di browser dan tidak diunggah ke server.',
                  ms: '🔒 Imej anda diproses secara setempat dalam pelayar anda dan tidak dimuat naik.',
                  th: '🔒 รูปภาพของคุณได้รับการประมวลผลภายในเบราว์เซอร์และไม่มีการอัปโหลด',
                  vi: '🔒 Hình ảnh của bạn được xử lý cục bộ trong trình duyệt và không được tải lên.',
                  fil: '🔒 Ang iyong larawan ay lokal na pinoproseso sa iyong browser at hindi ina-upload.',
                  zh: '🔒 您的图片在浏览器本地安全处理，绝不会上传至服务器。',
                  ja: '🔒 画像はブラウザでローカルに処理され、アップロードされません。','''

code = code.replace("ja: '🔒 画像はブラウザでローカルに処理され、アップロードされません。',", add_privacy)

with open('src/components/image-tools/ImageCompressionWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Successfully updated ImageCompressionWorkspace.tsx dropzone texts for all 39 languages!")
