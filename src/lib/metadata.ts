import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://studyverse.app";

interface PageMetadataParams {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path = "",
  ogImage,
  noIndex = false,
}: PageMetadataParams): Metadata {
  const fullTitle = title ? `${title} — StudyVerse` : "StudyVerse — CBSE Classes 6-12 | NCERT Solutions, Notes, MCQs, AI Tools";
  const fullDescription =
    description ||
    "India's premium NCERT-aligned educational platform for CBSE Classes 6-12. Study materials, NCERT solutions, MCQs, AI-powered tools, and more. Trusted by 50,000+ students.";
  const url = `${baseUrl}${path}`;

  return {
    title: fullTitle,
    description: fullDescription,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url,
      siteName: "StudyVerse",
      locale: "en_IN",
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    keywords: [
      "CBSE",
      "NCERT",
      "Classes 6-12",
      "study material",
      "NCERT solutions",
      "MCQs",
      "online learning",
      "India education",
      "exam preparation",
    ],
    authors: [{ name: "StudyVerse" }],
  };
}

export function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StudyVerse",
    url: baseUrl,
    description: "India's premium NCERT-aligned educational platform for CBSE Classes 6-12.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
