const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs = fs.readdirSync(base);
const patterns = {
  "\\frac": 0,
  "\\sqrt": 0,
  "\\text": 0,
  "\\cdot": 0,
  "\\times": 0,
  "\\div": 0,
  "\\leq": 0,
  "\\geq": 0,
  "\\neq": 0,
  "\\angle": 0,
  "\\Rightarrow": 0,
  "\\ldots": 0,
  "\\dots": 0,
  "\\quad": 0,
  "\\qquad": 0,
  "\\;": 0,
  "\\,": 0,
  "\\left": 0,
  "\\right": 0,
  "\\text{": 0,
  "^{": 0,
  "_{": 0,
  "\\(": 0,
  "\\)": 0,
  "\\[": 0,
  "\\]": 0,
};
let totalFrac = 0;
const fracFiles = {};
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    const file = path.join(full, f);
    const text = fs.readFileSync(file, "utf8");
    for (const [pat, count] of Object.entries(patterns)) {
      const matches = text.split(pat).length - 1;
      patterns[pat] += matches;
    }
    const fracCount = text.split("\\frac").length - 1;
    if (fracCount > 0) {
      totalFrac += fracCount;
      fracFiles[d + "/" + f] = fracCount;
    }
  }
}
console.log("=== RAW LATEX COMMAND COUNTS (all class-9 files) ===");
for (const [pat, count] of Object.entries(patterns)) {
  if (count > 0) console.log(pat.padEnd(14), count);
}
console.log("\n=== \\frac counts per file ===");
for (const [file, count] of Object.entries(fracFiles)) {
  console.log(file.padEnd(50), count);
}
console.log("\nTotal \\frac:", totalFrac);