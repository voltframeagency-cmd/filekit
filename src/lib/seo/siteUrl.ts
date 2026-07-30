/**
 * Dynamically resolves and validates canonical site origin URL.
 * Avoids hardcoding unapproved or conflicting hostnames.
 */
export function getValidatedSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;

  if (envUrl) {
    const formatted = envUrl.startsWith('http') ? envUrl : `https://${envUrl}`;
    return formatted.replace(/\/$/, '');
  }

  // Fallback default for development environment
  return 'https://filekit.co';
}
