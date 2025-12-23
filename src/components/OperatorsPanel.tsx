import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OperatorButton from "./OperatorButton";
import { Calculator, GitCompare, LogIn, GitBranch } from "lucide-react";

interface Operator {
  symbol: string;
  label: string;
  description?: string;
}

interface OperatorsPanelProps {
  onInsertOperator: (symbol: string) => void;
}

const arithmeticOperators: Operator[] = [
  { symbol: "+", label: "Add", description: "Addition" },
  { symbol: "-", label: "Subtract", description: "Subtraction" },
  { symbol: "*", label: "Multiply", description: "Multiplication" },
  { symbol: "/", label: "Divide", description: "Division" },
  { symbol: "%", label: "Modulo", description: "Remainder" },
  { symbol: "(", label: "Open Paren", description: "Group expression" },
  { symbol: ")", label: "Close Paren", description: "End group" },
];

const relationalOperators: Operator[] = [
  { symbol: "<", label: "Less than", description: "Left is smaller" },
  { symbol: "<=", label: "Less or equal", description: "Left is smaller or equal" },
  { symbol: ">", label: "Greater than", description: "Left is larger" },
  { symbol: ">=", label: "Greater or equal", description: "Left is larger or equal" },
  { symbol: "==", label: "Equals", description: "Values are equal" },
  { symbol: "!=", label: "Not equals", description: "Values are different" },
];

const logicalOperators: Operator[] = [
  { symbol: "AND", label: "AND", description: "Both conditions must be true" },
  { symbol: "OR", label: "OR", description: "At least one condition must be true" },
  { symbol: "NOT", label: "NOT", description: "Inverts the condition" },
];

const conditionalOperators: Operator[] = [
  { symbol: "IF(", label: "IF", description: "If condition then value" },
  { symbol: "ELSE ", label: "ELSE", description: "Alternative value if condition false" },
  { symbol: "END", label: "END", description: "End IF/ELSE block" },
  { symbol: "CASE ", label: "CASE", description: "Start case statement" },
  { symbol: "WHEN ", label: "WHEN", description: "Case condition" },
  { symbol: "THEN ", label: "THEN", description: "Case result" },
];

export default function OperatorsPanel({ onInsertOperator }: OperatorsPanelProps) {
  return (
    <Card data-testid="operators-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Operators</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="arithmetic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="arithmetic" className="gap-1 text-xs" data-testid="tab-arithmetic">
              <Calculator className="h-3 w-3" />
              <span className="hidden sm:inline">Math</span>
            </TabsTrigger>
            <TabsTrigger value="relational" className="gap-1 text-xs" data-testid="tab-relational">
              <GitCompare className="h-3 w-3" />
              <span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="logical" className="gap-1 text-xs" data-testid="tab-logical">
              <LogIn className="h-3 w-3" />
              <span className="hidden sm:inline">Logic</span>
            </TabsTrigger>
            <TabsTrigger value="conditional" className="gap-1 text-xs" data-testid="tab-conditional">
              <GitBranch className="h-3 w-3" />
              <span className="hidden sm:inline">If/Case</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="arithmetic" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {arithmeticOperators.map((op) => (
                <OperatorButton
                  key={op.symbol}
                  symbol={op.symbol}
                  label={op.label}
                  description={op.description}
                  onClick={onInsertOperator}
                  variant="arithmetic"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="relational" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {relationalOperators.map((op) => (
                <OperatorButton
                  key={op.symbol}
                  symbol={op.symbol}
                  label={op.label}
                  description={op.description}
                  onClick={onInsertOperator}
                  variant="relational"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="logical" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {logicalOperators.map((op) => (
                <OperatorButton
                  key={op.symbol}
                  symbol={op.symbol}
                  label={op.label}
                  description={op.description}
                  onClick={onInsertOperator}
                  variant="logical"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conditional" className="mt-0">
            <div className="flex flex-wrap gap-2">
              {conditionalOperators.map((op) => (
                <OperatorButton
                  key={op.symbol}
                  symbol={op.symbol}
                  label={op.label}
                  description={op.description}
                  onClick={onInsertOperator}
                  variant="logical"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
