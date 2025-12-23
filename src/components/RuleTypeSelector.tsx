import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, Unlink, AlertCircle } from "lucide-react";

interface RuleTypeSelectorProps {
  value: "tightly-coupled" | "loosely-coupled";
  onChange: (value: "tightly-coupled" | "loosely-coupled") => void;
}

export default function RuleTypeSelector({ value, onChange }: RuleTypeSelectorProps) {
  return (
    <Card data-testid="rule-type-selector">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Rule Type</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how your rule relates to data sources
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant={value === "tightly-coupled" ? "default" : "outline"}
            onClick={() => onChange("tightly-coupled")}
            className="h-auto py-2.5 px-3 flex flex-col items-start gap-2 w-full min-w-0"
            data-testid="type-tightly-coupled"
          >
            <div className="flex items-center gap-2 w-full min-w-0">
              <Link className="h-4 w-4 shrink-0 flex-shrink-0" />
              <span className="font-semibold min-w-0 flex-1 break-words">Tightly Coupled</span>
              <Badge variant="secondary" className="text-xs shrink-0 whitespace-nowrap ml-auto">Bound to Data</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-tight w-full break-words">
              Rule logic depends on specific data sources.
            </p>
          </Button>

          <Button
            variant={value === "loosely-coupled" ? "default" : "outline"}
            onClick={() => onChange("loosely-coupled")}
            className="h-auto py-2.5 px-3 flex flex-col items-start gap-2 w-full min-w-0"
            data-testid="type-loosely-coupled"
          >
            <div className="flex items-center gap-2 w-full min-w-0">
              <Unlink className="h-4 w-4 shrink-0 flex-shrink-0" />
              <span className="font-semibold min-w-0 flex-1 break-words">Loosely Coupled</span>
              <Badge variant="secondary" className="text-xs shrink-0 whitespace-nowrap ml-auto">Independent</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-tight w-full break-words">
              Pure rule logic independent of any specific data source.
            </p>
          </Button>
        </div>

        {value === "loosely-coupled" && (
          <div className="flex items-start gap-1.5 p-2 sm:p-2.5 mt-2 sm:mt-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <AlertCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 flex-shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-300 break-words min-w-0 flex-1 leading-relaxed">
              Loosely-coupled rules are evaluated based on expression logic alone. Data source selection is optional.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
