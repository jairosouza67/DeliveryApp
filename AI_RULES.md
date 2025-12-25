# AI_RULES.md - Arseg Extintores App

## Tech Stack

- **React 18.3.1** - Frontend framework with TypeScript support
- **Vite** - Build tool and development server for fast hot reload
- **TypeScript** - Static type checking for better code quality
- **Tailwind CSS** - Utility-first CSS framework for styling
- **shadcn/ui** - High-quality component library built on Radix UI
- **React Router DOM** - Declarative routing for React applications
- **Supabase** - Backend-as-a-Service with authentication and database
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Performant, flexible, and extensible forms library
- **Zod** - TypeScript-first schema validation

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** when available
- **Import from "@/components/ui/[component]"** - Never import from node_modules directly
- **Custom components** should be placed in `src/components/` with descriptive names
- **Use Tailwind CSS classes** for all styling - no custom CSS files unless absolutely necessary
- **Follow the existing design system** defined in `src/index.css` with HSL color variables

### Forms & Validation
- **Use React Hook Form** for all form implementations
- **Use Zod** for schema validation with `@hookform/resolvers/zod`
- **Form components** should be reusable and follow the existing patterns
- **Always include proper error handling** and user feedback

### State Management
- **Use React Context** for global state (like cart context)
- **Use TanStack Query** for server state and data fetching
- **Local component state** should use React hooks (`useState`, `useEffect`)
- **Avoid prop drilling** - use context or composition patterns

### Routing & Navigation
- **Use React Router DOM** exclusively for routing
- **Route definitions** should be in `src/App.tsx`
- **Pages** should be placed in `src/pages/` with corresponding components
- **Use `useNavigate`** for programmatic navigation
- **Always include proper 404 handling** with a `NotFound` component

### Data & API
- **Use Supabase** for all database operations and authentication
- **Import from "@/integrations/supabase/client"** for client-side operations
- **Use TypeScript types** from `@/integrations/supabase/types`
- **Always handle loading states** and errors gracefully
- **Use proper error boundaries** for API failures

### Styling & Design
- **Use Tailwind CSS utility classes** exclusively
- **Follow the existing color system** defined in `src/index.css`
- **Use the design tokens** (shades, spacing, etc.) consistently
- **Implement responsive design** using Tailwind's responsive utilities
- **Use the existing animation classes** (`animate-fade-in`, `animate-scale-in`, etc.)

### Icons
- **Use lucide-react** for all icons
- **Import specific icons** by name (e.g., `import { Flame } from "lucide-react"`)
- **Use consistent icon sizes** (typically h-4 w-4, h-5 w-5, or h-6 w-6)

### File Organization
- **Pages** go in `src/pages/`
- **Components** go in `src/components/`
- **Hooks** go in `src/hooks/`
- **Contexts** go in `src/contexts/`
- **Utils** go in `src/lib/`
- **Types** go in `src/integrations/supabase/types.ts`
- **Assets** go in `src/assets/`

### Code Quality
- **Use TypeScript** for all new code
- **Follow ESLint rules** defined in the project
- **Use meaningful variable and function names**
- **Write JSDoc comments** for complex functions and components
- **Implement proper error handling** with try/catch blocks where appropriate

### Performance
- **Use React.memo** for expensive components that don't change often
- **Use useCallback/useMemo** for functions and values that are expensive to compute
- **Implement proper loading states** for async operations
- **Use lazy loading** for large components or pages when needed
- **Optimize bundle size** by tree-shaking unused imports

### Accessibility
- **Use semantic HTML** elements
- **Include proper ARIA labels** where needed
- **Ensure keyboard navigation** works
- **Provide proper contrast** for text and backgrounds
- **Test with screen readers** when possible
