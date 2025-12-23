import { Button } from "@/components/ui/button";
import { LayoutList, LayoutGrid } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LayoutToggleProps {
  value: "list" | "grid";
  onChange: (value: "list" | "grid") => void;
}

export default function LayoutToggle({ value, onChange }: LayoutToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md" data-testid="layout-toggle">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={value === "list" ? "default" : "ghost"}
            onClick={() => onChange("list")}
            className="flex items-center gap-1"
            data-testid="toggle-list-view"
          >
            <LayoutList className="h-4 w-4" />
            <span className="text-xs font-medium">List</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>List View</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant={value === "grid" ? "default" : "ghost"}
            onClick={() => onChange("grid")}
            className="flex items-center gap-1"
            data-testid="toggle-grid-view"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="text-xs font-medium">Grid</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Grid View</TooltipContent>
      </Tooltip>
    </div>
  );
}
