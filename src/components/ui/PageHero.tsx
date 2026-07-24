import { memo } from "react";

interface PageHeroProps {
  badge: string;
  title: string;
  description?: string;
}

export const PageHero = memo(function PageHero({ badge, title, description }: PageHeroProps) {
  return (
    <div className="ph">
      <div className="ph-bg" />
      <div className="ph-fade" />
      <div className="ph-content">
        <div className="ph-badge">{badge}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
});
