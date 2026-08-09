// Full-pipeline validation: run latexToPlainText + markdown + latex + subscripts
// over ALL Class 9 solution content and report any remaining raw LaTeX.
const fs = require("fs");
const path = require("path");

// ── Replicate src/lib/latex.ts logic ──
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
// ── Replicate subscripts ──
const SUB_MAP={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","+":"₊","-":"₋","(":"₍",")":"₎","=":"₌"};
function toUnicodeSubscripts(t){return t.replace(/_(?:\{([^{}]+)\}|([0-9+\-]+))/g,(m,g,p)=>{const chars=(g??p);let out="";for(const ch of chars){const mp=SUB_MAP[ch];if(mp===undefined)return m;out+=mp;}return out;});}
// ── Replicate markdown + latex render ──
function renderMarkdown(t){return t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br />");}
function renderLatex(t){return t.replace(/\$\$(.+?)\$\$/g,(_m,c)=>`<span class="sv-latex-block">${toUnicodeSubscripts(c)}</span>`).replace(/\$(.+?)\$/g,(_m,c)=>`<span class="sv-latex">${toUnicodeSubscripts(c)}</span>`);}
function renderContent(t){return toUnicodeSubscripts(renderLatex(renderMarkdown(latexToPlainText(t))));}

// ── Replicate SolutionViewer smartBold ──
function smartBold(text){
  return text
    .replace(/(=\s*)(\d+(?:\.\d+)?)\s*(units?|feet?|ft|cm|m|inches?|in)/gi,'$1<strong>$2 $3</strong>')
    .replace(/(>\s*)(\d+(?:\.\d+)?)\s*(units?|feet?|ft|cm|m)/gi,'$1<strong>$2 $3</strong>')
    .replace(/([A-Z][₁₂₃₄]?\s*=\s*)\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g,'$1<strong>($2, $3)</strong>')
    .replace(/(\b|,\s*)\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g,'$1<strong>($2, $3)</strong>')
    .replace(/(Width|Length|Height|Area|Distance|Difference)\s*=\s*(\d+(?:\.\d+)?)/gi,'<strong>$1</strong> = <strong>$2</strong>')
    .replace(/(\d+(?:\.\d+)?)\s*(ft|feet|units?|inches?|in|cm|m)\s*(>|<|≥|≤)\s*(\d+(?:\.\d+)?)\s*(ft|feet|units?|inches?|in|cm|m)/g,'<strong>$1 $2</strong> $3 <strong>$4 $5</strong>');
}

// ── Replicate SolutionViewer splitIntoPoints ──
function splitIntoPoints(text){
  const sentences=[];
  let clean=text
    .replace(/e\.g\./g,"⦿eg⦿")
    .replace(/i\.e\./g,"⦿ie⦿")
    .replace(/Fig\./g,"⦿Fig⦿")
    .replace(/etc\./g,"⦿etc⦿");
  const parts=clean.split(/(?<=\.)\s+(?=[A-Z\$\\({\[„«])/);
  for(const part of parts){
    let restored=part
      .replace(/⦿eg⦿/g,"e.g.")
      .replace(/⦿ie⦿/g,"i.e.")
      .replace(/⦿Fig⦿/g,"Fig.")
      .replace(/⦿etc⦿/g,"etc.")
      .trim();
    if(restored)sentences.push(restored);
  }
  if(sentences.length<=1&&text.length>60){
    const byNewline=text.split(/\n/).map(s=>s.trim()).filter(Boolean);
    if(byNewline.length>1)return byNewline;
    return [text.trim()];
  }
  return sentences;
}

// ── Replicate SolutionViewer renderPointwiseContent (the REAL step path) ──
function renderPointwiseContent(content){
  const headingMatch=content.match(/^\*\*([^*]+?)\*\*:?\s*/);
  let heading="", body=content;
  if(headingMatch){heading=headingMatch[1].replace(/:$/,"").trim();body=content.slice(headingMatch[0].length).trim();}
  let html="";
  if(heading){
    html+=`<div class="sv-pw-heading">${toUnicodeSubscripts(latexToPlainText(heading).replace(/\$([^$]+)\$/g,"<strong>$1</strong>"))}</div>`;
  }
  const hasDashList=/^-\s/m.test(body);
  const hasTable=/\|.+\|/.test(body)&&/\|[- ]+\|/.test(body);
  const hasOrderedList=/^\d+\.\s/m.test(body);
  if(hasDashList||hasTable||hasOrderedList){
    html+=`<div class="sv-pw-body">`;
    if(hasDashList){
      const rendered=body.split(/\n/).map((line)=>{
        if(/^\s*$/.test(line))return '<div class="sv-pw-spacer"></div>';
        const isDash=/^-\s/.test(line);
        const text=isDash?line.replace(/^-\s+/,""):line;
        return `<div class="sv-pw-item">${renderContent(smartBold(text.trim()))}</div>`;
      }).join("");
      html+=rendered;
    } else {
      html+=renderContent(smartBold(body));
    }
    html+=`</div>`;
  } else {
    const rawPoints=splitIntoPoints(body);
    if(rawPoints.length>0){
      html+=`<ul class="sv-pw-list">`;
      for(const point of rawPoints){
        html+=`<li class="sv-pw-item">${renderContent(smartBold(point))}</li>`;
      }
      html+=`</ul>`;
    }
  }
  return html;
}

// ── Scan all files ──
const base="C:/Users/user/Downloads/StudyVerse/studyverse-next/src/data/solutions/class-9/Mathematics";
const dirs=fs.readdirSync(base);
const RAW=/\\[a-zA-Z]+|\\[^a-zA-Z\s]|\^\{|\$\$|\$[^$]/;
let total=0, issues=0;
const issueList=[];
for(const d of dirs){
  const full=path.join(base,d);
  if(!fs.statSync(full).isDirectory())continue;
  for(const f of fs.readdirSync(full)){
    if(!f.endsWith(".json"))continue;
    const data=JSON.parse(fs.readFileSync(path.join(full,f),"utf8"));
    for(const q of data.questions||[]){
      total++;
      const fields={question:q.question,answer:q.answer||"",notes:q.notes||"",formula:q.formulaBox?.content||""};
      for(const [k,v] of Object.entries(fields)){
        const out=renderContent(v);
        if(RAW.test(out)){
          issues++;
          if(issueList.length<40)issueList.push(`${d}/${f} Q${q.questionNumber} [${k}]: ${out.slice(0,140)}`);
        }
      }
      // Solution steps go through the REAL renderPointwiseContent path
      for(const s of q.solution||[]){
        const out=renderPointwiseContent(s.content||"");
        if(RAW.test(out)){
          issues++;
          if(issueList.length<40)issueList.push(`${d}/${f} Q${q.questionNumber} step${s.step} [solution]: ${out.slice(0,140)}`);
        }
      }
      total++;
    }
  }
}
console.log("Questions scanned:",total);
console.log("Fields with remaining raw LaTeX:",issues);
if(issueList.length)console.log(issueList.join("\n"));
else console.log("CLEAN: No raw LaTeX remains after pipeline");