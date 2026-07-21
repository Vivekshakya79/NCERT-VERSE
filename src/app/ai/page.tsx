import { Metadata } from "next";
import Link from "next/link";
import { aiTools } from "@/data/features";
import FeatureCard from "@/components/cards/FeatureCard";

export const metadata: Metadata = {
  title: "AI Study Tools — StudyVerse",
  description:
    "AI-powered study tools for CBSE students. Doubt solver, notes generator, quiz creator, flashcard maker, and more.",
  alternates: { canonical: "/ai" },
  openGraph: {
    title: "AI Study Tools — StudyVerse",
    description: "AI-powered study tools for CBSE students.",
    url: "https://studyverse.app/ai",
  },
};

export default function AIPage() {
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
          <div className="ph-badge">AI-Powered</div>
          <h1>AI Study Tools</h1>
          <p>Smart assistants for faster learning</p>
        </div>
      </div>

      <section className="sec">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">AI Tools</span>
        </nav>

        <div className="g g-4 stagger">
          {aiTools.map((tool) => (
            <FeatureCard key={tool.title} {...tool} />
          ))}
        </div>
      </section>
    </>
  );
}
