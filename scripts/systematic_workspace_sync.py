import os
import re

print("=== SYSTEMATICALLY ENFORCING LOCALIZATION PROP & CONTEXT SYNC ACROSS ALL WORKSPACES ===")

# 3. Update VideoWorkspace.tsx to accept language prop
with open('src/utils/video/VideoWorkspace.tsx', 'r', encoding='utf-8') as f:
    video_code = f.read()

video_code = video_code.replace(
    'export interface VideoWorkspaceProps {\n  mode: "compress" | "convert" | "trim" | "rotate" | "mute" | "speed" | "video-to-gif" | "video-to-mp3";\n  title: string;\n  subtitle: string;\n  allowedAccept?: string;\n}',
    'export interface VideoWorkspaceProps {\n  mode: "compress" | "convert" | "trim" | "rotate" | "mute" | "speed" | "video-to-gif" | "video-to-mp3";\n  title: string;\n  subtitle: string;\n  allowedAccept?: string;\n  language?: string;\n}'
)

video_code = video_code.replace(
    'export default function VideoWorkspace({\n  mode,\n  title,\n  subtitle,\n  allowedAccept = "video/*"\n}: VideoWorkspaceProps) {',
    'export default function VideoWorkspace({\n  mode,\n  title,\n  subtitle,\n  allowedAccept = "video/*",\n  language\n}: VideoWorkspaceProps) {'
)

video_code = video_code.replace(
    '<UploadDropzone\n            onFileSelect={handleFileSelected}\n            accept={allowedAccept}\n            isGeneric={false}\n          />',
    '<UploadDropzone\n            onFileSelect={handleFileSelected}\n            accept={allowedAccept}\n            isGeneric={false}\n            language={language}\n          />'
)

with open('src/utils/video/VideoWorkspace.tsx', 'w', encoding='utf-8') as f:
    f.write(video_code)

print("[OK] 3. VideoWorkspace.tsx updated with language prop.")

# 4. Update UniversalToolPage.tsx to pass language={locale} to ALL workspaces
with open('src/components/layout/UniversalToolPage.tsx', 'r', encoding='utf-8') as f:
    univ_code = f.read()

univ_code = univ_code.replace(
    '<AudioWorkspace\n          mode={audioMode}\n          title={meta.title}\n          subtitle={meta.description}\n        />',
    '<AudioWorkspace\n          mode={audioMode}\n          title={meta.title}\n          subtitle={meta.description}\n          language={locale}\n        />'
)

univ_code = univ_code.replace(
    '<VideoWorkspace\n          mode={videoMode}\n          title={meta.title}\n          subtitle={meta.description}\n        />',
    '<VideoWorkspace\n          mode={videoMode}\n          title={meta.title}\n          subtitle={meta.description}\n          language={locale}\n        />'
)

univ_code = univ_code.replace(
    '<SubtitleWorkspace\n          mode={subMode}\n          title={meta.title}\n          subtitle={meta.description}\n        />',
    '<SubtitleWorkspace\n          mode={subMode}\n          title={meta.title}\n          subtitle={meta.description}\n          language={locale}\n        />'
)

univ_code = univ_code.replace(
    '<ImageTransformWorkspace\n          mode={imageMode}\n          toolTitle={meta.title}\n          toolSlug={normSlug}\n          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".bmp", ".ico", ".svg"]}\n        />',
    '<ImageTransformWorkspace\n          mode={imageMode}\n          toolTitle={meta.title}\n          toolSlug={normSlug}\n          allowedExtensions={[".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".bmp", ".ico", ".svg"]}\n          language={locale}\n        />'
)

with open('src/components/layout/UniversalToolPage.tsx', 'w', encoding='utf-8') as f:
    f.write(univ_code)

print("[OK] 4. UniversalToolPage.tsx updated to pass language={locale} to Audio, Video, Subtitle, and Transform workspaces.")
print("=== SYSTEMATIC WORKSPACE LOCALIZATION COMPLETED ===")
