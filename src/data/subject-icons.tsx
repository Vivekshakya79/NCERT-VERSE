import {
  Calculator,
  FlaskConical,
  Globe,
  BookText,
  Languages,
  Omega,
  Atom,
  Beaker,
  Leaf,
  Laptop,
  IndianRupee,
  Building2,
  ChartColumn,
  Trophy,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Mathematics: Calculator,
  Science: FlaskConical,
  "Social Science": Globe,
  English: BookText,
  Hindi: Languages,
  Sanskrit: Omega,
  Physics: Atom,
  Chemistry: Beaker,
  Biology: Leaf,
  "Computer Science": Laptop,
  Accountancy: IndianRupee,
  "Business Studies": Building2,
  Economics: ChartColumn,
  "Physical Education": Trophy,
};

export function getSubjectIcon(subject: string): React.ReactNode {
  const Icon = iconMap[subject] || BookOpen;
  return <Icon size={20} aria-hidden="true" />;
}
