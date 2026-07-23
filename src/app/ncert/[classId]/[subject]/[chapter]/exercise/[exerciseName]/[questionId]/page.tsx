import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getExercisesForChapter, getQuestionById } from "@/data/solutions-data";
import SolutionViewer from "@/components/solutions/SolutionViewer";

interface Props {
  params: Promise<{
    classId: string;
    subject: string;
    chapter: string;
    exerciseName: string;
    questionId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject, chapter, exerciseName, questionId } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);
  const decodedExName = decodeURIComponent(exerciseName);

  if (!cls) return { title: "Not Found — StudyVerse" };
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown";

  const question = getQuestionById(questionId);

  return {
    title: `Q${question?.questionNumber || ""} ${decodedExName} — ${chapterName} — StudyVerse`,
    description: `Step-by-step solution for ${decodedExName} Question ${question?.questionNumber || ""} of ${chapterName}.`,
  };
}

export default async function SolutionPage({ params }: Props) {
  const { classId, subject, chapter, exerciseName, questionId } = await params;
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

  // Verify exercise and question exist
  const ex = exercises.find((e) => e.name === decodedExName);
  if (!ex) notFound();

  const question = ex.questions.find((q) => q.id === questionId);
  if (!question) notFound();

  const particles = Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className="ph-particle"
      style={{
        width: `${12 + Math.random() * 20}px`,
        height: `${12 + Math.random() * 20}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 15}s`,
        animationDelay: `${Math.random() * -20}s`,
        opacity: `${0.03 + Math.random() * 0.05}`,
      }}
    />
  ));

  return (
    <>
      <div className="ph">
        <div className="ph-bg" />
        <div className="ph-grid" />
        <div className="ph-glow" />
        <div className="ph-particles">{particles}</div>
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">NCERT · Class {classId} · {decodedSubject}</div>
          <h1>
            {decodedExName} · Q{question.questionNumber}
          </h1>
          <p>{chapterName}</p>
        </div>
      </div>

      <section className="sec sol-sec">
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
          <Link
            href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}/${chapterIdx}/exercise/${encodeURIComponent(decodedExName)}`}
          >
            {decodedExName}
          </Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Q{question.questionNumber}</span>
        </nav>

        <SolutionViewer
          classId={cls.id}
          subject={decodedSubject}
          chapterIdx={chapterIdx}
          chapterName={chapterName}
          exercises={exercises}
          currentExercise={decodedExName}
          currentQuestionId={questionId}
        />
      </section>
    </>
  );
}
