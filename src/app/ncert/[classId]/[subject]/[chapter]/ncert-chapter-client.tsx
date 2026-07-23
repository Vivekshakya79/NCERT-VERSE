"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import { isBookmarked, toggleBookmark as toggleBm } from "@/lib/storage";
import type { Exercise } from "@/types";

interface NCERTChapterClientProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  exercises: Exercise[];
  hasSolutions: boolean;
}

export default function NCERTChapterClient({
  classId,
  subject,
  chapterIdx,
  chapterName,
  exercises,
  hasSolutions,
}: NCERTChapterClientProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setBookmarked(isBookmarked(classId, subject, chapterIdx));
  }, [classId, subject, chapterIdx]);

  const handleBookmark = useCallback(() => {
    const newState = toggleBm(classId, subject, chapterIdx, chapterName);
    setBookmarked(newState);
    showToast(newState ? "Bookmarked! ⭐" : "Bookmark removed", newState ? "success" : "info");
  }, [classId, subject, chapterIdx, chapterName, showToast]);

  return (
    <>
      <div className="actions-bar">
        <button className="btn btn-p" onClick={() => showToast("Download coming soon", "info")}>
          📥 Download
        </button>
        <button
          className={`btn btn-s${bookmarked ? " bm-on" : ""}`}
          onClick={handleBookmark}
        >
          {bookmarked ? "⭐ Bookmarked" : "🔖 Bookmark"}
        </button>
      </div>

      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Exercise Solutions */}
        <div className="content-section">
          <h3>📖 Exercise Solutions
            {exercises.length > 0 && <span className="sol-badge-ready">{exercises.length} exercises</span>}
          </h3>
          {exercises.length > 0 ? (
            <div className="ex-list">
              {exercises.map((ex) => (
                <Link
                  key={ex.name}
                  href={`/ncert/${classId}/${encodeURIComponent(subject)}/${chapterIdx}/exercise/${encodeURIComponent(ex.name)}/${ex.questions[0]?.id || ""}`}
                  className="ex-item stagger"
                >
                  <div className="ex-item-icon">📝</div>
                  <div className="ex-item-content">
                    <h4>{ex.name}</h4>
                    <p>{ex.questions.length} Question{ex.questions.length !== 1 ? "s" : ""}</p>
                  </div>
                  <svg
                    className="ch-arrow"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <p>Detailed solutions will be added by our academic team.</p>
          )}
        </div>

        <div className="content-section">
          <h3>📝 Intext Questions <span className="placeholder-badge">Coming Soon</span></h3>
          <p>In-text solutions will appear here once published.</p>
        </div>
        <div className="content-section">
          <h3>🔢 Additional Exercises <span className="placeholder-badge">Coming Soon</span></h3>
          <p>Supplementary exercises are being prepared.</p>
        </div>
      </div>
    </>
  );
}
