# Loosely Coupled Rule - Complete Guide

## Overview

**Loosely Coupled Rules** are independent rule logic that don't require a specific data source. These rules are evaluated based on expression logic alone, making them flexible and reusable across different contexts.

---

## Required Fields

When creating a **Loosely Coupled Rule**, you need to fill in the following fields:

### 1. **Rule Name** (Required) ⭐
A descriptive name for your rule.

**Examples:**
- `Tech Sector Exposure Limit`
- `Portfolio VaR Constraint`
- `Maximum Single Position Limit`
- `Currency Exposure Check`
- `Liquidity Ratio Validation`

**Best Practices:**
- Use clear, descriptive names
- Include the metric or constraint being checked
- Keep it concise (50-60 characters max)

---

### 2. **Category** (Required)
Select the category that best describes your rule.

**Available Categories:**
- **Exposure** - Rules related to exposure limits and concentrations
- **Risk** - Risk management and risk metrics
- **Trade** - Trading rules and constraints
- **Position** - Position-level validations
- **Aggregation** - Aggregated data validations
- **Compliance** - Regulatory compliance rules

**Example Selection:**
- For exposure limits → Select **"Exposure"**
- For VaR constraints → Select **"Risk"**
- For position size limits → Select **"Position"**

---

### 3. **Severity** (Required)
Define the severity level when this rule is breached.

**Options:**
- **Hard Breach** - Critical violation that must be addressed immediately
- **Soft Breach** - Warning that should be monitored

**Example Selection:**
- Regulatory limits → **Hard Breach**
- Internal guidelines → **Soft Breach**
- Warning thresholds → **Soft Breach**

---

### 4. **Description** (Optional)
Provide additional context about what this rule validates.

**Examples:**
```
"Ensures technology sector exposure does not exceed 10% of total portfolio NAV. This rule helps maintain sector diversification and manage concentration risk."
```

```
"Validates that portfolio VaR does not exceed 1.5x the benchmark VaR. This ensures the portfolio risk remains within acceptable bounds relative to the benchmark."
```

```
"Checks that no single position exceeds 5% of total portfolio value. This rule enforces position concentration limits for risk management."
```

---

### 5. **Rule Expression** (Required) ⭐
The core logic of your rule written as a mathematical or logical expression.

**Expression Syntax:**
- Use functions from the Functions Library (right sidebar)
- Use operators from the Operators Panel (Math, Compare, Logic, If/Case tabs)
- Ensure parentheses are balanced
- Click **"Validate"** button to check syntax

---

## Complete Examples

### Example 1: Sector Exposure Limit

**Rule Name:**
```
Tech Sector Exposure Limit
```

**Category:**
```
Exposure
```

**Severity:**
```
Hard Breach
```

**Description:**
```
Ensures technology sector exposure does not exceed 10% of total portfolio NAV. This rule helps maintain sector diversification and manage concentration risk.
```

**Rule Expression:**
```
EXPOSURE(sector='Tech') / NAV() <= 0.10
```

**Explanation:**
- Calculates tech sector exposure
- Divides by total NAV
- Checks if result is less than or equal to 10% (0.10)

---

### Example 2: Portfolio VaR Constraint

**Rule Name:**
```
Portfolio VaR vs Benchmark
```

**Category:**
```
Risk
```

**Severity:**
```
Hard Breach
```

**Description:**
```
Validates that portfolio VaR does not exceed 1.5x the benchmark VaR. This ensures the portfolio risk remains within acceptable bounds relative to the benchmark.
```

**Rule Expression:**
```
VaR(Portfolio) <= VaR(Benchmark) * 1.5
```

**Explanation:**
- Compares portfolio VaR to benchmark VaR
- Multiplies benchmark VaR by 1.5
- Ensures portfolio VaR is within 1.5x limit

---

### Example 3: Single Position Limit

**Rule Name:**
```
Maximum Single Position Size
```

**Category:**
```
Position
```

**Severity:**
```
Soft Breach
```

**Description:**
```
Checks that no single position exceeds 5% of total portfolio value. This rule enforces position concentration limits for risk management.
```

