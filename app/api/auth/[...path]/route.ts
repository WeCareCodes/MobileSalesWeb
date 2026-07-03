import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

const { GET: _GET, POST: _POST } = auth.handler();

// Neon Auth (Better Auth) checks the Origin header against its trusted origins.
// Since our Next.js server acts as the proxy, we replace the browser's origin
// with the Neon Auth service's own origin so it passes CSRF validation.
function withNeonOrigin(req: NextRequest): NextRequest {
  const neonOrigin = new URL(process.env.NEON_AUTH_BASE_URL!).origin;
  const headers = new Headers(req.headers);
  headers.set("origin", neonOrigin);
  headers.delete("referer");
  return new NextRequest(req.url, {
    method: req.method,
    headers,
    body: req.body,
    // @ts-ignore — duplex required for streaming body in Node.js fetch
    duplex: "half",
  });
}

// Strip Domain attribute from Set-Cookie headers so the browser accepts them
// for mobile-sales-web.vercel.app (not the upstream Neon Auth domain).
function stripCookieDomain(response: Response): Response {
  const setCookies = response.headers.getSetCookie?.() ?? [];
  if (setCookies.length === 0) return response;

  const cleaned = new Headers(response.headers);
  // Headers API doesn't let us selectively delete set-cookie entries,
  // so rebuild from scratch.
  cleaned.delete("set-cookie");
  for (const cookie of setCookies) {
    const stripped = cookie
      .split(";")
      .map((s) => s.trim())
      .filter((s) => !s.toLowerCase().startsWith("domain="))
      .join("; ");
    cleaned.append("set-cookie", stripped);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: cleaned,
  });
}

export async function GET(req: NextRequest, ctx: unknown) {
  const res = await _GET!(withNeonOrigin(req), ctx as never);
  return stripCookieDomain(res);
}

export async function POST(req: NextRequest, ctx: unknown) {
  const res = await _POST!(withNeonOrigin(req), ctx as never);
  return stripCookieDomain(res);
}
