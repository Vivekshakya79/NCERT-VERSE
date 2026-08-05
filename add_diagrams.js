const fs = require('fs');
const path = require('path');

const BASE = 'src/data/solutions/class-9/Mathematics/chapter-0';

// ─── SVG Helper ────────────────────────────────────────────────────────────

function svgHeader(extraWidth = 0, extraHeight = 0) {
  const w = 520 + extraWidth;
  const h = 370 + extraHeight;
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#555"/></marker></defs><!-- Background --><rect width="${w}" height="${h}" fill="#fafbfc" rx="8"/>`;
}

function svgFooter() { return '</svg>'; }

// Grid lines for standard coordinate plane
// origin at (ox, oy) with unit scaling ux=33.33, uy=40
function gridLines(ox, oy, xMin, xMax, yMin, yMax) {
  let s = '<!-- Grid lines --><g stroke="#e8ecf0" stroke-width="0.5">';
  for (let x = xMin; x <= xMax; x++) {
    const px = ox + x * 33.33;
    const pyTop = oy - yMax * 40;
    s += `<line x1="${px}" y1="${oy}" x2="${px}" y2="${pyTop}"/>`;
  }
  for (let y = yMin; y <= yMax; y++) {
    const py = oy - y * 40;
    s += `<line x1="${ox + xMin * 33.33}" y1="${py}" x2="${ox + xMax * 33.33}" y2="${py}"/>`;
  }
  s += '</g>';
  return s;
}

function axes(ox, oy, xMax, yMax, w = 520, h = 370) {
  const xEnd = ox + xMax * 33.33 + 30;
  const yEnd = oy - yMax * 40 - 10;
  return `<!-- Axes with arrows --><line x1="${ox}" y1="${oy}" x2="${xEnd}" y2="${oy}" stroke="#333" stroke-width="2" marker-end="url(#arr)"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${yEnd}" stroke="#333" stroke-width="2" marker-end="url(#arr)"/><!-- Axis labels --><text x="${xEnd - 5}" y="${oy + 15}" font-size="14" fill="#333" font-weight="bold" font-family="serif">x</text><text x="${ox - 15}" y="${yEnd + 5}" font-size="14" fill="#333" font-weight="bold" font-family="serif">y</text>`;
}

function tickLabelsX(ox, oy, min, max) {
  let s = `<!-- Tick marks on x-axis --><g font-size="10" fill="#666" text-anchor="middle" font-family="Arial">`;
  for (let i = min; i <= max; i++) {
    const px = ox + i * 33.33;
    s += `<text x="${Math.round(px)}" y="${oy + 17}">${i}</text>`;
  }
  s += '</g>';
  return s;
}

function tickLabelsY(ox, oy, min, max, offset = 6) {
  let s = `<!-- Tick marks on y-axis --><g font-size="10" fill="#666" text-anchor="end" font-family="Arial">`;
  for (let i = min; i <= max; i++) {
    if (i === 0) continue;
    const py = oy - i * 40;
    s += `<text x="${ox - offset}" y="${py + 4}">${i}</text>`;
  }
  s += '</g>';
  return s;
}

function originLabel(ox, oy) {
  return `<text x="${ox - 8}" y="${oy + 17}" font-size="10" fill="#666" font-family="Arial">0</text>`;
}

function pointLabel(px, py, label, color = '#2563EB', offsetX = -8, offsetY = -10) {
  return `<circle cx="${px}" cy="${py}" r="4" fill="${color}"/><text x="${px + offsetX}" y="${py + offsetY}" font-size="11" fill="${color}" font-weight="bold" font-family="serif">${label}</text>`;
}

// ─── 1. Fig 1.3 loaded from Q1 ─────────────────────────────────────────────
const fig13Data = JSON.parse(fs.readFileSync(path.join(BASE, 'exercise-set-1.1.json'), 'utf8'));
const fig13Svg = fig13Data.questions[0].diagram.content;
const fig13Caption = fig13Data.questions[0].diagram.caption;

// ─── 2. Add Fig 1.3 to Q2, Q3, Q4 of ex1.1 ────────────────────────────────
const ex11 = JSON.parse(fs.readFileSync(path.join(BASE, 'exercise-set-1.1.json'), 'utf8'));

// Q2 caption - D₁ focus
ex11.questions[1].diagram = {
  type: 'svg',
  content: fig13Svg,
  caption: 'Fig. 1.3: Reiaan\'s room floor plan. The point D₁(8.5, 0) marks the start of the room door on the x-axis.'
};

// Q3 caption - door width focus
ex11.questions[2].diagram = {
  type: 'svg',
  content: fig13Svg,
  caption: 'Fig. 1.3: The room door D₁R₁ spans 3 ft (from x=8.5 to x=11.5) on the bottom wall (x-axis) of Reiaan\'s room.'
};

// Q4 caption - bathroom door focus
ex11.questions[3].diagram = {
  type: 'svg',
  content: fig13Svg,
  caption: 'Fig. 1.3: The bathroom door B₁B₂ (2.5 ft wide, from y=1.5 to y=4) is on the left wall (y-axis) of Reiaan\'s room.'
};

fs.writeFileSync(path.join(BASE, 'exercise-set-1.1.json'), JSON.stringify(ex11, null, 2), 'utf8');
console.log('✅ Updated exercise-set-1.1.json (added Fig 1.3 to Q2, Q3, Q4)');

// ─── 3. exercise-set-1.2.json diagrams ────────────────────────────────────
const ex12 = JSON.parse(fs.readFileSync(path.join(BASE, 'exercise-set-1.2.json'), 'utf8'));

