export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl) {
    return "https://filekit.app";
  }

  // Sanitize trailing slashes, paths, queries, fragments
  try {
    const parsed = new URL(envUrl.trim());
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "https://filekit.app";
  }
}

export function buildCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
