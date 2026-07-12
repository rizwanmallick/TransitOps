import "dotenv/config";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const adminPassword = await hashPassword("admin123");
  const fleetPassword = await hashPassword("fleet123");
  const safetyPassword = await hashPassword("safety123");
  const financePassword = await hashPassword("finance123");
  const dispatchPassword = await hashPassword("dispatch123");

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@transitops.com",
      hashedPassword: adminPassword,
      role: "ADMIN",
    },
  });

  const fleetManager = await prisma.user.create({
    data: {
      name: "Rajesh Kumar",
      email: "fleet@transitops.com",
      hashedPassword: fleetPassword,
      role: "FLEET_MANAGER",
    },
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "safety@transitops.com",
      hashedPassword: safetyPassword,
      role: "SAFETY_OFFICER",
    },
  });

  const financeAnalyst = await prisma.user.create({
    data: {
      name: "Amit Patel",
      email: "finance@transitops.com",
      hashedPassword: financePassword,
      role: "FINANCIAL_ANALYST",
    },
  });

  const dispatcher = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "dispatcher@transitops.com",
      hashedPassword: dispatchPassword,
      role: "DISPATCHER",
    },
  });

  console.log("Users created:", { admin, fleetManager, safetyOfficer, financeAnalyst, dispatcher });

  // Create vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        registrationNumber: "MH02AB1234",
        name: "VAN-02",
        model: "Tata Ace",
        type: "VAN",
        yearOfManufacture: 2022,
        maxLoadCapacity: 600,
        odometer: 84000,
        acquisitionCost: 400000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "MH12C5678",
        name: "TRUCK-B",
        model: "Tata 1613",
        type: "TRUCK",
        yearOfManufacture: 2021,
        maxLoadCapacity: 5000,
        odometer: 100000,
        acquisitionCost: 3400000,
        status: "ON_TRIP",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "MH01D9012",
        name: "ACE-C1",
        model: "Tata Ace Gold",
        type: "TRUCK",
        yearOfManufacture: 2020,
        maxLoadCapacity: 1000,
        odometer: 110000,
        acquisitionCost: 800000,
        status: "IN_SHOP",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "KA01EF3456",
        name: "VAN-04",
        model: "Maruti Eeco",
        type: "VAN",
        yearOfManufacture: 2019,
        maxLoadCapacity: 750,
        odometer: 245000,
        acquisitionCost: 600000,
        status: "RETIRED",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "MH04GH7890",
        name: "BUS-01",
        model: "Tata Starbus",
        type: "BUS",
        yearOfManufacture: 2023,
        maxLoadCapacity: 2000,
        odometer: 45000,
        acquisitionCost: 2500000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "GJ05IJ1234",
        name: "TRUCK-A",
        model: "Ashok Leyland Dost",
        type: "TRUCK",
        yearOfManufacture: 2022,
        maxLoadCapacity: 3000,
        odometer: 78000,
        acquisitionCost: 1800000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "DL06KL5678",
        name: "VAN-05",
        model: "Tata Winger",
        type: "VAN",
        yearOfManufacture: 2023,
        maxLoadCapacity: 800,
        odometer: 32000,
        acquisitionCost: 950000,
        status: "ON_TRIP",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "TN07MN9012",
        name: "VAN-03",
        model: "Eicher Skyline",
        type: "VAN",
        yearOfManufacture: 2024,
        maxLoadCapacity: 500,
        odometer: 12000,
        acquisitionCost: 750000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "RJ08PQ3456",
        name: "TRUCK-C",
        model: "Eicher Pro 2049",
        type: "TRUCK",
        yearOfManufacture: 2020,
        maxLoadCapacity: 4000,
        odometer: 155000,
        acquisitionCost: 2800000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "UP09RS7890",
        name: "BUS-02",
        model: "Tata Magna",
        type: "BUS",
        yearOfManufacture: 2021,
        maxLoadCapacity: 3000,
        odometer: 98000,
        acquisitionCost: 3200000,
        status: "ON_TRIP",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "MP10TU1234",
        name: "CONTAINER-01",
        model: "Tata ULTRA",
        type: "CONTAINER",
        yearOfManufacture: 2022,
        maxLoadCapacity: 8000,
        odometer: 67000,
        acquisitionCost: 4500000,
        status: "AVAILABLE",
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNumber: "AP11VW5678",
        name: "VAN-06",
        model: "Force Traveller",
        type: "VAN",
        yearOfManufacture: 2023,
        maxLoadCapacity: 1200,
        odometer: 28000,
        acquisitionCost: 1200000,
        status: "AVAILABLE",
      },
    }),
  ]);

  console.log("Vehicles created:", vehicles.length);

  // Create drivers
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        name: "Alex",
        licenseNumber: "MH-12345",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2027-12-31"),
        contactNumber: "+91 98765 43210",
        safetyScore: 95,
        status: "AVAILABLE",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Suresh",
        licenseNumber: "GJ-67890",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2026-03-15"),
        contactNumber: "+91 98765 43211",
        safetyScore: 88,
        status: "ON_TRIP",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Priya",
        licenseNumber: "KA-11111",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2025-09-30"),
        contactNumber: "+91 98765 43212",
        safetyScore: 92,
        status: "AVAILABLE",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Rajesh",
        licenseNumber: "MH-22222",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2024-06-30"),
        contactNumber: "+91 98765 43213",
        safetyScore: 78,
        status: "SUSPENDED",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Ravi",
        licenseNumber: "DL-33333",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2028-01-15"),
        contactNumber: "+91 98765 43214",
        safetyScore: 91,
        status: "OFF_DUTY",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Amit",
        licenseNumber: "TN-44444",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2026-11-30"),
        contactNumber: "+91 98765 43215",
        safetyScore: 85,
        status: "AVAILABLE",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Sanjay",
        licenseNumber: "RJ-55555",
        licenseCategory: "HMV",
        licenseExpiry: new Date("2027-08-20"),
        contactNumber: "+91 98765 43216",
        safetyScore: 73,
        status: "AVAILABLE",
      },
    }),
    prisma.driver.create({
      data: {
        name: "Deepak",
        licenseNumber: "UP-66666",
        licenseCategory: "LMV",
        licenseExpiry: new Date("2026-05-10"),
        contactNumber: "+91 98765 43217",
        safetyScore: 97,
        status: "AVAILABLE",
      },
    }),
  ]);

  console.log("Drivers created:", drivers.length);

  // Create trips with richer data
  const trips = await Promise.all([
    prisma.trip.create({
      data: {
        source: "Mumbai",
        destination: "Ahmedabad",
        cargoWeight: 450,
        plannedDistance: 530,
        status: "COMPLETED",
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        actualDistance: 545,
        fuelConsumed: 65,
        dispatchedAt: new Date("2026-07-01"),
        completedAt: new Date("2026-07-02"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Rajkot",
        destination: "Delhi",
        cargoWeight: 3500,
        plannedDistance: 1100,
        status: "DISPATCHED",
        vehicleId: vehicles[1].id,
        driverId: drivers[1].id,
        dispatchedAt: new Date("2026-07-05"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Mumbai",
        destination: "Pune",
        cargoWeight: 700,
        plannedDistance: 150,
        status: "IN_PROGRESS",
        vehicleId: vehicles[6].id,
        driverId: drivers[2].id,
        dispatchedAt: new Date("2026-07-10"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Bangalore",
        destination: "Chennai",
        cargoWeight: 400,
        plannedDistance: 350,
        status: "DRAFT",
      },
    }),
    prisma.trip.create({
      data: {
        source: "Delhi",
        destination: "Jaipur",
        cargoWeight: 1200,
        plannedDistance: 280,
        status: "COMPLETED",
        vehicleId: vehicles[5].id,
        driverId: drivers[5].id,
        actualDistance: 290,
        fuelConsumed: 45,
        dispatchedAt: new Date("2026-06-28"),
        completedAt: new Date("2026-06-29"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Ahmedabad",
        destination: "Surat",
        cargoWeight: 300,
        plannedDistance: 260,
        status: "CANCELLED",
      },
    }),
    // Additional trips for richer analytics
    prisma.trip.create({
      data: {
        source: "Chennai",
        destination: "Bangalore",
        cargoWeight: 800,
        plannedDistance: 350,
        status: "COMPLETED",
        vehicleId: vehicles[7].id,
        driverId: drivers[7].id,
        actualDistance: 360,
        fuelConsumed: 42,
        dispatchedAt: new Date("2026-06-15"),
        completedAt: new Date("2026-06-16"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Pune",
        destination: "Nagpur",
        cargoWeight: 2000,
        plannedDistance: 800,
        status: "COMPLETED",
        vehicleId: vehicles[8].id,
        driverId: drivers[4].id,
        actualDistance: 815,
        fuelConsumed: 95,
        dispatchedAt: new Date("2026-06-20"),
        completedAt: new Date("2026-06-22"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Mumbai",
        destination: "Goa",
        cargoWeight: 500,
        plannedDistance: 580,
        status: "COMPLETED",
        vehicleId: vehicles[0].id,
        driverId: drivers[0].id,
        actualDistance: 595,
        fuelConsumed: 72,
        dispatchedAt: new Date("2026-06-10"),
        completedAt: new Date("2026-06-11"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Delhi",
        destination: "Chandigarh",
        cargoWeight: 1500,
        plannedDistance: 240,
        status: "COMPLETED",
        vehicleId: vehicles[9].id,
        driverId: drivers[3].id,
        actualDistance: 250,
        fuelConsumed: 38,
        dispatchedAt: new Date("2026-06-05"),
        completedAt: new Date("2026-06-06"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Kolkata",
        destination: "Bhubaneswar",
        cargoWeight: 600,
        plannedDistance: 470,
        status: "COMPLETED",
        vehicleId: vehicles[10].id,
        driverId: drivers[6].id,
        actualDistance: 485,
        fuelConsumed: 58,
        dispatchedAt: new Date("2026-06-01"),
        completedAt: new Date("2026-06-02"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Hyderabad",
        destination: "Vijayawada",
        cargoWeight: 900,
        plannedDistance: 275,
        status: "COMPLETED",
        vehicleId: vehicles[11].id,
        driverId: drivers[2].id,
        actualDistance: 280,
        fuelConsumed: 32,
        dispatchedAt: new Date("2026-05-28"),
        completedAt: new Date("2026-05-29"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Lucknow",
        destination: "Kanpur",
        cargoWeight: 1800,
        plannedDistance: 80,
        status: "COMPLETED",
        vehicleId: vehicles[8].id,
        driverId: drivers[4].id,
        actualDistance: 85,
        fuelConsumed: 12,
        dispatchedAt: new Date("2026-05-25"),
        completedAt: new Date("2026-05-25"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Coimbatore",
        destination: "Madurai",
        cargoWeight: 350,
        plannedDistance: 220,
        status: "DISPATCHED",
        vehicleId: vehicles[7].id,
        driverId: drivers[7].id,
        dispatchedAt: new Date("2026-07-11"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Indore",
        destination: "Bhopal",
        cargoWeight: 2500,
        plannedDistance: 195,
        status: "COMPLETED",
        vehicleId: vehicles[9].id,
        driverId: drivers[5].id,
        actualDistance: 200,
        fuelConsumed: 28,
        dispatchedAt: new Date("2026-05-20"),
        completedAt: new Date("2026-05-21"),
      },
    }),
    prisma.trip.create({
      data: {
        source: "Mysore",
        destination: "Mangalore",
        cargoWeight: 250,
        plannedDistance: 330,
        status: "CANCELLED",
      },
    }),
  ]);

  console.log("Trips created:", trips.length);

  // Create maintenance logs with richer data
  const maintenanceLogs = await Promise.all([
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[2].id,
        serviceType: "ENGINE_REPAIR",
        description: "Engine overhaul required",
        mileage: 110000,
        cost: 45000,
        status: "ACTIVE",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[0].id,
        serviceType: "OIL_CHANGE",
        description: "Regular oil change",
        mileage: 84000,
        cost: 3500,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[1].id,
        serviceType: "TIRE_ROTATION",
        description: "Tire rotation and alignment",
        mileage: 100000,
        cost: 4200,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[5].id,
        serviceType: "BRAKE_SERVICE",
        description: "Brake pad replacement",
        mileage: 78000,
        cost: 8500,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[4].id,
        serviceType: "INSPECTION",
        description: "Annual fitness inspection",
        mileage: 45000,
        cost: 2000,
        status: "COMPLETED",
      },
    }),
    // Additional maintenance records
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[8].id,
        serviceType: "TIRE_ROTATION",
        description: "Full tire replacement",
        mileage: 155000,
        cost: 24000,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[9].id,
        serviceType: "OIL_CHANGE",
        description: "Engine oil and filter change",
        mileage: 98000,
        cost: 4500,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[10].id,
        serviceType: "BRAKE_SERVICE",
        description: "Disc brake replacement",
        mileage: 67000,
        cost: 12000,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[3].id,
        serviceType: "ENGINE_REPAIR",
        description: "Engine rebuild before retirement",
        mileage: 240000,
        cost: 85000,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[6].id,
        serviceType: "INSPECTION",
        description: "Pre-trip inspection",
        mileage: 32000,
        cost: 1500,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[11].id,
        serviceType: "OIL_CHANGE",
        description: "Synthetic oil change",
        mileage: 28000,
        cost: 5500,
        status: "COMPLETED",
      },
    }),
    prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[7].id,
        serviceType: "OTHER",
        description: "AC compressor replacement",
        mileage: 12000,
        cost: 18000,
        status: "COMPLETED",
      },
    }),
  ]);

  console.log("Maintenance logs created:", maintenanceLogs.length);

  // Create fuel logs with richer data
  const fuelLogs = await Promise.all([
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[0].id,
        tripId: trips[0].id,
        liters: 45,
        cost: 3800,
        date: new Date("2026-07-01"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[1].id,
        tripId: trips[1].id,
        liters: 50,
        cost: 4200,
        date: new Date("2026-07-05"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[6].id,
        tripId: trips[2].id,
        liters: 10,
        cost: 850,
        date: new Date("2026-07-10"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[5].id,
        tripId: trips[4].id,
        liters: 35,
        cost: 2950,
        date: new Date("2026-06-28"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[0].id,
        liters: 40,
        cost: 3400,
        date: new Date("2026-06-25"),
      },
    }),
    // Additional fuel logs
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[7].id,
        tripId: trips[6].id,
        liters: 38,
        cost: 3200,
        date: new Date("2026-06-15"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[8].id,
        tripId: trips[7].id,
        liters: 85,
        cost: 7200,
        date: new Date("2026-06-20"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[0].id,
        tripId: trips[8].id,
        liters: 65,
        cost: 5500,
        date: new Date("2026-06-10"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[9].id,
        tripId: trips[9].id,
        liters: 32,
        cost: 2700,
        date: new Date("2026-06-05"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[10].id,
        tripId: trips[10].id,
        liters: 52,
        cost: 4400,
        date: new Date("2026-06-01"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[11].id,
        tripId: trips[11].id,
        liters: 28,
        cost: 2350,
        date: new Date("2026-05-28"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[8].id,
        tripId: trips[12].id,
        liters: 10,
        cost: 850,
        date: new Date("2026-05-25"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[9].id,
        tripId: trips[15].id,
        liters: 18,
        cost: 1500,
        date: new Date("2026-05-20"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[1].id,
        liters: 55,
        cost: 4600,
        date: new Date("2026-05-15"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[5].id,
        liters: 42,
        cost: 3550,
        date: new Date("2026-05-10"),
      },
    }),
    prisma.fuelLog.create({
      data: {
        vehicleId: vehicles[2].id,
        liters: 30,
        cost: 2550,
        date: new Date("2026-05-05"),
      },
    }),
  ]);

  console.log("Fuel logs created:", fuelLogs.length);

  // Create expenses with richer data
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        vehicleId: vehicles[0].id,
        tripId: trips[0].id,
        category: "TOLL",
        description: "Mumbai-Ahmedabad Highway Toll",
        amount: 1200,
        date: new Date("2026-07-01"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[1].id,
        tripId: trips[1].id,
        category: "TOLL",
        description: "Rajkot-Delhi Highway Toll",
        amount: 2400,
        date: new Date("2026-07-05"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[5].id,
        tripId: trips[4].id,
        category: "PARKING",
        description: "Delhi Parking Fees",
        amount: 500,
        date: new Date("2026-06-29"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[2].id,
        category: "MAINTENANCE",
        description: "Engine repair parts",
        amount: 45000,
        date: new Date("2026-07-08"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[4].id,
        category: "INSURANCE",
        description: "Annual vehicle insurance",
        amount: 35000,
        date: new Date("2026-01-15"),
      },
    }),
    // Additional expenses
    prisma.expense.create({
      data: {
        vehicleId: vehicles[8].id,
        tripId: trips[7].id,
        category: "TOLL",
        description: "Pune-Nagpur Highway Toll",
        amount: 3200,
        date: new Date("2026-06-20"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[0].id,
        tripId: trips[8].id,
        category: "TOLL",
        description: "Mumbai-Goa Highway Toll",
        amount: 1800,
        date: new Date("2026-06-10"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[9].id,
        tripId: trips[9].id,
        category: "PARKING",
        description: "Chandigarh Parking",
        amount: 350,
        date: new Date("2026-06-06"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[10].id,
        tripId: trips[10].id,
        category: "TOLL",
        description: "Kolkata-Bhubaneswar Toll",
        amount: 2100,
        date: new Date("2026-06-01"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[1].id,
        category: "INSURANCE",
        description: "Comprehensive insurance",
        amount: 65000,
        date: new Date("2026-02-01"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[8].id,
        category: "INSURANCE",
        description: "Third-party insurance",
        amount: 28000,
        date: new Date("2026-03-10"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[9].id,
        category: "MAINTENANCE",
        description: "Engine service",
        amount: 15000,
        date: new Date("2026-05-20"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[11].id,
        category: "PARKING",
        description: "Hyderabad Parking",
        amount: 280,
        date: new Date("2026-05-29"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[5].id,
        tripId: trips[4].id,
        category: "OTHER",
        description: "Emergency tyre repair",
        amount: 3500,
        date: new Date("2026-06-29"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[3].id,
        category: "MAINTENANCE",
        description: "Pre-retirement full service",
        amount: 95000,
        date: new Date("2026-04-15"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[6].id,
        category: "INSURANCE",
        description: "Annual insurance renewal",
        amount: 22000,
        date: new Date("2026-04-01"),
      },
    }),
    prisma.expense.create({
      data: {
        vehicleId: vehicles[7].id,
        category: "OTHER",
        description: "GPS tracker installation",
        amount: 8500,
        date: new Date("2026-05-15"),
      },
    }),
  ]);

  console.log("Expenses created:", expenses.length);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