**Rule Expression:**
```
MAX(POSITION_MV()) / NAV() <= 0.05
```

**Explanation:**
- Finds the maximum position market value
- Divides by total NAV
- Ensures no position exceeds 5% (0.05)

---

### Example 4: Sub-Investment Grade Concentration

**Rule Name:**
```
Sub-Investment Grade Limit
```

**Category:**
```
Risk
```

**Severity:**
```
Hard Breach
```

**Description:**
```
Monitors positions rated below BBB. Ensures sub-investment grade holdings do not exceed 15% of portfolio NAV.
```

**Rule Expression:**
```
SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15
```

**Explanation:**
- Sums positions with rating below 'BBB'
- Divides by total NAV
- Ensures sub-investment grade exposure is ≤ 15%

---

### Example 5: Currency Exposure Check

**Rule Name:**
```
USD Currency Exposure Limit
```

**Category:**
```
Exposure
```

**Severity:**
```
Soft Breach
```

**Description:**
```
Validates that USD-denominated exposure does not exceed 60% of total portfolio to maintain currency diversification.
```

**Rule Expression:**
```
EXPOSURE(currency='USD') / NAV() <= 0.60
```

**Explanation:**
- Calculates USD currency exposure
- Divides by total NAV
- Ensures USD exposure is ≤ 60%

---

### Example 6: Liquidity Ratio Validation

**Rule Name:**
```
Portfolio Liquidity Ratio
```

**Category:**
```
Compliance
```

**Severity:**
```
Hard Breach
```

**Description:**
```
Ensures the portfolio maintains a minimum liquidity ratio of 0.20 (20%) to meet regulatory requirements.
```

**Rule Expression:**
```
LIQUID_ASSETS() / NAV() >= 0.20
```

**Explanation:**
- Calculates liquid assets
- Divides by total NAV
- Ensures liquidity ratio is ≥ 20%

---

## Step-by-Step Workflow

### Step 1: Select Rule Type
1. Click on **"Loosely Coupled"** option
2. You'll see the description: "Pure rule logic independent of any specific data source"
3. An info alert will appear explaining that data source selection is optional

### Step 2: Fill Rule Details
1. **Enter Rule Name** - Type a descriptive name
2. **Select Category** - Choose from dropdown (Exposure, Risk, Trade, Position, Aggregation, Compliance)
3. **Select Severity** - Choose "Hard Breach" or "Soft Breach"
4. **Enter Description** (Optional) - Add context about the rule

### Step 3: Build Rule Expression
1. **Use Functions Library** (right sidebar):
   - Click on any function (e.g., `SUM`, `EXPOSURE`, `NAV`, `VaR`)
   - It will insert the function syntax into the expression editor
   - Fill in the function parameters

2. **Use Operators Panel** (bottom):
   - **Math Tab**: `+`, `-`, `*`, `/`, `%`
   - **Compare Tab**: `<`, `<=`, `>`, `>=`, `==`, `!=`
   - **Logic Tab**: `AND`, `OR`, `NOT`
   - **If/Case Tab**: Conditional logic operators

3. **Type Directly**: You can also type expressions directly in the text area

### Step 4: Validate Expression
1. Click the **"Validate"** button
2. Check for:
   - ✅ Green checkmark = Valid expression
   - ❌ Red error = Fix syntax errors
   - Common errors:
     - Mismatched parentheses
     - Missing operators
     - Invalid function syntax

### Step 5: Test Rule (Optional)
1. Click **"Test Rule"** button
2. This will execute the expression against test data
3. Review the test results

### Step 6: Save Rule
1. Ensure all required fields are filled:
   - ✅ Rule Name
   - ✅ Category
   - ✅ Severity
   - ✅ Valid Rule Expression
2. Click **"Save Rule"** button
3. You'll be redirected to the rules list page

---

## Common Expression Patterns

### Pattern 1: Ratio Comparison
```
[Function] / [Function] <= [Threshold]
```
**Example:**
```
EXPOSURE(sector='Tech') / NAV() <= 0.10
```

