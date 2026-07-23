const BLOCKED_HOSTS = new Set([
  "filekit.app",
  "filekit.com",
  "filekit.dev",
  "test-filekit-compressor.org"
]);

export function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  return (
    BLOCKED_HOSTS.has(normalized) ||
    normalized.endsWith(".filekit.app") ||
    normalized.endsWith(".filekit.com") ||
    normalized.endsWith(".filekit.dev")
  );
}

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required in production environment");
    }
    return new URL("http://localhost:3000");
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SITE_URL value: "${raw}"`);
  }

  if (process.env.NODE_ENV === "production") {
    if (url.protocol !== "https:") {
      throw new Error("Production site URL must use HTTPS protocol (e.g., https://yourdomain.com)");
    }

    if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.endsWith(".vercel.app")) {
      throw new Error("Production site URL cannot use a local or preview deployment host");
    }

    if (isBlockedHostname(url.hostname)) {
      throw new Error(`Production site URL cannot use conflicted or unowned domain/subdomain: "${url.hostname}"`);
    }
  }

  if (url.pathname !== "/" || url.search !== "" || url.hash !== "" || url.username !== "" || url.password !== "") {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the origin (no path, query, hash, or credentials)");
  }

  return url;
}

export function buildCanonicalUrl(path: string): string {
  const siteUrlObj = getSiteUrl();
  const origin = siteUrlObj.origin;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}
