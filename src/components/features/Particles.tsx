"use client";

import { useState, useEffect } from "react";

/**
 * Renders decorative particles with random positions/sizes.
 * Random values are generated in useEffect (client-only) to
 * prevent hydration mismatches when used in client components.
 */
export default function Particles({ count = 8 }: { count?: number }) {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => (
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
      ))
    );
  }, [count]);

  return <>{particles}</>;
}