// Q2: Bathroom door swing SVG
// Frame: origin at (85, 260). x: 0 to 8, y: 0 to 7
// B₁(0,1.5) at (85, 260-60)=(85,200), B₂(0,4) at (85, 260-160)=(85,100)
// Door swing: quarter-circle from B₁ radius 2.5 units
// Door quarter-circle arc: curves to the right (into the room)
const ox2 = 85, oy2 = 260;
const svgQ2 = svgHeader(30, 20) +
gridLines(ox2, oy2, 0, 8, 0, 7) +
axes(ox2, oy2, 8, 7) +
tickLabelsX(ox2, oy2, 0, 8) +
tickLabelsY(ox2, oy2, 0, 7) +
originLabel(ox2, oy2) +
// Room wall (left wall = y-axis)
`<line x1="${ox2}" y1="${oy2}" x2="${ox2}" y2="${oy2 - 280}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>` +
// Room wall (bottom wall = x-axis)
`<line x1="${ox2}" y1="${oy2}" x2="${ox2 + 267}" y2="${oy2}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>` +
// Bathroom door B₁B₂ on y-axis
`<line x1="${ox2}" y1="${oy2 - 60}" x2="${ox2}" y2="${oy2 - 160}" stroke="#f59e0b" stroke-width="10" stroke-linecap="round"/>` +
// B₁ hinge point (small circle)
`<circle cx="${ox2}" cy="${oy2 - 60}" r="6" fill="#e74c3c" stroke="#fff" stroke-width="2"/>` +
// B₁ label
`<text x="${ox2 + 10}" y="${oy2 - 56}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">B₁(0,1.5)</text>` +
`<text x="${ox2 + 10}" y="${oy2 - 156}" font-size="11" fill="#f59e0b" font-weight="bold" font-family="serif">B₂(0,4)</text>` +
// Dimension line for bathroom door
`<line x1="${ox2 - 15}" y1="${oy2 - 60}" x2="${ox2 - 15}" y2="${oy2 - 160}" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3,2"/>` +
`<line x1="${ox2 - 18}" y1="${oy2 - 60}" x2="${ox2 - 12}" y2="${oy2 - 60}" stroke="#f59e0b" stroke-width="1"/><line x1="${ox2 - 18}" y1="${oy2 - 160}" x2="${ox2 - 12}" y2="${oy2 - 160}" stroke="#f59e0b" stroke-width="1"/>` +
`<text x="${ox2 - 20}" y="${oy2 - 114}" font-size="9" fill="#f59e0b" text-anchor="middle" font-family="Arial" transform="rotate(-90,${ox2 - 20},${oy2 - 114})">2.5 ft</text>` +
// Door swing path (quarter-circle arc, radius = 2.5 units = 100px, from B₁)
`<path d="M${ox2},${oy2 - 60} A100,100 0 0,1 ${ox2 + 100},${oy2 - 60}" stroke="#e74c3c" stroke-width="2" fill="none" stroke-dasharray="6,4"/>` +
// Arc label
`<text x="${ox2 + 40}" y="${oy2 - 90}" font-size="10" fill="#e74c3c" font-family="Arial" font-style="italic">Swing path</text>` +
// Wardrobe area (shaded rectangle, approximate position)
`<rect x="${ox2 + 120}" y="${oy2 - 70}" width="60" height="40" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4,3"/>` +
`<text x="${ox2 + 150}" y="${oy2 - 48}" font-size="10" fill="#8b5cf6" font-weight="bold" font-family="Arial" text-anchor="middle">Wardrobe</text>` +
// Door label
`<text x="${ox2 + 5}" y="${oy2 - 110}" font-size="10" fill="#f59e0b" font-weight="bold" font-family="Arial" transform="rotate(-90,${ox2 + 5},${oy2 - 110})">Bathroom Door</text>` +
svgFooter();

ex12.questions[1].diagram = {
  type: 'svg',
  content: svgQ2,
  caption: 'Fig. 1.5: Bathroom door with hinge at B₁(0,1.5). The door swing arc (radius 2.5 ft) and the wardrobe position are shown.'
};
console.log('✅ Added bathroom door swing diagram to ex1.2 Q2');

// Q3: Bathroom layout SVG
// Origin at (85, 260). x: 0 to 7, y: 0 to 6
// Bathroom corners: O(0,0), F(0,4), R(5,4), P(5,0) (approximate)
const ox3 = 85, oy3 = 260;
const svgQ3 = svgHeader(20, 10) +
gridLines(ox3, oy3, 0, 7, 0, 6) +
axes(ox3, oy3, 7, 6) +
tickLabelsX(ox3, oy3, 0, 7) +
tickLabelsY(ox3, oy3, 0, 6) +
originLabel(ox3, oy3) +
// Bathroom rectangle O-F-R-P
`<polygon points="${ox3},${oy3} ${ox3},${oy3 - 160} ${ox3 + 167},${oy3 - 160} ${ox3 + 167},${oy3}" stroke="#2563EB" stroke-width="3" fill="rgba(37,99,235,0.06)"/>` +
// Labels for corners
`<text x="${ox3 - 10}" y="${oy3 + 17}" font-size="12" fill="#2563EB" font-weight="bold" font-family="serif">O(0,0)</text>` +
`<text x="${ox3 - 10}" y="${oy3 - 156}" font-size="12" fill="#2563EB" font-weight="bold" font-family="serif">F(0,4)</text>` +
`<text x="${ox3 + 160}" y="${oy3 - 156}" font-size="12" fill="#2563EB" font-weight="bold" font-family="serif">R(5,4)</text>` +
`<text x="${ox3 + 160}" y="${oy3 + 17}" font-size="12" fill="#2563EB" font-weight="bold" font-family="serif">P(5,0)</text>` +
// Bathroom door B₁B₂
`<line x1="${ox3}" y1="${oy3 - 60}" x2="${ox3}" y2="${oy3 - 160}" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>` +
// SHWR (showering area) - shown inside bathroom
`<rect x="${ox3 + 20}" y="${oy3 - 140}" width="100" height="80" fill="rgba(6,182,212,0.08)" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4,3" rx="4"/>` +
`<text x="${ox3 + 70}" y="${oy3 - 110}" font-size="11" fill="#06b6d4" font-weight="bold" font-family="Arial" text-anchor="middle">SHWR</text>` +
// Dimension labels
`<text x="${ox3 + 110}" y="${oy3 + 12}" font-size="9" fill="#666" font-family="Arial">5 ft →</text>` +
`<text x="${ox3 + 8}" y="${oy3 - 80}" font-size="9" fill="#666" font-family="Arial">← 4 ft →</text>` +
svgFooter();

