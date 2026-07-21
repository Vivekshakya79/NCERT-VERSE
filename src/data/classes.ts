import { Class } from "@/types";

export const classes: Class[] = [
  { id: 6, name: "Class 6", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"] },
  { id: 7, name: "Class 7", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"] },
  { id: 8, name: "Class 8", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"] },
  { id: 9, name: "Class 9", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"] },
  { id: 10, name: "Class 10", subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"] },
  { id: 11, name: "Class 11", subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Computer Science", "Accountancy", "Business Studies", "Economics", "Physical Education", "Hindi"] },
  { id: 12, name: "Class 12", subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Computer Science", "Accountancy", "Business Studies", "Economics", "Physical Education", "Hindi"] },
];

export function getClassById(id: number): Class | undefined {
  return classes.find((c) => c.id === id);
}

export function getClasses() {
  return classes;
}
