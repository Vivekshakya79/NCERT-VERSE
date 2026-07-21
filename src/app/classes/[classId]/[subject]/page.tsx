import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getChapters, isPlaceholder } from "@/data/chapters";
import { getSubjectIcon } from "@/data/subject-icons";

interface Props {
  params: Promise<{ classId: string; subject: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId, subject } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  if (!cls) return { title: "Not Found — StudyVerse" };
  return {
    title: `${decodedSubject} — Class ${classId} — StudyVerse`,
    description: `Complete study material for ${decodedSubject} Class ${classId} CBSE. Access NCERT solutions, chapter notes, MCQs, and more.`,
    alternates: { canonical: `/classes/${classId}/${subject}` },
    openGraph: {
      title: `${decodedSubject} — Class ${classId} — StudyVerse`,
      description: `Complete study material for ${decodedSubject} Class ${classId} CBSE.`,
    },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { classId, subject } = await params;
  const cls = getClassById(parseInt(classId));
  const decodedSubject = decodeURIComponent(subject);
  if (!cls) notFound();

  const chapters = getChapters(cls.id, decodedSubject);
  const ph = isPlaceholder(cls.id, decodedSubject);

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

  const tabs = [
    "Chapters",
    "Revision Notes",
    "MCQs",
    "Formula Sheet",
    "Sample Papers",
    "PYQs",
  ];

  return (
    <>
      <div className="ph">
        <div className="ph-bg" />
        <div className="ph-grid" />
        <div className="ph-glow" />
        <div className="ph-particles">{particles}</div>
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">Class {classId}</div>
          <h1>
            {getSubjectIcon(decodedSubject)} {decodedSubject}
          </h1>
          <p>{chapters.length} chapters</p>
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
          <span aria-current="page">{decodedSubject}</span>
        </nav>

        <div className="tabs" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              className={`tab ${i === 0 ? "on" : ""}`}
              role="tab"
              aria-selected={i === 0}
            >
              {tab}
            </button>
          ))}
        </div>

        {ph && (
          <div
            role="alert"
            style={{
              padding: "12px 18px",
              background: "rgba(245,158,11,.05)",
              border: "1px solid rgba(245,158,11,.12)",
              borderRadius: "12px",
              marginBottom: "16px",
              fontSize: "15px",
              color: "#92400E",
            }}
          >
            ⚠️ Some chapters use placeholder names and will be updated soon.
          </div>
        )}

        <div
          className="stagger"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {chapters.map((ch, i) => (
            <Link
              key={i}
              href={`/classes/${cls.id}/${encodeURIComponent(decodedSubject)}/${i}`}
              className={`ch-item ${ch.includes("Placeholder") ? "placeholder" : ""}`}
            >
              <div className="ch-ico" aria-hidden="true">📘</div>
              <div className="ch-content">
                <h4>Chapter {i + 1} — {ch}</h4>
                <p>Class {cls.id} · {decodedSubject}</p>
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
