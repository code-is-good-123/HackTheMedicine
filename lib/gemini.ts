import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateSimpleMedicalInfo(medName: string, rawFdaData?: any) {
  // Use gemini-2.5-flash for fast, structured JSON generation
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          purpose: {
            type: SchemaType.STRING,
            description: "Simple sentence on what this medicine does",
          },
          bodyEffect: {
            type: SchemaType.STRING,
            description: "Simple explanation of how it works in the body",
          },
          conditionsTreated: {
            type: SchemaType.STRING,
            description: "List of common illnesses or symptoms it treats",
          },
          sideEffects: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 to 5 common side effects in plain words",
          },
          safetyInfo: {
            type: SchemaType.STRING,
            description: "Crucial safety warnings or things to avoid (e.g. take with food, avoid alcohol)",
          },
        },
        required: ["purpose", "bodyEffect", "conditionsTreated", "sideEffects", "safetyInfo"],
      },
    },
  });

  const prompt = `
You are a medical assistant for an application used in Nepal. 
Explain the medicine "${medName}" in extremely clear, simple, and direct language that a student in Class 10 in Nepal can easily understand. 
Avoid complex medical jargon.

${rawFdaData ? `Context from FDA database: ${JSON.stringify(rawFdaData)}` : "No official FDA record found, use general pharmaceutical knowledge."}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  return JSON.parse(responseText);
}