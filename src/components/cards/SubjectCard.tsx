import Link from "next/link";
import { memo } from "react";
import { getSubjectIcon } from "@/data/subject-icons";

interface SubjectCardProps {
  classId: number;
  subject: string;
  chapterCount: number;
}

const SubjectCard = memo(function SubjectCard({ classId, subject, chapterCount }: SubjectCardProps) {
  return (
    <Link
      href={`/classes/${classId}/${encodeURIComponent(subject)}`}
      className="chip"
    >
      <span className="chip-ico" aria-hidden="true">{getSubjectIcon(subject)}</span>
      <span>{subject}</span>
      <span className="chip-count">{chapterCount} Ch</span>
      <svg
        className="chip-arrow"
        width="18"
        height="18"
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

export default SubjectCard;
