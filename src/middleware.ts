import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from "./lib/cookie-handler";

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get("isAdmin")?.value === "true";

  // Check if the request is for an admin-only route
  if (request.nextUrl.pathname === "/register-agency" && !isAdmin) {
    // Redirect unauthorized users to a "not authorized" page or home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  const access_token = getCookie("access_token");
  if (!access_token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed if authorized
  return NextResponse.next();
}

// Only run the middleware on specific routes (e.g., admin-only routes)
export const config = {
  matcher: ["/register-agency", "/"], // Define which paths the middleware should run on
};
