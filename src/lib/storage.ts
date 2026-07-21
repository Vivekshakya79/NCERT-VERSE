"use client";

import { BookmarkItem, HistoryItem } from "@/types";

// === BOOKMARKS ===
export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("sv-bookmarks") || "[]");
  } catch {
    return [];
  }
}

export function isBookmarked(classId: number, subject: string, chapterIdx: number): boolean {
  return getBookmarks().some((b) => b.classId === classId && b.subject === subject && b.chapterIdx === chapterIdx);
}

export function toggleBookmark(classId: number, subject: string, chapterIdx: number, chapterName: string): boolean {
  const bms = getBookmarks();
  const idx = bms.findIndex((b) => b.classId === classId && b.subject === subject && b.chapterIdx === chapterIdx);

  if (idx > -1) {
    bms.splice(idx, 1);
  } else {
    bms.push({ classId, subject, chapterIdx, chapterName, time: Date.now() });
  }
  localStorage.setItem("sv-bookmarks", JSON.stringify(bms));
  return idx === -1;
}

// === HISTORY ===
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("sv-history") || "[]");
  } catch {
    return [];
  }
}

export function addToHistory(classId: number, subject: string, chapterIdx: number, chapterName: string, label?: string) {
  try {
    const h = getHistory();
    const filtered = h.filter((i) => i.classId !== classId || i.subject !== subject || i.chapterIdx !== chapterIdx);
    filtered.unshift({ classId, subject, chapterIdx, chapterName, label: label || chapterName, time: Date.now() });
    if (filtered.length > 30) filtered.length = 30;
    localStorage.setItem("sv-history", JSON.stringify(filtered));
  } catch {
    // silent
  }
}

// === THEME ===
export function getTheme(): string {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("sv-theme") || "light";
}

export function setTheme(theme: string) {
  localStorage.setItem("sv-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}
