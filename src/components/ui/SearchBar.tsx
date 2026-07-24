"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { performSearch, SearchMatch } from "@/lib/search";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const res = performSearch(value);
      setResults(res);
      setIsOpen(value.length >= 2);
    }, 150);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchMatch) => {
    setIsOpen(false);
    setQuery("");
    router.push(result.href);
  };

  return (
    <div className="search-box" ref={containerRef}>
      <div className="search-input-wrap">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          id="globalSearch"
          type="text"
          placeholder="Search chapters, subjects, classes..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          aria-label="Search across all classes, subjects, and chapters"
          autoComplete="off"
        />
        <span className="search-hint">/</span>
      </div>
      <div className={`search-results ${isOpen ? "open" : ""}`} role="listbox">
        {results.length > 0 ? (
          results.map((result, i) => (
            <div
              key={i}
              className="sr-item"
              onClick={() => handleSelect(result)}
              role="option"
              aria-selected={false}
            >
              <b>{result.title}</b>
              <span>{result.meta}</span>
            </div>
          ))
        ) : query.length >= 2 ? (
          <div className="sr-item">
            <b>No results</b>
            <span>Try different keywords</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
