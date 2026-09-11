import fs from 'fs';

const file = 'src/components/image-tools/ImageConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Choose Another button
content = content.replace(
  '                  {isFilipino\n                    ? "Pumili ng Iba"',
  '                  {isJapanese\n                    ? "別の画像を選択"\n                    : isFilipino\n                    ? "Pumili ng Iba"'
);

// 2. Converting Image badge
content = content.replace(
  '                      {isFilipino\n                        ? "Kinukumberte ang Larawan..."',
  '                      {isJapanese\n                        ? "画像を変換中..."\n                        : isFilipino\n                        ? "Kinukumberte ang Larawan..."'
);

// 3. Converted successfully badge
content = content.replace(
  '                      {isFilipino\n                        ? "Matagumpay na nakumberte ang larawan"',
  '                      {isJapanese\n                        ? "画像の変換が完了しました"\n                        : isFilipino\n                        ? "Matagumpay na nakumberte ang larawan"'
);

// 4. Output size larger
content = content.replace(
  '{isJapanese ? `📈 出力サイズが ${result.sizeChangePercentage}% 増加` : isFilipino',
  '{isJapanese ? `📈 出力サイズが ${result.sizeChangePercentage}% 増加` : isFilipino'
);
if (!content.includes('出力サイズが')) {
  content = content.replace(
    '                          {isFilipino\n                            ? `📈 Ang output ay ${result.sizeChangePercentage}% na mas malaki`',
    '                          {isJapanese\n                            ? `📈 出力サイズが ${result.sizeChangePercentage}% 増加`\n                            : isFilipino\n                            ? `📈 Ang output ay ${result.sizeChangePercentage}% na mas malaki`'
  );
  content = content.replace(
    '                        {isFilipino\n                          ? `📉 Ang output ay ${result.sizeChangePercentage}% na mas maliit`',
    '                        {isJapanese\n                          ? `📉 出力サイズが ${result.sizeChangePercentage}% 削減`\n                          : isFilipino\n                          ? `📉 Ang output ay ${result.sizeChangePercentage}% na mas maliit`'
  );
}

// 5. Download Converted Image button
content = content.replace(
  '                        {isFilipino\n                          ? "I-download ang Kinumberteng Larawan"',
  '                        {isJapanese\n                          ? "変換した画像をダウンロード"\n                          : isFilipino\n                          ? "I-download ang Kinumberteng Larawan"'
);

// 6. Adjust Settings button
content = content.replace(
  '                        {isFilipino\n                          ? "I-adjust ang mga Setting"',
  '                        {isJapanese\n                          ? "設定を調整"\n                          : isFilipino\n                          ? "I-adjust ang mga Setting"'
);

// 7. Conversion Options heading
content = content.replace(
  '                {isFilipino\n                  ? "Mga Opsyon sa Pagkumberte"',
  '                {isJapanese\n                  ? "変換設定"\n                  : isFilipino\n                  ? "Mga Opsyon sa Pagkumberte"'
);

// 8. Target Format label
content = content.replace(
  '                {isFilipino\n                  ? "Target na Format"',
  '                {isJapanese\n                  ? "変換先の形式"\n                  : isFilipino\n                  ? "Target na Format"'
);

// 9. Compression Quality label
content = content.replace(
  '                  {isFilipino\n                    ? "Kalidad ng Compression"',
  '                  {isJapanese\n                    ? "圧縮品質"\n                    : isFilipino\n                    ? "Kalidad ng Compression"'
);

// 10. Background Color label
content = content.replace(
  '                  {isFilipino\n                    ? "Kulay ng Background para sa Transparency"',
  '                  {isJapanese\n                    ? "透明部分の背景色"\n                    : isFilipino\n                    ? "Kulay ng Background para sa Transparency"'
);

// 11. White / Black / Custom bg choices
content = content.replace(
  '                    {isFilipino ? "Puti" : isThai ? "ขาว" : isMalay ? "Putih" : isSwedish ? "Vit" : isDanish ? "Hvid" : isFinnish ? "Valkoinen" : isCatalan ? "Blanc" : isDutch ? "Wit" : isItalian ? "Bianco" : isPortuguese ? "Branco" : isFrench ? "Blanc" : isGerman ? "Weiß" : isSpanish ? "Blanco" : "White"}',
  '                    {isJapanese ? "白" : isFilipino ? "Puti" : isThai ? "ขาว" : isMalay ? "Putih" : isSwedish ? "Vit" : isDanish ? "Hvid" : isFinnish ? "Valkoinen" : isCatalan ? "Blanc" : isDutch ? "Wit" : isItalian ? "Bianco" : isPortuguese ? "Branco" : isFrench ? "Blanc" : isGerman ? "Weiß" : isSpanish ? "Blanco" : "White"}'
);

content = content.replace(
  '                    {isFilipino ? "Itim" : isThai ? "ดำ" : isMalay ? "Hitam" : isSwedish ? "Svart" : isDanish ? "Sort" : isFinnish ? "Musta" : isCatalan ? "Negre" : isDutch ? "Zwart" : isItalian ? "Nero" : isPortuguese ? "Preto" : isFrench ? "Noir" : isGerman ? "Schwarz" : isSpanish ? "Negro" : "Black"}',
  '                    {isJapanese ? "黒" : isFilipino ? "Itim" : isThai ? "ดำ" : isMalay ? "Hitam" : isSwedish ? "Svart" : isDanish ? "Sort" : isFinnish ? "Musta" : isCatalan ? "Negre" : isDutch ? "Zwart" : isItalian ? "Nero" : isPortuguese ? "Preto" : isFrench ? "Noir" : isGerman ? "Schwarz" : isSpanish ? "Negro" : "Black"}'
);

content = content.replace(
  '                    {isFilipino ? "Pasadya" : isThai ? "กำหนดเอง" : isMalay ? "Khas" : isSwedish ? "Anpassad" : isDanish ? "Brugerdefineret" : isFinnish ? "Mukautettu" : isCatalan ? "Personalitzat" : isDutch ? "Aangepast" : isItalian ? "Personalizzato" : isPortuguese ? "Personalizado" : isFrench ? "Personnalisé" : isGerman ? "Benutzerdefiniert" : isSpanish ? "Personalizado" : "Custom"}',
  '                    {isJapanese ? "カスタム" : isFilipino ? "Pasadya" : isThai ? "กำหนดเอง" : isMalay ? "Khas" : isSwedish ? "Anpassad" : isDanish ? "Brugerdefineret" : isFinnish ? "Mukautettu" : isCatalan ? "Personalitzat" : isDutch ? "Aangepast" : isItalian ? "Personalizzato" : isPortuguese ? "Personalizado" : isFrench ? "Personnalisé" : isGerman ? "Benutzerdefiniert" : isSpanish ? "Personalizado" : "Custom"}'
);

// 12. Convert Another Image button
content = content.replace(
  '                {isFilipino\n                  ? "Magkumberte ng Isa Pang Larawan"',
  '                {isJapanese\n                  ? "別の画像を変換"\n                  : isFilipino\n                  ? "Magkumberte ng Isa Pang Larawan"'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated ImageConverterWorkspace.tsx with Japanese translations.');
