# Rule-Craft Project Overview

## 🎯 Project Purpose

**Rule-Craft** is a Financial Compliance Rules Engine - a full-stack web application for building, managing, and executing data quality validation rules for financial compliance monitoring.

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight router)
- **Theme**: Dark/Light mode support

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (optional in dev)
- **Storage**: In-memory storage (development), Database (production)
- **Server**: Single Express server serving both API and static files

## 📂 Project Structure

```
Rule-Craft/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Main page components
│   │   │   ├── Dashboard.tsx      # Overview with metrics
│   │   │   ├── Rules.tsx          # Rules list/management
│   │   │   ├── RuleBuilder.tsx    # Create/edit rules
│   │   │   ├── Results.tsx        # Execution results
│   │   │   ├── FunctionsPage.tsx  # Functions library
│   │   │   └── not-found.tsx      # 404 page
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/              # Shadcn UI primitives
│   │   │   ├── AppSidebar.tsx    # Navigation sidebar
│   │   │   ├── RuleBuilderForm.tsx # Rule creation form
│   │   │   ├── ExpressionEditor.tsx # Code editor for expressions
│   │   │   ├── FunctionsLibrary.tsx # Function browser
│   │   │   ├── OperatorsPanel.tsx  # Operator buttons
│   │   │   ├── ResultsTable.tsx    # Results display
│   │   │   └── ... (many more)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities
│   │   └── App.tsx           # Root component
│   └── index.html
│
├── server/                    # Express Backend
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes (currently empty)
│   ├── db.ts                 # Database connection
│   ├── storage.ts            # Storage interface (in-memory)
│   ├── vite.ts               # Vite dev server setup
│   └── static.ts             # Static file serving
│
├── shared/                    # Shared code
│   └── schema.ts             # Database schemas (only users table)
│
└── script/                    # Build scripts
    └── build.ts              # Production build
```

## 🔑 Key Features

### 1. Dashboard (`/`)
- **Metrics Cards**: Total Rules, Pass Rate, Soft Breaches, Hard Breaches
- **Recent Results Table**: Quick view of latest rule executions
- **Rule Details Sheet**: Click to view detailed execution info
- **Refresh Button**: Manually refresh results

### 2. Rules Management (`/rules`)
- **List/Grid View Toggle**: Switch between list and card layouts
- **Search**: Filter rules by name or expression
- **Category Filter**: Filter by Exposure, Risk, Trade, Position, Compliance
- **Rule Cards**: Display rule info with status badges
- **Actions**: Edit, Delete, Run rules
- **Create Button**: Navigate to rule builder

### 3. Rule Builder (`/rules/new`, `/rules/:id/edit`)
- **Rule Type Selector**: Tightly-coupled vs Loosely-coupled
- **Data Configuration Tab**:
  - Data Source selector (Snowflake, SQL Server, etc.)
  - Table/Object selector
  - Column selector
- **Rule Expression Tab**:
  - Expression editor (monospace textarea)
  - Operators panel (Arithmetic, Relational, Logical)
  - Functions library sidebar
  - Syntax validation
- **Form Fields**:
  - Name, Description
  - Category, Severity (hard/soft)
  - Expression
- **Actions**: Test, Save, Cancel

### 4. Results (`/results`)
- **Results Table**: All rule execution results
- **Search & Filter**: By name/expression and status
- **Status Filter**: All, Passed, Soft Breach, Hard Breach, Pending
- **Export Button**: Export results to CSV
- **Refresh Button**: Reload results
- **Details Sheet**: Click row to view full execution details

### 5. Functions Library (`/functions`)
- **Function Browser**: Searchable list of available functions
- **Categories**: Math, Exposure, Risk, Position, Trade, etc.
- **Function Details**: Name, description, syntax, parameters
- **Copy to Clipboard**: Click to copy function syntax

## 🎨 UI Components

### Core Components
- **AppSidebar**: Resizable sidebar with navigation and data sources panel
- **RuleCard**: Grid view card for rules
- **RuleCardCompact**: List view compact card
- **MetricCard**: Dashboard metric display
- **StatusBadge**: Status indicator (passed, soft_breach, hard_breach, pending)
- **ExpressionEditor**: Code editor with validation
- **ResultsTable**: Sortable results table
- **RuleDetailsSheet**: Slide-in panel for rule details

