import { NextRequest } from "next/server";

const ALLOWED_HOSTS = [
  "d2lfcsub12kx0l.cloudfront.net",
  "d3c6c8kv4if4l0.cloudfront.net",
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new Response("missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response("invalid url", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new Response("host not allowed", { status: 403 });
  }

  const upstream = await fetch(url, {
    headers: {
      Referer: "https://www.sogi.com.tw/",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
    },
  });

  if (!upstream.ok) {
    return new Response("upstream error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
