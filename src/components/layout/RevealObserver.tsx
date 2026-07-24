"use client";

import { useEffect, useRef } from "react";

/**
 * Global IntersectionObserver that adds `.visible` class to all
 * `.reveal` and `.stagger` elements when they enter the viewport.
 *
 * Uses a single observer instance with debounced mutation observation
 * for minimal performance overhead.
 */
export default function RevealObserver() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    observerRef.current = observer;

    // Observe all current .reveal and .stagger elements
    document.querySelectorAll<HTMLElement>(".reveal, .stagger").forEach((el) => {
      if (!el.classList.contains("visible")) {
        observer.observe(el);
      }
    });

    // Debounced mutation observer for dynamically loaded content
    let mutationTimeout: ReturnType<typeof setTimeout>;
    const mutationObserver = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        document.querySelectorAll<HTMLElement>(".reveal, .stagger").forEach((el) => {
          if (!el.classList.contains("visible")) {
            observer.observe(el);
          }
        });
      }, 200);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(mutationTimeout);
    };
  }, []);

  return null;
}
