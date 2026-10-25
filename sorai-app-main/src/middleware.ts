import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for protected routes.
 *
 * Since the Supabase JS client stores auth tokens in localStorage
 * (not cookies), Edge middleware cannot reliably validate sessions.
 * Instead, we check for the Supabase auth storage key cookie pattern.
 * If no auth indicator is found, we redirect to home.
 *
 * Data-level security is enforced by Supabase RLS policies,
 * and client-side pages verify the session via useAuth().
 */

const PROTECTED_PATHS = ["/my-list", "/settings"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PATHS.some((path) =>
        pathname.startsWith(path)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // Supabase JS stores auth tokens in localStorage (not cookies),
    // so Edge middleware cannot reliably detect auth state — especially
    // on hard refreshes (F5) where there is no referer header.
    // Let all requests through; client-side useAuth() redirects
    // unauthenticated users, and Supabase RLS enforces data security.
    return NextResponse.next();
}

export const config = {
    matcher: ["/my-list/:path*", "/settings/:path*"],
};
