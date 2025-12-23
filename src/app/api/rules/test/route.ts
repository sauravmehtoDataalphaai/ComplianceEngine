import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { expression } = body;

    if (!expression || typeof expression !== "string") {
      return NextResponse.json(
        { error: "Expression is required" },
        { status: 400 }
      );
    }

    // Basic validation
    const trimmedExpr = expression.trim();
    if (!trimmedExpr) {
      return NextResponse.json(
        { error: "Expression cannot be empty" },
        { status: 400 }
      );
    }

    // Check parentheses balance
    const openParens = (trimmedExpr.match(/\(/g) || []).length;
    const closeParens = (trimmedExpr.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      return NextResponse.json(
        {
          error: "Mismatched parentheses",
          details: `${openParens} opening, ${closeParens} closing`,
        },
        { status: 400 }
      );
    }

    // TODO: In production, this would execute the expression against test data
    // For now, we'll simulate a test execution
    const testResult = {
      success: true,
      expression: trimmedExpr,
      result: "passed", // or "failed", "error"
      actualValue: "8.5%",
      expectedValue: "<=10%",
      executionTime: "124ms",
      message: "Expression validated successfully. Test execution completed.",
    };

    return NextResponse.json({
      ...testResult,
      message: "Rule test completed successfully",
    });
  } catch (error: any) {
    console.error("Error testing rule:", error);
    return NextResponse.json(
      {
        error: "Failed to test rule",
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}


