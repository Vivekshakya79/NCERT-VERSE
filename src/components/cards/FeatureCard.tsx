import { memo } from "react";
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
}

const FeatureCard = memo(function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const Icon = iconMap[icon] || BookOpen;
  return (
    <div className="feat-card" tabIndex={0}>
      <div className="feat-ico" aria-hidden="true"><Icon size={24} /></div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
});

export default FeatureCard;
