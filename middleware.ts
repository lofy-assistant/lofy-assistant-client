import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/login", "/register", "/about-us", "/features"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  // Protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/protected")) {
    const sessionToken = request.cookies.get("session")?.value;

    if (!sessionToken) {
      // Check if phone parameter exists in query string
      const phone = request.nextUrl.searchParams.get("phone");

      if (phone) {
        try {
          // Check if user has PIN set via API endpoint
          const baseUrl = new URL(request.url).origin;
          const checkPinResponse = await fetch(`${baseUrl}/api/auth/check-pin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone }),
          });

          if (checkPinResponse.ok) {
            const { hasPin } = await checkPinResponse.json();

            // If no PIN, redirect to register; otherwise redirect to login
            const redirectPath = hasPin ? "/login" : "/register";
            const redirectUrl = new URL(redirectPath, request.url);
            redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
            redirectUrl.searchParams.set("phone", phone);
            return NextResponse.redirect(redirectUrl);
          } else {
            // Fallback to login if check fails
            const redirectUrl = new URL("/login", request.url);
            redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
            return NextResponse.redirect(redirectUrl);
          }
        } catch (error) {
          console.error("Error checking PIN status:", error);
          // Fallback to login if check fails
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
          return NextResponse.redirect(redirectUrl);
        }
      } else {
        // No phone parameter, redirect to login as before
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(redirectUrl);
      }
    }

    const session = await verifySession(sessionToken);

    if (!session) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
