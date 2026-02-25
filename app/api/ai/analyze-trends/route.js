import { NextResponse } from "next/server";

// In-memory cache (resets when server restarts)
let cachedHash = null;
let cachedInsight = null;

export async function POST(req) {
  try {
    const { diagnoses } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const validData = diagnoses?.filter(d => d && d.length > 2) || [];

    if (validData.length === 0) {
      return NextResponse.json({
        insight: "Add more clinical notes to enable AI trend detection."
      });
    }

    // Create dataset hash
    const datasetHash = validData.join("|");

    // ✅ 1. CACHE CHECK
    if (cachedHash === datasetHash && cachedInsight) {
      return NextResponse.json({
        insight: cachedInsight
      });
    }

    // ✅ 2. TRY GEMINI FIRST
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a clinical data analyst for an eye clinic.

Analyze this list of diagnoses:
${validData.join(", ")}

Identify the most common pattern and explain it in 2 professional sentences.
Focus on trends like myopia, digital strain, or refractive issues.
Keep it professional and neutral.
`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error("Gemini quota or API error");
      }

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiText = data.candidates[0].content.parts[0].text.trim();

        // Save to cache
        cachedHash = datasetHash;
        cachedInsight = aiText;

        return NextResponse.json({ insight: aiText });
      }

      throw new Error("Invalid Gemini response");

    } catch (geminiError) {
      console.warn("Gemini failed. Using local AI fallback.");
    }

    // ✅ 3. LOCAL FALLBACK AI (ALWAYS WORKS)

    const counts = {};
    validData.forEach(d => {
      counts[d] = (counts[d] || 0) + 1;
    });

    const topDiagnosis = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    const localInsight = `
The most frequently observed clinical pattern is "${topDiagnosis}".
This suggests a recurring visual demand or refractive concern among the patient population, potentially linked to lifestyle factors such as prolonged near-work or digital device usage.
`.trim();

    // Save fallback to cache
    cachedHash = datasetHash;
    cachedInsight = localInsight;

    return NextResponse.json({ insight: localInsight });

  } catch (error) {
    console.error("Trend Error:", error);

    return NextResponse.json({
      insight: "The system encountered an error processing the clinical dataset."
    });
  }
}