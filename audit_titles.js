const fs = require("fs");
// Extract chapter titles from all three sources
const chaptersTs = fs.readFileSync("c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/chapters.ts", "utf8");
const seedJs = fs.readFileSync("c:/Users/user/Downloads/StudyVerse/studyverse-next/prisma/seed.js", "utf8");
const manifestTs = fs.readFileSync("c:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions-data.ts", "utf8");

// chapters.ts: find the "9-Mathematics" array
const chMatch = chaptersTs.match(/"9-Mathematics":\s*\[([\s\S]*?)\]/);
const chTitles = chMatch ? [...chMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];

// seed.js
const seedMatch = seedJs.match(/"9-Mathematics":\s*\[([\s\S]*?)\]/);
const seedTitles = seedMatch ? [...seedMatch[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];

// manifest
const manTitles = [...manifestTs.matchAll(/chapterName: "([^"]+)"/g)].map((x) => x[1]);

console.log("chapters.ts count:", chTitles.length);
console.log("seed.js count:", seedTitles.length);
console.log("manifest count:", manTitles.length);

let ok = true;
for (let i = 0; i < 8; i++) {
  const a = chTitles[i], b = seedTitles[i], c = manTitles[i];
  const match = a === b && b === c;
  if (!match) ok = false;
  console.log(`Ch${i}: ${match ? "MATCH" : "MISMATCH"} | chapters.ts="${a}" | seed.js="${b}" | manifest="${c}"`);
}
console.log(ok ? "ALL 8 CHAPTER TITLES CONSISTENT ACROSS ALL 3 SOURCES" : "INCONSISTENCIES FOUND");