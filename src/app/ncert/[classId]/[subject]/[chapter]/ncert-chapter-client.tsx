"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/contexts/ToastContext";
import { isBookmarked, toggleBookmark as toggleBm } from "@/lib/storage";

interface NCERTChapterClientProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
}

export default function NCERTChapterClient({
  classId,
  subject,
  chapterIdx,
  chapterName,
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
        <div className="content-section">
          <h3>📖 Exercise Solutions <span className="placeholder-badge">Coming Soon</span></h3>
          <p>Detailed solutions will be added by our academic team.</p>
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
