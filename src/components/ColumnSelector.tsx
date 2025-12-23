import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Columns3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface ColumnSelectorProps {
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  disabled?: boolean;
}

// todo: remove mock functionality - replace with API call
const mockColumns: Record<string, Column[]> = {
  "dbo.Positions": [
    { name: "PositionID", type: "INT", nullable: false },
    { name: "AccountID", type: "VARCHAR(50)", nullable: false },
    { name: "InstrumentID", type: "VARCHAR(50)", nullable: false },
    { name: "Quantity", type: "DECIMAL(18,8)", nullable: false },
    { name: "MarketValue", type: "DECIMAL(18,2)", nullable: false },
    { name: "Rating", type: "VARCHAR(10)", nullable: true },
    { name: "MaturityDate", type: "DATE", nullable: true },
    { name: "CreatedAt", type: "DATETIME", nullable: false },
  ],
  "PORTFOLIO.POSITIONS": [
    { name: "POSITION_ID", type: "NUMBER", nullable: false },
    { name: "ACCOUNT_ID", type: "VARCHAR", nullable: false },
    { name: "INSTRUMENT_ID", type: "VARCHAR", nullable: false },
    { name: "QUANTITY", type: "NUMBER", nullable: false },
    { name: "MARKET_VALUE", type: "NUMBER", nullable: false },
    { name: "RATING", type: "VARCHAR", nullable: true },
    { name: "SECTOR", type: "VARCHAR", nullable: true },
    { name: "ISSUER", type: "VARCHAR", nullable: true },
    { name: "CURRENCY", type: "VARCHAR", nullable: false },
  ],
};

export default function ColumnSelector({
  selectedColumns,
  onColumnsChange,
  disabled = false,
}: ColumnSelectorProps) {
  const [search, setSearch] = useState("");
  
  // Use the first available columns set as default
  const columns = useMemo(() => {
    const allColumns = Object.values(mockColumns).flat();
    const uniqueColumns = Array.from(new Map(allColumns.map(c => [c.name, c])).values());
    
    if (!search) return uniqueColumns;
    return uniqueColumns.filter((col) =>
      col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleColumn = (columnName: string) => {
    if (selectedColumns.includes(columnName)) {
      onColumnsChange(selectedColumns.filter((c) => c !== columnName));
    } else {
      onColumnsChange([...selectedColumns, columnName]);
    }
  };

  return (
    <Card data-testid="column-selector">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Columns3 className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            Columns
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {selectedColumns.length} selected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="column-search">Search Columns</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-blue-400" />
            <Input
              id="column-search"
              placeholder="Filter columns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              disabled={disabled}
              data-testid="search-columns"
            />
          </div>
        </div>

        {columns.length > 0 ? (
          <ScrollArea className="border rounded-md p-3 h-[200px]">
            <div className="space-y-2">
              {columns.map((column) => (
                <div
                  key={column.name}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => !disabled && toggleColumn(column.name)}
                >
                  <Checkbox
                    checked={selectedColumns.includes(column.name)}
                    disabled={disabled}
                    data-testid={`column-${column.name}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-medium truncate">{column.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {column.type}
                      {column.nullable && " · Nullable"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 border border-dashed rounded-md text-center text-sm text-muted-foreground">
            No columns found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
