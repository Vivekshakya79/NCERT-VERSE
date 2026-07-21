import { Metadata } from "next";
import Link from "next/link";
import { classes } from "@/data/classes";

export const metadata: Metadata = {
  title: "NCERT Solutions — StudyVerse",
  description:
    "Comprehensive NCERT solutions for all CBSE classes 6-12. Step-by-step explanations for every subject and chapter.",
  alternates: { canonical: "/ncert" },
  openGraph: {
    title: "NCERT Solutions — StudyVerse",
    description:
      "Comprehensive NCERT solutions for all CBSE classes 6-12.",
    url: "https://studyverse.app/ncert",
  },
};

export default function NCERTPage() {
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
          <h1>NCERT Solutions</h1>
          <p>Class → Subject → Chapter → Solutions</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">NCERT</span>
        </nav>

        <div className="g g-cls stagger">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/ncert/${cls.id}`}
              className="cls-card glow-card"
            >
              <span className="cls-ico" aria-hidden="true">📗</span>
              <div className="num">{cls.id}</div>
              <div className="ttl">{cls.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
