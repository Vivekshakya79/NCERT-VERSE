import { Metadata } from "next";
import Link from "next/link";
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
              <div className="ch-ico" aria-hidden="true">📗</div>
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
