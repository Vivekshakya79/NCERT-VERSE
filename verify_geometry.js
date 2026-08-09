#!/usr/bin/env node
/**
 * verify_geometry.js
 * ==================
 * Validates the geometry diagram data written into the Class 9 solution JSON:
 *  1. All JSON files parse.
 *  2. Every `geometry` diagram passes the same validation the renderer uses.
 *  3. Mathematical accuracy checks:
 *     - circumcentre is equidistant from A, B, C
 *     - perpendicular bisectors are perpendicular to their segments
 *     - circles pass through the points they should
 *     - chord distances match the stated values
 *  4. stepIndex placement is valid.
 */
const fs = require("fs");
const path = require("path");

const BASE = "src/data/solutions/class-9/Mathematics";
const FILES = [
  "chapter-5/exercise-set-5.1.json",
  "chapter-5/exercise-set-5.2.json",
  "chapter-5/exercise-set-5.3.json",
  "chapter-5/end-of-chapter.json",
];

const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

let errors = 0;
let checks = 0;
const fail = (msg) => {
  errors++;
  console.log("  ✗ " + msg);
};

function validateGeometryData(data) {
  const errs = [];
  if (!data || typeof data !== "object") return ["geometry data missing"];
  if (typeof data.width !== "number" || typeof data.height !== "number")
    errs.push("width/height must be numbers");
  const ids = new Set();
  for (const p of data.points || []) {
    if (!p.id || typeof p.x !== "number" || typeof p.y !== "number")
      errs.push(`point ${p.id || "?"} missing id/x/y`);
    if (ids.has(p.id)) errs.push(`duplicate point id ${p.id}`);
    ids.add(p.id);
  }
  const has = (id) => ids.has(id);
  for (const s of data.segments || []) {
    if (!has(s.from) || !has(s.to)) errs.push(`segment ${s.from}-${s.to} references missing point`);
  }
  for (const c of data.circles || []) {
    if (!has(c.center)) errs.push(`circle center ${c.center} missing`);
    if (typeof c.radius !== "number") errs.push(`circle ${c.center} missing radius`);
  }
  for (const a of data.angles || []) {
    if (!has(a.vertex) || !has(a.from) || !has(a.to))
      errs.push(`angle at ${a.vertex} references missing point`);
  }
  for (const r of data.rightAngles || []) {
    if (!has(r.vertex) || !has(r.from) || !has(r.to))
      errs.push(`right angle at ${r.vertex} references missing point`);
  }
  for (const m of data.midpointMarkers || []) {
    if (!has(m.segment[0]) || !has(m.segment[1]))
      errs.push(`midpoint marker ${m.segment} references missing point`);
  }
  return errs;
}

const pointById = (g, id) => g.points.find((p) => p.id === id);

function checkCircumcentre(g, q) {
  const o = pointById(g, "O");
  const a = pointById(g, "A");
  const b = pointById(g, "B");
  const c = pointById(g, "C");
  if (!o || !a || !b || !c) return;
  checks++;
  const dA = dist(o, a), dB = dist(o, b), dC = dist(o, c);
  const maxDiff = Math.max(Math.abs(dA - dB), Math.abs(dB - dC), Math.abs(dA - dC));
  if (maxDiff > 1.5) fail(`Q${q.questionNumber}: circumcentre NOT equidistant (OA=${dA.toFixed(1)}, OB=${dB.toFixed(1)}, OC=${dC.toFixed(1)})`);
  else console.log(`  ✓ Q${q.questionNumber}: circumcentre equidistant (R=${dA.toFixed(1)})`);
  checks++;
}

function checkPerpBisector(g, from, to, h0, h1, q) {
  const a = pointById(g, from), b = pointById(g, to);
  const p = pointById(g, h0), qq = pointById(g, h1);
  if (!a || !b || !p || !qq) return;
  const segDx = b.x - a.x, segDy = b.y - a.y;
  const pbDx = qq.x - p.x, pbDy = qq.y - p.y;
  const dot = segDx * pbDx + segDy * pbDy;
  const m = midpoint(a, b);
  // perpendicular check
  const perp = Math.abs(dot) / (Math.hypot(segDx, segDy) * Math.hypot(pbDx, pbDy));
  // passes through midpoint check: distance from m to line (p,q)
  const lineLen = Math.hypot(pbDx, pbDy);
  const cross = Math.abs(pbDx * (m.y - p.y) - pbDy * (m.x - p.x)) / lineLen;
  if (perp > 0.02) fail(`Q${q.questionNumber}: ${h0}-${h1} not perpendicular to ${from}-${to} (dot=${perp.toFixed(3)})`);
  if (cross > 2) fail(`Q${q.questionNumber}: ${h0}-${h1} does not pass through midpoint of ${from}-${to} (off by ${cross.toFixed(1)})`);
  checks++;
}

