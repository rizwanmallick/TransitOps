# TransitOps - Architecture Document

## 1. System Overview

TransitOps is a full-stack web application built for managing transport operations. It follows a modern monolithic architecture using Next.js App Router, where both frontend and backend coexist in a single deployable unit.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                  │
│  React Components + shadcn/ui + Recharts            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / Server Actions
┌──────────────────────▼──────────────────────────────┐
│                  NEXT.JS APP                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │   Pages     │  │   Actions   │  │   Auth     │  │
│  │  (SSR/RSC)  │  │ (Mutations) │  │ (NextAuth) │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Middleware  │  │  Validations│  │  Utils     │  │
│  │  (RBAC)     │  │  (Zod)      │  │  (Shared)  │  │
│  └─────────────┘  └─────────────┘  └────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ Prisma Client
┌──────────────────────▼──────────────────────────────┐
│              PRISMA ORM (Type-Safe)                  │
│  Schema → Migrations → Query Builder                 │
└──────────────────────┬──────────────────────────────┘
                       │ TCP/IP (port 5432)
┌──────────────────────▼──────────────────────────────┐
│              PostgreSQL DATABASE                     │
│  10 tables: Users, Vehicles, Drivers, Trips,        │
│  MaintenanceLogs, FuelLogs, Expenses, etc.          │
└─────────────────────────────────────────────────────┘
```

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js | Server-side JavaScript execution |
| Framework | Next.js 16 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety across the codebase |
| Database | PostgreSQL 18 | Relational data storage |
| ORM | Prisma 6 | Type-safe database access |
| Auth | NextAuth v5 | Authentication & session management |
| UI Library | shadcn/ui | Pre-built accessible components |
| Styling | Tailwind CSS 4 | Utility-first CSS framework |
| Charts | Recharts | Data visualization |
| Tables | TanStack React Table | Feature-rich data tables |
| Forms | React Hook Form + Zod | Form handling & validation |

## 3. Directory Structure

```
TransitOps/
├── prisma/
│   └── schema.prisma              # Database schema (7 models, 8 enums)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Authentication route group
│   │   │   ├── _components/       # Login form component
│   │   │   └── login/page.tsx     # Login page
│   │   ├── (dashboard)/           # Dashboard route group (protected)
│   │   │   ├── layout.tsx         # Sidebar + header layout
│   │   │   ├── dashboard/         # KPIs & overview
│   │   │   ├── fleet/             # Vehicle registry
│   │   │   ├── drivers/           # Driver management
│   │   │   ├── trips/             # Trip dispatcher
│   │   │   ├── maintenance/       # Service records
│   │   │   ├── fuel-expenses/     # Fuel & expense tracking
│   │   │   ├── reports/           # Analytics & CSV export
│   │   │   └── settings/          # RBAC & config
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ # NextAuth API routes
│   │   │   └── seed/route.ts      # Database seed endpoint
│   │   ├── layout.tsx             # Root layout (dark theme)
│   │   ├── page.tsx               # Root redirect
│   │   └── globals.css            # Tailwind + custom theme
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (16)
│   │   ├── layout/                # Sidebar, header, KPI card
│   │   ├── shared/                # Status badge, etc.
│   │   └── providers.tsx          # SessionProvider wrapper
│   ├── lib/
│   │   ├── auth.ts                # NextAuth v5 configuration
│   │   ├── auth-utils.ts          # requireAuth(), requireRole()
│   │   ├── db.ts                  # Prisma singleton
│   │   ├── utils.ts               # cn(), helpers
│   │   └── validations/           # Zod schemas (5 files)
│   ├── types/
│   │   └── next-auth.d.ts         # NextAuth type augmentation
│   ├── auth.ts                    # Auth barrel export
│   ├── middleware.ts              # RBAC route protection
│   └── seed.ts                    # Database seeder
├── .env.example                   # Environment variable template
├── .gitignore
├── LICENSE                        # MIT License
├── README.md                      # Project documentation
└── docs/                          # Extended documentation
    ├── architecture.md
    ├── report.md
    ├── database-schema.md
    ├── api-reference.md
    ├── deployment.md
    └── contributing.md
```

## 4. Authentication & Authorization

### Flow

```
User Login → NextAuth Credentials Provider → JWT Token → Middleware Check → Page Access
```

### Implementation

1. **NextAuth v5** configured with Credentials Provider
2. Passwords hashed with **bcryptjs** (10 rounds)
3. JWT strategy (no database sessions)
4. Role stored in JWT token payload
5. **Middleware** intercepts every request to check:
   - Is the user authenticated?
   - Does the user have the required role for this route?

### Role Hierarchy

```
ADMIN (full access)
  ├── FLEET_MANAGER → Fleet, Drivers, Trips, Maintenance, Fuel, Reports
  ├── DISPATCHER → Drivers, Trips
  ├── SAFETY_OFFICER → Drivers, Trips
  └── FINANCIAL_ANALYST → Fuel & Expenses, Reports
