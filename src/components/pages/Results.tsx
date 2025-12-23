"use client";
import { useState } from "react";
import ResultsTable, { type RuleResult } from "@/components/ResultsTable";
import RuleDetailsSheet, { type RuleDetails } from "@/components/RuleDetailsSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Search, Filter, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockResults: RuleResult[] = [
  {
    id: "1",
    ruleName: "Tech Sector Exposure Limit",
    expression: "EXPOSURE(sector='Tech') / NAV() <= 0.10",
    status: "passed",
    actualValue: "8.5%",
    expectedValue: "<=10%",
    lastRun: "2024-01-15 14:32",
    category: "Exposure"
  },
  {
    id: "2",
    ruleName: "Sub-Investment Grade Limit",
    expression: "SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15",
    status: "soft_breach",
    actualValue: "16.2%",
    expectedValue: "<=15%",
    lastRun: "2024-01-15 14:32",
    category: "Risk"
  },
  {
    id: "3",
    ruleName: "VaR Benchmark Limit",
    expression: "VaR(Fund) <= VaR(Benchmark) * 1.5",
    status: "hard_breach",
    actualValue: "2.1x",
    expectedValue: "<=1.5x",
    lastRun: "2024-01-15 14:32",
    category: "Risk"
  },
  {
    id: "4",
    ruleName: "Issuer Concentration - Tesla",
    expression: "ExposureByIssuer['Tesla'] <= 0.05 * NAV",
    status: "passed",
    actualValue: "3.2%",
    expectedValue: "<=5%",
    lastRun: "2024-01-15 14:32",
    category: "Exposure"
  },
  {
    id: "5",
    ruleName: "Illiquid Assets Limit",
    expression: "IlliquidAssets <= 0.15 * NAV",
    status: "passed",
    actualValue: "12.1%",
    expectedValue: "<=15%",
    lastRun: "2024-01-15 14:32",
    category: "Position"
  },
  {
    id: "6",
    ruleName: "Duplicate Trade Detection",
    expression: "COUNT(TRADES(window='1D', filter=duplicate=true)) == 0",
    status: "pending",
    lastRun: "2024-01-15 14:32",
    category: "Trade"
  },
  {
    id: "7",
    ruleName: "Asia Fund Exposure",
    expression: "UnderlyingFundExposure['Asia'] <= 0.20",
    status: "passed",
    actualValue: "18.5%",
    expectedValue: "<=20%",
    lastRun: "2024-01-15 14:32",
    category: "Exposure"
  },
  {
    id: "8",
    ruleName: "ERISA Compliance",
    expression: "ERISACountAssets <= 0.05 * PlanAssets",
    status: "passed",
    actualValue: "4.2%",
    expectedValue: "<=5%",
    lastRun: "2024-01-15 14:32",
    category: "Compliance"
  },
];

const mockRuleDetails: Record<string, RuleDetails> = {
  "1": {
    id: "1",
    name: "Tech Sector Exposure Limit",
    description: "Ensure technology sector exposure does not exceed 10% of NAV",
    expression: "EXPOSURE(sector='Tech') / NAV() <= 0.10",
    category: "Exposure",
    severity: "hard",
    status: "passed",
    actualValue: "8.5%",
    expectedValue: "<=10%",
    lastRun: "2024-01-15 14:32:00",
    executionTime: "124ms",
  },
  "2": {
    id: "2",
    name: "Sub-Investment Grade Limit",
    description: "Monitor positions rated below BBB",
    expression: "SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15",
    category: "Risk",
    severity: "soft",
    status: "soft_breach",
    actualValue: "16.2%",
    expectedValue: "<=15%",
    lastRun: "2024-01-15 14:32:00",
    executionTime: "245ms",
    errorMessage: "Soft breach: Current exposure (16.2%) exceeds limit (15%) by 1.2 percentage points."
  },
  "3": {
    id: "3",
    name: "VaR Benchmark Limit",
    description: "Fund VaR must not exceed 1.5x benchmark VaR",
    expression: "VaR(Fund) <= VaR(Benchmark) * 1.5",
    category: "Risk",
    severity: "hard",
    status: "hard_breach",
    actualValue: "2.1x",
    expectedValue: "<=1.5x",
    lastRun: "2024-01-15 14:32:00",
    executionTime: "512ms",
    errorMessage: "CRITICAL: Fund VaR (2.1x benchmark) significantly exceeds the 1.5x limit."
  },
};

const statusOptions = ["All", "passed", "soft_breach", "hard_breach", "pending"];

export default function Results() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRule, setSelectedRule] = useState<RuleDetails | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.ruleName.toLowerCase().includes(search.toLowerCase()) ||
      result.expression.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || result.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    const rule = mockRuleDetails[id];
    if (rule) {
      setSelectedRule(rule);
      setSheetOpen(true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Results Refreshed",
        description: "All rule results have been updated.",
      });
    }, 1000);
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Results are being exported to CSV.",
    });
    console.log("Export results");
  };

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4" data-testid="results-page">
      <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Execution Results</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View and analyze compliance rule execution results
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExport} data-testid="export-results" size="sm">
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" onClick={handleRefresh} data-testid="refresh-results" size="sm">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
            <CardTitle>All Results</CardTitle>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="relative min-w-[180px] sm:min-w-[200px] flex-1 sm:flex-initial">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search results..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  data-testid="search-results"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px] sm:w-[140px]" data-testid="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "All" ? "All Statuses" : status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResultsTable results={filteredResults} onViewDetails={handleViewDetails} />
        </CardContent>
      </Card>

      <RuleDetailsSheet 
        rule={selectedRule} 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </div>
  );
}
