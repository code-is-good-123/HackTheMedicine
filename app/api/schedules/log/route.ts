import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDbConnected } from "@/lib/db";
import DoseLog from "@/models/DoseLog";
import { mockStore } from "@/lib/mockStore";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo_user_1";

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    try {
      await connectDB();
      if (isDbConnected()) {
        const logs = await DoseLog.find({ userId, date }).populate("medicationId");
        if (logs) {
          return NextResponse.json({ success: true, data: logs });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB DoseLog query failed, using in-memory:", dbErr);
    }

    const mockLogs = mockStore.getDoseLogs(date, userId);
    return NextResponse.json({ success: true, data: mockLogs });
  } catch (error) {
    console.error("GET dose logs error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch dose logs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const userId = (session?.user as any)?.id || body.userId || "demo_user_1";

    const { medicationId, scheduleId, scheduledTime, dosage, status, date } = body;
    const logDate = date || new Date().toISOString().split("T")[0];
    const logStatus = status || "taken";

    if (!medicationId || !scheduledTime) {
      return NextResponse.json(
        { error: "medicationId and scheduledTime are required" },
        { status: 400 }
      );
    }

    const logData = {
      userId,
      medicationId,
      scheduleId: scheduleId || "sched_default",
      scheduledTime,
      dosage: dosage || "1 Dose",
      status: logStatus,
      takenAt: logStatus === "taken" ? new Date() : undefined,
      date: logDate,
    };

    try {
      await connectDB();
      if (isDbConnected()) {
        const updated = await DoseLog.findOneAndUpdate(
          { userId, scheduleId: logData.scheduleId, scheduledTime, date: logDate },
          logData,
          { upsert: true, new: true }
        ).populate("medicationId");

        mockStore.logDose({
          ...logData,
          takenAt: logData.takenAt?.toISOString(),
        } as any);

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
      }
    } catch (dbErr) {
      console.warn("MongoDB log dose error, using in-memory:", dbErr);
    }

    const mockLogged = mockStore.logDose(logData as any);
    return NextResponse.json({ success: true, data: mockLogged }, { status: 200 });
  } catch (error) {
    console.error("POST dose log error:", error);
    return NextResponse.json({ success: false, error: "Failed to log dose" }, { status: 500 });
  }
}
