import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  variant = "default" 
}: MetricCardProps) {
  const variantStyles = {
    default: "text-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400"
  };

  const iconStyles = {
    default: "text-blue-500 dark:text-blue-400",
    success: "text-emerald-500 dark:text-emerald-400",
    warning: "text-amber-500 dark:text-amber-400",
    danger: "text-red-500 dark:text-red-400"
  };

  return (
    <Card data-testid={`metric-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p className={`text-xl sm:text-2xl font-semibold mt-1 ${variantStyles[variant]}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className="p-1.5 bg-muted rounded-md shrink-0">
            <Icon className={`h-4 w-4 ${iconStyles[variant]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
