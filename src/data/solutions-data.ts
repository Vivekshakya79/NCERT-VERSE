import { ChapterSolutions, Exercise, QuestionSolution } from "@/types";

// ============================================================
// SOLUTIONS DATA — Ganita Manjari (Class 9 Mathematics)
// Each exercise is stored in a separate JSON file under:
//   src/data/solutions/class-{classId}/{subject}/chapter-{chapterIdx}/
// ============================================================

// Import Class 9 Mathematics exercise JSON files
import class9Ch0Ex1_1 from "./solutions/class-9/Mathematics/chapter-0/exercise-set-1.1.json";
import class9Ch0Ex1_2 from "./solutions/class-9/Mathematics/chapter-0/exercise-set-1.2.json";
import class9Ch0EndOfChapter from "./solutions/class-9/Mathematics/chapter-0/end-of-chapter.json";
import class9Ch1Ex2_1 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.1.json";
import class9Ch1Ex2_2 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.2.json";
import class9Ch1Ex2_3 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.3.json";
import class9Ch1Ex2_4 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.4.json";
import class9Ch1Ex2_5 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.5.json";
import class9Ch1Ex2_6 from "./solutions/class-9/Mathematics/chapter-1/exercise-set-2.6.json";
import class9Ch1EndOfChapter from "./solutions/class-9/Mathematics/chapter-1/end-of-chapter.json";
import class9Ch2Ex3_1 from "./solutions/class-9/Mathematics/chapter-3/exercise-set-3.1.json";
import class9Ch2Ex3_2 from "./solutions/class-9/Mathematics/chapter-3/exercise-set-3.2.json";
import class9Ch2Ex3_3 from "./solutions/class-9/Mathematics/chapter-3/exercise-set-3.3.json";
import class9Ch2Ex3_4 from "./solutions/class-9/Mathematics/chapter-3/exercise-set-3.4.json";
import class9Ch2Ex3_5 from "./solutions/class-9/Mathematics/chapter-3/exercise-set-3.5.json";
import class9Ch2EndOfChapter from "./solutions/class-9/Mathematics/chapter-3/end-of-chapter.json";
import class9Ch3Ex4_1 from "./solutions/class-9/Mathematics/chapter-4/exercise-set-4.1.json";
import class9Ch3Ex4_2 from "./solutions/class-9/Mathematics/chapter-4/exercise-set-4.2.json";
import class9Ch3Ex4_3 from "./solutions/class-9/Mathematics/chapter-4/exercise-set-4.3.json";
import class9Ch3Ex4_4 from "./solutions/class-9/Mathematics/chapter-4/exercise-set-4.4.json";
import class9Ch3Ex4_5 from "./solutions/class-9/Mathematics/chapter-4/exercise-set-4.5.json";
import class9Ch3EndOfChapter from "./solutions/class-9/Mathematics/chapter-4/end-of-chapter.json";
import class9Ch4Ex5_1 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.1.json";
import class9Ch4Ex5_2 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.2.json";
import class9Ch4Ex5_3 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.3.json";
import class9Ch4Ex5_4 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.4.json";
import class9Ch4Ex5_5 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.5.json";
import class9Ch4Ex5_6 from "./solutions/class-9/Mathematics/chapter-5/exercise-set-5.6.json";
import class9Ch4EndOfChapter from "./solutions/class-9/Mathematics/chapter-5/end-of-chapter.json";
import class9Ch5Ex6_1 from "./solutions/class-9/Mathematics/chapter-6/exercise-set-6.1.json";
import class9Ch5Ex6_2 from "./solutions/class-9/Mathematics/chapter-6/exercise-set-6.2.json";
import class9Ch5Ex6_3 from "./solutions/class-9/Mathematics/chapter-6/exercise-set-6.3.json";
import class9Ch5EndOfChapter from "./solutions/class-9/Mathematics/chapter-6/end-of-chapter.json";
import class9Ch6Ex7_1 from "./solutions/class-9/Mathematics/chapter-7/exercise-set-7.1.json";
import class9Ch6Ex7_2 from "./solutions/class-9/Mathematics/chapter-7/exercise-set-7.2.json";
import class9Ch6Ex7_3 from "./solutions/class-9/Mathematics/chapter-7/exercise-set-7.3.json";
import class9Ch6Ex7_4 from "./solutions/class-9/Mathematics/chapter-7/exercise-set-7.4.json";
import class9Ch6EndOfChapter from "./solutions/class-9/Mathematics/chapter-7/end-of-chapter.json";
import class9Ch7Ex8_1 from "./solutions/class-9/Mathematics/chapter-8/exercise-set-8.1.json";
import class9Ch7Ex8_2 from "./solutions/class-9/Mathematics/chapter-8/exercise-set-8.2.json";
import class9Ch7Ex8_3 from "./solutions/class-9/Mathematics/chapter-8/exercise-set-8.3.json";
import class9Ch7EndOfChapter from "./solutions/class-9/Mathematics/chapter-8/end-of-chapter.json";

