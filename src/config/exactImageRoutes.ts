export type ExactImageRouteConfig = {
  slug: string;
  targetBytes: number;
  targetLabel: string;

  title: string;
  description: string;
  h1: string;
  supportingCopy: string;

  analyticsOperation: string;

  successCopy: string;
  targetMissCopy: string;
  alreadyWithinCopy: string;
  noBenefitCopy: string;

  useCases: string[];
  instructions: string[];

  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const EXACT_IMAGE_ROUTES: Record<string, ExactImageRouteConfig> = {
  "100kb": {
    slug: "compress-image-to-100kb",
    targetBytes: 100 * 1024, // 102,400 bytes
    targetLabel: "100 KB",
    title: "Compress Image to 100 KB Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images below 100 KB locally in your browser. Perfect for application photos, signatures, and identity portals.",
    h1: "Compress Image to 100 KB",
    supportingCopy: "Make your image fit a strict 100 KB upload limit for forms, job applications, and identity portals.",
    analyticsOperation: "compress_image_to_100kb",
    successCopy: "Your image is ready and below 100 KB.",
    targetMissCopy: "We reduced the image, but could not reach 100 KB safely.",
    alreadyWithinCopy: "Your image is already below 100 KB.",
    noBenefitCopy: "This image is already efficiently compressed.",
    useCases: [
      "Online Passport & Visa Applications",
      "Digital Signatures & Identity Verification",
      "College & University Admission Portals",
      "Government Exam Registrations"
    ],
    instructions: [
      "Select your JPEG, PNG, or WebP image file.",
      "FileKit inspects the file locally in your browser memory.",
      "Click 'Compress to 100 KB' to start smart optimization.",
      "Preview the visual slider and download your output file."
    ],
    faqs: [
      {
        question: "How do I compress an image below 100 KB without losing quality?",
        answer: "FileKit uses client-side iterative quality and scale adjustment to reduce file size while keeping visual details intact."
      },
      {
        question: "Is my passport or signature image uploaded to any server?",
        answer: "No. FileKit processes 100% of your file locally in your web browser. No image data is ever uploaded."
      }
    ]
  },
  "200kb": {
    slug: "compress-image-to-200kb",
    targetBytes: 200 * 1024, // 204,800 bytes
    targetLabel: "200 KB",
    title: "Compress Image to 200 KB Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images below 200 KB locally in your browser. Fast, private, and no installation required.",
    h1: "Compress Image to 200 KB",
    supportingCopy: "Make your image fit a 200 KB upload limit. Ideal for official forms, resume photos, and document portals.",
    analyticsOperation: "compress_image_to_200kb",
    successCopy: "Your image is ready and below 200 KB.",
    targetMissCopy: "We reduced the image, but could not reach 200 KB safely.",
    alreadyWithinCopy: "Your image is already below 200 KB.",
    noBenefitCopy: "This image is already efficiently compressed.",
    useCases: [
      "Government Form Submissions",
      "Corporate Recruitment Portals",
      "Scholarship Applications",
      "Student ID Card Uploads"
    ],
    instructions: [
      "Choose a JPEG, PNG, or static WebP file.",
      "The preflight inspector reads image dimensions locally.",
      "Click 'Compress to 200 KB' to process.",
      "Download your verified output image."
    ],
    faqs: [
      {
        question: "Why do portal uploads strictly require 200 KB?",
        answer: "Many government and institutional database portals enforce a maximum 200 KB limit for storage and performance compliance."
      },
      {
        question: "Can I compress PNG images with transparent backgrounds?",
        answer: "Yes. FileKit preserves PNG transparency during compression."
      }
    ]
  },
  "500kb": {
    slug: "compress-image-to-500kb",
    targetBytes: 500 * 1024, // 512,000 bytes
    targetLabel: "500 KB",
    title: "Compress Image to 500 KB Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images below 500 KB locally in your browser. Great for email attachments, product photos, and web listings.",
    h1: "Compress Image to 500 KB",
    supportingCopy: "Shrink your image below 500 KB for fast email delivery, ecommerce catalogs, and business forms.",
    analyticsOperation: "compress_image_to_500kb",
    successCopy: "Your image is ready and below 500 KB.",
    targetMissCopy: "We reduced the image, but could not reach 500 KB safely.",
    alreadyWithinCopy: "Your image is already below 500 KB.",
    noBenefitCopy: "This image is already efficiently compressed.",
    useCases: [
      "Email Attachments & Newsletters",
      "E-commerce Product Listings (Shopify, eBay)",
      "Real Estate Property Photographs",
      "Business Expense Receipt Uploads"
    ],
    instructions: [
      "Drop or select your high-res product or document image.",
      "Preflight check validates file headers instantly.",
      "Click 'Compress to 500 KB'.",
      "Compare original vs optimized result and download."
    ],
    faqs: [
      {
        question: "Will 500 KB compression work for high-resolution camera photos?",
        answer: "Yes. High-resolution photos (4K/8K) are intelligently scaled and compressed to fit within 500 KB."
      },
      {
        question: "Are my photos kept private?",
        answer: "Yes. All compression operations run locally inside your browser memory."
      }
    ]
  },
  "1mb": {
    slug: "compress-image-to-1mb",
    targetBytes: 1024 * 1024, // 1,048,576 bytes
    targetLabel: "1 MB",
    title: "Compress Image to 1 MB Online | FileKit",
    description:
      "Compress JPEG, PNG, or WebP images below 1 MB locally in your browser. Ideal for job boards, marketplace listings, and web uploads.",
    h1: "Compress Image to 1 MB",
    supportingCopy: "Optimize large photographs below 1 MB for marketplace uploads, portfolios, and website performance.",
    analyticsOperation: "compress_image_to_1mb",
    successCopy: "Your image is ready and below 1 MB.",
    targetMissCopy: "We reduced the image, but could not reach 1 MB safely.",
    alreadyWithinCopy: "Your image is already below 1 MB.",
    noBenefitCopy: "This image is already efficiently compressed.",
    useCases: [
      "Job Boards & Portfolio Submissions",
      "Online Marketplace Uploads",
      "Website & Blog Image Optimization",
      "Social Media & Forum Posts"
    ],
    instructions: [
      "Select your large image file.",
      "FileKit runs local memory preflight analysis.",
      "Click 'Compress to 1 MB'.",
      "Save the optimized 1 MB image file."
    ],
    faqs: [
      {
        question: "Why compress an image to 1 MB?",
        answer: "1 MB is a standard balance between high visual clarity and fast web loading speeds."
      },
      {
        question: "Does FileKit support raw files or GIFs?",
        answer: "FileKit supports JPEG, PNG, and static WebP files. Animated GIFs are safely rejected in preflight."
      }
    ]
  }
};
