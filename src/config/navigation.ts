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
    href: "/#convert"
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