function checkCircleThrough(g, centerId, radius, pointIds, q) {
  const c = pointById(g, centerId);
  if (!c) return;
  for (const pid of pointIds) {
    const p = pointById(g, pid);
    if (!p) continue;
    const d = dist(c, p);
    if (Math.abs(d - radius) > 2)
      fail(`Q${q.questionNumber}: circle radius ${radius.toFixed(1)} but ${pid} is ${d.toFixed(1)} away`);
    checks++;
  }
}

function checkChordDistance(g, centerId, chordFrom, chordTo, expectedCm, radiusCm, q) {
  const c = pointById(g, centerId);
  const a = pointById(g, chordFrom), b = pointById(g, chordTo);
  if (!c || !a || !b) return;
  const circ = (g.circles || []).find((cc) => cc.center === centerId);
  if (!circ) return;
  const scale = circ.radius / radiusCm; // px per cm
  const m = midpoint(a, b);
  const dCm = dist(c, m) / scale;
  if (Math.abs(dCm - expectedCm) > 0.5)
    fail(`Q${q.questionNumber}: chord ${chordFrom}-${chordTo} distance ${dCm.toFixed(1)} cm != ${expectedCm} cm`);
  else console.log(`  ✓ Q${q.questionNumber}: chord distance ${dCm.toFixed(1)} cm ≈ ${expectedCm} cm`);
  checks++;
}

const label = (g) => g.title || "diagram";

for (const file of FILES) {
  const full = path.join(BASE, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    fail(`${file}: invalid JSON — ${e.message}`);
    continue;
  }
  console.log(`\n${file}`);
  for (const q of data.questions || []) {
    const d = q.diagram;
    if (!d || d.type !== "geometry") continue;
    const g = d.geometry;
    const qn = q.questionNumber;
    const tag = `Q${qn}`;
    const errs = validateGeometryData(g);
    if (errs.length) {
      for (const e of errs) fail(`${tag}: ${e}`);
    } else {
      console.log(`  ✓ ${tag}: schema valid`);
    }
    checks++;

    // Mathematical spot checks
    if (g.points.some((p) => p.id === "O") && g.points.some((p) => p.id === "A")) {
      checkCircumcentre(g, q);
    }
    // perpendicular bisector checks (construction lines H0-H1, H2-H3)
    if (g.points.some((p) => p.id === "H0") && g.points.some((p) => p.id === "H1")) {
      checkPerpBisector(g, "A", "B", "H0", "H1", q);
    }
    if (g.points.some((p) => p.id === "H2") && g.points.some((p) => p.id === "H3")) {
      // Q2 of ex 5.1 bisects A-C; all others bisect B-C
      const seg2 = qn === 2 && file.includes("exercise-set-5.1") ? "A" : "B";
      checkPerpBisector(g, seg2, "C", "H2", "H3", q);
    }
    // circle passes through triangle vertices
    const circ = (g.circles || []).find((c) => c.center === "O");
    if (circ && g.points.some((p) => p.id === "A")) {
      checkCircleThrough(g, "O", circ.radius, ["A", "B", "C"], q);
    }
    // chord distance checks (scale-aware: radiusCm is the circle radius in cm)
    if (qn === 1 && file.includes("end-of-chapter")) checkChordDistance(g, "O", "A", "B", 5, 13, q);
    if (qn === 8 && file.includes("end-of-chapter")) checkChordDistance(g, "O", "A", "B", 3, 3 * Math.sqrt(2), q);
    if (qn === 3 && file.includes("exercise-set-5.3")) {
      checkChordDistance(g, "O", "A", "B", 4, 5, q);
      checkChordDistance(g, "O", "C", "D", 3, 5, q);
    }
    // stepIndex sanity
    if (typeof d.stepIndex === "number" && Array.isArray(q.solution?.steps)) {
      const steps = q.solution.steps;
      const found = steps.some((s) => s.step === d.stepIndex);
      if (!found) fail(`${tag}: stepIndex ${d.stepIndex} not found in solution steps`);
      checks++;
    }
  }
}

console.log(`\n${errors === 0 ? "ALL CHECKS PASSED" : errors + " ERROR(S)"} (${checks} checks)`);
process.exit(errors === 0 ? 0 : 1);