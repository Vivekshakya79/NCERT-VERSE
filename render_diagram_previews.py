#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render every solution SVG diagram to a PNG preview using PyMuPDF (fitz)."""
import json
import os

import fitz

BASE = os.path.join("src", "data", "solutions", "class-9", "Mathematics", "chapter-0")
OUT = os.path.join("diagram_previews")
os.makedirs(OUT, exist_ok=True)

files = ["exercise-set-1.1.json", "exercise-set-1.2.json", "end-of-chapter.json"]
count = 0
for f in files:
    with open(os.path.join(BASE, f), encoding="utf-8") as fh:
        data = json.load(fh)
    for q in data.get("questions", []):
        if "diagram" not in q:
            continue
        content = q["diagram"]["content"]
        qid = q["id"]
        try:
            doc = fitz.open(stream=content.encode("utf-8"), filetype="svg")
            page = doc[0]
            # Render at 2x for clarity
            mat = fitz.Matrix(2, 2)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            out_path = os.path.join(OUT, f"{qid}.png")
            pix.save(out_path)
            print(f"  ✓ {qid}  {pix.width}x{pix.height}  -> {out_path}")
            count += 1
            doc.close()
        except Exception as e:
            print(f"  ✗ {qid}: {e}")
print(f"Rendered {count} previews to {OUT}")