ex12.questions[2].diagram = {
  type: 'svg',
  content: svgQ3,
  caption: 'Fig. 1.5: Reiaan\'s bathroom with corners O(0,0), F(0,4), R(5,4), P(5,0). The showering area SHWR is shown inside.'
};
console.log('✅ Added bathroom layout diagram to ex1.2 Q3');

// Q4: Dining room SVG (18x15 ft)
// Need larger viewBox to accommodate 18 units on x-axis and some on y-axis
// Origin at (60, 300). x: 0 to 20, y: 0 to 18
// Scale: x=20px/unit, y=15px/unit
const ox4 = 60, oy4 = 300;
const ux4 = 20, uy4 = 15;
function gridQ4(xMin, xMax, yMin, yMax) {
  let s = '<!-- Grid lines --><g stroke="#e8ecf0" stroke-width="0.5">';
  for (let x = xMin; x <= xMax; x++) {
    s += `<line x1="${ox4 + x * ux4}" y1="${oy4}" x2="${ox4 + x * ux4}" y2="${oy4 - yMax * uy4}"/>`;
  }
  for (let y = yMin; y <= yMax; y++) {
    s += `<line x1="${ox4 + xMin * ux4}" y1="${oy4 - y * uy4}" x2="${ox4 + xMax * ux4}" y2="${oy4 - y * uy4}"/>`;
  }
  s += '</g>';
  return s;
}
function tickQ4(min, max) {
  let s = `<g font-size="9" fill="#666" text-anchor="middle" font-family="Arial">`;
  for (let i = min; i <= max; i++) {
    s += `<text x="${Math.round(ox4 + i * ux4)}" y="${oy4 + 15}">${i}</text>`;
  }
  s += '</g><g font-size="9" fill="#666" text-anchor="end" font-family="Arial">';
  for (let i = 3; i <= max; i += 3) {
    const py = oy4 - i * uy4;
    s += `<text x="${ox4 - 5}" y="${py + 4}">${i}</text>`;
  }
  s += '</g>';
  return s;
}
const svgQ4 = `<svg viewBox="0 0 550 420" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="#555"/></marker></defs><rect width="550" height="420" fill="#fafbfc" rx="8"/>` +
gridQ4(0, 20, 0, 18) +
`<line x1="${ox4}" y1="${oy4}" x2="${ox4 + 20 * ux4 + 20}" y2="${oy4}" stroke="#333" stroke-width="2" marker-end="url(#arr)"/><line x1="${ox4}" y1="${oy4}" x2="${ox4}" y2="${oy4 - 18 * uy4 - 10}" stroke="#333" stroke-width="2" marker-end="url(#arr)"/>` +
`<text x="${ox4 + 20 * ux4 + 5}" y="${oy4 + 14}" font-size="13" fill="#333" font-weight="bold" font-family="serif">x</text><text x="${ox4 - 14}" y="${oy4 - 18 * uy4}" font-size="13" fill="#333" font-weight="bold" font-family="serif">y</text>` +
tickQ4(0, 20) +
`<text x="${ox4 - 8}" y="${oy4 + 16}" font-size="9" fill="#666" font-family="Arial">0</text>` +
// Dining room rectangle (18x15)
`<polygon points="${ox4},${oy4} ${ox4},${oy4 - 18 * uy4} ${ox4 + 18 * ux4},${oy4 - 18 * uy4} ${ox4 + 18 * ux4},${oy4}" stroke="#2563EB" stroke-width="3" fill="rgba(37,99,235,0.06)"/>` +
// Dining room label
`<text x="${ox4 + 9 * ux4}" y="${oy4 - 9 * uy4 + 4}" font-size="13" fill="#2563EB" font-weight="bold" font-family="serif" text-anchor="middle">Dining Room</text>` +
`<text x="${ox4 + 9 * ux4}" y="${oy4 - 9 * uy4 + 20}" font-size="10" fill="#2563EB" font-family="Arial" text-anchor="middle">18 ft × 15 ft</text>` +
// Point P at (0,0) and Point A at (0,18)
`<circle cx="${ox4}" cy="${oy4}" r="4" fill="#e74c3c"/><text x="${ox4 - 12}" y="${oy4 + 20}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">P</text>` +
`<circle cx="${ox4}" cy="${oy4 - 18 * uy4}" r="4" fill="#e74c3c"/><text x="${ox4 - 12}" y="${oy4 - 18 * uy4 - 6}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">A</text>` +
// Dining table (5x3) centered
`<rect x="${ox4 + 6.5 * ux4}" y="${oy4 - (9 + 1.5) * uy4}" width="${5 * ux4}" height="${3 * uy4}" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" stroke-width="2" rx="3"/>` +
`<text x="${ox4 + 9 * ux4}" y="${oy4 - 10.5 * uy4 + 4}" font-size="10" fill="#8b5cf6" font-weight="bold" font-family="Arial" text-anchor="middle">Table</text>` +
`<text x="${ox4 + 9 * ux4}" y="${oy4 - 10.5 * uy4 + 16}" font-size="9" fill="#8b5cf6" font-family="Arial" text-anchor="middle">5 ft × 3 ft</text>` +
// Dimension arrows
`<line x1="${ox4}" y1="${oy4 + 8}" x2="${ox4 + 18 * ux4}" y2="${oy4 + 8}" stroke="#666" stroke-width="1" stroke-dasharray="3,2"/>` +
`<text x="${ox4 + 9 * ux4}" y="${oy4 + 22}" font-size="10" fill="#666" text-anchor="middle" font-family="Arial">18 ft</text>` +
`<line x1="${ox4 + 18 * ux4 + 8}" y1="${oy4}" x2="${ox4 + 18 * ux4 + 8}" y2="${oy4 - 18 * uy4}" stroke="#666" stroke-width="1" stroke-dasharray="3,2"/>` +
`<text x="${ox4 + 18 * ux4 + 22}" y="${oy4 - 9 * uy4 + 4}" font-size="10" fill="#666" font-family="Arial">15 ft</text>` +
svgFooter();

