"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RuleBuilderForm, { type RuleFormData } from "@/components/RuleBuilderForm";
import { useToast } from "@/hooks/use-toast";
import { getRuleById, saveRule, testExpression } from "@/lib/rulesStorage";

export default function RuleBuilder({ id }: { id?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [initialData, setInitialData] = useState<Partial<RuleFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!id;

  // Load rule data from localStorage when editing
  useEffect(() => {
    if (isEditing && id) {
      setIsLoading(true);
      try {
        const rule = getRuleById(id);
        
        if (!rule) {
          toast({
            title: "Error",
            description: "Rule not found. Redirecting...",
            variant: "destructive",
          });
          router.push("/rules");
          return;
        }
        
        // Parse selectedColumns if it's a JSON string
        const selectedColumns = rule.selectedColumns 
          ? (typeof rule.selectedColumns === 'string' 
              ? JSON.parse(rule.selectedColumns) 
              : rule.selectedColumns)
          : [];

        setInitialData({
          name: rule.name,
          description: rule.description || "",
          category: rule.category,
          severity: rule.severity,
          expression: rule.expression,
          ruleType: rule.ruleType || "tightly-coupled",
          dataSource: rule.dataSource || "",
          tableObject: rule.tableObject || "",
          selectedColumns: selectedColumns,
        });
      } catch (error) {
        console.error("Error loading rule:", error);
        toast({
          title: "Error",
          description: "Failed to load rule. Redirecting...",
          variant: "destructive",
        });
        router.push("/rules");
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, isEditing, router, toast]);

  const handleSave = async (data: RuleFormData) => {
    setIsSaving(true);
    try {
      // Save to localStorage
      const savedRule = saveRule(data, id);

      toast({
        title: isEditing ? "Rule Updated" : "Rule Created",
        description: `"${data.name}" has been saved successfully.`,
      });

      // Navigate back to rules list
      router.push("/rules");
    } catch (error: any) {
      console.error("Error saving rule:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/rules");
  };

  const handleTest = async (expression: string) => {
    setIsTesting(true);
    try {
      // Test expression using localStorage utility
      const result = testExpression(expression);

      if (!result.success) {
        throw new Error(result.message || "Failed to test rule");
      }

      toast({
        title: "Rule Test Complete",
        description: result.message || "Expression evaluated successfully against test data.",
      });
    } catch (error: any) {
      console.error("Error testing rule:", error);
      toast({
        title: "Test Failed",
        description: error.message || "Failed to test rule expression. Please check your syntax.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 h-full flex items-center justify-center" data-testid="rule-builder-page">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading rule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 h-full" data-testid="rule-builder-page">
      <RuleBuilderForm
        initialData={initialData}
        onSave={handleSave}
        onCancel={handleCancel}
        onTest={handleTest}
        isSaving={isSaving}
        isTesting={isTesting}
      />
    </div>
  );
}