### Pattern 2: Absolute Value Check
```
ABS([Value] - [Target]) <= [Tolerance]
```
**Example:**
```
ABS(PORTFOLIO_WEIGHT() - BENCHMARK_WEIGHT()) <= 0.02
```

### Pattern 3: Conditional Logic
```
IF([Condition], [TrueValue], [FalseValue]) <= [Limit]
```
**Example:**
```
IF(SECTOR == 'Tech', POSITION_MV(), 0) / NAV() <= 0.15
```

### Pattern 4: Multiple Conditions
```
[Condition1] AND [Condition2] AND [Condition3]
```
**Example:**
```
EXPOSURE(sector='Tech') / NAV() <= 0.10 AND EXPOSURE(sector='Finance') / NAV() <= 0.15
```

### Pattern 5: Aggregation with Filter
```
SUM([Function](filter=[Condition])) / NAV() <= [Limit]
```
**Example:**
```
SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15
```

---

## Available Functions (Quick Reference)

### Math Functions
- `SUM(values)` - Sum all values
- `AVERAGE(values)` - Calculate average
- `COUNT(items)` - Count items
- `MAX(values)` - Find maximum
- `MIN(values)` - Find minimum
- `ROUND(value, decimals)` - Round number
- `ABS(value)` - Absolute value

### Exposure Functions
- `EXPOSURE(sector='X')` - Sector exposure
- `EXPOSURE(currency='USD')` - Currency exposure
- `EXPOSURE(country='US')` - Country exposure

### Risk Functions
- `VaR(portfolio)` - Value at Risk
- `POSITION_MV(filter=condition)` - Position market value

### Portfolio Functions
- `NAV()` - Net Asset Value
- `LIQUID_ASSETS()` - Liquid assets
- `TOTAL_ASSETS()` - Total assets

---

## Validation Rules

### Expression Validation
- ✅ Expression cannot be empty
- ✅ All parentheses must be balanced
- ✅ Function syntax must be correct
- ✅ Operators must be used correctly

### Form Validation
- ✅ Rule Name is required
- ✅ Category must be selected
- ✅ Severity must be selected
- ✅ Expression must be valid

---

## Tips & Best Practices

1. **Start Simple**: Begin with basic expressions and add complexity gradually
2. **Use Functions**: Leverage built-in functions instead of writing complex logic
3. **Test First**: Always validate and test your expression before saving
4. **Clear Names**: Use descriptive rule names that explain what the rule checks
5. **Documentation**: Add descriptions to explain the business logic
6. **Review Expressions**: Double-check mathematical operations and thresholds
7. **Use Comments**: While not supported in expressions, document in the description field

---

## Troubleshooting

### Error: "Expression cannot be empty"
- **Solution**: Enter an expression in the Rule Expression field

### Error: "Mismatched parentheses"
- **Solution**: Count opening `(` and closing `)` parentheses - they must match
- **Example Fix**: `SUM(col1)` ✅ vs `SUM(col1` ❌

### Error: "Invalid function syntax"
- **Solution**: Check function parameters match the expected format
- **Example**: `EXPOSURE(sector='Tech')` ✅ vs `EXPOSURE(sector Tech)` ❌

### Save Button Disabled
- **Check**: Rule Name is filled
- **Check**: Expression is valid (click Validate)
- **Check**: All required fields are completed

---

## Quick Start Template

Copy and modify this template for your rule:

```
Rule Name: [Your Rule Name]
Category: [Exposure/Risk/Trade/Position/Aggregation/Compliance]
Severity: [Hard Breach/Soft Breach]
Description: [What this rule validates]

Expression:
[Function] / [Function] <= [Threshold]
```

**Example:**
```
Rule Name: Tech Sector Limit
Category: Exposure
Severity: Hard Breach
Description: Ensures tech sector exposure stays below 10%

Expression:
EXPOSURE(sector='Tech') / NAV() <= 0.10
```

---

## Need Help?

- Check the **Functions Library** (right sidebar) for available functions
- Use the **Operators Panel** (bottom) to insert operators
- Click **"Validate"** to check expression syntax
- Click **"Test Rule"** to test against sample data

---

**Last Updated:** 2024
**Version:** 1.0

