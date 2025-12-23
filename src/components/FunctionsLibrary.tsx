import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Parentheses, Plus, ChevronDown, ChevronRight } from "lucide-react";
import FunctionItem, { type FunctionParam } from "./FunctionItem";

interface FunctionDef {
  name: string;
  description: string;
  syntax: string;
  params: FunctionParam[];
  category: string;
}

interface FunctionsLibraryProps {
  onInsertFunction: (syntax: string) => void;
}

// todo: remove mock functionality - replace with API data
const functions: FunctionDef[] = [
  {
    name: "SUM",
    description: "Sum all values in a set or column",
    syntax: "SUM(values)",
    params: [
      { name: "values", type: "expression", required: true },
    ],
    category: "Math"
  },
  {
    name: "AVERAGE",
    description: "Calculate the average of a set of values",
    syntax: "AVERAGE(values)",
    params: [
      { name: "values", type: "expression", required: true },
    ],
    category: "Math"
  },
  {
    name: "COUNT",
    description: "Count the number of items in a set",
    syntax: "COUNT(items)",
    params: [
      { name: "items", type: "expression", required: true },
    ],
    category: "Math"
  },
  {
    name: "MAX",
    description: "Find the maximum value in a set",
    syntax: "MAX(values)",
    params: [
      { name: "values", type: "expression", required: true },
    ],
    category: "Math"
  },
  {
    name: "MIN",
    description: "Find the minimum value in a set",
    syntax: "MIN(values)",
    params: [
      { name: "values", type: "expression", required: true },
    ],
    category: "Math"
  },
  {
    name: "ROUND",
    description: "Round a number to specified decimal places",
    syntax: "ROUND(value, decimals)",
    params: [
      { name: "value", type: "number", required: true },
      { name: "decimals", type: "number", required: false },
    ],
    category: "Math"
  },
  {
    name: "ABS",
    description: "Return the absolute value",
    syntax: "ABS(value)",
    params: [
      { name: "value", type: "number", required: true },
    ],
    category: "Math"
  },
  {
    name: "EXPOSURE",
    description: "Calculate exposure for a specific sector, issuer, or category",
    syntax: "EXPOSURE(sector='Tech')",
    params: [
      { name: "sector", type: "string", required: false },
      { name: "issuer", type: "string", required: false },
      { name: "country", type: "string", required: false },
    ],
    category: "Exposure"
  },
  {
    name: "NAV",
    description: "Returns the Net Asset Value of the portfolio",
    syntax: "NAV()",
    params: [],
    category: "Position"
  },
  {
    name: "POSITION_MV",
    description: "Returns market value of positions",
    syntax: "POSITION_MV(filter=rating<'BBB')",
    params: [
      { name: "filter", type: "condition", required: false },
    ],
    category: "Position"
  },
  {
    name: "TRADES",
    description: "Access trade data within a time window",
    syntax: "TRADES(window='1D', filter=duplicate=true)",
    params: [
      { name: "window", type: "string", required: false },
      { name: "filter", type: "condition", required: false },
    ],
    category: "Trade"
  },
  {
    name: "VaR",
    description: "Calculate Value at Risk for Fund or Benchmark",
    syntax: "VaR(entity='Fund')",
    params: [
      { name: "entity", type: "string", required: true },
      { name: "confidence", type: "number", required: false },
    ],
    category: "Risk"
  },
  {
    name: "ExposureByIssuer",
    description: "Get exposure for a specific issuer",
    syntax: "ExposureByIssuer['Tesla']",
    params: [
      { name: "issuer", type: "string", required: true },
    ],
    category: "Exposure"
  },
  {
    name: "UnderlyingFundExposure",
    description: "Calculate exposure to underlying fund by region",
    syntax: "UnderlyingFundExposure['Asia']",
    params: [
      { name: "region", type: "string", required: true },
    ],
    category: "Exposure"
  },
  {
    name: "IlliquidAssets",
    description: "Total value of illiquid assets",
    syntax: "IlliquidAssets",
    params: [],
    category: "Position"
  },
  {
    name: "ERISACountAssets",
    description: "Assets counted under ERISA regulations",
    syntax: "ERISACountAssets",
    params: [],
    category: "Position"
  },
  {
    name: "PlanAssets",
    description: "Total plan assets for ERISA calculations",
    syntax: "PlanAssets",
    params: [],
    category: "Position"
  },
];

