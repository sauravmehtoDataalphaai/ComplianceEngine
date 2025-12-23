# Rule-Craft

A Financial Compliance Rules Engine - Full-stack application for building, managing, and executing compliance rules.

## 📁 Project Structure

```
Rule-Craft/
├── client/                    # React Frontend Application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Rules.tsx
│   │   │   ├── RuleBuilder.tsx
│   │   │   ├── Results.tsx
│   │   │   └── FunctionsPage.tsx
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   └── ...         # Custom components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configs
│   │   └── App.tsx          # Main app component
│   ├── index.html           # HTML entry point
│   └── public/              # Static assets
│
├── server/                    # Express Backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route handlers
│   ├── db.ts                # Database connection
│   ├── storage.ts           # Data storage interface
│   ├── vite.ts              # Vite dev server setup
│   └── static.ts            # Static file serving
│
├── shared/                    # Shared code
│   └── schema.ts           # Database schemas & types
│
├── script/                    # Build scripts
│   └── build.ts            # Production build script
│
└── Configuration Files
    ├── package.json        # Dependencies & scripts
    ├── vite.config.ts      # Vite configuration
    ├── tsconfig.json       # TypeScript config
    ├── tailwind.config.ts  # Tailwind CSS config
    └── drizzle.config.ts   # Database config
```

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Shadcn UI (component library)
- Tailwind CSS (styling)
- TanStack Query (data fetching)
- Wouter (routing)

**Backend:**
- Express.js + TypeScript
- PostgreSQL with Drizzle ORM
- In-memory storage (development)

## Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript code
- `npm run db:push` - Push database schema changes

## Features

- **Dashboard** - Overview of compliance metrics and rule execution results
- **Rule Builder** - Create and edit compliance rules with expression editor
- **Rules Management** - View and manage all compliance rules
- **Results** - View rule execution results with status tracking
- **Functions Library** - Browse available functions for rule expressions

## Environment Variables

- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - PostgreSQL connection string (optional in development)
- `NODE_ENV` - Environment mode (development/production)

## License

MIT

