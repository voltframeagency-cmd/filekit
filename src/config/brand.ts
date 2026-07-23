export interface BrandConfig {
  name: string;
  tagline: string;
  description: string;
  copyrightNotice: string;
  supportEmail: string | null;
  brandClearance: "pending" | "cleared";
  ownedDomainStatus: "pending" | "verified";
  socials: {
    github: string | null;
    twitter: string | null;
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
    "Supported operations run locally in your browser using browser-native APIs, Canvas or OffscreenCanvas, PDF.js, pdf-lib, and Web Workers where supported. Your files are not uploaded for supported local operations.",
  copyrightNotice: `© ${new Date().getFullYear()} FileKit. All rights reserved. Zero file uploads.`,
  supportEmail: null, // Pending final owned domain verification
  brandClearance: "pending",
  ownedDomainStatus: "pending",
  socials: {
    github: null,
    twitter: null
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
