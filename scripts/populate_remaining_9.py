import os
import re

# Complete translations for the remaining 9 languages:
# lv (Latvian), lt (Lithuanian), he (Hebrew), hi (Hindi), id (Indonesian), ms (Malay), th (Thai), vi (Vietnamese), fil (Filipino)

LANG_PACK = {
  "CATEGORIES": {
    "IMAGE COMPRESSION": {
      "lv": "ATTĒLU SASPIEŠANA",
      "lt": "VAIZDŲ GLAUDINIMAS",
      "he": "דחיסת תמונות",
      "hi": "इमेज कंप्रेसन",
      "id": "KOMPRESI GAMBAR",
      "ms": "MAMPATAN IMEJ",
      "th": "การบีบอัดรูปภาพ",
      "vi": "NÉN HÌNH ẢNH",
      "fil": "PAG-COMPRESS NG LARAWAN"
    },
    "PDF": {
      "lv": "PDF RĪKI",
      "lt": "PDF ĮRANKIAI",
      "he": "כלי PDF",
      "hi": "PDF टूल्स",
      "id": "ALAT PDF",
      "ms": "ALAT PDF",
      "th": "เครื่องมือ PDF",
      "vi": "CÔNG CỤ PDF",
      "fil": "MGA TOOL SA PDF"
    },
    "PAGE EDITING & ORGANIZATION": {
      "lv": "LAPU REDIĢĒŠANA UN KĀRTOŠANA",
      "lt": "PUSLAPIŲ REDAGAVIMAS IR TVARKYMAS",
      "he": "עריכה וארגון עמודים",
      "hi": "पेज संपादन और व्यवस्था",
      "id": "PENGEDITAN & PENGATURAN HALAMAN",
      "ms": "PENGEDITAN & SUSUNAN HALAMAN",
      "th": "การแก้ไขและจัดระเบียบหน้า",
      "vi": "CHỈNH SỬA VÀ SẮP XẾP TRANG",
      "fil": "PAG-EDIT AT PAG-AYOS NG PAHINA"
    },
    "COMPRESS & CONVERT": {
      "lv": "SASPIEST UN KONVERTĒT",
      "lt": "GLAUDINTI IR KONVERTUOTI",
      "he": "דחיסה והמרה",
      "hi": "कंप्रेस और कन्वर्ट",
      "id": "KOMPRES & KONVERSI",
      "ms": "MAMPAT & TUKAR",
      "th": "บีบอัดและแปลงไฟล์",
      "vi": "NÉN VÀ CHUYỂN ĐỔI",
      "fil": "I-COMPRESS AT I-CONVERT"
    },
    "POPULAR TARGET SIZES": {
      "lv": "POPULĀRI MĒRĶA IZMĒRI",
      "lt": "POPULIARŪS TIKSLINIAI DYDŽIAI",
      "he": "גדלי יעד פופולריים",
      "hi": "लोकप्रिय लक्ष्य आकार",
      "id": "UKURAN TARGET POPULER",
      "ms": "SAIZ SASARAN POPULAR",
      "th": "ขนาดยอดนิยมที่ต้องการ",
      "vi": "KÍCH THƯỚC MỤC TIÊU PHỔ BIẾN",
      "fil": "MGA SIKAT NA TARGET SIZE"
    },
    "IMAGE CONVERT": {
      "lv": "ATTĒLU KONVERTĒŠANA",
      "lt": "VAIZDŲ KONVERTAVIMAS",
      "he": "המרת תמונות",
      "hi": "इमेज कन्वर्जन",
      "id": "KONVERSI GAMBAR",
      "ms": "PENUKARAN IMEJ",
      "th": "การแปลงรูปภาพ",
      "vi": "CHUYỂN ĐỔI HÌNH ẢNH",
      "fil": "PAG-CONVERT NG LARAWAN"
    },
    "MORE FORMATS": {
      "lv": "CITI FORMĀTI",
      "lt": "DAUGIAU FORMATŲ",
      "he": "פורמטים נוספים",
      "hi": "अधिक प्रारूप",
      "id": "FORMAT LAINNYA",
      "ms": "FORMAT LAIN",
      "th": "รูปแบบเพิ่มเติม",
      "vi": "ĐỊNH DẠNG KHÁC",
      "fil": "IBA PANG MGA FORMAT"
    },
    "IMAGE EDITORS": {
      "lv": "ATTĒLU REDAKTORI",
      "lt": "VAIZDŲ REDAKTORIAI",
      "he": "עורכי תמונות",
      "hi": "इमेज एडिटर्स",
      "id": "EDITOR GAMBAR",
      "ms": "PENYUNTING IMEJ",
      "th": "โปรแกรมแก้ไขรูปภาพ",
      "vi": "TRÌNH CHỈNH SỬA ẢNH",
      "fil": "MGA EDITOR NG LARAWAN"
    },
    "VIDEO TOOLS": {
      "lv": "VIDEO RĪKI",
      "lt": "VAIZDO ĮRAŠŲ ĮRANKIAI",
      "he": "כלי וידאו",
      "hi": "वीडियो टूल्स",
      "id": "ALAT VIDEO",
      "ms": "ALAT VIDEO",
      "th": "เครื่องมือวิดีโอ",
      "vi": "CÔNG CỤ VIDEO",
      "fil": "MGA TOOL SA VIDEO"
    },
    "SUBTITLE TOOLS": {
      "lv": "SUBTITRU RĪKI",
      "lt": "SUBTITRŲ ĮRANKIAI",
      "he": "כלי כתוביות",
      "hi": "सबटाइटल टूल्स",
      "id": "ALAT SUBTITLE",
      "ms": "ALAT SARIKATA",
      "th": "เครื่องมือคำบรรยาย",
      "vi": "CÔNG CỤ PHỤ ĐỀ",
      "fil": "MGA TOOL SA SUBTITLE"
    },
    "CONVERT FROM PDF": {
      "lv": "NO PDF",
      "lt": "IŠ PDF",
      "he": "המר מ-PDF",
      "hi": "PDF से कन्वर्ट करें",
      "id": "DARI PDF",
      "ms": "DARIPADA PDF",
      "th": "แปลงจาก PDF",
      "vi": "TỪ PDF",
      "fil": "MULA SA PDF"
    },
    "CONVERT TO PDF": {
      "lv": "UZ PDF",
      "lt": "Į PDF",
      "he": "המר ל-PDF",
      "hi": "PDF में कन्वर्ट करें",
      "id": "KE PDF",
      "ms": "KEPADA PDF",
      "th": "แปลงเป็น PDF",
      "vi": "SANG PDF",
      "fil": "PATUNGO SA PDF"
    },
    "DOCUMENTS & EBOOKS": {
      "lv": "DOKUMENTI UN E-GRĀMATAS",
      "lt": "DOKUMENTAI IR EL. KNYGOS",
      "he": "מסמכים וספרים אלקטרוניים",
      "hi": "दस्तावेज़ और ई-बुक्स",
      "id": "DOKUMEN & E-BOOK",
      "ms": "DOKUMEN & E-BUKU",
      "th": "เอกสารและอีบุ๊ก",
      "vi": "TÀI LIỆU VÀ EBOOK",
      "fil": "MGA DOKUMENTO AT E-BOOK"
    },
    "CAD & VECTOR TOOLS": {
      "lv": "CAD UN VEKTORU RĪKI",
      "lt": "CAD IR VEKTORINIAI ĮRANKIAI",
      "he": "כלי CAD ווקטור",
      "hi": "CAD और वेक्टर टूल्स",
      "id": "ALAT CAD & VEKTOR",
      "ms": "ALAT CAD & VEKTOR",
      "th": "เครื่องมือ CAD และเวกเตอร์",
      "vi": "CÔNG CỤ CAD VÀ VECTOR",
      "fil": "MGA TOOL SA CAD AT VECTOR"
    },
    "AUDIO TOOLS": {
      "lv": "AUDIO RĪKI",
      "lt": "GARSO ĮRANKIAI",
      "he": "כלי אודיו",
      "hi": "ऑडियो टूल्स",
      "id": "ALAT AUDIO",
      "ms": "ALAT AUDIO",
      "th": "เครื่องมือเสียง",
      "vi": "CÔNG CỤ ÂM THANH",
      "fil": "MGA TOOL SA AUDIO"
    },
    "ARCHIVE & UTILITIES": {
      "lv": "ARHĪVI UN UTILĪTAS",
      "lt": "ARCHYVAI IR KOMUNALINĖS PROGRAMOS",
      "he": "ארכיונים וכלי עזר",
      "hi": "आर्काइव और सुविधाएं",
      "id": "ARSIP & UTILITAS",
      "ms": "ARKIB & UTILITI",
      "th": "ไฟล์บีบอัดและยูทิลิตี้",
      "vi": "LƯU TRỮ VÀ TIỆN ÍCH",
      "fil": "MGA ARCHIVE AT UTILITY"
    }
  },
  "EXACT_TOOLS": {
    "Merge PDF Files": {
      "lv": "Apvienot PDF failus",
      "lt": "Sujungti PDF failus",
      "he": "מיזוג קובצי PDF",
      "hi": "PDF फाइलें मर्ज करें",
      "id": "Gabungkan File PDF",
      "ms": "Gabungkan Fail PDF",
      "th": "รวมไฟล์ PDF",
      "vi": "Ghép nối tệp PDF",
      "fil": "Pagsamahin ang mga PDF File"
    },
    "Split PDF Document": {
      "lv": "Sadalīt PDF dokumentu",
      "lt": "Padalinti PDF dokumentą",
      "he": "פיצול מסמך PDF",
      "hi": "PDF दस्तावेज़ विभाजित करें",
      "id": "Pisahkan Dokumen PDF",
      "ms": "Pisahkan Dokumen PDF",
      "th": "แยกเอกสาร PDF",
      "vi": "Tách tài liệu PDF",
      "fil": "Hatiin ang Dokumentong PDF"
    },
    "PDF Compressor": {
      "lv": "PDF kompresors",
      "lt": "PDF glaudintuvas",
      "he": "דוחס PDF",
      "hi": "PDF कंप्रेसर",
      "id": "Kompresor PDF",
      "ms": "Pemampat PDF",
      "th": "โปรแกรมบีบอัด PDF",
      "vi": "Trình nén PDF",
      "fil": "PDF Compressor"
    },
    "Image Compressor": {
      "lv": "Attēlu kompresors",
      "lt": "Vaizdų glaudintuvas",
      "he": "דוחס תמונות",
      "hi": "इमेज कंप्रेसर",
      "id": "Kompresor Gambar",
      "ms": "Pemampat Imej",
      "th": "โปรแกรมบีบอัดรูปภาพ",
      "vi": "Trình nén hình ảnh",
      "fil": "Image Compressor"
    },
    "Image Converter": {
      "lv": "Attēlu pārveidotājs",
      "lt": "Vaizdų keitiklis",
      "he": "ממיר תמונות",
      "hi": "इमेज कनवर्टर",
      "id": "Konverter Gambar",
      "ms": "Penukar Imej",
      "th": "โปรแกรมแปลงรูปภาพ",
      "vi": "Trình chuyển đổi ảnh",
      "fil": "Image Converter"
    },
    "Compress to a Specific Size": {
      "lv": "Saspiest līdz noteiktam izmēram",
      "lt": "Glaudinti iki nurodyto dydžio",
      "he": "דחיסה לגודל מוגדר",
      "hi": "विशिष्ट आकार में कंप्रेस करें",
      "id": "Kompres ke Ukuran Tertentu",
      "ms": "Mampatkan ke Saiz Tertentu",
      "th": "บีบอัดให้ได้ขนาดที่ต้องการ",
      "vi": "Nén đến kích thước cụ thể",
      "fil": "I-compress sa Tiyak na Laki"
    },
    "Compress to Specific Size": {
      "lv": "Saspiest līdz noteiktam izmēram",
      "lt": "Glaudinti iki nurodyto dydžio",
      "he": "דחיסה לגודל מוגדר",
      "hi": "विशिष्ट आकार में कंप्रेस करें",
      "id": "Kompres ke Ukuran Tertentu",
      "ms": "Mampatkan ke Saiz Tertentu",
      "th": "บีบอัดให้ได้ขนาดที่ต้องการ",
      "vi": "Nén đến kích thước cụ thể",
      "fil": "I-compress sa Tiyak na Laki"
    },
    "Reorder Pages": {
      "lv": "Pārkārtot lapas",
      "lt": "Pertvarkyti puslapius",
      "he": "שינוי סדר עמודים",
      "hi": "पेज पुनर्व्यवस्थित करें",
      "id": "Susun Ulang Halaman",
      "ms": "Susun Semula Halaman",
      "th": "จัดเรียงหน้าใหม่",
      "vi": "Sắp xếp lại trang",
      "fil": "Baguhin ang Pagkakasunod-sunod ng Pahina"
    },
    "Reverse PDF": {
      "lv": "Apgriezt PDF secību",
      "lt": "Apversti PDF tvarką",
      "he": "היפוך סדר PDF",
      "hi": "PDF उल्टा करें",
      "id": "Balik Urutan PDF",
      "ms": "Balikkan Susunan PDF",
      "th": "กลับลำดับหน้า PDF",
      "vi": "Đảo ngược thứ tự PDF",
      "fil": "Baligtarin ang PDF"
    },
    "Add Blank Page": {
      "lv": "Pievienot tukšu lapu",
      "lt": "Pridėti tuščią puslapį",
      "he": "הוספת עמוד ריק",
      "hi": "रिक्त पेज जोड़ें",
      "id": "Tambah Halaman Kosong",
      "ms": "Tambah Halaman Kosong",
      "th": "เพิ่มหน้าว่าง",
      "vi": "Thêm trang trống",
      "fil": "Magdagdag ng Blankong Pahina"
    },
    "Duplicate Pages": {
      "lv": "Dublēt lapas",
      "lt": "Dubliuoti puslapius",
      "he": "שכפול עמודים",
      "hi": "पेज डुप्लिकेट करें",
      "id": "Duplikat Halaman",
      "ms": "Gandakan Halaman",
      "th": "ทำซ้ำหน้า",
      "vi": "Nhân bản trang",
      "fil": "Kopyahin ang mga Pahina"
    },
    "Rotate Pages": {
      "lv": "Pagriezt lapas",
      "lt": "Pasukti puslapius",
      "he": "סיבוב עמודים",
      "hi": "पेज रोटेट करें",
      "id": "Putar Halaman",
      "ms": "Putar Halaman",
      "th": "หมุนหน้า",
      "vi": "Xoay trang",
      "fil": "Iikot ang mga Pahina"
    },
    "Delete Pages": {
      "lv": "Dzēst lapas",
      "lt": "Ištrinti puslapius",
      "he": "מחיקת עמודים",
      "hi": "पेज हटाएं",
      "id": "Hapus Halaman",
      "ms": "Padam Halaman",
      "th": "ลบหน้า",
      "vi": "Xóa trang",
      "fil": "Tanggalin ang mga Pahina"
    },
    "Extract Pages": {
      "lv": "Izvilkt lapas",
      "lt": "Išskleisti puslapius",
      "he": "חילוץ עמודים",
      "hi": "पेज निकालें",
      "id": "Ekstrak Halaman",
      "ms": "Ekstrak Halaman",
      "th": "แยกหน้า",
      "vi": "Trích xuất trang",
      "fil": "I-extract ang mga Pahina"
    },
    "Extract Images": {
      "lv": "Izvilkt attēlus",
      "lt": "Išskleisti vaizdus",
      "he": "חילוץ תמונות",
      "hi": "इमेज निकालें",
      "id": "Ekstrak Gambar",
      "ms": "Ekstrak Imej",
      "th": "แยกรูปภาพ",
      "vi": "Trích xuất hình ảnh",
      "fil": "I-extract ang mga Larawan"
    },
    "Flatten PDF": {
      "lv": "Saplacināt PDF",
      "lt": "Suploti PDF",
      "he": "השטחת PDF",
      "hi": "PDF फ्लैट करें",
      "id": "Ratakan PDF",
      "ms": "Ratakan PDF",
      "th": "รวมเลเยอร์ PDF (Flatten)",
      "vi": "Làm phẳng PDF",
      "fil": "I-flatten ang PDF"
    },
    "Add Watermark": {
      "lv": "Pievienot ūdenszīmi",
      "lt": "Pridėti vandenženklį",
      "he": "הוספת סימן מים",
      "hi": "वॉटरमार्क जोड़ें",
      "id": "Tambah Watermark",
      "ms": "Tambah Tera Air",
      "th": "ใส่ลายน้ำ",
      "vi": "Thêm hình mờ",
      "fil": "Magdagdag ng Watermark"
    },
    "Grayscale Image": {
      "lv": "Pelēktoņu attēls",
      "lt": "Nespalvotas vaizdas",
      "he": "תמונה בגווני אפור",
      "hi": "ग्रेस्केल इमेज",
      "id": "Gambar Grayscale",
      "ms": "Imej Skala Kelabu",
      "th": "ภาพโทนขาวดำ",
      "vi": "Ảnh thang độ xám",
      "fil": "Grayscale na Larawan"
    },
    "Invert Image": {
      "lv": "Invertēt attēla krāsas",
      "lt": "Invertuoti vaizdo spalvas",
      "he": "היפוך צבעי תמונה",
      "hi": "इमेज रंग उलटें",
      "id": "Balikkan Warna Gambar",
      "ms": "Songsangkan Warna Imej",
      "th": "กลับสีรูปภาพ",
      "vi": "Đảo ngược màu ảnh",
      "fil": "Baligtarin ang Kulay ng Larawan"
    },
    "Blur Image": {
      "lv": "Aizmiglot attēlu",
      "lt": "Sulieti vaizdą",
      "he": "טשטוש תמונה",
      "hi": "इमेज ब्लर करें",
      "id": "Kaburkan Gambar",
      "ms": "Kaburkan Imej",
      "th": "เบลอรูปภาพ",
      "vi": "Làm mờ ảnh",
      "fil": "I-blur ang Larawan"
    },
    "Crop Image": {
      "lv": "Apgriezt attēlu",
      "lt": "Apkarpyti vaizdą",
      "he": "חיתוך תמונה",
      "hi": "इमेज क्रॉप करें",
      "id": "Pangkas Gambar",
      "ms": "Pangkas Imej",
      "th": "ครอบตัดรูปภาพ",
      "vi": "Cắt ảnh",
      "fil": "I-crop ang Larawan"
    },
    "Resize Image": {
      "lv": "Mainīt attēla izmēru",
      "lt": "Keisti vaizdo dydį",
      "he": "שינוי גודל תמונה",
      "hi": "इमेज का आकार बदलें",
      "id": "Ubah Ukuran Gambar",
      "ms": "Ubah Saiz Imej",
      "th": "ปรับขนาดรูปภาพ",
      "vi": "Đổi kích thước ảnh",
      "fil": "Baguhin ang Laki ng Larawan"
    },
    "Rotate Image": {
      "lv": "Pagriezt attēlu",
      "lt": "Pasukti vaizdą",
      "he": "סיבוב תמונה",
      "hi": "इमेज घुमाएं",
      "id": "Putar Gambar",
      "ms": "Putar Imej",
      "th": "หมุนรูปภาพ",
      "vi": "Xoay hình ảnh",
      "fil": "Iikot ang Larawan"
    },
    "Flip Image": {
      "lv": "Apmest attēlu",
      "lt": "Apversti vaizdą",
      "he": "שיקוף תמונה",
      "hi": "इमेज फ्लिप करें",
      "id": "Balik Gambar",
      "ms": "Balikkan Imej",
      "th": "พลิกรูปภาพ",
      "vi": "Lật hình ảnh",
      "fil": "I-flip ang Larawan"
    },
    "Compress Video": {
      "lv": "Saspiest video",
      "lt": "Glaudinti vaizdo įrašą",
      "he": "דחיסת וידאו",
      "hi": "वीडियो कंप्रेस करें",
      "id": "Kompres Video",
      "ms": "Mampatkan Video",
      "th": "บีบอัดวิดีโอ",
      "vi": "Nén video",
      "fil": "I-compress ang Video"
    },
    "Convert Video": {
      "lv": "Konvertēt video",
      "lt": "Konvertuoti vaizdo įrašą",
      "he": "המרת וידאו",
      "hi": "वीडियो कन्वर्ट करें",
      "id": "Konversi Video",
      "ms": "Tukar Video",
      "th": "แปลงวิดีโอ",
      "vi": "Chuyển đổi video",
      "fil": "I-convert ang Video"
    },
    "Change Speed": {
      "lv": "Mainīt ātrumu",
      "lt": "Keisti greitį",
      "he": "שינוי מהירות",
      "hi": "स्पीड बदलें",
      "id": "Ubah Kecepatan",
      "ms": "Ubah Kelajuan",
      "th": "เปลี่ยนความเร็ววิดีโอ",
      "vi": "Thay đổi tốc độ",
      "fil": "Baguhin ang Bilis"
    },
    "Rotate Video": {
      "lv": "Pagriezt video",
      "lt": "Pasukti vaizdo įrašą",
      "he": "סיבוב וידאו",
      "hi": "वीडियो रोटेट करें",
      "id": "Putar Video",
      "ms": "Putar Video",
      "th": "หมุนวิดีโอ",
      "vi": "Xoay video",
      "fil": "Iikot ang Video"
    },
    "Video to GIF": {
      "lv": "Video uz GIF",
      "lt": "Vaizdo įrašas į GIF",
      "he": "וידאו ל-GIF",
      "hi": "वीडियो से GIF",
      "id": "Video ke GIF",
      "ms": "Video kepada GIF",
      "th": "วิดีโอเป็น GIF",
      "vi": "Video sang GIF",
      "fil": "Video sa GIF"
    },
    "Trim Video": {
      "lv": "Apgriezt video",
      "lt": "Apkirpti vaizdo įrašą",
      "he": "גזירת וידאו",
      "hi": "वीडियो ट्रिम करें",
      "id": "Potong Video",
      "ms": "Potong Video",
      "th": "ตัดต่อวิดีโอ",
      "vi": "Cắt video",
      "fil": "I-trim ang Video"
    },
    "Mute Video": {
      "lv": "Izslēgt video skaņu",
      "lt": "Nutildyti vaizdo įrašą",
      "he": "השתקת וידאו",
      "hi": "वीडियो म्यूट करें",
      "id": "Bisukan Video",
      "ms": "Bisukan Video",
      "th": "ปิดเสียงวิดีโอ",
      "vi": "Tắt tiếng video",
      "fil": "I-mute ang Video"
    },
    "Convert Audio": {
      "lv": "Konvertēt audio",
      "lt": "Konvertuoti garsą",
      "he": "המרת אודיו",
      "hi": "ऑडियो कन्वर्ट करें",
      "id": "Konversi Audio",
      "ms": "Tukar Audio",
      "th": "แปลงไฟล์เสียง",
      "vi": "Chuyển đổi âm thanh",
      "fil": "I-convert ang Audio"
    },
    "Compress Audio": {
      "lv": "Saspiest audio",
      "lt": "Glaudinti garsą",
      "he": "דחיסת אודיו",
      "hi": "ऑडियो कंप्रेस करें",
      "id": "Kompres Audio",
      "ms": "Mampatkan Audio",
      "th": "บีบอัดไฟล์เสียง",
      "vi": "Nén âm thanh",
      "fil": "I-compress ang Audio"
    },
    "Boost Volume": {
      "lv": "Palielināt skaļumu",
      "lt": "Padidinti garsumą",
      "he": "הגברת עוצמת שמע",
      "hi": "वॉल्यूम बढ़ाएं",
      "id": "Tingkatkan Volume",
      "ms": "Tingkatkan Kelantangan",
      "th": "เพิ่มระดับเสียง",
      "vi": "Tăng âm lượng",
      "fil": "Palakasin ang Volume"
    },
    "Trim Audio": {
      "lv": "Apgriezt audio",
      "lt": "Apkirpti garsą",
      "he": "גזירת אודיו",
      "hi": "ऑडियो ट्रिम करें",
      "id": "Potong Audio",
      "ms": "Potong Audio",
      "th": "ตัดไฟล์เสียง",
      "vi": "Cắt âm thanh",
      "fil": "I-trim ang Audio"
    },
    "Merge Audio": {
      "lv": "Apvienot audio",
      "lt": "Sujungti garsą",
      "he": "מיזוג אודיו",
      "hi": "ऑडियो मर्ज करें",
      "id": "Gabungkan Audio",
      "ms": "Gabungkan Audio",
      "th": "รวมไฟล์เสียง",
      "vi": "Ghép âm thanh",
      "fil": "Pagsamahin ang Audio"
    },
    "Extract ZIP": {
      "lv": "Atvērt ZIP",
      "lt": "Išskleisti ZIP",
      "he": "חילוץ ZIP",
      "hi": "ZIP निकालें",
      "id": "Ekstrak ZIP",
      "ms": "Buka ZIP",
      "th": "แตกไฟล์ ZIP",
      "vi": "Giải nén ZIP",
      "fil": "I-extract ang ZIP"
    },
    "Extract RAR": {
      "lv": "Atvērt RAR",
      "lt": "Išskleisti RAR",
      "he": "חילוץ RAR",
      "hi": "RAR निकालें",
      "id": "Ekstrak RAR",
      "ms": "Buka RAR",
      "th": "แตกไฟล์ RAR",
      "vi": "Giải nén RAR",
      "fil": "I-extract ang RAR"
    },
    "Create ZIP": {
      "lv": "Izveidot ZIP",
      "lt": "Sukurti ZIP",
      "he": "יצירת ZIP",
      "hi": "ZIP बनाएं",
      "id": "Buat ZIP",
      "ms": "Cipta ZIP",
      "th": "สร้างไฟล์ ZIP",
      "vi": "Tạo tệp ZIP",
      "fil": "Gumawa ng ZIP"
    },
    "Strip EXIF": {
      "lv": "Notīrīt EXIF datus",
      "lt": "Išvalyti EXIF duomenis",
      "he": "הסרת נתוני EXIF",
      "hi": "EXIF हटाएं",
      "id": "Hapus Metadata EXIF",
      "ms": "Padam Metadata EXIF",
      "th": "ลบข้อมูล EXIF",
      "vi": "Xóa siêu dữ liệu EXIF",
      "fil": "Alisin ang EXIF Data"
    }
  },
  "PRIMARY_DESCS": {
    "IMAGE_OPTIMIZE": {
      "lv": "Optimizējiet JPG, PNG un WebP lokāli",
      "lt": "Optimizuokite JPG, PNG ir WebP vietoje",
      "he": "אופטימיזציה לתמונות JPG, PNG ו-WebP ישירות בדפדפן",
      "hi": "अपने ब्राउज़र में JPG, PNG और WebP ऑप्टिमाइज़ करें",
      "id": "Optimalkan JPG, PNG, dan WebP secara lokal di browser",
      "ms": "Optimumkan JPG, PNG dan WebP dalam pelayar anda",
      "th": "เพิ่มประสิทธิภาพ JPG, PNG และ WebP ในเบราว์เซอร์ของคุณ",
      "vi": "Tối ưu hóa JPG, PNG và WebP cục bộ trong trình duyệt",
      "fil": "I-optimize ang JPG, PNG, at WebP nang lokal sa browser"
    },
    "MERGE_PDF": {
      "lv": "Apvienojiet vairākus PDF failus pārlūkprogrammā",
      "lt": "Sujunkite kelis PDF failus naršyklėje",
      "he": "איחוד קובצי PDF מרובים ישירות בדפדפן",
      "hi": "ब्राउज़र में कई PDF फाइलें आसानी से संयोजित करें",
      "id": "Gabungkan beberapa file PDF langsung di browser",
      "ms": "Gabungkan beberapa fail PDF dalam pelayar",
      "th": "รวมไฟล์ PDF หลายไฟล์ในเบราว์เซอร์โดยตรง",
      "vi": "Kết hợp nhiều tệp PDF trực tiếp trong trình duyệt",
      "fil": "Pagsamahin ang maraming PDF file sa browser"
    },
    "SHRINK_PDF": {
      "lv": "Samaziniet PDF failus zem 2 MB pārlūkā",
      "lt": "Sumažinkite PDF iki mažiau nei 2 MB naršyklėje",
      "he": "הקטנת קובצי PDF מתחת ל-2 MB בדפדפן",
      "hi": "ब्राउज़र में PDF को 2 MB से कम में छोटा करें",
      "id": "Kecilkan PDF hingga di bawah 2 MB di browser",
      "ms": "Kecilkan PDF ke bawah 2 MB dalam pelayar",
      "th": "ย่อไฟล์ PDF ให้ต่ำกว่า 2 MB ในเบราว์เซอร์",
      "vi": "Giảm dung lượng PDF xuống dưới 2 MB trong trình duyệt",
      "fil": "Paliitin ang PDF sa ilalim ng 2 MB sa browser"
    }
  }
}

