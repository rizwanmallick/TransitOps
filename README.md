# TransitOps - Smart Transport Operations Platform

An end-to-end transport operations platform built for the **Odoo Hackathon 2026**. Digitizes vehicle, driver, dispatch, maintenance, and expense management with role-based access control.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma 6 ORM |
| Auth | NextAuth v5 (JWT + Credentials) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Tables | TanStack React Table |

## Features

- **Authentication** - Login with email/password, Role-Based Access Control (5 roles)
- **Dashboard** - 7 KPI cards, Recent Trips, Vehicle Status chart, filters
- **Vehicle Registry** - Full CRUD, status badges, search/filter, Indian number formatting
- **Driver Management** - CRUD, safety scores, license expiry warnings
- **Trip Dispatcher** - Create/Dispatch/Complete/Cancel with all business rules enforced
- **Maintenance** - Service records, automatic vehicle status transitions
- **Fuel & Expense Tracking** - Fuel logs, other expenses, total operational cost
- **Reports & Analytics** - Charts, KPIs, CSV export
- **Settings** - RBAC matrix, general config

## Prerequisites

Before running this project, make sure you have these installed:

### 1. Node.js (v18 or higher)
Download from: https://nodejs.org

Verify installation:
```cmd
node --version
npm --version
```

### 2. PostgreSQL (v14 or higher)
Download from: https://www.postgresql.org/download/windows/

**During installation:**
- Remember the password you set for the `postgres` user
- Keep the default port `5432`
- Select "Stack Builder" installation

Verify PostgreSQL is running:
```cmd
pg_isready -h localhost -p 5432
```

### 3. Git
Download from: https://git-scm.com/download/win

## Setup Instructions

### Step 1: Clone the Repository
```cmd
git clone https://github.com/rizwanmallick/TransitOps.git
cd TransitOps
```

### Step 2: Install Dependencies
```cmd
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/transitops?schema=public"
AUTH_SECRET="transitops-hackathon-secret-2026"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
```

> Replace `YOUR_PASSWORD` with the password you set during PostgreSQL installation.

### Step 4: Create Database
```cmd
npx prisma db push
```

### Step 5: Seed Demo Data
```cmd
npx tsx --tsconfig tsconfig.json src/seed.ts
```

### Step 6: Start the Dev Server
```cmd
npm run dev
```

Open **http://localhost:3000** in your browser.

## Login Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@transitops.com` | `admin123` | Admin (full access) |
| `fleet@transitops.com` | `fleet123` | Fleet Manager |
| `dispatcher@transitops.com` | `dispatch123` | Dispatcher |
| `safety@transitops.com` | `safety123` | Safety Officer |
| `finance@transitops.com` | `finance123` | Financial Analyst |

## Role-Based Access

| Role | Accessible Pages |
|------|-----------------|
| Admin | All pages |
| Fleet Manager | Dashboard, Fleet, Drivers, Trips, Maintenance, Fuel & Expenses, Reports |
| Dispatcher | Dashboard, Drivers, Trips |
| Safety Officer | Dashboard, Drivers, Trips |
| Financial Analyst | Dashboard, Fuel & Expenses, Reports |

## Testing the Business Rules

### Rule 1: Vehicle Registration is Unique
1. Go to Fleet page
2. Click "Add Vehicle"
3. Enter a registration number that already exists
4. **Expected**: Error message shown

### Rule 2: Retired/In Shop Vehicles Not in Dispatch
1. Go to Trips page, create a trip
2. Check vehicle dropdown
3. **Expected**: Only "Available" vehicles appear (not "In Shop" or "Retired")

### Rule 3: Expired License / Suspended Drivers Blocked
1. Go to Trips page, create a trip
2. Check driver dropdown
3. **Expected**: Only available drivers with valid licenses appear

### Rule 4: Cargo Weight Cannot Exceed Capacity
1. Go to Trips page
2. Select a vehicle (note its max capacity)
3. Enter cargo weight higher than capacity
4. **Expected**: Yellow warning box: "Weight Exceeded by X kg -- Dispatch blocked!"

### Rule 5: Dispatch Auto-Changes Status
1. Create a trip with valid data
2. Click "Dispatch" on the Live Board
3. **Expected**: Vehicle and driver status changes to "On Trip"

### Rule 6: Complete Restores Status
1. On an active trip, click "Complete"
2. Enter actual distance and fuel consumed
3. **Expected**: Vehicle and driver return to "Available"

### Rule 7: Cancel Restores Status
1. On a dispatched trip, click "Cancel"
2. **Expected**: Vehicle and driver return to "Available"

### Rule 8: Maintenance Changes Vehicle Status
1. Go to Maintenance page
2. Log a service record for a vehicle
3. **Expected**: Vehicle status changes to "In Shop"
4. Go to Fleet page - vehicle shows "In Shop" status
5. Return to Maintenance, click "Complete"
6. **Expected**: Vehicle returns to "Available"

## Useful Commands

```cmd
:: Start dev server
npm run dev

:: Re-seed database (fresh demo data)
npx tsx --tsconfig tsconfig.json src/seed.ts

:: Reset database completely
npx prisma db push --force-reset
npx tsx --tsconfig tsconfig.json src/seed.ts

:: Open Prisma Studio (visual database browser)
npx prisma studio

:: Build for production
npm run build

:: Run production server
npm run start
```

## Project Structure

```
TransitOps/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login page
│   │   ├── (dashboard)/        # All main pages
│   │   │   ├── dashboard/      # KPIs + charts
│   │   │   ├── fleet/          # Vehicle registry
│   │   │   ├── drivers/        # Driver management
│   │   │   ├── trips/          # Trip dispatcher
│   │   │   ├── maintenance/    # Service records
│   │   │   ├── fuel-expenses/  # Fuel + expenses
│   │   │   ├── reports/        # Analytics + CSV export
│   │   │   └── settings/       # RBAC + config
│   │   └── api/
│   │       ├── auth/           # NextAuth routes
│   │       └── seed/           # Database seed API
│   ├── components/             # Shared UI components
│   ├── lib/                    # Auth, DB, validations
│   └── generated/prisma/       # Prisma client (auto-generated)
├── .env                        # Environment variables
└── package.json
```

## Troubleshooting

### "Module not found" errors
```cmd
npm install
```

### Database connection refused
- Make sure PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check your `.env` file has correct password

### Port 3000 already in use
```cmd
:: Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Seed script fails
Make sure you have `.env` file with correct `DATABASE_URL`, then:
```cmd
npx tsx --tsconfig tsconfig.json src/seed.ts
```

## License

Built for Odoo Hackathon 2026.
