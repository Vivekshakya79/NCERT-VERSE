const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs = fs.readdirSync(base);
let allText = "";
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    allText += fs.readFileSync(path.join(full, f), "utf8") + "\n";
  }
}
// Extract all backslash commands
const cmds = new Set();
for (const m of allText.matchAll(/\\([a-zA-Z]+)/g)) cmds.add("\\" + m[1]);
console.log("=== ALL LATEX COMMANDS USED ===");
console.log([...cmds].sort().join(" "));

// Sample \frac patterns
console.log("\n=== SAMPLE \\frac USAGES ===");
const fracs = [...allText.matchAll(/\\frac\{[^{}]*\}\{[^{}]*\}/g)].slice(0, 15).map(m => m[0]);
console.log(fracs.join("  |  "));

// Sample \sqrt patterns
console.log("\n=== SAMPLE \\sqrt USAGES ===");
const sqrts = [...allText.matchAll(/\\sqrt(?:\[[^\]]*\])?\{[^{}]*\}/g)].slice(0, 15).map(m => m[0]);
console.log(sqrts.join("  |  "));

// Sample \text patterns
console.log("\n=== SAMPLE \\text USAGES ===");
const texts = [...allText.matchAll(/\\text\{[^{}]*\}/g)].slice(0, 15).map(m => m[0]);
console.log(texts.join("  |  "));

// Sample superscript patterns
console.log("\n=== SAMPLE ^{...} USAGES ===");
const sups = [...allText.matchAll(/\^\{[^{}]*\}/g)].slice(0, 15).map(m => m[0]);
console.log(sups.join("  |  "));

// Sample \left \right patterns
console.log("\n=== SAMPLE \\left...\\right USAGES ===");
const lr = [...allText.matchAll(/\\left[^a-zA-Z]|\\right[^a-zA-Z]/g)].slice(0, 20).map(m => m[0]);
console.log(lr.join("  |  "));

// Sample \angle usage
console.log("\n=== SAMPLE \\angle USAGES ===");
const ang = [...allText.matchAll(/\\angle[^a-zA-Z]/g)].slice(0, 10).map(m => m[0]);
console.log(ang.join("  |  "));

// Check for \begin / \end (environments)
console.log("\n=== ENVIRONMENTS ===");
const envs = [...allText.matchAll(/\\(begin|end)\{[^}]*\}/g)].map(m => m[0]);
console.log(envs.length ? [...new Set(envs)].join(" ") : "none");