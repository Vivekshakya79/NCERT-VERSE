const BASE_URL = "http://localhost:3000";
// Search terms from every chapter
const terms = [
  "Reiaan",        // Ch1 coordinates
  "polynomial",    // Ch2 linear polynomials
  "Lothal",        // Ch3 world of numbers
  "identity",      // Ch4 algebraic identities
  "chord",         // Ch5 circles
  "sector",        // Ch6 perimeter and area
  "probability",   // Ch7 probability
  "sequence",      // Ch8 sequences
  "ingots",        // Ch3 specific
  "Ishango",       // Ch3 specific
  "Brahmagupta",   // Ch3 specific
  "semicircle",    // Ch5
  "quadrant",      // Ch6
  "arithmetic progression", // Ch8
];
async function test() {
  let pass = 0, fail = 0;
  for (const q of terms) {
    try {
      const res = await fetch(BASE_URL + "/api/search?q=" + encodeURIComponent(q));
      const data = await res.json();
      const results = data.results || [];
      if (res.status === 200 && Array.isArray(results)) {
        pass++;
        console.log(`"${q}" -> ${results.length} results`);
      } else {
        fail++;
        console.log(`"${q}" -> FAIL status=${res.status} keys=${Object.keys(data).join(",")}`);
      }
    } catch (e) {
      fail++;
      console.log(`"${q}" -> ERROR ${e.message}`);
    }
  }
  console.log(`SEARCH: PASS=${pass} FAIL=${fail}`);
}
test();