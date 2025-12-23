"use client";
import { useState, useEffect } from "react";
import RuleCard from "@/components/RuleCard";
import RuleCardCompact from "@/components/RuleCardCompact";
import LayoutToggle from "@/components/LayoutToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { StatusType } from "@/components/StatusBadge";
import { getAllRules, deleteRule as deleteRuleFromStorage } from "@/lib/rulesStorage";

interface Rule {
  id: string;
  name: string;
  description: string;
  expression: string;
  category: string;
  severity: "hard" | "soft";
  status?: StatusType;
  lastRun?: string;
  dataSource?: string;
  storedProcName?: string;
}

// Default mock rules for initial display
const defaultMockRules: Rule[] = [
  {
    id: "rule-1",
    name: "Tech Sector Exposure Limit",
    description: "Ensure technology sector exposure does not exceed 10% of NAV",
    expression: "EXPOSURE(sector='Tech') / NAV() <= 0.10",
    category: "Exposure",
    severity: "hard",
    status: "passed",
    lastRun: "2024-01-15 14:32:00",
    dataSource: "snowflake",
    storedProcName: "sp_validate_tech_exposure"
  },
  {
    id: "rule-2",
    name: "Sub-Investment Grade Concentration",
    description: "Monitor positions rated below BBB",
    expression: "SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15",
    category: "Risk",
    severity: "soft",
    status: "soft_breach",
    lastRun: "2024-01-15 14:32:00",
    dataSource: "sqlserver",
    storedProcName: "sp_check_grade_concentration"
  },
];

const categories = ["All", "Exposure", "Risk", "Trade", "Position", "Compliance"];

export default function Rules() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [rules, setRules] = useState<Rule[]>([]);
  const pathname = usePathname();
  const { toast } = useToast();

  // Load rules from localStorage on mount
  useEffect(() => {
    const loadRules = () => {
      const storedRules = getAllRules();
      
      // Convert stored rules to display format
      const displayRules: Rule[] = storedRules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description || "",
        expression: rule.expression,
        category: rule.category,
        severity: rule.severity,
        status: (rule.status === "active" ? "passed" : rule.status === "inactive" ? "pending" : "passed") as StatusType,
        lastRun: rule.lastRun || rule.updatedAt,
        dataSource: rule.dataSource,
      }));
      
      // Merge with default mock rules if localStorage is empty
      if (displayRules.length === 0) {
        setRules(defaultMockRules);
      } else {
        setRules(displayRules);
      }
    };
    
    loadRules();
    
    // Listen for storage changes (when rules are saved in another tab)
    const handleStorageChange = () => {
      loadRules();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Also reload when page becomes visible (user might have saved in another tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadRules();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.expression.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || rule.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: string) => {
    window.location.href = `/rules/${id}/edit`;
  };

  const handleDelete = (id: string) => {
    const success = deleteRuleFromStorage(id);
    if (success) {
      // Remove from local state
      setRules((prevRules) => prevRules.filter((r) => r.id !== id));
      toast({
        title: "Rule Deleted",
        description: "Rule has been removed successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete rule.",
        variant: "destructive",
      });
    }
  };

  const handleRun = (id: string) => {
    toast({
      title: "Rule Executed",
      description: `Rule ${id} has been executed successfully.`,
    });
    console.log(`Run rule: ${id}`);
  };

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4" data-testid="rules-page">
      <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">Compliance Rules</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage and configure your data quality validation rules
          </p>
        </div>
        <Link href="/rules/new">
          <Button data-testid="create-rule-button" size="sm">
            <Plus className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden sm:inline">Create Rule</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap flex-1">
          <div className="relative min-w-[180px] sm:min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            <Input
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              data-testid="search-rules"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[100px] sm:w-[120px]" data-testid="filter-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <LayoutToggle value={layout} onChange={setLayout} />
      </div>

      {layout === "list" ? (
        <div className="space-y-1.5 sm:space-y-2">
          {filteredRules.map((rule) => (
            <RuleCardCompact
              key={rule.id}
              id={rule.id}
              name={rule.name}
              description={rule.description}
              expression={rule.expression}
              category={rule.category}
              severity={rule.severity}
              status={rule.status}
              lastRun={rule.lastRun}
              dataSource={rule.dataSource}
              storedProcName={rule.storedProcName}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRun={handleRun}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {filteredRules.map((rule) => (
            <RuleCard
              key={rule.id}
              id={rule.id}
              name={rule.name}
              description={rule.description}
              expression={rule.expression}
              category={rule.category}
              severity={rule.severity}
              status={rule.status}
              lastRun={rule.lastRun}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRun={handleRun}
            />
          ))}
        </div>
      )}

      {filteredRules.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No rules found matching your criteria.</p>
          <Link href="/rules/new">
            <Button variant="ghost" className="mt-2">Create your first rule</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