# Now inject into megaMenuTranslations.ts
with open('src/components/navigation/megaMenuTranslations.ts', 'r', encoding='utf-8') as f:
    mega_code = f.read()

# Inject into MEGA_MENU_CATEGORIES
for cat_name, trans_map in LANG_PACK["CATEGORIES"].items():
    # Find the category block
    pattern = rf'("{re.escape(cat_name)}":\s*\{{)([^}}]+)(\}})'
    match = re.search(pattern, mega_code)
    if match:
        prefix, body, suffix = match.groups()
        new_entries = ""
        for loc, text in trans_map.items():
            if f'"{loc}":' not in body and f'{loc}:' not in body:
                new_entries += f',\n    "{loc}": "{text}"'
        if new_entries:
            mega_code = mega_code.replace(match.group(0), f'{prefix}{body}{new_entries}\n  {suffix}')

# Inject into EXACT_TOOL_LABELS
for tool_name, trans_map in LANG_PACK["EXACT_TOOLS"].items():
    pattern = rf'("{re.escape(tool_name)}":\s*\{{)([^}}]+)(\}})'
    match = re.search(pattern, mega_code)
    if match:
        prefix, body, suffix = match.groups()
        new_entries = ""
        for loc, text in trans_map.items():
            if f'"{loc}":' not in body and f'{loc}:' not in body:
                new_entries += f',\n    "{loc}": "{text}"'
        if new_entries:
            mega_code = mega_code.replace(match.group(0), f'{prefix}{body}{new_entries}\n  {suffix}')

# Inject into PRIMARY_DESCRIPTIONS
for card_key, trans_map in LANG_PACK["PRIMARY_DESCS"].items():
    pattern = rf'({card_key}:\s*\{{)([^}}]+)(\}})'
    match = re.search(pattern, mega_code)
    if match:
        prefix, body, suffix = match.groups()
        new_entries = ""
        for loc, text in trans_map.items():
            if f'"{loc}":' not in body and f'{loc}:' not in body:
                new_entries += f',\n    "{loc}": "{text}"'
        if new_entries:
            mega_code = mega_code.replace(match.group(0), f'{prefix}{body}{new_entries}\n  {suffix}')

with open('src/components/navigation/megaMenuTranslations.ts', 'w', encoding='utf-8') as f:
    f.write(mega_code)

print("Successfully injected all 9 remaining languages into megaMenuTranslations.ts!")
