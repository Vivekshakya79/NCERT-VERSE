interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feat-card" tabIndex={0}>
      <div className="feat-ico" aria-hidden="true">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}
