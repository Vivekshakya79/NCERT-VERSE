import { Metadata } from "next";
import Link from "next/link";
import { aiTools } from "@/data/features";
import { PageHero } from "@/components/ui/PageHero";
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
  return (
    <>
      <PageHero badge="AI-Powered" title="AI Study Tools" description="Smart assistants for faster learning" />

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
