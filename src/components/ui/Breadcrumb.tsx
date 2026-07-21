import Link from "next/link";
import { BreadcrumbItem } from "@/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast) {
          return (
            <span key={i} aria-current="page">
              {item.label}
            </span>
          );
        }
        if (item.href) {
          return (
            <span key={i}>
              <Link href={item.href}>{item.label}</Link>
              <span aria-hidden="true">›</span>
            </span>
          );
        }
        return (
          <span key={i}>
            <span>{item.label}</span>
            <span aria-hidden="true">›</span>
          </span>
        );
      })}
    </nav>
  );
}
