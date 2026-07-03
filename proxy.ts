import { auth } from "@/lib/auth/server";

// Only protect user-specific routes; all browsing pages are public
export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
  matcher: ["/account/:path*", "/favorites/:path*"],
};