ex12.questions[3].diagram = {
  type: 'svg',
  content: svgQ4,
  caption: 'Fig. 1.5: The dining room (18 ft × 15 ft) extending from point P to point A, with a 5 ft × 3 ft dining table placed at the centre.'
};
console.log('✅ Added dining room diagram to ex1.2 Q4');

fs.writeFileSync(path.join(BASE, 'exercise-set-1.2.json'), JSON.stringify(ex12, null, 2), 'utf8');
console.log('✅ Updated exercise-set-1.2.json');

// ─── 4. end-of-chapter.json diagrams ───────────────────────────────────────
const ec = JSON.parse(fs.readFileSync(path.join(BASE, 'end-of-chapter.json'), 'utf8'));

// Helper: standard coordinate plane SVG maker
function makeCoordSvg(ox, oy, xMin, xMax, yMin, yMax, elements) {
  const extraW = xMax > 12 ? 60 : 0;
  const extraH = yMax > 7 ? 40 : 0;
  let s = svgHeader(extraW, extraH) +
    gridLines(ox, oy, xMin, xMax, yMin, yMax) +
    axes(ox, oy, xMax, yMax, 520 + extraW, 370 + extraH) +
    tickLabelsX(ox, oy, xMin, xMax) +
    tickLabelsY(ox, oy, yMin, yMax) +
    originLabel(ox, oy);
  if (elements) s += elements;
  s += svgFooter();
  return s;
}

// Q4: IZN right triangle I(5,0), Z(5,-6), N(0,-6)
const ox5 = 85, oy5 = 230;
const iznGrid = gridLines(ox5, oy5, 0, 6, -6, 2) +
axes(ox5, oy5, 6, 2) +
tickLabelsX(ox5, oy5, 0, 6) +
tickLabelsY(ox5, oy5, -6, 2, 8) +
originLabel(ox5, oy5) +
// IZN triangle
`<polygon points="${ox5 + 5 * 33.33},${oy5} ${ox5 + 5 * 33.33},${oy5 + 6 * 40} ${ox5},${oy5 + 6 * 40}" stroke="#2563EB" stroke-width="2.5" fill="rgba(37,99,235,0.08)"/>` +
// Right angle marker at Z
`<polyline points="${ox5 + 5 * 33.33 - 12},${oy5 + 6 * 40} ${ox5 + 5 * 33.33 - 12},${oy5 + 6 * 40 - 12} ${ox5 + 5 * 33.33},${oy5 + 6 * 40 - 12}" stroke="#2563EB" stroke-width="1.5" fill="none"/>` +
// Point labels
`<text x="${ox5 + 5 * 33.33 - 8}" y="${oy5 - 6}" font-size="12" fill="#e74c3c" font-weight="bold" font-family="serif">I(5,0)</text>` +
`<text x="${ox5 + 5 * 33.33 + 6}" y="${oy5 + 6 * 40 + 4}" font-size="12" fill="#e74c3c" font-weight="bold" font-family="serif">Z(5,-6)</text>` +
`<text x="${ox5 - 8}" y="${oy5 + 6 * 40 + 4}" font-size="12" fill="#e74c3c" font-weight="bold" font-family="serif">N(0,-6)</text>` +
// Side labels
`<text x="${ox5 + 5 * 33.33 + 10}" y="${oy5 + 3 * 40 + 4}" font-size="11" fill="#2563EB" font-family="serif" font-style="italic">IZ = 6</text>` +
`<text x="${ox5 + 2.5 * 33.33}" y="${oy5 + 6 * 40 + 18}" font-size="11" fill="#2563EB" font-family="serif" font-style="italic" text-anchor="middle">ZN = 5</text>` +
`<text x="${ox5 + 1.8 * 33.33}" y="${oy5 + 2.8 * 40}" font-size="11" fill="#8b5cf6" font-family="serif" font-style="italic">IN = √61 ≈ 7.81</text>` +
// Additional y tick labels for negative values
`<g font-size="10" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox5 - 6}" y="${oy5 + 4 * 40 + 4}">-2</text>` +
`<text x="${ox5 - 6}" y="${oy5 + 8 * 40 + 4}">-4</text>` +
`<text x="${ox5 - 6}" y="${oy5 + 12 * 40 + 4}">-6</text>` +
`</g>`;

