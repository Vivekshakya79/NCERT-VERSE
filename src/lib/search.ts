import { classes } from "@/data/classes";
import { getChapters } from "@/data/chapters";

export interface SearchMatch {
  title: string;
  meta: string;
  href: string;
}

export function performSearch(query: string): SearchMatch[] {
  if (!query || query.length < 2) return [];
  const lq = query.toLowerCase();
  const results: SearchMatch[] = [];

  classes.forEach((cls) => {
    if (cls.name.toLowerCase().includes(lq)) {
      results.push({
        title: cls.name,
        meta: `${cls.subjects.length} Subjects`,
        href: `/classes/${cls.id}`,
      });
    }
    cls.subjects.forEach((sub) => {
      if (sub.toLowerCase().includes(lq)) {
        results.push({
          title: sub,
          meta: cls.name,
          href: `/classes/${cls.id}/${encodeURIComponent(sub)}`,
        });
      }
      getChapters(cls.id, sub).forEach((ch, i) => {
        if (ch.toLowerCase().includes(lq)) {
          results.push({
            title: ch,
            meta: `${cls.name} · ${sub}`,
            href: `/classes/${cls.id}/${encodeURIComponent(sub)}/${i}`,
          });
        }
      });
    });
  });

  return results.slice(0, 8);
}
