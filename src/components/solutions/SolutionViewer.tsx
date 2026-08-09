"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileEdit,
  CheckCircle,
  Lightbulb,
  Ruler,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
  AlertTriangle,
  Target,
  Zap,
  ArrowLeft,
  Maximize2,
  X,
} from "lucide-react";
import {
  QuestionSolution,
  Exercise,
} from "@/types";
import { toUnicodeSubscripts } from "@/lib/subscripts";
import { latexToPlainText } from "@/lib/latex";
import GeometryDiagram from "./GeometryDiagram";

interface SolutionViewerProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  exercises: Exercise[];
  currentExercise: string;
  currentQuestionId: string;
}

// ─── Content Rendering ───────────────────────────────────────────────────────

function renderLatex(text: string): string {
  return text
    .replace(/\$\$(.+?)\$\$/g, (_m, content) =>
      `<span class="sv-latex-block">${toUnicodeSubscripts(content)}</span>`)
    .replace(/\$(.+?)\$/g, (_m, content) =>
      `<span class="sv-latex">${toUnicodeSubscripts(content)}</span>`);
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

function renderContent(text: string): string {
  // Convert any remaining underscore subscripts (including ones that arrive
  // via content where the `$` delimiters were already stripped, e.g. quick
  // revision / key-formula bullets) into proper Unicode subscripts.
  return toUnicodeSubscripts(renderLatex(renderMarkdown(latexToPlainText(text))));
}

// ─── Point-wise Content Parser ──────────────────────────────────────────────

/** Split text into individual bullet points by detecting sentence boundaries */
function splitIntoPoints(text: string): string[] {
  // Split on sentence-ending periods that are followed by a space and capital letter
  // But protect things like "e.g.", "i.e.", "Fig.", numbers with decimals, etc.
  const sentences: string[] = [];
  
  // First, protect protected abbreviations
  let clean = text
    .replace(/e\.g\./g, "⦿eg⦿")
    .replace(/i\.e\./g, "⦿ie⦿")
    .replace(/Fig\./g, "⦿Fig⦿")
    .replace(/etc\./g, "⦿etc⦿");
  
  // Split on ". " or ".\n" or ".\r\n" patterns that indicate sentence boundaries
  const parts = clean.split(/(?<=\.)\s+(?=[A-Z\$\\({\[„«])/);
  
  for (const part of parts) {
    // Restore protected abbreviations
    let restored = part
      .replace(/⦿eg⦿/g, "e.g.")
      .replace(/⦿ie⦿/g, "i.e.")
      .replace(/⦿Fig⦿/g, "Fig.")
      .replace(/⦿etc⦿/g, "etc.")
      .trim();
    if (restored) sentences.push(restored);
  }
  
  // If splitting didn't work well, treat the whole thing as one point
  if (sentences.length <= 1 && text.length > 60) {
    // Try splitting on newlines instead
    const byNewline = text.split(/\n/).map(s => s.trim()).filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    return [text.trim()];
  }
  
  return sentences;
}

/** Auto-bold coordinate patterns, key values, and mathematical expressions */
function smartBold(text: string): string {
  // Bold coordinate tuples like (8.5, 0) when preceded by a point name
  // e.g., "D₁ = (8.5, 0)" → "D₁ = **(8.5, 0)**"
  let result = text
    // Bold final numeric results after equals
    .replace(/(=\s*)(\d+(?:\.\d+)?)\s*(units?|feet?|ft|cm|m|inches?|in)/gi, '$1<strong>$2 $3</strong>')
    // Bold comparison results
    .replace(/(>\s*)(\d+(?:\.\d+)?)\s*(units?|feet?|ft|cm|m)/gi, '$1<strong>$2 $3</strong>')
    // Bold point = coordinate patterns
    .replace(/([A-Z][₁₂₃₄]?\s*=\s*)\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g, '$1<strong>($2, $3)</strong>')
    // Bold standalone coordinate tuples
    .replace(/(\b|,\s*)\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/g, '$1<strong>($2, $3)</strong>')
    // Bold width/distance/area results
    .replace(/(Width|Length|Height|Area|Distance|Difference)\s*=\s*(\d+(?:\.\d+)?)/gi, '<strong>$1</strong> = <strong>$2</strong>')
    // Bold key numeric relationships
    .replace(/(\d+(?:\.\d+)?)\s*(ft|feet|units?|inches?|in|cm|m)\s*(>|<|≥|≤)\s*(\d+(?:\.\d+)?)\s*(ft|feet|units?|inches?|in|cm|m)/g, '<strong>$1 $2</strong> $3 <strong>$4 $5</strong>');
  return result;
}

/** Render step content as structured point-wise HTML */
function renderPointwiseContent(content: string): string {
  // Extract the bold heading if present (e.g., "**Understanding the diagram:**")
  const headingMatch = content.match(/^\*\*([^*]+?)\*\*:?\s*/);
  let heading = "";
  let body = content;
  
  if (headingMatch) {
    heading = headingMatch[1].replace(/:$/, "").trim();
    body = content.slice(headingMatch[0].length).trim();
  }
  
  // Build HTML
  let html = "";
  
  if (heading) {
    const boldedHeading = toUnicodeSubscripts(
      latexToPlainText(heading).replace(/\$([^$]+)\$/g, "<strong>$1</strong>")
    );
    html += `<div class="sv-pw-heading">${boldedHeading}</div>`;
  }
  
  // Detect if content already has structured formatting (dash lists, tables)
  const hasDashList = /^-\s/m.test(body);
  const hasTable = /\|.+\|/.test(body) && /\|[- ]+\|/.test(body);
  const hasOrderedList = /^\d+\.\s/m.test(body);
  
  if (hasDashList || hasTable || hasOrderedList) {
    // Render as-is (preserve existing structure like dash lists, tables)
    // Don't double-wrap in bullet points
    html += `<div class="sv-pw-body">`;
    if (hasDashList) {
      // Route EVERY line through the math pipeline so no raw LaTeX escapes.
      // Dash lines become bulleted items; other lines (e.g. $$...$$ display
      // math, continuation lines) are rendered through the same renderContent
      // pipeline so \frac, \sqrt, $$, \[ \] etc. never reach the HTML raw.
      const rendered = body
        .split(/\n/)
        .map((line) => {
          if (/^\s*$/.test(line)) return '<div class="sv-pw-spacer"></div>';
          const isDash = /^-\s/.test(line);
          const text = isDash ? line.replace(/^-\s+/, "") : line;
          const smartBolded = smartBold(text.trim());
          return `<div class="sv-pw-item">${renderContent(smartBolded)}</div>`;
        })
        .join("");
      html += rendered;
    } else {
      html += renderContent(smartBold(body));
    }
    html += `</div>`;
  } else {
    // Split remaining text into sentences/points for paragraph content
    const rawPoints = splitIntoPoints(body);
    
    if (rawPoints.length > 0) {
      html += `<ul class="sv-pw-list">`;
      for (const point of rawPoints) {
        const smartBolded = smartBold(point);
        const rendered = renderContent(smartBolded);
        html += `<li class="sv-pw-item">${rendered}</li>`;
      }
      html += `</ul>`;
    }
  }
  
  return html;
}

/** Render question text with sub-question badges highlighted */
function renderQuestionContent(text: string): string {
  // First standard render
  let html = renderContent(text);
  // Wrap sub-question markers (i), (ii), (iii), (iv), etc. in badges
  html = html.replace(
    /\(([ivx]+)\)/gi,
    '<span class="sv-qpart">($1)</span>'
  );
  return html;
}

// ─── Notes Parser ────────────────────────────────────────────────────────────

interface ParsedNotes {
  commonMistakes: string | null;
  examTip: string | null;
  remaining: string | null;
}

function parseNotes(notes: string): ParsedNotes {
  let text = notes;
  let commonMistakes: string | null = null;
  let examTip: string | null = null;

  // Extract Common Mistake section
  const cmRegex = /\*\*Common Mistakes?\s*:\*\*([\s\S]*?)(?=\*\*(?:Exam Tip|Remember|Think|Key|Real-life|Alternative|Why|Historical|Reflection|Algebraic|Note)\s*:|$)/i;
  const cmMatch = text.match(cmRegex);
  if (cmMatch) {
    commonMistakes = cmMatch[1].trim();
    text = text.replace(cmMatch[0], "").trim();
  } else {
    // Try non-bold format
    const cmRegex2 = /Common Mistakes?\s*:\s*([\s\S]*?)(?=\*\*(?:Exam Tip|Remember|Think|Key|Real-life|Alternative|Why|Historical|Reflection|Algebraic|Note)\s*:|$)/i;
    const cmMatch2 = text.match(cmRegex2);
    if (cmMatch2) {
      commonMistakes = cmMatch2[1].trim();
      text = text.replace(cmMatch2[0], "").trim();
    }
  }

  // Extract Exam Tip section
  const etRegex = /\*\*Exam Tip\s*:\*\*([\s\S]*?)(?=\*\*(?:Common Mistake|Remember|Think|Key|Real-life|Alternative|Why|Historical|Reflection|Algebraic|Note)\s*:|$)/i;
  const etMatch = text.match(etRegex);
  if (etMatch) {
    examTip = etMatch[1].trim();
    text = text.replace(etMatch[0], "").trim();
  } else {
    const etRegex2 = /Exam Tip\s*:\s*([\s\S]*?)(?=\*\*(?:Common Mistake|Remember|Think|Key|Real-life|Alternative|Why|Historical|Reflection|Algebraic|Note)\s*:|$)/i;
    const etMatch2 = text.match(etRegex2);
    if (etMatch2) {
      examTip = etMatch2[1].trim();
      text = text.replace(etMatch2[0], "").trim();
    }
  }

  // Clean up remaining
  let remaining: string | null = text.trim();
  if (remaining && !/[\w\d]/.test(remaining.replace(/<br\s*\/?>/g, ""))) {
    remaining = null;
  }

  // Remove leading/trailing <br /> separators
  if (remaining) {
    remaining = remaining.replace(/^(<br\s*\/?>\s*)+/, "").replace(/(<br\s*\/?>\s*)+$/, "").trim();
    if (!remaining) remaining = null;
  }

  return { commonMistakes, examTip, remaining };
}

// ─── Quick Revision Generator ────────────────────────────────────────────────

function generateQuickRevision(question: QuestionSolution): string[] {
  const bullets: string[] = [];
  const allText = question.solution.map(s => s.content).join(" ") + " " + (question.answer || "");
  const notesText = question.notes || "";

  // Extract key formula references
  const formulaMatch = allText.match(/\$[^$]+\$/g);
  if (formulaMatch && formulaMatch.length > 0) {
    // Take first meaningful formula as a key point
    bullets.push(`Key formula: ${formulaMatch[0].replace(/^\$|\$$/g, "")}`);
  }

  // Extract method/approach names
  const methodMatches = allText.match(/\*\*Method[^:]*:?\*\*/g);
  if (methodMatches) {
    for (const m of methodMatches.slice(0, 2)) {
      bullets.push(m.replace(/\*\*/g, ""));
    }
  }

  // Extract "Remember" or key insight
  const rememberMatch = allText.match(/\*\*Remember\s*:\*\*\s*([^.\n]+)/i);
  if (rememberMatch) {
    bullets.push(rememberMatch[1].trim());
  }

  // Extract exam tip as bullet
  const examTipMatch = notesText.match(/\*\*Exam Tip\s*:\*\*\s*([^.\n]+)/i);
  if (examTipMatch) {
    bullets.push(examTipMatch[1].trim());
  }

  // Extract key concept from solution (bold phrases that are meaningful)
  const keyMatches = allText.match(/\*\*([^:]{3,60}?)\*\*/g);
  if (keyMatches) {
    const filtered = keyMatches
      .map(k => k.replace(/\*\*/g, ""))
      .filter(k => k.length > 8 && !k.includes("Step") && !k.includes("Conclusion"))
      .slice(0, 3);
    for (const k of filtered) {
      if (!bullets.includes(k)) bullets.push(k);
    }
  }

  // Extract important bold headings from solution steps
  if (bullets.length < 2) {
    for (const step of question.solution) {
      const headingMatch = step.content.match(/\*\*([^*]{5,60}?):\*\*/);
      if (headingMatch) {
        const clean = headingMatch[1].trim();
        if (clean.length > 5 && !bullets.includes(clean)) {
          bullets.push(clean);
        }
      }
    }
  }

  // Ensure we have at least 3 bullets by extracting key phrases
  if (bullets.length < 3) {
    // Extract key terms from the solution
    const keyTerms = [
      "distance from y-axis = x-coordinate",
      "distance from x-axis = y-coordinate",
      "coordinates are written as (x, y)"
    ];
    for (const term of keyTerms) {
      if (allText.toLowerCase().includes(term.substring(0, 10))) {
        if (!bullets.includes(term)) bullets.push(term);
      }
    }
    // If still not enough, derive from step content
    if (bullets.length < 2) {
      const firstLines = question.solution
        .slice(0, 3)
        .map(s => {
          const match = s.content.match(/\*\*([^*]+)\*\*/);
          return match ? match[1].replace(/:$/, "") : null;
        })
        .filter(Boolean);
      for (const line of firstLines) {
        if (line && !bullets.includes(line)) bullets.push(line);
      }
    }
  }

  return bullets.slice(0, 5);
}

// ─── Table View ──────────────────────────────────────────────────────────────

function TableView({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="sv-table-wrap">
      <table className="sv-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} dangerouslySetInnerHTML={{ __html: renderContent(h) }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} dangerouslySetInnerHTML={{ __html: renderContent(cell) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Diagram View (with click-to-zoom) ──────────────────────────────────────

function DiagramView({ diagram }: { diagram: NonNullable<QuestionSolution["diagram"]> }) {
  const [zoomed, setZoomed] = useState(false);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setZoomed(false);
  }, []);

  // Data-driven geometry figures render through the reusable figure engine,
  // which handles progressive construction stages and its own zoom overlay.
  if (diagram.type === "geometry") {
    return (
      <GeometryDiagram
        data={diagram.geometry!}
        stages={diagram.stages}
        caption={diagram.caption}
      />
    );
  }

  const content = diagram.type === "svg" ? (
    <div className="sv-diagram-svg" dangerouslySetInnerHTML={{ __html: diagram.content || "" }} />
  ) : (
    <img
      src={diagram.content}
      alt={diagram.caption || "Diagram"}
      className="sv-diagram-img"
      loading="lazy"
    />
  );

  return (
    <>
      <div className="sv-diagram">
        <button
          className="sv-diagram-zoom"
          onClick={() => setZoomed(true)}
          aria-label="Zoom diagram"
          title="Click to zoom"
        >
          <Maximize2 size={14} />
        </button>
        <div className="sv-diagram-inner">{content}</div>
        {diagram.caption && <p className="sv-diagram-cap">{diagram.caption}</p>}
      </div>
      {zoomed && (
        <div
          className="sv-diagram-overlay"
          onClick={() => setZoomed(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Diagram zoomed view"
          tabIndex={-1}
        >
          <button className="sv-diagram-close" onClick={() => setZoomed(false)} aria-label="Close zoom">
            <X size={20} />
          </button>
          <div className="sv-diagram-overlay-content" onClick={e => e.stopPropagation()}>
            {content}
            {diagram.caption && <p className="sv-diagram-cap">{diagram.caption}</p>}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Info Box Component ─────────────────────────────────────────────────────

interface InfoBoxProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  variant?: "blue" | "green" | "orange" | "purple" | "teal" | "yellow" | "rose" | "indigo";
  className?: string;
}

function InfoBox({ icon, label, children, variant = "blue", className = "" }: InfoBoxProps) {
  return (
    <div className={`sv-box sv-box-${variant} ${className}`}>
      <div className="sv-box-header">
        <span className={`sv-box-badge sv-box-badge-${variant}`}>
          {icon}
          {label}
        </span>
      </div>
      <div className="sv-box-body">{children}</div>
    </div>
  );
}

// ─── Main SolutionViewer Component ──────────────────────────────────────────

export default function SolutionViewer({
  classId,
  subject,
  chapterIdx,
  chapterName,
  exercises,
  currentExercise,
  currentQuestionId,
}: SolutionViewerProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  // Find current exercise
  const exercise = useMemo(
    () => exercises.find((e) => e.name === currentExercise),
    [exercises, currentExercise]
  );

  // Find current question index
  const currentQIndex = useMemo(
    () => (exercise ? exercise.questions.findIndex((q) => q.id === currentQuestionId) : -1),
    [exercise, currentQuestionId]
  );

  const question = useMemo(
    () => (exercise ? exercise.questions[currentQIndex] : undefined),
    [exercise, currentQIndex]
  );

  const totalQuestions = exercise?.questions.length || 0;

  // Parse notes
  const parsedNotes = useMemo(
    () => (question?.notes ? parseNotes(question.notes) : { commonMistakes: null, examTip: null, remaining: null }),
    [question?.notes]
  );

  // Quick revision bullets
  const revisionBullets = useMemo(
    () => (question ? generateQuickRevision(question) : []),
    [question]
  );

  // Navigation handlers
  const goToQuestion = useCallback(
    (qIdx: number) => {
      if (!exercise || qIdx < 0 || qIdx >= exercise.questions.length) return;
      const q = exercise.questions[qIdx];
      router.push(
        `/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}/exercise/${encodeURIComponent(currentExercise)}/${q.id}`
      );
    },
    [exercise, classId, subject, chapterIdx, currentExercise, router]
  );

  const goToExercise = useCallback(
    (exName: string) => {
      const ex = exercises.find((e) => e.name === exName);
      if (!ex || ex.questions.length === 0) return;
      router.push(
        `/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}/exercise/${encodeURIComponent(exName)}/${ex.questions[0].id}`
      );
    },
    [exercises, classId, subject, chapterIdx, router]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && currentQIndex > 0) goToQuestion(currentQIndex - 1);
      if (e.key === "ArrowRight" && currentQIndex < totalQuestions - 1) goToQuestion(currentQIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentQIndex, totalQuestions, goToQuestion]);

  // ─── Empty State ─────────────────────────────────────────────────────────

  if (!exercise || !question) {
    return (
      <div className="sv-empty">
        <div className="sv-empty-ic"><FileEdit size={48} /></div>
        <h3 className="sv-empty-h">No solutions available yet</h3>
        <p className="sv-empty-p">Solutions for this exercise are being prepared by our academic team.</p>
        <Link href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`} className="sv-btn sv-btn-primary">
          <ArrowLeft size={16} /> Back to Chapter
        </Link>
      </div>
    );
  }

  const progressPercent = totalQuestions > 0 ? ((currentQIndex + 1) / totalQuestions) * 100 : 0;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="sv-wrap">
      {/* ── Top Meta Bar ── */}
      <div className="sv-meta">
        <div className="sv-meta-left">
          <Link
            href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`}
            className="sv-meta-back"
            aria-label="Back to chapter"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="sv-meta-subject">{subject}</div>
            <div className="sv-meta-chapter">Ch {chapterIdx + 1}: {chapterName}</div>
          </div>
        </div>
        <div className="sv-meta-right">
          <span className="sv-meta-exercise">{currentExercise}</span>
          <span className="sv-meta-qnum">Q{question.questionNumber}</span>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="sv-progress">
        <div className="sv-progress-info">
          <span className="sv-progress-label">Question {currentQIndex + 1} of {totalQuestions}</span>
          <span className="sv-progress-pct">{Math.round(progressPercent)}%</span>
        </div>
        <div className="sv-progress-track">
          <div className="sv-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* ── Exercise Tabs ── */}
      <div className="sv-tabs" role="tablist" aria-label="Exercise selector">
        {exercises.map((ex) => (
          <button
            key={ex.name}
            role="tab"
            aria-selected={ex.name === currentExercise}
            className={`sv-tab ${ex.name === currentExercise ? "on" : ""}`}
            onClick={() => goToExercise(ex.name)}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* ── Question Number Nav ── */}
      <div className="sv-qnav" role="navigation" aria-label="Question navigation">
        {exercise.questions.map((q, i) => (
          <button
            key={q.id}
            className={`sv-qdot ${q.id === currentQuestionId ? "on" : ""}`}
            onClick={() => goToQuestion(i)}
            title={`Question ${q.questionNumber}`}
            aria-label={`Go to question ${q.questionNumber}`}
          >
            {q.questionNumber}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* QUESTION CARD */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="sv-section sv-fade-in" aria-labelledby="sv-question-heading">
        <div className="sv-qcard">
          <div className="sv-qcard-top">
            <span className="sv-qcard-badge">
              <BookOpen size={14} />
              {currentExercise} · Q{question.questionNumber}
            </span>
            {question.verified && (
              <span className="sv-qcard-verified">
                <CheckCircle size={14} />
                Verified
              </span>
            )}
          </div>
          <div className="sv-qcard-body">
            <div
              className="sv-qcard-text"
              dangerouslySetInnerHTML={{ __html: renderQuestionContent(question.question) }}
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* SOLUTION HEADER */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="sv-sol-header sv-fade-in">
        <div className="sv-sol-header-icon">
          <Lightbulb size={22} />
        </div>
        <div>
          <h2 className="sv-sol-header-h">Step-by-Step Solution</h2>
          <p className="sv-sol-header-p">Understand every step with clear explanations.</p>
        </div>
        <div className="sv-sol-header-line" />
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* SOLUTION STEPS — Point-wise format */}
      {/* ════════════════════════════════════════════════════════════ */}
      <section className="sv-section sv-fade-in" aria-label="Solution steps">
        <div className="sv-steps sv-steps-pointwise">
          {question.solution.map((step, idx) => (
            <div key={step.step} className="sv-step" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="sv-step-num">{step.step}</div>
              <div className="sv-step-line" />
              <div className="sv-step-body">
                <div
                  className="sv-step-content sv-step-pw"
                  dangerouslySetInnerHTML={{ __html: renderPointwiseContent(step.content) }}
                />
                {question.diagram && question.diagram.stepIndex === step.step && (
                  <div className="sv-step-diagram">
                    <DiagramView diagram={question.diagram} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* DIAGRAM (bottom placement for diagrams without a step index) */}
      {/* ════════════════════════════════════════════════════════════ */}
      {question.diagram && question.diagram.stepIndex === undefined && (
        <section className="sv-section sv-fade-in" aria-label="Diagram">
          <InfoBox icon={<Ruler size={16} />} label="Diagram" variant="teal">
            <DiagramView diagram={question.diagram} />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TABLE */}
      {/* ════════════════════════════════════════════════════════════ */}
      {question.tableData && (
        <section className="sv-section sv-fade-in" aria-label="Data table">
          <InfoBox icon={<ChartColumn size={16} />} label="Table" variant="indigo">
            <TableView headers={question.tableData.headers} rows={question.tableData.rows} />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FINAL ANSWER */}
      {/* ════════════════════════════════════════════════════════════ */}
      {question.answer && (
        <section className="sv-section sv-fade-in" aria-label="Final answer">
          <div className="sv-answer-box">
            <div className="sv-answer-icon"><CheckCircle size={20} /></div>
            <div className="sv-answer-h">Final Answer</div>
            <div
              className="sv-answer-content"
              dangerouslySetInnerHTML={{ __html: renderContent(question.answer) }}
            />
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* KEY CONCEPT (from formulaBox) */}
      {/* ════════════════════════════════════════════════════════════ */}
      {question.formulaBox && (
        <section className="sv-section sv-fade-in" aria-label="Key concept">
          <InfoBox icon={<Brain size={16} />} label="Key Concept" variant="orange">
            {question.formulaBox.title && (
              <p className="sv-box-formula-title">{question.formulaBox.title}</p>
            )}
            <div
              className="sv-box-formula-content"
              dangerouslySetInnerHTML={{ __html: renderContent(question.formulaBox.content) }}
            />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* COMMON MISTAKES */}
      {/* ════════════════════════════════════════════════════════════ */}
      {parsedNotes.commonMistakes && (
        <section className="sv-section sv-fade-in" aria-label="Common mistakes">
          <InfoBox icon={<AlertTriangle size={16} />} label="Common Mistakes" variant="rose">
            <div
              className="sv-box-text"
              dangerouslySetInnerHTML={{ __html: renderContent(parsedNotes.commonMistakes) }}
            />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* EXAM TIP */}
      {/* ════════════════════════════════════════════════════════════ */}
      {parsedNotes.examTip && (
        <section className="sv-section sv-fade-in" aria-label="Exam tip">
          <InfoBox icon={<Target size={16} />} label="CBSE Exam Tip" variant="yellow">
            <div
              className="sv-box-text"
              dangerouslySetInnerHTML={{ __html: renderContent(parsedNotes.examTip) }}
            />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ADDITIONAL NOTES */}
      {/* ════════════════════════════════════════════════════════════ */}
      {parsedNotes.remaining && (
        <section className="sv-section sv-fade-in" aria-label="Additional notes">
          <InfoBox icon={<FileEdit size={16} />} label="Note" variant="blue">
            <div
              className="sv-box-text"
              dangerouslySetInnerHTML={{ __html: renderContent(parsedNotes.remaining) }}
            />
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* QUICK REVISION */}
      {/* ════════════════════════════════════════════════════════════ */}
      {revisionBullets.length > 0 && (
        <section className="sv-section sv-fade-in" aria-label="Quick revision">
          <InfoBox icon={<Zap size={16} />} label="Quick Revision" variant="purple">
            <ul className="sv-revision-list">
              {revisionBullets.map((bullet, i) => (
                <li key={i} className="sv-revision-item">
                  <span className="sv-revision-bullet" />
                  <span
                    dangerouslySetInnerHTML={{ __html: renderContent(bullet) }}
                  />
                </li>
              ))}
            </ul>
          </InfoBox>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* NAVIGATION BUTTONS */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="sv-nav">
        <button
          className="sv-btn sv-btn-ghost"
          disabled={currentQIndex <= 0}
          onClick={() => goToQuestion(currentQIndex - 1)}
          aria-label="Previous question"
        >
          <ChevronLeft size={18} />
          <span className="sv-btn-label">Previous</span>
        </button>

        <Link
          href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`}
          className="sv-btn sv-btn-outline"
          aria-label="Back to chapter"
        >
          <BookOpen size={16} />
          <span className="sv-btn-label">Chapter</span>
        </Link>

        <button
          className="sv-btn sv-btn-primary"
          disabled={currentQIndex >= totalQuestions - 1}
          onClick={() => goToQuestion(currentQIndex + 1)}
          aria-label="Next question"
        >
          <span className="sv-btn-label">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