const svgEcQ4 = svgHeader(20, 50) + iznGrid + svgFooter();

ec.questions[3].diagram = {
  type: 'svg',
  content: svgEcQ4,
  caption: 'Right-angled triangle IZN with I(5,0), Z(5,-6), N(0,-6). Right angle at Z. Side lengths: IZ = 6, ZN = 5, IN = √61 ≈ 7.81.'
};
console.log('✅ Added IZN triangle diagram to EC Q4');

// Q6: Collinear points M(-3,-4), A(0,0), G(6,8)
const ox6 = 85, oy6 = 290;
const xMin6 = -4, xMax6 = 7, yMin6 = -5, yMax6 = 9;
const collGrid = gridLines(ox6, oy6, xMin6, xMax6, yMin6, yMax6) +
axes(ox6, oy6, xMax6, yMax6) +
tickLabelsX(ox6, oy6, xMin6, xMax6) +
tickLabelsY(ox6, oy6, yMin6, yMax6) +
originLabel(ox6, oy6) +
// Line y = (4/3)x through points
`<line x1="${ox6 + (-3) * 33.33}" y1="${oy6 - (-4) * 40}" x2="${ox6 + 6 * 33.33}" y2="${oy6 - 8 * 40}" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>` +
// Points M, A, G
`<circle cx="${ox6 + (-3) * 33.33}" cy="${oy6 - (-4) * 40}" r="5" fill="#e74c3c"/><text x="${ox6 + (-3) * 33.33 - 10}" y="${oy6 - (-4) * 40 + 20}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">M(-3,-4)</text>` +
`<circle cx="${ox6}" cy="${oy6}" r="5" fill="#2563EB"/><text x="${ox6 - 8}" y="${oy6 + 20}" font-size="11" fill="#2563EB" font-weight="bold" font-family="serif">A(0,0)</text>` +
`<circle cx="${ox6 + 6 * 33.33}" cy="${oy6 - 8 * 40}" r="5" fill="#e74c3c"/><text x="${ox6 + 6 * 33.33 + 8}" y="${oy6 - 8 * 40 + 6}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">G(6,8)</text>` +
// Line label
`<text x="${ox6 + 2 * 33.33}" y="${oy6 - 3 * 40}" font-size="10" fill="#8b5cf6" font-family="serif" font-style="italic">y = (4/3)x</text>` +
// Additional tick labels
`<g font-size="10" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox6 - 6}" y="${oy6 + 4 * 40 + 4}">-2</text><text x="${ox6 - 6}" y="${oy6 + 8 * 40 + 4}">-4</text>` +
`<text x="${ox6 - 6}" y="${oy6 - 4 * 40 + 4}">2</text><text x="${ox6 - 6}" y="${oy6 - 8 * 40 + 4}">4</text><text x="${ox6 - 6}" y="${oy6 - 12 * 40 + 4}">6</text><text x="${ox6 - 6}" y="${oy6 - 16 * 40 + 4}">8</text>` +
`</g><g font-size="10" fill="#666" text-anchor="middle" font-family="Arial">` +
`<text x="${ox6 - 4 * 33.33}" y="${oy6 + 17}">-4</text><text x="${ox6 - 3 * 33.33}" y="${oy6 + 17}">-3</text><text x="${ox6 - 2 * 33.33}" y="${oy6 + 17}">-2</text><text x="${ox6 - 33.33}" y="${oy6 + 17}">-1</text>` +
`</g>`;

const svgQ6 = svgHeader(40, 120) + collGrid + svgFooter();

ec.questions[5].diagram = {
  type: 'svg',
  content: svgQ6,
  caption: 'Collinear points M(-3,-4), A(0,0), and G(6,8) all lie on the line y = (4/3)x.'
};
console.log('✅ Added collinearity diagram to EC Q6');

