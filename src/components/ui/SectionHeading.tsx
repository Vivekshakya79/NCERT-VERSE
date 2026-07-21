interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
}

export default function SectionHeading({ label, title, description }: SectionHeadingProps) {
  return (
    <div className="sec-h reveal">
      {label && <div className="lab">{label}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
