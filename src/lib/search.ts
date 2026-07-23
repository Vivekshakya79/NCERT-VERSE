import { classes } from "@/data/classes";
import { getChapters } from "@/data/chapters";
import { isSubjectHidden } from "@/data/classes";
import { searchSolutions } from "@/data/solutions-data";

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
      // Skip hidden subjects in search results
      if (isSubjectHidden(cls.id, sub)) return;

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

  // Include solution search results
  const solutionResults = searchSolutions(query);
  solutionResults.forEach((sr) => {
    results.push({
      title: `Q${sr.question.questionNumber} — ${sr.exerciseName} — ${sr.chapterName}`,
      meta: `Class ${sr.classId} · ${sr.subject} · Solution`,
      href: `/ncert/${sr.classId}/${encodeURIComponent(sr.subject)}/${sr.chapterIdx}/exercise/${encodeURIComponent(sr.exerciseName)}/${sr.question.id}`,
    });
  });

  return results.slice(0, 12);
}
