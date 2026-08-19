/**
 * SubtitleEngine.ts
 * 
 * Production-Hardened parser and converter for video subtitle formats:
 * - SubRip (.srt): 00:00:01,000 --> 00:00:04,000 (comma delimiter)
 * - WebVTT (.vtt): 00:00:01.000 --> 00:00:04.000 (period delimiter + WEBVTT header)
 * 
 * Hardened against:
 * 1. UTF-8 Byte Order Marks (BOM \uFEFF) from Windows Notepad
 * 2. Mixed line endings (\r\n, \n, \r)
 * 3. Short timestamp formats (MM:SS.mmm or M:SS.mmm)
 * 4. WebVTT STYLE, REGION, and NOTE commentary blocks
 * 5. WebVTT inline positioning attributes (line:0% position:50% align:middle)
 * 6. Non-sequential or malformed cue indices
 */

export interface SubtitleCue {
  id?: string;
  startTime: string;
  endTime: string;
  text: string;
}

export class SubtitleEngine {
  /**
   * Normalizes raw subtitle text: strips BOM, zero-width chars, and standardizes newlines.
   */
  private static cleanInput(text: string): string {
    if (!text) return "";
    return text
      .replace(/^\uFEFF/, "") // Strip UTF-8 BOM
      .replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  }

  /**
   * Standardizes short timestamps (e.g. "01:23.450" -> "00:01:23.450")
   */
  private static padTimestamp(ts: string, delimiter: "." | ","): string {
    let clean = ts.trim();
    // Check if timestamp is missing hours (e.g. MM:SS.mmm)
    const shortPattern = delimiter === "." ? /^(\d{1,2}):(\d{2})\.(\d{1,3})$/ : /^(\d{1,2}):(\d{2}),(\d{1,3})$/;
    const shortMatch = clean.match(shortPattern);
    if (shortMatch) {
      const minutes = shortMatch[1].padStart(2, "0");
      const seconds = shortMatch[2].padStart(2, "0");
      const millis = shortMatch[3].padEnd(3, "0");
      return `00:${minutes}:${seconds}${delimiter}${millis}`;
    }

    // Check standard HH:MM:SS.mmm
    const fullPattern = delimiter === "." ? /^(\d{1,2}):(\d{2}):(\d{2})\.(\d{1,3})$/ : /^(\d{1,2}):(\d{2}):(\d{2}),(\d{1,3})$/;
    const fullMatch = clean.match(fullPattern);
    if (fullMatch) {
      const hours = fullMatch[1].padStart(2, "0");
      const minutes = fullMatch[2].padStart(2, "0");
      const seconds = fullMatch[3].padStart(2, "0");
      const millis = fullMatch[4].padEnd(3, "0");
      return `${hours}:${minutes}:${seconds}${delimiter}${millis}`;
    }

    return clean;
  }

  /**
   * Converts SubRip (.srt) text content into standard WebVTT (.vtt) format.
   */
  static srtToVtt(srtText: string): string {
    const cleaned = this.cleanInput(srtText);
    if (!cleaned.trim()) return "WEBVTT\n\n";

    const blocks = cleaned.trim().split(/\n\s*\n/);
    const vttLines: string[] = ["WEBVTT", ""];

    for (const block of blocks) {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      let timeLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("-->")) {
          timeLineIdx = i;
          break;
        }
      }

      if (timeLineIdx === -1) continue;

      const cueId = timeLineIdx > 0 ? lines[0] : "";
      const rawTimeLine = lines[timeLineIdx];
      const parts = rawTimeLine.split("-->").map((p) => p.trim());
      if (parts.length < 2) continue;

      const rawStart = parts[0].replace(",", ".");
      const rawEnd = parts[1].split(/\s+/)[0].replace(",", ".");

      const paddedStart = this.padTimestamp(rawStart, ".");
      const paddedEnd = this.padTimestamp(rawEnd, ".");

      const vttTimeLine = `${paddedStart} --> ${paddedEnd}`;
      const textLines = lines.slice(timeLineIdx + 1).join("\n");

      if (cueId && !/^\d+$/.test(cueId)) {
        vttLines.push(cueId);
      }
      vttLines.push(vttTimeLine);
      vttLines.push(textLines);
      vttLines.push("");
    }

    return vttLines.join("\n").trim() + "\n";
  }

  /**
   * Converts WebVTT (.vtt) text content back into SubRip (.srt) format.
   */
  static vttToSrt(vttText: string): string {
    let cleaned = this.cleanInput(vttText);
    if (!cleaned.trim()) return "";

    // Strip header lines, comments, styles, and regions
    cleaned = cleaned.replace(/^WEBVTT[^\n]*\n+/i, "");
    cleaned = cleaned.replace(/^NOTE(?:\s[^\n]*)?\n(?:[^\n]+\n)*\n*/gim, "");
    cleaned = cleaned.replace(/^STYLE\n(?:[^\n]+\n)*\n*/gim, "");
    cleaned = cleaned.replace(/^REGION\n(?:[^\n]+\n)*\n*/gim, "");

    const blocks = cleaned.trim().split(/\n\s*\n/);
    const srtLines: string[] = [];
    let cueCounter = 1;

    for (const block of blocks) {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      let timeLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes("-->")) {
          timeLineIdx = i;
          break;
        }
      }

      if (timeLineIdx === -1) continue;

      const rawTimeLine = lines[timeLineIdx];
      const parts = rawTimeLine.split("-->").map((p) => p.trim());
      if (parts.length < 2) continue;

      const rawStart = parts[0].replace(".", ",");
      const rawEnd = parts[1].split(/\s+/)[0].replace(".", ",");

      const paddedStart = this.padTimestamp(rawStart, ",");
      const paddedEnd = this.padTimestamp(rawEnd, ",");

      const srtTimeLine = `${paddedStart} --> ${paddedEnd}`;
      const textLines = lines.slice(timeLineIdx + 1).join("\n");

      srtLines.push(cueCounter.toString());
      srtLines.push(srtTimeLine);
      srtLines.push(textLines);
      srtLines.push("");
      cueCounter++;
    }

    return srtLines.join("\n").trim() + "\n";
  }
}
