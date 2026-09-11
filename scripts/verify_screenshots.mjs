import { MEGA_MENU_CATEGORIES, EXACT_TOOL_LABELS, PRIMARY_DESCRIPTIONS } from '../src/components/navigation/megaMenuTranslations.ts';

console.log('=== VERIFYING FIXES FOR ALL SCREENSHOTS ===');

let pass = 0;
let total = 0;

function check(name, condition) {
  total++;
  if (condition) pass++;
  console.log((condition ? '✓' : '✗') + ' ' + name);
}

// Screenshot 2: Finnish Pakkaa
console.log('\n--- 2. Finnish Pakkaa Menu ---');
check('KUVAN PAKKAUS', MEGA_MENU_CATEGORIES['IMAGE COMPRESSION']['fi'] === 'KUVAN PAKKAUS');
check('PDF-TYÖKALUT', MEGA_MENU_CATEGORIES['PDF']['fi'] === 'PDF-TYÖKALUT');
check('Kuvapakkaaja', EXACT_TOOL_LABELS['Image Compressor']['fi'] === 'Kuvapakkaaja');
check('PDF-pakkaaja', EXACT_TOOL_LABELS['PDF Compressor']['fi'] === 'PDF-pakkaaja');
check('Pakkaa tiettyyn kokoon', EXACT_TOOL_LABELS['Compress to a Specific Size']['fi'] === 'Pakkaa tiettyyn kokoon');
check('SUOSITUT KOHDEKOOT', MEGA_MENU_CATEGORIES['POPULAR TARGET SIZES']['fi'] === 'SUOSITUT KOHDEKOOT');
check('Primary desc 1', PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE.fi === 'Optimoi JPG-, PNG- ja WebP-kuvat paikallisesti');
check('Primary desc 2', PRIMARY_DESCRIPTIONS.SHRINK_PDF.fi === 'Pienennä PDF-tiedostot alle 2 megatavuun selaimessa');

// Screenshot 3: Finnish Järjestä
console.log('\n--- 3. Finnish Järjestä Menu ---');
check('SIVUJEN MUOKKAUS JA JÄRJESTYS', MEGA_MENU_CATEGORIES['PAGE EDITING & ORGANIZATION']['fi'] === 'SIVUJEN MUOKKAUS JA JÄRJESTYS');
check('Yhdistä PDF-tiedostot', EXACT_TOOL_LABELS['Merge PDF Files']['fi'] === 'Yhdistä PDF-tiedostot');
check('Jaa PDF-asiakirja', EXACT_TOOL_LABELS['Split PDF Document']['fi'] === 'Jaa PDF-asiakirja');
check('PAKKAUS JA MUUNNOS', MEGA_MENU_CATEGORIES['COMPRESS & CONVERT']['fi'] === 'PAKKAUS JA MUUNNOS');
check('Järjestä sivut uudelleen', EXACT_TOOL_LABELS['Reorder Pages']['fi'] === 'Järjestä sivut uudelleen');
check('Käännä PDF-järjestys', EXACT_TOOL_LABELS['Reverse PDF']['fi'] === 'Käännä PDF-järjestys');
check('Lisää tyhjä sivu', EXACT_TOOL_LABELS['Add Blank Page']['fi'] === 'Lisää tyhjä sivu');
check('Monista sivut', EXACT_TOOL_LABELS['Duplicate Pages']['fi'] === 'Monista sivut');
check('Käännä sivuja', EXACT_TOOL_LABELS['Rotate Pages']['fi'] === 'Käännä sivuja');
check('Poista sivuja', EXACT_TOOL_LABELS['Delete Pages']['fi'] === 'Poista sivuja');
check('Pura sivuja', EXACT_TOOL_LABELS['Extract Pages']['fi'] === 'Pura sivuja');
check('Pura kuvat', EXACT_TOOL_LABELS['Extract Images']['fi'] === 'Pura kuvat');
check('Litistä PDF', EXACT_TOOL_LABELS['Flatten PDF']['fi'] === 'Litistä PDF');
check('Lisää vesileima', EXACT_TOOL_LABELS['Add Watermark']['fi'] === 'Lisää vesileima');
check('Primary desc Merge', PRIMARY_DESCRIPTIONS.MERGE_PDF.fi === 'Yhdistä useita PDF-tiedostoja selaimessa');

