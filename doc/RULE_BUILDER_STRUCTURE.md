# RuleBuilderForm Component Structure & Flow

## 📋 Overview
The `RuleBuilderForm` is a comprehensive form component for creating and editing data quality validation rules. It supports two rule types: **Tightly-Coupled** (bound to data sources) and **Loosely-Coupled** (independent logic).

---

## 🏗️ Component Architecture

### Main Component: `RuleBuilderForm`
**Location:** `src/components/RuleBuilderForm.tsx`

### Component Hierarchy
```
RuleBuilderForm
├── Header Section
│   ├── Back Button (conditional)
│   ├── Title ("Create New Rule" / "Edit Rule")
│   ├── Test Rule Button
│   └── Save Rule Button
│
├── Main Content (Grid: 3 columns + 1 sidebar)
│   │
│   ├── Left Section (3/4 width - lg:col-span-3)
│   │   ├── RuleTypeSelector
│   │   │
│   │   ├── [Tightly-Coupled Flow]
│   │   │   └── Tabs Component
│   │   │       ├── Tab 1: "Data Configuration"
│   │   │       │   ├── DataSourceSelector
│   │   │       │   ├── TableObjectSelector (conditional)
│   │   │       │   └── ColumnSelector (conditional)
│   │   │       │
│   │   │       └── Tab 2: "Rule Expression"
│   │   │           ├── Rule Details Card
│   │   │           │   ├── Name Input
│   │   │           │   ├── Category Select
│   │   │           │   ├── Severity Select
│   │   │           │   └── Description Textarea
│   │   │           ├── ExpressionEditor
│   │   │           └── OperatorsPanel
│   │   │
│   │   └── [Loosely-Coupled Flow]
│   │       ├── Rule Details Card (same as above)
│   │       ├── ExpressionEditor
│   │       └── OperatorsPanel
│   │
│   └── Right Sidebar (1/4 width)
│       └── FunctionsLibrary
```

---

## 📊 Data Flow

### State Management
```typescript
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
```

### State Variables
- `formData`: Complete form state (RuleFormData)
- `isValid`: Expression validation status (boolean | undefined)
- `validationError`: Error message for invalid expressions
- `editorRef`: Reference to ExpressionEditor for programmatic insertion

---

## 🔄 User Flow

### 1. Rule Type Selection
**Component:** `RuleTypeSelector`
- User chooses between:
  - **Tightly Coupled**: Bound to specific data sources
  - **Loosely Coupled**: Independent logic (no data source required)

### 2. Tightly-Coupled Flow

#### Step 2a: Data Configuration Tab
1. **Select Data Source** (`DataSourceSelector`)
   - Options: Snowflake, SQL Server
   - Shows connection info and auto-discovery message

2. **Select Table/View** (`TableObjectSelector`) - *Conditional*
   - Only shown if data source is selected
   - Searchable list of tables/views
   - Shows schema, name, type, and row count

3. **Select Columns** (`ColumnSelector`) - *Conditional*
   - Only shown if table/view is selected
   - Multi-select with search
   - Shows column type and nullability

#### Step 2b: Rule Expression Tab
1. **Enter Rule Details**
   - Name, Category, Severity, Description

2. **Build Expression** (`ExpressionEditor`)
   - Textarea for writing rule expressions
   - Real-time validation
   - Error display

3. **Insert Operators** (`OperatorsPanel`)
   - 4 categories: Arithmetic, Relational, Logical, Conditional
   - Click to insert at cursor position

4. **Insert Functions** (`FunctionsLibrary`)
   - Browse available functions
   - Click to insert function syntax

### 3. Loosely-Coupled Flow
- **Simplified**: No data configuration needed
- Direct access to:
  - Rule Details Card
  - ExpressionEditor
  - OperatorsPanel
  - FunctionsLibrary

---

## 🧩 Child Components

### 1. RuleTypeSelector
**Purpose:** Choose rule coupling type
**Props:**
- `value`: Current rule type
- `onChange`: Callback when type changes

**Features:**
- Visual cards with icons (Link/Unlink)
- Badges showing "Bound to Data" / "Independent"
- Info alert for loosely-coupled option

---

### 2. DataSourceSelector
**Purpose:** Select database source
**Props:**
- `value`: Selected data source ID
- `onChange`: Callback when source changes
- `ruleType`: Shows "Optional" badge for loosely-coupled

**Features:**
- Dropdown with icons (Snowflake ❄️, SQL Server 🔷)
- Selected source info card
- Connection details display

---

### 3. TableObjectSelector
**Purpose:** Select table/view from data source
**Props:**
- `dataSource`: Current data source ID
- `selectedObject`: Selected object ID
- `onSelectObject`: Callback when object selected

**Features:**
- Searchable dropdown
- Shows schema.name format
- Table/View icons
- Row count display
- Selected object info card

**Mock Data:**
- Snowflake: POSITIONS, TRADES, EXPOSURES, FUND_NAV, etc.
- SQL Server: Positions, Trades, Assets, ValuationData, etc.

---

### 4. ColumnSelector
**Purpose:** Multi-select columns from table
**Props:**
- `selectedColumns`: Array of selected column names
- `onColumnsChange`: Callback when selection changes

