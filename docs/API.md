# TransitOps API Documentation

## Overview

TransitOps provides a set of server actions and API endpoints for managing fleet operations, including vehicles, drivers, trips, maintenance, fuel logs, and expenses.

## Authentication

All server actions require authentication. The following auth utilities are available:

- `requireAuth()` - Requires user to be authenticated
- `requireRole(...roles)` - Requires user to have specific role(s)
- `requireRouteAccess(route)` - Checks if user's role can access specific route

## Roles

The system supports the following roles (defined in `src/lib/rbac.ts`):

- `ADMIN` - Full system access
- `FLEET_MANAGER` - Fleet management operations
- `DISPATCHER` - Trip dispatching and management
- `SAFETY_OFFICER` - Driver management and safety
- `FINANCIAL_ANALYST` - Financial reports and expenses

## Server Actions

### Vehicle Actions (`src/app/(dashboard)/fleet/actions.ts`)

#### `createVehicle(data: VehicleInput)`
- **Description:** Creates a new vehicle
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:**
  - `registrationNumber` (string) - Unique vehicle registration
  - `name` (string) - Vehicle name
  - `model` (string) - Vehicle model
  - `type` (enum) - TRUCK, VAN, BUS, MOTORCYCLE, CONTAINER
  - `yearOfManufacture` (number) - Manufacturing year
  - `maxLoadCapacity` (number) - Maximum load in kg
  - `odometer` (number) - Current odometer reading
  - `acquisitionCost` (number) - Purchase cost
  - `status` (enum) - AVAILABLE, ON_TRIP, IN_SHOP, RETIRED
- **Returns:** `{ success: boolean, error?: string, vehicle?: Vehicle }`

#### `updateVehicle(id: string, data: VehicleInput)`
- **Description:** Updates an existing vehicle
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:** Same as createVehicle, plus `id`
- **Returns:** `{ success: boolean, error?: string, vehicle?: Vehicle }`

#### `deleteVehicle(id: string)`
- **Description:** Deletes a vehicle (only if no active trips)
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:** `id` (string) - Vehicle ID
- **Returns:** `{ success: boolean, error?: string }`

### Driver Actions (`src/app/(dashboard)/drivers/actions.ts`)

#### `createDriver(data: DriverInput)`
- **Description:** Creates a new driver
- **Required Roles:** ADMIN, FLEET_MANAGER, SAFETY_OFFICER
- **Parameters:**
  - `name` (string) - Driver name
  - `licenseNumber` (string) - Unique license number
  - `licenseCategory` (string) - License category
  - `licenseExpiry` (string) - License expiry date (must be future)
  - `contactNumber` (string) - Contact number
  - `safetyScore` (number) - Safety score (0-100)
  - `status` (enum) - AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED
- **Returns:** `{ success: boolean, error?: string, driver?: Driver }`

#### `updateDriver(id: string, data: DriverInput)`
- **Description:** Updates an existing driver
- **Required Roles:** ADMIN, FLEET_MANAGER, SAFETY_OFFICER
- **Parameters:** Same as createDriver, plus `id`
- **Returns:** `{ success: boolean, error?: string, driver?: Driver }`

#### `deleteDriver(id: string)`
- **Description:** Deletes a driver (only if no active trips)
- **Required Roles:** ADMIN, FLEET_MANAGER, SAFETY_OFFICER
- **Parameters:** `id` (string) - Driver ID
- **Returns:** `{ success: boolean, error?: string }`

### Trip Actions (`src/app/(dashboard)/trips/actions.ts`)

#### `createTrip(data: TripInput)`
- **Description:** Creates a new trip (draft status)
- **Required Roles:** ADMIN, FLEET_MANAGER, DISPATCHER
- **Parameters:**
  - `source` (string) - Origin location
  - `destination` (string) - Destination location
  - `cargoWeight` (number) - Cargo weight in kg
  - `plannedDistance` (number) - Planned distance in km
  - `vehicleId` (string) - Vehicle ID (must be available)
  - `driverId` (string) - Driver ID (must be available)
