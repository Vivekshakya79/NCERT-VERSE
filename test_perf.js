const BASE_URL = "http://localhost:3000";
const routes = [
  "/",
  "/ncert/9/Mathematics",
  "/ncert/9/Mathematics/0",
  "/ncert/9/Mathematics/0/exercise/Exercise%20sEt%201.1",
  "/ncert/9/Mathematics/0/exercise/Exercise%20sEt%201.1/9-math-0-ex1.1-q1",
  "/ncert/9/Mathematics/7/exercise/Exercise%20sEt%208.1/9-math-7-ex8.1-q1",
];
async function test() {
  for (const p of routes) {
    const t0 = Date.now();
    const res = await fetch(BASE_URL + p);
    const ms = Date.now() - t0;
    const body = await res.text();
    console.log(`${res.status} ${ms}ms ${(body.length / 1024).toFixed(1)}KB ${p}`);
  }
}
test();