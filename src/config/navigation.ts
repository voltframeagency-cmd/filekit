export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
  isPrimary?: boolean;
}

export interface NavSubGroup {
  label?: string;
  items: NavLinkItem[];
}

export interface NavCategoryGroup {
  title: string;
  primaryLink?: NavLinkItem;
  secondaryLink?: NavLinkItem;
  subgroups?: NavSubGroup[];
  items?: NavLinkItem[];
}

export interface MegaMenuConfig {
  id: string;
  label: string;
  groups: NavCategoryGroup[];
}

export interface TopNavItem {
  id: string;
  label: string;
  href?: string;
  megaMenu?: MegaMenuConfig;
}

export interface ConverterNavigationGroup {
  id: string;
  label: string;
  compactLabel?: string;
  accessibleLabel: string;
  links: Array<{
    label: string;
    href: string;
    accessibleLabel?: string;
  }>;
}

export const CONVERTER_NAVIGATION_GROUPS: ConverterNavigationGroup[] = [
  {
    id: "image-conversion",
    label: "IMAGE CONVERSION",
    compactLabel: "IMAGE",
    accessibleLabel: "Image format conversion tools",
    links: [
      { label: "Image Converter", href: "/convert-image" },
      { label: "JPG to PNG", href: "/jpg-to-png" },
      { label: "PNG to JPG", href: "/png-to-jpg" },
      { label: "JPG to WebP", href: "/jpg-to-webp" },
      { label: "PNG to WebP", href: "/png-to-webp" },
      { label: "WebP to JPG", href: "/webp-to-jpg" },
      { label: "WebP to PNG", href: "/webp-to-png" },
      { label: "PNG to ICO", href: "/png-to-ico" },
      { label: "HEIC to JPG", href: "/heic-to-jpg" },
      { label: "HEIC to PNG", href: "/heic-to-png" },
      { label: "AVIF to JPG", href: "/avif-to-jpg" },
      { label: "AVIF to PNG", href: "/avif-to-png" },
      { label: "SVG to PNG", href: "/svg-to-png" },
      { label: "SVG to JPG", href: "/svg-to-jpg" },
      { label: "JPG to ICO", href: "/jpg-to-ico" },
      { label: "Image to WebP", href: "/image-to-webp" },
      { label: "BMP to PNG", href: "/bmp-to-png" },
      { label: "BMP to JPG", href: "/bmp-to-jpg" },
      { label: "PNG to BMP", href: "/png-to-bmp" },
      { label: "JPG to BMP", href: "/jpg-to-bmp" },
      { label: "GIF to PNG", href: "/gif-to-png" },
      { label: "GIF to JPG", href: "/gif-to-jpg" },
      { label: "Grayscale Image", href: "/grayscale-image" },
      { label: "Invert Image", href: "/invert-image" },
      { label: "Blur Image", href: "/blur-image" },
      { label: "Crop Image", href: "/crop-image" },
      { label: "Resize Image", href: "/resize-image" },
      { label: "Rotate Image", href: "/rotate-image" },
      { label: "Flip Image", href: "/flip-image" }
    ]
  },
  {
    id: "pdf-to-image-conversion",
    label: "CONVERT FROM PDF",
    compactLabel: "FROM PDF",
    accessibleLabel: "PDF rasterization and image conversion tools",
    links: [
      { label: "PDF to Image", href: "/pdf-to-image" },
      { label: "PDF to JPG", href: "/pdf-to-jpg" },
      { label: "PDF to PNG", href: "/pdf-to-png" }
    ]
  },
  {
    id: "image-to-pdf-conversion",
    label: "CONVERT TO PDF",
    compactLabel: "TO PDF",
    accessibleLabel: "Image to PDF document conversion tools",
    links: [
      { label: "Image to PDF", href: "/image-to-pdf" },
      { label: "JPG to PDF", href: "/jpg-to-pdf" },
      { label: "PNG to PDF", href: "/png-to-pdf" },
      { label: "TIFF to PDF", href: "/tiff-to-pdf" }
    ]
  },
  {
    id: "audio-tools",
    label: "AUDIO TOOLS",
    compactLabel: "AUDIO",
    accessibleLabel: "Audio conversion, compression, and editing tools",
    links: [
      { label: "Convert Audio", href: "/convert-audio" },
      { label: "Compress Audio", href: "/compress-audio" },
      { label: "Video to MP3", href: "/video-to-mp3" },
      { label: "Trim Audio", href: "/trim-audio" },
      { label: "Merge Audio", href: "/merge-audio" }
    ]
  },
  {
    id: "video-tools",
    label: "VIDEO TOOLS",
    compactLabel: "VIDEO",
    accessibleLabel: "Video compression, conversion, GIF, and trimming tools",
    links: [
      { label: "Compress Video", href: "/compress-video" },
      { label: "Convert Video", href: "/convert-video" },
      { label: "Video to GIF", href: "/video-to-gif" },
      { label: "Trim Video", href: "/trim-video" },
      { label: "Mute Video", href: "/mute-video" }
    ]
  },
  {
    id: "archive-tools",
    label: "ARCHIVE & UTILITIES",
    compactLabel: "ARCHIVE",
    accessibleLabel: "ZIP extraction, creation, TAR conversion, font optimization, and privacy metadata stripping",
    links: [
      { label: "Extract ZIP", href: "/extract-zip" },
      { label: "Create ZIP", href: "/create-zip" },
      { label: "TAR to ZIP", href: "/tar-to-zip" },
      { label: "Strip EXIF", href: "/strip-exif" },
      { label: "TTF to WOFF2", href: "/ttf-to-woff2" },
      { label: "WOFF2 to TTF", href: "/woff2-to-ttf" }
    ]
  }
];