- **Returns:** `{ success: boolean, error?: string, trip?: Trip }`

#### `dispatchTrip(id: string)`
- **Description:** Dispatches a trip (changes status to ON_TRIP)
- **Required Roles:** ADMIN, FLEET_MANAGER, DISPATCHER
- **Parameters:** `id` (string) - Trip ID
- **Returns:** `{ success: boolean, error?: string, trip?: Trip }`

#### `completeTrip(id: string, data: CompleteTripInput)`
- **Description:** Completes a trip
- **Required Roles:** ADMIN, FLEET_MANAGER, DISPATCHER
- **Parameters:**
  - `id` (string) - Trip ID
  - `actualDistance` (number) - Actual distance traveled
  - `fuelConsumed` (number) - Fuel consumed in liters
- **Returns:** `{ success: boolean, error?: string, trip?: Trip }`

#### `cancelTrip(id: string)`
- **Description:** Cancels a trip
- **Required Roles:** ADMIN, FLEET_MANAGER, DISPATCHER
- **Parameters:** `id` (string) - Trip ID
- **Returns:** `{ success: boolean, error?: string, trip?: Trip }`

### Maintenance Actions (`src/app/(dashboard)/maintenance/actions.ts`)

#### `createMaintenance(data: MaintenanceInput)`
- **Description:** Creates a new maintenance log
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:**
  - `vehicleId` (string) - Vehicle ID
  - `serviceType` (enum) - OIL_CHANGE, TIRE_ROTATION, ENGINE_REPAIR, BRAKE_SERVICE, INSPECTION, OTHER
  - `description` (string, optional) - Description of service
  - `mileage` (number, optional) - Vehicle mileage at service
  - `cost` (number) - Service cost
- **Returns:** `{ success: boolean, error?: string, maintenance?: MaintenanceLog }`

#### `completeMaintenance(id: string)`
- **Description:** Completes maintenance and updates vehicle/driver status
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:** `id` (string) - Maintenance log ID
- **Returns:** `{ success: boolean, error?: string, maintenance?: MaintenanceLog }`

### Fuel & Expense Actions (`src/app/(dashboard)/fuel-expenses/actions.ts`)

#### `createFuelLog(data: FuelLogInput)`
- **Description:** Creates a new fuel log entry
- **Required Roles:** ADMIN, FLEET_MANAGER, FINANCIAL_ANALYST
- **Parameters:**
  - `vehicleId` (string) - Vehicle ID
  - `tripId` (string, optional) - Associated trip ID
  - `liters` (number) - Fuel quantity in liters
  - `cost` (number) - Fuel cost
  - `date` (string) - Date of fueling
- **Returns:** `{ success: boolean, error?: string, fuelLog?: FuelLog }`

#### `deleteFuelLog(id: string)`
- **Description:** Deletes a fuel log entry
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:** `id` (string) - Fuel log ID
- **Returns:** `{ success: boolean, error?: string }`

#### `createExpense(data: ExpenseInput)`
- **Description:** Creates a new expense entry
- **Required Roles:** ADMIN, FLEET_MANAGER, FINANCIAL_ANALYST
- **Parameters:**
  - `vehicleId` (string) - Vehicle ID
  - `tripId` (string, optional) - Associated trip ID
  - `category` (enum) - FUEL, TOLL, MAINTENANCE, INSURANCE, PARKING, OTHER
  - `description` (string, optional) - Expense description
  - `amount` (number) - Expense amount
  - `date` (string) - Date of expense
- **Returns:** `{ success: boolean, error?: string, expense?: Expense }`

#### `deleteExpense(id: string)`
- **Description:** Deletes an expense entry
- **Required Roles:** ADMIN, FLEET_MANAGER
- **Parameters:** `id` (string) - Expense ID
- **Returns:** `{ success: boolean, error?: string }`

### Reports Actions (`src/app/(dashboard)/reports/actions.ts`)

