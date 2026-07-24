import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById, isSubjectHidden } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getSubjectIcon } from "@/data/subject-icons";
import ChapterClient from "./chapter-client";

interface Props {
  params: Promise<{ classId: string; subject: string; chapter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject, chapter } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);

  if (!cls) return { title: "Not Found — StudyVerse" };
  if (isSubjectHidden(cls.id, decodedSubject)) return { title: "Not Found — StudyVerse" };
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown Chapter";

  return {
    title: `${chapterName} — Class ${classId} ${decodedSubject} — StudyVerse`,
    description: `Complete study material for Chapter ${chapterIdx + 1}: ${chapterName} - Class ${classId} ${decodedSubject} CBSE. NCERT solutions, notes, MCQs, and more.`,
    alternates: { canonical: `/classes/${classId}/${subject}/${chapter}` },
    openGraph: {
      title: `${chapterName} — Class ${classId} ${decodedSubject}`,
      description: `Complete study material for Chapter ${chapterIdx + 1}: ${chapterName}.`,
    },
  };
}

export default async function ChapterPage({ params }: Props) {
  const { classId, subject, chapter } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);

  if (!cls) notFound();
  if (isSubjectHidden(cls.id, decodedSubject)) notFound();
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown Chapter";
  if (chapterIdx >= chapters.length) notFound();

  return (
    <>
      <div className="ph">
      <div className="ph-bg" />
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">
            Class {classId} · {decodedSubject} · Ch {chapterIdx + 1}
          </div>
          <h1>{chapterName}</h1>
          <p>Complete study material</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/classes">Classes</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/classes/${cls.id}`}>Class {cls.id}</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/classes/${cls.id}/${encodeURIComponent(decodedSubject)}`}>
            {decodedSubject}
          </Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Ch {chapterIdx + 1}</span>
        </nav>

        <ChapterClient
          classId={cls.id}
          subject={decodedSubject}
          chapterIdx={chapterIdx}
          chapterName={chapterName}
          totalChapters={chapters.length}
        />
      </section>
    </>
  );
}