### Form Components
- **RuleBuilderForm**: Main rule creation form
- **DataSourceSelector**: Data source dropdown
- **TableObjectSelector**: Table/object selector
- **ColumnSelector**: Multi-column selector
- **RuleTypeSelector**: Rule type radio buttons

## 📊 Data Flow

### Current State (Mock Data)
- All data is **mock/hardcoded** in components
- No API calls are made
- No database operations
- Storage interface exists but only has user methods

### Intended Flow (To Be Implemented)
```
Frontend → API Routes → Storage Interface → Database
```

## 🔧 Technical Details

### Expression Syntax
Rules use a custom expression language:
- **Functions**: `EXPOSURE(sector='Tech')`, `NAV()`, `SUM(...)`, `COUNT(...)`
- **Operators**: `+`, `-`, `*`, `/`, `<=`, `>=`, `==`, `!=`, `AND`, `OR`
- **Examples**:
  - `EXPOSURE(sector='Tech') / NAV() <= 0.10`
  - `SUM(POSITION_MV(filter=rating<'BBB')) / NAV() <= 0.15`
  - `VaR(Fund) <= VaR(Benchmark) * 1.5`

### Rule Types
- **Tightly-coupled**: Rule directly queries data source
- **Loosely-coupled**: Rule uses stored procedure

### Rule Categories
- Exposure
- Risk
- Trade
- Position
- Aggregation
- Compliance

### Severity Levels
- **Hard**: Critical failures requiring immediate action
- **Soft**: Warnings requiring review

### Status Types
- **passed**: Rule executed successfully
- **soft_breach**: Soft limit exceeded
- **hard_breach**: Hard limit exceeded
- **pending**: Not yet executed

## 🚀 Development Status

### ✅ Completed
- Full UI implementation
- All pages and components
- Mock data for all features
- Routing and navigation
- Theme support (dark/light)
- Responsive design
- Form validation
- Expression editor

### ⚠️ TODO (Mock Functionality)
- Replace mock data with API calls
- Implement API routes in `server/routes.ts`
- Create database schema for rules, results, functions
- Connect storage to database
- Implement rule execution engine
- Add authentication (users table exists but unused)

## 📝 Key Files to Understand

1. **`client/src/App.tsx`**: Root component with routing and layout
2. **`client/src/pages/Dashboard.tsx`**: Main dashboard with metrics
3. **`client/src/components/RuleBuilderForm.tsx`**: Complex rule creation form
4. **`client/src/components/ExpressionEditor.tsx`**: Code editor component
5. **`server/index.ts`**: Express server setup
6. **`server/routes.ts`**: API routes (currently empty - needs implementation)
7. **`server/storage.ts`**: Storage interface (needs expansion)
8. **`shared/schema.ts`**: Database schema (only users - needs rules/results tables)

## 🔌 API Endpoints (To Be Implemented)

The following endpoints should be created in `server/routes.ts`:

```
GET    /api/rules              # List all rules
POST   /api/rules              # Create new rule
GET    /api/rules/:id          # Get rule by ID
PUT    /api/rules/:id          # Update rule
DELETE /api/rules/:id          # Delete rule
POST   /api/rules/:id/run      # Execute rule
GET    /api/results            # Get execution results
GET    /api/functions           # Get available functions
GET    /api/datasources        # Get data sources
GET    /api/datasources/:id/tables  # Get tables for data source
```

## 🎯 Next Steps for Full Implementation

1. **Database Schema**: Create tables for rules, results, functions, data sources
2. **API Routes**: Implement all CRUD operations
3. **Storage Layer**: Expand storage interface for rules/results
4. **Rule Execution**: Implement expression parser and executor
5. **Data Source Integration**: Connect to actual data sources (Snowflake, SQL Server)
6. **Authentication**: Implement user authentication
7. **Real-time Updates**: Add WebSocket support for live results

## 🛠️ Development Commands

```bash
npm run dev      # Start development server (port 5000)
npm run build    # Build for production
npm run start    # Start production server
npm run check    # Type check TypeScript
npm run db:push  # Push database schema changes
```

## 📦 Dependencies

### Frontend
- React 18, TypeScript
- Vite, Tailwind CSS
- Shadcn UI, Radix UI
- TanStack Query, Wouter
- Lucide React (icons)

### Backend
- Express.js, TypeScript
- Drizzle ORM, PostgreSQL
- Cross-env (Windows compatibility)

---

**Note**: This is a well-structured project with a complete UI. The main work remaining is connecting the frontend to a real backend API and implementing the rule execution engine.

