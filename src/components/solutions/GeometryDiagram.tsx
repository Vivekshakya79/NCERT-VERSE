"use client";

import { useMemo, useState, useCallback } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  GeometryDiagramData,
  GeometryStage,
} from "@/lib/geometry/types";
import { renderGeometrySvg, validateGeometryData } from "@/lib/geometry/render";

interface GeometryDiagramProps {
  data: GeometryDiagramData;
  stages?: GeometryStage[];
  caption?: string;
}

/**
 * Renders a data-driven, mathematically-calculated SVG figure.
 * Supports progressive construction stages, click-to-zoom, accessibility
 * and graceful error handling — the written solution always stays visible.
 */
export default function GeometryDiagram({
  data,
  stages,
  caption,
}: GeometryDiagramProps) {
  const [stageIdx, setStageIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const activeData = stages?.[stageIdx]?.data ?? data;

  const svg = useMemo(() => {
    try {
      const errors = validateGeometryData(activeData);
      if (errors.length > 0) {
        console.warn("Geometry diagram validation:", errors);
      }
      return renderGeometrySvg(activeData);
    } catch (err) {
      console.error("Geometry diagram render failed:", err);
      return null;
    }
  }, [activeData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setZoomed(false);
  }, []);

  const goStage = useCallback((next: number) => {
    if (!stages) return;
    setStageIdx(Math.max(0, Math.min(stages.length - 1, next)));
  }, [stages]);

  if (!svg) {
    return (
      <div className="gd-fallback" role="img" aria-label="Diagram unavailable">
        <p className="gd-fallback-text">
          The figure for this step could not be rendered. Please refer to the
          written explanation above.
        </p>
      </div>
    );
  }

  const content = (
    <div className="gd-svg" dangerouslySetInnerHTML={{ __html: svg }} />
  );

  return (
    <div className="gd-wrap">
      {stages && stages.length > 1 && (
        <div className="gd-stages" role="group" aria-label="Construction steps">
          <button
            className="gd-stage-nav"
            onClick={() => goStage(stageIdx - 1)}
            disabled={stageIdx === 0}
            aria-label="Previous construction step"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="gd-stage-track">
            {stages.map((s, i) => (
              <button
                key={i}
                className={`gd-stage-btn ${i === stageIdx ? "on" : ""}`}
                onClick={() => setStageIdx(i)}
                title={s.label}
                aria-label={s.label}
                aria-pressed={i === stageIdx}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="gd-stage-nav"
            onClick={() => goStage(stageIdx + 1)}
            disabled={stageIdx === stages.length - 1}
            aria-label="Next construction step"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
      {stages && stages.length > 1 && (
        <p className="gd-stage-label">{stages[stageIdx].label}</p>
      )}

      <div className="gd-figure">
        <button
          className="gd-zoom"
          onClick={() => setZoomed(true)}
          aria-label="Zoom diagram"
          title="Click to zoom"
        >
          <Maximize2 size={14} />
        </button>
        {content}
        {caption && <p className="gd-caption">{caption}</p>}
      </div>

      {zoomed && (
        <div
          className="gd-overlay"
          onClick={() => setZoomed(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Diagram zoomed view"
          tabIndex={-1}
        >
          <button
            className="gd-close"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>
          <div className="gd-overlay-content" onClick={(e) => e.stopPropagation()}>
            {content}
            {caption && <p className="gd-caption">{caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}