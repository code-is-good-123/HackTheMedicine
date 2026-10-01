import { GoogleGenAI } from "@google/genai";

export interface SimpleMedicalInfo {
  purpose: string;
  bodyEffect: string;
  conditionsTreated: string;
  sideEffects: string[];
  safetyInfo: string;
}

export async function generateSimpleMedicalInfo(
  medName: string,
  rawFdaData?: any
): Promise<SimpleMedicalInfo> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are a friendly, compassionate medical clarity assistant for an everyday patient.
Explain the medicine "${medName}" in clear, simple, plain English that a 10th-grade student can easily understand.
Avoid difficult jargon. Be concise, accurate, and reassuring.

${
  rawFdaData
    ? `Context from official FDA database:
Brand: ${rawFdaData.openfda?.brand_name?.[0] || ""}
Generic: ${rawFdaData.openfda?.generic_name?.[0] || ""}
Purpose: ${rawFdaData.purpose?.[0] || ""}
Warnings: ${rawFdaData.warnings?.[0] || ""}`
    : "No official FDA record found, use general clinical pharmaceutical knowledge."
}

Return ONLY valid JSON matching this exact structure:
{
  "purpose": "1-2 plain sentences on what this medicine does in simple terms",
  "bodyEffect": "1-2 plain sentences explaining how it works inside the body",
  "conditionsTreated": "Short list or sentence of common illnesses, symptoms, or infections it treats",
  "sideEffects": ["Common side effect 1", "Common side effect 2", "Common side effect 3"],
  "safetyInfo": "Crucial safety warnings or instructions (e.g., take with food, avoid alcohol, finish full course)"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text?.trim() || "";
      if (text) {
        const parsed = JSON.parse(text);
        return {
          purpose: parsed.purpose || `Helps treat symptoms associated with ${medName}.`,
          bodyEffect: parsed.bodyEffect || `Works by interacting with body receptors to provide relief.`,
          conditionsTreated: parsed.conditionsTreated || `Conditions commonly managed by ${medName}.`,
          sideEffects: Array.isArray(parsed.sideEffects) && parsed.sideEffects.length > 0
            ? parsed.sideEffects
            : ["Mild nausea", "Drowsiness", "Upset stomach"],
          safetyInfo: parsed.safetyInfo || "Take strictly as prescribed by your healthcare provider.",
        };
      }
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent medical fallback:", err);
    }
  }

  // Graceful fallback if no API key or call fails
  const nameLower = medName.toLowerCase();
  let fallback: SimpleMedicalInfo = {
    purpose: `Prescribed medication used to treat specific health conditions and manage symptoms.`,
    bodyEffect: `Absorbed into your system to target the underlying causes of pain, infection, or inflammation.`,
    conditionsTreated: `Consult your doctor or pharmacist for specific conditions treated by ${medName}.`,
    sideEffects: ["Mild headache", "Nausea or stomach upset", "Drowsiness or dizziness"],
    safetyInfo: `Take as instructed on the package. Drink plenty of water and do not exceed the recommended dose.`,
  };

  if (nameLower.includes("amoxicillin") || nameLower.includes("penicillin")) {
    fallback = {
      purpose: "An antibiotic used to fight bacterial infections in various parts of the body.",
      bodyEffect: "Stops bacteria from building cell walls, killing them and curing the infection.",
      conditionsTreated: "Ear infections, throat infections, chest infections, and dental abscesses.",
      sideEffects: ["Diarrhea", "Mild stomach pain", "Nausea"],
      safetyInfo: "Always finish the complete course even if you feel better. Seek help if rash occurs.",
    };
  } else if (nameLower.includes("paracetamol") || nameLower.includes("acetaminophen") || nameLower.includes("tylenol")) {
    fallback = {
      purpose: "A common everyday painkiller and fever reducer.",
      bodyEffect: "Blocks chemical messengers in the brain that tell you you are feeling pain.",
      conditionsTreated: "Headaches, fever, muscle aches, mild arthritis, and common cold symptoms.",
      sideEffects: ["Very rare when taken correctly", "Liver strain if overdose"],
      safetyInfo: "Never take with other medicines containing paracetamol. Do not exceed 4000mg per 24 hours.",
    };
  } else if (nameLower.includes("ibuprofen") || nameLower.includes("advil") || nameLower.includes("motrin")) {
    fallback = {
      purpose: "An anti-inflammatory painkiller (NSAID) that eases pain and swelling.",
      bodyEffect: "Reduces hormones that cause pain and inflammation in your tissues.",
      conditionsTreated: "Back pain, joint pain, toothache, period pain, and sprains.",
      sideEffects: ["Stomach upset", "Heartburn", "Mild dizziness"],
      safetyInfo: "Always take with or after food or milk to protect your stomach lining.",
    };
  } else if (nameLower.includes("metformin")) {
    fallback = {
      purpose: "Medication used to lower blood sugar levels in type 2 diabetes.",
      bodyEffect: "Improves your body's sensitivity to insulin and reduces sugar made by the liver.",
      conditionsTreated: "Type 2 diabetes and gestational diabetes.",
      sideEffects: ["Bloating", "Diarrhea", "Metallic taste in mouth"],
      safetyInfo: "Take with food to minimize stomach upset. Stay well hydrated.",
    };
  } else if (nameLower.includes("cetirizine") || nameLower.includes("zyrtec") || nameLower.includes("loratadine")) {
    fallback = {
      purpose: "An antihistamine used to relieve allergy and hay fever symptoms.",
      bodyEffect: "Blocks histamine, a substance made by your immune system during allergic reactions.",
      conditionsTreated: "Sneezing, runny nose, itchy watery eyes, and hives or itchy skin rashes.",
      sideEffects: ["Mild sleepiness", "Dry mouth", "Headache"],
      safetyInfo: "Avoid driving or alcohol if this medicine makes you feel drowsy.",
    };
  }

  return fallback;
}
