# TransitOps - API Reference

TransitOps uses **Next.js Server Actions** for all data mutations and **Server Components** for data fetching. There are no traditional REST API endpoints (except Auth and Seed).

---

## Authentication API

### POST `/api/auth/[...nextauth]`
NextAuth.js handles authentication internally.

**Sign In**: Use `signIn()` from `next-auth/react`
**Sign Out**: Use `signOut()` from `next-auth/react`
**Get Session**: Use `useSession()` hook or `auth()` server-side

---

## Database Seed API

### POST `/api/seed`

Triggers a full database seed with demo data.

**Response**:
```json
{
  "message": "Database seeded successfully!"
}
```

**Errors**:
```json
{
  "error": "Failed to seed database"
}
```

---

## Server Actions

All server actions are defined in `actions.ts` files within each feature folder.

### Fleet Actions (`/fleet/actions.ts`)

#### `createVehicle(data: VehicleInput)`
Creates a new vehicle.

**Parameters**:
```typescript
{
  registrationNumber: string;  // Unique, max 20 chars
  name: string;                // Vehicle name, max 50 chars
  model: string;               // Model name, max 50 chars
  type: "TRUCK" | "VAN" | "BUS" | "MOTORCYCLE" | "CONTAINER";
  yearOfManufacture: number;   // 2000-2030
  maxLoadCapacity: number;     // kg, > 0
  odometer: number;            // km, >= 0
  acquisitionCost: number;     // INR, >= 0
  status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
}
```

**Returns**: `{ success: boolean; error?: string }`

---

#### `updateVehicle(id: string, data: VehicleInput)`
Updates an existing vehicle.

---

#### `deleteVehicle(id: string)`
Deletes a vehicle. Requires vehicle to have no active trips.

---

### Driver Actions (`/drivers/actions.ts`)

#### `createDriver(data: DriverInput)`
Creates a new driver.

**Parameters**:
```typescript
{
  name: string;
  licenseNumber: string;       // Unique
  licenseCategory: string;     // LMV, HMV, etc.
  licenseExpiry: string;       // ISO date string
  contactNumber: string;
  safetyScore: number;         // 0-100
  status: "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";
}
```

---

### Trip Actions (`/trips/actions.ts`)

#### `createTrip(data: TripInput)`
Creates a new trip with validation.

**Validations**:
- Vehicle must exist and be AVAILABLE
- Driver must exist and be AVAILABLE with valid license
- Cargo weight must not exceed vehicle capacity

**Parameters**:
```typescript
{
  source: string;
  destination: string;
  cargoWeight: number;         // Must be <= vehicle.maxLoadCapacity
  plannedDistance: number;     // km, > 0
  vehicleId: string;           // Must be AVAILABLE vehicle
  driverId: string;            // Must be AVAILABLE driver
}
```

---

#### `dispatchTrip(tripId: string)`
Dispatches a draft trip. Changes vehicle and driver status to ON_TRIP.

**Business Rules**:
- Trip must be in DRAFT status
- Vehicle and driver must be assigned
- Uses Prisma transaction for atomicity

---

#### `completeTrip(tripId: string, data: CompleteTripInput)`
Completes a dispatched trip.

**Parameters**:
```typescript
{
  actualDistance: number;      // km, >= 0
  fuelConsumed: number;       // liters, >= 0
}
```

**Effects**:
- Trip status → COMPLETED
- Vehicle status → AVAILABLE
- Driver status → AVAILABLE

---

#### `cancelTrip(tripId: string)`
Cancels a trip.

**Effects** (if trip was DISPATCHED or IN_PROGRESS):
- Trip status → CANCELLED
- Vehicle status → AVAILABLE
- Driver status → AVAILABLE

---

### Maintenance Actions (`/maintenance/actions.ts`)

#### `createMaintenance(data: MaintenanceInput)`
Creates a maintenance record and sets vehicle status to IN_SHOP.

