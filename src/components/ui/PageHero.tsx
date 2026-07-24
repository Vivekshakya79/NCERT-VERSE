import { memo } from "react";
import { AmbientBackground } from "./AmbientBackground";

interface PageHeroProps {
  badge: string;
  title: string;
  description?: string;
  className?: string;
}

export const PageHero = memo(function PageHero({ badge, title, description, className }: PageHeroProps) {
  return (
    <div className={`ph${className ? ` ${className}` : ''}`}>
      <AmbientBackground />
      <div className="ph-fade" />
      <div className="ph-content">
        <div className="ph-badge">{badge}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
});