export const MAIN_NAVIGATION: TopNavItem[] = [
  {
    id: "compress",
    label: "Compress",
    megaMenu: {
      id: "compress-menu",
      label: "Compress Tools",
      groups: [
        {
          title: "IMAGE",
          primaryLink: {
            label: "Image Compressor",
            href: "/compress-image",
            isPrimary: true
          },
          secondaryLink: {
            label: "Compress to a Specific Size",
            href: "/compress-image-to-size"
          },
          subgroups: [
            {
              label: "Popular target sizes",
              items: [
                { label: "100 KB", href: "/compress-image-to-100kb" },
                { label: "200 KB", href: "/compress-image-to-200kb" },
                { label: "500 KB", href: "/compress-image-to-500kb" },
                { label: "1 MB", href: "/compress-image-to-1mb" }
              ]
            }
          ]
        },
        {
          title: "PDF",
          primaryLink: {
            label: "PDF Compressor",
            href: "/compress-pdf",
            isPrimary: true
          },
          secondaryLink: {
            label: "Compress to a Specific Size",
            href: "/compress-pdf-to-size"
          },
          subgroups: [
            {
              label: "Popular target sizes",
              items: [
                { label: "2 MB", href: "/compress-pdf-to-2mb" }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: "convert",
    label: "Convert",
    megaMenu: {
      id: "convert-menu",
      label: "Convert Tools",
      groups: [
        {
          title: "IMAGE",
          primaryLink: {
            label: "Image Converter",
            href: "/convert-image",
            isPrimary: true
          },
          subgroups: [
            {
              label: "Format pairs",
              items: [
                { label: "JPG to PNG", href: "/jpg-to-png" },
                { label: "PNG to JPG", href: "/png-to-jpg" },
                { label: "JPG to WebP", href: "/jpg-to-webp" },
                { label: "PNG to WebP", href: "/png-to-webp" },
                { label: "WebP to JPG", href: "/webp-to-jpg" },
                { label: "WebP to PNG", href: "/webp-to-png" }
              ]
            }
          ]
        },
        {
          title: "FROM PDF",
          primaryLink: {
            label: "PDF to Image",
            href: "/pdf-to-image",
            isPrimary: true
          },
          subgroups: [
            {
              label: "Formats",
              items: [
                { label: "PDF to JPG", href: "/pdf-to-jpg" },
                { label: "PDF to PNG", href: "/pdf-to-png" }
              ]
            }
          ]
        },
        {
          title: "TO PDF",
          primaryLink: {
            label: "Image to PDF",
            href: "/image-to-pdf",
            isPrimary: true
          },
          subgroups: [
            {
              label: "Formats",
              items: [
                { label: "JPG to PDF", href: "/jpg-to-pdf" },
                { label: "PNG to PDF", href: "/png-to-pdf" }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: "resize",
    label: "Resize",
    href: "/resize-image"
  },
  {
    id: "pdf-tools",
    label: "PDF Tools",
    megaMenu: {
      id: "pdf-tools-menu",
      label: "PDF Tools",
      groups: [
        {
          title: "PAGE EDITING & ORGANIZATION",
          primaryLink: {
            label: "Merge PDF Files",
            href: "/merge-pdf",
            isPrimary: true
          },
          secondaryLink: {
            label: "Split PDF Document",
            href: "/split-pdf"
          },
          subgroups: [
            {
              label: "Page Manipulation",
              items: [
                { label: "Reorder Pages", href: "/reorder-pdf-pages" },
                { label: "Reverse PDF", href: "/reverse-pdf" },
                { label: "Add Blank Page", href: "/add-blank-page-to-pdf" },
                { label: "Duplicate Pages", href: "/duplicate-pdf-pages" },
                { label: "Rotate Pages", href: "/rotate-pdf-pages" },
                { label: "Delete Pages", href: "/delete-pdf-pages" },
                { label: "Extract Pages", href: "/extract-pdf-pages" },
                { label: "PDF to Text", href: "/pdf-to-text" },
                { label: "Extract Images", href: "/extract-images-from-pdf" },
                { label: "Flatten PDF", href: "/flatten-pdf" },
                { label: "Add Watermark", href: "/watermark-pdf" }
              ]
            }
          ]
        },
        {
          title: "COMPRESS & CONVERT",
          primaryLink: {
            label: "PDF Compressor",
            href: "/compress-pdf",
            isPrimary: true
          },
          secondaryLink: {
            label: "Compress to Specific Size",
            href: "/compress-pdf-to-size"
          },
          subgroups: [
            {
              label: "PDF Conversions",
              items: [
                { label: "PDF to Image", href: "/pdf-to-image" },
                { label: "PDF to JPG", href: "/pdf-to-jpg" },
                { label: "PDF to PNG", href: "/pdf-to-png" },
                { label: "Image to PDF", href: "/image-to-pdf" }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "/#pricing"
  }
];