```

## 5. Data Flow Patterns

### Server Components (Reads)
```
Page Request → requireAuth() → Prisma Query → Render HTML → Response
```
- No API layer needed for data fetching
- Direct database access in Server Components
- Automatic caching by Next.js

### Server Actions (Mutations)
```
Form Submit → Server Action → Validate (Zod) → Business Rules → Prisma Write → revalidatePath() → UI Update
```
- Type-safe end-to-end
- Automatic form validation
- Path revalidation triggers UI refresh

### Business Rules Enforcement
```
Create/Dispatch Trip → Validate:
  1. Vehicle exists & status = AVAILABLE
  2. Driver exists & status = AVAILABLE & license valid
  3. Cargo weight ≤ vehicle max capacity
  4. If all pass → Prisma $transaction([updateTrip, updateVehicle, updateDriver])
```

## 6. Database Design

### Entity Relationship Diagram

```
User (1) ──── (N) Account
User (1) ──── (N) Session

Vehicle (1) ──── (N) Trip
Vehicle (1) ──── (N) MaintenanceLog
Vehicle (1) ──── (N) FuelLog
Vehicle (1) ──── (N) Expense

Driver (1) ──── (N) Trip

Trip (1) ──── (N) FuelLog
Trip (1) ──── (N) Expense
```

### Key Design Decisions
- **UUIDs (cuid)** for all primary keys - globally unique, URL-safe
- **Enums** for status fields - database-level constraint
- **Optional relations** for vehicle/driver on Trip - allows Draft trips
- **Timestamps** on all models - createdAt, updatedAt

## 7. UI Architecture

### Component Hierarchy
```
RootLayout (SessionProvider + Toaster)
  └── DashboardLayout (Providers + Sidebar + Header)
        ├── Sidebar (navigation, role-based menu items)
        ├── Header (search + user avatar)
        └── Main Content (page-specific)
              ├── KpiCard (reusable stat card)
              ├── StatusBadge (colored status indicator)
              ├── DataTable (TanStack + shadcn Table)
              ├── Dialog (create/edit forms)
              └── Charts (Recharts)
```

### Design System
- **Dark theme** as default (near-black backgrounds)
- **Orange/Amber** accent (#F59E0B) for buttons, active states
- **Status badges**: Green=Available, Blue=On Trip, Purple=Dispatched, Red=Error, Gray=Inactive
- **Indian locale**: INR currency, Indian number formatting (4,00,000)

## 8. Security Considerations

| Concern | Implementation |
|---------|---------------|
| Password storage | bcryptjs hash (10 rounds) |
| Session management | JWT tokens (httpOnly cookies) |
| Route protection | Middleware RBAC check |
| Input validation | Zod schemas on all forms |
| SQL injection | Prisma parameterized queries |
| XSS | React auto-escaping + CSP headers |
| CSRF | NextAuth built-in CSRF protection |
| Environment vars | `.env` gitignored, never committed |

## 9. Performance Optimizations

- **Server Components**: No client-side JS for data fetching
- **Prisma Singleton**: Prevents connection exhaustion in dev
- **Static Pages**: Login, root redirect pre-rendered
- **Dynamic Pages**: Dashboard, fleet, etc. server-rendered on demand
- **Lazy Loading**: Client components only loaded when needed
- **Image Optimization**: Next.js built-in (not yet implemented)

## 10. Scalability Considerations

| Aspect | Current | Production Upgrade |
|--------|---------|-------------------|
| Database | Single PostgreSQL | Connection pooling (PgBouncer) |
| Auth | JWT (stateless) | Database sessions for revocation |
| Caching | None | Redis for session/query cache |
| Deployment | Single server | Vercel/Cloud Run + managed DB |
| File Storage | None | S3 for vehicle documents |
| Email | None | SendGrid for license expiry reminders |

## 11. Testing Strategy

| Type | Tool | Status |
|------|------|--------|
| Type Checking | TypeScript | Implemented |
| Linting | ESLint | Configured |
| Unit Tests | Jest | Not implemented |
| Integration Tests | Playwright | Not implemented |
| E2E Tests | Cypress | Not implemented |

## 12. Future Enhancements

1. PDF export for reports
2. Email reminders for expiring licenses
3. Vehicle document management (upload/view)
4. Dark/light mode toggle
5. Real-time trip tracking (WebSocket)
6. Multi-language support (i18n)
7. Mobile responsive design
8. API rate limiting
9. Audit logging
10. Dashboard widgets customization
