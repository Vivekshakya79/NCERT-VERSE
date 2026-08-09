const fs = require("fs");
const path = require("path");
const base = "C:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
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
// Nested fractions (frac containing another frac)
console.log("=== NESTED \\frac (frac inside frac) ===");
const nested = [...allText.matchAll(/\\frac\{[^{}]*\\frac[^{}]*\{[^{}]*\}\}[^{}]*\}/g)].map(m => m[0]);
console.log(nested.length ? nested.slice(0, 10).join("  |  ") : "none");

// \overline and \overrightarrow
console.log("\n=== \\overline / \\overrightarrow ===");
const ov = [...allText.matchAll(/\\(?:overline|overrightarrow)\{[^{}]*\}/g)].map(m => m[0]);
console.log(ov.length ? [...new Set(ov)].slice(0, 10).join("  |  ") : "none");

// cases / array environments
console.log("\n=== \\begin{cases} SAMPLES ===");
const cases = [...allText.matchAll(/\\begin\{cases\}[\s\S]{0,200}?\\end\{cases\}/g)].slice(0, 3).map(m => m[0]);
console.log(cases.length ? cases.join("\n---\n") : "none");

console.log("\n=== \\begin{array} SAMPLES ===");
const arr = [...allText.matchAll(/\\begin\{array\}[\s\S]{0,200}?\\end\{array\}/g)].slice(0, 3).map(m => m[0]);
console.log(arr.length ? arr.join("\n---\n") : "none");

// \dfrac / \tfrac
console.log("\n=== \\dfrac / \\tfrac USAGE ===");
const dt = [...allText.matchAll(/\\(?:dfrac|tfrac)\{[^{}]*\}\{[^{}]*\}/g)].map(m => m[0]);
console.log(dt.length ? [...new Set(dt)].slice(0, 10).join("  |  ") : "none");

// \mathbf usage
console.log("\n=== \\mathbf USAGE ===");
const bf = [...allText.matchAll(/\\mathbf\{[^{}]*\}/g)].map(m => m[0]);
console.log(bf.length ? [...new Set(bf)].slice(0, 10).join("  |  ") : "none");

// \checkmark, \cos, \sin, \max, \min, \approx, \cong, \parallel, \perp, \triangle, \circ, \theta, \Delta, \pi, \pm
console.log("\n=== MISC SYMBOL USAGE ===");
for (const cmd of ["\\checkmark", "\\cos", "\\sin", "\\max", "\\min", "\\approx", "\\cong", "\\parallel", "\\perp", "\\triangle", "\\circ", "\\theta", "\\Delta", "\\pi", "\\pm", "\\ge", "\\le", "\\to", "\\iff", "\\implies"]) {
  const c = allText.split(cmd).length - 1;
  if (c > 0) console.log(cmd, "x" + c);
}

// Check raw \frac OUTSIDE $...$ delimiters
console.log("\n=== \\frac OUTSIDE $ DELIMITERS (sample) ===");
const lines = allText.split("\n");
let outside = 0;
for (const line of lines) {
  // crude: find \frac occurrences not preceded by $ or { within a $...$ block
  const fracIdx = line.indexOf("\\frac");
  if (fracIdx === -1) continue;
  const before = line.slice(0, fracIdx);
  const dollarCount = (before.match(/\$/g) || []).length;
  if (dollarCount % 2 === 0) {
    outside++;
    if (outside <= 5) console.log("  " + line.trim().slice(0, 120));
  }
}
console.log("Total lines with \\frac outside $ blocks:", outside);