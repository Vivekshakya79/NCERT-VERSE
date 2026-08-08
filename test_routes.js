const fs = require("fs");
const path = require("path");
const base = "c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const BASE_URL = "http://localhost:3000";

// Build the list of routes from actual data files
// Directory name -> chapterIdx mapping (from solutions-data.ts manifest)
const DIR_TO_IDX = {
  "chapter-0": 0, "chapter-1": 1, "chapter-3": 2, "chapter-4": 3,
  "chapter-5": 4, "chapter-6": 5, "chapter-7": 6, "chapter-8": 7,
};
const routes = [];
const dirs = fs.readdirSync(base).sort();
for (const d of dirs) {
  const full = path.join(base, d);
  if (!fs.statSync(full).isDirectory()) continue;
  const idx = DIR_TO_IDX[d];
  if (idx === undefined) continue;
  for (const f of fs.readdirSync(full).sort()) {
    if (!f.endsWith(".json")) continue;
    const data = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
    const exName = encodeURIComponent(data.name);
    // exercise route
    routes.push({ type: "exercise", url: `/ncert/9/Mathematics/${idx}/exercise/${exName}`, label: `ch${idx} ${data.name}` });
    // question routes (first and last question of each exercise)
    const qs = data.questions || [];
    if (qs.length) {
      routes.push({ type: "question", url: `/ncert/9/Mathematics/${idx}/exercise/${exName}/${qs[0].id}`, label: `ch${idx} ${data.name} Q${qs[0].questionNumber}` });
      if (qs.length > 1) {
        routes.push({ type: "question", url: `/ncert/9/Mathematics/${idx}/exercise/${exName}/${qs[qs.length - 1].id}`, label: `ch${idx} ${data.name} Q${qs[qs.length - 1].questionNumber}` });
      }
    }
  }
}

// Chapter list routes
for (let i = 0; i < 8; i++) {
  routes.push({ type: "chapter", url: `/ncert/9/Mathematics/${i}`, label: `chapter ${i}` });
}

async function test() {
  let pass = 0, fail = 0;
  const failures = [];
  for (const r of routes) {
    try {
      const res = await fetch(BASE_URL + r.url, { redirect: "manual" });
      if (res.status === 200) {
        pass++;
      } else {
        fail++;
        failures.push(`${r.type} ${r.label} -> ${res.status} (${r.url})`);
      }
    } catch (e) {
      fail++;
      failures.push(`${r.type} ${r.label} -> ERROR ${e.message} (${r.url})`);
    }
  }
  console.log(`TOTAL: ${routes.length} | PASS: ${pass} | FAIL: ${fail}`);
  if (failures.length) console.log("FAILURES:\n" + failures.join("\n"));
  else console.log("ALL ROUTES RETURN 200");
}
test();