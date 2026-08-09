// ─────────────────────────────────────────────────────────────────────────────
// MATHEMATICAL GEOMETRY CALCULATION HELPERS
// Pure functions that compute exact geometry used by the figure engine.
// The renderer and authoring scripts use these so every figure is
// mathematically accurate — never arbitrary coordinates.
// ─────────────────────────────────────────────────────────────────────────────

export interface Pt {
  x: number;
  y: number;
}

export const dist = (a: Pt, b: Pt): number => Math.hypot(b.x - a.x, b.y - a.y);

export const midpoint = (a: Pt, b: Pt): Pt => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

/** Direction angle (degrees) from a to b in SVG coordinate space */
export const angleDeg = (a: Pt, b: Pt): number =>
  (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

/** Interior angle (0..180) at b between ba and bc */
export const angleBetween = (a: Pt, b: Pt, c: Pt): number => {
  const ba = angleDeg(b, a);
  const bc = angleDeg(b, c);
  let diff = Math.abs(ba - bc) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
};

/** Point on segment AB at fraction t (0..1) */
export const pointOnSegment = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** Rotate point p around center by angleDeg (degrees) */
export const rotate = (p: Pt, center: Pt, angle: number): Pt => {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
};

/**
 * Triangle from three angles (degrees) and base AB length.
 * Uses the law of sines. A at origin, B on the +x axis.
 */
export function triangleFromAngles(
  angleA: number,
  angleB: number,
  angleC: number,
  baseLength: number
): { A: Pt; B: Pt; C: Pt } {
  const k = baseLength / Math.sin((angleC * Math.PI) / 180);
  const b = k * Math.sin((angleB * Math.PI) / 180); // side AC
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: baseLength, y: 0 };
  const radA = (angleA * Math.PI) / 180;
  const C: Pt = { x: b * Math.cos(radA), y: b * Math.sin(radA) };
  return { A, B, C };
}

/** Triangle from two sides and the included angle (SAS). AB is the base. */
export function triangleSAS(
  ab: number,
  angleA: number,
  ac: number
): { A: Pt; B: Pt; C: Pt } {
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: ab, y: 0 };
  const radA = (angleA * Math.PI) / 180;
  const C: Pt = { x: ac * Math.cos(radA), y: ac * Math.sin(radA) };
  return { A, B, C };
}

/** Triangle from three sides (SSS). AB is the base. */
export function triangleSSS(
  ab: number,
  bc: number,
  ca: number
): { A: Pt; B: Pt; C: Pt } {
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: ab, y: 0 };
  const x = (ab * ab + ca * ca - bc * bc) / (2 * ab);
  const y = Math.sqrt(Math.max(0, ca * ca - x * x));
  const C: Pt = { x, y };
  return { A, B, C };
}

/** Circumcentre of a triangle (intersection of the perpendicular bisectors). */
export function circumcentre(a: Pt, b: Pt, c: Pt): Pt {
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

export const circumradius = (a: Pt, b: Pt, c: Pt): number =>
  dist(circumcentre(a, b, c), a);

/**
 * Perpendicular bisector of segment AB: returns two points on the line,
 * centred at the midpoint, extending `length` in each direction.
 */
export function perpendicularBisector(a: Pt, b: Pt, length: number): [Pt, Pt] {
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

/** Point on the angle bisector of ∠(p1, vertex, p2) at distance `length`. */
export function angleBisectorPoint(
  vertex: Pt,
  p1: Pt,
  p2: Pt,
  length: number
): Pt {
  const a1 = angleDeg(vertex, p1);
  const a2 = angleDeg(vertex, p2);
  let diff = a2 - a1;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;
  const mid = a1 + diff / 2;
  const rad = (mid * Math.PI) / 180;
  return {
    x: vertex.x + length * Math.cos(rad),
    y: vertex.y + length * Math.sin(rad),
  };
}

/**
 * Intelligent label offset: push a label away from the centroid of the
 * surrounding points so it stays readable and avoids overlapping the shape.
 */
export function labelOffset(
  p: Pt,
  others: Pt[],
  distance = 18
): { dx: number; dy: number } {
  if (others.length === 0) return { dx: 0, dy: -distance };
  const cx = others.reduce((s, o) => s + o.x, 0) / others.length;
  const cy = others.reduce((s, o) => s + o.y, 0) / others.length;
  let dx = p.x - cx;
  let dy = p.y - cy;
  const len = Math.hypot(dx, dy) || 1;
  dx = (dx / len) * distance;
  dy = (dy / len) * distance;
  return { dx, dy };
}

/** Normalize an angle to [0, 360) */
export const normAngle = (a: number): number => ((a % 360) + 360) % 360;

/** Bounding box of a set of points with padding */
export function boundingBox(
  pts: Pt[],
  padding = 40
): { x: number; y: number; width: number; height: number } {
  if (pts.length === 0) return { x: 0, y: 0, width: 560, height: 420 };
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}