// Q7: Non-collinear points R(-5,-1), B(-2,-5), C(4,-12)
const ox7 = 140, oy7 = 340;
const noncollGrid = gridLines(ox7, oy7, -6, 5, -13, 1) +
axes(ox7, oy7, 5, 1) +
tickLabelsX(ox7, oy7, -6, 5) +
originLabel(ox7, oy7) +
// Negative x tick labels
`<g font-size="10" fill="#666" text-anchor="middle" font-family="Arial">` +
`<text x="${ox7 - 33.33}" y="${oy7 + 17}">-1</text><text x="${ox7 - 2 * 33.33}" y="${oy7 + 17}">-2</text><text x="${ox7 - 3 * 33.33}" y="${oy7 + 17}">-3</text><text x="${ox7 - 4 * 33.33}" y="${oy7 + 17}">-4</text><text x="${ox7 - 5 * 33.33}" y="${oy7 + 17}">-5</text><text x="${ox7 - 6 * 33.33}" y="${oy7 + 17}">-6</text>` +
`</g><g font-size="10" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox7 - 6}" y="${oy7 + 4 * 40 + 4}">-4</text><text x="${ox7 - 6}" y="${oy7 + 8 * 40 + 4}">-8</text><text x="${ox7 - 6}" y="${oy7 + 12 * 40 + 4}">-12</text>` +
`</g>` +
// Triangle RBC (non-collinear)
`<polygon points="${ox7 + (-5) * 33.33},${oy7 - (-1) * 40} ${ox7 + (-2) * 33.33},${oy7 - (-5) * 40} ${ox7 + 4 * 33.33},${oy7 - (-12) * 40}" stroke="#e74c3c" stroke-width="2" fill="rgba(231,76,60,0.06)" stroke-dasharray="5,3"/>` +
// Point R
`<circle cx="${ox7 + (-5) * 33.33}" cy="${oy7 - (-1) * 40}" r="4" fill="#2563EB"/><text x="${ox7 + (-5) * 33.33 - 10}" y="${oy7 - (-1) * 40 - 8}" font-size="11" fill="#2563EB" font-weight="bold" font-family="serif">R(-5,-1)</text>` +
// Point B
`<circle cx="${ox7 + (-2) * 33.33}" cy="${oy7 - (-5) * 40}" r="4" fill="#2563EB"/><text x="${ox7 + (-2) * 33.33 + 8}" y="${oy7 - (-5) * 40 + 4}" font-size="11" fill="#2563EB" font-weight="bold" font-family="serif">B(-2,-5)</text>` +
// Point C
`<circle cx="${ox7 + 4 * 33.33}" cy="${oy7 - (-12) * 40}" r="4" fill="#2563EB"/><text x="${ox7 + 4 * 33.33 + 8}" y="${oy7 - (-12) * 40 + 4}" font-size="11" fill="#2563EB" font-weight="bold" font-family="serif">C(4,-12)</text>` +
// "Not collinear" note
`<text x="${ox7 + 33.33}" y="${oy7 - 5 * 40}" font-size="11" fill="#e74c3c" font-weight="bold" font-family="serif">Not collinear (form a triangle)</text>`;

const svgQ7 = svgHeader(80, 200) + noncollGrid + svgFooter();

ec.questions[6].diagram = {
  type: 'svg',
  content: svgQ7,
  caption: 'Points R(-5,-1), B(-2,-5), and C(4,-12) are NOT collinear — they form a triangle.'
};
console.log('✅ Added non-collinearity diagram to EC Q7');

// Adjust end-of-chapter.json array indices:
// Q1=idx0, Q2=idx1, Q3=idx2, Q4=idx3, Q5=idx4, Q6=idx5, Q7=idx6, Q8=idx7, Q9=idx8, Q10=idx9, Q11=idx10

// Q8: Two triangles with origin
// Right-angled isosceles: O(0,0), P(3,0), Q(0,3)
// Isosceles: O(0,0), A(-3,-1), B(3,-1)
const ox8 = 120, oy8 = 250;
const triGrid = gridLines(ox8, oy8, -4, 4, -2, 4) +
axes(ox8, oy8, 4, 4) +
tickLabelsX(ox8, oy8, -4, 4) +
tickLabelsY(ox8, oy8, -2, 4) +
originLabel(ox8, oy8) +
// Negative x labels
`<g font-size="10" fill="#666" text-anchor="middle" font-family="Arial">` +
`<text x="${ox8 - 33.33}" y="${oy8 + 17}">-1</text><text x="${ox8 - 2 * 33.33}" y="${oy8 + 17}">-2</text><text x="${ox8 - 3 * 33.33}" y="${oy8 + 17}">-3</text><text x="${ox8 - 4 * 33.33}" y="${oy8 + 17}">-4</text>` +
`</g><g font-size="10" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox8 - 6}" y="${oy8 + 4 * 40 + 4}">-2</text>` +
`</g>` +
// Triangle 1: O(0,0), P(3,0), Q(0,3) - right-angled isosceles
`<polygon points="${ox8},${oy8} ${ox8 + 3 * 33.33},${oy8} ${ox8},${oy8 - 3 * 40}" stroke="#2563EB" stroke-width="2" fill="rgba(37,99,235,0.08)"/>` +
`<text x="${ox8 + 33.33}" y="${oy8 - 33.33}" font-size="10" fill="#2563EB" font-family="serif" font-style="italic">△OPQ</text>` +
`<text x="${ox8 + 33.33}" y="${oy8 + 17}" font-size="9" fill="#2563EB" font-family="Arial">P(3,0)</text>` +
`<circle cx="${ox8 + 3 * 33.33}" cy="${oy8}" r="4" fill="#2563EB"/>` +
`<text x="${ox8 - 8}" y="${oy8 - 3 * 40 + 4}" font-size="9" fill="#2563EB" font-family="Arial">Q(0,3)</text>` +
`<circle cx="${ox8}" cy="${oy8 - 3 * 40}" r="4" fill="#2563EB"/>` +
// Right angle marker at O for triangle 1
`<polyline points="${ox8 + 12},${oy8} ${ox8 + 12},${oy8 - 12} ${ox8},${oy8 - 12}" stroke="#2563EB" stroke-width="1.5" fill="none"/>` +
// Triangle 2: O(0,0), A(-3,-1), B(3,-1) - isosceles
`<polygon points="${ox8},${oy8} ${ox8 - 3 * 33.33},${oy8 + 1 * 40} ${ox8 + 3 * 33.33},${oy8 + 1 * 40}" stroke="#f59e0b" stroke-width="2" fill="rgba(245,158,11,0.06)"/>` +
`<text x="${ox8}" y="${oy8 + 2 * 40 + 4}" font-size="10" fill="#f59e0b" font-family="serif" font-style="italic" text-anchor="middle">△OAB (isosceles)</text>` +
`<text x="${ox8 - 3 * 33.33 - 8}" y="${oy8 + 1 * 40 + 4}" font-size="9" fill="#f59e0b" font-family="Arial">A(-3,-1)</text>` +
`<circle cx="${ox8 - 3 * 33.33}" cy="${oy8 + 1 * 40}" r="4" fill="#f59e0b"/>` +
`<text x="${ox8 + 3 * 33.33 + 4}" y="${oy8 + 1 * 40 + 4}" font-size="9" fill="#f59e0b" font-family="Arial">B(3,-1)</text>` +
`<circle cx="${ox8 + 3 * 33.33}" cy="${oy8 + 1 * 40}" r="4" fill="#f59e0b"/>` +
// Origin label (O is shared)
`<text x="${ox8 - 10}" y="${oy8 + 18}" font-size="11" fill="#666" font-weight="bold" font-family="serif">O</text>`;

