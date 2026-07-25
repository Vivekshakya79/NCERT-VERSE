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
      {/* Ambient mesh background layers */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-glow" style={{ top: '5%', left: '10%', width: '500px', height: '500px', animationDelay: '0s' }} />
        <div className="ambient-glow" style={{ top: '20%', right: '-5%', width: '600px', height: '600px', animationDelay: '-8s' }} />
        <div className="ambient-glow" style={{ bottom: '10%', left: '20%', width: '450px', height: '450px', animationDelay: '-16s' }} />
        <div className="ambient-glow" style={{ bottom: '30%', right: '30%', width: '350px', height: '350px', animationDelay: '-24s' }} />
        <div className="ambient-glow" style={{ top: '50%', left: '50%', width: '400px', height: '400px', animationDelay: '-32s' }} />
        <div className="ambient-glow" style={{ top: '70%', left: '5%', width: '300px', height: '300px', animationDelay: '-40s' }} />
        <div className="ambient-glow" style={{ top: '10%', left: '60%', width: '250px', height: '250px', animationDelay: '-48s' }} />
        <div className="ambient-grid" />
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
