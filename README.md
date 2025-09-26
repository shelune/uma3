# Uma3 Monorepo

A TypeScript monorepo with backend and frontend workspaces for Uma Musume breeding tree application.

## Structure

```
uma3/
├── package.json                 # Root workspace configuration
├── tsconfig.json               # Base TypeScript config
├── tsconfig.backend.json       # Backend-specific TypeScript config
├── tsconfig.frontend.json      # Frontend-specific TypeScript config
├── eslint.config.js            # Shared ESLint configuration
├── backend/
│   ├── package.json            # Backend workspace package.json
│   ├── tsconfig.json           # Backend TypeScript config (extends root)
│   └── eslint.config.mjs       # Backend ESLint config (extends root)
└── frontend/
    ├── package.json            # Frontend workspace package.json
    ├── tsconfig.json           # Frontend TypeScript config (extends root)
    └── eslint.config.js        # Frontend ESLint config (extends root)
```

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install dependencies for all workspaces.

2. **Development:**

   ```bash
   # Run both backend and frontend in development mode
   npm run dev

   # Or run them separately:
   npm run dev:backend
   npm run dev:frontend
   ```

3. **Building:**

   ```bash
   # Build all workspaces
   npm run build

   # Or build separately:
   npm run build:backend
   npm run build:frontend
   ```

4. **Linting:**
   ```bash
   # Lint all workspaces
   npm run lint
   ```

## Configuration

### TypeScript

- **Root:** Base configuration shared by all workspaces
- **Backend:** Node.js CommonJS configuration extending root
- **Frontend:** React/Vite ESM configuration extending root
- **Workspaces:** Each workspace extends the appropriate root config

### ESLint

- **Root:** Base ESLint configuration with TypeScript support
- **Backend:** Extends root with Node.js globals and relaxed rules
- **Frontend:** Extends root with React-specific rules and browser globals

### Dependencies

- **Shared:** Common dependencies like `@types/node`, `typescript`, `eslint` are in the root
- **Workspace-specific:** Each workspace only includes its unique dependencies

## Workspace Commands

You can run commands in specific workspaces:

```bash
# Backend specific
npm run dev --workspace=backend
npm run build --workspace=backend

# Frontend specific
npm run dev --workspace=frontend
npm run build --workspace=frontend
```

## Benefits

1. **Shared Configuration:** Common TypeScript and ESLint configs prevent duplication
2. **Dependency Management:** Shared dependencies are hoisted to root, reducing duplication
3. **Type Safety:** Each workspace uses appropriate TypeScript configuration
4. **Development Experience:** Run both services with a single command
5. **Build Optimization:** Workspace-aware builds and linting
