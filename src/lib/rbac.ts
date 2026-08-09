/**
 * Role-Based Access Control (RBAC) Configuration
 * Centralized authorization rules for the TransitOps application
 */

export const RBAC_ROLES = {
  ADMIN: "ADMIN",
  FLEET_MANAGER: "FLEET_MANAGER",
  DISPATCHER: "DISPATCHER",
  SAFETY_OFFICER: "SAFETY_OFFICER",
  FINANCIAL_ANALYST: "FINANCIAL_ANALYST",
} as const;

export type Role = typeof RBAC_ROLES[keyof typeof RBAC_ROLES];

/**
 * Route access configuration
 * Maps routes to the roles that can access them
 */
export const ROUTE_ACCESS: Record<string, Role[]> = {
  "/dashboard": [
    RBAC_ROLES.ADMIN,
    RBAC_ROLES.FLEET_MANAGER,
    RBAC_ROLES.DISPATCHER,
    RBAC_ROLES.SAFETY_OFFICER,
    RBAC_ROLES.FINANCIAL_ANALYST,
  ],
  "/fleet": [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  "/drivers": [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.SAFETY_OFFICER],
  "/trips": [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.DISPATCHER],
  "/maintenance": [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  "/fuel-expenses": [RBAC_ROLES.ADMIN, RBAC_ROLES.FINANCIAL_ANALYST, RBAC_ROLES.FLEET_MANAGER],
  "/reports": [RBAC_ROLES.ADMIN, RBAC_ROLES.FINANCIAL_ANALYST],
  "/settings": [RBAC_ROLES.ADMIN],
};

/**
 * Server action permissions
 * Maps action types to the roles that can perform them
 */
export const ACTION_PERMISSIONS = {
  // Vehicle actions
  createVehicle: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  updateVehicle: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  deleteVehicle: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  
  // Driver actions
  createDriver: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.SAFETY_OFFICER],
  updateDriver: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.SAFETY_OFFICER],
  deleteDriver: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.SAFETY_OFFICER],
  
  // Trip actions
  createTrip: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.DISPATCHER],
  dispatchTrip: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.DISPATCHER],
  completeTrip: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.DISPATCHER],
  cancelTrip: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.DISPATCHER],
  
  // Maintenance actions
  createMaintenance: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  completeMaintenance: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  
  // Fuel & Expense actions
  createFuelLog: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.FINANCIAL_ANALYST],
  deleteFuelLog: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  createExpense: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER, RBAC_ROLES.FINANCIAL_ANALYST],
  deleteExpense: [RBAC_ROLES.ADMIN, RBAC_ROLES.FLEET_MANAGER],
  
  // Reports actions
  exportReports: [RBAC_ROLES.ADMIN, RBAC_ROLES.FINANCIAL_ANALYST],
  
  // Settings actions
  updateSettings: [RBAC_ROLES.ADMIN],
} as const;

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: Role, route: string): boolean {
  if (route === "/dashboard") return true;
  const allowedRoles = ROUTE_ACCESS[route];
  return allowedRoles ? allowedRoles.includes(role) : false;
}

/**
 * Check if a role can perform a specific action
 */
export function canPerformAction(role: Role, action: keyof typeof ACTION_PERMISSIONS): boolean {
  const allowedRoles = ACTION_PERMISSIONS[action];
  return allowedRoles ? (allowedRoles as readonly Role[]).includes(role) : false;
}

/**
 * Check if a role has any of the specified roles
 */
export function hasAnyRole(role: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(role);
}
