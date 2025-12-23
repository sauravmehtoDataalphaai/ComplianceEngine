import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

type StatusType = "passed" | "soft_breach" | "hard_breach" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
}

const statusConfig = {
  passed: {
    label: "Passed",
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
  },
  soft_breach: {
    label: "Soft Breach",
    icon: AlertTriangle,
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
  },
  hard_breach: {
    label: "Hard Breach",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border"
  }
};

export default function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.className} gap-1 font-medium`}
      data-testid={`status-badge-${status}`}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

export type { StatusType };
