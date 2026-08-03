/**
 * subscripts.ts
 * -------------
 * Convert LaTeX-style underscore subscripts (`D_1`, `B_{12}`, `a_2`, …)
 * into real Unicode subscript characters (`D₁`, `B₁₂`, `a₂`, …).
 *
 * The site stores labels such as `$D_1R_1$` in LaTeX math notation, but the
 * in-house renderer only strips the `$` delimiters — it does not run KaTeX.
 * That left the raw `_1` visible on the page (e.g. "D_1R_1"). This helper
 * rewrites those underscores to proper subscripts so the labels read D₁R₁.
 */

const SUBSCRIPT_MAP: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
  "+": "₊",
  "-": "₋",
  "(": "₍",
  ")": "₎",
  "=": "₌",
};

/**
 * Replace `_<n>` and `_{...}` subscripts with Unicode subscript characters.
 * Only converts when every character has a Unicode subscript mapping, so
 * things like `r_i` or `x_note` are left untouched.
 */
export function toUnicodeSubscripts(text: string): string {
  return text.replace(/_(?:\{([^{}]+)\}|([0-9+\-]+))/g, (match, group, plain) => {
    const chars = (group ?? plain) as string;
    let out = "";
    for (const ch of chars) {
      const mapped = SUBSCRIPT_MAP[ch];
      if (mapped === undefined) return match; // can't map fully → keep original
      out += mapped;
    }
    return out;
  });
}
