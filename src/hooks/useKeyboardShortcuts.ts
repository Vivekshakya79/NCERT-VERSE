"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ShortcutMap {
  [key: string]: string;
}

const ROUTES: ShortcutMap = {
  h: "/",
  c: "/classes",
  n: "/ncert",
  a: "/ai",
  q: "/quiz",
  d: "/dashboard",
};

export function useKeyboardShortcuts(onToggleTheme: () => void) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // Show shortcuts modal with ?
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const overlay = document.getElementById("kbOverlay");
        if (overlay) overlay.classList.add("open");
        return;
      }

      // Focus search with /
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const search = document.getElementById("globalSearch");
        if (search) {
          search.focus();
          (search as HTMLInputElement).select();
        }
        return;
      }

      // Ctrl+Shift+D for theme toggle
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        onToggleTheme();
        return;
      }

      // Ctrl+Shift+U for back to top
      if (e.ctrlKey && e.shiftKey && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // G key for navigation
      if (e.key === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        let timeoutId: ReturnType<typeof setTimeout>;
        const handler = (ev: KeyboardEvent) => {
          clearTimeout(timeoutId);
          document.removeEventListener("keydown", handler);
          const route = ROUTES[ev.key];
          if (route && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
            router.push(route);
          }
        };
        document.addEventListener("keydown", handler);
        timeoutId = setTimeout(() => document.removeEventListener("keydown", handler), 1000);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, onToggleTheme]);
}
