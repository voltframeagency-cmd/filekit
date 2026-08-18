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
      { label: "ICO to PNG", href: "/ico-to-png" },
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
      { label: "PNG to PDF", href: "/png-to-pdf" }
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
                { label: "Rotate Pages", href: "/rotate-pdf-pages" },
                { label: "Delete Pages", href: "/delete-pdf-pages" },
                { label: "Extract Pages", href: "/extract-pdf-pages" },
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
