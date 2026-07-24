import { Metadata } from "next";
import Link from "next/link";
import { Book } from "lucide-react";
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
  return (
    <>
      <div className="ph ph-ncert">
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
          <div className="ph-badge">NCERT Solutions</div>
          <h1>NCERT Solutions</h1>
          <p>Class → Subject → Chapter → Solutions</p>
        </div>
      </div>

      <section className="sec sec-ncert">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">NCERT</span>
        </nav>

        <div className="g-cls-ncert stagger">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              href={`/ncert/${cls.id}`}
              className="cls-card glow-card"
            >
              <span className="cls-ico" aria-hidden="true"><Book size={24} /></span>
              <div className="num">{cls.id}</div>
              <div className="ttl">{cls.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
