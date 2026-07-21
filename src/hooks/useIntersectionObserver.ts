"use client";

import { useEffect, useRef } from "react";

export function useIntersectionObserver(
  callback?: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            callback?.(entry);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}
