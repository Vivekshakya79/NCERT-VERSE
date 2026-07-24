import Link from "next/link";
import { memo } from "react";
import { BookOpen } from "lucide-react";
import { Class } from "@/types";
import { getSubjectIcon } from "@/data/subject-icons";

interface ClassCardProps {
  classData: Class;
}

const ClassCard = memo(function ClassCard({ classData }: ClassCardProps) {
  const { id, name, subjects } = classData;

  return (
    <Link
      href={`/classes/${id}`}
      className="cls-card glow-card"
      aria-label={`${name}: ${subjects.length} subjects`}
    >
      <span className="cls-ico" aria-hidden="true">
        <BookOpen size={24} />
      </span>
      <div className="num">{id}</div>
      <div className="ttl">{name}</div>
      <div className="meta">{subjects.length} Subjects</div>
      <div className="subj-preview">
        {subjects.slice(0, 6).map((s) => (
          <span key={s}>{getSubjectIcon(s)}</span>
        ))}
      </div>
    </Link>
  );
});

export default ClassCard;
