interface PageHeroProps {
  badge: string;
  title: string;
  description?: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <div className="ph">
      <div className="ph-bg" />
      <div className="ph-grid" />
      <div className="ph-glow" />
      <div className="ph-particles">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="ph-particle"
            style={{
              width: `${12 + Math.random() * 20}px`,
              height: `${12 + Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * -20}s`,
              opacity: `${0.03 + Math.random() * 0.05}`,
            }}
          />
        ))}
      </div>
      <div className="ph-fade" />
      <div className="ph-content">
        <div className="ph-badge">{badge}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}
