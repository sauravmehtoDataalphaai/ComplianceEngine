import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import StatusBadge, { type StatusType } from "./StatusBadge";
import { Edit, Trash2, Play, Clock } from "lucide-react";

interface RuleCardProps {
  id: string;
  name: string;
  description?: string;
  expression: string;
  category: string;
  severity: "hard" | "soft";
  status?: StatusType;
  lastRun?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRun?: (id: string) => void;
}

export default function RuleCard({
  id,
  name,
  description,
  expression,
  category,
  severity,
  status,
  lastRun,
  onEdit,
  onDelete,
  onRun,
}: RuleCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`rule-card-${id}`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{name}</h3>
              <Badge variant="outline" className="text-xs shrink-0">{category}</Badge>
              <Badge 
                variant={severity === "hard" ? "destructive" : "secondary"} 
                className="text-xs shrink-0"
              >
                {severity === "hard" ? "Hard" : "Soft"}
              </Badge>
              {status && <StatusBadge status={status} />}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{description}</p>
            )}
            <div className="mt-2 p-1.5 bg-muted rounded-md">
              <code className="text-xs font-mono break-all">{expression}</code>
            </div>
            {lastRun && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                Last run: {lastRun}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-0.5 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onRun?.(id)}
                  data-testid={`run-rule-${id}`}
                >
                  <Play className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Run Rule</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onEdit?.(id)}
                  data-testid={`edit-rule-${id}`}
                >
                  <Edit className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Rule</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onDelete?.(id)}
                  data-testid={`delete-rule-${id}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Rule</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export type { RuleCardProps };
