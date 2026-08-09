// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY SVG RENDERER
// Converts a `GeometryDiagramData` description into a precise, responsive,
// accessible SVG string. All derived geometry (angle arcs, right-angle
// markers, perpendicular bisectors, label offsets, ...) is computed here so
// the output is mathematically accurate.
// ─────────────────────────────────────────────────────────────────────────────

import {
  GeometryDiagramData,
  GeoPoint,
  GeoSegment,
  GeoCircle,
  GeoArc,
  GeoAngle,
  GeoRightAngle,
  GeoParallelMarker,
  GeoMidpointMarker,
  GeoLabel,
  GeoGrid,
  GeoAxes,
  GeoPolygon,
} from "./types";
import { angleDeg, normAngle } from "./calc";

// ─── Small helpers ──────────────────────────────────────────────────────────

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const num = (n: number): string => {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
};

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "system-ui, 'Segoe UI', Arial, sans-serif";

const BLUE = "#2563EB";
const DARK = "#1E293B";
const SLATE = "#475569";
const GRAY = "#94A3B8";
const AXIS = "#334155";

// ─── Element renderers ──────────────────────────────────────────────────────

function renderPoint(p: GeoPoint): string {
  const color = p.color ?? BLUE;
  const size = p.size ?? 4;
  const label = p.label ?? p.id;
  const showLabel = p.showLabel ?? true;
  const off = p.labelOffset ?? { dx: 0, dy: -14 };
  const anchor = p.labelAnchor ?? "middle";
  let s = `<circle cx="${num(p.x)}" cy="${num(p.y)}" r="${size}" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>`;
  if (showLabel && label) {
    s += `<text x="${num(p.x + off.dx)}" y="${num(p.y + off.dy)}" font-size="14" fill="${color}" text-anchor="${anchor}" font-family="${SERIF}" font-weight="bold">${esc(label)}</text>`;
  }
  return s;
}

function renderSegment(
  seg: GeoSegment,
  points: Map<string, GeoPoint>,
  construction = false
): string {
  const a = points.get(seg.from);
  const b = points.get(seg.to);
  if (!a || !b) return "";
  const color = seg.color ?? (construction ? GRAY : DARK);
  const width = seg.width ?? (construction ? 1.5 : 2);
  const dash = seg.dashed || construction ? seg.dash ?? "6 4" : undefined;
  const opacity = seg.opacity ?? 1;
  const marker = seg.marker;
  const markerAttr = marker
    ? ` marker-end="${marker === "end" || marker === "both" ? "url(#gd-arrow)" : ""}" marker-start="${marker === "start" || marker === "both" ? "url(#gd-arrow)" : ""}"`
    : "";
  let s = `<line x1="${num(a.x)}" y1="${num(a.y)}" x2="${num(b.x)}" y2="${num(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ""}${markerAttr}/>`;
  if (seg.label) {
    const t = seg.labelPosition ?? 0.5;
    const mx = a.x + (b.x - a.x) * t;
    const my = a.y + (b.y - a.y) * t;
    const off = seg.labelOffset ?? { dx: 0, dy: -8 };
    s += `<text x="${num(mx + off.dx)}" y="${num(my + off.dy)}" font-size="12" fill="${SLATE}" text-anchor="middle" font-family="${SERIF}">${esc(seg.label)}</text>`;
  }
  return s;
}

