#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_complex_diagrams.py
=======================
Regenerate all NCERT solution diagrams for Ganita Manjari Class 9 Chapter 1
("Orienting Yourself: The Use of Coordinates") with rich, complex SVG content.

Recreates the figures from the actual NCERT textbook, with:
  - subtle gradient backgrounds + drop shadow
  - quadrant shading, minor/major grid lines
  - thick axes with arrowheads and serif labels
  - colored points with white stroke rings
  - dimension annotations, right-angle markers, door-swing arcs
  - legend boxes, furniture in floor plans, scale indicators

Output: writes new `diagram.content` strings into the 3 JSON data files:
  exercise-set-1.1.json (4 diagrams)
  exercise-set-1.2.json (4 diagrams)
  end-of-chapter.json    (8 diagrams)
"""
import json
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, "src", "data", "solutions", "class-9", "Mathematics", "chapter-0")

# ============================================================
# Colour palette
# ============================================================
BLUE    = "#2563EB"
RED     = "#DC2626"
GREEN   = "#16A34A"
AMBER   = "#F59E0B"
PURPLE  = "#8B5CF6"
CYAN    = "#06B6D4"
PINK    = "#DB2777"
DARK    = "#1E293B"
SLATE   = "#475569"
GRAY    = "#94A3B8"
AXIS    = "#334155"
WALL    = "#0F172A"
WOOD    = "#B45309"
TILE    = "#64748B"

SANS  = "system-ui, 'Segoe UI', Arial, sans-serif"
SERIF = "Georgia, 'Times New Roman', serif"

# ============================================================
# Low-level SVG helpers
# ============================================================
def esc(s: str) -> str:
    """Escape XML-sensitive characters in text content."""
    return (str(s)
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;"))

def t(x, y, text, size=13, fill=DARK, anchor="start", weight="normal",
      family=SANS, italic=False, spacing=None, opacity=1.0):
    """Emit an SVG <text> element."""
    style = f"font-family:{family};font-weight:{weight};"
    if italic:
        style += "font-style:italic;"
    if spacing:
        style += f"letter-spacing:{spacing};"
    return (f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" style="{style}" opacity="{opacity}">{esc(text)}</text>')

def tspan(x, y, text, size=13, fill=DARK, anchor="start", weight="normal",
          family=SANS, italic=False):
    style = f"font-family:{family};font-weight:{weight};"
    if italic:
        style += "font-style:italic;"
    return (f'<tspan x="{x}" y="{y}" font-size="{size}" fill="{fill}" '
            f'text-anchor="{anchor}" style="{style}">{esc(text)}</tspan>')

def line(x1, y1, x2, y2, stroke=DARK, sw=2, dash=None, opacity=1.0, cap="round",
         marker_end=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = f' marker-end="{marker_end}"' if marker_end else ""
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="{cap}"{d}{m} opacity="{opacity}"/>')

def rect(x, y, w, h, fill="none", stroke=None, sw=1.5, rx=0, opacity=1.0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" '
            f'fill="{fill}"{s}{d} opacity="{opacity}"/>')

def circle(cx, cy, r, fill, stroke=None, sw=0, opacity=1.0):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{s} opacity="{opacity}"/>')

def poly(points, fill="none", stroke=None, sw=2, opacity=1.0, dash=None):
    """points: list of (x, y)."""
    pts = " ".join(f"{x},{y}" for x, y in points)
    d = f' stroke-dasharray="{dash}"' if dash else ""
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return (f'<polygon points="{pts}" fill="{fill}"{s}{d} opacity="{opacity}"/>')

def path(d, stroke=DARK, sw=2, fill="none", dash=None, opacity=1.0):
    dd = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<path d="{d}" fill="{fill}" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{dd} opacity="{opacity}"/>')

def arc(cx, cy, r, a0, a1, stroke=DARK, sw=2, dash=None, opacity=1.0):
    """Circular arc from angle a0 to a1 (degrees, 0 = +x, CCW in math terms)."""
    def pt(ang):
        rad = math.radians(ang)
        return cx + r * math.cos(rad), cy - r * math.sin(rad)
    x0, y0 = pt(a0)
    x1, y1 = pt(a1)
    large = 1 if (a1 - a0) % 360 > 180 else 0
    sweep = 1 if (a1 - a0) > 0 else 0
    d = f'M {x0:.2f} {y0:.2f} A {r} {r} 0 {large} {sweep} {x1:.2f} {y1:.2f}'
    return path(d, stroke=stroke, sw=sw, dash=dash, opacity=opacity)

def arrow_marker(mid, color=AXIS):
    return (f'<marker id="{mid}" markerWidth="11" markerHeight="11" refX="9" refY="4.5" '
            f'orient="auto-start-reverse"><path d="M0,0 L9,4.5 L0,9 L2.4,4.5 Z" '
            f'fill="{color}"/></marker>')

def svg_open(w, h, marker_id=None):
    """Standard svg open with gradient background + drop shadow."""
    defs = []
    defs.append(
        '<defs>'
        f'<linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0%" stop-color="#ffffff"/>'
        '<stop offset="100%" stop-color="#eef2f7"/>'
        '</linearGradient>'
        '<filter id="ds" x="-5%" y="-5%" width="112%" height="114%">'
        '<feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.10"/>'
        '</filter>'
    )
    if marker_id:
        defs.append(arrow_marker(marker_id, AXIS))
    defs.append('</defs>')
    body = (
        f'<rect x="4" y="4" width="{w-8}" height="{h-8}" rx="14" fill="url(#bgGrad)" filter="url(#ds)"/>'
    )
    return (f'<svg viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">'
            f'{"".join(defs)}{body}')

def svg_close():
    return '</svg>'

def grid(ox, oy, u, xmin, xmax, ymin, ymax, major_every=5):
    """Light grid lines (px spacing = u). Returns SVG fragment (minor+major)."""
    out = []
    # vertical lines
    for i in range(int(math.ceil(xmin)), int(math.floor(xmax)) + 1):
        px = ox + i * u
        if i % major_every == 0:
            out.append(line(px, oy + ymin * u, px, oy + ymax * u, stroke="#cbd5e1", sw=1))
        else:
            out.append(line(px, oy + ymin * u, px, oy + ymax * u, stroke="#e2e8f0", sw=0.6))
    # horizontal lines
    for j in range(int(math.ceil(ymin)), int(math.floor(ymax)) + 1):
        py = oy - j * u
        if j % major_every == 0:
            out.append(line(ox + xmin * u, py, ox + xmax * u, py, stroke="#cbd5e1", sw=1))
        else:
            out.append(line(ox + xmin * u, py, ox + xmax * u, py, stroke="#e2e8f0", sw=0.6))
    return "".join(out)

def quadrant_shades(ox, oy, u, xmin, xmax, ymin, ymax, alpha=0.055):
    """Subtle coloured quadrant backgrounds."""
    # For each quadrant within the grid bounds, draw a tinted rect.
    # Quadrant I: x>=0, y>=0 ; II: x<=0,y>=0 ; III: x<=0,y<=0 ; IV: x>=0,y<=0
    qs = [
        (0, 0, xmax, ymax, "#2563EB"),   # I blue
        (xmin, 0, 0, ymax, "#F59E0B"),   # II amber
        (xmin, ymin, 0, 0, "#DC2626"),   # III red
        (0, ymin, xmax, 0, "#16A34A"),   # IV green
    ]
    out = []
    for x0, y0, x1, y1, col in qs:
        if x1 <= x0 or y1 <= y0:
            continue
        px = ox + x0 * u
        py = oy - y1 * u
        pw = (x1 - x0) * u
        ph = (y1 - y0) * u
        # hex to rgba
        r = int(col[1:3], 16); g = int(col[3:5], 16); b = int(col[5:7], 16)
        out.append(f'<rect x="{px:.1f}" y="{py:.1f}" width="{pw:.1f}" height="{ph:.1f}" '
                   f'fill="rgba({r},{g},{b},{alpha})"/>')
    return "".join(out)

def axes(ox, oy, u, xmin, xmax, ymin, ymax, marker="arr", labels=("x", "y")):
    """Thick axes with arrowheads + serif labels. Returns fragment."""
    out = []
    out.append(line(ox + xmin * u, oy, ox + xmax * u, oy,
                    stroke=AXIS, sw=2.2, marker_end=f"url(#{marker})"))
    out.append(line(ox, oy - ymax * u, ox, oy + ymin * u,
                    stroke=AXIS, sw=2.2, marker_end=f"url(#{marker})"))
    # axis labels (slightly beyond arrow)
    out.append(t(ox + (xmax + 1.2) * u, oy + 4, labels[0], 17, AXIS, "middle", "bold", SERIF, True))
    out.append(t(ox - 4, oy - (ymax + 1.2) * u, labels[1], 17, AXIS, "middle", "bold", SERIF, True))
    # origin label
    out.append(t(ox - 8, oy + 18, "O", 14, AXIS, "middle", "bold", SERIF, True))
    return "".join(out)

def ticks(ox, oy, u, xmin, xmax, ymin, ymax, step=1, skip=0):
    """Tick marks with numeric labels along both axes (labels skip `skip` values)."""
    out = []
    for i in range(int(math.ceil(xmin)), int(math.floor(xmax)) + 1):
        if i == 0 or (skip and i % skip == 0):
            continue
        px = ox + i * u
        out.append(line(px, oy - 4, px, oy + 4, stroke=AXIS, sw=1.6))
        out.append(t(px, oy + 20, str(i), 12, SLATE, "middle"))
    for j in range(int(math.ceil(ymin)), int(math.floor(ymax)) + 1):
        if j == 0 or (skip and j % skip == 0):
            continue
        py = oy - j * u
        out.append(line(ox - 4, py, ox + 4, py, stroke=AXIS, sw=1.6))
        out.append(t(ox - 10, py + 4, str(j), 12, SLATE, "end"))
    return "".join(out)

def point_px(px, py, label, color, dx=10, dy=-12, r=5.5, lsize=14, anchor="start",
             bold=True, lcolor=None, ring=2.2):
    """Point circle + label at pixel coords."""
    out = []
    out.append(circle(px, py, r, color, stroke="#ffffff", sw=ring))
    out.append(circle(px, py, r + 2, "none", stroke=color, sw=1.0, opacity=0.55))
    out.append(t(px + dx, py + dy, label, lsize, lcolor or color, anchor, "bold" if bold else "normal", SERIF))
    return "".join(out)

def point_coord(x, y, label, color, ox, oy, u, dx=10, dy=-12, r=5.5, lsize=14,
                anchor="start", bold=True, lcolor=None):
    """Point circle + label at data coords (x, y)."""
    px, py = ox + x * u, oy - y * u
    return point_px(px, py, label, color, dx, dy, r, lsize, anchor, bold, lcolor)

def right_angle_px(cx, cy, size=14, stroke=DARK, sw=2):
    """Small right-angle square marker with corner at (cx, cy)."""
    return poly([(cx, cy), (cx + size, cy), (cx + size, cy + size), (cx, cy + size)],
                fill="none", stroke=stroke, sw=sw)

def dimension_h(px1, px2, py, text, color=SLATE, label_dy=-6, label_size=12, off=0):
    """Horizontal dimension line with arrows between two x positions."""
    out = []
    if off:
        py1, py2 = py, py
    out.append(line(px1, py - off, px2, py - off, stroke=color, sw=1.2))
    out.append(line(px1, py - off - 4, px1, py - off + 4, stroke=color, sw=1.2))
    out.append(line(px2, py - off - 4, px2, py - off + 4, stroke=color, sw=1.2))
    out.append(t((px1 + px2) / 2, py - off + label_dy, text, label_size, color, "middle"))
    return "".join(out)

def dimension_v(px, py1, py2, text, color=SLATE, label_dx=-6, label_size=12):
    """Vertical dimension line with arrows between two y positions."""
    out = []
    out.append(line(px, py1, px, py2, stroke=color, sw=1.2))
    out.append(line(px - 4, py1, px + 4, py1, stroke=color, sw=1.2))
    out.append(line(px - 4, py2, px + 4, py2, stroke=color, sw=1.2))
    out.append(t(px - 8, (py1 + py2) / 2 + 4, text, label_size, color, "end"))
    return "".join(out)

def legend_panel(x, y, items, w=210):
    """items: list of (colour, text, sw). Draws a rounded legend box."""
    row_h = 22
    h = 20 + len(items) * row_h
    out = [rect(x, y, w, h, fill="#ffffff", stroke="#cbd5e1", sw=1, rx=8, opacity=0.95)]
    out.append(t(x + 12, y + 17, "Legend", 13, DARK, "start", "bold"))
    for i, (col, txt, sw) in enumerate(items):
        yy = y + 34 + i * row_h
        out.append(line(x + 12, yy, x + 38, yy, stroke=col, sw=sw or 3))
        out.append(t(x + 46, yy + 5, txt, 12.5, SLATE))
    return "".join(out)

def title_bar(text, x, y, size=15, color=DARK):
    return t(x, y, text, size, color, "middle", "bold")

def fmt(n):
    """Format number trimming trailing .0"""
    if float(n) == int(n):
        return str(int(n))
    return f"{n:g}"

# ============================================================
# Helper: generic coordinate-plane diagram
# ============================================================
def coord_plane(ox, oy, u, xmin, xmax, ymin, ymax, body_fn, w, h,
                shade=True, grid_on=True, ticks_on=True, xlabel="x", ylabel="y",
                major_every=5, skip=0, marker="arr"):
    """Compose a standard coordinate plane and call body_fn to draw overlays."""
    frag = []
    frag.append(rect(0, 0, w, h, fill="none"))  # clip-ish
    if grid_on:
        frag.append(grid(ox, oy, u, xmin, xmax, ymin, ymax, major_every))
    if shade:
        frag.append(quadrant_shades(ox, oy, u, xmin, xmax, ymin, ymax))
    frag.append(axes(ox, oy, u, xmin, xmax, ymin, ymax, marker, (xlabel, ylabel)))
    if ticks_on:
        frag.append(ticks(ox, oy, u, xmin, xmax, ymin, ymax, skip=skip))
    frag.append(body_fn(ox, oy, u))
    return "".join(frag)

# ============================================================
#  FIG 1.3 — Reiaan's room floor plan  (exercise-set-1.1 Q1-Q4)
# ============================================================
# Mapping: room 12ft x 6ft; scale s px per foot; origin O at (ox, oy) [oy = baseline]
S = 40.0
OX, OY = 150.0, 384.0
CW, CH = 12.0 * S, 6.0 * S   # room pixel w/h

def fx(x): return OX + x * S
def fy(y): return OY - y * S

def room_plan_svg(emph="all"):
    """The shared rich floor-plan SVG for Fig 1.3. `emph` toggles highlight layers."""
    W, H = 700, 510
    o = [svg_open(W, H)]
    o.append(t(350, 34, "Fig 1.3  —  Reiaan's room (floor plan, 12 ft × 6 ft)",
               16, DARK, "middle", "bold", SERIF))

    # ── floor interior ──
    o.append(rect(fx(0), fy(6), CW, CH, fill="#FFF7ED", stroke="none", rx=2))
    # subtle floor tile grid (every 1 ft)
    for i in range(1, 12):
        o.append(line(fx(i), fy(6), fx(i), fy(0), stroke="#FDE6C8", sw=0.7))
    for j in range(1, 6):
        o.append(line(fx(0), fy(j), fx(12), fy(j), stroke="#FDE6C8", sw=0.7))

    # ── walls (thick, with a soft outer shadow line) ──
    walls = [(fx(0), fy(0), fx(12), fy(0)),   # bottom  OC
             (fx(0), fy(6), fx(12), fy(6)),   # top     AB
             (fx(0), fy(0), fx(0), fy(6)),    # left    OA
             (fx(12), fy(0), fx(12), fy(6))]  # right   CB
    for (x1, y1, x2, y2) in walls:
        o.append(line(x1, y1, x2, y2, stroke="#94a3b8", sw=7, opacity=0.35))
    # door gap on bottom wall (D1-R1)
    d1x, r1x = fx(8.5), fx(11.5)
    b1y, b2y = fy(1.5), fy(4.0)
    # draw wall segments leaving gaps
    o.append(line(fx(0), fy(0), d1x, fy(0), stroke=WALL, sw=6))          # O-D1
    o.append(line(r1x, fy(0), fx(12), fy(0), stroke=WALL, sw=6))         # R1-C
    o.append(line(fx(0), fy(6), fx(12), fy(6), stroke=WALL, sw=6))       # A-B top
    o.append(line(fx(0), fy(0), fx(0), b1y, stroke=WALL, sw=6))          # O-B1
    o.append(line(fx(0), b2y, fx(0), fy(6), stroke=WALL, sw=6))          # B2-A
    o.append(line(fx(12), fy(0), fx(12), fy(6), stroke=WALL, sw=6))      # C-B right

    # ── room door D1-R1 (3 ft) with swing arc ──
    door_stroke = AMBER
    o.append(line(d1x, fy(0), r1x, fy(0), stroke="#fff", sw=8))          # erase gap highlight
    o.append(line(d1x, fy(0), r1x, fy(0), stroke=door_stroke, sw=4, dash="7,5"))
    # door leaf (swings into room)
    leaf_end = (fx(8.5 + 3.0), fy(3.0))   # hinge at D1, leaf 3ft long
    o.append(line(d1x, fy(0), fx(11.5), fy(3.0), stroke=door_stroke, sw=3))
    o.append(arc(d1x, fy(0), 3.0 * S, 0, 45, stroke=door_stroke, sw=1.6, dash="5,4"))
    # labels
    o.append(t((d1x + r1x) / 2, fy(0) + 26, "Room door", 12, "#B45309", "middle", "bold"))
    o.append(t((d1x + r1x) / 2, fy(0) + 41, "3 ft", 12, "#B45309", "middle"))
    # D1 & R1 labels on the wall
    o.append(point_px(d1x, fy(0), "D₁ (8.5, 0)", BLUE, 6, 16, r=4.5))
    o.append(point_px(r1x, fy(0), "R₁ (11.5, 0)", BLUE, 6, 28, r=4.5))

    # ── bathroom door B1-B2 (2.5 ft) with swing arc ──
    bath = GREEN
    o.append(line(fx(0), b1y, fx(0), b2y, stroke=bath, sw=4, dash="7,5"))
    # leaf swings into room from hinge B1 (0,1.5) length 2.5
    o.append(line(fx(0), b1y, fx(2.5), b1y, stroke=bath, sw=3))
    o.append(arc(fx(0), b1y, 2.5 * S, -90, 0, stroke=bath, sw=1.6, dash="5,4"))
    o.append(t(fx(0) - 12, (b1y + b2y) / 2, "Bathroom door", 12, "#15803D", "end"))
    o.append(t(fx(0) - 12, (b1y + b2y) / 2 + 15, "2.5 ft", 12, "#15803D", "end"))
    o.append(point_px(fx(0), b1y, "B₁ (0, 1.5)", RED, 10, 14, r=4.5))
    o.append(point_px(fx(0), b2y, "B₂ (0, 4)", RED, -10, -10, r=4.5))

    # ── window on top wall ──
    wx1, wx2 = fx(2), fx(5)
    o.append(line(wx1, fy(6) - 2, wx2, fy(6) - 2, stroke=CYAN, sw=2))
    o.append(line(wx1, fy(6) + 2, wx2, fy(6) + 2, stroke=CYAN, sw=2))
    o.append(t((wx1 + wx2) / 2, fy(6) - 10, "Window", 11, "#0E7490", "middle"))

    # ── furniture ──
    # Study table (3 x 2 ft) near room door
    tab = poly([(fx(8), fy(2)), (fx(11), fy(2)), (fx(11), fy(4)), (fx(8), fy(4))],
               fill="#FDE68A", stroke=WOOD, sw=2, opacity=0.9)
    o.append(tab)
    o.append(t((fx(8) + fx(11)) / 2, (fy(2) + fy(4)) / 2, "Study table", 12, "#92400E", "middle", "bold"))
    o.append(t((fx(8) + fx(11)) / 2, (fy(2) + fy(4)) / 2 + 15, "3 ft × 2 ft", 11, "#92400E", "middle"))

    # Bed (6 x 2.5 ft) along the top wall
    bed = poly([(fx(1), fy(3.5)), (fx(7), fy(3.5)), (fx(7), fy(6)), (fx(1), fy(6))],
               fill="#DBEAFE", stroke=BLUE, sw=2, opacity=0.85)
    o.append(bed)
    o.append(line(fx(1), fy(4.75), fx(7), fy(4.75), stroke="#93C5FD", sw=1.2))
    o.append(t((fx(1) + fx(7)) / 2, fy(4.15), "Bed", 12, "#1E40AF", "middle", "bold"))

    # Wardrobe (2 x 1.2 ft) near bottom-left corner
    ward = poly([(fx(0.2), fy(1.2)), (fx(2.2), fy(1.2)), (fx(2.2), fy(0)), (fx(0.2), fy(0))],
                fill="#E9D5FF", stroke=PURPLE, sw=2, opacity=0.85)
    o.append(ward)
    o.append(line((fx(0.2) + fx(2.2)) / 2, fy(1.2), (fx(0.2) + fx(2.2)) / 2, fy(0), stroke="#C4B5FD", sw=1.2))
    o.append(t((fx(0.2) + fx(2.2)) / 2, fy(0.6) + 5, "Wardrobe", 11, "#5B21B6", "middle", "bold"))

    # ── corner labels ──
    o.append(point_px(fx(0), fy(0), "O (0, 0)", BLUE, 8, 20, r=5))
    o.append(point_px(fx(0), fy(6), "A (0, 6)", BLUE, 8, -12, r=5))
    o.append(point_px(fx(12), fy(6), "B (12, 6)", BLUE, -10, -12, r=5))
    o.append(point_px(fx(12), fy(0), "C (12, 0)", BLUE, -10, 20, r=5))

    # ── axis ruler along bottom (x) and left (y) ──
    for i in range(0, 13):
        px = fx(i)
        o.append(line(px, fy(0), px, fy(0) + 7, stroke=AXIS, sw=1.4))
        if i in (0, 3, 6, 9, 12):
            o.append(t(px, fy(0) + 22, str(i), 11, SLATE, "middle"))
    for j in range(1, 7):
        py = fy(j)
        o.append(line(fx(0), py, fx(0) - 7, py, stroke=AXIS, sw=1.4))
        if j in (1, 2, 3, 4, 5, 6):
            o.append(t(fx(0) - 14, py + 4, str(j), 11, SLATE, "end"))
    o.append(t(fx(6), fy(0) + 44, "x-axis (feet)", 12, AXIS, "middle", "bold", SERIF, True))
    o.append(t(fx(0) - 40, fy(3), "y-axis (feet)", 12, AXIS, "middle", "bold", SERIF, True))

    # ── overall room dimensions ──
    o.append(dimension_h(fx(0), fx(12), fy(0), "12 ft", WOOD, label_dy=-8, label_size=13, off=64))
    o.append(dimension_v(fx(12) + 16, fy(6), fy(0), "6 ft", WOOD, label_size=13))

    # ── emphasis overlays per question ──
    if emph == "q1":
        o.append(rect(fx(0), fy(6), CW, CH, fill="rgba(37,99,235,0.06)", stroke=BLUE, sw=2, dash="8,6"))
        o.append(t(350, 470, "●  Room floor OABC — corners labelled; door on x-axis from D₁ to R₁",
                   12.5, DARK, "middle"))
    elif emph == "q2":
        o.append(line(fx(8.5), fy(0) - 4, fx(8.5), fy(0) + 60, stroke=RED, sw=2.5, dash="6,5"))
        o.append(t(fx(8.5), fy(0) + 72, "D₁ (8.5, 0)", 13, RED, "middle", "bold"))
        o.append(rect(fx(7.4), fy(-1.4), 4.6 * S, 2.2 * S, fill="none", stroke=RED, sw=2, dash="6,5"))
    elif emph == "q3":
        o.append(rect(fx(8.5), fy(0), 3 * S, 0.1, fill="none", stroke=AMBER, sw=3, dash="6,5"))
        o.append(t((d1x + r1x) / 2, fy(0) + 66, "D₁R₁ = 3 ft  (door width)", 13, "#B45309", "middle", "bold"))
    elif emph == "q4":
        o.append(rect(fx(0), fy(4), 0.1, 2.5 * S, fill="none", stroke=GREEN, sw=3, dash="6,5"))
        o.append(t(fx(0) + 12, (b1y + b2y) / 2 + 34, "B₁B₂ = 2.5 ft  (bathroom door)", 13, "#15803D", "start", "bold"))

    # ── legend ──
    o.append(legend_panel(W - 240, H - 176, [
        ("#0F172A", "Wall", 6),
        (AMBER, "Room door + swing", 3),
        (GREEN, "Bathroom door", 3),
        (CYAN, "Window", 3),
        (WOOD, "Study table", 3),
        (BLUE, "Bed", 3),
        (PURPLE, "Wardrobe", 3),
    ], w=225))

    o.append(svg_close())
    return "".join(o)

# ============================================================
#  FIG 1.5 — house layout diagrams  (exercise-set-1.2 Q1-Q4)
# ============================================================
# Q1 — Study table on coordinate grid (feet at A(8,9), B(11,9), C(11,7), D(8,7))
def ex12_q1_svg():
    W, H = 640, 520
    ox, oy, u = 320.0, 200.0, 24.0
    o = [svg_open(W, H)]
    o.append(t(W / 2, 34, "Fig 1.5 — Study table in Reiaan's room (feet at A, B, C, D)",
               15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # table rectangle
    add(poly([(ox+8*u, oy-9*u), (ox+11*u, oy-9*u), (ox+11*u, oy-7*u), (ox+8*u, oy-7*u)],
             fill="#FDE68A", stroke=WOOD, sw=2.5, opacity=0.9))
    add(t(ox+9.5*u, oy-8*u+5, "Study table", 13, "#92400E", "middle", "bold"))
    add(t(ox+9.5*u, oy-8*u+21, "3 ft × 2 ft", 11.5, "#92400E", "middle"))
    # feet points
    add(point_coord(8, 9, "A (8, 9)", BLUE, ox, oy, u, 6, -14))
    add(point_coord(11, 9, "B (11, 9)", GREEN, ox, oy, u, 6, -14))
    add(point_coord(11, 7, "C (11, 7)", RED, ox, oy, u, 8, 22))
    add(point_coord(8, 7, "D (8, 7)", PURPLE, ox, oy, u, -10, 20))
    # side dimensions of table
    add(dimension_h(ox+8*u, ox+11*u, oy-7*u, "3 ft", "#92400E", label_dy=16, label_size=11, off=-16))
    add(dimension_v(ox+8*u, oy-9*u, oy-7*u, "2 ft", "#92400E", label_dx=-14, label_size=11))
    # faint house-room hint: rectangle border for the room (x from 4..12, y 4..11)
    add(rect(ox+4*u, oy-11*u, 8*u, 7*u, fill="none", stroke="#cbd5e1", sw=1.4, dash="7,5"))
    add(t(ox+8*u, oy-11.6*u, "Reiaan's room (faint outline)", 11, GRAY, "middle"))
    # room wall / doorway hint at bottom
    add(line(ox+4*u, oy, ox+8*u, oy, stroke="#94a3b8", sw=2.5))
    add(line(ox+11.5*u, oy, ox+12*u, oy, stroke="#94a3b8", sw=2.5))
    plane = coord_plane(ox, oy, u, -7, 13, -14, 12, lambda ox, oy, u: "".join(body), W, H,
                        shade=False, ticks_on=True, skip=0)
    o.append(plane)
    o.append(t(W/2, H-22, "Each unit = 1 ft · Origin O is the corner of the room",
               12, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q2 — Bathroom door swing + wardrobe
def ex12_q2_svg():
    W, H = 620, 470
    ox, oy, u = 230.0, 300.0, 30.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Fig 1.5 — Bathroom door swing (hinge at B₁)", 15, DARK, "middle", "bold", SERIF))
    # bathroom walls OFRP: O(0,0), F(0,4), R(5,4), P(5,0)
    pts = [(ox, oy), (ox, oy-4*u), (ox+5*u, oy-4*u), (ox+5*u, oy)]
    body = []
    def add(s): body.append(s)
    # bathroom floor
    add(poly(pts, fill="#ECFDF5", stroke="#0F172A", sw=3))
    add(t(ox+2.5*u, oy-2*u+5, "Bathroom", 13, "#065F46", "middle", "bold"))
    add(t(ox+2.5*u, oy-2*u+22, "5 ft × 4 ft", 11.5, "#065F46", "middle"))
    # door opening on left wall (x=0): gap B1(0,1.5)-B2(0,4)
    b1 = (ox, oy-1.5*u); b2 = (ox, oy-4*u)
    add(line(ox, oy, ox, oy-1.5*u, stroke=WALL, sw=4))       # wall below door
    # door leaf swinging into room: hinge B1, leaf length 2.5
    add(line(ox, oy-1.5*u, ox+2.5*u, oy-1.5*u, stroke=GREEN, sw=3))
    add(arc(ox, oy-1.5*u, 2.5*u, -90, 0, stroke=GREEN, sw=1.6, dash="5,4"))
    add(t(ox+2.5*u+8, oy-1.5*u+4, "Door swings on hinge B₁", 12, "#15803D", "start"))
    add(t(ox+2.5*u+8, oy-1.5*u+20, "(leaf = 2.5 ft)", 11.5, "#15803D", "start"))
    add(point_coord(0, 1.5, "B₁ (0, 1.5)", RED, ox, oy, u, 6, 16))
    add(point_coord(0, 4, "B₂ (0, 4)", RED, ox, oy, u, -12, -6))
    add(point_coord(0, 0, "O (0, 0)", BLUE, ox, oy, u, 6, 18))
    # wardrobe inside bathroom near top
    add(poly([(ox+3*u, oy-3.4*u), (ox+4.6*u, oy-3.4*u), (ox+4.6*u, oy-1.4*u), (ox+3*u, oy-1.4*u)],
             fill="#E9D5FF", stroke=PURPLE, sw=2, opacity=0.9))
    add(t(ox+3.8*u, oy-2.4*u+5, "Wardrobe", 11, "#5B21B6", "middle", "bold"))
    # washbasin + toilet quick hints
    add(poly([(ox+0.3*u, oy-0.3*u), (ox+2.3*u, oy-0.3*u), (ox+2.3*u, oy-1.1*u), (ox+0.3*u, oy-1.1*u)],
             fill="#FEF9C3", stroke="#A16207", sw=1.6, opacity=0.9))
    add(t(ox+1.3*u, oy-0.3*u+14, "Washbasin", 10.5, "#854D0E", "middle", "bold"))
    # shower area marker
    add(rect(ox+0.5*u, oy-4.4*u, 2*u, 2*u, fill="none", stroke="#38BDF8", sw=1.6, dash="5,4"))
    add(t(ox+1.5*u, oy-4.4*u+16, "Shower", 10.5, "#075985", "middle", "bold"))
    # corner labels
    add(point_coord(0, 4, "F (0, 4)", BLUE, ox, oy, u, 6, -12))
    add(point_coord(5, 4, "R (5, 4)", BLUE, ox, oy, u, 6, -12))
    add(point_coord(5, 0, "P (5, 0)", BLUE, ox, oy, u, 8, 20))
    # wall line on the right/bottom
    add(line(ox, oy, ox+5*u, oy, stroke=WALL, sw=4))
    add(line(ox+5*u, oy, ox+5*u, oy-4*u, stroke=WALL, sw=4))
    o.append("".join(body))
    o.append(legend_panel(W-250, H-150, [
        (GREEN, "Door leaf + swing arc", 3),
        (PURPLE, "Wardrobe", 3),
        ("#A16207", "Washbasin", 3),
        ("#38BDF8", "Shower area", 3),
    ], w=230))
    o.append(t(W/2, H-20, "Bathroom OFRP: O(0,0), F(0,4), R(5,4), P(5,0) · each unit = 1 ft",
               12, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q3 — Bathroom OFRP + SHWR shower + washbasin + toilet
def ex12_q3_svg():
    W, H = 620, 470
    ox, oy, u = 230.0, 300.0, 30.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Fig 1.5 — Bathroom fittings: OFRP, SHWR shower, washbasin & toilet",
               14.5, DARK, "middle", "bold", SERIF))
    pts = [(ox, oy), (ox, oy-4*u), (ox+5*u, oy-4*u), (ox+5*u, oy)]
    body = []
    def add(s): body.append(s)
    add(poly(pts, fill="#ECFDF5", stroke="#0F172A", sw=3))
    add(t(ox+2.5*u, oy-0.6*u, "O (0,0)", 11.5, BLUE, "middle", "bold"))
    # Shower area SHWR: rectangle at top (S,H top; W,R bottom)
    add(poly([(ox+0.4*u, oy-3.6*u), (ox+2.4*u, oy-3.6*u), (ox+2.4*u, oy-1.6*u), (ox+0.4*u, oy-1.6*u)],
             fill="#E0F2FE", stroke="#0EA5E9", sw=2, opacity=0.9))
    add(t(ox+1.4*u, oy-2.6*u+4, "SHWR", 12.5, "#075985", "middle", "bold"))
    add(t(ox+1.4*u, oy-2.6*u+19, "Shower area", 10.5, "#075985", "middle"))
    # washbasin 3x2 ft
    add(poly([(ox+2.8*u, oy-0.4*u), (ox+4.9*u, oy-0.4*u), (ox+4.9*u, oy-1.6*u), (ox+2.8*u, oy-1.6*u)],
             fill="#FEF9C3", stroke="#A16207", sw=2, opacity=0.9))
    add(t(ox+3.85*u, oy-1.0*u+4, "Washbasin", 11.5, "#854D0E", "middle", "bold"))
    add(t(ox+3.85*u, oy-1.0*u+19, "3 ft × 2 ft", 10.5, "#854D0E", "middle"))
    # toilet 2x3 ft (vertical)
    add(poly([(ox+0.3*u, oy-0.3*u), (ox+2.2*u, oy-0.3*u), (ox+2.2*u, oy-1.6*u), (ox+0.3*u, oy-1.6*u)],
             fill="#FEE2E2", stroke="#DC2626", sw=2, opacity=0.9))
    add(t(ox+1.25*u, oy-0.9*u+4, "Toilet", 11.5, "#991B1B", "middle", "bold"))
    add(t(ox+1.25*u, oy-0.9*u+19, "2 ft × 3 ft", 10.5, "#991B1B", "middle"))
    # corner labels
    add(point_coord(0, 0, "O", BLUE, ox, oy, u, 6, 18))
    add(point_coord(0, 4, "F (0, 4)", BLUE, ox, oy, u, 6, -12))
    add(point_coord(5, 4, "R (5, 4)", BLUE, ox, oy, u, 6, -12))
    add(point_coord(5, 0, "P (5, 0)", BLUE, ox, oy, u, 8, 20))
    add(line(ox, oy, ox+5*u, oy, stroke=WALL, sw=4))
    add(line(ox, oy, ox, oy-4*u, stroke=WALL, sw=4))
    add(line(ox, oy-4*u, ox+5*u, oy-4*u, stroke=WALL, sw=4))
    add(line(ox+5*u, oy, ox+5*u, oy-4*u, stroke=WALL, sw=4))
    o.append("".join(body))
    o.append(t(W/2, H-20, "Bathroom: 5 ft × 4 ft · Fittings inside as labelled (each unit = 1 ft)",
               12, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q4 — Dining room 18 x 15 ft with centred 5 x 3 ft table
def ex12_q4_svg():
    W, H = 660, 500
    ox, oy, u = 120.0, 420.0, 24.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Fig 1.5 — Dining room (18 ft × 15 ft) with centred table",
               15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # room
    add(poly([(ox, oy), (ox+18*u, oy), (ox+18*u, oy-15*u), (ox, oy-15*u)],
             fill="#FFFBEB", stroke="#0F172A", sw=3.5))
    # table centred: 5 x 3 ft
    tx0 = ox + (18-5)/2*u; ty1 = oy - (15-3)/2*u
    add(poly([(tx0, ty1), (tx0+5*u, ty1), (tx0+5*u, ty1+3*u), (tx0, ty1+3*u)],
             fill="#FDE68A", stroke=WOOD, sw=2.5))
    add(t(tx0+2.5*u, ty1+1.5*u+5, "Dining table", 13, "#92400E", "middle", "bold"))
    add(t(tx0+2.5*u, ty1+1.5*u+21, "5 ft × 3 ft", 11.5, "#92400E", "middle"))
    # 6 chairs around table
    chair_col = "#8B5CF6"
    chair_pts = [
        (tx0+2.5*u, ty1-8), (tx0+2.5*u, ty1+3*u+8),
        (tx0-8, ty1+1.5*u), (tx0+5*u+8, ty1+1.5*u),
        (tx0+1.2*u, ty1-8), (tx0+3.8*u, ty1-8),
    ]
    for (cx, cy) in chair_pts:
        add(circle(cx, cy, 7, "#EDE9FE", stroke=chair_col, sw=1.8))
    add(t(tx0+2.5*u+24, ty1-6, "chairs", 10.5, GRAY))
    # dimensions
    add(dimension_h(ox, ox+18*u, oy, "18 ft", WOOD, label_dy=-8, label_size=13, off=34))
    add(dimension_v(ox-16, oy-15*u, oy, "15 ft", WOOD, label_size=13))
    # door in bottom wall
    add(line(ox+8*u, oy, ox+11*u, oy, stroke="#fff", sw=8))
    add(line(ox+8*u, oy, ox+11*u, oy, stroke=AMBER, sw=3, dash="7,5"))
    add(t(ox+9.5*u, oy+20, "Door 3 ft", 11, "#B45309", "middle", "bold"))
    # window on top wall
    add(line(ox+3*u, oy-15*u, ox+6*u, oy-15*u, stroke=CYAN, sw=3))
    add(t(ox+4.5*u, oy-15*u-10, "Window", 11, "#0E7490", "middle"))
    # corner labels
    add(point_px(ox, oy, "O (0,0)", BLUE, 6, 20, r=5))
    add(point_px(ox+18*u, oy, "P (18,0)", BLUE, -10, 20, r=5))
    add(point_px(ox, oy-15*u, "Q (0,15)", BLUE, 6, -10, r=5))
    add(point_px(ox+18*u, oy-15*u, "R (18,15)", BLUE, -10, -10, r=5))
    o.append("".join(body))
    o.append(legend_panel(W-250, H-150, [
        (WOOD, "Dining table", 3),
        (PURPLE, "Chairs", 3),
        (AMBER, "Door", 3),
        (CYAN, "Window", 3),
    ], w=230))
    o.append(t(W/2, H-18, "Dining room: 18 ft × 15 ft · table 5 ft × 3 ft centred (each unit = 1 ft)",
               12, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# ============================================================
#  END-OF-CHAPTER diagrams  (8)
# ============================================================
# Q3 — RAMP quadrilateral: R(3,0), A(0,-2), M(-5,-2), P(-5,2)
def ec_q3_svg():
    W, H = 640, 480
    ox, oy, u = 290.0, 260.0, 26.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Quadrilateral RAMP — R(3,0), A(0,−2), M(−5,−2), P(−5,2)",
               15, DARK, "middle", "bold", SERIF))
    pts = [(3, 0), (0, -2), (-5, -2), (-5, 2)]
    body = []
    def add(s): body.append(s)
    add(poly([(ox+x*u, oy-y*u) for x, y in pts],
             fill="rgba(139,92,246,0.18)", stroke=PURPLE, sw=2.5))
    # side labels
    add(t(ox-2.5*u, oy-1*u+4, "RAMP", 14, PURPLE, "middle", "bold"))
    # dashed projections for clarity
    add(line(ox+3*u, oy, ox+3*u, oy+2*u, stroke=GRAY, sw=1.2, dash="4,4"))
    add(line(ox, oy+2*u, ox-5*u, oy+2*u, stroke=GRAY, sw=1.2, dash="4,4"))
    add(t(ox+1.4*u, oy+1*u, "R", 13, GRAY, "middle"))
    # vertex labels
    add(point_coord(3, 0, "R (3, 0)", PURPLE, ox, oy, u, 8, -14))
    add(point_coord(0, -2, "A (0, −2)", PURPLE, ox, oy, u, -4, 24))
    add(point_coord(-5, -2, "M (−5, −2)", PURPLE, ox, oy, u, -10, 24))
    add(point_coord(-5, 2, "P (−5, 2)", PURPLE, ox, oy, u, -10, -12))
    plane = coord_plane(ox, oy, u, -8, 6, -5, 5, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(t(W/2, H-22, "Opposite sides MA ∥ RP and MP ∥ AR → a parallelogram (verify: MA = RP = 5, MP = AR = 4)",
               12, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q4 — Right triangle IZN: I(5,0), Z(5,-6), N(0,-6)
def ec_q4_svg():
    W, H = 620, 470
    ox, oy, u = 150.0, 150.0, 26.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Right-angled triangle IZN — right angle at Z", 15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    add(poly([(ox+5*u, oy), (ox+5*u, oy+6*u), (ox, oy+6*u)],
             fill="rgba(220,38,38,0.15)", stroke=RED, sw=2.5))
    # right angle marker at Z(5,-6)
    zx, zy = ox+5*u, oy+6*u
    add(poly([(zx-16, zy), (zx-16, zy-16), (zx, zy-16)], fill="none", stroke=RED, sw=2))
    # side length labels
    add(t(ox+5*u+10, oy+3*u+5, "IZ = 6", 12.5, RED, "start", "bold"))
    add(t(ox+2.5*u, oy+6*u+20, "ZN = 5", 12.5, RED, "middle", "bold"))
    add(t(ox+2.0*u, oy+3.2*u, "IN = √61", 12.5, RED, "middle", "bold"))
    add(point_coord(5, 0, "I (5, 0)", RED, ox, oy, u, 8, -12))
    add(point_coord(5, -6, "Z (5, −6)", RED, ox, oy, u, -6, 24))
    add(point_coord(0, -6, "N (0, −6)", RED, ox, oy, u, -10, 24))
    # Build plane manually for custom range (-1..7 x, -8..2 y)
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Right-angled triangle IZN — right angle at Z", 15, DARK, "middle", "bold", SERIF))
    o.append(grid(ox, oy, u, -1, 7, -8, 2))
    o.append(quadrant_shades(ox, oy, u, -1, 7, -8, 2))
    o.append(axes(ox, oy, u, -1, 7, -8, 2, "arr", ("x", "y")))
    o.append(ticks(ox, oy, u, -1, 7, -8, 2))
    o.append("".join(body))
    o.append(t(W/2, H-22, "By Pythagoras: IZ² + ZN² = 6² + 5² = 61  ⇒  IN = √61 units", 12.5, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q6 — Collinear M(-3,-4), A(0,0), G(6,8) on y = (4/3)x
def ec_q6_svg():
    W, H = 660, 480
    ox, oy, u = 300.0, 330.0, 26.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Collinear points M(−3,−4), A(0,0), G(6,8) on line y = ⁴⁄₃ x",
               15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # extend the line through the grid
    # y = (4/3)x: at x=-7 -> -9.33 ; at x=9 -> 12
    xa, xb = -7.5, 9.5
    add(line(ox+xa*u, oy-(4/3*xa)*u, ox+xb*u, oy-(4/3*xb)*u, stroke=RED, sw=3))
    # slope annotation
    add(t(ox+4.6*u, oy-6.2*u, "slope = ⁴⁄₃", 13, RED, "start", "bold", SERIF, True))
    # mark line segments MA and AG
    add(point_coord(-3, -4, "M (−3, −4)", BLUE, ox, oy, u, -10, 22))
    add(point_coord(0, 0, "A (0, 0)", AMBER, ox, oy, u, 6, -16))
    add(point_coord(6, 8, "G (6, 8)", GREEN, ox, oy, u, 8, -14))
    # equal slope check mini-labels
    add(t(ox-1.4*u, oy+1.6*u, "m₁ = ⁴⁄₃", 12, SLATE, "start"))
    add(t(ox+3.2*u, oy-2.6*u, "m₂ = ⁴⁄₃", 12, SLATE, "start"))
    plane = coord_plane(ox, oy, u, -6, 9, -6, 10, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(t(W/2, H-22, "slope MA = slope AG = ⁴⁄₃  →  M, A, G are collinear (no triangle formed)",
               12.5, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q7 — Non-collinear R(-5,-1), B(-2,-5), C(4,-12)
def ec_q7_svg():
    W, H = 660, 500
    ox, oy, u = 200.0, 360.0, 26.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Non-collinear points R(−5,−1), B(−2,−5), C(4,−12) form a triangle",
               15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    add(poly([(ox-5*u, oy+1*u), (ox-2*u, oy+5*u), (ox+4*u, oy+12*u)],
             fill="rgba(245,158,11,0.15)", stroke=AMBER, sw=2.5))
    # side slope labels
    add(t(ox-3.7*u, oy+2.6*u+6, "m = −⁴⁄₃", 12, "#B45309", "start", "bold"))
    add(t(ox+0.6*u, oy+9.2*u, "m = −⁷⁄₆", 12, "#B45309", "start", "bold"))
    # dashed altitude hint from R to BC? keep light
    add(point_coord(-5, -1, "R (−5, −1)", AMBER, ox, oy, u, -10, -14))
    add(point_coord(-2, -5, "B (−2, −5)", RED, ox, oy, u, -10, 24))
    add(point_coord(4, -12, "C (4, −12)", BLUE, ox, oy, u, 8, 24))
    plane = coord_plane(ox, oy, u, -8, 7, -15, 3, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(t(W/2, H-22, "slope RB = −⁴⁄₃  ≠  slope BC = −⁷⁄₆  →  NOT collinear · area = ³⁄₂ ≠ 0",
               12.5, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q8 — Two triangles at origin: OPQ (right isosceles) + OAB (isosceles)
def ec_q8_svg():
    W, H = 680, 500
    ox, oy, u = 300.0, 280.0, 30.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Two triangles at the origin — right-isosceles △OPQ and isosceles △OAB",
               14.5, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # triangle OAB: O(0,0), A(-3,-1), B(3,-1)
    add(poly([(ox, oy), (ox-3*u, oy+1*u), (ox+3*u, oy+1*u)],
             fill="rgba(245,158,11,0.18)", stroke=AMBER, sw=2.5))
    add(t(ox, oy-3.6*u+4, "△OAB", 14, "#B45309", "middle", "bold"))
    add(t(ox, oy-3.6*u+21, "OA = OB = √10", 11.5, "#B45309", "middle"))
    # triangle OPQ: O(0,0), P(3,0), Q(0,3)
    add(poly([(ox, oy), (ox+3*u, oy), (ox, oy-3*u)],
             fill="rgba(37,99,235,0.18)", stroke=BLUE, sw=2.5))
    # right angle marker at O
    add(poly([(ox+18, oy), (ox+18, oy-18), (ox, oy-18)], fill="none", stroke=BLUE, sw=2))
    add(t(ox+1.6*u, oy-1.6*u, "△OPQ", 14, "#1D4ED8", "middle", "bold"))
    add(t(ox+1.6*u, oy-1.6*u+17, "OP = OQ = 3", 11.5, "#1D4ED8", "middle"))
    add(t(ox+1.5*u, oy+22, "PQ = 3√2", 11.5, "#1D4ED8", "middle"))
    add(point_coord(3, 0, "P (3, 0)", BLUE, ox, oy, u, 8, -14))
    add(point_coord(0, 3, "Q (0, 3)", BLUE, ox, oy, u, -12, -6))
    add(point_coord(-3, -1, "A (−3, −1)  [QIII]", AMBER, ox, oy, u, -12, 22))
    add(point_coord(3, -1, "B (3, −1)  [QIV]", AMBER, ox, oy, u, 8, 22))
    add(point_coord(0, 0, "O (0, 0)", DARK, ox, oy, u, 8, -14))
    plane = coord_plane(ox, oy, u, -6, 6, -4, 6, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(legend_panel(40, H-150, [
        (BLUE, "Right-angled isosceles △OPQ", 3),
        (AMBER, "Isosceles △OAB (QIII ↔ QIV)", 3),
        (DARK, "Right-angle marker", 2),
    ], w=280))
    o.append(svg_close())
    return "".join(o)

# Q10 — Midpoint M(-7,1) of A(3,-4), B(-17,6)
def ec_q10_svg():
    W, H = 680, 480
    ox, oy, u = 260.0, 250.0, 16.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Midpoint M(−7, 1) of segment AB with A(3,−4) and B(−17, 6)",
               15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # segment AB
    add(line(ox-17*u, oy-6*u, ox+3*u, oy+4*u, stroke=DARK, sw=2.5))
    # dashed vertical guide from M down
    add(line(ox-7*u, oy-1*u, ox-7*u, oy+1*u, stroke=GRAY, sw=1.4, dash="5,5"))
    # distance tick marks AM = MB
    add(point_coord(-7, 1, "M (−7, 1)", RED, ox, oy, u, 8, -14))
    add(point_coord(3, -4, "A (3, −4)", BLUE, ox, oy, u, 8, 20))
    add(point_coord(-17, 6, "B (−17, 6)", GREEN, ox, oy, u, -12, -8))
    # equal-length ticks on each half
    def tick_marks(x1, y1, x2, y2, n=3, off=9):
        # small perpendicular ticks at fraction i/(n)
        out = []
        import math as m
        for i in range(1, n):
            fr = i / n
            mx = x1 + (x2-x1)*fr
            my = y1 + (y2-y1)*fr
            dx, dy = (x2-x1), (y2-y1)
            L = m.hypot(dx, dy)
            px, py = -dy/L*off, dx/L*off
            out.append(line(mx-px, my-py, mx+px, my+py, stroke=RED, sw=1.8))
        return "".join(out)
    add(tick_marks(ox-17*u, oy-6*u, ox-7*u, oy-1*u))
    add(tick_marks(ox-7*u, oy-1*u, ox+3*u, oy+4*u))
    add(t((ox-17*u + ox-7*u)/2, (oy-6*u + oy-1*u)/2 - 14, "AM = √125", 12, SLATE, "middle"))
    add(t((ox-7*u + ox+3*u)/2, (oy-1*u + oy+4*u)/2 - 14, "MB = √125", 12, SLATE, "middle"))
    # B coordinate derivation annotation
    add(t(ox+170, oy+110, "B = (2·M − A) = (−17, 6)", 13, DARK, "middle", "bold"))
    plane = coord_plane(ox, oy, u, -20, 6, -7, 9, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(t(W/2, H-22, "Check: ((−17+3)/2, (6+(−4))/2) = (−7, 1) ✓", 12.5, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)

# Q11 — Trisection A(4,7), P(8,4), Q(12,1), B(16,-2) with AP=PQ=QB=5
def ec_q11_svg():
    W, H = 640, 480
    ox, oy, u = 120.0, 120.0, 26.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Trisection of AB — A(4,7), P(8,4), Q(12,1), B(16,−2)", 15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # the segment
    add(line(ox+4*u, oy-7*u, ox+16*u, oy+2*u, stroke=DARK, sw=2.5))
    # equal-part ticks
    segs = [((4, 7), (8, 4)), ((8, 4), (12, 1)), ((12, 1), (16, -2))]
    cols = [BLUE, AMBER, GREEN]
    for (x1, y1), (x2, y2) in segs:
        add(line(ox+x1*u, oy-y1*u, ox+x2*u, oy-y2*u, stroke="#94a3b8", sw=1.2, dash="6,5"))
    # distance labels
    add(t(ox+6*u, oy-5.5*u+6, "5", 13, RED, "middle", "bold"))
    add(t(ox+10*u, oy-2.5*u+6, "5", 13, RED, "middle", "bold"))
    add(t(ox+14*u, oy+0.5*u+6, "5", 13, RED, "middle", "bold"))
    add(t(ox+10*u, oy-6.6*u, "AP = PQ = QB = 5 units", 13, DARK, "middle", "bold"))
    # ratio markers above each part
    for i, (lab, px, py) in enumerate([("1", 6, 5.5), ("1", 10, 2.5), ("1", 14, -0.5)]):
        pass
    add(t(ox+6*u, oy-5.5*u-14, "①", 12, RED, "middle"))
    add(t(ox+10*u, oy-2.5*u-14, "②", 12, RED, "middle"))
    add(t(ox+14*u, oy+0.5*u-14, "③", 12, RED, "middle"))
    add(point_coord(4, 7, "A (4, 7)", BLUE, ox, oy, u, 8, -12))
    add(point_coord(8, 4, "P (8, 4)", AMBER, ox, oy, u, 8, -12))
    add(point_coord(12, 1, "Q (12, 1)", PURPLE, ox, oy, u, 8, -12))
    add(point_coord(16, -2, "B (16, −2)", GREEN, ox, oy, u, 8, 20))
    # section formula annotation
    add(t(ox+8*u, oy+7.5*u+24, "P = (1·B + 2·A)/3  ·  Q = (2·B + 1·A)/3", 12.5, SLATE, "middle", "bold"))
    plane = coord_plane(ox, oy, u, 2, 18, -4, 9, lambda ox, oy, u: "".join(body), W, H)
    o.append(plane)
    o.append(svg_close())
    return "".join(o)

# Q16 — Square ABCD: A(2,1), B(-1,2), C(-2,-1), D(1,-2)
def ec_q16_svg():
    W, H = 640, 540
    ox, oy, u = 320.0, 300.0, 40.0
    o = [svg_open(W, H)]
    o.append(t(W/2, 34, "Square ABCD — A(2,1), B(−1,2), C(−2,−1), D(1,−2)", 15, DARK, "middle", "bold", SERIF))
    body = []
    def add(s): body.append(s)
    # square with rotated fill
    add(poly([(ox+2*u, oy-1*u), (ox-1*u, oy-2*u), (ox-2*u, oy+1*u), (ox+1*u, oy+2*u)],
             fill="rgba(22,163,74,0.18)", stroke=GREEN, sw=2.5))
    # diagonals (dashed)
    add(line(ox+2*u, oy-1*u, ox-2*u, oy+1*u, stroke="#86EFAC", sw=1.4, dash="7,5"))
    add(line(ox-1*u, oy-2*u, ox+1*u, oy+2*u, stroke="#86EFAC", sw=1.4, dash="7,5"))
    # side length labels
    add(t(ox+0.5*u, oy-1.5*u-6, "√10", 13.5, GREEN, "middle", "bold"))
    add(t(ox-0.5*u, oy+1.5*u+18, "√10", 13.5, GREEN, "middle", "bold"))
    add(t(ox-1.6*u+0, oy-0.5*u+6, "√10", 13.5, GREEN, "middle", "bold"))
    add(t(ox+1.6*u, oy+0.5*u+6, "√10", 13.5, GREEN, "middle", "bold"))
    # vertex labels
    add(point_coord(2, 1, "A (2, 1)", BLUE, ox, oy, u, 8, -12))
    add(point_coord(-1, 2, "B (−1, 2)", BLUE, ox, oy, u, -10, -6))
    add(point_coord(-2, -1, "C (−2, −1)", BLUE, ox, oy, u, -12, 22))
    add(point_coord(1, -2, "D (1, −2)", BLUE, ox, oy, u, 8, 22))
    # centre label
    add(point_coord(0, 0, "centre (0,0)", RED, ox, oy, u, 8, -12))
    # right angle marker at A (side AB down-left, AD down-right)
    # AB dir = (-3,1); AD dir = (-1,-3); corner at A
    ax, ay = ox+2*u, oy-1*u
    # small square marker oriented along sides
    add(poly([(ax, ay), (ax-9, ay+3), (ax-12, ay-6), (ax-3, ay-9)],
             fill="none", stroke=RED, sw=1.8))
    # area annotation
    add(t(ox+170, oy+120, "Area = (√10)² = 10 sq. units", 13, DARK, "middle", "bold"))
    plane = coord_plane(ox, oy, u, -4, 4, -4, 4, lambda ox, oy, u: "".join(body), W, H,
                        major_every=1, ticks_on=False)
    o.append(plane)
    # add ticks manually for every unit
    o.append(ticks(ox, oy, u, -4, 4, -4, 4, skip=0))
    o.append(t(W/2, H-22, "All sides √10 · diagonals 2√5 · adjacent ⊥ (dot product = 0)", 12.5, SLATE, "middle"))
    o.append(svg_close())
    return "".join(o)


# ============================================================
#  JSON patching
# ============================================================
def set_diagram(file, qid, svg_content, caption):
    p = os.path.join(BASE, file)
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    for q in data.get("questions", []):
        if q.get("id") == qid and "diagram" in q:
            q["diagram"]["content"] = svg_content
            q["diagram"]["caption"] = caption
            with open(p, "w", encoding="utf-8") as out:
                json.dump(data, out, ensure_ascii=False, indent=2)
            print(f"  ✓ {qid}")
            return
    print(f"  ✗ NOT FOUND {qid}")

def main():
    print("== Regenerating diagrams ==")

    print("\n[exercise-set-1.1.json]  Fig 1.3 room floor plan")
    ex11 = os.path.join(BASE, "exercise-set-1.1.json")
    with open(ex11, "r", encoding="utf-8") as f:
        d = json.load(f)
    # Read existing captions so we keep/update them sensibly
    caps = {}
    for q in d.get("questions", []):
        caps[q["id"]] = q.get("diagram", {}).get("caption", "")
    plan_q1 = room_plan_svg("q1")
    plan_q2 = room_plan_svg("q2")
    plan_q3 = room_plan_svg("q3")
    plan_q4 = room_plan_svg("q4")
    set_diagram("exercise-set-1.1.json", "9-math-0-ex1.1-q1", plan_q1,
                "Fig 1.3: Reiaan's room floor OABC — corners O(0,0), A(0,6), B(12,6), C(12,0). Room door D₁R₁ on the x-axis, bathroom door B₁B₂ on the y-axis.")
    set_diagram("exercise-set-1.1.json", "9-math-0-ex1.1-q2", plan_q2,
                "Fig 1.3: The point D₁(8.5, 0) locates the left edge of the room door on the x-axis (8.5 ft from corner O).")
    set_diagram("exercise-set-1.1.json", "9-math-0-ex1.1-q3", plan_q3,
                "Fig 1.3: Room door width — D₁(8.5,0) to R₁(11.5,0) gives D₁R₁ = 11.5 − 8.5 = 3 ft.")
    set_diagram("exercise-set-1.1.json", "9-math-0-ex1.1-q4", plan_q4,
                "Fig 1.3: Bathroom door on the y-axis — B₁(0,1.5) to B₂(0,4) gives B₁B₂ = 4 − 1.5 = 2.5 ft.")

    print("\n[exercise-set-1.2.json]  Fig 1.5 house layout")
    set_diagram("exercise-set-1.2.json", "9-math-0-ex1.2-q1", ex12_q1_svg(),
                "Fig 1.5: Study table in Reiaan's room — feet at A(8,9), B(11,9), C(11,7), D(8,7); the table is 3 ft × 2 ft.")
    set_diagram("exercise-set-1.2.json", "9-math-0-ex1.2-q2", ex12_q2_svg(),
                "Fig 1.5: Bathroom door swings on hinge B₁(0,1.5); the leaf sweeps an arc of radius 2.5 ft. Wardrobe shown against the wall.")
    set_diagram("exercise-set-1.2.json", "9-math-0-ex1.2-q3", ex12_q3_svg(),
                "Fig 1.5: Bathroom OFRP (5 ft × 4 ft) with shower area SHWR, washbasin (3 ft × 2 ft) and toilet (2 ft × 3 ft).")
    set_diagram("exercise-set-1.2.json", "9-math-0-ex1.2-q4", ex12_q4_svg(),
                "Fig 1.5: Dining room 18 ft × 15 ft with a centred 5 ft × 3 ft table.")

    print("\n[end-of-chapter.json]")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q3", ec_q3_svg(),
                "Quadrilateral RAMP — R(3,0), A(0,−2), M(−5,−2), P(−5,2): a parallelogram.")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q4", ec_q4_svg(),
                "Right-angled triangle IZN with right angle at Z(5,−6): IZ = 6, ZN = 5, IN = √61.")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q6", ec_q6_svg(),
                "Collinear points M(−3,−4), A(0,0), G(6,8) — all lie on y = ⁴⁄₃ x (equal slopes).")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q7", ec_q7_svg(),
                "Non-collinear points R(−5,−1), B(−2,−5), C(4,−12) — unequal slopes, they form a triangle.")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q8", ec_q8_svg(),
                "Two triangles at the origin: right-angled isosceles △OPQ (P(3,0), Q(0,3)) and isosceles △OAB (A(−3,−1) in QIII, B(3,−1) in QIV).")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q10", ec_q10_svg(),
                "Midpoint M(−7,1) of AB with A(3,−4) and B(−17,6); AM = MB = √125.")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q11", ec_q11_svg(),
                "Trisection of AB: A(4,7), P(8,4), Q(12,1), B(16,−2) with AP = PQ = QB = 5 units.")
    set_diagram("end-of-chapter.json", "9-math-0-ec-q16", ec_q16_svg(),
                "Square ABCD — A(2,1), B(−1,2), C(−2,−1), D(1,−2): sides √10, diagonals 2√5, area 10 sq. units.")

    print("\nDone. All diagrams regenerated.")

if __name__ == "__main__":
    main()
