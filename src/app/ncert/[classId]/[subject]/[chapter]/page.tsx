import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getExercisesForChapter, hasChapterSolutions } from "@/data/solutions-data";
import NCERTChapterClient from "./ncert-chapter-client";

interface Props {
  params: Promise<{ classId: string; subject: string; chapter: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject, chapter } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);

  if (!cls) return { title: "Not Found — StudyVerse" };
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown";

  return {
    title: `NCERT ${chapterName} — Class ${classId} — StudyVerse`,
    description: `NCERT solutions for Chapter ${chapterIdx + 1}: ${chapterName} - Class ${classId} ${decodedSubject} CBSE.`,
    alternates: { canonical: `/ncert/${classId}/${subject}/${chapter}` },
  };
}

export default async function NCERTChapterPage({ params }: Props) {
  const { classId, subject, chapter } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  const chapterIdx = parseInt(chapter);

  if (!cls) notFound();
  const chapters = getChapters(cls.id, decodedSubject);
  const chapterName = chapters[chapterIdx] || "Unknown";
  if (chapterIdx >= chapters.length) notFound();

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
          <h1>Ch {chapterIdx + 1}: {chapterName}</h1>
          <p>Exercise-wise solutions</p>
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
          <span aria-current="page">Ch {chapterIdx + 1}</span>
        </nav>

        <NCERTChapterClient
          classId={cls.id}
          subject={decodedSubject}
          chapterIdx={chapterIdx}
          chapterName={chapterName}
          exercises={getExercisesForChapter(cls.id, decodedSubject, chapterIdx)}
          hasSolutions={hasChapterSolutions(cls.id, decodedSubject, chapterIdx)}
        />
      </section>
    </>
  );
}
