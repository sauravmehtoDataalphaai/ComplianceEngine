import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge, { type StatusType } from "./StatusBadge";
import { Edit, Trash2, Play, Clock, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RuleCardCompactProps {
  id: string;
  name: string;
  description?: string;
  expression: string;
  category: string;
  severity: "hard" | "soft";
  status?: StatusType;
  lastRun?: string;
  dataSource?: string;
  storedProcName?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onRun?: (id: string) => void;
}

export default function RuleCardCompact({
  id,
  name,
  description,
  expression,
  category,
  severity,
  status,
  lastRun,
  dataSource,
  storedProcName,
  onEdit,
  onDelete,
  onRun,
}: RuleCardCompactProps) {
  return (
    <Card className="hover-elevate" data-testid={`rule-card-compact-${id}`}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <h3 className="font-semibold text-sm truncate">{name}</h3>
              <Badge variant="outline" className="text-xs shrink-0">{category}</Badge>
              <Badge 
                variant={severity === "hard" ? "destructive" : "secondary"} 
                className="text-xs shrink-0"
              >
                {severity === "hard" ? "Hard" : "Soft"}
              </Badge>
              {status && <StatusBadge status={status} showIcon={false} />}
            </div>
            
            <div className="flex flex-col gap-1">
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
              )}
              <code className="text-xs font-mono bg-muted px-1.5 py-1 rounded truncate text-muted-foreground">
                {expression}
              </code>
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-muted-foreground">
              {lastRun && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                  {lastRun}
                </span>
              )}
              {dataSource && (
                <span className="flex items-center gap-0.5">
                  <Database className="h-3 w-3 text-cyan-500 dark:text-cyan-400" />
                  {dataSource}
                </span>
              )}
              {storedProcName && (
                <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                  {storedProcName}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => onRun?.(id)}
                  data-testid={`run-rule-${id}`}
                >
                  <Play className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
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
                  <Edit className="h-3 w-3 text-blue-500 dark:text-blue-400" />
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
                  <Trash2 className="h-3 w-3 text-red-500 dark:text-red-400" />
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
