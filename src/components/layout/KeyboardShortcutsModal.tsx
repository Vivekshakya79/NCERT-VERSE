"use client";

import { useEffect } from "react";

const shortcuts = [
  { keys: ["G", "H"], label: "Go to Home" },
  { keys: ["G", "C"], label: "Go to Classes" },
  { keys: ["G", "N"], label: "Go to NCERT" },
  { keys: ["G", "A"], label: "Go to AI Tools" },
  { keys: ["G", "Q"], label: "Go to Quiz" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["/"], label: "Focus Search" },
  { keys: ["Ctrl", "Shift", "D"], label: "Toggle Dark Mode" },
  { keys: ["Ctrl", "Shift", "U"], label: "Back to Top" },
  { keys: ["?"], label: "Show Shortcuts" },
];

export default function KeyboardShortcutsModal() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const overlay = document.getElementById("kbOverlay");
      if (!overlay || !overlay.classList.contains("open")) return;
      if (e.key === "Escape" || e.key === "?") {
        overlay.classList.remove("open");
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const close = () => {
    document.getElementById("kbOverlay")?.classList.remove("open");
  };

  return (
    <div className="kb-overlay" id="kbOverlay" onClick={close} aria-hidden="true">
      <div className="kb-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Keyboard shortcuts">
        <h3>
          ⌨️ Keyboard Shortcuts
          <button className="kb-close" onClick={close} aria-label="Close shortcuts">
            ✕
          </button>
        </h3>
        <div className="kb-grid">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="kb-row">
              <span>{shortcut.label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {shortcut.keys.map((key, j) => (
                  <kbd key={j}>{key}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
