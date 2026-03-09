import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Features {
  age: number;
  heartRate: number;
  prInterval: number;
  qrsDuration: number;
  qtcInterval: number;
  stDeviation: number;
  pWaveAmplitude: number;
  lvhIndex: number;
  arrhythmiaIndex: number;
  s1Amplitude: number;
  s2Amplitude: number;
  s3Presence: boolean;
  s4Presence: boolean;
  murmurGrade: number;
  clickPresence: boolean;
  openingSnap: boolean;
}

export interface ClassificationResult {
  classification: string;
  therapeutics: string[];
  confirmatoryTests: string[];
  riskLevel: "low" | "medium" | "high";
  reasoning: string;
}

export async function classifyDisease(features: Features): Promise<ClassificationResult> {
  const prompt = `
You are an expert cardiologist AI. Analyze the following ECG and PCG features and classify the disease condition.
Features:
${JSON.stringify(features, null, 2)}

Possible classifications:
- Normal
- Mitral Valve Prolapse (MVP)
- Aortic Stenosis with Hidden Arrhythmia
- Heart Failure with Preserved EF (HFpEF)
- Pulmonary Hypertension
- Constrictive Pericarditis
- Hypertrophic Cardiomyopathy (HCM)

Based on the features, determine the most likely classification. Also provide suggested therapeutics, further confirmatory clinical tests (conventional tests), and a risk level (low, medium, high).

Return the result as a JSON object.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: { type: Type.STRING, description: "The classified disease condition." },
          therapeutics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Suggested therapeutics." },
          confirmatoryTests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Further confirmatory clinical tests." },
          riskLevel: { type: Type.STRING, description: "Risk level: low, medium, or high." },
          reasoning: { type: Type.STRING, description: "Reasoning for the classification." }
        },
        required: ["classification", "therapeutics", "confirmatoryTests", "riskLevel", "reasoning"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
