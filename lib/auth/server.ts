import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
  logLevel: "debug",
  logger: {
    error: (msg, meta) => console.error(msg, JSON.stringify(meta ?? {})),
    warn:  (msg, meta) => console.warn(msg,  JSON.stringify(meta ?? {})),
    info:  (msg, meta) => console.log(msg,   JSON.stringify(meta ?? {})),
    debug: (msg, meta) => console.log(msg,   JSON.stringify(meta ?? {})),
  },
});
