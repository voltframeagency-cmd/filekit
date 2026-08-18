import { SupportedImageFormat } from "@/utils/image-converter/types";

export type ImageConversionRouteMode = "GENERAL" | "FIXED_PAIR";

export interface ImageConversionRouteConfig {
  slug: string;
  mode: ImageConversionRouteMode;
  expectedInputFormat?: SupportedImageFormat;
  fixedOutputFormat?: SupportedImageFormat;
  navigationLabel: string;
  h1: string;
  supportingCopy: string;
  analyticsOperation: string;
  jsonLdTitle: string;
  metaTitle: string;
  metaDescription: string;
}

export const IMAGE_CONVERSION_ROUTES: Record<string, ImageConversionRouteConfig> = {
  "/convert-image": {
    slug: "/convert-image",
    mode: "GENERAL",
    navigationLabel: "Image Converter",
    h1: "Image Converter",
    supportingCopy: "Convert JPEG, PNG, and static WebP images locally in your browser memory.",
    analyticsOperation: "convert_image",
    jsonLdTitle: "FileKit Image Converter",
    metaTitle: "Image Converter — Convert JPG, PNG, WebP Online | FileKit",
    metaDescription: "Convert JPEG, PNG, and static WebP images locally inside your browser memory."
  },
  "/jpg-to-png": {
    slug: "/jpg-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/jpeg",
    fixedOutputFormat: "image/png",
    navigationLabel: "JPG to PNG",
    h1: "Convert JPG to PNG",
    supportingCopy: "Convert JPG images to PNG format locally in your browser memory.",
    analyticsOperation: "jpg_to_png",
    jsonLdTitle: "FileKit Convert JPG to PNG",
    metaTitle: "Convert JPG to PNG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert JPG files to PNG format locally in your browser. Preserves visual details."
  },
  "/png-to-jpg": {
    slug: "/png-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/png",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "PNG to JPG",
    h1: "Convert PNG to JPG",
    supportingCopy: "Convert PNG images to JPG format locally in your browser memory with customizable background color for transparent pixels.",
    analyticsOperation: "png_to_jpg",
    jsonLdTitle: "FileKit Convert PNG to JPG",
    metaTitle: "Convert PNG to JPG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert PNG files to JPG format locally in your browser. Choose background color for transparent areas."
  },
  "/jpg-to-webp": {
    slug: "/jpg-to-webp",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/jpeg",
    fixedOutputFormat: "image/webp",
    navigationLabel: "JPG to WebP",
    h1: "Convert JPG to WebP",
    supportingCopy: "Convert JPG images to modern WebP format locally in your browser memory.",
    analyticsOperation: "jpg_to_webp",
    jsonLdTitle: "FileKit Convert JPG to WebP",
    metaTitle: "Convert JPG to WebP Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert JPG images to WebP format for faster web page load times."
  },
  "/png-to-webp": {
    slug: "/png-to-webp",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/png",
    fixedOutputFormat: "image/webp",
    navigationLabel: "PNG to WebP",
    h1: "Convert PNG to WebP",
    supportingCopy: "Convert PNG images to WebP format while preserving transparency and quality.",
    analyticsOperation: "png_to_webp",
    jsonLdTitle: "FileKit Convert PNG to WebP",
    metaTitle: "Convert PNG to WebP Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert PNG images to WebP format with full alpha transparency support."
  },
  "/webp-to-jpg": {
    slug: "/webp-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/webp",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "WebP to JPG",
    h1: "Convert WebP to JPG",
    supportingCopy: "Convert WebP images to universal JPG format locally in your browser memory.",
    analyticsOperation: "webp_to_jpg",
    jsonLdTitle: "FileKit Convert WebP to JPG",
    metaTitle: "Convert WebP to JPG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert WebP images to JPG format for maximum device compatibility."
  },
  "/webp-to-png": {
    slug: "/webp-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/webp",
    fixedOutputFormat: "image/png",
    navigationLabel: "WebP to PNG",
    h1: "Convert WebP to PNG",
    supportingCopy: "Convert WebP images to static PNG format while preserving alpha transparency.",
    analyticsOperation: "webp_to_png",
    jsonLdTitle: "FileKit Convert WebP to PNG",
    metaTitle: "Convert WebP to PNG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert WebP images to static PNG format with full transparency preservation."
  },
  "/png-to-ico": {
    slug: "/png-to-ico",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/png",
    fixedOutputFormat: "image/x-icon",
    navigationLabel: "PNG to ICO",
    h1: "Convert PNG to ICO Favicon",
    supportingCopy: "Generate multi-resolution Windows ICO and web favicon files directly in your browser memory.",
    analyticsOperation: "png_to_ico",
    jsonLdTitle: "FileKit Convert PNG to ICO",
    metaTitle: "Convert PNG to ICO Online — Multi-Resolution Favicon Generator | FileKit",
    metaDescription: "Convert PNG images to multi-resolution ICO favicon files (16x16, 32x32, 48x48, 64x64) locally in your browser."
  },
  "/heic-to-jpg": {
    slug: "/heic-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/heic",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "HEIC to JPG",
    h1: "Convert HEIC to JPG",
    supportingCopy: "Convert Apple HEIC/HEIF photos to universal JPG format locally in your browser with zero cloud upload.",
    analyticsOperation: "heic_to_jpg",
    jsonLdTitle: "FileKit Convert HEIC to JPG",
    metaTitle: "Convert HEIC to JPG Online — Free Private Image Converter | FileKit",
    metaDescription: "Convert iPhone HEIC photos to JPG format locally on your device without uploading files to any server."
  },
  "/heic-to-png": {
    slug: "/heic-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/heic",
    fixedOutputFormat: "image/png",
    navigationLabel: "HEIC to PNG",
    h1: "Convert HEIC to PNG",
    supportingCopy: "Convert Apple HEIC photos to lossless PNG format with full transparency support.",
    analyticsOperation: "heic_to_png",
    jsonLdTitle: "FileKit Convert HEIC to PNG",
    metaTitle: "Convert HEIC to PNG Online — Free Private Image Converter | FileKit",
    metaDescription: "Convert HEIC images to lossless PNG format directly in your browser with complete privacy."
  },
  "/avif-to-jpg": {
    slug: "/avif-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/avif",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "AVIF to JPG",
    h1: "Convert AVIF to JPG",
    supportingCopy: "Convert modern AVIF images to universal JPG format locally in your browser memory.",
    analyticsOperation: "avif_to_jpg",
    jsonLdTitle: "FileKit Convert AVIF to JPG",
    metaTitle: "Convert AVIF to JPG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert AVIF image files to standard JPEG photos directly in your browser."
  },
  "/avif-to-png": {
    slug: "/avif-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/avif",
    fixedOutputFormat: "image/png",
    navigationLabel: "AVIF to PNG",
    h1: "Convert AVIF to PNG",
    supportingCopy: "Convert modern AVIF photos to lossless PNG format with transparent background preservation.",
    analyticsOperation: "avif_to_png",
    jsonLdTitle: "FileKit Convert AVIF to PNG",
    metaTitle: "Convert AVIF to PNG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert AVIF images to PNG format with full alpha transparency directly on your device."
  },
  "/image-to-webp": {
    slug: "/image-to-webp",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/jpeg",
    fixedOutputFormat: "image/webp",
    navigationLabel: "Image to WebP",
    h1: "Convert Image to WebP",
    supportingCopy: "Convert images to ultra-compressed modern WebP format with zero server uploads.",
    analyticsOperation: "image_to_webp",
    jsonLdTitle: "FileKit Convert Image to WebP",
    metaTitle: "Convert Image to WebP Online — Free Image Compressor & Converter | FileKit",
    metaDescription: "Convert JPG, PNG, and photos to modern WebP format directly in your browser."
  },
  "/jpg-to-ico": {
    slug: "/jpg-to-ico",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/jpeg",
    fixedOutputFormat: "image/x-icon",
    navigationLabel: "JPG to ICO",
    h1: "Convert JPG to ICO Favicon",
    supportingCopy: "Convert JPG pictures into multi-resolution Windows ICO and web favicon files locally.",
    analyticsOperation: "jpg_to_ico",
    jsonLdTitle: "FileKit Convert JPG to ICO",
    metaTitle: "Convert JPG to ICO Online — Free Windows Favicon Generator | FileKit",
    metaDescription: "Convert JPG photos into multi-resolution Windows ICO favicon files directly on your device."
  },
  "/bmp-to-png": {
    slug: "/bmp-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/bmp",
    fixedOutputFormat: "image/png",
    navigationLabel: "BMP to PNG",
    h1: "Convert BMP to PNG",
    supportingCopy: "Convert Windows Bitmap (BMP) files to compressed lossless PNG format locally in browser memory.",
    analyticsOperation: "bmp_to_png",
    jsonLdTitle: "FileKit Convert BMP to PNG",
    metaTitle: "Convert BMP to PNG Online — Free Local Bitmap Converter | FileKit",
    metaDescription: "Convert uncompressed BMP bitmap images to lightweight PNG format directly in your browser."
  },
  "/bmp-to-jpg": {
    slug: "/bmp-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/bmp",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "BMP to JPG",
    h1: "Convert BMP to JPG",
    supportingCopy: "Convert Windows Bitmap (BMP) images to universal JPEG format locally with complete privacy.",
    analyticsOperation: "bmp_to_jpg",
    jsonLdTitle: "FileKit Convert BMP to JPG",
    metaTitle: "Convert BMP to JPG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert BMP images to standard JPG format directly in your browser with zero file uploads."
  },
  "/png-to-bmp": {
    slug: "/png-to-bmp",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/png",
    fixedOutputFormat: "image/bmp",
    navigationLabel: "PNG to BMP",
    h1: "Convert PNG to BMP",
    supportingCopy: "Convert PNG images to standard 24-bit Windows Bitmap (BMP) files directly on your device.",
    analyticsOperation: "png_to_bmp",
    jsonLdTitle: "FileKit Convert PNG to BMP",
    metaTitle: "Convert PNG to BMP Online — Free Local Image Converter | FileKit",
    metaDescription: "Export PNG graphics as uncompressed Windows BMP bitmap files with complete privacy."
  },
  "/jpg-to-bmp": {
    slug: "/jpg-to-bmp",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/jpeg",
    fixedOutputFormat: "image/bmp",
    navigationLabel: "JPG to BMP",
    h1: "Convert JPG to BMP",
    supportingCopy: "Convert JPG photos into standard Windows Bitmap (BMP) format locally in browser memory.",
    analyticsOperation: "jpg_to_bmp",
    jsonLdTitle: "FileKit Convert JPG to BMP",
    metaTitle: "Convert JPG to BMP Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert JPEG photos into Windows BMP bitmap format directly in your browser."
  },
  "/gif-to-png": {
    slug: "/gif-to-png",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/gif",
    fixedOutputFormat: "image/png",
    navigationLabel: "GIF to PNG",
    h1: "Convert GIF to PNG",
    supportingCopy: "Convert GIF graphics and stills into lossless PNG images with alpha transparency.",
    analyticsOperation: "gif_to_png",
    jsonLdTitle: "FileKit Convert GIF to PNG",
    metaTitle: "Convert GIF to PNG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert GIF pictures into crisp lossless PNG format directly in your browser."
  },
  "/gif-to-jpg": {
    slug: "/gif-to-jpg",
    mode: "FIXED_PAIR",
    expectedInputFormat: "image/gif",
    fixedOutputFormat: "image/jpeg",
    navigationLabel: "GIF to JPG",
    h1: "Convert GIF to JPG",
    supportingCopy: "Convert GIF animations and still images to universal JPG format locally with complete privacy.",
    analyticsOperation: "gif_to_jpg",
    jsonLdTitle: "FileKit Convert GIF to JPG",
    metaTitle: "Convert GIF to JPG Online — Free Local Image Converter | FileKit",
    metaDescription: "Convert GIF images to universal JPEG photo format directly in your browser with zero file uploads."
  }
};
