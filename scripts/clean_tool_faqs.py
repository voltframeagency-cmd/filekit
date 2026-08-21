with open("src/config/seo/toolFaqs.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Replace the orphaned ternary in image section
broken_ternary = """  ) {
      ? "Bildkonverterare"
      : isDa
      ? "Billedkonvertering"
      : isNl
      ? "Beeldconverters"
      : isPl
      ? "Konwertery obrazów"
      : isRu
      ? "Конвертеры изображений"
      : isAr
      ? "محولات الصور"
      : isTr
      ? "Görsel Dönüştürücüler"
      : isEs
      ? "Convertidores de Imágenes"
      : isDe
      ? "Bild-Konverter"
      : isFr
      ? "Convertisseurs d'Images"
      : isIt
      ? "Convertitori di Immagini"
      : isPt
      ? "Conversores de Imagem"
      : "Image Converters";"""

fixed = """  ) {"""

if broken_ternary in text:
    text = text.replace(broken_ternary, fixed)
    with open("src/config/seo/toolFaqs.ts", "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed broken ternary in Image section.")
else:
    print("Pattern not matched directly, checking regex...")
