import Link from "next/link";
import { memo } from "react";
import { BookOpen } from "lucide-react";

interface ChapterCardProps {
  classId: number;
  subject: string;
  chapterIdx: number;
  chapterName: string;
  isPlaceholder?: boolean;
}

const ChapterCard = memo(function ChapterCard({
  classId,
  subject,
  chapterIdx,
  chapterName,
  isPlaceholder = false,
}: ChapterCardProps) {
  return (
    <Link
      href={`/classes/${classId}/${encodeURIComponent(subject)}/${chapterIdx}`}
      className={`ch-item ${isPlaceholder ? "placeholder" : ""}`}
    >
      <div className="ch-ico" aria-hidden="true">
        <BookOpen size={18} />
      </div>
      <div className="ch-content">
        <h4>Chapter {chapterIdx + 1} — {chapterName}</h4>
        <p>Class {classId} · {subject}</p>
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
  );
});

export default ChapterCard;
