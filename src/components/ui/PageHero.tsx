import { memo } from "react";
import { HeroAmbientBackground } from "./HeroAmbientBackground";

interface PageHeroProps {
  badge: string;
  title: string;
  description?: string;
  className?: string;
}

export const PageHero = memo(function PageHero({ badge, title, description, className }: PageHeroProps) {
  return (
    <div className={`ph${className ? ` ${className}` : ''}`}>
      <HeroAmbientBackground />
      <div className="ph-grid" />
      <div className="ph-fade" />
      <div className="ph-content">
        <div className="ph-badge">{badge}</div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
});
