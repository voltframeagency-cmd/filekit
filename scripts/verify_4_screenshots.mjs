async function testScreenshotsFixes() {
  console.log('=== VERIFYING FIXES FOR 4 USER SCREENSHOTS ===');

  // Screenshot 1: /bg/powerpoint-to-pdf
  const pptRes = await fetch('http://localhost:3001/bg/powerpoint-to-pdf');
  const pptHtml = await pptRes.text();
  const pptH1 = pptHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
  console.log('\n1. /bg/powerpoint-to-pdf:');
  console.log('   H1:', pptH1 ? pptH1[1].replace(/<[^>]+>/g, '').trim() : 'N/A');
  console.log('   No File Utility:', !pptHtml.includes('File Utility'));
  console.log('   Drop Title (Изберете документ за конвертиране):', pptHtml.includes('Изберете документ за конвертиране'));
  console.log('   Drop Subtitle (Прецизно конвертиране):', pptHtml.includes('Прецизно конвертиране в изолирана microVM'));
  console.log('   Button (Избор на файл):', pptHtml.includes('Избор на файл'));

  // Screenshot 2: Mega Menu & Nav items
  const homeRes = await fetch('http://localhost:3001/bg');
  const homeHtml = await homeRes.text();
  console.log('\n2. Navbar & Mega Menu (/bg):');
  console.log('   Nav Resize (Преоразмеряване):', homeHtml.includes('Преоразмеряване'));
  console.log('   Nav Pricing (Цени):', homeHtml.includes('Цени'));

  // Screenshot 3: /bg/compress-pdf
  const pdfRes = await fetch('http://localhost:3001/bg/compress-pdf');
  const pdfHtml = await pdfRes.text();
  const pdfH1 = pdfHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
  console.log('\n3. /bg/compress-pdf:');
  console.log('   H1:', pdfH1 ? pdfH1[1].replace(/<[^>]+>/g, '').trim() : 'N/A');
  console.log('   Dropzone Title (Плъзнете PDF документа тук):', pdfHtml.includes('Плъзнете PDF документа тук'));
  console.log('   No English Drop your PDF here:', !pdfHtml.includes('Drop your PDF here'));

  // Screenshot 4: /bg/compress-image
  const imgRes = await fetch('http://localhost:3001/bg/compress-image');
  const imgHtml = await imgRes.text();
  const imgH1 = imgHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
  console.log('\n4. /bg/compress-image:');
  console.log('   H1:', imgH1 ? imgH1[1].replace(/<[^>]+>/g, '').trim() : 'N/A');
  console.log('   Dropzone Title (Плъзнете изображението тук):', imgHtml.includes('Плъзнете изображението тук'));
  console.log('   Subtitle (Поддържа JPG, PNG):', imgHtml.includes('Поддържа JPG, PNG'));
  console.log('   Privacy Pill (Вашето изображение се обработва локално):', imgHtml.includes('Вашето изображение се обработва локално'));
  console.log('   No English Drop your image here:', !imgHtml.includes('Drop your image here'));
}
testScreenshotsFixes().catch(console.error);
