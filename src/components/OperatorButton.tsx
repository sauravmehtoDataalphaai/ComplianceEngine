import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface OperatorButtonProps {
  symbol: string;
  label: string;
  description?: string;
  onClick: (symbol: string) => void;
  variant?: "arithmetic" | "relational" | "logical";
}

const variantStyles = {
  arithmetic: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  relational: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  logical: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
};

export default function OperatorButton({ 
  symbol, 
  label, 
  description,
  onClick, 
  variant = "arithmetic" 
}: OperatorButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`font-mono min-w-[42px] ${variantStyles[variant]}`}
          onClick={() => onClick(symbol)}
          data-testid={`operator-btn-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {symbol}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </TooltipContent>
    </Tooltip>
  );
}
