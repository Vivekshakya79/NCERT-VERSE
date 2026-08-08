const fs = require("fs");
const dir = "c:/Users/user/Downloads/StudyVerse/pdf-extract/text";
for (const i of [1, 2, 3, 4, 5]) {
  const t = fs.readFileSync(dir + "/iemh10" + i + ".txt", "utf8");
  const m = t.match(/[Ee]nd\s*-?\s*of[^\n]*[Ee]x[Ee]rcis[Ee]s?/);
  const start = m.index;
  const endMatch = t.slice(start).match(/Chapter Summary/);
  const end = endMatch ? start + endMatch.index : t.length;
  const sec = t.slice(start, end);
  const nums = [...sec.matchAll(/(?:^|\n)\s*\*?(\d+)[\.\)]\s/g)].map((x) => parseInt(x[1]));
  const maxN = nums.length ? Math.max(...nums) : 0;
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  console.log("iemh10" + i + ": section length=" + sec.length + " | max q num=" + maxN + " | unique nums=" + uniq.join(","));
}