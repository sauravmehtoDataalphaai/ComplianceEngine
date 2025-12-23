import type { RuleFormData } from "@/components/RuleBuilderForm";

export interface StoredRule extends RuleFormData {
  id: string;
  status?: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
}

const STORAGE_KEY = "rule-craft-rules";

/**
 * Get all rules from localStorage
 */
export function getAllRules(): StoredRule[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading rules from localStorage:", error);
    return [];
  }
}

/**
 * Save a rule to localStorage
 */
export function saveRule(ruleData: RuleFormData, id?: string): StoredRule {
  const rules = getAllRules();
  const now = new Date().toISOString();
  
  if (id) {
    // Update existing rule
    const index = rules.findIndex((r) => r.id === id);
    if (index >= 0) {
      rules[index] = {
        ...rules[index],
        ...ruleData,
        updatedAt: now,
      };
    } else {
      // ID provided but not found, create new
      const newRule: StoredRule = {
        ...ruleData,
        id,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };
      rules.push(newRule);
    }
  } else {
    // Create new rule
    const newRule: StoredRule = {
      ...ruleData,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };
    rules.push(newRule);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
    return id ? rules.find((r) => r.id === id)! : rules[rules.length - 1];
  } catch (error) {
    console.error("Error saving rule to localStorage:", error);
    throw new Error("Failed to save rule to localStorage");
  }
}

/**
 * Get a single rule by ID
 */
export function getRuleById(id: string): StoredRule | null {
  const rules = getAllRules();
  return rules.find((r) => r.id === id) || null;
}

/**
 * Delete a rule from localStorage
 */
export function deleteRule(id: string): boolean {
  const rules = getAllRules();
  const filtered = rules.filter((r) => r.id !== id);
  
  if (filtered.length === rules.length) {
    return false; // Rule not found
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting rule from localStorage:", error);
    return false;
  }
}

/**
 * Validate expression syntax
 */
export function validateExpression(expression: string): { valid: boolean; error?: string } {
  const trimmedExpr = expression.trim();
  
  if (!trimmedExpr) {
    return { valid: false, error: "Expression cannot be empty" };
  }
  
  const openParens = (trimmedExpr.match(/\(/g) || []).length;
  const closeParens = (trimmedExpr.match(/\)/g) || []).length;
  
  if (openParens !== closeParens) {
    return {
      valid: false,
      error: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing`,
    };
  }
  
  return { valid: true };
}

/**
 * Test expression (mock implementation)
 */
export function testExpression(expression: string): {
  success: boolean;
  message: string;
  result?: string;
  actualValue?: string;
  expectedValue?: string;
  executionTime?: string;
} {
  const validation = validateExpression(expression);
  
  if (!validation.valid) {
    return {
      success: false,
      message: validation.error || "Expression validation failed",
    };
  }
  
  // Mock test result
  return {
    success: true,
    message: "Expression validated successfully. Test execution completed.",
    result: "passed",
    actualValue: "8.5%",
    expectedValue: "<=10%",
    executionTime: "124ms",
  };
}

