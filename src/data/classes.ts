import { Class } from "@/types";

/**
 * Set of subject names that should be hidden from the UI.
 * These subjects still exist in the database and can be re-enabled later.
 */
export const HIDDEN_SUBJECTS = new Set([
  // Explicitly removed per requirements
  "Urdu",
  "Sanskrit",
  "Skill Education",
  "Vocational",
  "Vocational Education",
  "Physical Education and Well Being",
  "Health and Physical Education",
  "Arts",

  // Non-core regional languages
  "Kannada",
  "Malayalam",
  "Marathi",
  "Nepali",
  "Punjabi",
  "Santhali",
  "Tamil",

  // Non-core arts / elective subjects for 11-12
  "Fine Art",
  "Sangeet",
  "Heritage Crafts",
  "Creative Writing and Translation",
  "Creative Writing & Translation",
  "Graphics design",
  "New Age Graphics Design",
  "Computers and Communication Technology",
  "Knowledge Traditions Practices of India",
]);

/** Returns only the visible (non-hidden) subjects for a class. */
export function getVisibleSubjects(cls: Class): string[] {
  return cls.subjects;
}

/** Returns only the hidden subjects for a class. */
export function getHiddenSubjects(cls: Class): string[] {
  return cls.hiddenSubjects || [];
}

/** Checks whether a subject is hidden for a given class ID. */
export function isSubjectHidden(classId: number, subject: string): boolean {
  const cls = classes.find((c) => c.id === classId);
  if (!cls) return false;
  return HIDDEN_SUBJECTS.has(subject);
}

export const classes: Class[] = [
  {
    id: 6,
    name: "Class 6",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
    ],
    hiddenSubjects: [
      "Arts",
      "Kannada",
      "Malayalam",
      "Marathi",
      "Nepali",
      "Physical Education and Well Being",
      "Punjabi",
      "Sanskrit",
      "Santhali",
      "Tamil",
      "Urdu",
      "Vocational Education",
    ],
  },
  {
    id: 7,
    name: "Class 7",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
    ],
    hiddenSubjects: [
      "Arts",
      "Physical Education and Well Being",
      "Sanskrit",
      "Urdu",
      "Vocational Education",
    ],
  },
  {
    id: 8,
    name: "Class 8",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
    ],
    hiddenSubjects: [
      "Arts",
      "Physical Education and Well Being",
      "Sanskrit",
      "Urdu",
      "Vocational Education",
    ],
  },
  {
    id: 9,
    name: "Class 9",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
    ],
    hiddenSubjects: [
      "Arts",
      "Physical Education and Well Being",
      "Sanskrit",
      "Skill Education",
      "Urdu",
      "Vocational",
    ],
  },
  {
    id: 10,
    name: "Class 10",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Science",
    ],
    hiddenSubjects: [
      "Health and Physical Education",
      "Sanskrit",
      "Urdu",
    ],
  },
  {
    id: 11,
    name: "Class 11",
    subjects: [
      "Accountancy",
      "Biology",
      "Biotechnology",
      "Business Studies",
      "Chemistry",
      "Computer Science",
      "Economics",
      "English",
      "Geography",
      "Hindi",
      "History",
      "Home Science",
      "Informatics Practices",
      "Mathematics",
      "Physics",
      "Political Science",
      "Psychology",
      "Sociology",
    ],
    hiddenSubjects: [
      "Computers and Communication Technology",
      "Creative Writing and Translation",
      "Fine Art",
      "Graphics design",
      "Health and Physical Education",
      "Heritage Crafts",
      "Knowledge Traditions Practices of India",
      "Sangeet",
      "Sanskrit",
      "Urdu",
      "Vocational",
    ],
  },
  {
    id: 12,
    name: "Class 12",
    subjects: [
      "Accountancy",
      "Biology",
      "Biotechnology",
      "Business Studies",
      "Chemistry",
      "Computer Science",
      "Economics",
      "English",
      "Geography",
      "Hindi",
      "History",
      "Home Science",
      "Informatics Practices",
      "Mathematics",
      "Physics",
      "Political Science",
      "Psychology",
      "Sociology",
    ],
    hiddenSubjects: [
      "Creative Writing & Translation",
      "Fine Art",
      "Heritage Crafts",
      "New Age Graphics Design",
      "Sangeet",
      "Sanskrit",
      "Urdu",
    ],
  },
];

export function getClassById(id: number): Class | undefined {
  return classes.find((c) => c.id === id);
}

export function getClasses() {
  return classes;
}
