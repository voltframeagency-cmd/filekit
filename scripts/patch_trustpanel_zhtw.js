const fs = require('fs');
let code = fs.readFileSync('src/components/layout/TrustPanel.tsx', 'utf8');

code = code.replace('return map[l] || map[lang] || map.en;', 'return map[lang] || map[l] || map.en;');

code = code.replace('"zh": "100% 隐私安全"', '"zh": "100% 隐私安全",\n    "zh-TW": "100% 隱私安全"');
code = code.replace('"zh": "您的文件完全由您自主掌控。"', '"zh": "您的文件完全由您自主掌控。",\n    "zh-TW": "您的檔案完全由您自主掌控。"');
code = code.replace('"zh": "本地端优先处理"', '"zh": "本地端优先处理",\n    "zh-TW": "本機端優先處理"');
code = code.replace('"zh": "在安全的前提下均在浏览器本地直接运算。"', '"zh": "在安全的前提下均在浏览器本地直接运算。",\n    "zh-TW": "在安全的前提下均在瀏覽器本機直接運算。"');
code = code.replace('"zh": "仅临时保留"', '"zh": "仅临时保留",\n    "zh-TW": "僅臨時保留"');
code = code.replace('"zh": "服务器上的临时文件会自动过期并完全销毁。"', '"zh": "服务器上的临时文件会自动过期并完全销毁。",\n    "zh-TW": "伺服器上的臨時檔案會自動過期並完全銷毀。"');
code = code.replace('"zh": "无任何隐藏订阅"', '"zh": "无任何隐藏订阅",\n    "zh-TW": "無任何隱藏訂閱"');
code = code.replace('"zh": "清晰透明的使用条款与计费说明。"', '"zh": "清晰透明的使用条款与计费说明。",\n    "zh-TW": "清晰透明的使用條款與計費說明。"');

fs.writeFileSync('src/components/layout/TrustPanel.tsx', code, 'utf8');
console.log('Successfully updated TrustPanel.tsx');
