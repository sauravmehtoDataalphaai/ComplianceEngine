import { NextResponse } from "next/server";
import { rules, insertRuleSchema } from "@shared/schema";

// Database is not used - all data is stored in localStorage on client side
// This API route is kept for compatibility but returns mock responses
const db: any = null;

export async function GET() {
  try {
    // If database is not available, return mock data
    if (!db) {
      return NextResponse.json({
        rules: [],
        message: "Database not configured. Using mock data.",
      });
    }

    const allRules = await db.select().from(rules);
    return NextResponse.json({ rules: allRules });
  } catch (error) {
    console.error("Error fetching rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = insertRuleSchema.parse({
      name: body.name,
      description: body.description || "",
      category: body.category,
      severity: body.severity,
      expression: body.expression,
      ruleType: body.ruleType || "tightly-coupled",
      dataSource: body.dataSource || null,
      tableObject: body.tableObject || null,
      selectedColumns: body.selectedColumns ? JSON.stringify(body.selectedColumns) : null,
      status: body.status || "draft",
    });

    // If database is not available, return mock response
    if (!db) {
      return NextResponse.json({
        id: `rule-${Date.now()}`,
        ...validatedData,
        message: "Database not configured. Rule saved in memory only.",
      }, { status: 201 });
    }

    // Insert into database
    const [newRule] = await db.insert(rules).values(validatedData).returning();
    
    return NextResponse.json({
      id: newRule.id,
      ...newRule,
      message: "Rule created successfully",
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating rule:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create rule", message: error.message },
      { status: 500 }
    );
  }
}

