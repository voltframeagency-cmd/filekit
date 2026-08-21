import json

# Base English Q&As for each of the 7 families
BASE_FAQS = {
    "cad": [
        ("Do I need AutoCAD or any specialized software installed to convert DWG or DXF files?",
         "No. FileKit processes AutoCAD DWG and DXF blueprints directly in your web browser using client-side vector parsing engines, completely eliminating the need for expensive software licenses."),
        ("Will vector layers, lineweights, and architectural dimensions be preserved?",
         "Yes. All line geometries, text annotations, coordinate systems, and architectural dimensions are rendered with exact vector fidelity."),
        ("Is my proprietary engineering drawing uploaded to a third-party server?",
         "Never. Your files are processed locally within your browser sandbox. Your intellectual property and blueprints never leave your device.")
    ],
    "vector": [
        ("Can I convert AI, EPS, or PSD files without Adobe Creative Cloud?",
         "Yes. FileKit renders vector paths and raster layers directly in your browser without requiring Adobe Illustrator or Photoshop licenses."),
        ("Will vector paths and color profiles remain sharp and accurate?",
         "Yes. The engine extracts exact vector outlines and high-resolution layers with full RGB/CMYK color preservation."),
        ("Are my proprietary artwork and graphics stored on any servers?",
         "No. All design files are converted locally in memory and discarded the moment you finish or close your browser tab.")
    ],
    "subtitles": [
        ("What is the difference between SRT and WebVTT subtitles?",
         "SRT uses comma-separated millisecond timestamps (00:00:01,000) and is standard for media players. WebVTT uses period timestamps (00:00:01.000) and supports CSS styling for HTML5 web video."),
        ("Will timecodes and subtitle cue numbers be kept in perfect sync?",
         "Yes. FileKit parses microsecond timestamps and reformats syntax with zero timing drift across all media players."),
        ("How do I use the converted subtitles on YouTube or video players?",
         "Download the converted .vtt or .srt file and upload it directly in YouTube Studio, Vimeo, or your video player settings.")
    ],
    "apple": [
        ("How do I open Apple Pages, Numbers, or Keynote files on Windows or Android?",
         "Simply upload your .pages, .numbers, or .key file to FileKit to convert it into universally compatible PDF, Word (DOCX), or Excel (XLSX) formats."),
        ("Will Apple fonts, mathematical formulas, and spreadsheet tables stay intact?",
         "Yes. The engine converts typography, cell formatting, formulas, and slide transitions with pixel-perfect visual fidelity."),
        ("Do I need an iCloud account or an Apple device to convert iWork files?",
         "No. FileKit works on any device and modern web browser with zero Apple accounts or cloud logins required.")
    ],
    "image": [
        ("Does image conversion or compression reduce visual clarity?",
         "FileKit uses intelligent perceptual quantization to reduce file size while preserving crisp edges, color depth, and sharpness."),
        ("Which image format should I choose for the best web performance?",
         "WebP and AVIF provide the best compression efficiency with up to 70% smaller file sizes than traditional JPG and PNG."),
        ("Are my private photos and camera EXIF metadata stored on your servers?",
         "No. Your photos are processed 100% locally in your browser, and EXIF metadata can be stripped automatically for privacy.")
    ],
    "audio_video": [
        ("Can I convert and compress audio and video files without quality loss?",
         "Yes. FileKit applies adaptive bitrate throttling and perceptual encoding to maintain crystal clear sound and HD resolution."),
        ("What video and audio formats can I convert directly in my browser?",
         "You can convert MP4, MOV, AVI, MKV, WebM, MP3, WAV, FLAC, M4A, OGG, and AAC with zero third-party software."),
        ("Are my audio and video recordings kept private and secure?",
         "Yes. Processing occurs directly on your device through client-side WebAssembly, ensuring your media files remain completely private.")
    ],
    "pdf": [
        ("Is FileKit completely free with no hidden subscriptions or limits?",
         "Yes. All essential PDF conversion, compression, editing, OCR, and merging tools are 100% free with no account creation required."),
        ("Are my sensitive PDF documents and signatures kept private?",
         "Absolutely. FileKit processes documents locally inside your browser sandbox. Your confidential files never touch our servers."),
        ("Does FileKit preserve text formatting, embedded fonts, and page layouts?",
         "Yes. The engine strictly adheres to ISO PDF standards, preserving vector graphics, form fields, and crisp typography.")
    ]
}

print("Base FAQs ready.")
