import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/dashboard"];
// Pages that only make sense when logged OUT — members get sent to their area.
const GUEST_ONLY_PREFIXES = ["/membership/apply"];

const matches = (pathname: string, p: string) =>
  pathname === p || pathname.startsWith(`${p}/`);

// Best-effort decode of the JWT payload to route a signed-in user to the right
// home — admins to the console, members to their dashboard. Not verified: this
// only decides *where* to send them; the destination pages do the real checks.
function dashboardFor(token: string | undefined): string {
  if (!token) return "/dashboard";
  try {
    const payload = token.split(".")[1] ?? "";
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    b64 += "=".repeat((4 - (b64.length % 4)) % 4);
    const data = JSON.parse(atob(b64)) as { role?: string };
    return data.role === "admin" ? "/admin" : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("wpn_token");

  // Already signed in? Don't show the application form again.
  if (GUEST_ONLY_PREFIXES.some((p) => matches(pathname, p))) {
    if (token) {
      return NextResponse.redirect(
        new URL(dashboardFor(token.value), request.url)
      );
    }
    return NextResponse.next();
  }

  // Members-only pages: send signed-out visitors to login.
  if (PROTECTED_PREFIXES.some((p) => matches(pathname, p))) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/membership/apply/:path*",
  ],
};
