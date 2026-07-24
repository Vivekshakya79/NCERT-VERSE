import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getExercisesForChapter } from "@/data/solutions-data";

interface Props {
  params: Promise<{
    classId: string;
    subject: string;
    chapter: string;
    exerciseName: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject, chapter, exerciseName } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);
  const decodedExName = decodeURIComponent(exerciseName);

  if (!cls) return { title: "Not Found — StudyVerse" };
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown";

  return {
    title: `${decodedExName} — ${chapterName} — Class ${classId} — StudyVerse`,
    description: `NCERT solutions for ${decodedExName} of ${chapterName} - Class ${classId} ${decodedSubject}.`,
  };
}

export default async function ExercisePage({ params }: Props) {
  const { classId, subject, chapter, exerciseName } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);
  const decodedExName = decodeURIComponent(exerciseName);

  if (!cls) notFound();

  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown";
  if (chapterIdx >= chapters.length) notFound();

  const exercises = getExercisesForChapter(cls.id, decodedSubject, chapterIdx);
  if (exercises.length === 0) notFound();

  const exercise = exercises.find((e) => e.name === decodedExName);
  if (!exercise) notFound();

  return (
    <>
      <div className="ph">
        <div className="ph-mesh">
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
          <div className="ph-mesh-g" />
        </div>
        <div className="ph-light-tr" />
        <div className="ph-light-left" />
        <div className="ph-aurora" />
        <div className="ph-glass" />
        <div className="ph-noise" />
        <div className="ph-grid" />
        <div className="ph-blobs">
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
          <div className="ph-blob" />
        </div>
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">NCERT · Class {classId} · {decodedSubject}</div>
          <h1>{decodedExName}</h1>
          <p>{chapterName} · {exercise.questions.length} Questions</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ncert">NCERT</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/ncert/${cls.id}`}>Class {cls.id}</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}`}>
            {decodedSubject}
          </Link>
          <span aria-hidden="true">›</span>
          <Link
            href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}/${chapterIdx}`}
          >
            Ch {chapterIdx + 1}
          </Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{decodedExName}</span>
        </nav>

        <div className="ex-header">
          <div className="ex-header-info">
            <h2 className="ex-title">{decodedExName}</h2>
            <p className="ex-meta">
              Chapter {chapterIdx + 1}: {chapterName} · {exercise.questions.length} Questions
            </p>
          </div>
          <Link
            href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}/${chapterIdx}`}
            className="btn btn-s"
          >
            ← Back to Chapter
          </Link>
        </div>

        <div className="sol-question-grid">
          {exercise.questions.map((q, i) => (
            <Link
              key={q.id}
              href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}/${chapterIdx}/exercise/${encodeURIComponent(decodedExName)}/${q.id}`}
              className="sol-q-card stagger"
            >
              <div className="sol-q-card-num">Q{q.questionNumber}</div>
              <div
                className="sol-q-card-preview"
                dangerouslySetInnerHTML={{
                  __html: q.question
                    .replace(/\$\$(.+?)\$\$/g, "$1")
                    .replace(/\$(.+?)\$/g, "$1")
                    .replace(/\*\*(.+?)\*\*/g, "$1")
                    .slice(0, 120) + (q.question.length > 120 ? "..." : ""),
                }}
              />
              <div className="sol-q-card-steps">
                {q.solution.length} step{q.solution.length !== 1 ? "s" : ""}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
