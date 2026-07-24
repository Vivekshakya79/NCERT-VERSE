import { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { classes } from "@/data/classes";
import { getSubjectIcon } from "@/data/subject-icons";

export const metadata: Metadata = {
  title: "All Classes — StudyVerse",
  description:
    "Browse all CBSE classes from 6 to 12. Access NCERT solutions, study materials, MCQs, and more for every class.",
  alternates: { canonical: "/classes" },
  openGraph: {
    title: "All Classes — StudyVerse",
    description:
      "Browse all CBSE classes from 6 to 12. Access NCERT solutions, study materials, MCQs, and more for every class.",
    url: "https://studyverse.app/classes",
  },
};

export default function ClassesPage() {
  return (
    <>
      <div className="ph">
      <div className="ph-bg" />
        <div className="ph-fade" />
        <div className="ph-content">
          <div className="ph-badge">CBSE 2026-27</div>
          <h1>All Classes</h1>
          <p>Select a class to explore subjects and chapters</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Classes</span>
        </nav>

        <div className="g g-cls stagger">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/classes/${cls.id}`}
              className="cls-card glow-card"
            >
              <span className="cls-ico" aria-hidden="true"><BookOpen size={24} /></span>
              <div className="num">{cls.id}</div>
              <div className="ttl">{cls.name}</div>
              <div className="meta">{cls.subjects.length} Subjects</div>
              <div className="subj-preview">
                {cls.subjects.slice(0, 6).map((s) => (
                  <span key={s}>{getSubjectIcon(s)}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