export default function FunctionsLibrary({ onInsertFunction }: FunctionsLibraryProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [userFunctions, setUserFunctions] = useState<FunctionDef[]>([
    {
      name: "CUSTOM_VALIDATION",
      description: "User-defined validation function",
      syntax: "CUSTOM_VALIDATION(param)",
      params: [{ name: "param", type: "expression", required: true }],
      category: "User Defined"
    }
  ]);

  const filteredFunctions = functions.filter(
    (fn) =>
      fn.name.toLowerCase().includes(search.toLowerCase()) ||
      fn.description.toLowerCase().includes(search.toLowerCase()) ||
      fn.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUserFunctions = userFunctions.filter(
    (fn) =>
      fn.name.toLowerCase().includes(search.toLowerCase()) ||
      fn.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedFunctions = filteredFunctions.reduce((acc, fn) => {
    if (!acc[fn.category]) acc[fn.category] = [];
    acc[fn.category].push(fn);
    return acc;
  }, {} as Record<string, FunctionDef[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAddUserFunction = () => {
    const name = prompt("Enter function name (e.g., MY_FUNCTION):");
    if (name) {
      const newFunc: FunctionDef = {
        name: name.toUpperCase(),
        description: prompt("Enter function description:") || "User-defined function",
        syntax: `${name.toUpperCase()}(value)`,
        params: [{ name: "value", type: "expression", required: true }],
        category: "User Defined"
      };
      setUserFunctions([...userFunctions, newFunc]);
      toggleCategory("User Defined");
    }
  };

  const handleEditUserFunction = (oldName: string) => {
    const newName = prompt("Enter new function name:", oldName);
    if (newName && newName !== oldName) {
      const newDescription = prompt("Enter function description:", userFunctions.find(f => f.name === oldName)?.description || "");
      const newSyntax = prompt("Enter function syntax:", userFunctions.find(f => f.name === oldName)?.syntax || "");
      
      setUserFunctions(userFunctions.map(fn => 
        fn.name === oldName 
          ? {
              ...fn,
              name: newName.toUpperCase(),
              description: newDescription || fn.description,
              syntax: newSyntax || fn.syntax
            }
          : fn
      ));
    }
  };

  const handleDeleteUserFunction = (name: string) => {
    if (confirm(`Delete function "${name}"?`)) {
      setUserFunctions(userFunctions.filter(fn => fn.name !== name));
    }
  };

  return (
    <Card className="h-full flex flex-col" data-testid="functions-library">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Parentheses className="h-4 w-4" />
            <span className="truncate">Functions</span>
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddUserFunction}
            className="h-7 px-2"
            title="Create user-defined function"
            data-testid="add-user-function"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
          <Input
            placeholder="Search functions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="search-functions"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 pb-6">
          {Object.entries(groupedFunctions).map(([category, fns]) => (
            <Collapsible 
              key={category} 
              open={expandedCategories[category] || false} 
              onOpenChange={() => toggleCategory(category)}
              className="mb-3"
            >
              <CollapsibleTrigger asChild>
                <button type="button" className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-muted rounded-md transition-colors">
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
                    {category}
                  </h4>
                  <span className="text-xs text-muted-foreground">{fns.length}</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pl-2 mt-1">
                {fns.map((fn) => (
                  <FunctionItem
                    key={fn.name}
                    name={fn.name}
                    description={fn.description}
                    syntax={fn.syntax}
                    params={fn.params}
                    category={fn.category}
                    onInsert={onInsertFunction}
                    isUserDefined={false}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {filteredUserFunctions.length > 0 && (
            <Collapsible 
              open={expandedCategories["User Defined"] || false} 
              onOpenChange={() => toggleCategory("User Defined")}
              className="mb-3"
            >
              <CollapsibleTrigger asChild>
                <button type="button" className="flex items-center gap-2 w-full text-left py-2 px-2 hover:bg-muted rounded-md transition-colors">
                  {expandedCategories["User Defined"] ? (
                    <ChevronDown className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-amber-500 dark:text-amber-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
                    User Defined
                  </h4>
                  <span className="text-xs text-muted-foreground">{filteredUserFunctions.length}</span>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pl-2 mt-1">
                {filteredUserFunctions.map((fn) => (
                  <FunctionItem
                    key={fn.name}
                    name={fn.name}
                    description={fn.description}
                    syntax={fn.syntax}
                    params={fn.params}
                    category={fn.category}
                    onInsert={onInsertFunction}
                    isUserDefined={true}
                    onEdit={() => handleEditUserFunction(fn.name)}
                    onDelete={() => handleDeleteUserFunction(fn.name)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {filteredFunctions.length === 0 && filteredUserFunctions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No functions found matching "{search}"
            </p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
