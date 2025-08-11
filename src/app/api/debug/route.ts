import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    feature: "duration-0-support",
    commit: "083b264",
    message: "Duration 0 validation fix is deployed",
    validationLogic: {
      old: "!duration (fails for 0)",
      new: "duration === undefined || duration === null || duration === '' (allows 0)"
    }
  });
}
