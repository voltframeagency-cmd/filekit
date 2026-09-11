const fs = require("fs");
const file = "src/components/layout/ActionChooser.tsx";
let lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("create-zip")) {
    console.log(`Found create-zip at line ${i+1}`);
    console.log(`Line ${i+1}: ${lines[i]}`);
    console.log(`Line ${i+2}: ${lines[i+1]}`);
    console.log(`Line ${i+3}: ${lines[i+2]}`);
    if (lines[i+1].trim() === "" || lines[i+1].trim() === "];") {
      lines[i+1] = "  ];";
    } else {
      lines.splice(i+1, 0, "  ];");
    }
    break;
  }
}
fs.writeFileSync(file, lines.join("\n"), "utf8");
console.log("Updated lines!");
