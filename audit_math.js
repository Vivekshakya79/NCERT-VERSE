const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
function show(file, qnum) {
  const d = JSON.parse(fs.readFileSync(path.join(base, file), "utf8"));
  const q = d.questions.find((x) => x.questionNumber === qnum);
  if (!q) { console.log("NOT FOUND: " + file + " Q" + qnum); return; }
  console.log("=== " + file + " Q" + qnum + " ===");
  console.log("Q: " + q.question.slice(0, 200));
  console.log("Answer: " + (q.answer || "(none)"));
  console.log("Steps: " + (q.solution || []).length);
  for (const s of q.solution || []) {
    console.log("  [" + s.type + "] " + (s.content || "").slice(0, 150));
  }
  console.log("");
}
show("chapter-0/exercise-set-1.1.json", 1);
show("chapter-3/exercise-set-3.1.json", 1);
show("chapter-4/exercise-set-4.2.json", 1);
show("chapter-6/exercise-set-6.3.json", 1);
show("chapter-8/exercise-set-8.1.json", 1);