"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Book,
  FileEdit,
  ClipboardList,
  HelpCircle,
  CheckCircle2,
  PenTool,
  RefreshCw,
  Sigma,
  BrainCircuit,
  FileText,
  Calendar,
  BookOpen,
  Link,
  Download,
} from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { isBookmarked, toggleBookmark as toggleBm, addToHistory } from "@/lib/storage";

interface ChapterClientProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  totalChapters: number;
}

const sectionIcons: Record<string, React.ReactNode> = {
  "📖": <Book size={18} />,
  "📝": <FileEdit size={18} />,
  "📋": <ClipboardList size={18} />,
  "❓": <HelpCircle size={18} />,
  "✅": <CheckCircle2 size={18} />,
  "✍️": <PenTool size={18} />,
  "🔄": <RefreshCw size={18} />,
  "🔢": <Sigma size={18} />,
  "🧠": <BrainCircuit size={18} />,
  "📄": <FileText size={18} />,
  "📅": <Calendar size={18} />,
  "📑": <BookOpen size={18} />,
  "🔗": <Link size={18} />,
};

const sections = [
  { icon: "📖", title: "Chapter Overview" },
  { icon: "📝", title: "Detailed Notes" },
  { icon: "📋", title: "Summary" },
  { icon: "❓", title: "Important Questions" },
  { icon: "✅", title: "MCQs" },
  { icon: "✍️", title: "Practice Questions" },
  { icon: "🔄", title: "Revision Notes" },
  { icon: "🔢", title: "Formula Sheet" },
  { icon: "🧠", title: "Mind Map" },
  { icon: "📄", title: "Worksheets" },
  { icon: "📅", title: "Previous Year Questions" },
  { icon: "📑", title: "Sample Papers" },
  { icon: "🔗", title: "Related Resources" },
];

export default function ChapterClient({
  classId,
  subject,
  chapterIdx,
  chapterName,
  totalChapters,
}: ChapterClientProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setBookmarked(isBookmarked(classId, subject, chapterIdx));
    addToHistory(classId, subject, chapterIdx, chapterName, `Ch ${chapterIdx + 1}: ${chapterName}`);
  }, [classId, subject, chapterIdx, chapterName]);

  const handleBookmark = useCallback(() => {
    const newState = toggleBm(classId, subject, chapterIdx, chapterName);
    setBookmarked(newState);
    showToast(newState ? "Bookmarked!" : "Bookmark removed", newState ? "success" : "info");
  }, [classId, subject, chapterIdx, chapterName, showToast]);

  const handleCopyLink = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("Link copied to clipboard!", "success");
      });
    } else {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        showToast("Link copied to clipboard!", "success");
      } catch {
        showToast("Could not copy link", "error");
      }
      document.body.removeChild(ta);
    }
  }, [showToast]);

  return (
    <>
      <div className="actions-bar">
        <button
          className="btn btn-p"
          onClick={() => showToast("Download coming soon", "info")}
        >
          <Download size={16} /> Download PDF
        </button>
        <button
          className={`btn btn-s${bookmarked ? " bm-on" : ""}`}
          onClick={handleBookmark}
        >
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        <button className="btn btn-s" onClick={handleCopyLink}>
          <Link size={16} /> Share
        </button>
        <button
          className="btn btn-s"
          onClick={() =>
            router.push(`/classes/${classId}/${encodeURIComponent(subject)}`)
          }
        >
          &larr; Back
        </button>
      </div>

      <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map((sec) => (
          <div key={sec.title} className="content-section">
            <h3>
              {sectionIcons[sec.icon] || sec.icon} {sec.title}{" "}
              <span className="placeholder-badge">Coming Soon</span>
            </h3>
            <p>Content is being prepared by our team. Stay tuned for updates!</p>
          </div>
        ))}
        <div className="content-section">
          <h3>Comments</h3>
          <p>Login to comment on this chapter.</p>
        </div>
      </div>

      {chapterIdx < totalChapters - 1 && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <button
            className="btn btn-g"
            onClick={() =>
              router.push(
                `/classes/${classId}/${encodeURIComponent(subject)}/${chapterIdx + 1}`
              )
            }
          >
            Next Chapter →
          </button>
        </div>
      )}
    </>
  );
}
