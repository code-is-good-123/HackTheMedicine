import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDbConnected } from "@/lib/db";
import Schedule from "@/models/Schedule";
import { mockStore } from "@/lib/mockStore";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo_user_1";

    try {
      await connectDB();
      if (isDbConnected()) {
        const schedules = await Schedule.find({ userId, active: true }).populate("medicationId");
        if (schedules && schedules.length > 0) {
          return NextResponse.json({ success: true, data: schedules });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB schedules query failed, using in-memory:", dbErr);
    }

    const mockSchedules = mockStore.getSchedules(userId);
    return NextResponse.json({ success: true, data: mockSchedules });
  } catch (error) {
    console.error("GET schedules error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch schedules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const userId = (session?.user as any)?.id || body.userId || "demo_user_1";

    const { medicationId, doses } = body;
    if (!medicationId || !doses || !Array.isArray(doses) || doses.length === 0) {
      return NextResponse.json(
        { error: "medicationId and at least one dose schedule are required" },
        { status: 400 }
      );
    }

    const schedData = {
      userId,
      medicationId,
      doses: doses.map((d: any) => ({
        time: d.time || "08:00",
        dosage: d.dosage || "1 Dose",
      })),
      active: true,
    };

    try {
      await connectDB();
      if (isDbConnected()) {
        // Upsert schedule
        const updated = await Schedule.findOneAndUpdate(
          { userId, medicationId },
          schedData,
          { upsert: true, new: true }
        ).populate("medicationId");

        mockStore.addSchedule({
          _id: updated._id.toString(),
          ...schedData,
        });

        return NextResponse.json({ success: true, data: updated }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("MongoDB create schedule error, using in-memory:", dbErr);
    }

    const mockCreated = mockStore.addSchedule(schedData);
    return NextResponse.json({ success: true, data: mockCreated }, { status: 201 });
  } catch (error) {
    console.error("POST schedule error:", error);
    return NextResponse.json({ success: false, error: "Failed to save schedule" }, { status: 500 });
  }
}
