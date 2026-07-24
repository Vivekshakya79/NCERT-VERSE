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
  Book,
  AlertTriangle,
} from "lucide-react";
import {
  QuestionSolution,
  Exercise,
} from "@/types";

interface SolutionViewerProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  exercises: Exercise[];
  currentExercise: string;
  currentQuestionId: string;
}

function renderLatex(text: string): string {
  // Convert $$...$$ to styled spans
  let result = text
    .replace(/\$\$(.+?)\$\$/g, '<span class="sol-latex-block">$1</span>')
    .replace(/\$(.+?)\$/g, '<span class="sol-latex">$1</span>');
  return result;
}

function renderMarkdown(text: string): string {
  let html = text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Newlines to <br>
    .replace(/\n/g, "<br />");
  return html;
}

function renderContent(text: string): string {
  return renderLatex(renderMarkdown(text));
}

function TableView({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="sol-table-wrapper">
      <table className="sol-table">
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

function DiagramView({ diagram }: { diagram: NonNullable<QuestionSolution["diagram"]> }) {
  if (diagram.type === "svg") {
    return (
      <div className="sol-diagram">
        <div className="sol-diagram-inner" dangerouslySetInnerHTML={{ __html: diagram.content }} />
        {diagram.caption && <p className="sol-diagram-caption">{diagram.caption}</p>}
      </div>
    );
  }
  if (diagram.type === "image") {
    return (
      <div className="sol-diagram">
        <img
          src={diagram.content}
          alt={diagram.caption || "Diagram"}
          className="sol-diagram-img"
          loading="lazy"
        />
        {diagram.caption && <p className="sol-diagram-caption">{diagram.caption}</p>}
      </div>
    );
  }
  return null;
}

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

  // Find current exercise
  const exercise = useMemo(
    () => exercises.find((e) => e.name === currentExercise),
    [exercises, currentExercise]
  );

  // Find current question index within the exercise
  const currentQIndex = useMemo(
    () => (exercise ? exercise.questions.findIndex((q) => q.id === currentQuestionId) : -1),
    [exercise, currentQuestionId]
  );

  const question = useMemo(
    () => (exercise ? exercise.questions[currentQIndex] : undefined),
    [exercise, currentQIndex]
  );

  // Navigation
  const totalQuestions = exercise?.questions.length || 0;

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

  if (!exercise || !question) {
    return (
      <div className="sol-empty">
        <div className="sol-empty-icon"><FileEdit size={40} /></div>
        <h3>No solutions available yet</h3>
        <p>Solutions for this exercise are being prepared.</p>
        <Link href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`} className="btn btn-p">
          ← Back to Chapter
        </Link>
      </div>
    );
  }

  const progressPercent = totalQuestions > 0 ? ((currentQIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="sol-viewer">
      {/* Progress Header */}
      <div className="sol-progress">
        <div className="sol-progress-info">
          <span className="sol-progress-label">
            Question {currentQIndex + 1} of {totalQuestions}
          </span>
          <span className="sol-progress-pct">{Math.round(progressPercent)}%</span>
        </div>
        <div className="sol-progress-bar">
          <div className="sol-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Exercise Tabs */}
      <div className="sol-ex-tabs">
        {exercises.map((ex) => (
          <button
            key={ex.name}
            className={`sol-ex-tab ${ex.name === currentExercise ? "on" : ""}`}
            onClick={() => goToExercise(ex.name)}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Question Navigation */}
      <div className="sol-q-nav">
        {exercise.questions.map((q, i) => (
          <button
            key={q.id}
            className={`sol-q-dot ${q.id === currentQuestionId ? "on" : ""}`}
            onClick={() => goToQuestion(i)}
            title={`Question ${q.questionNumber}`}
          >
            {q.questionNumber}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="sol-card">
        <div className="sol-card-header">
          <span className="sol-badge">{currentExercise} · Q{question.questionNumber}</span>
          {question.verified && <span className="sol-badge sol-badge-verified"><CheckCircle size={14} style={{ marginRight: 4 }} /> Verified Solution</span>}
        </div>
        <div className="sol-question">
          <div
            className="sol-question-text"
            dangerouslySetInnerHTML={{ __html: renderContent(question.question) }}
          />
        </div>
      </div>

      {/* Solution Steps */}
      <div className="sol-card">
        <div className="sol-card-header">
          <span className="sol-badge sol-badge-green"><Lightbulb size={14} style={{ marginRight: 4 }} /> Step-by-Step Solution</span>
        </div>
        <div className="sol-steps">
          {question.solution.map((step) => (
            <div key={step.step} className="sol-step">
              <div className="sol-step-num">{step.step}</div>
              <div
                className="sol-step-content"
                dangerouslySetInnerHTML={{ __html: renderContent(step.content) }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Answer */}
      {question.answer && (
        <div className="sol-card sol-card-answer">
          <div className="sol-card-header">
            <span className="sol-badge sol-badge-purple"><CheckCircle size={14} style={{ marginRight: 4 }} /> Final Answer</span>
          </div>
          <div
            className="sol-answer"
            dangerouslySetInnerHTML={{ __html: renderContent(question.answer) }}
          />
        </div>
      )}

      {/* Formula Box */}
      {question.formulaBox && (
        <div className="sol-card sol-card-formula">
          <div className="sol-card-header">
            <span className="sol-badge sol-badge-orange"><Ruler size={14} style={{ marginRight: 4 }} /> Formula Box</span>
          </div>
          <div className="sol-formula-box">
            <h4 className="sol-formula-title">{question.formulaBox.title}</h4>
            <div
              className="sol-formula-content"
              dangerouslySetInnerHTML={{ __html: renderContent(question.formulaBox.content) }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      {question.tableData && (
        <div className="sol-card">
          <div className="sol-card-header">
            <span className="sol-badge sol-badge-blue"><ChartColumn size={14} style={{ marginRight: 4 }} /> Table</span>
          </div>
          <TableView headers={question.tableData.headers} rows={question.tableData.rows} />
        </div>
      )}

      {/* Diagram */}
      {question.diagram && (
        <div className="sol-card">
          <div className="sol-card-header">
            <span className="sol-badge sol-badge-teal"><Ruler size={14} style={{ marginRight: 4 }} /> Diagram</span>
          </div>
          <DiagramView diagram={question.diagram} />
        </div>
      )}

      {/* Notes */}
      {question.notes && (
        <div className="sol-card sol-card-notes">
          <div className="sol-card-header">
            <span className="sol-badge sol-badge-yellow"><FileEdit size={14} style={{ marginRight: 4 }} /> Note</span>
          </div>
          <div
            className="sol-notes"
            dangerouslySetInnerHTML={{ __html: renderContent(question.notes) }}
          />
        </div>
      )}

      {/* Prev / Next Navigation */}
      <div className="sol-nav-buttons">
        <button
          className="btn btn-s"
          disabled={currentQIndex <= 0}
          onClick={() => goToQuestion(currentQIndex - 1)}
        >
          ← Previous Question
        </button>
        <Link
          href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`}
          className="btn btn-s"
        >
          <Book size={16} style={{ marginRight: 6 }} /> Chapter
        </Link>
        <button
          className="btn btn-p"
          disabled={currentQIndex >= totalQuestions - 1}
          onClick={() => goToQuestion(currentQIndex + 1)}
        >
          Next Question →
        </button>
      </div>
    </div>
  );
}