function renderCircle(c: GeoCircle, points: Map<string, GeoPoint>): string {
  const center = points.get(c.center);
  if (!center) return "";
  const color = c.color ?? BLUE;
  const width = c.width ?? 2;
  const dash = c.dashed ? c.dash ?? "6 4" : undefined;
  const fill = c.fill ?? "none";
  const fillOpacity = c.fillOpacity ?? 1;
  let s = `<circle cx="${num(center.x)}" cy="${num(center.y)}" r="${num(c.radius)}" fill="${fill}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  if (c.label) {
    const off = c.labelOffset ?? { dx: 0, dy: -10 };
    s += `<text x="${num(center.x + off.dx)}" y="${num(center.y - c.radius + off.dy)}" font-size="12" fill="${SLATE}" text-anchor="middle" font-family="${SERIF}">${esc(c.label)}</text>`;
  }
  return s;
}

/** SVG arc path between two angles (degrees) around a centre point. */
function arcPath(
  cx: number,
  cy: number,
  r: number,
  a1: number,
  a2: number
): string {
  const rad1 = (a1 * Math.PI) / 180;
  const rad2 = (a2 * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad1);
  const y1 = cy + r * Math.sin(rad1);
  const x2 = cx + r * Math.cos(rad2);
  const y2 = cy + r * Math.sin(rad2);
  let diff = a2 - a1;
  while (diff < -180) diff += 360;
  while (diff > 180) diff -= 360;
  const sweep = diff > 0 ? 1 : 0;
  return `M ${num(x1)} ${num(y1)} A ${num(r)} ${num(r)} 0 0 ${sweep} ${num(x2)} ${num(y2)}`;
}

function renderArc(a: GeoArc, points: Map<string, GeoPoint>): string {
  const center = points.get(a.center);
  if (!center) return "";
  const color = a.color ?? BLUE;
  const width = a.width ?? 2;
  const dash = a.dashed ? a.dash ?? "6 4" : undefined;
  const path = arcPath(center.x, center.y, a.radius, a.startAngle, a.endAngle);
  let s = "";
  if (a.fill) {
    const rad1 = (a.startAngle * Math.PI) / 180;
    const rad2 = (a.endAngle * Math.PI) / 180;
    const x1 = center.x + a.radius * Math.cos(rad1);
    const y1 = center.y + a.radius * Math.sin(rad1);
    const x2 = center.x + a.radius * Math.cos(rad2);
    const y2 = center.y + a.radius * Math.sin(rad2);
    s += `<path d="M ${num(center.x)} ${num(center.y)} L ${num(x1)} ${num(y1)} ${path.replace(/^M [^ ]+ [^ ]+ /, "A ")} L ${num(x2)} ${num(y2)} Z" fill="${a.fill}" fill-opacity="${a.fillOpacity ?? 0.15}" stroke="none"/>`;
  }
  s += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  if (a.label) {
    const mid = (a.startAngle + a.endAngle) / 2;
    const rad = (mid * Math.PI) / 180;
    const lr = a.radius + 14;
    const off = a.labelOffset ?? { dx: 0, dy: 0 };
    s += `<text x="${num(center.x + lr * Math.cos(rad) + off.dx)}" y="${num(center.y + lr * Math.sin(rad) + off.dy)}" font-size="12" fill="${SLATE}" text-anchor="middle" font-family="${SERIF}">${esc(a.label)}</text>`;
  }
  return s;
}

function renderAngle(a: GeoAngle, points: Map<string, GeoPoint>): string {
  const v = points.get(a.vertex);
  const p1 = points.get(a.from);
  const p2 = points.get(a.to);
  if (!v || !p1 || !p2) return "";
  const radius = a.radius ?? 30;
  const a1 = angleDeg(v, p1);
  const a2 = angleDeg(v, p2);
  const color = a.color ?? BLUE;
  const width = a.width ?? 2;
  const path = arcPath(v.x, v.y, radius, a1, a2);
  let s = "";
  if (a.fill) {
    const rad1 = (a1 * Math.PI) / 180;
    const rad2 = (a2 * Math.PI) / 180;
    const x1 = v.x + radius * Math.cos(rad1);
    const y1 = v.y + radius * Math.sin(rad1);
    const x2 = v.x + radius * Math.cos(rad2);
    const y2 = v.y + radius * Math.sin(rad2);
    s += `<path d="M ${num(v.x)} ${num(v.y)} L ${num(x1)} ${num(y1)} A ${num(radius)} ${num(radius)} 0 0 ${path.split(" ").slice(-1)[0] === "1" ? "1" : "0"} ${num(x2)} ${num(y2)} Z" fill="${a.fill}" fill-opacity="${a.fillOpacity ?? 0.18}" stroke="none"/>`;
  }
  s += `<path d="${path}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  if (a.showLabel !== false && a.label) {
    let diff = a2 - a1;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    const mid = a1 + diff / 2;
    const rad = (mid * Math.PI) / 180;
    const lr = a.labelRadius ?? radius + 12;
    const off = a.labelOffset ?? { dx: 0, dy: 0 };
    s += `<text x="${num(v.x + lr * Math.cos(rad) + off.dx)}" y="${num(v.y + lr * Math.sin(rad) + off.dy)}" font-size="12" fill="${color}" text-anchor="middle" font-family="${SERIF}" font-weight="bold">${esc(a.label)}</text>`;
  }
  return s;
}

