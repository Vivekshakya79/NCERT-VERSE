#!/usr/bin/env node
/**
 * audit_live_pages.mjs
 * ====================
 * FINAL QUALITY AUDIT — fetches the ACTUAL solution pages from the running
 * dev server and verifies:
 *  - HTTP 200
 *  - the geometry SVG is present in the server-rendered HTML (SSR)
 *  - the SVG contains the mathematically-correct elements (points, angles,
 *    perpendicular bisectors, circumcircle, stage navigation)
 *  - non-geometry questions do NOT render a figure
 *  - no error markers in the HTML
 */
const BASE = "http://localhost:3000";

const pages = [
  // 1. THE circumcentre example (70°/60°/50°) — staged construction
  {
    name: "Circumcentre example (Ex 5.1 Q1)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.1/9-math-4-ex5.1-q1",
    expectGeometry: true,
    staged: true,
    checks: ["AB: 5 cm"],
  },
  // 2. Obtuse triangle circumcentre outside (Q2)
  {
    name: "Obtuse triangle circumcircle (Q2)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.1/9-math-4-ex5.1-q2",
    expectGeometry: true,
    checks: ["100°", ">A<", ">B<", ">C<", ">O<", "stroke-dasharray"],
  },
  // 3. Isosceles triangle 6-7-7 (Q3)
  {
    name: "Isosceles triangle 6-7-7 (Q3)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.1/9-math-4-ex5.1-q3",
    expectGeometry: true,
    checks: ["6 cm", "7 cm", ">A<", ">B<", ">C<", ">O<"],
  },
  // 4. Chord + centre isosceles (5.2 Q1)
  {
    name: "Chord & centre isosceles (5.2 Q1)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.2/9-math-4-ex5.2-q1",
    expectGeometry: true,
    checks: [">C<", ">A<", ">B<", "chord"],
  },
  // 5. Perpendicular from centre bisects chord (5.3 Q1)
  {
    name: "Perp from centre bisects chord (5.3 Q1)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.3/9-math-4-ex5.3-q1",
    expectGeometry: true,
    checks: [">C<", ">A<", ">B<", ">M<", "gd-title"],
  },
  // 6. Parallel chords (5.3 Q3)
  {
    name: "Parallel chords (5.3 Q3)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.3/9-math-4-ex5.3-q3",
    expectGeometry: true,
    checks: ["6 cm", "8 cm", "4 cm", "3 cm", ">O<"],
  },
  // 7. Angle in semicircle (End-of-chapter Q6)
  {
    name: "Angle in semicircle (EC Q6)",
    url: "/ncert/9/Mathematics/4/exercise/End-of-Chapter%20Exercises/9-math-4-ec-q6",
    expectGeometry: true,
    checks: ["90°", ">A<", ">B<", ">C<", ">O<"],
  },
  // 8. Non-geometry question — must have NO figure
  {
    name: "Non-geometry question (5.4 Q1)",
    url: "/ncert/9/Mathematics/4/exercise/Exercise%20sEt%205.4/9-math-4-ex5.4-q1",
    expectGeometry: false,
    checks: [],
  },
];

let pass = 0;
let fail = 0;
const ok = (name, cond, detail = "") => {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}${detail ? ` (${detail})` : ""}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ` (${detail})` : ""}`);
  }
};

/** Extract all <svg>...</svg> blocks from HTML. */
function extractSvgs(html) {
  const svgs = [];
  let i = 0;
  while (i < html.length) {
    const s = html.indexOf("<svg", i);
    if (s === -1) break;
    const e = html.indexOf("</svg>", s);
    if (e === -1) break;
    svgs.push(html.slice(s, e + 6));
    i = e + 6;
  }
  return svgs;
}

for (const t of pages) {
  console.log(`\n── ${t.name} ──`);
  let html;
  try {
    const res = await fetch(BASE + t.url);
    ok("HTTP 200", res.status === 200, `status ${res.status}`);
    html = await res.text();
  } catch (e) {
    ok("page fetch", false, e.message);
    fail++;
    continue;
  }

  const svgs = extractSvgs(html);
  // The geometry SVG is the one containing gd-title (accessibility title)
  const geoSvg = svgs.find((s) => s.includes("gd-title"));
  const hasGeo = !!geoSvg;

  if (t.expectGeometry) {
    ok("geometry SVG rendered in DOM", hasGeo, `${svgs.length} svg total`);
    if (hasGeo) {
      ok("has <title>/<desc> (a11y)", geoSvg.includes("<title") && geoSvg.includes("<desc"));
      ok("has viewBox (responsive)", geoSvg.includes("viewBox"));
      ok("has width:100% (fluid)", geoSvg.includes("width:100%"));
      if (t.staged) {
        // The default view shows the COMPLETE figure (final construction
        // stage) — like a textbook diagram. Stage buttons let students step
        // back through the construction steps.
        ok(
          "SSR shows the full figure (last stage)",
          geoSvg.includes("70°") &&
            geoSvg.includes("60°") &&
            geoSvg.includes("50°") &&
            geoSvg.includes(">O<") &&
            geoSvg.includes("stroke-dasharray")
        );
        ok("full figure has the circumcircle", geoSvg.includes("Triangle ABC with its circumcircle"));
        const stageLabels = [
          "Step 1: Draw AB = 5 cm",
          "Step 2: Construct triangle ABC",
          "Step 3: Perpendicular bisector of AB",
          "Step 4: Perpendicular bisector of BC",
          "Step 5: Mark the circumcentre O",
          "Step 6: Draw the circumcircle",
        ];
        for (const s of stageLabels) ok(`stage in payload: "${s}"`, html.includes(s));
        ok("full figure data in payload", html.includes("Triangle ABC with its circumcircle"));
        ok("stage navigation buttons", html.includes("gd-stage-btn") && html.includes("Construction steps"));
        ok("6 construction stage buttons", (html.match(/gd-stage-btn/g) || []).length >= 6, `${(html.match(/gd-stage-btn/g) || []).length} buttons`);
      } else {
        for (const c of t.checks) {
          ok(`contains "${c}"`, geoSvg.includes(c));
        }
      }
    }
  } else {
    ok("no geometry SVG (non-geometry question)", !hasGeo, `${svgs.length} svg (icons only)`);
    ok("no gd-wrap figure container", !html.includes("gd-wrap"));
  }

  // Console / error markers
  const errMarkers = ["Application error", "Unhandled", "Internal Server Error", "Error: ", "TypeError"];
  const foundErr = errMarkers.filter((m) => html.includes(m));
  ok("no error markers in HTML", foundErr.length === 0, foundErr.join(", ") || "clean");
}

console.log(`\n${fail === 0 ? "ALL LIVE PAGE CHECKS PASSED" : fail + " FAILED"} (${pass} passed)`);
process.exit(fail === 0 ? 0 : 1);