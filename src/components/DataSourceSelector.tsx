import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DataSourceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  ruleType?: "tightly-coupled" | "loosely-coupled";
}

const dataSources = [
  { id: "snowflake", name: "Snowflake", icon: "❄️", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "sqlserver", name: "SQL Server", icon: "🔷", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
];

export default function DataSourceSelector({ value, onChange, ruleType }: DataSourceSelectorProps) {
  const selectedSource = dataSources.find(ds => ds.id === value);

  return (
    <Card data-testid="data-source-selector">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
            Data Source
          </CardTitle>
          {ruleType === "loosely-coupled" && (
            <Badge variant="outline" className="text-xs">Optional</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ruleType === "loosely-coupled" && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Data source is optional for loosely-coupled rules. Rules will be evaluated independently of any specific dataset.
            </p>
          </div>
        )}
        
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger data-testid="select-data-source">
            <SelectValue placeholder="Select a data source..." />
          </SelectTrigger>
          <SelectContent>
            {dataSources.map((source) => (
              <SelectItem key={source.id} value={source.id}>
                <span className="flex items-center gap-2">
                  <span>{source.icon}</span>
                  {source.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSource && (
          <div className="p-3 border rounded-md bg-muted/50">
            <p className="text-sm font-medium text-foreground mb-2">Selected Source</p>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${selectedSource.color}`}>
              <span className="text-lg">{selectedSource.icon}</span>
              <span className="text-sm font-medium">{selectedSource.name}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {selectedSource.id === "snowflake" && "Connected via Snowflake Native App. Tables and schemas will be auto-discovered."}
              {selectedSource.id === "sqlserver" && "Connected via SQL Server connection string. Tables and views will be auto-discovered."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
