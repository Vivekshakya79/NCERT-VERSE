export interface Class {
  id: number;
  name: string;
  subjects: string[];
  hiddenSubjects?: string[];
}



export interface ChapterEntry {
  classId: number;
  subject: string;
  chapters: string[];
}

export interface ChapterData {
  [key: string]: string[];
}

export interface BookmarkItem {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  time: number;
}

export interface HistoryItem {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  label: string;
  time: number;
}

export interface SearchResult {
  title: string;
  meta: string;
  href: string;
}

export interface AITool {
  icon: string;
  name: string;
  description: string;
}

// ─── AI Doubt Solver ─────────────────────────────────────────────────────────
export type AIMessageRole = "user" | "assistant";

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  image?: string | null; // base64 data URL for user-uploaded images
  createdAt: number;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface DashboardStat {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
}

export interface ActivityItem {
  icon: string;
  title: string;
  meta: string;
}

export interface ProgressItem {
  name: string;
  percent: number;
}

export interface QuizOption {
  letter: string;
  value: string;
}

export interface AdminTab {
  id: string;
  label: string;
}

export interface ChapterSection {
  icon: string;
  title: string;
  status: "ready" | "coming-soon";
  description: string;
}

// Solution types
export interface SolutionStep {
  step: number;
  content: string; // Markdown + LaTeX
}

export interface FormulaBox {
  title: string;
  content: string; // LaTeX
}

export interface QuestionSolution {
  id: string;
  questionNumber: number;
  question: string; // Markdown + LaTeX
  solution: SolutionStep[];
  answer?: string;
  verified: boolean; // Whether the solution has been verified by subject experts
  formulaBox?: FormulaBox;
  diagram?: {
    type: "svg" | "canvas" | "image" | "geometry";
    content: string;
    caption?: string;
    /** Structured, data-driven figure data (when type === "geometry") */
    geometry?: import("@/lib/geometry/types").GeometryDiagramData;
    /** Progressive construction stages (optional) */
    stages?: import("@/lib/geometry/types").GeometryStage[];
    /** Solution step number where this figure belongs (optional) */
    stepIndex?: number;
  };
  notes?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface Exercise {
  name: string; // e.g., "Exercise 1.1"
  questions: QuestionSolution[];
}

export interface ChapterSolutions {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  exercises: Exercise[];
}

export interface SolutionsData {
  [key: string]: ChapterSolutions; // key: "{classId}-{subject}-{chapterIdx}"
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}
