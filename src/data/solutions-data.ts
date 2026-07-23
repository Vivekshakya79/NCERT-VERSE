import { ChapterSolutions, Exercise, QuestionSolution } from "@/types";

// ============================================================
// SOLUTIONS DATA — Ganita Manjari (Class 9 Mathematics)
// Each exercise is stored in a separate JSON file under:
//   src/data/solutions/class-{classId}/{subject}/chapter-{chapterIdx}/
// ============================================================

// Import Class 9 Mathematics exercise JSON files
import class9Ch0Ex1_1 from "./solutions/class-9/Mathematics/chapter-0/exercise-1.1.json";
import class9Ch1Ex2_1 from "./solutions/class-9/Mathematics/chapter-1/exercise-2.1.json";
import class9Ch2Ex3_1 from "./solutions/class-9/Mathematics/chapter-2/exercise-3.1.json";

// ============================================================
// CHAPTER MANIFEST
// Maps class-subject-chapter keys to their metadata and exercises.
// Add new chapters here by importing the JSON file and adding an entry.
// ============================================================
const chapterManifest: Record<string, ChapterSolutions> = {
  // Class 9 — Mathematics — Chapter 0: Number Systems
  "9-mathematics-0": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Number Systems",
    exercises: [class9Ch0Ex1_1 as unknown as Exercise],
  },
  // Class 9 — Mathematics — Chapter 1: Polynomials
  "9-mathematics-1": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 1,
    chapterName: "Polynomials",
    exercises: [class9Ch1Ex2_1 as unknown as Exercise],
  },
  // Class 9 — Mathematics — Chapter 2: Coordinate Geometry
  "9-mathematics-2": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 2,
    chapterName: "Coordinate Geometry",
    exercises: [class9Ch2Ex3_1 as unknown as Exercise],
  },
};

// Helper to get solution by chapter key
export function getChapterSolutionsKey(classId: number, subject: string, chapterIdx: number): string {
  return `${classId}-${subject.toLowerCase()}-${chapterIdx}`;
}

// Get all exercises for a chapter
export function getExercisesForChapter(classId: number, subject: string, chapterIdx: number): Exercise[] {
  const key = getChapterSolutionsKey(classId, subject, chapterIdx);
  return chapterManifest[key]?.exercises || [];
}

// Get all questions for a specific exercise in a chapter
export function getQuestionsForExercise(
  classId: number,
  subject: string,
  chapterIdx: number,
  exerciseName: string
): QuestionSolution[] {
  const exercises = getExercisesForChapter(classId, subject, chapterIdx);
  const exercise = exercises.find((e) => e.name === exerciseName);
  return exercise?.questions || [];
}

// Get a specific question by ID
export function getQuestionById(questionId: string): QuestionSolution | undefined {
  for (const key of Object.keys(chapterManifest)) {
    const chapter = chapterManifest[key];
    for (const exercise of chapter.exercises) {
      const question = exercise.questions.find((q) => q.id === questionId);
      if (question) return question;
    }
  }
  return undefined;
}

// Search across all solutions
export function searchSolutions(query: string): Array<{
  chapterName: string;
  exerciseName: string;
  question: QuestionSolution;
  classId: number;
  subject: string;
  chapterIdx: number;
}> {
  if (!query || query.length < 2) return [];
  const lq = query.toLowerCase();
  const results: Array<{
    chapterName: string;
    exerciseName: string;
    question: QuestionSolution;
    classId: number;
    subject: string;
    chapterIdx: number;
  }> = [];

  for (const key of Object.keys(chapterManifest)) {
    const chapter = chapterManifest[key];
    for (const exercise of chapter.exercises) {
      for (const question of exercise.questions) {
        const searchText = `${question.questionNumber} ${question.question} ${question.answer || ""} ${question.notes || ""} ${exercise.name} ${chapter.chapterName}`.toLowerCase();
        if (searchText.includes(lq)) {
          results.push({
            chapterName: chapter.chapterName,
            exerciseName: exercise.name,
            question,
            classId: chapter.classId,
            subject: chapter.subject,
            chapterIdx: chapter.chapterIdx,
          });
        }
      }
    }
  }

  return results.slice(0, 20);
}

// Check if a chapter has solutions
export function hasChapterSolutions(classId: number, subject: string, chapterIdx: number): boolean {
  const key = getChapterSolutionsKey(classId, subject, chapterIdx);
  return key in chapterManifest;
}

// Get all chapter keys that have solutions
export function getAvailableSolutionChapters(): string[] {
  return Object.keys(chapterManifest);
}

// Export the manifest for direct access
export { chapterManifest };
