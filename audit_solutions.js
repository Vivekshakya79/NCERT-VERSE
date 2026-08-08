const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs = fs.readdirSync(base);
let total = 0, emptyAnswer = 0, noSteps = 0, notVerified = 0, issues = [];
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
    for (const q of data.questions || []) {
      total++;
      if (!q.answer || !q.answer.trim()) { emptyAnswer++; issues.push(d + "/" + f + " Q" + q.questionNumber + ": no answer"); }
      if (!q.solution || q.solution.length === 0) { noSteps++; issues.push(d + "/" + f + " Q" + q.questionNumber + ": no steps"); }
      if (q.verified !== true) { notVerified++; issues.push(d + "/" + f + " Q" + q.questionNumber + ": verified=" + q.verified); }
    }
  }
}
console.log("Total questions:", total);
console.log("Missing answers:", emptyAnswer);
console.log("Missing steps:", noSteps);
console.log("Not verified:", notVerified);
if (issues.length) console.log(issues.join("\n"));
else console.log("ALL QUESTIONS HAVE ANSWER + STEPS + verified=true");