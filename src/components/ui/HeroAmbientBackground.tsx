/**
 * HeroAmbientBackground — home page hero background.
 *
 * 6 organic glow regions arranged in a J.J. Thomson "plum pudding" layout:
 * one large center glow behind the heading, with smaller "electron" glows
 * scattered irregularly around it, plus 10 electron particle dots with
 * live floating movement.
 *
 * Animated only transform: translate3d() / translate() — GPU accelerated, 60 FPS.
 * Pure CSS, no JavaScript, no canvas, no SVG filters, no backdrop-filter.
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
      <div className="hero-ambient-electrons">
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
        <div className="hero-ambient-electron" />
      </div>
    </div>
  );
}