**Features:**
- Searchable column list
- Checkbox selection
- Shows column type and nullability
- Selected count badge
- Scrollable area

**Mock Data:**
- Columns from "dbo.Positions" and "PORTFOLIO.POSITIONS"

---

### 5. ExpressionEditor
**Purpose:** Write and validate rule expressions
**Props:**
- `ref`: Editor reference (for programmatic insertion)
- `value`: Current expression
- `onChange`: Callback when expression changes
- `isValid`: Validation status
- `error`: Error message
- `onValidate`: Validation handler

**Features:**
- Large textarea with placeholder examples
- Validate button
- Error/success state display
- Monospace font for code

---

### 6. OperatorsPanel
**Purpose:** Insert operators into expression
**Props:**
- `onInsertOperator`: Callback with operator symbol

**Features:**
- 4 tabs: Arithmetic, Relational, Logical, Conditional
- Click operator to insert at cursor
- Tooltips with descriptions

**Operators:**
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `(`, `)`
- **Relational**: `<`, `<=`, `>`, `>=`, `==`, `!=`
- **Logical**: `AND`, `OR`, `NOT`
- **Conditional**: `IF(`, `ELSE`, `END`, `CASE`, `WHEN`, `THEN`

---

### 7. FunctionsLibrary
**Purpose:** Browse and insert functions
**Props:**
- `onInsertFunction`: Callback with function syntax

**Features:**
- Categorized function list
- Function documentation
- Click to insert function template
- Syntax examples

---

## ✅ Validation Logic

### Expression Validation (`handleValidate`)
1. **Empty Check**: Expression cannot be empty
2. **Parentheses Check**: Opening and closing parentheses must match
3. **Error Display**: Shows specific error messages

### Form Submission (`handleSubmit`)
1. Validates expression
2. Checks if name is provided
3. Calls `onSave` callback with form data

---

## 🎨 Layout Structure

### Responsive Grid
```css
grid grid-cols-1 lg:grid-cols-4
```
- **Mobile**: Single column (stacked)
- **Desktop**: 3 columns (main) + 1 column (sidebar)

### Main Section (3/4 width)
- Scrollable container
- Gap between sections: `gap-6`
- Flex column layout

### Sidebar (1/4 width)
- FunctionsLibrary
- Fixed height on desktop
- Minimum height: 400px on mobile

---

## 🔌 Props Interface

```typescript
interface RuleBuilderFormProps {
  initialData?: Partial<RuleFormData>;  // Pre-fill form (for editing)
  onSave?: (data: RuleFormData) => void;  // Save handler
  onCancel?: () => void;                  // Cancel/back handler
  onTest?: (expression: string) => void;  // Test expression handler
}
```

---

## 📝 Key Features

1. **Conditional Rendering**
   - Data configuration only for tightly-coupled rules
   - Table selector only if data source selected
   - Column selector only if table selected

2. **Progressive Disclosure**
   - Each step reveals next options
   - Clear visual hierarchy

3. **Expression Building**
   - Visual operator insertion
   - Function library integration
   - Real-time validation

4. **Dual Mode Support**
   - Tightly-coupled: Full data configuration
   - Loosely-coupled: Expression-only

5. **Edit Mode**
   - Pre-fills form with `initialData`
   - Changes title to "Edit Rule"
   - Maintains all form state

---

## 🚀 Usage Example

```tsx
<RuleBuilderForm
  initialData={{
    name: "Tech Exposure Limit",
    category: "Exposure",
    severity: "hard",
    expression: "EXPOSURE(sector='Tech') / NAV() <= 0.10",
    ruleType: "tightly-coupled",
    dataSource: "snowflake",
    tableObject: "sf_positions"
  }}
  onSave={(data) => {
    // Save to API
    console.log("Saving rule:", data);
  }}
  onCancel={() => {
    // Navigate back
    router.back();
  }}
  onTest={(expression) => {
    // Test expression
    console.log("Testing:", expression);
  }}
/>
```

---

## 🔄 Data Flow Diagram

```
User Input
    ↓
RuleTypeSelector → Updates formData.ruleType
    ↓
[If Tightly-Coupled]
    ↓
DataSourceSelector → Updates formData.dataSource
    ↓
TableObjectSelector → Updates formData.tableObject
    ↓
ColumnSelector → Updates formData.selectedColumns
    ↓
[If Loosely-Coupled]
    ↓
ExpressionEditor → Updates formData.expression
    ↓
OperatorsPanel → Inserts into ExpressionEditor
    ↓
FunctionsLibrary → Inserts into ExpressionEditor
    ↓
Validation → Updates isValid/validationError
    ↓
Submit → Calls onSave(formData)
```

---

## 📌 TODO Items (from code comments)
- Remove mock functionality in:
  - `TableObjectSelector` (replace with API call)
  - `ColumnSelector` (replace with API call)
- Implement actual API integration
- Add real-time expression evaluation
- Connect to backend validation service

---

## 🎯 Key Design Patterns

1. **Controlled Components**: All inputs controlled by `formData` state
2. **Composition**: Complex form built from smaller components
3. **Conditional Rendering**: UI adapts based on rule type
4. **Ref Forwarding**: ExpressionEditor ref for programmatic control
5. **Callback Props**: Parent handles save/cancel/test actions

