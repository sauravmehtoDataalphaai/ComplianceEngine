import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FunctionParam {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

interface FunctionItemProps {
  name: string;
  description: string;
  syntax: string;
  params?: FunctionParam[];
  category: string;
  onInsert: (syntax: string) => void;
  isUserDefined?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FunctionItem({ 
  name, 
  description, 
  syntax, 
  params = [],
  category,
  onInsert,
  isUserDefined = false,
  onEdit,
  onDelete
}: FunctionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryColors: Record<string, string> = {
    "Exposure": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "Aggregation": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    "Risk": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "Position": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    "Trade": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div 
        className="border rounded-md bg-card hover-elevate" 
        data-testid={`function-item-${name.toLowerCase()}`}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between gap-2 p-3 cursor-pointer">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <code className="font-mono text-sm font-medium truncate">{name}()</code>
              <Badge variant="secondary" className={`text-xs shrink-0 ${categoryColors[category] || ""}`}>
                {category}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {isUserDefined && onEdit && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  title="Edit function"
                  data-testid={`edit-function-${name.toLowerCase()}`}
                  className="h-7 w-7"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              {isUserDefined && onDelete && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  title="Delete function"
                  data-testid={`delete-function-${name.toLowerCase()}`}
                  className="h-7 w-7"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onInsert(syntax);
                }}
                data-testid={`insert-function-${name.toLowerCase()}`}
                className="h-7 w-7"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 border-t">
            <p className="text-sm text-muted-foreground mt-3">{description}</p>
            <div className="mt-3 p-2 bg-muted rounded-md">
              <code className="text-xs font-mono">{syntax}</code>
            </div>
            {params.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Parameters</p>
                {params.map((param) => (
                  <div key={param.name} className="flex items-start gap-2 text-sm">
                    <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">{param.name}</code>
                    <span className="text-muted-foreground text-xs">({param.type})</span>
                    {param.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export type { FunctionParam };
