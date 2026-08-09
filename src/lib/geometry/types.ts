// ─────────────────────────────────────────────────────────────────────────────
// GEOMETRY DIAGRAM DATA MODEL
// A data-driven, mathematically-calculated figure engine for NCERT VERSE.
//
// Figures are described declaratively (points, segments, circles, angles,
// labels, ...) and rendered to precise, responsive SVG by `renderGeometrySvg`.
// The engine computes derived geometry (angle arcs, right-angle markers,
// perpendicular bisectors, label offsets, ...) so every figure is
// mathematically accurate — never hand-drawn arbitrary coordinates.
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoPoint {
  /** Unique id, e.g. "A", "B", "C", "O" */
  id: string;
  /** x coordinate in SVG user space */
  x: number;
  /** y coordinate in SVG user space */
  y: number;
  /** Display label (defaults to id) */
  label?: string;
  /** Manual label offset */
  labelOffset?: { dx: number; dy: number };
  /** Point colour (default NCERT blue #2563EB) */
  color?: string;
  /** Point radius (default 4) */
  size?: number;
  /** Whether to draw the label (default true) */
  showLabel?: boolean;
  /** Label text anchor (default "middle") */
  labelAnchor?: "start" | "middle" | "end";
}

export interface GeoSegment {
  from: string;
  to: string;
  color?: string;
  width?: number;
  dashed?: boolean;
  dash?: string;
  opacity?: number;
  /** Arrow markers at the end / start / both ends */
  marker?: "end" | "start" | "both";
  /** Label drawn at the middle of the segment, e.g. "5 cm" */
  label?: string;
  labelOffset?: { dx: number; dy: number };
  /** Position of the label along the segment, 0..1 (default 0.5) */
  labelPosition?: number;
  /** Renders as a dashed construction line */
  construction?: boolean;
}

export interface GeoCircle {
  center: string;
  radius: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  dash?: string;
  fill?: string;
  fillOpacity?: number;
  label?: string;
  labelOffset?: { dx: number; dy: number };
}

export interface GeoArc {
  center: string;
  radius: number;
  /** Start angle in degrees (SVG coordinate space) */
  startAngle: number;
  /** End angle in degrees (SVG coordinate space) */
  endAngle: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  dash?: string;
  fill?: string;
  fillOpacity?: number;
  label?: string;
  labelOffset?: { dx: number; dy: number };
}

export interface GeoAngle {
  vertex: string;
  /** Point id on one ray */
  from: string;
  /** Point id on the other ray */
  to: string;
  /** Arc radius (default 30) */
  radius?: number;
  color?: string;
  width?: number;
  fill?: string;
  fillOpacity?: number;
  /** Degree label, e.g. "70°" */
  label?: string;
  /** Radius at which the label sits (default radius + 12) */
  labelRadius?: number;
  showLabel?: boolean;
  labelOffset?: { dx: number; dy: number };
}

export interface GeoRightAngle {
  vertex: string;
  from: string;
  to: string;
  /** Square size (default 14) */
  size?: number;
  color?: string;
}

export interface GeoParallelMarker {
  segment: [string, string];
  /** Number of chevrons (1 or 2) */
  count?: number;
  /** Perpendicular offset from the segment (default 8) */
  offset?: number;
  color?: string;
}

export interface GeoMidpointMarker {
  segment: [string, string];
  color?: string;
}

export interface GeoLabel {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  bold?: boolean;
  italic?: boolean;
  font?: string;
}

export interface GeoGrid {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  /** Grid step in user units */
  step?: number;
  color?: string;
  opacity?: number;
}

export interface GeoAxes {
  /** Point id at the origin */
  origin: string;
  /** Extent of the x-axis in user units */
  xMax?: number;
  /** Extent of the y-axis in user units */
  yMax?: number;
  xLabel?: string;
  yLabel?: string;
  color?: string;
  showTicks?: boolean;
  tickStep?: number;
  tickColor?: string;
  arrow?: boolean;
}

export interface GeoPolygon {
  /** Point ids forming the polygon, in order */
  points: string[];
  color?: string;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
}

export interface GeometryDiagramData {
  /** viewBox width (default 560) */
  width?: number;
  /** viewBox height (default 420) */
  height?: number;
  /** Accessible SVG title */
  title?: string;
  /** Accessible SVG description */
  description?: string;
  points: GeoPoint[];
  segments?: GeoSegment[];
  circles?: GeoCircle[];
  arcs?: GeoArc[];
  angles?: GeoAngle[];
  rightAngles?: GeoRightAngle[];
  parallelMarkers?: GeoParallelMarker[];
  midpointMarkers?: GeoMidpointMarker[];
  labels?: GeoLabel[];
  polygons?: GeoPolygon[];
  grid?: GeoGrid;
  axes?: GeoAxes;
  /** Dashed construction lines */
  constructionLines?: GeoSegment[];
}

export interface GeometryStage {
  /** Stage label, e.g. "Step 1: Draw AB" */
  label: string;
  /** Full diagram data for this stage */
  data: GeometryDiagramData;
}

export interface GeometryDiagramSpec {
  /** The complete diagram */
  data: GeometryDiagramData;
  /** Progressive construction stages (optional) */
  stages?: GeometryStage[];
  /** Solution step number where this diagram belongs (optional) */
  stepIndex?: number;
}