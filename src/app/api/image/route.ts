export const runtime = "edge";

function svgPlaceholder(label: string) {
  const text = encodeURIComponent((label || "Image").slice(0, 24));
  return `
    <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='#e5e7eb' offset='0'/>
          <stop stop-color='#f1f5f9' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial'
        font-size='36' fill='#475569'>${text}</text>
    </svg>
  `;
}

function badRequest(msg = "Bad Request") {
  return new Response(msg, { status: 400 });
}

async function fetchWithHeaders(u: string, signal?: AbortSignal) {
  return fetch(u, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: new URL(u).origin,
    },
    signal,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get("u");
  const label = searchParams.get("label") || "Image";
  if (!u) return badRequest("Missing ?u");

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 5000);

  try {
    let resp = await fetchWithHeaders(u, ac.signal);

    if (!resp.ok || !resp.body) {
      const noProto = u.replace(/^https?:\/\//i, "");
      const viaWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(
        noProto
      )}&output=jpg`;
      resp = await fetchWithHeaders(viaWeserv, ac.signal);
    }

    if (!resp.ok || !resp.body) {
      throw new Error("Upstream failed");
    }

    const contentType = resp.headers.get("content-type") || "image/jpeg";

    const cacheCtl =
      process.env.NODE_ENV === "production"
        ? "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800"
        : "public, max-age=600, stale-while-revalidate=86400";

    const headers = new Headers({
      "Content-Type": contentType,
      "Cache-Control": cacheCtl,
      "X-Proxy-Ok": "1",
    });
    return new Response(resp.body, { headers });
  } catch {
    const svg = svgPlaceholder(label);
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store",
        "X-Proxy-Ok": "0",
      },
      status: 200,
    });
  } finally {
    clearTimeout(timeout);
  }
}