const svgQ8 = svgHeader(40, 40) + triGrid + svgFooter();

ec.questions[7].diagram = {
  type: 'svg',
  content: svgQ8,
  caption: 'Two triangles with the origin: Right-angled isosceles △OPQ (blue) with P(3,0), Q(0,3) and isosceles △OAB (amber) with A(-3,-1), B(3,-1).'
};
console.log('✅ Added triangles diagram to EC Q8');

// Q10: Midpoint - A(3,-4), M(-7,1), B(-17,6)
// Need x from -18 to 4, y from -5 to 7
const ox10 = 300, oy10 = 200;
const midGrid = gridLines(ox10, oy10, -18, 4, -5, 7) +
axes(ox10, oy10, 4, 7) +
originLabel(ox10, oy10) +
// Negative x tick labels
`<g font-size="9" fill="#666" text-anchor="middle" font-family="Arial">` +
`<text x="${ox10 - 33.33}" y="${oy10 + 15}">-1</text><text x="${ox10 - 2 * 33.33}" y="${oy10 + 15}">-2</text><text x="${ox10 - 3 * 33.33}" y="${oy10 + 15}">-3</text><text x="${ox10 - 4 * 33.33}" y="${oy10 + 15}">-4</text><text x="${ox10 - 5 * 33.33}" y="${oy10 + 15}">-5</text><text x="${ox10 - 6 * 33.33}" y="${oy10 + 15}">-6</text><text x="${ox10 - 7 * 33.33}" y="${oy10 + 15}">-7</text><text x="${ox10 - 8 * 33.33}" y="${oy10 + 15}">-8</text><text x="${ox10 - 9 * 33.33}" y="${oy10 + 15}">-9</text><text x="${ox10 - 10 * 33.33}" y="${oy10 + 15}">-10</text><text x="${ox10 - 11 * 33.33}" y="${oy10 + 15}">-11</text><text x="${ox10 - 12 * 33.33}" y="${oy10 + 15}">-12</text><text x="${ox10 - 13 * 33.33}" y="${oy10 + 15}">-13</text><text x="${ox10 - 14 * 33.33}" y="${oy10 + 15}">-14</text><text x="${ox10 - 15 * 33.33}" y="${oy10 + 15}">-15</text><text x="${ox10 - 16 * 33.33}" y="${oy10 + 15}">-16</text><text x="${ox10 - 17 * 33.33}" y="${oy10 + 15}">-17</text>` +
`</g><g font-size="9" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox10 - 5}" y="${oy10 - 4 * 40 + 4}">4</text><text x="${ox10 - 5}" y="${oy10 - 8 * 40 + 4}">6</text>` +
`<text x="${ox10 - 5}" y="${oy10 + 4 * 40 + 4}">-2</text><text x="${ox10 - 5}" y="${oy10 + 8 * 40 + 4}">-4</text>` +
`</g>` +
// Line AB
`<line x1="${ox10 + 3 * 33.33}" y1="${oy10 - (-4) * 40}" x2="${ox10 - 17 * 33.33}" y2="${oy10 - 6 * 40}" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6,4" opacity="0.5"/>` +
// Point A(3,-4)
`<circle cx="${ox10 + 3 * 33.33}" cy="${oy10 + 4 * 40}" r="4" fill="#2563EB"/><text x="${ox10 + 3 * 33.33 + 6}" y="${oy10 + 4 * 40 + 4}" font-size="10" fill="#2563EB" font-weight="bold" font-family="serif">A(3,-4)</text>` +
// Point M(-7,1) - the midpoint
`<circle cx="${ox10 - 7 * 33.33}" cy="${oy10 - 1 * 40}" r="5" fill="#e74c3c"/><text x="${ox10 - 7 * 33.33 - 8}" y="${oy10 - 1 * 40 - 8}" font-size="10" fill="#e74c3c" font-weight="bold" font-family="serif">M(-7,1)</text>` +
// Point B(-17,6)
`<circle cx="${ox10 - 17 * 33.33}" cy="${oy10 - 6 * 40}" r="4" fill="#2563EB"/><text x="${ox10 - 17 * 33.33 - 10}" y="${oy10 - 6 * 40 - 8}" font-size="10" fill="#2563EB" font-weight="bold" font-family="serif">B(-17,6)</text>` +
// Midpoint marker
`<rect x="${ox10 - 7 * 33.33 - 6}" y="${oy10 - 1 * 40 - 6}" width="12" height="12" stroke="#e74c3c" stroke-width="1.5" fill="none"/>` +
`<text x="${ox10 - 7 * 33.33}" y="${oy10 - 1 * 40 + 24}" font-size="9" fill="#e74c3c" font-family="Arial" text-anchor="middle">Midpoint</text>`;

const svgQ10 = svgHeader(250, 100) + midGrid + svgFooter();

