"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, BookOpen, Book } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import ClassCard from "@/components/cards/ClassCard";
import FeatureCard from "@/components/cards/FeatureCard";
import { HeroAmbientBackground } from "@/components/ui/HeroAmbientBackground";
import { classes } from "@/data/classes";
import { features } from "@/data/features";
import { useCountUp } from "@/hooks/useCountUp";

function StatCard({ target, label }: { target: number; label: string }) {
  const count = useCountUp(target, 1500, true);

  return (
    <div className="h-stat">
      <b>{count.toLocaleString()}+</b>
      <span>{label}</span>
    </div>
  );
}

function SectionErrorBoundary({ children, label }: { children: React.ReactNode; label: string }) {
  const [hasError, setHasError] = useState(false);
  const hasErrorRef = useRef(hasError);
  hasErrorRef.current = hasError;

  useEffect(() => {
    const handler = () => {
      if (!hasErrorRef.current) {
        setHasError(true);
      }
    };
    window.addEventListener("error", handler, { once: true });
    return () => window.removeEventListener("error", handler);
  }, []);

  if (hasError) {
    return (
      <div className="sec" role="alert">
        <AlertTriangle size={20} style={{ marginRight: 8, verticalAlign: "middle" }} />
        Failed to load {label}
      </div>
    );
  }

  return <>{children}</>;
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" aria-label="Hero banner">
        <HeroAmbientBackground />
        <div className="ph-fade" />
        <div className="hero-c">
          <div className="hero-seq hero-pill">
            <span className="hero-pill-dot" aria-hidden="true" />
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
          <div className="hero-seq hero-cta">
            <Link href="/classes" className="btn btn-p">
              <BookOpen size={18} />
              Browse Classes
            </Link>
            <Link href="/ncert" className="btn btn-s">
              <Book size={18} />
              View NCERT Solutions
            </Link>
          </div>
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
      <SectionErrorBoundary label="Classes">
        <section className="sec" aria-label="Class selection">
          <div className="sec-h reveal">
            <div className="lab">Explore Classes</div>
            <h2>Choose Your Class</h2>
            <p>Complete NCERT-aligned study material for every grade</p>
          </div>
          <div className="g g-cls stagger">
            {classes && classes.length > 0
              ? classes.map((cls) => (
                  <ClassCard key={cls.id} classData={cls} />
                ))
              : <p className="empty-state">No classes available</p>}
          </div>
        </section>
      </SectionErrorBoundary>

      {/* Features Section */}
      <SectionErrorBoundary label="Features">
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
            {features && features.length > 0
              ? features.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))
              : <p className="empty-state">No features available</p>}
          </div>
        </section>
      </SectionErrorBoundary>
    </>
  );
}
