import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { searchOpenFDA } from "@/lib/openfda";
import { generateSimpleMedicalInfo } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { barcode, manualName } = await req.json();
    await connectDB();

    const searchQuery = barcode || manualName;
    if (!searchQuery) {
      return NextResponse.json({ error: "Barcode or medicine name is required" }, { status: 400 });
    }

    // 1. Query openFDA API
    const fdaResult = await searchOpenFDA(searchQuery);

    const medName = fdaResult?.brandName || manualName || "Unknown Medicine";
    const isFdaFound = !!fdaResult;

    // 2. Generate Grade-10 simplified information via OpenAI
    const aiSummary = await generateSimpleMedicalInfo(medName, fdaResult?.raw);

    return NextResponse.json({
      success: true,
      foundInFda: isFdaFound,
      medicine: {
        name: medName,
        barcode: barcode || null,
        source: isFdaFound ? "openfda" : "ai_generated",
        aiSummary,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process medicine details" }, { status: 500 });
  }
}
