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
      { label: "WebP to PNG", href: "/webp-to-png" }
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
        }
      ]
    }
  },
  {
    id: "resize",
    label: "Resize",
    href: "/#resize"
  },
  {
    id: "pdf-tools",
    label: "PDF Tools",
    href: "/compress-pdf"
  },
  {
    id: "pricing",
    label: "Pricing",
    href: "/#pricing"
  }
];
