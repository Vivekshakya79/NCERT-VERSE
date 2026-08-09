// Verify the regression test is meaningful: with the OLD (buggy) dash-list
// logic, the audit's renderPointwiseContent path MUST report raw LaTeX.
// This proves the improved audit actually tests the real rendering path.
const fs = require("fs");
const path = require("path");

// ── Replicate src/lib/latex.ts logic (same as audit_latex_final.js) ──
const SUP_MAP = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾","n":"ⁿ","i":"ⁱ" };
function toSuperscript(content){let out="";for(const ch of content){const m=SUP_MAP[ch];if(m===undefined)return `^(${content})`;out+=m;}return out;}
const BRACED="(?:[^{}]|\\{[^{}]*\\})*";
const SYMBOL_MAP = {
  "\\times":"×","\\div":"÷","\\cdot":"·","\\pm":"±","\\mp":"∓","\\leq":"≤","\\le":"≤","\\geq":"≥","\\ge":"≥","\\neq":"≠","\\ne":"≠","\\approx":"≈","\\equiv":"≡","\\propto":"∝","\\infty":"∞","\\pi":"π","\\theta":"θ","\\Delta":"Δ","\\angle":"∠","\\perp":"⊥","\\parallel":"∥","\\cong":"≅","\\sim":"∼","\\triangle":"△","\\square":"□","\\circ":"°","\\degree":"°","\\prime":"′","\\ldots":"…","\\dots":"…","\\cdots":"⋯","\\vdots":"⋮","\\ddots":"⋱","\\Rightarrow":"⇒","\\implies":"⇒","\\rightarrow":"→","\\to":"→","\\Leftarrow":"⇐","\\leftarrow":"←","\\Leftrightarrow":"⇔","\\iff":"⇔","\\therefore":"∴","\\because":"∵","\\in":"∈","\\notin":"∉","\\subset":"⊂","\\subseteq":"⊆","\\supset":"⊃","\\supseteq":"⊇","\\cup":"∪","\\cap":"∩","\\emptyset":"∅","\\varnothing":"∅","\\forall":"∀","\\exists":"∃","\\neg":"¬","\\land":"∧","\\lor":"∨","\\sum":"Σ","\\prod":"∏","\\int":"∫","\\partial":"∂","\\nabla":"∇","\\checkmark":"✓","\\star":"⋆","\\ast":"*","\\bullet":"•","\\mid":"|","\\vert":"|","\\Vert":"‖","\\lvert":"|","\\rvert":"|","\\lfloor":"⌊","\\rfloor":"⌋","\\lceil":"⌈","\\rceil":"⌉","\\langle":"⟨","\\rangle":"⟩","\\alpha":"α","\\beta":"β","\\gamma":"γ","\\delta":"δ","\\epsilon":"ε","\\varepsilon":"ε","\\zeta":"ζ","\\eta":"η","\\iota":"ι","\\kappa":"κ","\\lambda":"λ","\\mu":"μ","\\nu":"ν","\\xi":"ξ","\\omicron":"ο","\\rho":"ρ","\\sigma":"σ","\\tau":"τ","\\upsilon":"υ","\\phi":"φ","\\varphi":"φ","\\chi":"χ","\\psi":"ψ","\\omega":"ω","\\Gamma":"Γ","\\Theta":"Θ","\\Lambda":"Λ","\\Xi":"Ξ","\\Pi":"Π","\\Sigma":"Σ","\\Upsilon":"Υ","\\Phi":"Φ","\\Psi":"Ψ","\\Omega":"Ω","\\cos":"cos","\\sin":"sin","\\tan":"tan","\\sec":"sec","\\csc":"csc","\\cot":"cot","\\log":"log","\\ln":"ln","\\max":"max","\\min":"min","\\lim":"lim","\\exp":"exp","\\deg":"deg","\\mod":"mod","\\quad":"  ","\\qquad":"    ","\\;":" ","\\,":" ","\\:":" ","\\!":"","\\ ":" ","\\%":"%","\\&":"&","\\_":"_","\\#":"#","\\$":"$","\\{":"{","\\}":"}",
};
function latexToPlainText(text){
  let s=text;
  const fracRe=new RegExp(`\\\\(?:frac|dfrac|tfrac)\\{(${BRACED})\\}\\{(${BRACED})\\}`, "g");
  for(let i=0;i<5;i++){const n=s.replace(fracRe,(_m,num,den)=>`${latexToPlainText(num)}/${latexToPlainText(den)}`);if(n===s)break;s=n;}
  const sqrtRe=new RegExp(`\\\\sqrt(?:\\[([^\\]]*)\\])?\\{(${BRACED})\\}`, "g");
  for(let i=0;i<5;i++){const n=s.replace(sqrtRe,(_m,idx,rad)=>{const r=latexToPlainText(rad);return idx?`${toSuperscript(idx)}√${r}`:`√${r}`;});if(n===s)break;s=n;}
  s=s.replace(new RegExp(`\\\\(?:text|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|mbox)\\{(${BRACED})\\}`, "g"),(_m,c)=>latexToPlainText(c));
  s=s.replace(new RegExp(`\\\\overline\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u0305`);
  s=s.replace(new RegExp(`\\\\overrightarrow\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}→`);
  s=s.replace(new RegExp(`\\\\vec\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u20D7`);
  s=s.replace(new RegExp(`\\\\hat\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u0302`);
  s=s.replace(new RegExp(`\\\\bar\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u0304`);
  s=s.replace(new RegExp(`\\\\dot\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u0307`);
  s=s.replace(new RegExp(`\\\\ddot\\{(${BRACED})\\}`, "g"),(_m,c)=>`${latexToPlainText(c)}\u0308`);
  s=s.replace(new RegExp(`\\\\underline\\{(${BRACED})\\}`, "g"),(_m,c)=>latexToPlainText(c));
  s=s.replace(/\\(left|right)\\?([()\[\]{}|.])/g,(_m,_lr,ch)=>(ch==="."?"":ch));
  s=s.replace(/\\begin\{array\}\{[^{}]*\}/g,"");
  s=s.replace(/\\begin\{[^{}]*\}/g,"");
  s=s.replace(/\\end\{[^{}]*\}/g,"");
  s=s.replace(/\\hline/g,"");
  s=s.replace(/\^\\circ/g,"°");
  s=s.replace(/\^\{([^{}]*)\}/g,(_m,c)=>toSuperscript(c));
  s=s.replace(/\^([0-9a-zA-Z+\-()=])/g,(_m,c)=>toSuperscript(c));
  s=s.replace(/\\\\/g,"\n");
  s=s.replace(/&/g," ");
  s=s.replace(/\\(?:hspace|vspace|phantom)\{[^{}]*\}/g," ");
  s=s.replace(/\\quad/g,"  ");
  s=s.replace(/\\qquad/g,"    ");
  s=s.replace(/\\[;,:]/g," ");
  s=s.replace(/\\!/g,"");
  s=s.replace(/\\ /g," ");
  s=s.replace(/\\[a-zA-Z]+/g,(m)=>SYMBOL_MAP[m]??m);
  s=s.replace(/\\([%&_#${}])/g,"$1");
  return s;
}
const SUB_MAP={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","(":"₍",")":"₎","=":"₌"};
function toUnicodeSubscripts(t){return t.replace(/_(?:\{([^{}]+)\}|([0-9+\-]+))/g,(m,g,p)=>{const chars=(g??p);let out="";for(const ch of chars){const mp=SUB_MAP[ch];if(mp===undefined)return m;out+=mp;}return out;});}
function renderMarkdown(t){return t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br />");}
function renderLatex(t){return t.replace(/\$\$(.+?)\$\$/g,(_m,c)=>`<span class="sv-latex-block">${toUnicodeSubscripts(c)}</span>`).replace(/\$(.+?)\$/g,(_m,c)=>`<span class="sv-latex">${toUnicodeSubscripts(c)}</span>`);}
function renderContent(t){return toUnicodeSubscripts(renderLatex(renderMarkdown(latexToPlainText(t))));}

// OLD (buggy) dash-list logic — only processes `- ` lines, leaks everything else
function oldPointwise(content){
  const headingMatch=content.match(/^\*\*([^*]+?)\*\*:?\s*/);
  let body=content;
  if(headingMatch) body=content.slice(headingMatch[0].length).trim();
  const hasDashList=/^-\s/m.test(body);
  if(!hasDashList) return renderContent(body);
  return body
    .replace(/^- (.+)$/gm,(_,line)=>`<div class="sv-pw-item">${renderContent(line.trim())}</div>`)
    .replace(/\n\n+/g,'<div class="sv-pw-spacer"></div>');
}

const RAW=/\\[a-zA-Z]+|\\[^a-zA-Z\s]|\^\{|\$\$|\$[^$]/;
const base="src/data/solutions/class-9/Mathematics";
let issues=0;
const list=[];
for(const d of fs.readdirSync(base)){
  const full=path.join(base,d);
  if(!fs.statSync(full).isDirectory())continue;
  for(const f of fs.readdirSync(full)){
    if(!f.endsWith(".json"))continue;
    const data=JSON.parse(fs.readFileSync(path.join(full,f),"utf8"));
    for(const q of data.questions||[]){
      for(const s of q.solution||[]){
        const out=oldPointwise(s.content||"");
        if(RAW.test(out)){
          issues++;
          if(list.length<20)list.push(`${d}/${f} Q${q.questionNumber} step${s.step}`);
        }
      }
    }
  }
}
console.log("OLD buggy logic would report raw-LaTeX issues:", issues);
if(list.length) console.log(list.join("\n"));
console.log(issues>0 ? "PASS: regression test catches the dash-list bug" : "FAIL: regression test does NOT catch the bug");