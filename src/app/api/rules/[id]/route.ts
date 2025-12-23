import { NextResponse } from "next/server";
import { rules, insertRuleSchema } from "@shared/schema";

// Database is not used - all data is stored in localStorage on client side
// This API route is kept for compatibility but returns mock responses
const db: any = null;
const eq: any = null;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // If database is not available, return mock data
    if (!db) {
      return NextResponse.json({
        id,
        message: "Database not configured. Using mock data.",
      });
    }

    const [rule] = await db.select().from(rules).where(eq(rules.id, id));
    
    if (!rule) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Error fetching rule:", error);
    return NextResponse.json(
      { error: "Failed to fetch rule" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
        id,
        ...validatedData,
        message: "Database not configured. Rule updated in memory only.",
      });
    }

    const [updatedRule] = await db
      .update(rules)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rules.id, id))
      .returning();

    if (!updatedRule) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...updatedRule,
      message: "Rule updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating rule:", error);
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update rule", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // If database is not available, return mock response
    if (!db) {
      return NextResponse.json({
        id,
        message: "Database not configured. Rule deleted in memory only.",
      });
    }

    const [deletedRule] = await db
      .delete(rules)
      .where(eq(rules.id, id))
      .returning();

    if (!deletedRule) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id,
      message: "Rule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting rule:", error);
    return NextResponse.json(
      { error: "Failed to delete rule" },
      { status: 500 }
    );
  }
}


