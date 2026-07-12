# TransitOps - Project Report

## Executive Summary

**TransitOps** is a Smart Transport Operations Platform built during the **Odoo Hackathon 2026**. It digitizes vehicle, driver, dispatch, maintenance, and expense management for logistics companies that still rely on spreadsheets and manual logbooks.

The platform enforces business rules automatically, provides operational insights through dashboards and analytics, and supports role-based access control for different organizational roles.

**Duration**: 8 Hours  
**Team Size**: 2-3 Developers  
**Status**: Fully Functional

---

## 1. Problem Statement

Many logistics companies face these challenges:
- **Scheduling Conflicts**: Manual logbooks lead to double-booking vehicles and drivers
- **Underutilized Vehicles**: No visibility into fleet utilization rates
- **Missed Maintenance**: Vehicles break down due to missed service schedules
- **Expired Driver Licenses**: Compliance issues from expired documentation
- **Inaccurate Expense Tracking**: Manual fuel and expense logs are error-prone
- **Poor Operational Visibility**: No real-time dashboard for decision-making

---

## 2. Solution

TransitOps addresses these challenges with a centralized platform that provides:

| Feature | Impact |
|---------|--------|
| Vehicle Registry | Single source of truth for all fleet assets |
| Driver Management | License tracking, safety scores, compliance |
| Trip Dispatcher | Automated scheduling with business rule enforcement |
| Maintenance Tracking | Proactive maintenance with automatic status updates |
| Fuel & Expense Logs | Accurate cost tracking per vehicle |
| Analytics Dashboard | Real-time KPIs and operational insights |
| RBAC | Role-based access for different user types |

---

## 3. Technical Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS 4, shadcn/ui, Recharts
- **Backend**: Next.js Server Actions, Prisma 6 ORM
- **Database**: PostgreSQL 18
- **Auth**: NextAuth v5 (JWT + Credentials)

### Architecture Pattern
Monolithic full-stack application with server-side rendering (SSR) and server actions for mutations.

---

## 4. Features Implemented

### 4.1 Authentication & RBAC
- Secure login with email/password
- 5 user roles: Admin, Fleet Manager, Dispatcher, Safety Officer, Financial Analyst
- JWT-based sessions
- Middleware-level route protection
- Role-based sidebar navigation

### 4.2 Dashboard
- 7 KPI cards with real-time data:
  - Active Vehicles, Available Vehicles, Vehicles in Maintenance
  - Active Trips, Pending Trips, Drivers On Duty
  - Fleet Utilization (%)
- Recent Trips table with status badges
- Vehicle Status stacked bar chart
- Filter dropdowns (Vehicle Type, Status, Region)

### 4.3 Vehicle Registry
- Full CRUD operations
- Fields: Registration Number (unique), Name, Model, Type, Year, Capacity, Odometer, Cost, Status
- Status values: Available, On Trip, In Shop, Retired
- Search and filter by Type/Status
- Indian number formatting (₹4,00,000)

### 4.4 Driver Management
- Full CRUD operations
- Fields: Name, License Number (unique), Category, Expiry, Contact, Safety Score, Status
- License expiry warnings (red text for expired)
- Safety score color coding (Green ≥90, Yellow ≥75, Red <75)
- Status legend display

### 4.5 Trip Dispatcher (Critical Business Rules)
- **Create Trip**: Select vehicle, driver, cargo weight, distance
- **Dispatch**: Changes vehicle + driver status to "On Trip"
- **Complete**: Records actual distance and fuel, restores statuses
- **Cancel**: Restores vehicle + driver to "Available"
- **Live Board**: Real-time trip cards with status
- **Trip Lifecycle**: Visual step indicator (Draft → Dispatched → In Progress → Completed)
- **Cargo Validation**: Prevents dispatch if cargo exceeds vehicle capacity

### 4.6 Maintenance
- Log service records with vehicle, service type, cost
- Automatic vehicle status change to "In Shop" on creation
- Restore vehicle to "Available" on completion
- Service Log table with completion actions
- Maintenance flow diagram

### 4.7 Fuel & Expense Management
- Fuel logs: Vehicle, liters, cost, date
- Expenses: Vehicle, category (Toll/Parking/Insurance), amount
- Two-tab layout (Fuel Logs + Other Expenses)
- Total operational cost summary

### 4.8 Reports & Analytics
- KPI cards: Fuel Efficiency, Fleet Utilization, Operational Cost, On-Time Rate
- Monthly Revenue bar chart (Recharts)
- Top Costliest Vehicles horizontal bar chart
- CSV export for: Vehicles, Trips, Fuel Logs, Expenses

### 4.9 Settings
- General settings (Company name, Currency, Timezone)
- RBAC access matrix display
- Save changes functionality

---

## 5. Business Rules Enforced

