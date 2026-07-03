import { auth } from "@/lib/auth/server";
import { NextRequest } from "next/server";

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

export async function GET(req: NextRequest, ctx: unknown) {
  return _GET!(withNeonOrigin(req), ctx as never);
}

export async function POST(req: NextRequest, ctx: unknown) {
  return _POST!(withNeonOrigin(req), ctx as never);
}
