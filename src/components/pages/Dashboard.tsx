"use client";
import { useState } from "react";
import MetricCard from "@/components/MetricCard";
import ResultsTable, { type RuleResult } from "@/components/ResultsTable";
import RuleDetailsSheet, { type RuleDetails } from "@/components/RuleDetailsSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  RefreshCw,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

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
    description: "Monitor positions rated below BBB to ensure they don't exceed the maximum allowed concentration",
    expression: "SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15",
    category: "Risk",
    severity: "soft",
    status: "soft_breach",
    actualValue: "16.2%",
    expectedValue: "<=15%",
    lastRun: "2024-01-15 14:32:00",
    executionTime: "245ms",
    errorMessage: "Soft breach detected: Current sub-investment grade exposure (16.2%) exceeds limit (15%) by 1.2 percentage points."
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
    errorMessage: "CRITICAL: Fund VaR (2.1x benchmark) significantly exceeds the 1.5x limit. Immediate review required."
  },
};

export default function Dashboard() {
  const [selectedRule, setSelectedRule] = useState<RuleDetails | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleViewDetails = (id: string) => {
    const rule = mockRuleDetails[id];
    if (rule) {
      setSelectedRule(rule);
      setSheetOpen(true);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
    console.log("Refreshing results...");
  };

  const passedCount = mockResults.filter(r => r.status === "passed").length;
  const softBreachCount = mockResults.filter(r => r.status === "soft_breach").length;
  const hardBreachCount = mockResults.filter(r => r.status === "hard_breach").length;
  const passRate = ((passedCount / mockResults.length) * 100).toFixed(1);

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4" data-testid="dashboard-page">
      <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of compliance rule execution results
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <Button variant="outline" onClick={handleRefresh} data-testid="refresh-results" size="sm">
            <RefreshCw className={`h-3.5 w-3.5 text-blue-500 dark:text-blue-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Link href="/rules/new">
            <Button data-testid="create-rule-button" size="sm">
              <Plus className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span className="hidden sm:inline">Create Rule</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <MetricCard
          title="Total Rules"
          value={mockResults.length}
          subtitle="Active compliance checks"
          icon={FileText}
        />
        <MetricCard
          title="Pass Rate"
          value={`${passRate}%`}
          subtitle="Last execution"
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Soft Breaches"
          value={softBreachCount}
          subtitle="Requires review"
          icon={AlertTriangle}
          variant="warning"
        />
        <MetricCard
          title="Hard Breaches"
          value={hardBreachCount}
          subtitle="Critical failures"
          icon={XCircle}
          variant="danger"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
            <CardTitle>Recent Results</CardTitle>
            <Link href="/results">
              <Button variant="ghost" size="sm" data-testid="view-all-results">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ResultsTable results={mockResults} onViewDetails={handleViewDetails} />
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
