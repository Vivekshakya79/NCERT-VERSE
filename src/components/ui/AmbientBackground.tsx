/**
 * AmbientBackground — reusable premium glow background component.
 *
 * Renders 7 large radial-gradient blobs with ultra-subtle CSS-only animation.
 * Animated only transform: translate3d() / scale() — GPU accelerated, 60 FPS.
 * No JavaScript, no canvas, no SVG filters, no backdrop-filter.
 *
 * Usage: <AmbientBackground />
 */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-glow" />
      <div className="ambient-glow" />
      <div className="ambient-glow" />
      <div className="ambient-glow" />
      <div className="ambient-glow" />
      <div className="ambient-glow" />
      <div className="ambient-glow" />
    </div>
  );
}
