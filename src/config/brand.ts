export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  copyrightNotice: string;
  supportEmail: string;
  socials: {
    github: string;
    twitter: string;
  };
  colors: {
    primary: string;
    midnightInk: string;
    background: string;
  };
  legal: {
    privacyPolicyPath: string;
    termsPath: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  name: "FileKit",
  tagline: "Private, Local-First File Tools in Your Browser",
  description:
    "Fast, private PDF compression, image compression, and format conversion powered directly by WebAssembly & Web Workers in your browser.",
  copyrightNotice: `© ${new Date().getFullYear()} FileKit. All rights reserved. Zero file uploads.`,
  supportEmail: "support@filekit.dev",
  socials: {
    github: "https://github.com/filekit-dev/filekit",
    twitter: "https://x.com/filekit_dev"
  },
  colors: {
    primary: "#2563EB",
    midnightInk: "#0F172A",
    background: "#FFFFFF"
  },
  legal: {
    privacyPolicyPath: "/privacy",
    termsPath: "/terms"
  }
};

export function getBrandTitle(routeTitle?: string): string {
  if (!routeTitle) {
    return `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`;
  }
  return `${routeTitle} — ${BRAND_CONFIG.name}`;
}

export function validateBrandConfig(): boolean {
  if (!BRAND_CONFIG.name || BRAND_CONFIG.name.trim() === "") {
    throw new Error("Brand configuration error: Brand name cannot be empty");
  }
  if (!BRAND_CONFIG.tagline || BRAND_CONFIG.tagline.trim() === "") {
    throw new Error("Brand configuration error: Brand tagline cannot be empty");
  }
  return true;
}
