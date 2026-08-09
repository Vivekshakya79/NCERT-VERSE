// Verify the previously problematic cases convert correctly
const SUP_MAP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", n: "ⁿ", i: "ⁱ" };
function sup(c) { let o = ""; for (const ch of c) { const m = SUP_MAP[ch]; if (m === undefined) return "^(" + c + ")"; o += m; } return o; }
const B = "(?:[^{}]|\\{[^{}]*\\})*";
const SM = { "\\quad": "  ", "\\qquad": "    ", "\\pi": "π", "\\times": "×", "\\Rightarrow": "⇒", "\\ldots": "…", "\\circ": "°" };
function conv(t) {
  let s = t;
  const fr = new RegExp("\\\\(?:frac|dfrac|tfrac)\\{(" + B + ")\\}\\{(" + B + ")\\}", "g");
  for (let i = 0; i < 5; i++) { const n = s.replace(fr, (_m, a, b) => conv(a) + "/" + conv(b)); if (n === s) break; s = n; }
  const sr = new RegExp("\\\\sqrt(?:\\[([^\\]]*)\\])?\\{(" + B + ")\\}", "g");
  for (let i = 0; i < 5; i++) { const n = s.replace(sr, (_m, idx, r) => { const rr = conv(r); return idx ? sup(idx) + "√" + rr : "√" + rr; }); if (n === s) break; s = n; }
  s = s.replace(new RegExp("\\\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\\{(" + B + ")\\}", "g"), (_m, c) => conv(c));
  s = s.replace(/\\quad/g, "  ");
  s = s.replace(/\\qquad/g, "    ");
  s = s.replace(/\\[a-zA-Z]+/g, (m) => SM[m] ?? m);
  s = s.replace(/\\\\/g, "\n");
  return s;
}
const cases = [
  "c² = a² + b² \\quadwhere  c  is the hypotenuse",
  "\\frac{3\\sqrt{3}}{4}r^2}{\\pi r^2}",
  "\\frac{3\\sqrt{3}/4r^2}{\\pi r^2}",
  "\\frac{\\frac{3\\sqrt{3}}{4}r^2}{\\pi r^2}",
  "\\frac{3\\sqrt{3}}{4}r^2}{\\pi r^2}",
];
for (const c of cases) { console.log("IN :", c); console.log("OUT:", conv(c)); console.log(""); }