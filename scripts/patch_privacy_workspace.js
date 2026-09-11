const fs = require('fs');
let code = fs.readFileSync('src/utils/privacy/PrivacyWorkspace.tsx', 'utf8');

function replaceExact(str, find, rep) {
  const normStr = str.replace(/\r\n/g, '\n');
  const normFind = find.replace(/\r\n/g, '\n');
  const normRep = rep.replace(/\r\n/g, '\n');
  if (!normStr.includes(normFind)) {
    console.error('Failed to find:', normFind.slice(0, 50));
    return str;
  }
  const result = normStr.replace(normFind, normRep);
  return str.includes('\r\n') ? result.replace(/\n/g, '\r\n') : result;
}

// 0. Add isFilipino
code = replaceExact(
  code,
  `  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";`,
  `  const isMalay = language === "ms";
  const isThai = language === "th";
  const isVietnamese = language === "vi";
  const isFilipino = language === "fil";`
);

// 1. Error: Failed to strip metadata
code = replaceExact(
  code,
  `: isThai
          ? "ไม่สามารถลบข้อมูลเมทาดาทาออกจากไฟล์ได้"
          : "Failed to strip metadata from file."`,
  `: isThai
          ? "ไม่สามารถลบข้อมูลเมทาดาทาออกจากไฟล์ได้"
          : isFilipino
          ? "Nabigong alisin ang metadata mula sa file."
          : "Failed to strip metadata from file."`
);

// 2. Title
code = replaceExact(
  code,
  `: isThai ? "ลบข้อมูล EXIF และข้อมูลภาพถ่าย" : "Strip EXIF & Photo Metadata"`,
  `: isThai ? "ลบข้อมูล EXIF และข้อมูลภาพถ่าย" : isFilipino ? "Alisin ang EXIF at Metadata ng Larawan" : "Strip EXIF & Photo Metadata"`
);

// 3. Description
code = replaceExact(
  code,
  `: isThai ? "ลบตำแหน่ง GPS, ซีเรียลกล้อง และข้อมูลอุปกรณ์ · ในเบราว์เซอร์ 100%" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"`,
  `: isThai ? "ลบตำแหน่ง GPS, ซีเรียลกล้อง และข้อมูลอุปกรณ์ · ในเบราว์เซอร์ 100%" : isFilipino ? "Alisin ang Lokasyon ng GPS, Seryal ng Camera at Impormasyon ng Device · 100% Sa Loob ng Browser" : "Remove GPS Location, Camera Serial & Device Info · 100% In-Browser"`
);

// 4. Select Photo to Strip Metadata
code = replaceExact(
  code,
  `: isThai
                ? "เลือกรูปภาพเพื่อลบข้อมูลเมทาดาทา"
                : "Select Photo to Strip Metadata"`,
  `: isThai
                ? "เลือกรูปภาพเพื่อลบข้อมูลเมทาดาทา"
                : isFilipino
                ? "Pumili ng Larawan upang Alisin ang Metadata"
                : "Select Photo to Strip Metadata"`
);

// 5. Supports JPG, PNG and WebP
code = replaceExact(
  code,
  `: isThai
                ? "รองรับ JPG, PNG และ WebP (ประมวลผลส่วนตัว 100% โดยไม่มีการอัปโหลดไปยังเซิร์ฟเวอร์)"
                : "Supports JPG, PNG, and WebP (Zero uploads to servers)"`,
  `: isThai
                ? "รองรับ JPG, PNG และ WebP (ประมวลผลส่วนตัว 100% โดยไม่มีการอัปโหลดไปยังเซิร์ฟเวอร์)"
                : isFilipino
                ? "Sumusuporta sa JPG, PNG at WebP (100% pribadong pagproseso, walang pag-upload sa server)"
                : "Supports JPG, PNG, and WebP (Zero uploads to servers)"`
);

// 6. File Details
code = replaceExact(
  code,
  `: isThai ? "รายละเอียดไฟล์" : "File Details"`,
  `: isThai ? "รายละเอียดไฟล์" : isFilipino ? "Mga Detalye ng File" : "File Details"`
);

// 7. Detected Metadata
code = replaceExact(
  code,
  `: isThai ? "ข้อมูลเมทาดาทาที่ตรวจพบ" : "Detected Metadata"`,
  `: isThai ? "ข้อมูลเมทาดาทาที่ตรวจพบ" : isFilipino ? "Natukoy na Metadata" : "Detected Metadata"`
);

