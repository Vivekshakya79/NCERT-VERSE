/**
 * HeroAmbientBackground — hero background glow.
 *
 * 6 organic radial-gradient glow regions arranged around the heading:
 * one large center glow plus smaller glows scattered irregularly around it.
 *
 * Pure CSS, no JavaScript, no canvas, no backdrop-filter. Static (not
 * animated) so the hero background costs zero per-frame work.
 */
export function HeroAmbientBackground() {
  return (
    <div className="hero-ambient-bg" aria-hidden="true">
      <div className="hero-ambient-glow" />
      <div className="hero-ambient-glow" />
      <div className="hero-ambient-glow" />
      <div className="hero-ambient-glow" />
      <div className="hero-ambient-glow" />
      <div className="hero-ambient-glow" />
    </div>
  );
}
