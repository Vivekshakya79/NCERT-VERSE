import type { Metadata } from "next";
import Link from "next/link";
import DoubtSolver from "@/components/ai/DoubtSolver";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

export const metadata: Metadata = {
  title: "AI Doubt Solver — StudyVerse",
  description:
    "Ask any doubt from your NCERT syllabus and get instant, step-by-step explanations with formulas, tables, and examples.",
  alternates: { canonical: "/ai/doubt-solver" },
  openGraph: {
    title: "AI Doubt Solver — StudyVerse",
    description: "Instant step-by-step NCERT doubt solving.",
    url: "https://studyverse.app/ai/doubt-solver",
  },
};

export default function DoubtSolverPage() {
  return (
    <div className="ai-page">
      <nav className="ai-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link href="/ai">AI Tools</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">AI Doubt Solver</span>
      </nav>
      <DoubtSolver />
    </div>
  );
}