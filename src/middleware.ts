import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/upload"];
// Auth pages — redirect to dashboard if already logged in
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
        setAll: () => {}, // Server components can't set cookies
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // Protected routes → redirect to login
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Auth routes → redirect to dashboard if logged in
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/pricing/:path*", "/auth/:path*"],
};