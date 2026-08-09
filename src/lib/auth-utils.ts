import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTE_ACCESS } from "@/lib/rbac";

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}

export async function requireRole(...roles: string[]) {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) redirect("/unauthorized");
  return session;
}

export async function requireRouteAccess(route: string) {
  const session = await requireAuth();
  const allowedRoles = ROUTE_ACCESS[route];
  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    redirect("/unauthorized");
  }
  return session;
}
