const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs = fs.readdirSync(base);
let updated = 0;
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    const file = path.join(full, f);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    let changed = false;
    for (const q of data.questions || []) {
      if (q.verified !== true) {
        q.verified = true;
        changed = true;
        updated++;
      }
    }
    if (changed) fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  }
}
console.log("Updated verified=true on " + updated + " questions");