import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ExpressionEditor, { type ExpressionEditorRef } from "./ExpressionEditor";
import OperatorsPanel from "./OperatorsPanel";
import FunctionsLibrary from "./FunctionsLibrary";
import RuleTypeSelector from "./RuleTypeSelector";
import DataSourceSelector from "./DataSourceSelector";
import TableObjectSelector from "./TableObjectSelector";
import ColumnSelector from "./ColumnSelector";
import { Save, PlayCircle, ArrowLeft, CheckCircle2, Circle, AlertCircle, Info } from "lucide-react";

interface RuleFormData {
  name: string;
  description: string;
  category: string;
  severity: "hard" | "soft";
  expression: string;
  ruleType?: "tightly-coupled" | "loosely-coupled";
  dataSource?: string;
  tableObject?: string;
  selectedColumns?: string[];
}

interface RuleBuilderFormProps {
  initialData?: Partial<RuleFormData>;
  onSave?: (data: RuleFormData) => void;
  onCancel?: () => void;
  onTest?: (expression: string) => void;
  isSaving?: boolean;
  isTesting?: boolean;
}

const categories = ["Exposure", "Risk", "Trade", "Position", "Aggregation", "Compliance"];

export default function RuleBuilderForm({
  initialData,
  onSave,
  onCancel,
  onTest,
  isSaving = false,
  isTesting = false,
}: RuleBuilderFormProps) {
  const [formData, setFormData] = useState<RuleFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "Exposure",
    severity: initialData?.severity || "soft",
    expression: initialData?.expression || "",
    ruleType: initialData?.ruleType || "tightly-coupled",
    dataSource: initialData?.dataSource || "",
    tableObject: initialData?.tableObject || "",
    selectedColumns: initialData?.selectedColumns || [],
  });

  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"config" | "rule">("config");
  const editorRef = useRef<ExpressionEditorRef>(null);

  // Calculate completion status for tightly-coupled rules
  const getCompletionStatus = () => {
    if (formData.ruleType === "loosely-coupled") {
      return {
        name: !!formData.name.trim(),
        expression: !!formData.expression.trim() && isValid !== false,
        complete: !!formData.name.trim() && !!formData.expression.trim() && isValid === true,
      };
    }
    return {
      dataSource: !!formData.dataSource,
      tableObject: !!formData.tableObject,
      name: !!formData.name.trim(),
      expression: !!formData.expression.trim() && isValid !== false,
      complete: !!formData.dataSource && !!formData.tableObject && !!formData.name.trim() && !!formData.expression.trim() && isValid === true,
    };
  };

  const completionStatus = getCompletionStatus();

  const handleInsertOperator = (symbol: string) => {
    editorRef.current?.insertAtCursor(` ${symbol} `);
  };

  const handleInsertFunction = (syntax: string) => {
    editorRef.current?.insertAtCursor(syntax);
  };

  const handleValidate = () => {
    const expr = formData.expression.trim();
    if (!expr) {
      setIsValid(false);
      setValidationError("Expression cannot be empty");
      return;
    }

    const openParens = (expr.match(/\(/g) || []).length;
    const closeParens = (expr.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      setIsValid(false);
      setValidationError(`Mismatched parentheses: ${openParens} opening, ${closeParens} closing`);
      return;
    }

    setIsValid(true);
    setValidationError(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate expression
    const expr = formData.expression.trim();
    let isValidExpr = true;
    let error: string | undefined = undefined;
    
    if (!expr) {
      isValidExpr = false;
      error = "Expression cannot be empty";
    } else {
      const openParens = (expr.match(/\(/g) || []).length;
      const closeParens = (expr.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        isValidExpr = false;
        error = `Mismatched parentheses: ${openParens} opening, ${closeParens} closing`;
      }
    }
    
    setIsValid(isValidExpr);
    setValidationError(error);
    
    // Only save if form is valid
    if (isValidExpr && formData.name.trim()) {
      onSave?.(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col" data-testid="rule-builder-form">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pb-2 sm:pb-3 mb-3 sm:mb-4 -mx-3 sm:-mx-4 px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={onCancel} 
                data-testid="back-button"
                className="shrink-0 h-7 w-7"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              </Button>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                {initialData?.name ? "Edit Rule" : "Create New Rule"}
              </h2>
              {formData.ruleType && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formData.ruleType === "tightly-coupled" 
                    ? "Bound to data source" 
                    : "Independent rule logic"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => onTest?.(formData.expression)}
              data-testid="test-rule-button"
              disabled={!formData.expression.trim() || isTesting || isSaving}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <PlayCircle className={`h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 ${isTesting ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isTesting ? "Testing..." : "Test Rule"}
              </span>
              <span className="sm:hidden">{isTesting ? "Testing..." : "Test"}</span>
            </Button>
            <Button 
              type="submit" 
              data-testid="save-rule-button"
              disabled={!completionStatus.complete || isSaving || isTesting}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              <Save className={`h-3.5 w-3.5 text-blue-500 dark:text-blue-400 ${isSaving ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">
                {isSaving ? "Saving..." : "Save Rule"}
              </span>
              <span className="sm:hidden">{isSaving ? "Saving..." : "Save"}</span>
            </Button>
          </div>
        </div>

        {/* Progress Indicator for Tightly-Coupled */}
        {formData.ruleType === "tightly-coupled" && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>Progress</span>
              <Badge variant="secondary" className="text-xs">
                {[
                  completionStatus.dataSource,
                  completionStatus.tableObject,
                  completionStatus.name,
                  completionStatus.expression,
                ].filter(Boolean).length}/4
              </Badge>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                {completionStatus.dataSource ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-xs">Data Source</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                {completionStatus.tableObject ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-xs">Table/View</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                {completionStatus.name ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-xs">Rule Name</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1.5">
                {completionStatus.expression ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="text-xs">Expression</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 min-h-0">
        <div className="lg:col-span-3 flex flex-col gap-3 sm:gap-4 overflow-auto">
          <RuleTypeSelector 
            value={formData.ruleType || "tightly-coupled"} 
            onChange={(value) => {
              setFormData({ ...formData, ruleType: value });
              if (value === "loosely-coupled") {
                setActiveTab("rule");
              }
            }}
          />

          {(formData.ruleType === "tightly-coupled" || formData.ruleType === undefined) && (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "config" | "rule")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="config" className="flex items-center gap-2 py-2.5">
                  <span>Data Configuration</span>
                  {completionStatus.dataSource && completionStatus.tableObject && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="rule" className="flex items-center gap-2 py-2.5">
                  <span>Rule Expression</span>
                  {completionStatus.name && completionStatus.expression && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <div className="space-y-3 sm:space-y-4">
                  <DataSourceSelector 
                    value={formData.dataSource || ""} 
                    onChange={(value) => {
                      setFormData({ ...formData, dataSource: value, tableObject: "", selectedColumns: [] });
                    }}
                    ruleType={formData.ruleType}
                  />
                  
                  {formData.dataSource && (
                    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <TableObjectSelector 
                        dataSource={formData.dataSource} 
                        selectedObject={formData.tableObject} 
                        onSelectObject={(id) => {
                          setFormData({ ...formData, tableObject: id, selectedColumns: [] });
                        }}
                      />
                      {formData.tableObject && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <ColumnSelector 
                            selectedColumns={formData.selectedColumns || []}
                            onColumnsChange={(columns) => setFormData({ ...formData, selectedColumns: columns })}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!formData.dataSource && (
                    <Card className="border-dashed">
                      <CardContent className="pt-3">
                        <div className="flex flex-col items-center justify-center text-center py-4 sm:py-6">
                          <Info className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Select a data source above to continue
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {formData.dataSource && formData.tableObject && (
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("rule")}
                      className="w-full sm:w-auto"
                    >
                      Continue to Rule Expression →
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rule" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Rule Details</CardTitle>
                    <CardDescription>
                      Provide basic information about your rule
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name" className="text-xs font-medium">
                          Rule Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Tech Sector Exposure Limit"
                          data-testid="input-rule-name"
                        />
                        {!formData.name.trim() && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                            Rule name is required
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-xs font-medium">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity" className="text-xs font-medium">Severity</Label>
                        <Select
                          value={formData.severity}
                          onValueChange={(value: "hard" | "soft") => setFormData({ ...formData, severity: value })}
                        >
                          <SelectTrigger data-testid="select-severity">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hard">Hard Breach</SelectItem>
                            <SelectItem value="soft">Soft Breach</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe what this rule validates..."
                        className="resize-none"
                        rows={3}
                        data-testid="input-description"
                      />
                    </div>
                  </CardContent>
                </Card>

                <ExpressionEditor
                  ref={editorRef}
                  value={formData.expression}
                  onChange={(value) => {
                    setFormData({ ...formData, expression: value });
                    setIsValid(undefined);
                    setValidationError(undefined);
                  }}
                  isValid={isValid}
                  error={validationError}
                  onValidate={handleValidate}
                />

                <OperatorsPanel onInsertOperator={handleInsertOperator} />
              </TabsContent>
            </Tabs>
          )}

          {formData.ruleType === "loosely-coupled" && (
            <div className="space-y-3 sm:space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Rule Details</CardTitle>
                  <CardDescription>
                    Provide basic information about your independent rule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="name-loosely" className="text-xs font-medium">
                        Rule Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name-loosely"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Independent Rule Logic"
                        data-testid="input-rule-name"
                      />
                      {!formData.name.trim() && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                          Rule name is required
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category-loosely" className="text-xs font-medium">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity-loosely" className="text-xs font-medium">Severity</Label>
                      <Select
                        value={formData.severity}
                        onValueChange={(value: "hard" | "soft") => setFormData({ ...formData, severity: value })}
                      >
                        <SelectTrigger data-testid="select-severity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hard">Hard Breach</SelectItem>
                          <SelectItem value="soft">Soft Breach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-loosely" className="text-xs font-medium">Description</Label>
                    <Textarea
                      id="description-loosely"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the independent rule logic..."
                      className="resize-none"
                      rows={3}
                      data-testid="input-description"
                    />
                  </div>
                </CardContent>
              </Card>

              <ExpressionEditor
                ref={editorRef}
                value={formData.expression}
                onChange={(value) => {
                  setFormData({ ...formData, expression: value });
                  setIsValid(undefined);
                  setValidationError(undefined);
                }}
                isValid={isValid}
                error={validationError}
                onValidate={handleValidate}
              />

              <OperatorsPanel onInsertOperator={handleInsertOperator} />
            </div>
          )}
        </div>

        <div className="min-h-[400px] lg:min-h-0 lg:h-full lg:sticky lg:top-20">
          <div className="lg:sticky lg:top-20">
            <FunctionsLibrary onInsertFunction={handleInsertFunction} />
          </div>
        </div>
      </div>
    </form>
  );
}

export type { RuleFormData };
