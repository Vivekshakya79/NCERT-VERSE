"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import BackToTop from "@/components/layout/BackToTop";
import KeyboardShortcutsModal from "@/components/layout/KeyboardShortcutsModal";
import ToastContainer from "@/components/layout/ToastContainer";
import RevealObserver from "@/components/layout/RevealObserver";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Subtle ambient gradient background */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-glow" />
        <div className="ambient-glow" />
        <div className="ambient-glow" />
      </div>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
      <BackToTop />
      <KeyboardShortcutsModal />
      <ToastContainer />
      <Footer />
      <RevealObserver />
    </>
  );
}
