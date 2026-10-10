// Helper for inspecting SSR HTML for prohibited English leaks

export const SSR_LEAK_PATTERNS = [
  'Drop your PDF here',
  'Drop your image here',
  'Select PowerPoint Presentation',
  'Select Word Document',
  'Select Excel Spreadsheet',
  'High-fidelity LibreOffice',
  'Ephemeral MicroVM Sandbox',
  'Secure Server Conversion Notice',
  'Choose PDF',
  'Processed locally in your browser. Your file is never uploaded.',
  'Select Font File',
  'Live Font Preview',
  'Select eBook File',
  'Rendering eBook pages to PDF...',
  'Converting PDF into responsive EPUB eBook...',
  'Your conversion is complete',
  'Drop a file anywhere to get started',
  'or click to browse files from your device',
  'Explore all 100+ tools',
  'Popular Tools',
  'Browser-first processing',
  'Automatic deletion after server jobs',
  'No account required',
  '100% Private & Secure'
];

export const SSR_DOM_LEAK_RULES = {
  buttons: [
    'Select File',
    'Choose File',
    'Download File',
    'Change File',
    'Compress PDF',
    'Recompress PDF',
    'Download Compressed PDF',
    'Download Original PDF',
    'Download Best Result',
    'Download TXT',
    'Download Searchable PDF',
    'Recognize & Extract Text',
    'Copy Text',
    'Apply Watermark',
    'Convert to PDF',
    'All Tools →',
    'Dismiss'
  ],
  placeholders: [
    'Search 100+ tools...',
    'Search tools (e.g. merge, png)...',
    'Enter watermark text',
    'e.g. 1-3, 5'
  ],
  ariaLabels: [
    'Convert Tools',
    'Open navigation menu',
    'Close navigation menu',
    'Mobile Navigation Menu',
    'Search tools',
    'Tool search results'
  ],
  megaMenus: [
    'IMAGE COMPRESSION',
    'PDF TOOLS',
    'COMPRESS & CONVERT',
    'POPULAR TARGET SIZES',
    'PAGE EDITING & ORGANIZATION',
    'CONVERT FROM PDF',
    'CONVERT TO PDF',
    'DOCUMENTS & E-BOOKS',
    'CAD & VECTOR TOOLS',
    'AUDIO TOOLS',
    'ARCHIVE & UTILITIES',
    'FORMAT PAIRS'
  ],
  uploadStates: [
    'Drop your PDF document here',
    'Drop your image here',
    'Supports standard PDF documents up to 50 MB',
    'Supports JPG, PNG, and WebP',
    'Select Scanned Document or Image'
  ],
  progressStates: [
    'Compressing PDF locally...',
    'Processing locally...',
    'Reading file data into memory...',
    'Performing OCR Recognition...',
    'Sanitizing image...',
    'Rendering document pages...'
  ],
  errorStates: [
    'Failed to recognize text in document.',
    'Please select a valid PDF document.',
    'Minimum PDF target size limit is 100 KB.',
    'Maximum PDF target size limit is 50 MB.',
    'An error occurred while processing your file.'
  ],
  resultStates: [
    'PDF compressed successfully',
    'No beneficial reduction',
    'We reduced the PDF, but could not reach requested size safely',
    'Your PDF is already below requested size',
    'OCR Completed',
    'Successfully converted to PDF'
  ]
};

export function inspectSsrHtml(html: string, locale: string, route: string = ''): Array<{ type: string; pattern: string; context: string }> {
  const leaks: Array<{ type: string; pattern: string; context: string }> = [];
  if (locale === 'en') return leaks;

  // 1. Static LEAK_PATTERNS
  for (const pattern of SSR_LEAK_PATTERNS) {
    if (html.includes(pattern)) {
      leaks.push({ type: 'static_pattern', pattern, context: route });
    }
  }

  // 2. Buttons: <button[^>]*>([\s\S]*?)<\/button>
  const buttonMatches = html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi);
  for (const match of buttonMatches) {
    const rawText = match[1].replace(/<[^>]+>/g, '').trim();
    for (const rule of SSR_DOM_LEAK_RULES.buttons) {
      if (rawText === rule) {
        leaks.push({ type: 'button', pattern: rule, context: route });
      }
    }
  }

  // 3. Placeholders: placeholder="([^"]+)"
  const placeholderMatches = html.matchAll(/placeholder=["']([^"']+)["']/gi);
  for (const match of placeholderMatches) {
    const ph = match[1].trim();
    for (const rule of SSR_DOM_LEAK_RULES.placeholders) {
      if (ph === rule) {
        leaks.push({ type: 'placeholder', pattern: rule, context: route });
      }
    }
  }

  // 4. ARIA labels: aria-label="([^"]+)"
  const ariaMatches = html.matchAll(/aria-label=["']([^"']+)["']/gi);
  for (const match of ariaMatches) {
    const label = match[1].trim();
    for (const rule of SSR_DOM_LEAK_RULES.ariaLabels) {
      if (label === rule) {
        leaks.push({ type: 'aria_label', pattern: rule, context: route });
      }
    }
  }

  // 5. Mega Menu categories & headings
  for (const rule of SSR_DOM_LEAK_RULES.megaMenus) {
    if (html.includes(`>${rule}<`) || html.includes(`>${rule} <`) || html.includes(`">${rule}"`)) {
      leaks.push({ type: 'mega_menu', pattern: rule, context: route });
    }
  }

  // 6. Interactive state texts
  const stateCategories: (keyof typeof SSR_DOM_LEAK_RULES)[] = ['uploadStates', 'progressStates', 'errorStates', 'resultStates'];
  for (const cat of stateCategories) {
    for (const rule of SSR_DOM_LEAK_RULES[cat]) {
      if (html.includes(rule)) {
        leaks.push({ type: cat, pattern: rule, context: route });
      }
    }
  }

  return leaks;
}