#### `getReportsData()`
- **Description:** Retrieves comprehensive reports data
- **Required Roles:** All authenticated users
- **Returns:** Object containing:
  - `fleetUtilization` (number) - Percentage of vehicles on trip
  - `avgFuelEfficiency` (string) - Average km/L
  - `operationalCost` (number) - Total operational cost
  - `onTimeRate` (string) - Percentage of on-time trips
  - `monthlyRevenue` (array) - Monthly revenue breakdown
  - `topCostlyVehicles` (array) - Top 5 costly vehicles
  - `driverSafetyData` (array) - Driver safety scores
  - `tripStatusData` (array) - Trip status distribution
  - `fuelEfficiencyTrend` (array) - Monthly fuel efficiency
  - `maintenanceCostData` (array) - Maintenance cost by type
  - `fleetAgeData` (array) - Fleet age distribution
  - `expenseBreakdownData` (array) - Expense by category
  - `monthlyFuelCostTrend` (array) - Monthly fuel costs

#### `exportCSV(type: string)`
- **Description:** Exports data to CSV format
- **Required Roles:** All authenticated users
- **Parameters:** `type` (string) - Export type: "vehicles", "drivers", "trips", "fuel", "expenses"
- **Returns:** CSV file download

## API Endpoints

### Authentication (`src/app/api/auth/[...nextauth]/route.ts`)

**NextAuth.js endpoint** - Handles all authentication flows including login, logout, and session management.

### Seed Database (`src/app/api/seed/route.ts`)

**POST /api/seed**
- **Description:** Seeds the database with sample data
- **Required Roles:** ADMIN only
- **Returns:** `{ success: boolean, message: string }`

## Validation Schemas

All input data is validated using Zod schemas located in `src/lib/validations/`:

- `vehicle.ts` - Vehicle form validation
- `driver.ts` - Driver form validation
- `trip.ts` - Trip form validation
- `maintenance.ts` - Maintenance, fuel log, and expense validation

## Error Handling

All server actions return a consistent error response format:

```typescript
{
  success: boolean,
  error?: string  // Error message if success is false
}
```

Common error responses:
- Validation errors return specific field validation messages
- Permission errors return "You don't have permission to perform this action"
- Not found errors return "Resource not found"
- Business logic errors return descriptive messages (e.g., "Vehicle has active trips")

## Environment Variables

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret key
- `AVG_RATE_PER_KM` - Average rate per km for revenue calculations (default: 15)

## RBAC Configuration

Role-based access control is centralized in `src/lib/rbac.ts`:

- `ROUTE_ACCESS` - Defines which roles can access which routes
- `ACTION_PERMISSIONS` - Defines which roles can perform which actions
- Helper functions: `canAccessRoute()`, `canPerformAction()`, `hasAnyRole()`

## Usage Examples

### Creating a Vehicle

```typescript
import { createVehicle } from '@/app/(dashboard)/fleet/actions';

const result = await createVehicle({
  registrationNumber: "KA-01-AB-1234",
  name: "Truck 1",
  model: "Tata Prima",
  type: "TRUCK",
  yearOfManufacture: 2024,
  maxLoadCapacity: 10000,
  odometer: 50000,
  acquisitionCost: 2500000,
  status: "AVAILABLE"
});

if (result.success) {
  console.log("Vehicle created:", result.vehicle);
} else {
  console.error("Error:", result.error);
}
```

### Dispatching a Trip

```typescript
import { dispatchTrip } from '@/app/(dashboard)/trips/actions';

const result = await dispatchTrip("trip_id_here");

if (result.success) {
  console.log("Trip dispatched:", result.trip);
} else {
  console.error("Error:", result.error);
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting for production use to prevent abuse.

## Security Considerations

1. All server actions require authentication
2. Role-based access control is enforced on all operations
3. Input validation is performed using Zod schemas
4. Database operations use parameterized queries via Prisma
5. Sensitive operations (deletion) check for dependencies
6. Business logic prevents invalid states (e.g., double-booking)

## Future Enhancements

- Add rate limiting
- Implement pagination for large datasets
- Add caching for frequently accessed data
- Implement optimistic UI updates
- Add real-time updates using WebSockets
- Add API versioning
- Implement request logging and monitoring