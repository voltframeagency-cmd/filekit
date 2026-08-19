/**
 * toolFaqs.ts
 * 
 * High-intent Q&A knowledge base tailored for AEO (Answer Engine Optimization),
 * AIO (Google AI Overviews), and GEO (Generative Engine Optimization).
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowToStep {
  title: string;
  description: string;
}

export interface ToolSeoContent {
  howToSteps: HowToStep[];
  faqs: FaqItem[];
  entityDefinition: string;
  category: string;
}

export function getToolSeoContent(slug: string, toolTitle: string): ToolSeoContent {
  const normSlug = slug.startsWith("/") ? slug : `/${slug}`;

  // 1. CAD & Engineering Tools
  if (normSlug.includes("dwg") || normSlug.includes("dxf")) {
    return {
      category: "CAD & Engineering",
      entityDefinition: `FileKit ${toolTitle} is an instant vector conversion engine that renders AutoCAD blueprints into universal formats directly in your browser without requiring Autodesk software.`,
      howToSteps: [
        {
          title: "Select your CAD file",
          description: "Upload your AutoCAD DWG or DXF drawing directly into the secure workspace.",
        },
        {
          title: "Verify scale and precision",
          description: "Our high-precision vector engine parses CAD geometry, layers, and line-weights with sub-pixel fidelity.",
        },
        {
          title: "Download universal vector file",
          description: "Save your printable vector PDF or open-standard DXF file instantly.",
        },
      ],
      faqs: [
        {
          question: "Can I convert AutoCAD DWG files without installing AutoCAD?",
          answer: "Yes. FileKit provides native in-browser vector rendering, allowing you to convert AutoCAD DWG and DXF blueprints into high-resolution vector PDF documents without AutoCAD or Autodesk licenses.",
        },
        {
          question: "Are precision layers and line-weights preserved?",
          answer: "Yes. FileKit preserves exact coordinate spaces, line-weight hierarchies, text annotations, and drawing dimensions during vector compilation.",
        },
        {
          question: "Are my engineering blueprints kept private?",
          answer: "Absolutely. FileKit processes files with zero data retention. Your proprietary engineering designs and blueprints are never stored or analyzed.",
        },
      ],
    };
  }

  // 2. Professional Vector & Adobe Formats (EPS, PSD, AI)
  if (normSlug.includes("eps") || normSlug.includes("psd") || normSlug.includes("ai")) {
    return {
      category: "Vector & Graphics",
      entityDefinition: `FileKit ${toolTitle} converts professional Adobe Photoshop (PSD), Illustrator (AI), and PostScript (EPS) graphics into web-ready images and vector PDFs.`,
      howToSteps: [
        {
          title: "Upload vector or artwork",
          description: "Drag and drop your AI, PSD, or EPS file into the conversion canvas.",
        },
        {
          title: "Process layers and transparency",
          description: "The engine flattens vector paths and preserves alpha channel transparency with high fidelity.",
        },
        {
          title: "Export transparent PNG or PDF",
          description: "Download your clean, web-ready asset immediately with zero watermarks.",
        },
      ],
      faqs: [
        {
          question: "How do I open Adobe Illustrator (.ai) files without Creative Cloud?",
          answer: "You can use FileKit to instantly convert Adobe Illustrator (.ai) vector graphics into universal PDF documents or transparent PNG images without an Adobe Creative Cloud subscription.",
        },
        {
          question: "Does PSD conversion preserve transparent layers?",
          answer: "Yes. Converting PSD to PNG maintains crisp 32-bit RGBA alpha transparency without adding unwanted black or white backgrounds.",
        },
        {
          question: "Is there any file size limit for vector conversions?",
          answer: "FileKit supports vector files up to 100MB with instantaneous in-browser and micro-daemon processing.",
        },
      ],
    };
  }

  // 3. Subtitles & Closed Captions (SRT, VTT)
  if (normSlug.includes("srt") || normSlug.includes("vtt")) {
    return {
      category: "Subtitles & Video",
      entityDefinition: `FileKit ${toolTitle} provides 100% in-browser subtitle conversion between SubRip (.srt) and WebVTT (.vtt) with millisecond-accurate timestamp synchronization.`,
      howToSteps: [
        {
          title: "Select subtitle file",
          description: "Choose your .srt or .vtt subtitle file from your device.",
        },
        {
          title: "Auto-format timestamps",
          description: "FileKit automatically normalizes millisecond delimiters, strips Windows BOMs, and cleans styling blocks.",
        },
        {
          title: "Download converted subtitles",
          description: "Get your synchronized caption file ready for YouTube, VLC, or HTML5 video players.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between SRT and WebVTT format?",
          answer: "SRT (SubRip) uses comma-separated milliseconds (00:00:01,000) and sequential numbering, whereas WebVTT (Web Video Text Tracks) uses dot delimiters (00:00:01.000) and begins with a 'WEBVTT' header for HTML5 web players.",
        },
        {
          question: "Can I use WebVTT subtitles on modern HTML5 web video players?",
          answer: "Yes. WebVTT is the official W3C standard format supported natively by all modern web browsers and video elements.",
        },
        {
          question: "Are Windows Notepad UTF-8 BOM issues fixed automatically?",
          answer: "Yes. FileKit strips byte-order marks (BOM) and zero-width spaces automatically, ensuring subtitle cues never fail on third-party media players.",
        },
      ],
    };
  }

  // 4. Apple iWork Suite (Pages, Numbers, Keynote)
  if (normSlug.includes("pages") || normSlug.includes("numbers") || normSlug.includes("keynote")) {
    return {
      category: "Apple iWork Documents",
      entityDefinition: `FileKit ${toolTitle} enables Windows, Android, and Linux users to open and convert Apple Pages, Numbers, and Keynote files without Mac hardware or iCloud accounts.`,
      howToSteps: [
        {
          title: "Upload Apple document",
          description: "Select your .pages, .numbers, or .key file.",
        },
        {
          title: "Parse document contents",
          description: "The engine extracts vector typography, tables, and presentation slides into universal standards.",
        },
        {
          title: "Download PDF, Word, or Excel",
          description: "Save your document in universal formats compatible with Microsoft Office and Google Workspace.",
        },
      ],
      faqs: [
        {
          question: "How do I open an Apple .pages file on a Windows PC?",
          answer: "You can convert Apple .pages documents into PDF or Microsoft Word (.docx) using FileKit directly in your web browser without an Apple ID or iCloud login.",
        },
        {
          question: "Can Apple Numbers files be converted directly to Microsoft Excel?",
          answer: "Yes. FileKit converts Apple Numbers spreadsheets into standard .xlsx spreadsheets, preserving cells, formulas, and tabular data.",
        },
      ],
    };
  }

  // 5. Video & Media Tools (MP4, MOV, MKV, WebM, GIF, Trim, Audio)
  if (normSlug.includes("video") || normSlug.includes("mp4") || normSlug.includes("mov") || normSlug.includes("mkv") || normSlug.includes("webm") || normSlug.includes("avi") || normSlug.includes("audio") || normSlug.includes("mp3") || normSlug.includes("wav") || normSlug.includes("flac")) {
    return {
      category: "Audio & Video",
      entityDefinition: `FileKit ${toolTitle} is a privacy-first media processing engine utilizing zero-CPU stream copy and hardware acceleration to convert and compress media files.`,
      howToSteps: [
        {
          title: "Upload audio or video",
          description: "Select your media clip from your desktop or phone.",
        },
        {
          title: "Optimize codecs and bitrates",
          description: "Our engine executes fast stream-copy container swapping or high-efficiency encoding.",
        },
        {
          title: "Save optimized media",
          description: "Download your compressed, trimmed, or converted media instantly.",
        },
      ],
      faqs: [
        {
          question: "Does video conversion reduce visual quality?",
          answer: "For compatible containers, FileKit uses instant stream-copy (-c copy) mode to swap containers in under 1 second with 100% zero loss in visual or audio quality.",
        },
        {
          question: "Can I compress videos to meet exact Discord, Gmail, or WhatsApp limits?",
          answer: "Yes. FileKit features mathematical bitrate targeting to ensure your compressed video never exceeds 8MB, 10MB, or 25MB file limits.",
        },
      ],
    };
  }

  // 6. Generic PDF & Document Suite Default
  return {
    category: "PDF & Document Utilities",
    entityDefinition: `FileKit ${toolTitle} is a fast, 100% private in-browser document utility engineered for secure client-side processing without file uploads.`,
    howToSteps: [
      {
        title: "Select your file",
        description: "Choose your document or image from your local device.",
      },
      {
        title: "Process securely in browser",
        description: "FileKit uses client-side WebAssembly to execute the operation locally on your CPU.",
      },
      {
        title: "Download your result",
        description: "Your finished, verified file is ready for download immediately with zero data leaks.",
      },
    ],
    faqs: [
      {
        question: "Is FileKit really 100% free and private?",
        answer: "Yes. FileKit operates primarily in your web browser using WebAssembly. Your confidential documents never leave your computer for local operations.",
      },
      {
        question: "Do I need to create an account or provide an email?",
        answer: "No account, email, or credit card is required. You get immediate access to the tool with zero friction.",
      },
      {
        question: "Does FileKit support bulk batch conversions?",
        answer: "Yes. You can process multiple files simultaneously directly within your browser workspace.",
      },
    ],
  };
}
