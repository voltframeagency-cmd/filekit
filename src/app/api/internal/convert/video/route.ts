import { NextRequest, NextResponse } from "next/server";
import { VideoEngine } from "@/utils/video/VideoEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { fileName, fileSizeBytes, mode, targetFormat, targetSizeBytes, durationSeconds } = body;

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const payload = VideoEngine.createConversionJobPayload(
      fileName,
      fileSizeBytes || 10 * 1024 * 1024,
      mode || "compress",
      targetFormat || "mp4"
    );

    let bitrateCalculation = null;
    if (targetSizeBytes && durationSeconds) {
      bitrateCalculation = VideoEngine.calculateTargetBitrate(durationSeconds, targetSizeBytes);
    }

    return NextResponse.json({
      success: true,
      job: payload,
      bitratePlan: bitrateCalculation,
      message: "Job dispatched to ephemeral container sandbox. Files deleted automatically."
    });
  } catch (err) {
    console.error("Video API route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
