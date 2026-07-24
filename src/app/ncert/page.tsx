import { Metadata } from "next";
import Link from "next/link";
import { Book } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
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
      <PageHero badge="NCERT Solutions" title="NCERT Solutions" description="Class → Subject → Chapter → Solutions" className="ph-ncert" />

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
