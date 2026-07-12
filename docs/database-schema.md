# TransitOps - Database Schema Documentation

## Overview

TransitOps uses **PostgreSQL** as the database with **Prisma 6** as the ORM. The schema defines 7 domain models, 4 auth models, and 8 enums.

---

## Enums

### UserRole
```prisma
enum UserRole {
  ADMIN
  FLEET_MANAGER
  DISPATCHER
  SAFETY_OFFICER
  FINANCIAL_ANALYST
}
```

### VehicleType
```prisma
enum VehicleType {
  TRUCK
  VAN
  BUS
  MOTORCYCLE
  CONTAINER
}
```

### VehicleStatus
```prisma
enum VehicleStatus {
  AVAILABLE    # Vehicle is available for dispatch
  ON_TRIP      # Vehicle is currently on a trip
  IN_SHOP      # Vehicle is under maintenance
  RETIRED      # Vehicle is retired from service
}
```

### DriverStatus
```prisma
enum DriverStatus {
  AVAILABLE    # Driver is available for assignment
  ON_TRIP      # Driver is currently on a trip
  OFF_DUTY     # Driver is off duty
  SUSPENDED    # Driver is suspended
}
```

### TripStatus
```prisma
enum TripStatus {
  DRAFT        # Trip created but not dispatched
  DISPATCHED   # Trip dispatched, vehicle/driver ON_TRIP
  IN_PROGRESS  # Trip in progress
  COMPLETED    # Trip completed successfully
  CANCELLED    # Trip cancelled
}
```

### MaintenanceType
```prisma
enum MaintenanceType {
  OIL_CHANGE
  TIRE_ROTATION
  ENGINE_REPAIR
  BRAKE_SERVICE
  INSPECTION
  OTHER
}
```

### MaintenanceStatus
```prisma
enum MaintenanceStatus {
  ACTIVE       # Maintenance in progress (vehicle IN_SHOP)
  COMPLETED    # Maintenance completed (vehicle AVAILABLE)
}
```

### ExpenseCategory
```prisma
enum ExpenseCategory {
  FUEL
  TOLL
  MAINTENANCE
  INSURANCE
  PARKING
  OTHER
}
```

---

## Models

### User
Authentication and user management.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| name | String | required | User's full name |
| email | String | unique | Login email |
| emailVerified | DateTime | nullable | Email verification timestamp |
| hashedPassword | String | nullable | bcrypt hashed password |
| role | UserRole | default: FLEET_MANAGER | User's role |
| image | String | nullable | Profile image URL |
| createdAt | DateTime | default: now() | Account creation time |
| updatedAt | DateTime | auto | Last update time |

### Vehicle
Fleet vehicle registry.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| registrationNumber | String | unique | Vehicle registration (e.g., MH02AB1234) |
| name | String | required | Vehicle name (e.g., VAN-02) |
| model | String | required | Manufacturer model |
| type | VehicleType | default: TRUCK | Vehicle category |
| yearOfManufacture | Int | default: 2024 | Manufacturing year |
| maxLoadCapacity | Float | required | Max cargo weight (kg) |
| odometer | Float | default: 0 | Current odometer reading (km) |
| acquisitionCost | Float | required | Purchase price (INR) |
| status | VehicleStatus | default: AVAILABLE | Current status |
| createdAt | DateTime | default: now() | Registration time |
| updatedAt | DateTime | auto | Last update time |

### Driver
Driver profiles and compliance.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| name | String | required | Driver's full name |
| licenseNumber | String | unique | Driving license number |
| licenseCategory | String | required | LMV, HMV, etc. |
| licenseExpiry | DateTime | required | License expiration date |
| contactNumber | String | required | Phone number |
| safetyScore | Float | default: 100 | Safety rating (0-100) |
| status | DriverStatus | default: AVAILABLE | Current status |
| createdAt | DateTime | default: now() | Registration time |
| updatedAt | DateTime | auto | Last update time |

### Trip
Trip management and dispatch.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| source | String | required | Origin location |
| destination | String | required | Destination location |
| cargoWeight | Float | required | Cargo weight (kg) |
| plannedDistance | Float | required | Planned distance (km) |
| actualDistance | Float | nullable | Actual distance (km) |
| fuelConsumed | Float | nullable | Fuel consumed (liters) |
| status | TripStatus | default: DRAFT | Trip status |
| vehicleId | String | nullable, FK | Assigned vehicle |
| driverId | String | nullable, FK | Assigned driver |
| dispatchedAt | DateTime | nullable | Dispatch timestamp |
| completedAt | DateTime | nullable | Completion timestamp |
| createdAt | DateTime | default: now() | Creation time |
| updatedAt | DateTime | auto | Last update time |

