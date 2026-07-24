import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import LayoutClient from "./layout-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://studyverse.app";

export const metadata: Metadata = {
  title: "StudyVerse — CBSE Classes 6-12 | NCERT Solutions, Notes, MCQs, AI Tools",
  description:
    "India's premium NCERT-aligned educational platform for CBSE Classes 6-12. Study materials, NCERT solutions, MCQs, AI-powered tools, and more. Trusted by 50,000+ students.",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "StudyVerse — CBSE Classes 6-12 | NCERT Solutions, Notes, MCQs, AI Tools",
    description:
      "India's premium NCERT-aligned educational platform for CBSE Classes 6-12. Study materials, NCERT solutions, MCQs, AI-powered tools, and more.",
    url: baseUrl,
    siteName: "StudyVerse",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyVerse — CBSE Classes 6-12",
    description:
      "India's premium NCERT-aligned educational platform for CBSE Classes 6-12.",
  },
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "StudyVerse",
              url: baseUrl,
              description:
                "India's premium NCERT-aligned educational platform for CBSE Classes 6-12.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <LayoutClient>{children}</LayoutClient>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
