import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const roleRoutes: Record<string, string[]> = {
  "/fleet": ["ADMIN", "FLEET_MANAGER"],
  "/drivers": ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/trips": ["ADMIN", "FLEET_MANAGER", "DISPATCHER"],
  "/maintenance": ["ADMIN", "FLEET_MANAGER"],
  "/fuel-expenses": ["ADMIN", "FINANCIAL_ANALYST", "FLEET_MANAGER"],
  "/reports": ["ADMIN", "FINANCIAL_ANALYST"],
  "/settings": ["ADMIN"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/", "/login", "/api/auth", "/api/seed"];
  if (
    publicPaths.some((p) => pathname === p || pathname.startsWith("/api/auth"))
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as string;

  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
