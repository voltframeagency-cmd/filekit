/**
 * SubtitleEngine.ts
 * 
 * High-precision parser and converter for video subtitle formats:
 * - SubRip (.srt): 00:00:01,000 --> 00:00:04,000 (comma delimiter)
 * - WebVTT (.vtt): 00:00:01.000 --> 00:00:04.000 (period delimiter + WEBVTT header)
 */

export interface SubtitleCue {
  id?: string;
  startTime: string; // HH:MM:SS,mmm or HH:MM:SS.mmm
  endTime: string;
  text: string;
}

export class SubtitleEngine {
  /**
   * Converts SubRip (.srt) text content into standard WebVTT (.vtt) format.
   */
  static srtToVtt(srtText: string): string {
    if (!srtText || !srtText.trim()) return "WEBVTT\n\n";

    const normalized = srtText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const blocks = normalized.trim().split(/\n\s*\n/);
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

      // Extract optional numeric or text cue ID
      const cueId = timeLineIdx > 0 ? lines[0] : "";
      const rawTimeLine = lines[timeLineIdx];
      // Convert SRT commas (00:01:20,000) to WebVTT dots (00:01:20.000)
      const vttTimeLine = rawTimeLine.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
      const textLines = lines.slice(timeLineIdx + 1).join("\n");

      if (cueId) {
        vttLines.push(cueId);
      }
      vttLines.push(vttTimeLine);
      vttLines.push(textLines);
      vttLines.push(""); // blank line separating cues
    }

    return vttLines.join("\n").trim() + "\n";
  }

  /**
   * Converts WebVTT (.vtt) text content back into SubRip (.srt) format.
   */
  static vttToSrt(vttText: string): string {
    if (!vttText || !vttText.trim()) return "";

    let normalized = vttText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    // Strip header lines starting with WEBVTT or NOTE
    normalized = normalized.replace(/^WEBVTT[^\n]*\n+/i, "");
    normalized = normalized.replace(/^NOTE[^\n]*\n+/gim, "");

    const blocks = normalized.trim().split(/\n\s*\n/);
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
      // Strip out WebVTT cue positioning metadata (e.g. line:0% position:50% align:middle)
      const cleanTimeLine = rawTimeLine.split(/\s+/).slice(0, 3).join(" ");
      // Convert WebVTT dots (00:01:20.000) to SRT commas (00:01:20,000)
      let srtTimeLine = cleanTimeLine.replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, "$1,$2");

      // Ensure full HH:MM:SS format if VTT used short MM:SS.mmm
      if (/^\d{2}:\d{2}\./.test(srtTimeLine) || /^\d{2}:\d{2},/.test(srtTimeLine)) {
        srtTimeLine = "00:" + srtTimeLine;
      }

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
