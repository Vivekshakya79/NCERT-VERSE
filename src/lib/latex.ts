/**
 * latex.ts
 * --------
 * Converts LaTeX math notation into clean, student-friendly plain text.
 *
 * The site stores solutions with LaTeX math (e.g. `\frac{15}{2}`, `\times`,
 * `\sqrt{61}`) inside `$...$` / `$$...$$` delimiters. The in-house renderer
 * only strips the `$` delimiters and converts subscripts — it does not run
 * KaTeX/MathJax. This helper rewrites the LaTeX commands into readable
 * Unicode/plain text so students never see raw markup like `\frac{15}{2}`.
 *
 * Only the PRESENTATION is changed — numbers, calculations and meaning are
 * preserved exactly.
 */

const SUP_MAP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
  "n": "ⁿ", "i": "ⁱ",
};

const SYMBOL_MAP: Record<string, string> = {
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

/** Convert a superscript group to Unicode superscripts, falling back to ^(...) */
function toSuperscript(content: string): string {
  let out = "";
  for (const ch of content) {
    const mapped = SUP_MAP[ch];
    if (mapped === undefined) return `^(${content})`;
    out += mapped;
  }
  return out;
}

/** Match a braced group with one level of nesting */
const BRACED = "(?:[^{}]|\\{[^{}]*\\})*";

/**
 * Convert LaTeX math commands in `text` to clean plain text.
 * Safe to run on any string — only `\`-prefixed LaTeX is touched.
 */
export function latexToPlainText(text: string): string {
  let s = text;

  // Fractions: \frac{a}{b} → a/b  (also \dfrac, \tfrac)
  // Loop so nested fractions (e.g. \frac{\frac{3}{4}r^2}{\pi r^2}) fully resolve.
  const fracRe = new RegExp(`\\\\(?:frac|dfrac|tfrac)\\{(${BRACED})\\}\\{(${BRACED})\\}`, "g");
  for (let i = 0; i < 5; i++) {
    const next = s.replace(fracRe, (_m, num, den) => `${latexToPlainText(num)}/${latexToPlainText(den)}`);
    if (next === s) break;
    s = next;
  }

  // Square roots: \sqrt{x} → √x, \sqrt[n]{x} → ⁿ√x
  const sqrtRe = new RegExp(`\\\\sqrt(?:\\[([^\\]]*)\\])?\\{(${BRACED})\\}`, "g");
  for (let i = 0; i < 5; i++) {
    const next = s.replace(sqrtRe, (_m, idx, rad) => {
      const r = latexToPlainText(rad);
      return idx ? `${toSuperscript(idx)}√${r}` : `√${r}`;
    });
    if (next === s) break;
    s = next;
  }

  // Text / formatting commands: \text{...} → ...
  s = s.replace(
    new RegExp(`\\\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\\{(${BRACED})\\}`, "g"),
    (_m, content) => latexToPlainText(content)
  );

  // Repeating decimals: \overline{52} → 52̅
  s = s.replace(
    new RegExp(`\\\\overline\\{(${BRACED})\\}`, "g"),
    (_m, content) => `${latexToPlainText(content)}\u0305`
  );

  // Vectors: \overrightarrow{AB} → AB→
  s = s.replace(
    new RegExp(`\\\\overrightarrow\\{(${BRACED})\\}`, "g"),
    (_m, content) => `${latexToPlainText(content)}→`
  );

  // Accents: \vec{v} → v⃗, \hat{x} → x̂, \bar{x} → x̄, \dot{x} → ẋ, \ddot{x} → ẍ
  s = s.replace(new RegExp(`\\\\vec\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u20D7`);
  s = s.replace(new RegExp(`\\\\hat\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0302`);
  s = s.replace(new RegExp(`\\\\bar\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0304`);
  s = s.replace(new RegExp(`\\\\dot\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0307`);
  s = s.replace(new RegExp(`\\\\ddot\\{(${BRACED})\\}`, "g"), (_m, c) => `${latexToPlainText(c)}\u0308`);
  s = s.replace(new RegExp(`\\\\underline\\{(${BRACED})\\}`, "g"), (_m, c) => latexToPlainText(c));

  // Delimiters: \left( \right) → ( )
  s = s.replace(/\\(left|right)\\?([()\[\]{}|.])/g, (_m, _lr, ch) => (ch === "." ? "" : ch));

  // Environments: \begin{array}{...} / \begin{cases} / \end{...}
  s = s.replace(/\\begin\{array\}\{[^{}]*\}/g, "");
  s = s.replace(/\\begin\{[^{}]*\}/g, "");
  s = s.replace(/\\end\{[^{}]*\}/g, "");
  s = s.replace(/\\hline/g, "");

  // Superscripts: ^{...} → Unicode superscript, ^x → Unicode superscript
  s = s.replace(/\^\\circ/g, "°");
  s = s.replace(/\^\{([^{}]*)\}/g, (_m, content) => toSuperscript(content));
  s = s.replace(/\^([0-9a-zA-Z+\-()=])/g, (_m, ch) => toSuperscript(ch));

  // LaTeX line breaks: \\ → newline
  s = s.replace(/\\\\/g, "\n");

  // Column separators in arrays/cases: & → space
  s = s.replace(/&/g, " ");

  // Spacing commands
  s = s.replace(/\\(?:hspace|vspace|phantom)\{[^{}]*\}/g, " ");
  s = s.replace(/\\quad/g, "  ");
  s = s.replace(/\\qquad/g, "    ");
  s = s.replace(/\\[;,:]/g, " ");
  s = s.replace(/\\!/g, "");
  s = s.replace(/\\ /g, " ");

  // Remaining named commands → symbols
  s = s.replace(/\\[a-zA-Z]+/g, (m) => SYMBOL_MAP[m] ?? m);

  // Escaped special characters
  s = s.replace(/\\([%&_#${}])/g, "$1");

  return s;
}