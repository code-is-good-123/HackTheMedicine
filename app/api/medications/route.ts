import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB, isDbConnected } from "@/lib/db";
import Medication from "@/models/Medication";
import { mockStore } from "@/lib/mockStore";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || "demo_user_1";

    try {
      await connectDB();
      if (isDbConnected()) {
        const meds = await Medication.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: meds || [] });
      }
    } catch (dbErr) {
      console.warn("MongoDB medications query failed, using in-memory:", dbErr);
    }

    const mockMeds = mockStore.getMedications(userId);
    return NextResponse.json({ success: true, data: mockMeds });
  } catch (error) {
    console.error("GET medications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch medications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const userId = (session?.user as any)?.id || body.userId || "demo_user_1";

    if (!body.name || !body.aiSummary) {
      return NextResponse.json(
        { error: "Medication name and AI summary are required" },
        { status: 400 }
      );
    }

    const medData = {
      userId,
      name: body.name,
      brandName: body.brandName,
      barcode: body.barcode,
      source: body.source || "ai_generated",
      aiSummary: body.aiSummary,
    };

    try {
      await connectDB();
      if (isDbConnected()) {
        const created = await Medication.create(medData);
        return NextResponse.json({ success: true, data: created }, { status: 201 });
      }
    } catch (dbErr) {
      console.warn("MongoDB create medication failed, using in-memory:", dbErr);
    }

    const mockCreated = mockStore.addMedication(medData);
    return NextResponse.json({ success: true, data: mockCreated }, { status: 201 });
  } catch (error) {
    console.error("POST medication error:", error);
    return NextResponse.json({ success: false, error: "Failed to save medication" }, { status: 500 });
  }
}
