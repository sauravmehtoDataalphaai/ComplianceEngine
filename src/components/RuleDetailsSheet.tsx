import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import StatusBadge, { type StatusType } from "./StatusBadge";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

interface RuleDetails {
  id: string;
  name: string;
  description?: string;
  expression: string;
  category: string;
  severity: "hard" | "soft";
  status: StatusType;
  actualValue?: string;
  expectedValue?: string;
  lastRun: string;
  executionTime?: string;
  errorMessage?: string;
}

interface RuleDetailsSheetProps {
  rule: RuleDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RuleDetailsSheet({ rule, open, onOpenChange }: RuleDetailsSheetProps) {
  if (!rule) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg" data-testid="rule-details-sheet">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 flex-wrap">
            {rule.name}
            <StatusBadge status={rule.status} />
          </SheetTitle>
          <SheetDescription>{rule.description}</SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Expression
            </h4>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-sm font-mono break-all">{rule.expression}</code>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Category
              </h4>
              <Badge variant="outline">{rule.category}</Badge>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Severity
              </h4>
              <Badge variant={rule.severity === "hard" ? "destructive" : "secondary"}>
                {rule.severity === "hard" ? "Hard Breach" : "Soft Breach"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Execution Results
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Actual Value</span>
                <span className={`font-mono font-medium ${rule.status !== "passed" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {rule.actualValue || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Expected Value</span>
                <span className="font-mono">{rule.expectedValue || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last Run
                </span>
                <span className="text-sm">{rule.lastRun}</span>
              </div>
              {rule.executionTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Execution Time</span>
                  <span className="text-sm">{rule.executionTime}</span>
                </div>
              )}
            </div>
          </div>

          {rule.errorMessage && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  Error Details
                </h4>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-300">{rule.errorMessage}</p>
                </div>
              </div>
            </>
          )}

          {rule.status === "passed" && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Rule validation passed successfully</span>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export type { RuleDetails };
