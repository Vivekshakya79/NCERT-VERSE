const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
// Check all SVG diagrams are well-formed (balanced tags, start with <svg)
const dirs = fs.readdirSync(base);
let issues = 0;
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
    for (const q of data.questions || []) {
      if (q.diagram && q.diagram.type === "svg") {
        const c = q.diagram.content;
        const trimmed = c.trim();
        if (!trimmed.startsWith("<svg")) {
          console.log("ISSUE: " + d + "/" + f + " Q" + q.questionNumber + " does not start with <svg");
          issues++;
        }
        // check balanced svg tags
        const opens = (c.match(/<svg/g) || []).length;
        const closes = (c.match(/<\/svg>/g) || []).length;
        if (opens !== closes) {
          console.log("ISSUE: " + d + "/" + f + " Q" + q.questionNumber + " svg open=" + opens + " close=" + closes);
          issues++;
        }
        // check no unclosed angle brackets (rough)
        const lt = (c.match(/</g) || []).length;
        const gt = (c.match(/>/g) || []).length;
        if (lt !== gt) {
          console.log("ISSUE: " + d + "/" + f + " Q" + q.questionNumber + " < count=" + lt + " > count=" + gt);
          issues++;
        }
      }
    }
  }
}
console.log(issues === 0 ? "ALL SVG DIAGRAMS WELL-FORMED" : issues + " issues found");