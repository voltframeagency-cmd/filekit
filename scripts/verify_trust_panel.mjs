async function verifyAllTrustPanels() {
  console.log('=== VERIFYING TRUST PANEL LOCALIZATION (/bg/compress-image) ===');
  const res = await fetch('http://localhost:3001/bg/compress-image');
  const html = await res.text();
  console.log('Includes 100% Поверително:', html.includes('100% Поверително'));
  console.log('Includes Вашият файл остава под ваш контрол.:', html.includes('Вашият файл остава под ваш контрол.'));
  console.log('Includes Локална обработка:', html.includes('Локална обработка'));
  console.log('Includes Временни файлове:', html.includes('Временни файлове'));
  console.log('Includes Без скрити абонаменти:', html.includes('Без скрити абонаменти'));
  console.log('No English 100% Private:', !html.includes('100% Private'));
  console.log('No English Local First:', !html.includes('Local First'));
  console.log('No English Temporary Only:', !html.includes('Temporary Only'));
  console.log('No English No Hidden Trials:', !html.includes('No Hidden Trials'));
}
verifyAllTrustPanels().catch(console.error);