| # | Rule | Implementation |
|---|------|---------------|
| 1 | Vehicle registration must be unique | Prisma `@unique` constraint + validation |
| 2 | Retired/In Shop vehicles excluded from dispatch | Vehicle dropdown filter |
| 3 | Expired license/Suspended drivers blocked | Driver dropdown filter |
| 4 | On Trip vehicle/driver not reassignable | Status check in server actions |
| 5 | Cargo weight ≤ vehicle capacity | Zod validation + error display |
| 6 | Dispatch auto-sets ON_TRIP status | Prisma transaction |
| 7 | Complete auto-restores AVAILABLE status | Prisma transaction |
| 8 | Cancel restores AVAILABLE status | Prisma transaction |
| 9 | Maintenance auto-sets IN_SHOP status | Server action |
| 10 | Close maintenance restores AVAILABLE | Server action |

---

## 6. Database Schema

### Tables: 10 (Users, Accounts, Sessions, VerificationToken, Vehicles, Drivers, Trips, MaintenanceLogs, FuelLogs, Expenses)

### Enums: 8 (UserRole, VehicleType, VehicleStatus, DriverStatus, TripStatus, MaintenanceType, MaintenanceStatus, ExpenseCategory)

### Seed Data
- 5 Users (all roles)
- 8 Vehicles (various types and statuses)
- 6 Drivers (various statuses, license expiries)
- 6 Trips (all statuses)
- 5 Maintenance Logs
- 5 Fuel Logs
- 5 Expenses

---

## 7. UI/UX Design

### Design Language
- **Theme**: Dark mode (near-black background #0F0F17)
- **Accent**: Orange/Amber (#F59E0B)
- **Typography**: Inter (sans-serif)
- **Cards**: Dark gray (#1A1A2E) with subtle borders

### Status Badge Colors
| Color | Meaning |
|-------|---------|
| Green | Available, Completed, OK |
| Blue | On Trip, In Progress |
| Purple | Dispatched |
| Red | In Shop, Suspended, Error |
| Gray | Off Duty, Retired, Pending |

### Responsive Design
- Fixed sidebar (160px) on desktop
- Scrollable main content area
- Responsive grid layouts for cards and tables

---

## 8. Testing Results

| Test Case | Result |
|-----------|--------|
| Login with valid credentials | Passed |
| Login with invalid credentials | Passed |
| Role-based access control | Passed |
| Vehicle CRUD operations | Passed |
| Driver CRUD operations | Passed |
| Trip creation with valid data | Passed |
| Trip creation exceeding cargo capacity | Passed |
| Trip dispatch status changes | Passed |
| Trip completion status restoration | Passed |
| Trip cancellation status restoration | Passed |
| Maintenance creation status change | Passed |
| Maintenance completion status restore | Passed |
| Fuel log creation | Passed |
| Expense creation | Passed |
| Reports data aggregation | Passed |
| CSV export functionality | Passed |
| Dashboard KPI accuracy | Passed |

---

## 9. Challenges Faced & Solutions

| Challenge | Solution |
|-----------|----------|
| Prisma 7 breaking changes (datasource URL) | Downgraded to Prisma 6 for compatibility |
| Edge Runtime incompatible with Prisma | Used JWT-based middleware without Prisma |
| shadcn/ui base-ui migration | Updated from `asChild` to `render` prop pattern |
| TypeScript strict mode errors | Added explicit types throughout codebase |
| Seed script not finding env vars | Added `dotenv/config` import |
| Windows path handling | Used proper escaping and PowerShell commands |

---

## 10. Future Scope

1. **PDF Export**: Generate PDF reports using jsPDF or Puppeteer
2. **Email Notifications**: License expiry reminders, trip assignments
3. **Vehicle Documents**: Upload and manage registration, insurance docs
4. **Real-time Tracking**: WebSocket-based live vehicle tracking
5. **Mobile App**: React Native companion app for drivers
6. **Multi-language**: Hindi, Marathi, Gujarati support
7. **AI Analytics**: Predictive maintenance, route optimization
8. **Integration**: GPS fleet tracking, fuel card APIs
9. **Audit Trail**: Track all changes with timestamps
10. **Multi-tenant**: Support multiple organizations

---

## 11. Conclusion

TransitOps successfully demonstrates a complete transport operations platform built in 8 hours during the Odoo Hackathon 2026. The platform:

- Enforces all 10 required business rules automatically
- Provides role-based access for 5 user types
- Includes full CRUD for vehicles, drivers, trips, maintenance, and expenses
- Offers real-time dashboard with KPIs and charts
- Supports CSV export for data analysis
- Uses a modern tech stack with type safety throughout

The application is production-ready for small to medium logistics companies and can be extended with the future enhancements listed above.

---

## 12. Team

| Name | Role | Contribution |
|------|------|-------------|
| Sarhan Khan | Developer | Full-stack development, database design, auth |
| Team Member 2 | Developer | UI components, charts, testing |
| Team Member 3 | Developer | Business rules, API development, documentation |

---

## 13. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
