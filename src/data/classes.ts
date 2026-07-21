import { Class } from "@/types";

export const classes: Class[] = [
  { id: 6, name: "Class 6", subjects: ["Arts", "English", "Hindi", "Kannada", "Malayalam", "Marathi", "Mathematics", "Nepali", "Physical Education and Well Being", "Punjabi", "Sanskrit", "Santhali", "Science", "Social Science", "Tamil", "Urdu", "Vocational Education"] },
  { id: 7, name: "Class 7", subjects: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Social Science", "Urdu", "Vocational Education"] },
  { id: 8, name: "Class 8", subjects: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Social Science", "Urdu", "Vocational Education"] },
  { id: 9, name: "Class 9", subjects: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Skill Education", "Social Science", "Urdu", "Vocational"] },
  { id: 10, name: "Class 10", subjects: ["English", "Health and Physical Education", "Hindi", "Mathematics", "Sanskrit", "Science", "Social Science", "Urdu"] },
  { id: 11, name: "Class 11", subjects: ["Accountancy", "Biology", "Biotechnology", "Business Studies", "Chemistry", "Computer Science", "Computers and Communication Technology", "Creative Writing and Translation", "Economics", "English", "Fine Art", "Geography", "Graphics design", "Health and Physical Education", "Heritage Crafts", "Hindi", "History", "Home Science", "Informatics Practices", "Knowledge Traditions Practices of India", "Mathematics", "Physics", "Political Science", "Psychology", "Sangeet", "Sanskrit", "Sociology", "Urdu", "Vocational"] },
  { id: 12, name: "Class 12", subjects: ["Accountancy", "Biology", "Biotechnology", "Business Studies", "Chemistry", "Computer Science", "Creative Writing & Translation", "Economics", "English", "Fine Art", "Geography", "Heritage Crafts", "Hindi", "History", "Home Science", "Informatics Practices", "Mathematics", "New Age Graphics Design", "Physics", "Political Science", "Psychology", "Sangeet", "Sanskrit", "Sociology", "Urdu"] },
  { id: 13, name: "Class XI & XII Combined", subjects: ["Heritage Crafts", "Hindi", "Sanskrit", "Urdu"] },
  { id: 14, name: "Vocational", subjects: ["Vocational"] },
];

export function getClassById(id: number): Class | undefined {
  return classes.find((c) => c.id === id);
}

export function getClasses() {
  return classes;
}