// 8. GPS Location:
code = replaceExact(
  code,
  `: isThai
                    ? \`ตำแหน่ง GPS: \${metadata?.hasGps ? "ตรวจพบ (เสี่ยง)" : "ปลอดภัย"}\`
                    : \`GPS Location: \${metadata?.hasGps ? "Detected (Vulnerable)" : isLatvian ? "Tīrs" : isLithuanian ? "Švarus" : "Clean"}\``,
  `: isThai
                    ? \`ตำแหน่ง GPS: \${metadata?.hasGps ? "ตรวจพบ (เสี่ยง)" : "ปลอดภัย"}\`
                    : isFilipino
                    ? \`Lokasyon ng GPS: \${metadata?.hasGps ? "Natukoy (Peligro)" : "Ligtas"}\`
                    : \`GPS Location: \${metadata?.hasGps ? "Detected (Vulnerable)" : isLatvian ? "Tīrs" : isLithuanian ? "Švarus" : "Clean"}\``
);

// 9. EXIF Device Tags:
code = replaceExact(
  code,
  `: isThai
                    ? \`แท็ก EXIF: \${metadata?.hasExif ? "ตรวจพบ" : "ไม่มี"}\`
                    : \`EXIF Device Tags: \${metadata?.hasExif ? "Detected" : isLatvian ? "Nav" : isLithuanian ? "Nėra" : "None"}\``,
  `: isThai
                    ? \`แท็ก EXIF: \${metadata?.hasExif ? "ตรวจพบ" : "ไม่มี"}\`
                    : isFilipino
                    ? \`Mga EXIF Tag: \${metadata?.hasExif ? "Natukoy" : "Wala"}\`
                    : \`EXIF Device Tags: \${metadata?.hasExif ? "Detected" : isLatvian ? "Nav" : isLithuanian ? "Nėra" : "None"}\``
);

// 10. Camera:
code = replaceExact(
  code,
  `: isThai ? "กล้อง:" : "Camera:"`,
  `: isThai ? "กล้อง:" : isFilipino ? "Camera:" : "Camera:"`
);

// 11. Sanitizing image...
code = replaceExact(
  code,
  `: isThai
                    ? "กำลังล้างข้อมูลรูปภาพ..."
                    : "Sanitizing image..."`,
  `: isThai
                    ? "กำลังล้างข้อมูลรูปภาพ..."
                    : isFilipino
                    ? "Nililinis ang larawan..."
                    : "Sanitizing image..."`
);

// 12. Strip All EXIF & GPS Metadata
code = replaceExact(
  code,
  `: isThai
                    ? "ลบข้อมูล EXIF และ GPS ทั้งหมด"
                    : "Strip All EXIF & GPS Metadata"`,
  `: isThai
                    ? "ลบข้อมูล EXIF และ GPS ทั้งหมด"
                    : isFilipino
                    ? "Alisin ang Lahat ng EXIF at GPS Metadata"
                    : "Strip All EXIF & GPS Metadata"`
);

// 13. Image sanitized! All metadata has been removed.
code = replaceExact(
  code,
  `: isThai
                    ? "✓ รูปภาพได้รับการล้างข้อมูลแล้ว! ข้อมูลเมทาดาทาทั้งหมดถูกลบออกแล้ว"
                    : "✓ Image sanitized! All metadata has been removed."`,
  `: isThai
                    ? "✓ รูปภาพได้รับการล้างข้อมูลแล้ว! ข้อมูลเมทาดาทาทั้งหมดถูกลบออกแล้ว"
                    : isFilipino
                    ? "✓ Nalinis na ang larawan! Naalis na ang lahat ng metadata."
                    : "✓ Image sanitized! All metadata has been removed."`
);

// 14. Download Sanitized Image
code = replaceExact(
  code,
  `: isThai
                  ? "ดาวน์โหลดรูปภาพที่ล้างข้อมูลแล้ว"
                  : "Download Sanitized Image"`,
  `: isThai
                  ? "ดาวน์โหลดรูปภาพที่ล้างข้อมูลแล้ว"
                  : isFilipino
                  ? "I-download ang Nalinis na Larawan"
                  : "Download Sanitized Image"`
);

fs.writeFileSync('src/utils/privacy/PrivacyWorkspace.tsx', code, 'utf8');
console.log('PrivacyWorkspace updated successfully!');
