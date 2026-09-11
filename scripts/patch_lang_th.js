const fs = require('fs');

const file = 'src/components/layout/LanguageContext.tsx';
let content = fs.readFileSync(file, 'utf8');
const isCrlf = content.includes('\r\n');
if (isCrlf) content = content.replace(/\r\n/g, '\n');

const thaiBlock = `  th: {
    "nav.allTools": "เครื่องมือทั้งหมด",
    "nav.compress": "บีบอัด",
    "nav.convert": "แปลงไฟล์",
    "nav.merge": "รวมไฟล์",
    "nav.image": "รูปภาพ",
    "nav.organize": "จัดระเบียบ",
    "nav.resize": "ปรับขนาด",
    "nav.pricing": "ราคา",
    "nav.searchPlaceholder": "ค้นหาเครื่องมือกว่า 100 รายการ...",
    "nav.allToolsBtn": "เครื่องมือทั้งหมด",
    
    "hero.tagline": "จัดการไฟล์ในแบบของคุณ",
    "hero.title1": "แปลงไฟล์เป็นรูปแบบ",
    "hero.title2": "ที่คุณต้องการอย่างแม่นยำ",
    "hero.subtitle1": "แปลงไฟล์ บีบอัด ปรับขนาด จัดการ และซ่อมแซม PDF, รูปภาพ, ไฟล์ Office, เสียง และวิดีโอ",
    "hero.subtitle2": "ปลอดภัย 100% ประมวลผลบนเบราว์เซอร์ของคุณโดยไม่ต้องอัปโหลดไฟล์",
    
    "trust.badge1": "ประมวลผลในเบราว์เซอร์",
    "trust.badge2": "ลบไฟล์ออกจากเซิร์ฟเวอร์อัตโนมัติ",
    "trust.badge3": "ไม่ต้องลงทะเบียน",
    "trust.badge4": "ปลอดภัยและเป็นส่วนตัว 100%",
    
    "homepage.searchPlaceholder": "ค้นหาเครื่องมือที่เหมาะสมกับงานของคุณ...",
    "homepage.privateTitle": "เป็นส่วนตัวตั้งแต่เริ่มต้น",
    "homepage.privateDesc": "ไฟล์ของคุณอยู่กับคุณเสมอ",
    "homepage.localTitle": "ประมวลผลในเครื่อง",
    "homepage.localDesc": "ทำงานบนอุปกรณ์ของคุณเมื่อทำได้",
    "homepage.fallbackTitle": "ระบบสำรองที่ปลอดภัย",
    "homepage.fallbackDesc": "เข้ารหัสความปลอดภัยด้วย TLS",
    "homepage.dropAnywhere": "ลากไฟล์มาวางที่นี่",
    "homepage.chooseFile": "เลือกไฟล์",
    "homepage.orChoose": "หรือเลือกไฟล์จากอุปกรณ์ของคุณ",
    "homepage.methodShown": "แสดงวิธีการประมวลผลก่อนเริ่มต้นเสมอ",
    "homepage.popularTools": "เครื่องมือยอดนิยม",
    "homepage.browseAll": "ดูเครื่องมือทั้งหมด →",
    "homepage.viewAll": "ดูเครื่องมือทั้งหมด →",
    "homepage.footerNote": "เครื่องมือพื้นฐานฟรี ไม่ต้องสมัครสมาชิกหรือมีค่าบริการแอบแฝง",
    "homepage.dropzoneTitle": "ลากรูปภาพมาวางที่นี่เพื่อแปลงไฟล์",
    "homepage.dropzoneSubtitle": "รองรับ JPG, PNG และ WebP สูงสุด 50 MB",
    
    "tool.compress.desc": "ลดขนาดไฟล์ PDF ให้เล็กลง",
    "tool.merge.title": "รวมไฟล์ PDF",
    "tool.merge.desc": "รวมไฟล์ PDF หลายไฟล์เข้าด้วยกัน",
    "tool.split.title": "แยกไฟล์ PDF",
    "tool.split.desc": "แยกหน้าเอกสาร PDF",
    "tool.rotate.title": "หมุนหน้า PDF",
    "tool.rotate.desc": "หมุนหน้าเอกสาร PDF",
    "tool.watermark.title": "ใส่ลายน้ำ PDF",
    "tool.watermark.desc": "เพิ่มข้อความหรือโลโก้",
    "tool.resize.title": "ปรับขนาดรูปภาพ",
    "tool.resize.desc": "กำหนดพิกเซลหรือขนาด KB ได้ตามต้องการ",
    "tool.convert.title": "แปลงไฟล์รูปภาพ",
    "tool.convert.desc": "JPG, PNG, WebP",
    "tool.pdfToWord.title": "PDF เป็น Word",
    "tool.pdfToWord.desc": "แปลงเป็นเอกสาร DOCX ที่แก้ไขได้",
    "tool.allTools.title": "เครื่องมือทั้งหมด",
    "tool.allTools.desc": "สำรวจชุดเครื่องมือทั้งหมด",

    "breadcrumb.home": "หน้าแรก",
    "breadcrumb.compress": "บีบอัด PDF",
    "compress.title": "บีบอัด PDF ให้ต่ำกว่า 2 MB",
    "compress.subtitle": "ลดขนาด PDF โดยยังคงคุณภาพสูงสุด",
    
    "badge.local": "ประมวลผลบนอุปกรณ์นี้",
    "workspace.dropHere": "ลากไฟล์ PDF มาวางที่นี่",
    "workspace.pdfOnly": "เฉพาะ PDF เท่านั้น · ประมวลผลในเครื่อง",
    "workspace.stayOnDevice": "ไฟล์ของคุณจะยังคงอยู่ในอุปกรณ์นี้ระหว่างการประมวลผลในเครื่องที่ปลอดภัย",
    "workspace.askBeforeTransfer": "FileKit จะขออนุญาตก่อนส่งไฟล์ไปยังเซิร์ฟเวอร์ชั่วคราวเสมอ",
    "workspace.selectFile": "เลือกไฟล์ PDF",
    "workspace.selectFiles": "เลือกไฟล์ PDF",
    "workspace.freeNotice": "รูปภาพของคุณได้รับการแปลงในหน่วยความจำของเบราว์เซอร์และไม่มีการอัปโหลด",
    
    "trust.privateTitle": "เป็นส่วนตัว 100%",
    "trust.privateDesc1": "ไฟล์ของคุณอยู่ภายใต้การควบคุม",
    "trust.privateDesc2": "ของคุณเสมอ",
    "trust.localTitle": "ประมวลผลในเครื่องก่อน",
    "trust.localDesc1": "ประมวลผลในเบราว์เซอร์",
    "trust.localDesc2": "เพื่อความปลอดภัยสูงสุด",
    "trust.tempTitle": "เก็บชั่วคราวเท่านั้น",
    "trust.tempDesc1": "ไฟล์บนเซิร์ฟเวอร์จะถูกลบ",
    "trust.tempDesc2": "โดยอัตโนมัติ",
    "trust.trialTitle": "ไม่มีค่าธรรมเนียมแอบแฝง",
    "trust.trialDesc1": "ข้อกำหนดและราคาชัดเจน",
    "trust.trialDesc2": "โปร่งใส",
    
    "lang.en": "English",
    "lang.th": "ไทย"
  },
`;

if (!content.includes('"lang.th": "ไทย"')) {
  content = content.replace('  sv: {\n', thaiBlock + '  sv: {\n');
  if (isCrlf) content = content.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Added Thai to LanguageContext.tsx');
} else {
  console.log('Thai already in LanguageContext.tsx');
}
