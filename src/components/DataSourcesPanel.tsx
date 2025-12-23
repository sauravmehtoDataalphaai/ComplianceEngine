import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Table, Columns } from "lucide-react";

interface DataSourcesPanelProps {
  onSelectColumn?: (column: string) => void;
}

const mockDataSources = [
  {
    name: "Snowflake",
    databases: [
      {
        name: "PORTFOLIO",
        tables: [
          {
            name: "POSITIONS",
            fields: [
              "position_id",
              "asset_type",
              "quantity",
              "market_value",
              "sector",
              "rating"
            ]
          },
          {
            name: "TRADES",
            fields: [
              "trade_id",
              "trade_date",
              "symbol",
              "quantity",
              "price",
              "status"
            ]
          }
        ]
      }
    ]
  },
  {
    name: "SQL Server",
    databases: [
      {
        name: "dbo",
        tables: [
          {
            name: "Positions",
            fields: [
              "PositionID",
              "AssetType",
              "Quantity",
              "MarketValue",
              "Rating",
              "Liquidity"
            ]
          },
          {
            name: "Holdings",
            fields: [
              "HoldingID",
              "PositionID",
              "Percentage",
              "DateAdded"
            ]
          }
        ]
      }
    ]
  }
];

export default function DataSourcesPanel({ onSelectColumn }: DataSourcesPanelProps) {
  return (
    <Card className="h-full flex flex-col" data-testid="datasources-panel">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Database className="h-4 w-4" />
          Data Sources
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="px-4 py-4 space-y-4">
            {mockDataSources.map((source) => (
              <div key={source.name}>
                <h3 className="text-xs font-semibold text-foreground mb-3">
                  {source.name}
                </h3>
                <div className="space-y-2 ml-2">
                  {source.databases.map((db) => (
                    <div key={db.name}>
                      <p className="text-xs text-muted-foreground font-medium mb-2">
                        {db.name}
                      </p>
                      <div className="space-y-1 ml-2">
                        {db.tables.map((table) => (
                          <div key={table.name}>
                            <div className="flex items-center gap-2 text-xs">
                              <Table className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium text-muted-foreground">
                                {table.name}
                              </span>
                            </div>
                            <div className="space-y-1 ml-4 mt-1">
                              {table.fields.map((field) => (
                                <div
                                  key={field}
                                  className="flex items-center gap-2 text-xs cursor-pointer hover:text-primary transition-colors group"
                                  onClick={() => onSelectColumn?.(field)}
                                  data-testid={`field-${field}`}
                                >
                                  <Columns className="h-2.5 w-2.5 text-muted-foreground group-hover:text-primary" />
                                  <span className="text-muted-foreground group-hover:text-primary">
                                    {field}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
