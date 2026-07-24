interface PageHeroProps {
  badge: string;
  title: string;
  description?: string;
}

export function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <div className="ph">
      <div className="ph-mesh">
        <div className="ph-mesh-g" />
        <div className="ph-mesh-g" />
        <div className="ph-mesh-g" />
        <div className="ph-mesh-g" />
        <div className="ph-mesh-g" />
      </div>
      <div className="ph-light-tr" />
      <div className="ph-light-left" />
      <div className="ph-aurora" />
      <div className="ph-glass" />
      <div className="ph-noise" />
      <div className="ph-grid" />
      <div className="ph-blobs">
        <div className="ph-blob" />
        <div className="ph-blob" />
        <div className="ph-blob" />
        <div className="ph-blob" />
        <div className="ph-blob" />
        <div className="ph-blob" />
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