**Parameters**:
```typescript
{
  vehicleId: string;
  serviceType: "OIL_CHANGE" | "TIRE_ROTATION" | "ENGINE_REPAIR" | "BRAKE_SERVICE" | "INSPECTION" | "OTHER";
  description?: string;
  mileage?: number;
  cost: number;                // INR, >= 0
}
```

---

#### `completeMaintenance(id: string)`
Completes a maintenance record and restores vehicle to AVAILABLE.

---

### Fuel & Expense Actions (`/fuel-expenses/actions.ts`)

#### `createFuelLog(data: FuelLogInput)`
Creates a fuel log entry.

**Parameters**:
```typescript
{
  vehicleId: string;
  tripId?: string;
  liters: number;              // > 0
  cost: number;                // INR, >= 0
  date: string;                // ISO date string
}
```

---

#### `createExpense(data: ExpenseInput)`
Creates an expense entry.

**Parameters**:
```typescript
{
  vehicleId: string;
  tripId?: string;
  category: "FUEL" | "TOLL" | "MAINTENANCE" | "INSURANCE" | "PARKING" | "OTHER";
  description?: string;
  amount: number;              // INR, >= 0
  date: string;                // ISO date string
}
```

---

### Reports Actions (`/reports/actions.ts`)

#### `getReportsData()`
Returns aggregated data for the reports page.

**Returns**:
```typescript
{
  fleetUtilization: number;         // Percentage
  avgFuelEfficiency: string;        // km/L
  operationalCost: number;          // Total INR
  onTimeRate: string;               // Percentage
  monthlyRevenue: { month: string; revenue: number }[];
  topCostlyVehicles: { name: string; cost: number }[];
  driverSafetyData: { name: string; score: number; status: string }[];
  tripStatusData: { name: string; value: number }[];
  fuelEfficiencyTrend: { month: string; efficiency: number }[];
  maintenanceCostData: { name: string; value: number }[];
  fleetAgeData: { name: string; count: number }[];
  expenseBreakdownData: { name: string; value: number }[];
  monthlyFuelCostTrend: { month: string; cost: number }[];
}
```

---

#### `exportCSV(type: string)`
Generates CSV data for export.

**Types**: `"vehicles" | "trips" | "fuel" | "expenses"`

**Returns**: `{ csv: string; filename: string }`

---

## Error Handling

All server actions follow this pattern:

```typescript
try {
  // Business logic
  return { success: true };
} catch (error) {
  if (error.code === "P2002") {
    return { success: false, error: "Duplicate entry" };
  }
  return { success: false, error: "Operation failed" };
}
```

---

## Client-Side Data Fetching

Server Components fetch data directly using Prisma:

```typescript
// Example: Fleet page
export default async function FleetPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <FleetDataTable data={vehicles} />;
}
```

---

## Animation System

The application uses Framer Motion for animations:

### Shared Variants (`src/lib/animations.ts`)
- `fadeIn`, `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`
- `scaleIn`, `slideInFromLeft`, `slideInFromRight`
- `staggerContainer`, `staggerItem`
- `cardHover`, `pulse`, `shimmer`, `springPop`

### Animated Wrappers (`src/components/shared/animated.tsx`)
- `PageTransition` - Fade in wrapper
- `FadeInUp` - Slide up animation
- `StaggerList` - Container with staggered children
- `StaggerItem` - Individual staggered item
- `HoverCard` - Card with hover/tap effects

### Page Transitions (`src/components/layout/page-transition.tsx`)
- Route-level AnimatePresence for smooth page changes

---

## Validation Schemas

All form inputs are validated using Zod schemas:

```typescript
// Example: Vehicle validation
export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(20),
  name: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  type: z.enum(["TRUCK", "VAN", "BUS", "MOTORCYCLE", "CONTAINER"]),
  yearOfManufacture: z.number().min(2000).max(2030),
  maxLoadCapacity: z.number().min(1),
  odometer: z.number().min(0),
  acquisitionCost: z.number().min(0),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]),
});
```
