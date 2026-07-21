import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById } from "@/data/classes";
import { getSubjectIcon } from "@/data/subject-icons";

interface Props {
  params: Promise<{ classId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId } = await params;
  const cls = getClassById(parseInt(classId));
  if (!cls) return { title: "Not Found — StudyVerse" };
  return {
    title: `NCERT ${cls.name} Solutions — StudyVerse`,
    description: `NCERT solutions for ${cls.name} CBSE. All subjects covered with detailed explanations.`,
    alternates: { canonical: `/ncert/${classId}` },
  };
}

export default async function NCERTClassPage({ params }: Props) {
  const { classId } = await params;
  const cls = getClassById(parseInt(classId));
  if (!cls) notFound();

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
          <div className="ph-badge">NCERT Solutions</div>
          <h1>{cls.name} Solutions</h1>
          <p>Select a subject</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/ncert">NCERT</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{cls.name}</span>
        </nav>

        <div className="g g-4 stagger">
          {cls.subjects.map((subject) => (
            <Link
              key={subject}
              href={`/ncert/${cls.id}/${encodeURIComponent(subject)}`}
              className="chip"
            >
              <span className="chip-ico" aria-hidden="true">
                {getSubjectIcon(subject)}
              </span>
              <span>{subject}</span>
              <svg
                className="chip-arrow"
                width="18"
                height="18"
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
