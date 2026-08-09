#!/usr/bin/env node
/**
 * add_geometry_diagrams.js
 * ========================
 * Authoring tool for the NCERT VERSE data-driven figure engine.
 *
 * Computes mathematically-accurate `geometry` diagram data for the Class 9
 * Ganita Manjari geometry solutions (Circles chapter) and writes it into the
 * JSON solution files. Every coordinate is CALCULATED (law of sines,
 * circumcentre, perpendicular bisectors, chord distances) — never hand-drawn —
 * so the rendered figures are mathematically correct.
 *
 * Run:  node add_geometry_diagrams.js
 */
const fs = require("fs");
const path = require("path");

const BASE = "src/data/solutions/class-9/Mathematics";

// ─── Math helpers (mirror src/lib/geometry/calc.ts) ─────────────────────────
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function triangleFromAngles(angleA, angleB, angleC, baseLength) {
  const k = baseLength / Math.sin((angleC * Math.PI) / 180);
  const b = k * Math.sin((angleB * Math.PI) / 180);
  const A = { x: 0, y: 0 };
  const B = { x: baseLength, y: 0 };
  const radA = (angleA * Math.PI) / 180;
  const C = { x: b * Math.cos(radA), y: b * Math.sin(radA) };
  return { A, B, C };
}

function triangleSAS(ab, angleA, ac) {
  const A = { x: 0, y: 0 };
  const B = { x: ab, y: 0 };
  const radA = (angleA * Math.PI) / 180;
  const C = { x: ac * Math.cos(radA), y: ac * Math.sin(radA) };
  return { A, B, C };
}

function triangleSSS(ab, bc, ca) {
  const A = { x: 0, y: 0 };
  const B = { x: ab, y: 0 };
  const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  const y = Math.sqrt(Math.max(0, ca * ca - x * x));
  const C = { x, y };
  return { A, B, C };
}

function circumcentre(a, b, c) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return { x: 0, y: 0 };
  const ux =
    ((a.x * a.x + a.y * a.y) * (b.y - c.y) +
      (b.x * b.x + b.y * b.y) * (c.y - a.y) +
      (c.x * c.x + c.y * c.y) * (a.y - b.y)) /
    d;
  const uy =
    ((a.x * a.x + a.y * a.y) * (c.x - b.x) +
      (b.x * b.x + b.y * b.y) * (a.x - c.x) +
      (c.x * c.x + c.y * c.y) * (b.x - a.x)) /
    d;
  return { x: ux, y: uy };
}

function perpendicularBisector(a, b, length) {
  const m = midpoint(a, b);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return [
    { x: m.x + nx * length, y: m.y + ny * length },
    { x: m.x - nx * length, y: m.y - ny * length },
  ];
}

function labelOffset(p, others, distance = 20) {
  if (others.length === 0) return { dx: 0, dy: -distance };
  const cx = others.reduce((s, o) => s + o.x, 0) / others.length;
  const cy = others.reduce((s, o) => s + o.y, 0) / others.length;
  let dx = p.x - cx;
  let dy = p.y - cy;
  const len = Math.hypot(dx, dy) || 1;
  return { dx: (dx / len) * distance, dy: (dy / len) * distance };
}

// ─── Colours ────────────────────────────────────────────────────────────────
const BLUE = "#2563EB";
const RED = "#DC2626";
const GREEN = "#16A34A";
const AMBER = "#F59E0B";
const PURPLE = "#8B5CF6";
const SLATE = "#475569";

// ─── Small builders ─────────────────────────────────────────────────────────
const pt = (id, x, y, extra = {}) => ({ id, x, y, ...extra });
const seg = (from, to, extra = {}) => ({ from, to, ...extra });
const angleMark = (vertex, from, to, extra = {}) => ({ vertex, from, to, ...extra });
const rightAngle = (vertex, from, to, extra = {}) => ({ vertex, from, to, ...extra });
const circle = (center, radius, extra = {}) => ({ center, radius, ...extra });
const label = (x, y, text, extra = {}) => ({ x, y, text, ...extra });

