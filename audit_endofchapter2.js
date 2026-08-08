const fs = require("fs");
const dir = "c:/Users/user/Downloads/StudyVerse/pdf-extract/text";
for (const i of [6, 7, 8]) {
  const t = fs.readFileSync(dir + "/iemh10" + i + ".txt", "utf8");
  const m = t.match(/[Ee]nd\s*-?\s*of[^\n]*[Ee]x[Ee]rcis[Ee]s?/);
  const start = m.index;
  // end at 'Chapter Summary' or end of file
  const endMatch = t.slice(start).match(/Chapter Summary/);
  const end = endMatch ? start + endMatch.index : t.length;
  const sec = t.slice(start, end);
  // Count question numbers: pattern "N." or "*N." at start of a question
  const nums = [...sec.matchAll(/(?:^|\n)\s*\*?(\d+)[\.\)]\s/g)].map((x) => parseInt(x[1]));
  const maxN = nums.length ? Math.max(...nums) : 0;
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  console.log("iemh10" + i + ": section length=" + sec.length + " | max q num=" + maxN + " | unique nums=" + uniq.join(","));
}