ec.questions[9].diagram = {
  type: 'svg',
  content: svgQ10,
  caption: 'Midpoint M(-7,1) of segment AB where A(3,-4) and B(-17,6). Verified: ((-17+3)/2, (6+(-4))/2) = (-7, 1).'
};
console.log('✅ Added midpoint diagram to EC Q10');

// Q11: Trisection - A(4,7), P(8,4), Q(12,1), B(16,-2)
const ox11 = 60, oy11 = 200;
const triSecGrid = gridLines(ox11, oy11, 4, 17, -3, 8) +
axes(ox11, oy11, 17, 8) +
tickLabelsX(ox11, oy11, 4, 17) +
tickLabelsY(ox11, oy11, -3, 8) +
originLabel(ox11, oy11) +
// Additional tick labels
`<g font-size="10" fill="#666" text-anchor="end" font-family="Arial">` +
`<text x="${ox11 - 6}" y="${oy11 + 4 * 40 + 4}">-2</text><text x="${ox11 - 6}" y="${oy11 + 8 * 40 + 4}">-3</text>` +
`</g>` +
// Line AB
`<line x1="${ox11 + 4 * 33.33}" y1="${oy11 - 7 * 40}" x2="${ox11 + 16 * 33.33}" y2="${oy11 + 2 * 40}" stroke="#2563EB" stroke-width="2.5"/>` +
// Point A(4,7)
`<circle cx="${ox11 + 4 * 33.33}" cy="${oy11 - 7 * 40}" r="4" fill="#e74c3c"/><text x="${ox11 + 4 * 33.33 - 8}" y="${oy11 - 7 * 40 - 8}" font-size="10" fill="#e74c3c" font-weight="bold" font-family="serif">A(4,7)</text>` +
// Point P(8,4)
`<circle cx="${ox11 + 8 * 33.33}" cy="${oy11 - 4 * 40}" r="4" fill="#2563EB"/><text x="${ox11 + 8 * 33.33 + 6}" y="${oy11 - 4 * 40 + 4}" font-size="10" fill="#2563EB" font-weight="bold" font-family="serif">P(8,4)</text>` +
// Point Q(12,1)
`<circle cx="${ox11 + 12 * 33.33}" cy="${oy11 - 1 * 40}" r="4" fill="#2563EB"/><text x="${ox11 + 12 * 33.33 + 6}" y="${oy11 - 1 * 40 + 4}" font-size="10" fill="#2563EB" font-weight="bold" font-family="serif">Q(12,1)</text>` +
// Point B(16,-2)
`<circle cx="${ox11 + 16 * 33.33}" cy="${oy11 + 2 * 40}" r="4" fill="#e74c3c"/><text x="${ox11 + 16 * 33.33 + 6}" y="${oy11 + 2 * 40 + 4}" font-size="10" fill="#e74c3c" font-weight="bold" font-family="serif">B(16,-2)</text>` +
// Equal segment markers (tick marks on the line)
// AP segment ≈ from (4,7) to (8,4)
`<line x1="${ox11 + 5.5 * 33.33}" y1="${oy11 - 5.5 * 40 - 6}" x2="${ox11 + 5.5 * 33.33 + 6}" y2="${oy11 - 5.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
`<line x1="${ox11 + 5.5 * 33.33 + 2}" y1="${oy11 - 5.5 * 40 - 6}" x2="${ox11 + 5.5 * 33.33 + 8}" y2="${oy11 - 5.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
// PQ segment
`<line x1="${ox11 + 10 * 33.33}" y1="${oy11 - 2.5 * 40 - 6}" x2="${ox11 + 10 * 33.33 + 6}" y2="${oy11 - 2.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
`<line x1="${ox11 + 10 * 33.33 + 2}" y1="${oy11 - 2.5 * 40 - 6}" x2="${ox11 + 10 * 33.33 + 8}" y2="${oy11 - 2.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
// QB segment
`<line x1="${ox11 + 14 * 33.33}" y1="${oy11 + 0.5 * 40 - 6}" x2="${ox11 + 14 * 33.33 + 6}" y2="${oy11 + 0.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
`<line x1="${ox11 + 14 * 33.33 + 2}" y1="${oy11 + 0.5 * 40 - 6}" x2="${ox11 + 14 * 33.33 + 8}" y2="${oy11 + 0.5 * 40}" stroke="#2563EB" stroke-width="1.5"/>` +
// Segment labels
`<text x="${ox11 + 6 * 33.33}" y="${oy11 - 5.5 * 40 - 10}" font-size="9" fill="#2563EB" font-family="Arial">AP=5</text>` +
`<text x="${ox11 + 10 * 33.33}" y="${oy11 - 2.5 * 40 - 10}" font-size="9" fill="#2563EB" font-family="Arial">PQ=5</text>` +
`<text x="${ox11 + 14 * 33.33}" y="${oy11 + 0.5 * 40 - 10}" font-size="9" fill="#2563EB" font-family="Arial">QB=5</text>`;

const svgQ11 = svgHeader(30, 30) + triSecGrid + svgFooter();

ec.questions[10].diagram = {
  type: 'svg',
  content: svgQ11,
  caption: 'Trisection of AB: A(4,7), P(8,4), Q(12,1), B(16,-2) with AP = PQ = QB = 5 units. P and Q divide AB into three equal parts.'
};
console.log('✅ Added trisection diagram to EC Q11');

// Write end-of-chapter.json
fs.writeFileSync(path.join(BASE, 'end-of-chapter.json'), JSON.stringify(ec, null, 2), 'utf8');
console.log('✅ Updated end-of-chapter.json');
console.log('🎉 All diagrams added successfully!');