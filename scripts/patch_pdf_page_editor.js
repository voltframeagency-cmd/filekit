const fs = require('fs');
let code = fs.readFileSync('src/components/pdf-editor/PdfPageEditorWorkspace.tsx', 'utf8');

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

// 1. Drop PDF here
code = replaceExact(
  code,
  `: language === "ms"
              ? "Lepaskan dokumen PDF di sini"
              : t("workspace.dropHere")`,
  `: language === "ms"
              ? "Lepaskan dokumen PDF di sini"
              : language === "fil"
              ? "I-drop ang dokumentong PDF dito"
              : t("workspace.dropHere")`
);

// 2. Supports local PDF document manipulation up to 100 MB
code = replaceExact(
  code,
  `: language === "ms"
              ? "Menyokong pemprosesan dokumen PDF setempat sehingga 100 MB"
              : t("workspace.pdfOnly")`,
  `: language === "ms"
              ? "Menyokong pemprosesan dokumen PDF setempat sehingga 100 MB"
              : language === "fil"
              ? "Sumusuporta sa lokal na pagproseso ng PDF hanggang 100 MB"
              : t("workspace.pdfOnly")`
);

// 3. Select PDF Files / File
code = replaceExact(
  code,
  `: language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFiles") || "Select PDF Files")`,
  `: language === "ms" ? "Pilih Fail PDF" : language === "fil" ? "Pumili ng mga PDF File" : t("workspace.selectFiles") || "Select PDF Files")`
);

code = replaceExact(
  code,
  `: language === "ms" ? "Pilih Fail PDF" : t("workspace.selectFile") || "Select PDF File")`,
  `: language === "ms" ? "Pilih Fail PDF" : language === "fil" ? "Pumili ng PDF File" : t("workspace.selectFile") || "Select PDF File")`
);

// 4. Processing PDF...
code = replaceExact(
  code,
  `{language === "hi" ? "PDF प्रोसेस हो रहा है..." : language === "th" ? "กำลังประมวลผล PDF..." : language === "id" ? "Memproses PDF..." : "Processing PDF..."}`,
  `{language === "hi" ? "PDF प्रोसेस हो रहा है..." : language === "th" ? "กำลังประมวลผล PDF..." : language === "id" ? "Memproses PDF..." : language === "fil" ? "Pinoproseso ang PDF..." : "Processing PDF..."}`
);

// 5. Action button text
code = replaceExact(
  code,
  `: actionButtonText === "Process PDF" && language === "id"
                    ? "Proses PDF"
                    : actionButtonText}`,
  `: actionButtonText === "Process PDF" && language === "id"
                    ? "Proses PDF"
                    : actionButtonText === "Process PDF" && language === "fil"
                    ? "Iproseso ang PDF"
                    : actionButtonText}`
);

// 6. Pages count label
code = replaceExact(
  code,
  `: language === "id" ? "halaman" : "Pages"`,
  `: language === "id" ? "halaman" : language === "fil" ? "mga pahina" : "Pages"`
);

fs.writeFileSync('src/components/pdf-editor/PdfPageEditorWorkspace.tsx', code, 'utf8');
console.log('PdfPageEditorWorkspace updated successfully!');
