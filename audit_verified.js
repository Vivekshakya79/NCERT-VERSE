const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions";
const classes = fs.readdirSync(base);
for (const c of classes) {
  const cpath = path.join(base, c);
  if (!fs.statSync(cpath).isDirectory()) continue;
  const subs = fs.readdirSync(cpath);
  for (const s of subs) {
    const spath = path.join(cpath, s);
    if (!fs.statSync(spath).isDirectory()) continue;
    const chs = fs.readdirSync(spath);
    let total = 0, verifiedTrue = 0, verifiedFalse = 0, missingField = 0;
    for (const ch of chs) {
      const chpath = path.join(spath, ch);
      if (!fs.statSync(chpath).isDirectory()) continue;
      for (const f of fs.readdirSync(chpath)) {
        if (!f.endsWith(".json")) continue;
        const d = JSON.parse(fs.readFileSync(path.join(chpath, f), "utf8"));
        for (const q of d.questions || []) {
          total++;
          if (q.verified === true) verifiedTrue++;
          else if (q.verified === false) verifiedFalse++;
          else missingField++;
        }
      }
    }
    console.log(c + "/" + s + ": total=" + total + " verified=true:" + verifiedTrue + " verified=false:" + verifiedFalse + " missing:" + missingField);
  }
}