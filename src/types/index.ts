export interface Class {
  id: number;
  name: string;
  subjects: string[];
  hiddenSubjects?: string[];
}

export interface SubjectIconMap {
  [key: string]: string;
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
  formulaBox?: FormulaBox;
  diagram?: {
    type: "svg" | "canvas" | "image";
    content: string;
    caption?: string;
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
