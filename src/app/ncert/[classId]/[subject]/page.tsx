import { Metadata } from "next";
import Link from "next/link";
import { Book } from "lucide-react";
import { notFound } from "next/navigation";
import { getClassById, isSubjectHidden } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getSubjectIcon } from "@/data/subject-icons";

interface Props {
  params: Promise<{ classId: string; subject: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  if (!cls) return { title: "Not Found — StudyVerse" };
  if (isSubjectHidden(cls.id, decodedSubject)) return { title: "Not Found — StudyVerse" };
  return {
    title: `NCERT ${decodedSubject} Solutions — Class ${classId} — StudyVerse`,
    description: `NCERT solutions for ${decodedSubject} Class ${classId} CBSE. Chapter-wise solutions with detailed explanations.`,
    alternates: { canonical: `/ncert/${classId}/${subject}` },
  };
}

export default async function NCERTSubjectPage({ params }: Props) {
  const { classId, subject } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  if (!cls) notFound();
  if (isSubjectHidden(cls.id, decodedSubject)) notFound();

  const chapters = getChapters(cls.id, decodedSubject);

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
          <div className="ph-badge">NCERT · Class {classId}</div>
          <h1>{decodedSubject} Solutions</h1>
          <p>Chapter-wise solutions</p>
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
          <span aria-current="page">{decodedSubject}</span>
        </nav>

        <div
          className="stagger"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {chapters.map((ch, i) => (
            <Link
              key={i}
              href={`/ncert/${cls.id}/${encodeURIComponent(decodedSubject)}/${i}`}
              className="ch-item"
            >
              <div className="ch-ico" aria-hidden="true"><Book size={18} /></div>
              <div className="ch-content">
                <h4>Chapter {i + 1} — {ch}</h4>
                <p>NCERT Solutions</p>
              </div>
              <svg
                className="ch-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
