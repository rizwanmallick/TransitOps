# TransitOps Database Schema Documentation

## Overview

TransitOps uses PostgreSQL as the database with Prisma ORM. The schema is defined in `prisma/schema.prisma` and includes models for users, vehicles, drivers, trips, maintenance logs, fuel logs, and expenses.

## Database Configuration

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Enums

### UserRole
Defines user roles for the application's RBAC system.

- `ADMIN` - Full system access
- `FLEET_MANAGER` - Fleet management operations
- `DISPATCHER` - Trip dispatching and management
- `SAFETY_OFFICER` - Driver management and safety
- `FINANCIAL_ANALYST` - Financial reports and expenses

### VehicleType
Types of vehicles in the fleet.

- `TRUCK` - Heavy goods vehicle
- `VAN` - Light commercial vehicle
- `BUS` - Passenger transport
- `MOTORCYCLE` - Two-wheeled vehicle
- `CONTAINER` - Container transport

### VehicleStatus
Current status of a vehicle.

- `AVAILABLE` - Ready for assignment
- `ON_TRIP` - Currently on a trip
- `IN_SHOP` - Under maintenance
- `RETIRED` - No longer in service

### DriverStatus
Current status of a driver.

- `AVAILABLE` - Ready for assignment
- `ON_TRIP` - Currently on a trip
- `OFF_DUTY` - Not working
- `SUSPENDED` - Suspended from duty

### TripStatus
Status of a trip in the workflow.

- `DRAFT` - Trip created but not dispatched
- `DISPATCHED` - Trip assigned and dispatched
- `IN_PROGRESS` - Trip is currently active
- `COMPLETED` - Trip finished successfully
- `CANCELLED` - Trip was cancelled

### MaintenanceType
Types of maintenance services.

- `OIL_CHANGE` - Oil change service
- `TIRE_ROTATION` - Tire rotation service
- `ENGINE_REPAIR` - Engine repair work
- `BRAKE_SERVICE` - Brake maintenance
- `INSPECTION` - Vehicle inspection
- `OTHER` - Other maintenance types

### MaintenanceStatus
Status of a maintenance log.

- `ACTIVE` - Maintenance in progress
- `COMPLETED` - Maintenance finished

### ExpenseCategory
Categories for expense tracking.

- `FUEL` - Fuel expenses
- `TOLL` - Toll charges
- `MAINTENANCE` - Maintenance costs
- `INSURANCE` - Insurance payments
- `PARKING` - Parking fees
- `OTHER` - Other expenses

## Models

### User
Represents application users with authentication and role information.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| name | String | - | User's full name |
| email | String | @unique | User's email address |
| emailVerified | DateTime? | - | Email verification timestamp |
| hashedPassword | String? | - | Bcrypt hashed password |
| role | UserRole | @default(FLEET_MANAGER) | User's role |
| image | String? | - | Profile image URL |
| createdAt | DateTime | @default(now()) | Account creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `accounts` - One-to-many with Account
- `sessions` - One-to-many with Session

### Account
Stores OAuth provider account information (NextAuth.js).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| userId | String | - | Reference to User |
| type | String | - | OAuth provider type |
| provider | String | - | OAuth provider name |
| providerAccountId | String | - | Provider account ID |
| refresh_token | String? | @db.Text | OAuth refresh token |
| access_token | String? | @db.Text | OAuth access token |
| expires_at | Int? | - | Token expiration timestamp |
| token_type | String? | - | OAuth token type |
| scope | String? | - | OAuth scope |
| id_token | String? | @db.Text | OAuth ID token |
| session_state | String? | - | OAuth session state |

**Relations:**
- `user` - Many-to-one with User (onDelete: Cascade)

**Indexes:**
- Unique constraint on `[provider, providerAccountId]`

### Session
Stores user session information (NextAuth.js).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| sessionToken | String | @unique | Session token |
| userId | String | - | Reference to User |
| expires | DateTime | - | Session expiration |

**Relations:**
- `user` - Many-to-one with User (onDelete: Cascade)

### VerificationToken
Stores email verification tokens (NextAuth.js).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| identifier | String | - | Email identifier |
| token | String | @unique | Verification token |
| expires | DateTime | - | Token expiration |

**Indexes:**
- Unique constraint on `[identifier, token]`