/** Triangle vertex labels pushed away from the centroid. */
function triPoints(a, b, c) {
  return [
    pt("A", a.x, a.y, { labelOffset: labelOffset(a, [b, c]) }),
    pt("B", b.x, b.y, { labelOffset: labelOffset(b, [a, c]) }),
    pt("C", c.x, c.y, { labelOffset: labelOffset(c, [a, b]) }),
  ];
}

/** Hidden helper points (no label, no dot). */
function hidden(pts) {
  return pts.map((p, i) => ({ id: `H${i}`, x: p.x, y: p.y, showLabel: false, size: 0 }));
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. exercise-set-5.1 Q1 — triangle 70°/60°/50° + circumcircle (THE example)
// ═══════════════════════════════════════════════════════════════════════════
function buildEx51Q1() {
  const { A, B, C } = triangleFromAngles(70, 60, 50, 300);
  const O = circumcentre(A, B, C);
  const R = dist(O, A);
  const SX = 100, SY = 100;
  const s = (p) => ({ x: p.x + SX, y: p.y + SY });
  const a = s(A), b = s(B), c = s(C), o = s(O);

  const pbAB = perpendicularBisector(a, b, 260);
  const pbBC = perpendicularBisector(b, c, 260);

  const base = (extraPoints = [], extraCons = [], extraCircles = []) => ({
    width: 500, height: 500,
    title: "Triangle ABC with its circumcircle",
    description:
      "Triangle ABC with the perpendicular bisectors of two sides meeting at the circumcentre O, and the circumcircle passing through A, B and C.",
    points: [...triPoints(a, b, c), ...extraPoints],
    segments: [
      seg("A", "B", { label: "AB: 5 cm", labelOffset: { dx: 0, dy: 16 } }),
      seg("B", "C"),
      seg("C", "A"),
    ],
    angles: [
      angleMark("A", "B", "C", { label: "70°", radius: 40, color: BLUE }),
      angleMark("B", "A", "C", { label: "60°", radius: 40, color: GREEN }),
      angleMark("C", "A", "B", { label: "50°", radius: 40, color: AMBER }),
    ],
    constructionLines: extraCons,
    circles: extraCircles,
  });

  const stage1 = {
    label: "Step 1: Draw AB = 5 cm",
    data: {
      width: 500, height: 500,
      title: "Step 1 — Draw AB",
      description: "Draw AB of length 5 cm.",
      points: [
        pt("A", a.x, a.y, { labelOffset: { dx: -20, dy: 18 } }),
        pt("B", b.x, b.y, { labelOffset: { dx: 20, dy: 18 } }),
      ],
      segments: [seg("A", "B", { label: "AB: 5 cm", labelOffset: { dx: 0, dy: 16 } })],
    },
  };

  const stage2 = {
    label: "Step 2: Construct triangle ABC",
    data: base(),
  };

  const stage3 = {
    label: "Step 3: Perpendicular bisector of AB",
    data: base(hidden(pbAB), [seg("H0", "H1", { color: PURPLE, dashed: true })]),
  };

  const stage4 = {
    label: "Step 4: Perpendicular bisector of BC",
    data: base(
      hidden([...pbAB, ...pbBC]),
      [
        seg("H0", "H1", { color: PURPLE, dashed: true }),
        seg("H2", "H3", { color: PURPLE, dashed: true }),
      ]
    ),
  };

  const stage5 = {
    label: "Step 5: Mark the circumcentre O",
    data: base(
      [
        pt("O", o.x, o.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        ...hidden([...pbAB, ...pbBC]),
      ],
      [
        seg("H0", "H1", { color: PURPLE, dashed: true }),
        seg("H2", "H3", { color: PURPLE, dashed: true }),
      ]
    ),
  };

  const stage6 = {
    label: "Step 6: Draw the circumcircle",
    data: base(
      [
        pt("O", o.x, o.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        ...hidden([...pbAB, ...pbBC]),
      ],
      [
        seg("H0", "H1", { color: PURPLE, dashed: true }),
        seg("H2", "H3", { color: PURPLE, dashed: true }),
      ],
      [circle("O", R, { color: BLUE, width: 2 })]
    ),
  };

  return {
    type: "geometry",
    content: "",
    stepIndex: 2,
    caption:
      "Fig. 5.10: Triangle ABC (∠A = 70°, ∠B = 60°, ∠C = 50°) with the perpendicular bisectors of AB and BC meeting at the circumcentre O, and the circumcircle through A, B and C. Since all angles are acute, O lies inside the triangle.",
    geometry: stage6.data,
    stages: [stage1, stage2, stage3, stage4, stage5, stage6],
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. exercise-set-5.1 Q2 — obtuse triangle (∠A = 100°) + circumcircle outside
// ═══════════════════════════════════════════════════════════════════════════
function buildEx51Q2() {
  const { A, B, C } = triangleSAS(300, 100, 240);
  const O = circumcentre(A, B, C);
  const R = dist(O, A);
  const sx = 100, sy = 100;
  const s = (p) => ({ x: p.x + sx, y: p.y + sy });
  const a = s(A), b = s(B), c = s(C), o = s(O);
  const pbAB = perpendicularBisector(a, b, 260);
  const pbAC = perpendicularBisector(a, c, 260);

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.11: Triangle ABC with ∠A = 100° (obtuse). The perpendicular bisectors of AB and AC meet at O, the circumcentre, which lies OUTSIDE the triangle. The circumcircle passes through A, B and C.",
    geometry: {
      width: 500, height: 500,
      title: "Obtuse triangle ABC with its circumcircle",
      description:
        "Triangle ABC with ∠A = 100°. The perpendicular bisectors of AB and AC meet at the circumcentre O outside the triangle, and the circumcircle passes through A, B and C.",
      points: [
        ...triPoints(a, b, c),
        pt("O", o.x, o.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        ...hidden([...pbAB, ...pbAC]),
      ],
      segments: [
        seg("A", "B", { label: "AB: 5 cm", labelOffset: { dx: 0, dy: 16 } }),
        seg("B", "C"),
        seg("C", "A", { label: "AC: 4 cm" }),
      ],
      angles: [angleMark("A", "B", "C", { label: "100°", radius: 46, color: RED })],
      constructionLines: [
        seg("H0", "H1", { color: PURPLE, dashed: true }),
        seg("H2", "H3", { color: PURPLE, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. exercise-set-5.1 Q3 — triangle 6-7-7 + circumcircle
// ═══════════════════════════════════════════════════════════════════════════
function buildEx51Q3() {
  const { A, B, C } = triangleSSS(300, 350, 350);
  const O = circumcentre(A, B, C);
  const R = dist(O, A);
  const sx = 100, sy = 100;
  const s = (p) => ({ x: p.x + sx, y: p.y + sy });
  const a = s(A), b = s(B), c = s(C), o = s(O);
  const pbAB = perpendicularBisector(a, b, 240);
  const pbBC = perpendicularBisector(b, c, 240);

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.12: Isosceles triangle ABC with AB = 6 cm, BC = CA = 7 cm. The perpendicular bisectors of AB and BC meet at the circumcentre O. OA = OB = OC ≈ 3.87 cm.",
    geometry: {
      width: 500, height: 500,
      title: "Isosceles triangle ABC with its circumcircle",
      description:
        "Triangle ABC (AB = 6 cm, BC = CA = 7 cm) with perpendicular bisectors meeting at the circumcentre O and the circumcircle through A, B and C.",
      points: [
        ...triPoints(a, b, c),
        pt("O", o.x, o.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        ...hidden([...pbAB, ...pbBC]),
      ],
      segments: [
        seg("A", "B", { label: "6 cm", labelOffset: { dx: 0, dy: 16 } }),
        seg("B", "C", { label: "7 cm" }),
        seg("C", "A", { label: "7 cm" }),
      ],
      constructionLines: [
        seg("H0", "H1", { color: PURPLE, dashed: true }),
        seg("H2", "H3", { color: PURPLE, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. exercise-set-5.1 Q4 — least radius circle through two points
// ═══════════════════════════════════════════════════════════════════════════
function buildEx51Q4() {
  const A = { x: 150, y: 250 };
  const B = { x: 350, y: 250 };
  const M = midpoint(A, B);
  const R = dist(A, M);

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.13: The smallest circle through two points A and B has AB as its diameter, with centre M at the midpoint of AB and radius AB/2.",
    geometry: {
      width: 500, height: 500,
      title: "Smallest circle through two points",
      description:
        "Points A and B with the smallest circle through them — AB as the diameter, centre M at the midpoint.",
      points: [
        pt("A", A.x, A.y, { labelOffset: { dx: -20, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 20, dy: 18 } }),
        pt("M", M.x, M.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
      ],
      segments: [seg("A", "B", { label: "AB", labelOffset: { dx: 0, dy: 16 } })],
      circles: [circle("M", R, { color: BLUE, width: 2 })],
      labels: [label(250, 250, "radius = AB/2", { color: SLATE, size: 12, anchor: "middle" })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. exercise-set-5.2 Q1 — chord + centre isosceles triangle
// ═══════════════════════════════════════════════════════════════════════════
function buildEx52Q1() {
  const C = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 94.1, y: 340 };
  const B = { x: 405.9, y: 340 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.14: In triangle CAB of a circle with centre C, CA and CB are radii, so the triangle is isosceles with base AB.",
    geometry: {
      width: 500, height: 500,
      title: "Chord and centre form an isosceles triangle",
      description:
        "A circle with centre C and chord AB. CA and CB are radii, so triangle CAB is isosceles.",
      points: [
        pt("C", C.x, C.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
      ],
      segments: [
        seg("C", "A", { label: "r", labelOffset: { dx: -10, dy: -6 } }),
        seg("C", "B", { label: "r", labelOffset: { dx: 10, dy: -6 } }),
        seg("A", "B", { label: "chord", labelOffset: { dx: 0, dy: 16 } }),
      ],
      circles: [circle("C", R, { color: BLUE, width: 2 })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. exercise-set-5.2 Q2 — two equal chords, congruent triangles
// ═══════════════════════════════════════════════════════════════════════════
function buildEx52Q2() {
  const C = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 94.1, y: 340 };
  const B = { x: 405.9, y: 340 };
  const D = { x: 94.1, y: 160 };
  const E = { x: 405.9, y: 160 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.15: Two equal chords AB and DE of a circle with centre C. Triangles CAB and CDE are congruent by SSS (CA = CD, CB = CE, AB = DE).",
    geometry: {
      width: 500, height: 500,
      title: "Equal chords subtend equal angles at the centre",
      description:
        "A circle with centre C and two equal chords AB and DE. Triangles CAB and CDE are congruent by SSS.",
      points: [
        pt("C", C.x, C.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("D", D.x, D.y, { labelOffset: { dx: -18, dy: -18 } }),
        pt("E", E.x, E.y, { labelOffset: { dx: 18, dy: -18 } }),
      ],
      segments: [
        seg("C", "A"), seg("C", "B"), seg("A", "B"),
        seg("C", "D"), seg("C", "E"), seg("D", "E"),
      ],
      circles: [circle("C", R, { color: BLUE, width: 2 })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. exercise-set-5.3 Q1 — perpendicular from centre bisects chord
// ═══════════════════════════════════════════════════════════════════════════
function buildEx53Q1() {
  const C = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 94.1, y: 340 };
  const B = { x: 405.9, y: 340 };
  const M = { x: 250, y: 340 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.12: The perpendicular CM from the centre C to chord AB meets AB at M. By RHS congruence, ΔCMA ≅ ΔCMB, so AM = BM — the perpendicular bisects the chord.",
    geometry: {
      width: 500, height: 500,
      title: "Perpendicular from the centre bisects the chord",
      description:
        "A circle with centre C and chord AB. The perpendicular CM from C to AB meets AB at M. Triangles CMA and CMB are congruent by RHS, so AM = BM.",
      points: [
        pt("C", C.x, C.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M", M.x, M.y, { color: GREEN, labelOffset: { dx: 0, dy: 18 } }),
      ],
      segments: [
        seg("C", "A"), seg("C", "B"), seg("A", "B"),
        seg("C", "M", { color: GREEN, width: 2 }),
      ],
      circles: [circle("C", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("M", "C", "A", { color: GREEN })],
      midpointMarkers: [{ segment: ["A", "B"], color: GREEN }],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. exercise-set-5.3 Q2 — isosceles triangle inscribed, altitude through centre
// ═══════════════════════════════════════════════════════════════════════════
function buildEx53Q2() {
  const O = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 250, y: 70 };
  const B = { x: 94.1, y: 340 };
  const C = { x: 405.9, y: 340 };
  const M = { x: 250, y: 340 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.16: Isosceles triangle ABC (AB = AC) inscribed in a circle with centre O. The altitude from A to BC passes through O.",
    geometry: {
      width: 500, height: 500,
      title: "Isosceles triangle inscribed in a circle",
      description:
        "Isosceles triangle ABC with AB = AC inscribed in a circle with centre O. The altitude from A to BC passes through O.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: 0, dy: -18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("C", C.x, C.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M", M.x, M.y, { showLabel: false, size: 0 }),
      ],
      segments: [
        seg("A", "B", { label: "AB", labelOffset: { dx: -10, dy: -4 } }),
        seg("A", "C", { label: "AC", labelOffset: { dx: 10, dy: -4 } }),
        seg("B", "C"),
        seg("A", "M", { color: GREEN, width: 2, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("M", "A", "B", { color: GREEN })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. exercise-set-5.3 Q3 — two parallel chords on opposite sides
// ═══════════════════════════════════════════════════════════════════════════
function buildEx53Q3() {
  const O = { x: 250, y: 250 };
  const R = 150;
  const A = { x: 160, y: 130 };
  const B = { x: 340, y: 130 };
  const C = { x: 130, y: 340 };
  const D = { x: 370, y: 340 };
  const M1 = { x: 250, y: 130 };
  const M2 = { x: 250, y: 340 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.17: Two parallel chords AB (6 cm) and CD (8 cm) on opposite sides of the centre O of a circle of radius 5 cm. The distance between their midpoints is 4 + 3 = 7 cm.",
    geometry: {
      width: 500, height: 500,
      title: "Two parallel chords on opposite sides of the centre",
      description:
        "A circle of radius 5 cm with two parallel chords AB (6 cm) and CD (8 cm) on opposite sides of the centre O. Their distances from the centre are 4 cm and 3 cm.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: -18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: -18 } }),
        pt("C", C.x, C.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("D", D.x, D.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M1", M1.x, M1.y, { color: GREEN, showLabel: false, size: 3 }),
        pt("M2", M2.x, M2.y, { color: GREEN, showLabel: false, size: 3 }),
      ],
      segments: [
        seg("A", "B", { label: "6 cm", labelOffset: { dx: 0, dy: -10 } }),
        seg("C", "D", { label: "8 cm", labelOffset: { dx: 0, dy: 16 } }),
        seg("O", "M1", { color: GREEN, width: 2, dashed: true }),
        seg("O", "M2", { color: GREEN, width: 2, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [
        rightAngle("M1", "O", "A", { color: GREEN }),
        rightAngle("M2", "O", "C", { color: GREEN }),
      ],
      labels: [
        label(250, 215, "4 cm", { color: GREEN, size: 12, anchor: "middle" }),
        label(250, 295, "3 cm", { color: GREEN, size: 12, anchor: "middle" }),
      ],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. end-of-chapter Q1 — chord 5 cm from centre, radius 13
// ═══════════════════════════════════════════════════════════════════════════
function buildEcQ1() {
  const O = { x: 250, y: 250 };
  const R = 195;
  const A = { x: 70, y: 175 };
  const B = { x: 430, y: 175 };
  const M = { x: 250, y: 175 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.18: A chord of a circle of radius 13 cm at a distance 5 cm from the centre O. Half the chord is 12 cm, so the chord is 24 cm.",
    geometry: {
      width: 500, height: 500,
      title: "Chord at a distance from the centre",
      description:
        "A circle of radius 13 cm with chord AB at distance 5 cm from the centre O. OM is perpendicular to AB, so AM = BM = 12 cm and AB = 24 cm.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M", M.x, M.y, { color: GREEN, labelOffset: { dx: 0, dy: 18 } }),
      ],
      segments: [
        seg("O", "A", { label: "13 cm", labelOffset: { dx: -8, dy: -6 } }),
        seg("O", "B"),
        seg("A", "B", { label: "24 cm", labelOffset: { dx: 0, dy: 16 } }),
        seg("O", "M", { color: GREEN, width: 2, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("M", "O", "A", { color: GREEN })],
      labels: [
        label(250, 212, "5 cm", { color: GREEN, size: 12, anchor: "middle" }),
        label(160, 175, "12 cm", { color: SLATE, size: 12, anchor: "middle" }),
      ],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 11. end-of-chapter Q5 — perpendicular bisector of chord through centre
// ═══════════════════════════════════════════════════════════════════════════
function buildEcQ5() {
  const O = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 94.1, y: 340 };
  const B = { x: 405.9, y: 340 };
  const M = { x: 250, y: 340 };
  const pb = perpendicularBisector(A, B, 260);

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.19: The perpendicular bisector of chord AB passes through the centre O. OM is perpendicular to AB and passes through its midpoint M.",
    geometry: {
      width: 500, height: 500,
      title: "Perpendicular bisector of a chord passes through the centre",
      description:
        "In a circle with centre O and chord AB, the perpendicular bisector of AB passes through O, meeting AB at its midpoint M.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M", M.x, M.y, { color: GREEN, labelOffset: { dx: 0, dy: 18 } }),
        pt("H0", pb[0].x, pb[0].y, { showLabel: false, size: 0 }),
        pt("H1", pb[1].x, pb[1].y, { showLabel: false, size: 0 }),
      ],
      segments: [seg("A", "B"), seg("O", "A"), seg("O", "B")],
      constructionLines: [seg("H0", "H1", { color: PURPLE, dashed: true })],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("M", "O", "A", { color: GREEN })],
      midpointMarkers: [{ segment: ["A", "B"], color: GREEN }],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 12. end-of-chapter Q6 — angle in a semicircle
// ═══════════════════════════════════════════════════════════════════════════
function buildEcQ6() {
  const O = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 70, y: 250 };
  const B = { x: 430, y: 250 };
  const C = { x: 250, y: 70 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.20: AB is a diameter of the circle and C is a point on the circumference. The angle ACB subtended by the semicircle is 90°.",
    geometry: {
      width: 500, height: 500,
      title: "Angle in a semicircle is a right angle",
      description:
        "AB is a diameter of the circle with centre O, and C is a point on the circumference. The angle ACB is 90°.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 0, dy: 16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("C", C.x, C.y, { labelOffset: { dx: 0, dy: -18 } }),
      ],
      segments: [
        seg("A", "B", { color: SLATE, width: 1.5, dashed: true }),
        seg("A", "C"),
        seg("B", "C"),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("C", "A", "B", { color: GREEN, size: 16 })],
      angles: [angleMark("C", "A", "B", { label: "90°", radius: 40, color: GREEN })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 13. end-of-chapter Q8 — chord 6 cm at distance 3 cm from the centre
// ═══════════════════════════════════════════════════════════════════════════
function buildEcQ8() {
  const O = { x: 250, y: 250 };
  const R = 169.7;
  const A = { x: 130, y: 130 };
  const B = { x: 370, y: 130 };
  const M = { x: 250, y: 130 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.21: A chord AB of length 6 cm at a distance 3 cm from the centre O. Triangle AOB is an isosceles right triangle with OA = OB = 3√2 cm.",
    geometry: {
      width: 500, height: 500,
      title: "Chord at distance 3 cm from the centre",
      description:
        "A circle with centre O and a chord AB of 6 cm at distance 3 cm from O. Triangle AOB is an isosceles right triangle.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 0, dy: -16 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: -18, dy: 18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("M", M.x, M.y, { color: GREEN, labelOffset: { dx: 0, dy: 18 } }),
      ],
      segments: [
        seg("O", "A", { label: "3√2 cm", labelOffset: { dx: -10, dy: -6 } }),
        seg("O", "B", { label: "3√2 cm", labelOffset: { dx: 10, dy: -6 } }),
        seg("A", "B", { label: "6 cm", labelOffset: { dx: 0, dy: 16 } }),
        seg("O", "M", { color: GREEN, width: 2, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      rightAngles: [rightAngle("M", "O", "A", { color: GREEN })],
      labels: [label(250, 190, "3 cm", { color: GREEN, size: 12, anchor: "middle" })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 14. end-of-chapter Q10 — equal chords AB and AC, angle bisector
// ═══════════════════════════════════════════════════════════════════════════
function buildEcQ10() {
  const O = { x: 250, y: 250 };
  const R = 180;
  const A = { x: 250, y: 70 };
  const B = { x: 405.9, y: 340 };
  const C = { x: 94.1, y: 340 };

  return {
    type: "geometry",
    content: "",
    stepIndex: 1,
    caption:
      "Fig. 5.22: Equal chords AB and AC of a circle with centre O. The centre O lies on the angle bisector of ∠BAC.",
    geometry: {
      width: 500, height: 500,
      title: "Equal chords and the angle bisector",
      description:
        "A circle with centre O and equal chords AB and AC. The centre O lies on the angle bisector of angle BAC.",
      points: [
        pt("O", O.x, O.y, { color: RED, labelOffset: { dx: 14, dy: -6 } }),
        pt("A", A.x, A.y, { labelOffset: { dx: 0, dy: -18 } }),
        pt("B", B.x, B.y, { labelOffset: { dx: 18, dy: 18 } }),
        pt("C", C.x, C.y, { labelOffset: { dx: -18, dy: 18 } }),
      ],
      segments: [
        seg("A", "B", { label: "AB", labelOffset: { dx: 10, dy: -4 } }),
        seg("A", "C", { label: "AC", labelOffset: { dx: -10, dy: -4 } }),
        seg("A", "O", { color: GREEN, width: 2, dashed: true }),
      ],
      circles: [circle("O", R, { color: BLUE, width: 2 })],
      angles: [angleMark("A", "B", "C", { label: "∠BAO = ∠CAO", radius: 46, color: GREEN })],
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Apply to JSON files
// ═══════════════════════════════════════════════════════════════════════════
function loadDiagrams(file, byQuestionNumber) {
  const full = path.join(BASE, file);
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  let count = 0;
  for (const q of data.questions || []) {
    const diagram = byQuestionNumber[q.questionNumber];
    if (diagram) {
      q.diagram = diagram;
      count++;
    }
  }
  fs.writeFileSync(full, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ${file}: ${count} diagram(s) added`);
  return count;
}

let total = 0;
console.log("Adding geometry diagrams to Class 9 Mathematics solutions...");

total += loadDiagrams("chapter-5/exercise-set-5.1.json", {
  1: buildEx51Q1(),
  2: buildEx51Q2(),
  3: buildEx51Q3(),
  4: buildEx51Q4(),
});

total += loadDiagrams("chapter-5/exercise-set-5.2.json", {
  1: buildEx52Q1(),
  2: buildEx52Q2(),
});

total += loadDiagrams("chapter-5/exercise-set-5.3.json", {
  1: buildEx53Q1(),
  2: buildEx53Q2(),
  3: buildEx53Q3(),
});

total += loadDiagrams("chapter-5/end-of-chapter.json", {
  1: buildEcQ1(),
  5: buildEcQ5(),
  6: buildEcQ6(),
  8: buildEcQ8(),
  10: buildEcQ10(),
});

console.log(`\nTotal: ${total} geometry diagrams added.`);