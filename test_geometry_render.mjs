#!/usr/bin/env node
/**
 * test_geometry_render.js
 * =======================
 * Renders every `geometry` diagram in the Class 9 solution JSON through the
 * REAL renderer (src/lib/geometry/render.ts) and validates the SVG output:
 *  - no renderer exceptions
 *  - valid SVG structure (starts with <svg, ends with </svg>)
 *  - contains <title> and <desc> (accessibility)
 *  - contains the expected points/labels
 *  - stage navigation data is present where defined
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderGeometrySvg, validateGeometryData } from "./src/lib/geometry/render.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, "src/data/solutions/class-9/Mathematics");
const FILES = [
  "chapter-5/exercise-set-5.1.json",
  "chapter-5/exercise-set-5.2.json",
  "chapter-5/exercise-set-5.3.json",
  "chapter-5/end-of-chapter.json",
];

let errors = 0;
let total = 0;

for (const file of FILES) {
  const data = JSON.parse(fs.readFileSync(path.join(BASE, file), "utf8"));
  for (const q of data.questions || []) {
    const d = q.diagram;
    if (!d || d.type !== "geometry") continue;
    total++;
    const tag = `${file} Q${q.questionNumber}`;
    try {
      const g = d.geometry;
      const errs = validateGeometryData(g);
      if (errs.length) {
        errors++;
        console.log(`✗ ${tag}: validation errors: ${errs.join("; ")}`);
        continue;
      }
      const svg = renderGeometrySvg(g);
      if (!svg.startsWith("<svg") || !svg.trimEnd().endsWith("</svg>")) {
        errors++;
        console.log(`✗ ${tag}: output is not a complete SVG`);
        continue;
      }
      if (!svg.includes("<title") || !svg.includes("<desc")) {
        errors++;
        console.log(`✗ ${tag}: missing <title>/<desc> (accessibility)`);
        continue;
      }
      // every labelled point should appear in the SVG
      const missing = (g.points || [])
        .filter((p) => p.showLabel !== false && (p.label || p.id))
        .map((p) => p.label || p.id)
        .filter((l) => !svg.includes(`>${l}<`));
      if (missing.length) {
        errors++;
        console.log(`✗ ${tag}: labels missing from SVG: ${missing.join(", ")}`);
        continue;
      }
      // stages present?
      if (d.stages && d.stages.length) {
        if (d.stages.some((s) => !s.data || !s.label)) {
          errors++;
          console.log(`✗ ${tag}: stage missing label/data`);
          continue;
        }
      }
      console.log(`✓ ${tag}: SVG rendered (${svg.length} chars, ${(g.points || []).length} pts)`);
    } catch (e) {
      errors++;
      console.log(`✗ ${tag}: EXCEPTION ${e.message}`);
    }
  }
}

console.log(`\n${errors === 0 ? "ALL RENDER TESTS PASSED" : errors + " ERROR(S)"} (${total} diagrams)`);
process.exit(errors === 0 ? 0 : 1);