// ============================================================
// CHAPTER MANIFEST
// Maps class-subject-chapter keys to their metadata and exercises.
// Add new chapters here by importing the JSON file and adding an entry.
// ============================================================
const chapterManifest: Record<string, ChapterSolutions> = {
  // Class 9 — Mathematics — Chapter 0: Orienting Yourself: The Use of Coordinates
  "9-mathematics-0": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Orienting Yourself: The Use of Coordinates",
    exercises: [
      class9Ch0Ex1_1 as unknown as Exercise,
      class9Ch0Ex1_2 as unknown as Exercise,
      class9Ch0EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 1: Introduction to Linear Polynomials
  "9-mathematics-1": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 1,
    chapterName: "Introduction to Linear Polynomials",
    exercises: [
      class9Ch1Ex2_1 as unknown as Exercise,
      class9Ch1Ex2_2 as unknown as Exercise,
      class9Ch1Ex2_3 as unknown as Exercise,
      class9Ch1Ex2_4 as unknown as Exercise,
      class9Ch1Ex2_5 as unknown as Exercise,
      class9Ch1Ex2_6 as unknown as Exercise,
      class9Ch1EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 2: The World of Numbers
  "9-mathematics-2": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 2,
    chapterName: "The World of Numbers",
    exercises: [
      class9Ch2Ex3_1 as unknown as Exercise,
      class9Ch2Ex3_2 as unknown as Exercise,
      class9Ch2Ex3_3 as unknown as Exercise,
      class9Ch2Ex3_4 as unknown as Exercise,
      class9Ch2Ex3_5 as unknown as Exercise,
      class9Ch2EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 3: Exploring Algebraic Identities
  "9-mathematics-3": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 3,
    chapterName: "Exploring Algebraic Identities",
    exercises: [
      class9Ch3Ex4_1 as unknown as Exercise,
      class9Ch3Ex4_2 as unknown as Exercise,
      class9Ch3Ex4_3 as unknown as Exercise,
      class9Ch3Ex4_4 as unknown as Exercise,
      class9Ch3Ex4_5 as unknown as Exercise,
      class9Ch3EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 4: I'm Up and Down, and Round and Round
  "9-mathematics-4": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 4,
    chapterName: "I'm Up and Down, and Round and Round",
    exercises: [
      class9Ch4Ex5_1 as unknown as Exercise,
      class9Ch4Ex5_2 as unknown as Exercise,
      class9Ch4Ex5_3 as unknown as Exercise,
      class9Ch4Ex5_4 as unknown as Exercise,
      class9Ch4Ex5_5 as unknown as Exercise,
      class9Ch4Ex5_6 as unknown as Exercise,
      class9Ch4EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 5: Measuring Space: Perimeter and Area
  "9-mathematics-5": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 5,
    chapterName: "Measuring Space: Perimeter and Area",
    exercises: [
      class9Ch5Ex6_1 as unknown as Exercise,
      class9Ch5Ex6_2 as unknown as Exercise,
      class9Ch5Ex6_3 as unknown as Exercise,
      class9Ch5EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 6: The Mathematics of Maybe: Introduction to Probability
  "9-mathematics-6": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 6,
    chapterName: "The Mathematics of Maybe: Introduction to Probability",
    exercises: [
      class9Ch6Ex7_1 as unknown as Exercise,
      class9Ch6Ex7_2 as unknown as Exercise,
      class9Ch6Ex7_3 as unknown as Exercise,
      class9Ch6Ex7_4 as unknown as Exercise,
      class9Ch6EndOfChapter as unknown as Exercise,
    ],
  },
  // Class 9 — Mathematics — Chapter 7: Predicting What Comes Next: Exploring Sequences and Progressions
  "9-mathematics-7": {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 7,
    chapterName: "Predicting What Comes Next: Exploring Sequences and Progressions",
    exercises: [
      class9Ch7Ex8_1 as unknown as Exercise,
      class9Ch7Ex8_2 as unknown as Exercise,
      class9Ch7Ex8_3 as unknown as Exercise,
      class9Ch7EndOfChapter as unknown as Exercise,
    ],
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
