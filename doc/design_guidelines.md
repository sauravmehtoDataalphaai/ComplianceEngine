# Design Guidelines: Financial Compliance Rules Engine

## Design Approach
**Selected System**: Carbon Design System (IBM)
**Justification**: Purpose-built for data-heavy enterprise applications with complex workflows. Provides robust patterns for tables, forms, and hierarchical data visualization essential for rule building and compliance monitoring.

**Core Principles**:
- Clarity over decoration - every element serves a functional purpose
- Scannable information architecture for rapid decision-making
- Consistent data presentation patterns across all screens
- Progressive disclosure - reveal complexity only when needed

---

## Typography

**Font Family**: IBM Plex Sans (via Google Fonts CDN)

**Hierarchy**:
- Page Headers: text-2xl font-semibold (24px)
- Section Headers: text-lg font-semibold (18px)
- Data Tables Headers: text-sm font-medium uppercase tracking-wide
- Body Text: text-base (16px)
- Supporting/Meta Text: text-sm (14px)
- Code/Expressions: IBM Plex Mono, text-sm

**Implementation**: Use font-medium for emphasis in data contexts, font-semibold for navigation and headers only.

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-6, mb-8, py-12)

**Grid Structure**:
- Main Application: Sidebar navigation (w-64) + Content area (flex-1)
- Dashboard Cards: grid with gap-6
- Rule Builder: Two-column split (65/35) - main canvas + properties panel
- Data Tables: Full-width with horizontal scroll if needed

**Container Constraints**:
- Max width: max-w-7xl for main content areas
- Form max width: max-w-3xl for focused data entry
- No viewport-height constraints on content areas

---

## Component Library

### Navigation
- **Sidebar**: Fixed left navigation, dark neutral background (bg-neutral-900), white text with reduced opacity for inactive items
- **Breadcrumbs**: Show current location in rule hierarchy (Home / Rules / Edit Rule)
- **Tabs**: For switching between Functions, Rule Logic, and Results views

### Rule Builder Interface
- **Expression Canvas**: Large textarea with monospace font showing rule syntax, syntax highlighting for operators/functions
- **Operator Palette**: Segmented dropdown groups (Arithmetic | Relational | Logical) with operator buttons
- **Function Library**: Searchable list with expandable parameter definitions
- **Visual Tree**: Optional hierarchical visualization of rule structure using indented list items

### Data Display
- **Tables**: Stripe rows (even rows with subtle bg-neutral-50), sticky headers, sortable columns, dense spacing (py-2 px-4)
- **Status Badges**: Rounded pills with semantic colors - use border and background together for accessibility
  - Hard Breach: Red treatment
  - Soft Breach: Amber treatment  
  - Passed: Green treatment
- **Metric Cards**: Grid of summary statistics (Total Rules, Pass Rate, Critical Failures) with large numbers (text-3xl) and labels (text-sm)

### Forms & Inputs
- **Dropdowns**: Carbon-style with chevron icon, full-width in forms
- **Input Fields**: Clear labels above, helper text below, consistent height (h-10)
- **Validation**: Inline error messages with icon, show immediately on blur

### Results Dashboard
- **Summary Panel**: Top section with key metrics in 4-column grid
- **Results Table**: Sortable/filterable table showing Rule Name, Expression, Status, Last Run, Breach Details
- **Details Drawer**: Slide-in panel from right showing full rule execution details when row clicked

---

## Interaction Patterns

**Rule Composition Flow**:
1. Select function from dropdown → Auto-populate with parameter placeholders
2. Click operator button → Insert at cursor position in expression
3. Build nested expressions using parentheses grouping
4. Validate button checks syntax before saving

**Data Loading**: Skeleton loaders for tables (shimmer effect on rows), no spinners for page-level loads

**Animations**: NONE - This is a data application where stability and speed matter more than visual flourish

---

## Accessibility
- All interactive elements keyboard navigable
- Clear focus indicators (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Table headers properly associated with data cells
- Status communicated via text + visual indicators (not color alone)