"use client";

import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/faq";

interface FaqAccordionProps {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <FaqItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button
        className="faq-q"
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span>{item.q}</span>
        <ChevronDown
          size={18}
          className="faq-chevron"
          aria-hidden="true"
        />
      </button>
      <div
        className="faq-a-wrap"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight ?? 200 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="faq-a" ref={contentRef}>
          <p>{item.a}</p>
        </div>
      </div>
    </div>
  );
}