### MaintenanceLog
Vehicle service records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| vehicleId | String, FK | required | Associated vehicle |
| serviceType | MaintenanceType | required | Type of service |
| description | String | nullable | Service description |
| mileage | Float | nullable | Odometer at service |
| cost | Float | required | Service cost (INR) |
| status | MaintenanceStatus | default: ACTIVE | Service status |
| createdAt | DateTime | default: now() | Record creation |
| updatedAt | DateTime | auto | Last update time |

### FuelLog
Fuel purchase records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| vehicleId | String, FK | required | Associated vehicle |
| tripId | String, nullable, FK | optional | Associated trip |
| liters | Float | required | Fuel quantity |
| cost | Float | required | Fuel cost (INR) |
| date | DateTime | default: now() | Purchase date |
| createdAt | DateTime | default: now() | Record creation |

### Expense
Other operational expenses.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | PK, cuid | Unique identifier |
| vehicleId | String, FK | required | Associated vehicle |
| tripId | String, nullable, FK | optional | Associated trip |
| category | ExpenseCategory | required | Expense type |
| description | String | nullable | Expense description |
| amount | Float | required | Expense amount (INR) |
| date | DateTime | default: now() | Expense date |
| createdAt | DateTime | default: now() | Record creation |

---

## Entity Relationship Diagram

```
┌─────────┐     ┌─────────────┐     ┌─────────┐
│  User   │────<│   Account   │     │ Vehicle │
│         │────<│   Session   │     │         │
└─────────┘     └─────────────┘     └────┬────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
              ┌──────────┐        ┌──────────┐        ┌──────────┐
              │   Trip   │───────>│ FuelLog  │        │Expense   │
              │          │───────>│          │        │          │
              └────┬─────┘        └──────────┘        └──────────┘
                   │
              ┌────▼────┐
              │ Driver  │
              └─────────┘

              ┌──────────────────┐
              │ MaintenanceLog   │
              │ (linked to Vehicle)│
              └──────────────────┘
```

---

## Status Transition Rules

### Vehicle Status
```
AVAILABLE ──(dispatch trip)──> ON_TRIP
ON_TRIP ──(complete trip)──> AVAILABLE
ON_TRIP ──(cancel trip)──> AVAILABLE
AVAILABLE ──(create maintenance)──> IN_SHOP
IN_SHOP ──(complete maintenance)──> AVAILABLE
AVAILABLE ──(retire)──> RETIRED
```

### Driver Status
```
AVAILABLE ──(dispatch trip)──> ON_TRIP
ON_TRIP ──(complete trip)──> AVAILABLE
ON_TRIP ──(cancel trip)──> AVAILABLE
```

### Trip Status
```
DRAFT ──(dispatch)──> DISPATCHED
DISPATCHED ──(start)──> IN_PROGRESS
IN_PROGRESS ──(complete)──> COMPLETED
DRAFT ──(cancel)──> CANCELLED
DISPATCHED ──(cancel)──> CANCELLED
IN_PROGRESS ──(cancel)──> CANCELLED
```

---

## Sample Queries

### Get available vehicles for dispatch
```sql
SELECT * FROM "Vehicle" WHERE status = 'AVAILABLE';
```

### Get available drivers with valid licenses
```sql
SELECT * FROM "Driver" 
WHERE status = 'AVAILABLE' 
AND "licenseExpiry" > NOW();
```

### Calculate fleet utilization
```sql
SELECT 
  COUNT(CASE WHEN status = 'ON_TRIP' THEN 1 END) * 100.0 / 
  COUNT(CASE WHEN status != 'RETIRED' THEN 1 END) AS utilization
FROM "Vehicle";
```

### Get total operational cost per vehicle
```sql
SELECT 
  v.name,
  COALESCE(SUM(f.cost), 0) AS fuel_cost,
  COALESCE(SUM(m.cost), 0) AS maintenance_cost,
  COALESCE(SUM(e.amount), 0) AS other_cost
FROM "Vehicle" v
LEFT JOIN "FuelLog" f ON f."vehicleId" = v.id
LEFT JOIN "MaintenanceLog" m ON m."vehicleId" = v.id AND m.status = 'COMPLETED'
LEFT JOIN "Expense" e ON e."vehicleId" = v.id
GROUP BY v.id, v.name;
```
