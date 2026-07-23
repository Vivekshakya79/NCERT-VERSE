import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClassById, getVisibleSubjects } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { getSubjectIcon } from "@/data/subject-icons";

interface Props {
  params: Promise<{ classId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { classId } = await params;
  const cls = getClassById(parseInt(classId));
  if (!cls) return { title: "Class Not Found — StudyVerse" };
  return {
    title: `${cls.name} — StudyVerse`,
    description: `Complete study material for ${cls.name} CBSE. Access NCERT solutions, chapter notes, MCQs, and more for all subjects.`,
    alternates: { canonical: `/classes/${classId}` },
    openGraph: {
      title: `${cls.name} — StudyVerse`,
      description: `Complete study material for ${cls.name} CBSE. Access NCERT solutions, chapter notes, MCQs, and more.`,
    },
  };
}

export default async function ClassPage({ params }: Props) {
  const { classId } = await params;
  const cls = getClassById(parseInt(classId));
  if (!cls) notFound();

  const visibleSubjects = getVisibleSubjects(cls);

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
          <div className="ph-badge">CBSE 2026-27</div>
          <h1>{cls.name}</h1>
          <p>{visibleSubjects.length} subjects</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/classes">Classes</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{cls.name}</span>
        </nav>

        <div className="sec-h reveal">
          <h2>Subjects</h2>
        </div>

        <div className="g g-4 stagger">
          {visibleSubjects.map((subject) => {
            const chapters = getChapters(cls.id, subject);
            // For Class 9 Mathematics, link directly to the NCERT Ganita Manjari solutions
            const href = cls.id === 9 && subject === "Mathematics"
              ? `/ncert/${cls.id}/${encodeURIComponent(subject)}`
              : `/classes/${cls.id}/${encodeURIComponent(subject)}`;
            return (
              <Link
                key={subject}
                href={href}
                className="chip"
              >
                <span className="chip-ico" aria-hidden="true">
                  {getSubjectIcon(subject)}
                </span>
                <span>{subject}</span>
                <span className="chip-count">{chapters.length} Ch</span>
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
            );
          })}
        </div>
      </section>
    </>
  );
}