function renderRightAngle(
  r: GeoRightAngle,
  points: Map<string, GeoPoint>
): string {
  const v = points.get(r.vertex);
  const p1 = points.get(r.from);
  const p2 = points.get(r.to);
  if (!v || !p1 || !p2) return "";
  const size = r.size ?? 14;
  const color = r.color ?? SLATE;
  const d1 = Math.hypot(p1.x - v.x, p1.y - v.y) || 1;
  const d2 = Math.hypot(p2.x - v.x, p2.y - v.y) || 1;
  const u1x = (p1.x - v.x) / d1;
  const u1y = (p1.y - v.y) / d1;
  const u2x = (p2.x - v.x) / d2;
  const u2y = (p2.y - v.y) / d2;
  const q1x = v.x + u1x * size;
  const q1y = v.y + u1y * size;
  const q2x = v.x + u1x * size + u2x * size;
  const q2y = v.y + u1y * size + u2y * size;
  const q3x = v.x + u2x * size;
  const q3y = v.y + u2y * size;
  return `<path d="M ${num(q1x)} ${num(q1y)} L ${num(q2x)} ${num(q2y)} L ${num(q3x)} ${num(q3y)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderParallelMarker(
  m: GeoParallelMarker,
  points: Map<string, GeoPoint>
): string {
  const a = points.get(m.segment[0]);
  const b = points.get(m.segment[1]);
  if (!a || !b) return "";
  const count = m.count ?? 1;
  const offset = m.offset ?? 8;
  const color = m.color ?? SLATE;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let s = "";
  for (let i = 0; i < count; i++) {
    const cx = mx + nx * (offset + i * 7);
    const cy = my + ny * (offset + i * 7);
    const px = -ny;
    const py = nx;
    const h = 5;
    s += `<path d="M ${num(cx - px * h)} ${num(cy - py * h)} L ${num(cx + px * h)} ${num(cy + py * h)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  return s;
}

function renderMidpointMarker(
  m: GeoMidpointMarker,
  points: Map<string, GeoPoint>
): string {
  const a = points.get(m.segment[0]);
  const b = points.get(m.segment[1]);
  if (!a || !b) return "";
  const color = m.color ?? SLATE;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const h = 5;
  return `<path d="M ${num(mx - nx * h)} ${num(my - ny * h)} L ${num(mx + nx * h)} ${num(my + ny * h)}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
}

function renderLabel(l: GeoLabel): string {
  const color = l.color ?? SLATE;
  const size = l.size ?? 12;
  const anchor = l.anchor ?? "start";
  const weight = l.bold ? "bold" : "normal";
  const style = l.italic ? "italic" : "normal";
  const font = l.font ?? SERIF;
  return `<text x="${num(l.x)}" y="${num(l.y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-family="${font}" font-weight="${weight}" font-style="${style}">${esc(l.text)}</text>`;
}

