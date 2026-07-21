"use client";

import { useRouter } from "next/navigation";
import SearchBar from "@/components/ui/SearchBar";
import ClassCard from "@/components/cards/ClassCard";
import FeatureCard from "@/components/cards/FeatureCard";
import { classes } from "@/data/classes";
import { features } from "@/data/features";
import { useCountUp } from "@/hooks/useCountUp";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

function StatCard({ target, label }: { target: number; label: string }) {
  const observerRef = useIntersectionObserver();
  const count = useCountUp(target, 1500, true);

  return (
    <div className="h-stat" ref={observerRef}>
      <b>{count.toLocaleString()}+</b>
      <span>{label}</span>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

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
      {/* Hero Section */}
      <section className="hero" aria-label="Hero banner">
        <div className="ph-bg" />
        <div className="ph-grid" />
        <div className="ph-glow" />
        <div className="ph-particles">{particles}</div>
        <div className="ph-fade" />
        <div className="hero-c">
          <div className="hero-seq hero-pill">
            <span className="hero-dot" role="status" aria-label="Live" />
            Trusted by 50,000+ CBSE Students
          </div>
          <h1 className="hero-seq">
            Learn Smarter,<br />
            <span className="highlight">Score Higher</span>
          </h1>
          <p className="hero-seq hero-sub">
            Premium study materials for CBSE Classes 6 to 12. NCERT solutions,
            chapter notes, MCQs, and AI-powered tools.
          </p>
          <div className="hero-seq search-box search-enter">
            <SearchBar />
          </div>
          <div className="hero-seq hero-stats">
            <StatCard target={12000} label="Study Notes" />
            <StatCard target={5400} label="MCQs" />
            <StatCard target={350} label="Chapters" />
            <StatCard target={50000} label="Students" />
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="sec" aria-label="Class selection">
        <div className="sec-h reveal">
          <div className="lab">Explore Classes</div>
          <h2>Choose Your Class</h2>
          <p>Complete NCERT-aligned study material for every grade</p>
        </div>
        <div className="g g-cls stagger">
          {classes.map((cls) => (
            <ClassCard key={cls.id} classData={cls} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <div className="sec-divider" />
      <section className="sec" aria-label="Features">
        <div className="sec-h reveal">
          <div className="lab">Why StudyVerse</div>
          <h2>Everything You Need to Succeed</h2>
          <p>
            Comprehensive learning resources designed for CBSE students
          </p>
        </div>
        <div className="g g-4 stagger">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>
    </>
  );
}
