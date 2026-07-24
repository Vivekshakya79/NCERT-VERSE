"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Keyboard, Clock, House, BookOpen, Book, Bot, Trophy, BarChart, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "/classes" },
  { label: "NCERT", href: "/ncert" },
  { label: "AI Tools", href: "/ai" },
  { label: "Quiz", href: "/quiz" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, isDark } = useTheme();
  const { showToast } = useToast();

  useKeyboardShortcuts(toggleTheme);

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
    document.body.style.overflow = mobileOpen ? "" : "hidden";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleToggleHistory = () => {
    setHistoryOpen((prev) => !prev);
  };

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Skip to main content
      </a>

      <nav className="nav" aria-label="Main navigation">
        <div className="nav-w">
          <Link href="/" className="logo" aria-label="StudyVerse Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" width="26" height="26">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            StudyVerse
          </Link>

          <div className="nav-links" role="tablist">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "on" : ""}`}
                role="tab"
                aria-selected={isActive(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-r">
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={`Toggle ${isDark ? "light" : "dark"} mode`}
              title="Toggle dark mode (Ctrl+Shift+D)"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="theme-btn"
              onClick={() => {
                const overlay = document.getElementById("kbOverlay");
                if (overlay) overlay.classList.add("open");
              }}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard size={16} />
            </button>
            <div className="history-trigger">
              <button
                className="theme-btn"
                onClick={handleToggleHistory}
                aria-label="Recent history"
                title="Recent history"
              >
                <Clock size={16} />
              </button>
              {historyOpen && (
                <div className="history-dropdown open" id="historyDropdown">
                  <HistoryDropdown onClose={() => setHistoryOpen(false)} />
                </div>
              )}
            </div>
            <Link href="/dashboard" className="btn btn-p">
              Sign In
            </Link>
            <button
              className="mob-btn"
              onClick={toggleMobile}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={toggleMobile}
        aria-hidden="true"
      />

      {/* Mobile navigation */}
      <div
        className={`mobile-nav ${mobileOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
        <button className="mob-close" onClick={toggleMobile} aria-label="Close menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="mob-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
          </svg>
          StudyVerse
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "on" : ""}
            onClick={toggleMobile}
          >
            {link.label === "Home" && <House size={16} style={{ marginRight: 8 }} />}
            {link.label === "Classes" && <BookOpen size={16} style={{ marginRight: 8 }} />}
            {link.label === "NCERT" && <Book size={16} style={{ marginRight: 8 }} />}
            {link.label === "AI Tools" && <Bot size={16} style={{ marginRight: 8 }} />}
            {link.label === "Quiz" && <Trophy size={16} style={{ marginRight: 8 }} />}
            {link.label === "Dashboard" && <BarChart size={16} style={{ marginRight: 8 }} />}
            {link.label === "Admin" && <Settings size={16} style={{ marginRight: 8 }} />}
            {link.label}
          </Link>
        ))}
        <div className="mob-divider" />
        <Link href="/dashboard" onClick={toggleMobile} style={{ color: "var(--pri)", fontWeight: 700 }}>
          <LogOut size={16} style={{ marginRight: 8 }} /> Sign In
        </Link>
        <div className="mob-divider" />
        <button
          onClick={() => {
            toggleTheme();
            toggleMobile();
          }}
          className="mob-theme-btn"
        >
          {isDark ? <><Sun size={16} style={{ marginRight: 8 }} /> Toggle Light Mode</> : <><Moon size={16} style={{ marginRight: 8 }} /> Toggle Dark Mode</>}
        </button>
        <button
          onClick={() => {
            document.getElementById("kbOverlay")?.classList.add("open");
            toggleMobile();
          }}
          className="mob-theme-btn"
        >
          <Keyboard size={16} style={{ marginRight: 8 }} /> Keyboard Shortcuts
        </button>
      </div>
    </>
  );
}

function HistoryDropdown({ onClose }: { onClose: () => void }) {
  try {
    const h = JSON.parse(localStorage.getItem("sv-history") || "[]");
    if (h.length === 0) {
      return <div className="hd-empty">No recent history</div>;
    }
    return (
      <>
        {h.slice(0, 8).map((item: { classId: number; subject: string; chapterIdx: number; chapterName: string; label?: string }, i: number) => (
          <Link
            key={i}
            href={`/classes/${item.classId}/${encodeURIComponent(item.subject)}/${item.chapterIdx}`}
            className="hd-item"
            onClick={onClose}
          >
            <div>
              <b>{item.label || item.chapterName || "Unknown"}</b>
              <span>Class {item.classId} · {item.subject}</span>
            </div>
          </Link>
        ))}
      </>
    );
  } catch {
    return <div className="hd-empty">No recent history</div>;
  }
}
