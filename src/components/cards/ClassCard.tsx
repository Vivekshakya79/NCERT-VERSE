import Link from "next/link";
import { Class } from "@/types";

interface ClassCardProps {
  classData: Class;
}

export default function ClassCard({ classData }: ClassCardProps) {
  const { id, name, subjects } = classData;

  return (
    <Link
      href={`/classes/${id}`}
      className="cls-card glow-card"
      aria-label={`${name}: ${subjects.length} subjects`}
    >
      <span className="cls-ico" aria-hidden="true">📘</span>
      <div className="num">{id}</div>
      <div className="ttl">{name}</div>
      <div className="meta">{subjects.length} Subjects</div>
      <div className="subj-preview">
        {subjects.slice(0, 6).map((s) => (
          <span key={s}>📘</span>
        ))}
      </div>
    </Link>
  );
}
