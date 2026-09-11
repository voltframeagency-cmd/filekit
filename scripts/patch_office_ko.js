const fs = require('fs');

const file = 'src/components/office-tools/OfficeConverterWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add isKorean flag
content = content.replace(
  '  const isJapanese = language === "ja";',
  '  const isJapanese = language === "ja";\n  const isKorean = language === "ko";'
);

// 2. Select document heading
content = content.replace(
  ': isJapanese\n                ? "変換するドキュメントを選択"',
  ': isKorean\n                ? "변환할 문서 선택"\n                : isJapanese\n                ? "変換するドキュメントを選択"'
);

// 3. Dropzone privacy paragraph
content = content.replace(
  ': isJapanese\n                ? "データ保持0%の分離されたMicroVMによる高精度LibreOffice変換。"',
  ': isKorean\n                ? "데이터 보존율 0%의 격리된 MicroVM을 통한 고정밀 LibreOffice 변환."\n                : isJapanese\n                ? "データ保持0%の分離されたMicroVMによる高精度LibreOffice変換。"'
);

// 4. Choose document button
content = content.replace(
  '{isJapanese ? "ファイルを選択" :',
  '{isKorean ? "파일 선택" : isJapanese ? "ファイルを選択" :'
);

// 5. Change file
content = content.replace(
  '{isJapanese ? "ファイルを変更" :',
  '{isKorean ? "파일 변경" : isJapanese ? "ファイルを変更" :'
);

// 6. Ephemeral MicroVM sandbox title
content = content.replace(
  ': isJapanese\n                  ? "一時的なMicroVMサンドボックス"',
  ': isKorean\n                  ? "임시 MicroVM 샌드박스"\n                  : isJapanese\n                  ? "一時的なMicroVMサンドボックス"'
);

// 7. MicroVM description
content = content.replace(
  ': isJapanese\n                  ? "ドキュメント処理は分離されたMicroVMコンテナ内で実行されます。ファイルは転送中に暗号化され、変換直後にクラウドメモリから自動的に消去されます。"',
  ': isKorean\n                  ? "문서 처리는 격리된 MicroVM 컨테이너 내에서 실행됩니다. 파일은 전송 중 암호화되며 변환 직후 클라우드 메모리에서 자동으로 영구 삭제됩니다."\n                  : isJapanese\n                  ? "ドキュメント処理は分離されたMicroVMコンテナ内で実行されます。ファイルは転送中に暗号化され、変換直後にクラウドメモリから自動的に消去されます。"'
);

// 8. Convert to PDF button
content = content.replace(
  'isJapanese ? (\n                "PDFに変換"\n              ) :',
  'isKorean ? (\n                "PDF로 변환"\n              ) : isJapanese ? (\n                "PDFに変換"\n              ) :'
);

// 9. Converted successfully heading
content = content.replace(
  ': isJapanese\n                      ? "PDFへの変換が完了しました！"',
  ': isKorean\n                      ? "PDF 변환이 완료되었습니다!"\n                      : isJapanese\n                      ? "PDFへの変換が完了しました！"'
);

// 10. Result details
content = content.replace(
  ': isJapanese\n                      ? `${result.durationMs}ms で処理完了 • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • 一時コンテナ消去済み`',
  ': isKorean\n                      ? `${result.durationMs}ms 만에 처리 완료 • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • 임시 컨테이너 자동 삭제 완료`\n                      : isJapanese\n                      ? `${result.durationMs}ms で処理完了 • ${(result.outputSizeBytes / 1024).toFixed(1)} KB • 一時コンテナ消去済み`'
);

// 11. Download PDF button
content = content.replace(
  '{isJapanese ? "PDFをダウンロード" :',
  '{isKorean ? "PDF 다운로드" : isJapanese ? "PDFをダウンロード" :'
);

// 12. Modal header
content = content.replace(
  ': isJapanese\n                  ? "安全なサーバー変換に関する通知"',
  ': isKorean\n                  ? "보안 서버 변환 안내"\n                  : isJapanese\n                  ? "安全なサーバー変換に関する通知"'
);

// 13. Modal description
content = content.replace(
  ': isJapanese\n                ? "このドキュメントの変換には、タイポグラフィとレイアウトの完全な再現性を確保するために、分離されたクラウドMicroVMが必要です。ファイルはメモリ内で処理され、完了後すぐに消去されます。"',
  ': isKorean\n                ? "이 문서는 서체 및 레이아웃 무결성을 유지하기 위해 격리된 클라우드 MicroVM 변환이 필요합니다. 파일은 메모리 내에서 안전하게 처리되며 완료 즉시 영구 삭제됩니다."\n                : isJapanese\n                ? "このドキュメントの変換には、タイポグラフィとレイアウトの完全な再現性を確保するために、分離されたクラウドMicroVMが必要です。ファイルはメモリ内で処理され、完了後すぐに消去されます。"'
);

// 14. Cancel button
content = content.replace(
  '{isJapanese ? "キャンセル" :',
  '{isKorean ? "취소" : isJapanese ? "キャンセル" :'
);

// 15. Authorize & Convert button
content = content.replace(
  '{isJapanese ? "承認して変換" :',
  '{isKorean ? "동의하고 변환" : isJapanese ? "承認して変換" :'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully patched OfficeConverterWorkspace.tsx for Korean');
