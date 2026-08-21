with open("src/config/seo/toolFaqs.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Replace audio category ternary
audio_broken = """  ) {
    const isAudioMerge = normSlug === "/merge-audio";
      : isAr ? "الصوت والفيديو"
      : isTr ? "Ses ve Video"
      : isEs ? "Audio y Video"
      : isDe ? "Audio und Video"
      : isFr ? "Audio et Vidéo"
      : isIt ? "Audio e Video"
      : isPt ? "Áudio e Vídeo"
      : isPl ? "Audio i Wideo"
      : isRu ? "Аудио и Видео"
      : isJa ? "音声・動画"
      : isKo ? "오디오 및 비디오"
      : isZh ? "音频与视频"
      : "Audio & Video";"""

audio_fixed = """  ) {
    const isAudioMerge = normSlug === "/merge-audio";"""

# Replace default category ternary (lines 490-506)
default_cat_pattern = """    : isPl ? "Narzędzia do PDF i Dokumentów"
    : isRu ? "Инструменты для PDF и документов"
    : isJa ? "PDF・ドキュメントツール"
    : isKo ? "PDF 및 문서 유틸리티"
    : isZh ? "PDF 与文档工具"
    : "PDF & Document Utilities";"""

text = text.replace(audio_broken, audio_fixed)

import re
text = re.sub(r'const category\s*=\s*isSv\s*\?[\s\S]*?:\s*"PDF & Document Utilities";', '', text)
text = re.sub(r'^\s*:\s*isPl\s*\?[\s\S]*?:\s*"PDF & Document Utilities";', '', text, flags=re.MULTILINE)

with open("src/config/seo/toolFaqs.ts", "w", encoding="utf-8") as f:
    f.write(text)

print("Cleaned audio and default category remnants.")
