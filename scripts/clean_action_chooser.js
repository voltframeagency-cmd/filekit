const fs = require("fs");
const file = "src/components/layout/ActionChooser.tsx";
let content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");

const idx = content.indexOf('];Z", active: true },');
if (idx !== -1) {
  const endIdx = content.indexOf('  ];\n\n  return (', idx);
  if (endIdx !== -1) {
    content = content.slice(0, idx) + content.slice(endIdx + 5);
    fs.writeFileSync(file, content, "utf8");
    console.log("Successfully cleaned up ActionChooser.tsx!");
  } else {
    console.log("Could not find endIdx");
  }
} else {
  console.log("Could not find idx");
}
