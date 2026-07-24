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
      {/* Signature Background System — layered mesh, glows, grid & noise */}
      <div className="bg-layer" aria-hidden="true">
        <div className="bg-mesh">
          <div className="bg-orb" />
          <div className="bg-orb" />
          <div className="bg-orb" />
          <div className="bg-orb" />
          <div className="bg-orb" />
        </div>
        <div className="bg-glows">
          <div className="bg-glow" />
          <div className="bg-glow" />
          <div className="bg-glow" />
          <div className="bg-glow" />
        </div>
        <div className="bg-grid" />
        <div className="bg-noise" />
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
