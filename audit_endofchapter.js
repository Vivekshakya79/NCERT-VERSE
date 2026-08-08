const fs = require("fs");
const dir = "c:/Users/user/Downloads/StudyVerse/pdf-extract/text";
for (let i = 1; i <= 8; i++) {
  const t = fs.readFileSync(dir + "/iemh10" + i + ".txt", "utf8");
  const m = t.match(/[Ee]nd\s*-?\s*of[^\n]*[Ee]x[Ee]rcis[Ee]s?/);
  if (!m) {
    console.log("iemh10" + i + ": NO end marker found");
    continue;
  }
  const start = m.index;
  const sec = t.slice(start, start + 4000);
  const nums = [...sec.matchAll(/(?:^|\n)\s*(\d+)[\.\)]\s/g)].map((x) => parseInt(x[1]));
  console.log(
    "iemh10" + i + ": marker=" + JSON.stringify(m[0].replace(/\s+/g, " ")) + " | q nums: " + nums.join(",")
  );
}