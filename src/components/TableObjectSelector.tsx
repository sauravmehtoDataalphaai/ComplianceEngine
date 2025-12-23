import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Table, Eye, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DbObject {
  id: string;
  name: string;
  type: "table" | "view";
  schema: string;
  rowCount?: number;
}

interface TableObjectSelectorProps {
  dataSource: string;
  selectedObject?: string;
  onSelectObject: (objectId: string) => void;
  disabled?: boolean;
}

// todo: remove mock functionality - replace with API call
const mockObjects: Record<string, DbObject[]> = {
  snowflake: [
    { id: "sf_positions", name: "POSITIONS", type: "table", schema: "PORTFOLIO", rowCount: 1250000 },
    { id: "sf_trades", name: "TRADES", type: "table", schema: "PORTFOLIO", rowCount: 5800000 },
    { id: "sf_exposure", name: "EXPOSURES", type: "table", schema: "PORTFOLIO", rowCount: 2100000 },
    { id: "sf_nav", name: "FUND_NAV", type: "table", schema: "VALUATION", rowCount: 890 },
    { id: "sf_exposure_view", name: "V_SECTOR_EXPOSURE", type: "view", schema: "ANALYTICS", rowCount: undefined },
    { id: "sf_risk_view", name: "V_RISK_METRICS", type: "view", schema: "ANALYTICS", rowCount: undefined },
  ],
  sqlserver: [
    { id: "ss_positions", name: "Positions", type: "table", schema: "dbo", rowCount: 980000 },
    { id: "ss_trades", name: "Trades", type: "table", schema: "dbo", rowCount: 4200000 },
    { id: "ss_assets", name: "Assets", type: "table", schema: "dbo", rowCount: 650000 },
    { id: "ss_valuation", name: "ValuationData", type: "table", schema: "dbo", rowCount: 750 },
    { id: "ss_exposure_view", name: "ExposureByIssuer", type: "view", schema: "Analytics", rowCount: undefined },
    { id: "ss_liquidity_view", name: "LiquidityAnalysis", type: "view", schema: "Analytics", rowCount: undefined },
  ],
};

export default function TableObjectSelector({
  dataSource,
  selectedObject,
  onSelectObject,
  disabled = false,
}: TableObjectSelectorProps) {
  const [search, setSearch] = useState("");

  const objects = useMemo(() => {
    const sourceObjects = mockObjects[dataSource] || [];
    if (!search) return sourceObjects;
    return sourceObjects.filter((obj) =>
      obj.name.toLowerCase().includes(search.toLowerCase()) ||
      obj.schema.toLowerCase().includes(search.toLowerCase())
    );
  }, [dataSource, search]);

  const selected = objects.find((obj) => obj.id === selectedObject);

  return (
    <Card data-testid="table-object-selector">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Database className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          Table/View/Object
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="object-search">Search Objects</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            <Input
              id="object-search"
              placeholder="Search tables, views..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              disabled={disabled || !dataSource}
              data-testid="search-objects"
            />
          </div>
        </div>

        {dataSource ? (
          <Select value={selectedObject || ""} onValueChange={onSelectObject} disabled={disabled}>
            <SelectTrigger data-testid="select-object">
              <SelectValue placeholder="Select a table or view..." />
            </SelectTrigger>
            <SelectContent className="max-w-sm">
              {objects.length > 0 ? (
                objects.map((obj) => (
                  <SelectItem key={obj.id} value={obj.id}>
                    <span className="flex items-center gap-2">
                      {obj.type === "table" ? (
                        <Table className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      ) : (
                        <Eye className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                      )}
                      <span className="font-mono text-sm">{obj.schema}.</span>
                      <span className="font-medium">{obj.name}</span>
                    </span>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">No objects found</div>
              )}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-3 border border-dashed rounded-md text-center text-sm text-muted-foreground">
            Select a data source first
          </div>
        )}

        {selected && (
          <div className="p-3 border rounded-md bg-muted/50 space-y-2">
            <p className="text-sm font-medium text-foreground">Selected Object</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {selected.type === "table" ? "Table" : "View"}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {selected.schema}.{selected.name}
              </Badge>
            </div>
            {selected.rowCount && (
              <p className="text-xs text-muted-foreground">
                Rows: {selected.rowCount.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { DbObject };
