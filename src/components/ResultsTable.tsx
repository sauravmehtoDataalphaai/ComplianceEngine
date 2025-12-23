import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge, { type StatusType } from "./StatusBadge";
import { Eye, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface RuleResult {
  id: string;
  ruleName: string;
  expression: string;
  status: StatusType;
  actualValue?: string;
  expectedValue?: string;
  lastRun: string;
  category: string;
}

interface ResultsTableProps {
  results: RuleResult[];
  onViewDetails?: (id: string) => void;
}

type SortKey = "ruleName" | "status" | "lastRun" | "category";
type SortDirection = "asc" | "desc";

export default function ResultsTable({ results, onViewDetails }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("lastRun");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const modifier = sortDirection === "asc" ? 1 : -1;
    return aVal < bVal ? -1 * modifier : aVal > bVal ? 1 * modifier : 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  return (
    <div className="border rounded-md" data-testid="results-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover-elevate"
              onClick={() => handleSort("ruleName")}
              data-testid="sort-rule-name"
            >
              <span className="flex items-center gap-1">
                Rule Name
                <SortIcon columnKey="ruleName" />
              </span>
            </TableHead>
            <TableHead className="max-w-[300px]">Expression</TableHead>
            <TableHead 
              className="cursor-pointer hover-elevate"
              onClick={() => handleSort("category")}
              data-testid="sort-category"
            >
              <span className="flex items-center gap-1">
                Category
                <SortIcon columnKey="category" />
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover-elevate"
              onClick={() => handleSort("status")}
              data-testid="sort-status"
            >
              <span className="flex items-center gap-1">
                Status
                <SortIcon columnKey="status" />
              </span>
            </TableHead>
            <TableHead>Actual Value</TableHead>
            <TableHead>Expected Value</TableHead>
            <TableHead 
              className="cursor-pointer hover-elevate"
              onClick={() => handleSort("lastRun")}
              data-testid="sort-last-run"
            >
              <span className="flex items-center gap-1">
                Last Run
                <SortIcon columnKey="lastRun" />
              </span>
            </TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedResults.map((result, idx) => (
            <TableRow 
              key={result.id} 
              className={idx % 2 === 0 ? "bg-muted/30" : ""}
              data-testid={`result-row-${result.id}`}
            >
              <TableCell className="font-medium">{result.ruleName}</TableCell>
              <TableCell className="max-w-[300px]">
                <code className="text-xs font-mono truncate block">{result.expression}</code>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{result.category}</TableCell>
              <TableCell>
                <StatusBadge status={result.status} />
              </TableCell>
              <TableCell className="text-sm">
                {result.actualValue ? (
                  <span className={result.status !== "passed" ? "text-red-600 dark:text-red-400 font-medium" : ""}>
                    {result.actualValue}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {result.expectedValue ? result.expectedValue : "-"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{result.lastRun}</TableCell>
              <TableCell>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onViewDetails?.(result.id)}
                  data-testid={`view-details-${result.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {sortedResults.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No results to display
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export type { RuleResult };
