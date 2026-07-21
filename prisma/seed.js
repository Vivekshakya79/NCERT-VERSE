const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const classes = [
  { number: 6, name: "Class 6" },
  { number: 7, name: "Class 7" },
  { number: 8, name: "Class 8" },
  { number: 9, name: "Class 9" },
  { number: 10, name: "Class 10" },
  { number: 11, name: "Class 11" },
  { number: 12, name: "Class 12" },
];

const subjectsByClass = {
  6: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"],
  7: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"],
  8: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"],
  9: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"],
  10: ["Mathematics", "Science", "Social Science", "English", "Hindi", "Sanskrit"],
  11: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Computer Science", "Accountancy", "Business Studies", "Economics", "Physical Education", "Hindi"],
  12: ["Physics", "Chemistry", "Biology", "Mathematics", "English", "Computer Science", "Accountancy", "Business Studies", "Economics", "Physical Education", "Hindi"],
};

const chapters = {
  "6-Mathematics": ["Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling and Presentation", "Prime Time", "Perimeter and Area", "Fractions", "Playing with Constructions", "Symmetry", "The Other Side of Zero"],
  "6-Science": ["The Wonderful World of Science", "Diversity in the Living World", "Mindful Eating: A Path to a Healthy Body", "Exploring Magnets", "Measurement of Length and Motion", "Materials Around Us", "Temperature and its Measurement", "A Journey through States of Water", "Methods of Separation in Everyday Life", "Living Creatures: Exploring their Characteristics", "Nature's Treasures", "Beyond Earth"],
  "10-Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
  "10-Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment", "Sustainable Management of Natural Resources"],
};

async function main() {
  console.log("🌱 Seeding database...");

  // Create classes
  for (const cls of classes) {
    await prisma.class.upsert({
      where: { number: cls.number },
      update: { name: cls.name },
      create: cls,
    });
  }

  // Create subjects and chapters
  for (const [classNum, subjectList] of Object.entries(subjectsByClass)) {
    const cls = await prisma.class.findUnique({ where: { number: parseInt(classNum) } });
    if (!cls) continue;

    for (const subjectName of subjectList) {
      const subject = await prisma.subject.create({
        data: {
          name: subjectName,
          classId: cls.id,
          order: subjectList.indexOf(subjectName),
        },
      });

      const key = `${classNum}-${subjectName}`;
      const chapterList = chapters[key] || Array.from({ length: classNum >= "11" ? 12 : 10 }, (_, i) => `Chapter ${i + 1} (Placeholder)`);

      for (let i = 0; i < chapterList.length; i++) {
        await prisma.chapter.create({
          data: {
            number: i + 1,
            name: chapterList[i],
            subjectId: subject.id,
            classId: cls.id,
            order: i,
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
