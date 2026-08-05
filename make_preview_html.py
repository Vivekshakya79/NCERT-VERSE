#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build a self-contained preview.html embedding all solution SVGs for browser checks."""
import json
import os

BASE = os.path.join("src", "data", "solutions", "class-9", "Mathematics", "chapter-0")
files = ["exercise-set-1.1.json", "exercise-set-1.2.json", "end-of-chapter.json"]

items = []
for f in files:
    with open(os.path.join(BASE, f), encoding="utf-8") as fh:
        data = json.load(fh)
    for q in data.get("questions", []):
        if "diagram" in q:
            items.append((q["id"], q["diagram"].get("caption", ""), q["diagram"]["content"]))

html = [
    "<!doctype html><html><head><meta charset=utf-8><title>Diagram Preview</title><style>",
    "body{font-family:sans-serif;background:#0f172a;margin:0;padding:20px}",
    "h2{color:#cbd5e1;font-size:15px}",
    "figure{background:#fff;border-radius:12px;padding:14px;margin:14px 0;max-width:820px}",
    "figcaption{font-size:12px;color:#475569;margin-top:8px}",
    ".dia svg{display:block;width:100%;height:auto}",
    "</style></head><body>",
]
for qid, capt, content in items:
    html.append(f'<h2>{qid}</h2><figure><div class="dia" data-id="{qid}">{content}</div>'
                f'<figcaption>{capt}</figcaption></figure>')
html.append(
    "<script>"
    "const svgs=[...document.querySelectorAll('.dia svg')];"
    "window.__svgs=svgs.map(s=>{"
    "const r=s.getBoundingClientRect();"
    "return {id:s.closest('.dia').dataset.id,vb:s.getAttribute('viewBox'),"
    "clientW:s.clientWidth,clientH:s.clientHeight,w:Math.round(r.width),h:Math.round(r.height)};"
    "});"
    "console.log(JSON.stringify(window.__svgs,null,1));"
    "</script></body></html>"
)
os.makedirs("diagram_previews", exist_ok=True)
out = os.path.join("diagram_previews", "preview.html")
with open(out, "w", encoding="utf-8") as fh:
    fh.write("\n".join(html))
print(f"preview.html written with {len(items)} diagrams")
