const fs = require('fs');
let code = fs.readFileSync('src/components/pdf-overlay/PdfOverlayWorkspace.tsx', 'utf8');

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

// 1. Drop your PDF here
code = replaceExact(
  code,
  `: language === "ms"
              ? "Lepaskan PDF di sini"
              : t("workspace.dropHere")`,
  `: language === "ms"
              ? "Lepaskan PDF di sini"
              : language === "fil"
              ? "I-drop ang iyong PDF dito"
              : t("workspace.dropHere")`
);

// 2. or click to browse...
code = replaceExact(
  code,
  `: language === "ms"
              ? "atau klik untuk memilih dari komputer anda (Sehingga 100 MB)"
              : t("workspace.pdfOnly")`,
  `: language === "ms"
              ? "atau klik untuk memilih dari komputer anda (Sehingga 100 MB)"
              : language === "fil"
              ? "o mag-click upang mag-browse mula sa iyong computer (Hanggang 100 MB)"
              : t("workspace.pdfOnly")`
);

// 3. Select PDF File
code = replaceExact(
  code,
  `: language === "ms"
              ? "Pilih Fail PDF"
              : t("workspace.selectFile")`,
  `: language === "ms"
              ? "Pilih Fail PDF"
              : language === "fil"
              ? "Pumili ng PDF File"
              : t("workspace.selectFile")`
);

// 4. Cancel Processing
code = replaceExact(
  code,
  `Cancel Processing
                  </button>`,
  `{language === "fil" ? "Kanselahin ang Pagproseso" : "Cancel Processing"}
                  </button>`
);

fs.writeFileSync('src/components/pdf-overlay/PdfOverlayWorkspace.tsx', code, 'utf8');
console.log('PdfOverlayWorkspace updated!');
