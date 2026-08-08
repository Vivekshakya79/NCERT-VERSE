const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs = fs.readdirSync(base);
let diagramCount = 0;
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
    for (const q of data.questions || []) {
      if (q.diagram) {
        diagramCount++;
        console.log(d + "/" + f + " | Q" + q.questionNumber + " | diagram type=" + q.diagram.type + " | content len=" + (q.diagram.content || "").length);
      }
    }
  }
}
console.log("Total questions with diagrams:", diagramCount);