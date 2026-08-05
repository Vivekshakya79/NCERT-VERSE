import { memo } from "react";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  CheckCircle,
  Bot,
  BarChart,
  Smartphone,
  FileEdit,
  Puzzle,
  FolderKanban,
  Calendar,
  Sigma,
  FileText,
  House,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  PenTool,
  CheckCircle,
  Bot,
  BarChart,
  Smartphone,
  FileEdit,
  Puzzle,
  FolderKanban,
  Calendar,
  Sigma,
  FileText,
  House,
  RefreshCw,
  Sparkles,
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href?: string;
}

const FeatureCard = memo(function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const Icon = iconMap[icon] || BookOpen;
  const inner = (
    <>
      <div className="feat-ico" aria-hidden="true"><Icon size={24} /></div>
      <h4>{title}</h4>
      <p>{description}</p>
      {href && (
        <span className="feat-cta" aria-hidden="true">
          Open <ArrowUpRight size={15} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="feat-card feat-card-link" tabIndex={0}>
        {inner}
      </Link>
    );
  }

  return (
    <div className="feat-card" tabIndex={0}>
      {inner}
    </div>
  );
});

export default FeatureCard;
