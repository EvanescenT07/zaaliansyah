import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const session = request.cookies.get("admin_session");
    const adminToken = process.env.ADMIN_SECRET_TOKEN;

    // Strict validation: admin token must be configured and matched
    if (!adminToken || !session?.value || session.value !== adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