### Vehicle
Represents vehicles in the fleet.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| registrationNumber | String | @unique | Vehicle registration number |
| name | String | - | Vehicle name/identifier |
| model | String | - | Vehicle model |
| type | VehicleType | @default(TRUCK) | Vehicle type |
| yearOfManufacture | Int | @default(2024) | Manufacturing year |
| maxLoadCapacity | Float | - | Maximum load capacity (kg) |
| odometer | Float | @default(0) | Current odometer reading |
| acquisitionCost | Float | - | Purchase cost |
| status | VehicleStatus | @default(AVAILABLE) | Current status |
| createdAt | DateTime | @default(now()) | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `trips` - One-to-many with Trip
- `maintenanceLogs` - One-to-many with MaintenanceLog
- `fuelLogs` - One-to-many with FuelLog
- `expenses` - One-to-many with Expense

**Indexes:**
- `status` - For filtering by vehicle status
- `createdAt` - For sorting by creation date
- `type` - For filtering by vehicle type

### Driver
Represents drivers in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| name | String | - | Driver's full name |
| licenseNumber | String | @unique | Driver's license number |
| licenseCategory | String | - | License category |
| licenseExpiry | DateTime | - | License expiration date |
| contactNumber | String | - | Contact phone number |
| safetyScore | Float | @default(100) | Safety score (0-100) |
| status | DriverStatus | @default(AVAILABLE) | Current status |
| createdAt | DateTime | @default(now()) | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `trips` - One-to-many with Trip

**Indexes:**
- `status` - For filtering by driver status
- `safetyScore` - For sorting by safety score
- `licenseExpiry` - For tracking expiring licenses

### Trip
Represents transportation trips.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| source | String | - | Origin location |
| destination | String | - | Destination location |
| cargoWeight | Float | - | Cargo weight (kg) |
| plannedDistance | Float | - | Planned distance (km) |
| actualDistance | Float? | - | Actual distance traveled |
| fuelConsumed | Float? | - | Fuel consumed (liters) |
| status | TripStatus | @default(DRAFT) | Trip status |
| vehicleId | String? | - | Assigned vehicle |
| driverId | String? | - | Assigned driver |
| dispatchedAt | DateTime? | - | Dispatch timestamp |
| completedAt | DateTime? | - | Completion timestamp |
| createdAt | DateTime | @default(now()) | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `vehicle` - Many-to-one with Vehicle
- `driver` - Many-to-one with Driver
- `fuelLogs` - One-to-many with FuelLog
- `expenses` - One-to-many with Expense

**Indexes:**
- `status` - For filtering by trip status
- `vehicleId` - For vehicle-specific queries
- `driverId` - For driver-specific queries
- `createdAt` - For sorting by creation date
- `dispatchedAt` - For dispatch timeline queries
- `completedAt` - For completion timeline queries

### MaintenanceLog
Records maintenance activities for vehicles.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| vehicleId | String | - | Vehicle reference |
| serviceType | MaintenanceType | - | Type of service |
| description | String? | - | Service description |
| mileage | Float? | - | Vehicle mileage at service |
| cost | Float | - | Service cost |
| status | MaintenanceStatus | @default(ACTIVE) | Maintenance status |
| createdAt | DateTime | @default(now()) | Creation timestamp |
| updatedAt | DateTime | @updatedAt | Last update timestamp |

**Relations:**
- `vehicle` - Many-to-one with Vehicle

**Indexes:**
- `vehicleId` - For vehicle-specific queries
- `status` - For filtering by maintenance status
- `serviceType` - For service type analysis
- `createdAt` - For sorting by creation date

### FuelLog
Records fuel purchases and consumption.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| vehicleId | String | - | Vehicle reference |
| tripId | String? | - | Associated trip |
| liters | Float | - | Fuel quantity (liters) |
| cost | Float | - | Fuel cost |
| date | DateTime | @default(now()) | Fueling date |
| createdAt | DateTime | @default(now()) | Creation timestamp |

**Relations:**
- `vehicle` - Many-to-one with Vehicle
- `trip` - Many-to-one with Trip

**Indexes:**
- `vehicleId` - For vehicle-specific queries
- `tripId` - For trip-specific queries
- `date` - For date-based queries

### Expense
Records various expenses related to fleet operations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | String | @id, @default(cuid()) | Primary key |
| vehicleId | String | - | Vehicle reference |
| tripId | String? | - | Associated trip |
| category | ExpenseCategory | - | Expense category |
| description | String? | - | Expense description |
| amount | Float | - | Expense amount |
| date | DateTime | @default(now()) | Expense date |
| createdAt | DateTime | @default(now()) | Creation timestamp |

**Relations:**
- `vehicle` - Many-to-one with Vehicle
- `trip` - Many-to-one with Trip

**Indexes:**
- `vehicleId` - For vehicle-specific queries
- `tripId` - For trip-specific queries
- `category` - For category-based analysis
- `date` - For date-based queries

## Entity Relationships

