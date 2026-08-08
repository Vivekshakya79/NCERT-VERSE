const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
// Show first 600 chars of Ch1 Ex1.1 Q1 diagram
const d = JSON.parse(fs.readFileSync(path.join(base, "chapter-0/exercise-set-1.1.json"), "utf8"));
const q1 = d.questions.find((q) => q.questionNumber === 1);
console.log("=== Ch1 Ex1.1 Q1 diagram (first 600 chars) ===");
console.log(q1.diagram.content.slice(0, 600));
console.log("\n=== Ch1 Ex1.1 Q1 caption:", q1.diagram.caption, "===");