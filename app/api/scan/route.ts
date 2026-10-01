import { NextRequest, NextResponse } from "next/server";
import { connectDB, isDbConnected } from "@/lib/db";
import { searchOpenFDA } from "@/lib/openfda";
import { generateSimpleMedicalInfo } from "@/lib/gemini";
import Medication from "@/models/Medication";
import { mockStore } from "@/lib/mockStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const barcode = body.barcode?.trim();
    const manualName = body.manualName?.trim() || body.name?.trim() || body.query?.trim();

    const searchQuery = barcode || manualName;
    if (!searchQuery) {
      return NextResponse.json(
        { error: "Please enter a medicine name or scan a valid barcode/NDC number." },
        { status: 400 }
      );
    }

    // Connect to DB if available (non-blocking)
    try {
      await connectDB();
    } catch {
      // Handled via fallback
    }

    // 1. Query openFDA API for official drug labeling
    const fdaResult = await searchOpenFDA(searchQuery);

    const medName =
      fdaResult?.brandName ||
      manualName ||
      (barcode ? `NDC ${barcode}` : "Prescription Medication");
    const isFdaFound = !!fdaResult;

    // 2. Generate 5-point plain English simplified information via Gemini AI
    const aiSummary = await generateSimpleMedicalInfo(medName, fdaResult?.raw);

    const medicineData = {
      name: medName,
      brandName: fdaResult?.brandName || undefined,
      barcode: barcode || undefined,
      source: (isFdaFound ? "openfda" : "ai_generated") as "openfda" | "ai_generated",
      aiSummary,
    };

    // If autoSave flag is set or userId provided, also persist
    let savedMedId: string | undefined;
    if (body.saveToCabinet && body.userId) {
      try {
        if (isDbConnected()) {
          const created = await Medication.create({
            userId: body.userId,
            ...medicineData,
          });
          savedMedId = created._id.toString();
        } else {
          const createdMock = mockStore.addMedication({
            userId: body.userId,
            ...medicineData,
          });
          savedMedId = createdMock._id;
        }
      } catch (saveErr) {
        console.warn("Failed to auto-save medication to DB, saved to mock:", saveErr);
        const createdMock = mockStore.addMedication({
          userId: body.userId,
          ...medicineData,
        });
        savedMedId = createdMock._id;
      }
    }

    return NextResponse.json({
      success: true,
      foundInFda: isFdaFound,
      medicine: {
        ...medicineData,
        _id: savedMedId,
      },
    });
  } catch (error) {
    console.error("Scan processing error:", error);
    return NextResponse.json(
      { error: "Failed to process medicine details. Please try again." },
      { status: 500 }
    );
  }
}