```
User (1) ----< (N) Account
User (1) ----< (N) Session

Vehicle (1) ----< (N) Trip
Vehicle (1) ----< (N) MaintenanceLog
Vehicle (1) ----< (N) FuelLog
Vehicle (1) ----< (N) Expense

Driver (1) ----< (N) Trip

Trip (1) ----< (N) FuelLog
Trip (1) ----< (N) Expense
```

## Database Indexes

The schema includes strategic indexes for performance optimization:

### Performance Indexes
- **Vehicle:** status, createdAt, type
- **Driver:** status, safetyScore, licenseExpiry
- **Trip:** status, vehicleId, driverId, createdAt, dispatchedAt, completedAt
- **MaintenanceLog:** vehicleId, status, serviceType, createdAt
- **FuelLog:** vehicleId, tripId, date
- **Expense:** vehicleId, tripId, category, date

These indexes optimize:
- Status-based filtering (e.g., finding available vehicles)
- Timeline queries (e.g., trips by date)
- Relationship queries (e.g., vehicle-specific logs)
- Analytics queries (e.g., expenses by category)

## Cascade Deletion

The following relations use cascade deletion:
- `Account.user` - Deleting a user deletes their OAuth accounts
- `Session.user` - Deleting a user deletes their sessions

Note: Vehicle and Driver deletion does NOT cascade to related records (trips, logs, expenses) to preserve historical data. Instead, the application enforces business rules to prevent deletion of vehicles/drivers with active dependencies.

## Data Integrity Constraints

### Unique Constraints
- `User.email` - Each email must be unique
- `Vehicle.registrationNumber` - Each registration number must be unique
- `Driver.licenseNumber` - Each license number must be unique
- `Session.sessionToken` - Each session token must be unique
- `VerificationToken.token` - Each verification token must be unique
- `Account.[provider, providerAccountId]` - Each provider account must be unique

### Default Values
- `Vehicle.type` defaults to `TRUCK`
- `Vehicle.yearOfManufacture` defaults to current year
- `Vehicle.status` defaults to `AVAILABLE`
- `Driver.safetyScore` defaults to 100
- `Driver.status` defaults to `AVAILABLE`
- `Trip.status` defaults to `DRAFT`
- `MaintenanceLog.status` defaults to `ACTIVE`
- `User.role` defaults to `FLEET_MANAGER`

## Business Logic Enforced at Application Level

While the database schema provides structural integrity, additional business rules are enforced in the application layer:

1. **Vehicle Deletion:** Cannot delete vehicles with active trips
2. **Driver Deletion:** Cannot delete drivers with active trips
3. **Trip Creation:** Cannot double-book vehicles or drivers
4. **License Validation:** Driver licenses must not be expired
5. **Vehicle Year:** Must be reasonable (2000 to current year + 1)
6. **Positive Values:** Costs, distances, and quantities must be positive

## Migration Strategy

To modify the schema:

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` for development (applies changes directly)
3. For production, use `npx prisma migrate dev` to create versioned migrations

## Backup and Recovery

Regular database backups are recommended. Consider:
- Daily automated backups
- Point-in-time recovery capability
- Backup verification procedures
- Disaster recovery plan

## Performance Considerations

### Query Optimization
- Use indexed columns in WHERE clauses
- Avoid SELECT * when not needed
- Use relation queries efficiently with `include` or `select`
- Consider pagination for large datasets

### Scaling
- Monitor query performance with Prisma logs
- Add indexes for frequently queried patterns
- Consider read replicas for reporting queries
- Archive old data periodically

## Security Considerations

1. **Connection Security:** Use SSL for database connections
2. **Access Control:** Limit database user permissions
3. **Data Encryption:** Consider encryption for sensitive fields
4. **Audit Logging:** Track critical data changes
5. **Regular Updates:** Keep Prisma and PostgreSQL updated

## Troubleshooting

### Common Issues

**Migration Conflicts:**
- Resolve by checking migration history
- Use `prisma migrate resolve` for manual conflict resolution

**Performance Issues:**
- Check query plans with `EXPLAIN ANALYZE`
- Review and optimize indexes
- Consider database connection pooling

**Connection Issues:**
- Verify DATABASE_URL is correct
- Check database server status
- Ensure network connectivity

## Future Enhancements

Potential schema improvements for future versions:

1. **Soft Delete:** Add `deletedAt` timestamp for soft deletion
2. **Audit Trail:** Add `createdBy` and `updatedBy` fields
3. **Geospatial Data:** Add location fields for routes
4. **Document Storage:** Add document attachments (insurance, licenses)
5. **Advanced Analytics:** Add computed fields for KPIs
6. **Real-time Sync:** Consider change data capture (CDC) setup