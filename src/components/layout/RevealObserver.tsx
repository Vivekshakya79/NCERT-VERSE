"use client";

import { useEffect } from "react";

/**
 * Global IntersectionObserver that adds `.visible` class to all
 * `.reveal` and `.stagger` elements when they enter the viewport.
 *
 * This replicates the scroll-reveal behavior from the original HTML
 * and was missing from the Next.js port.
 */
export default function RevealObserver() {
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

    // Observe all current and future .reveal and .stagger elements
    const observe = () => {
      document.querySelectorAll<HTMLElement>(".reveal, .stagger").forEach((el) => {
        if (!el.classList.contains("visible")) {
          observer.observe(el);
        }
      });
    };

    observe();

    // Re-observe when DOM changes (for dynamically loaded content)
    const mutationObserver = new MutationObserver(observe);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}
