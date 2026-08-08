const BASE_URL = "http://localhost:3000";
const pages = [
  "/",
  "/ncert",
  "/ncert/9",
  "/ncert/9/Mathematics",
  "/classes",
  "/classes/9",
  "/quiz",
  "/dashboard",
  "/ai",
  "/ai/doubt-solver",
  "/admin",
];
async function test() {
  let pass = 0, fail = 0;
  for (const p of pages) {
    try {
      const res = await fetch(BASE_URL + p, { redirect: "manual" });
      const ok = res.status === 200;
      if (ok) pass++; else fail++;
      console.log(`${ok ? "OK " : "FAIL"} ${res.status} ${p}`);
    } catch (e) {
      fail++;
      console.log(`FAIL ERROR ${p}: ${e.message}`);
    }
  }
  // Direct URL access + refresh test (fetch twice)
  const direct = "/ncert/9/Mathematics/2/exercise/Exercise%20sEt%203.1/9-math-2-ex3.1-q3";
  for (let i = 1; i <= 2; i++) {
    const res = await fetch(BASE_URL + direct);
    console.log(`Direct URL (${i === 1 ? "first" : "refresh"}) ${direct} -> ${res.status}`);
    if (res.status === 200) pass++; else fail++;
  }
  console.log(`PAGES: PASS=${pass} FAIL=${fail}`);
}
test();