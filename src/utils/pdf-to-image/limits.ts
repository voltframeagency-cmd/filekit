export interface DeviceBudget {
  maxBytes: number;
  maxPages: number;
  maxConcurrentRenders: number;
}

export const PDF_TO_IMAGE_LIMITS = {
  desktop: {
    maxBytes: 100 * 1024 * 1024, // 100 MB
    maxPages: 200,
    maxConcurrentRenders: 1,
  },
  mobile: {
    maxBytes: 40 * 1024 * 1024, // 40 MB
    maxPages: 75,
    maxConcurrentRenders: 1,
  },
  safari: {
    maxBytes: 40 * 1024 * 1024, // 40 MB
    maxPages: 75,
    maxConcurrentRenders: 1,
  },
} as const;

export function getDeviceBudget(): DeviceBudget {
  if (typeof window === "undefined") return PDF_TO_IMAGE_LIMITS.desktop;

  const userAgent = navigator.userAgent || "";
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

  if (isMobile) return PDF_TO_IMAGE_LIMITS.mobile;
  if (isSafari) return PDF_TO_IMAGE_LIMITS.safari;
  return PDF_TO_IMAGE_LIMITS.desktop;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
}