// Screenshot 4: Norwegian Komprimer
console.log('\n--- 4. Norwegian Komprimer Menu ---');
check('BILDEKOMPRIMERING', MEGA_MENU_CATEGORIES['IMAGE COMPRESSION']['no'] === 'BILDEKOMPRIMERING');
check('PDF-VERKTØY', MEGA_MENU_CATEGORIES['PDF']['no'] === 'PDF-VERKTØY');
check('Bildekomprimerer', EXACT_TOOL_LABELS['Image Compressor']['no'] === 'Bildekomprimerer');
check('PDF-komprimerer', EXACT_TOOL_LABELS['PDF Compressor']['no'] === 'PDF-komprimerer');
check('Komprimer til bestemt størrelse', EXACT_TOOL_LABELS['Compress to a Specific Size']['no'] === 'Komprimer til bestemt størrelse');
check('POPULÆRE MÅLSTØRRELSER', MEGA_MENU_CATEGORIES['POPULAR TARGET SIZES']['no'] === 'POPULÆRE MÅLSTØRRELSER');
check('Primary desc 1', PRIMARY_DESCRIPTIONS.IMAGE_OPTIMIZE.no === 'Optimaliser JPG, PNG og WebP lokalt');
check('Primary desc 2', PRIMARY_DESCRIPTIONS.SHRINK_PDF.no === 'Krymp PDF-er under 2 MB i nettleseren');

// Screenshot 5: Polish Konwertuj
console.log('\n--- 5. Polish Konwertuj Menu ---');
check('Obraz czarno-biały', EXACT_TOOL_LABELS['Grayscale Image']['pl'] === 'Obraz czarno-biały');
check('Odwróć kolory obrazu', EXACT_TOOL_LABELS['Invert Image']['pl'] === 'Odwróć kolory obrazu');
check('Rozmyj obraz', EXACT_TOOL_LABELS['Blur Image']['pl'] === 'Rozmyj obraz');
check('Przytnij obraz', EXACT_TOOL_LABELS['Crop Image']['pl'] === 'Przytnij obraz');
check('Zmień rozmiar obrazu', EXACT_TOOL_LABELS['Resize Image']['pl'] === 'Zmień rozmiar obrazu');
check('Obróć obraz', EXACT_TOOL_LABELS['Rotate Image']['pl'] === 'Obróć obraz');
check('Przerzuć obraz', EXACT_TOOL_LABELS['Flip Image']['pl'] === 'Przerzuć obraz');
check('Kompresuj wideo', EXACT_TOOL_LABELS['Compress Video']['pl'] === 'Kompresuj wideo');
check('Konwertuj wideo', EXACT_TOOL_LABELS['Convert Video']['pl'] === 'Konwertuj wideo');
check('Zmień prędkość wideo', EXACT_TOOL_LABELS['Change Speed']['pl'] === 'Zmień prędkość wideo');
check('Obróć wideo', EXACT_TOOL_LABELS['Rotate Video']['pl'] === 'Obróć wideo');
check('Wideo na GIF', EXACT_TOOL_LABELS['Video to GIF']['pl'] === 'Wideo na GIF');
check('Przytnij wideo', EXACT_TOOL_LABELS['Trim Video']['pl'] === 'Przytnij wideo');
check('Wycisz wideo', EXACT_TOOL_LABELS['Mute Video']['pl'] === 'Wycisz wideo');
check('Konwertuj dźwięk', EXACT_TOOL_LABELS['Convert Audio']['pl'] === 'Konwertuj dźwięk');
check('Kompresuj dźwięk', EXACT_TOOL_LABELS['Compress Audio']['pl'] === 'Kompresuj dźwięk');
check('Zwiększ głośność', EXACT_TOOL_LABELS['Boost Volume']['pl'] === 'Zwiększ głośność');
check('Przytnij dźwięk', EXACT_TOOL_LABELS['Trim Audio']['pl'] === 'Przytnij dźwięk');
check('Połącz dźwięki', EXACT_TOOL_LABELS['Merge Audio']['pl'] === 'Połącz dźwięki');
check('Rozpakuj ZIP', EXACT_TOOL_LABELS['Extract ZIP']['pl'] === 'Rozpakuj ZIP');
check('Rozpakuj RAR', EXACT_TOOL_LABELS['Extract RAR']['pl'] === 'Rozpakuj RAR');
check('Utwórz ZIP', EXACT_TOOL_LABELS['Create ZIP']['pl'] === 'Utwórz ZIP');
check('Usuń metadane EXIF', EXACT_TOOL_LABELS['Strip EXIF']['pl'] === 'Usuń metadane EXIF');

console.log('\nFINAL SCORE: ' + pass + '/' + total + ' PASSED (' + Math.round(pass/total*100) + '%)');