function renderPolygon(poly: GeoPolygon, points: Map<string, GeoPoint>): string {
  const pts = poly.points
    .map((id) => points.get(id))
    .filter((p): p is GeoPoint => Boolean(p));
  if (pts.length < 3) return "";
  const d = pts.map((p) => `${num(p.x)},${num(p.y)}`).join(" ");
  const color = poly.color ?? BLUE;
  const opacity = poly.opacity ?? 0.12;
  const stroke = poly.stroke ?? "none";
  const strokeWidth = poly.strokeWidth ?? 0;
  return `<polygon points="${d}" fill="${color}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function renderGrid(g: GeoGrid, W: number, H: number): string {
  const step = g.step ?? 40;
  const color = g.color ?? "#E2E8F0";
  const opacity = g.opacity ?? 1;
  let s = `<g stroke="${color}" stroke-width="0.7" opacity="${opacity}">`;
  for (let x = g.xMin; x <= g.xMax; x += step) {
    s += `<line x1="${num(x)}" y1="0" x2="${num(x)}" y2="${num(H)}"/>`;
  }
  for (let y = g.yMin; y <= g.yMax; y += step) {
    s += `<line x1="0" y1="${num(y)}" x2="${num(W)}" y2="${num(y)}"/>`;
  }
  s += "</g>";
  return s;
}

function renderAxes(ax: GeoAxes, points: Map<string, GeoPoint>): string {
  const o = points.get(ax.origin);
  if (!o) return "";
  const color = ax.color ?? AXIS;
  const xMax = ax.xMax ?? 200;
  const yMax = ax.yMax ?? 200;
  const arrow = ax.arrow ?? true;
  const marker = arrow ? ' marker-end="url(#gd-arrow)"' : "";
  let s = `<line x1="${num(o.x)}" y1="${num(o.y)}" x2="${num(o.x + xMax)}" y2="${num(o.y)}" stroke="${color}" stroke-width="2"${marker}/>`;
  s += `<line x1="${num(o.x)}" y1="${num(o.y)}" x2="${num(o.x)}" y2="${num(o.y - yMax)}" stroke="${color}" stroke-width="2"${marker}/>`;
  const xLabel = ax.xLabel ?? "x";
  const yLabel = ax.yLabel ?? "y";
  s += `<text x="${num(o.x + xMax + 8)}" y="${num(o.y + 16)}" font-size="14" fill="${color}" font-family="${SERIF}" font-weight="bold" font-style="italic">${esc(xLabel)}</text>`;
  s += `<text x="${num(o.x - 10)}" y="${num(o.y - yMax - 8)}" font-size="14" fill="${color}" font-family="${SERIF}" font-weight="bold" font-style="italic">${esc(yLabel)}</text>`;
  if (ax.showTicks) {
    const step = ax.tickStep ?? 40;
    const tickColor = ax.tickColor ?? GRAY;
    for (let i = step; i <= xMax; i += step) {
      s += `<text x="${num(o.x + i)}" y="${num(o.y + 16)}" font-size="10" fill="${tickColor}" text-anchor="middle" font-family="${SANS}">${i}</text>`;
    }
    for (let i = step; i <= yMax; i += step) {
      s += `<text x="${num(o.x - 8)}" y="${num(o.y - i + 4)}" font-size="10" fill="${tickColor}" text-anchor="end" font-family="${SANS}">${i}</text>`;
    }
  }
  return s;
}

// ─── Main renderer ──────────────────────────────────────────────────────────

export function renderGeometrySvg(data: GeometryDiagramData): string {
  const W = data.width ?? 560;
  const H = data.height ?? 420;
  const points = new Map<string, GeoPoint>();
  for (const p of data.points) points.set(p.id, p);

  const parts: string[] = [];

  // Background card
  parts.push(
    `<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="#ffffff" stroke="#E2E8F0" stroke-width="1"/>`
  );

  if (data.grid) parts.push(renderGrid(data.grid, W, H));
  if (data.axes) parts.push(renderAxes(data.axes, points));

  if (data.polygons) {
    for (const poly of data.polygons) parts.push(renderPolygon(poly, points));
  }

  if (data.constructionLines) {
    for (const seg of data.constructionLines) {
      parts.push(renderSegment(seg, points, true));
    }
  }

  if (data.segments) {
    for (const seg of data.segments) parts.push(renderSegment(seg, points));
  }

  if (data.circles) {
    for (const c of data.circles) parts.push(renderCircle(c, points));
  }

  if (data.arcs) {
    for (const a of data.arcs) parts.push(renderArc(a, points));
  }

  if (data.angles) {
    for (const a of data.angles) parts.push(renderAngle(a, points));
  }

  if (data.rightAngles) {
    for (const r of data.rightAngles) parts.push(renderRightAngle(r, points));
  }

  if (data.parallelMarkers) {
    for (const m of data.parallelMarkers) {
      parts.push(renderParallelMarker(m, points));
    }
  }

  if (data.midpointMarkers) {
    for (const m of data.midpointMarkers) {
      parts.push(renderMidpointMarker(m, points));
    }
  }

  for (const p of data.points) parts.push(renderPoint(p));

  if (data.labels) {
    for (const l of data.labels) parts.push(renderLabel(l));
  }

  const title = data.title ?? "Geometry diagram";
  const desc =
    data.description ??
    "A mathematically accurate diagram illustrating the geometry of the solution.";

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="gd-title gd-desc" style="width:100%;height:auto;display:block"><title id="gd-title">${esc(title)}</title><desc id="gd-desc">${esc(desc)}</desc><defs><marker id="gd-arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="${AXIS}"/></marker></defs>${parts.join("")}</svg>`;
}

/** Validate that a geometry data object is structurally sound. */
export function validateGeometryData(data: GeometryDiagramData): string[] {
  const errors: string[] = [];
  const ids = new Set(data.points.map((p) => p.id));
  const check = (ref: string | undefined, what: string) => {
    if (ref && !ids.has(ref)) errors.push(`${what}: unknown point "${ref}"`);
  };
  for (const s of data.segments ?? []) {
    check(s.from, `segment ${s.from}→${s.to}`);
    check(s.to, `segment ${s.from}→${s.to}`);
  }
  for (const c of data.circles ?? []) check(c.center, `circle`);
  for (const a of data.arcs ?? []) check(a.center, `arc`);
  for (const a of data.angles ?? []) {
    check(a.vertex, `angle`);
    check(a.from, `angle`);
    check(a.to, `angle`);
  }
  for (const r of data.rightAngles ?? []) {
    check(r.vertex, `right angle`);
    check(r.from, `right angle`);
    check(r.to, `right angle`);
  }
  for (const m of data.parallelMarkers ?? []) {
    check(m.segment[0], `parallel marker`);
    check(m.segment[1], `parallel marker`);
  }
  for (const m of data.midpointMarkers ?? []) {
    check(m.segment[0], `midpoint marker`);
    check(m.segment[1], `midpoint marker`);
  }
  for (const poly of data.polygons ?? []) {
    for (const id of poly.points) check(id, `polygon`);
  }
  if (data.axes) check(data.axes.origin, `axes origin`);
  return errors;
}