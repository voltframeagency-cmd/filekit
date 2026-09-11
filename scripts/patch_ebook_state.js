const fs = require("fs");
const file = "src/utils/ebook/EbookWorkspace.tsx";
let content = fs.readFileSync(file, "utf8");

// Normalize line endings
content = content.replace(/\r\n/g, "\n");

const target = `  const isJapanese = language === "ja";
    };
  }, [outputUrl]);`;

const replacement = `  const isJapanese = language === "ja";
  const isKorean = language === "ko";

  const [file, setFile] = useState<File | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully patched EbookWorkspace.tsx state!");
} else {
  console.log("Target not found!");
}
