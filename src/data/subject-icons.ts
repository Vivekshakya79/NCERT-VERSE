import { SubjectIconMap } from "@/types";

export const subjectIcons: SubjectIconMap = {
  Mathematics: "📐",
  Science: "🔬",
  "Social Science": "🌍",
  English: "📖",
  Hindi: "📝",
  Sanskrit: "🕉️",
  Physics: "⚛️",
  Chemistry: "🧪",
  Biology: "🧬",
  "Computer Science": "💻",
  Accountancy: "💰",
  "Business Studies": "🏢",
  Economics: "📊",
  "Physical Education": "🏃",
};

export function getSubjectIcon(subject: string): string {
  return subjectIcons[subject] || "📘";
}
