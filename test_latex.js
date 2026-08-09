// Quick test of latexToPlainText against real data samples
const fs = require("fs");
const path = require("path");

// Load the TS module by transpiling inline (simple approach: copy logic)
// Instead, test via a small node script that requires the compiled logic.
// We'll use tsx-style: just re-implement quickly by reading the file and eval? 
// Simpler: use node with a .mjs that imports via ts-node is not available.
// We'll test by extracting the function logic manually through a require of the TS via esbuild? 
// Easiest: write the test in a way that uses the same regexes inline.

// Actually, let's just test the regexes inline to validate behavior.
const SUP_MAP = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
  "n": "ⁿ", "i": "ⁱ",
};
function toSuperscript(content) {
  let out = "";
  for (const ch of content) {
    const mapped = SUP_MAP[ch];
    if (mapped === undefined) return `^(${content})`;
    out += mapped;
  }
  return out;
}
const BRACED = "(?:[^{}]|\\{[^{}]*\\})*";
function latexToPlainText(text) {
  let s = text;
  s = s.replace(new RegExp(`\\\\(?:frac|dfrac|tfrac)\\{(${BRACED})\\}\\{(${BRACED})\\}`, "g"), (_m, num, den) => `${latexToPlainText(num)}/${latexToPlainText(den)}`);
  s = s.replace(new RegExp(`\\\\sqrt(?:\\[([^\\]]*)\\])?\\{(${BRACED})\\}`, "g"), (_m, idx, rad) => { const r = latexToPlainText(rad); return idx ? `${toSuperscript(idx)}√${r}` : `√${r}`; });
  s = s.replace(new RegExp(`\\\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\\{(${BRACED})\\}`, "g"), (_m, content) => latexToPlainText(content));
  s = s.replace(new RegExp(`\\\\overline\\{(${BRACED})\\}`, "g"), (_m, content) => `${latexToPlainText(content)}\u0305`);
  s = s.replace(new RegExp(`\\\\overrightarrow\\{(${BRACED})\\}`, "g"), (_m, content) => `${latexToPlainText(content)}→`);
  s = s.replace(new RegExp(`\\\\vec\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u20D7`);
  s = s.replace(new RegExp(`\\\\hat\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0302`);
  s = s.replace(new RegExp(`\\\\bar\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0304`);
  s = s.replace(new RegExp(`\\\\dot\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0307`);
  s = s.replace(new RegExp(`\\\\ddot\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0308`);
  s = s.replace(new RegExp(`\\\\underline\\{(${BRACED})\\}`, "g"), (_m, c) => latexToPlainText(c));
  s = s.replace(/\\(left|right)\\?([()\[\]{}|.])/g, (_m, _lr, ch) => (ch === "." ? "" : ch));
  s = s.replace(/\\begin\{array\}\{[^{}]*\}/g, "");
  s = s.replace(/\\begin\{[^{}]*\}/g, "");
  s = s.replace(/\\end\{[^{}]*\}/g, "");
  s = s.replace(/\\hline/g, "");
  s = s.replace(/\^\{([^{}]*)\}/g, (_m, content) => toSuperscript(content));
  s = s.replace(/\^([0-9a-zA-Z+\-()=])/g, (_m, ch) => toSuperscript(ch));
  s = s.replace(/\\\\/g, "\n");
  s = s.replace(/&/g, " ");
  s = s.replace(/\\(?:hspace|vspace|phantom)\{[^{}]*\}/g, " ");
  s = s.replace(/\\[;,:]/g, " ");
  s = s.replace(/\\!/g, "");
  s = s.replace(/\\ /g, " ");
  s = s.replace(/\\[a-zA-Z]+/g, (m) => SYMBOL_MAP[m] ?? m);
  s = s.replace(/\\([%&_#${}])/g, "$1");
  return s;
}
const SYMBOL_MAP = {
  "\\times": "×", "\\div": "÷", "\\cdot": "·", "\\pm": "±", "\\mp": "∓",
  "\\leq": "≤", "\\le": "≤", "\\geq": "≥", "\\ge": "≥", "\\neq": "≠", "\\ne": "≠",
  "\\approx": "≈", "\\equiv": "≡", "\\propto": "∝", "\\infty": "∞",
  "\\pi": "π", "\\theta": "θ", "\\Delta": "Δ",
  "\\angle": "∠", "\\perp": "⊥", "\\parallel": "∥", "\\cong": "≅", "\\sim": "∼",
  "\\triangle": "△", "\\square": "□", "\\circ": "°", "\\degree": "°", "\\prime": "′",
  "\\ldots": "…", "\\dots": "…", "\\cdots": "⋯", "\\vdots": "⋮", "\\ddots": "⋱",
  "\\Rightarrow": "⇒", "\\implies": "⇒", "\\rightarrow": "→", "\\to": "→",
  "\\Leftarrow": "⇐", "\\leftarrow": "←", "\\Leftrightarrow": "⇔", "\\iff": "⇔",
  "\\therefore": "∴", "\\because": "∵",
  "\\in": "∈", "\\notin": "∉", "\\subset": "⊂", "\\subseteq": "⊆",
  "\\supset": "⊃", "\\supseteq": "⊇", "\\cup": "∪", "\\cap": "∩",
  "\\emptyset": "∅", "\\varnothing": "∅", "\\forall": "∀", "\\exists": "∃",
  "\\neg": "¬", "\\land": "∧", "\\lor": "∨",
  "\\sum": "Σ", "\\prod": "∏", "\\int": "∫", "\\partial": "∂", "\\nabla": "∇",
  "\\checkmark": "✓", "\\star": "⋆", "\\ast": "*", "\\bullet": "•",
  "\\mid": "|", "\\vert": "|", "\\Vert": "‖", "\\lvert": "|", "\\rvert": "|",
  "\\lfloor": "⌊", "\\rfloor": "⌋", "\\lceil": "⌈", "\\rceil": "⌉",
  "\\langle": "⟨", "\\rangle": "⟩",
  "\\alpha": "α", "\\beta": "β", "\\gamma": "γ", "\\delta": "δ",
  "\\epsilon": "ε", "\\varepsilon": "ε", "\\zeta": "ζ", "\\eta": "η",
  "\\iota": "ι", "\\kappa": "κ", "\\lambda": "λ", "\\mu": "μ", "\\nu": "ν",
  "\\xi": "ξ", "\\omicron": "ο", "\\rho": "ρ", "\\sigma": "σ", "\\tau": "τ",
  "\\upsilon": "υ", "\\phi": "φ", "\\varphi": "φ", "\\chi": "χ", "\\psi": "ψ",
  "\\omega": "ω",
  "\\Gamma": "Γ", "\\Theta": "Θ", "\\Lambda": "Λ", "\\Xi": "Ξ",
  "\\Pi": "Π", "\\Sigma": "Σ", "\\Upsilon": "Υ", "\\Phi": "Φ", "\\Psi": "Ψ", "\\Omega": "Ω",
  "\\cos": "cos", "\\sin": "sin", "\\tan": "tan", "\\sec": "sec", "\\csc": "csc",
  "\\cot": "cot", "\\log": "log", "\\ln": "ln", "\\max": "max", "\\min": "min",
  "\\lim": "lim", "\\exp": "exp", "\\deg": "deg", "\\mod": "mod",
  "\\quad": "  ", "\\qquad": "    ", "\\;": " ", "\\,": " ", "\\:": " ", "\\!": "",
  "\\ ": " ",
  "\\%": "%", "\\&": "&", "\\_": "_", "\\#": "#", "\\$": "$", "\\{": "{", "\\}": "}",
};

const cases = [
  "So 1 bag of spices = \\frac{15}{2} ingots.",
  "12 \\times \\frac{15}{2} = 6 \\times 15 = 90",
  "\\frac{y_Q - y_P}{x_Q - x_P} = \\frac{y_R - y_Q}{x_R - x_Q}",
  "\\sqrt{6^2 + 5^2} = \\sqrt{61}",
  "\\text{Area} = \\frac{1}{2}|(-5)(-5-(-12)) + (-2)(-12-(-1)) + 4(-1-(-5))|",
  "\\frac{1}{2} \\times \\frac{22}{7} \\times 7^2",
  "t_n = a r^{n-1} = 2 \\times 4^{n-1}",
  "30 \\times 2^n",
  "a + 10d = 38 \\;\\ldots\\;(1)",
  "\\frac{a}{r}, a, ar",
  "\\left(\\frac{a}{r}\\right)(a)(ar) = a^3",
  "r = -\\frac{3}{4} \\text{ or } r = -\\frac{4}{3}",
  "\\frac{y}{x} = \\frac{ar^9}{ar^3} = r^6",
  "\\frac{1 + r^2 + r^4}{(1 + r + r^2)^2} = \\frac{7}{13}",
  "0.\\overline{52}",
  "\\overrightarrow{AB}",
  "\\begin{cases} x = \\text{distance from } y\\text{-axis} \\\\ y = \\text{distance from } x\\text{-axis} \\end{cases}",
  "\\begin{array}{c|cccc} t & 0 & 1 & 2 \\\\ \\hline h & 1.75 & 2.25 & 2.75 \\end{array}",
  "\\angle ABC = 90^\\circ",
  "x \\leq 5 \\text{ and } y \\geq 3",
  "\\triangle ABC \\cong \\triangle DEF",
  "\\pi \\approx 3.14",
  "\\frac{n(n + 1)}{2} > 1000",
  "\\frac{13}{12}",
  "\\frac{4}{3}, -1, \\frac{3}{4}",
  "S_n = \\frac{n(n + 1)}{2}",
  "\\frac{1}{13}",
  "\\frac{7}{20}, \\frac{4}{15}, \\frac{13}{250}",
  "\\frac{3}{4} \\text{ metres}",
  "2 \\frac{1}{2}",
];

for (const c of cases) {
  console.log("IN :", c);
  console.log("OUT:", latexToPlainText(c));
  console.log("");
}