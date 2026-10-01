import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDbConnected } from "@/lib/db";
import Medication from "@/models/Medication";
import Schedule from "@/models/Schedule";
import { mockStore } from "@/lib/mockStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Medication ID is required" }, { status: 400 });
    }

    try {
      await connectDB();
      if (isDbConnected()) {
        const med = await Medication.findById(id);
        if (med) {
          const schedule = await Schedule.findOne({ medicationId: id });
          return NextResponse.json({ success: true, data: { ...med.toObject(), schedule } });
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB get medication failed, checking mock store:", dbErr);
    }

    const mockMed = mockStore.getMedicationById(id);
    if (!mockMed) {
      return NextResponse.json({ success: false, error: "Medication not found" }, { status: 404 });
    }

    const sched = mockStore.getSchedules().find((s) => {
      const medId = typeof s.medicationId === "string" ? s.medicationId : s.medicationId._id;
      return medId === id;
    });

    return NextResponse.json({ success: true, data: { ...mockMed, schedule: sched || null } });
  } catch (error) {
    console.error("GET medication [id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch medication" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Medication ID is required" }, { status: 400 });
    }

    try {
      await connectDB();
      if (isDbConnected()) {
        await Medication.findByIdAndDelete(id);
        await Schedule.deleteMany({ medicationId: id });
      }
    } catch (dbErr) {
      console.warn("MongoDB delete medication error:", dbErr);
    }

    mockStore.deleteMedication(id);
    return NextResponse.json({ success: true, message: "Medication removed" });
  } catch (error) {
    console.error("DELETE medication [id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete medication" }, { status: 500 });
  }
}
