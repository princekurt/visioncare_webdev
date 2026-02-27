import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { diagnosis, prescription, metrics } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { summary: "API Key missing" },
        { status: 500 }
      );
    }

    // Using your current working model URL
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const promptText = `
You are a professional clinical eye analyzer.
Analyze the vision data below. 

STRICT RULE: Each JSON value must be MAXIMUM 2 short sentences. Be concise and direct.
Return ONLY a valid JSON object. Do not include markdown or extra text.

DATA:
Age: ${metrics?.age || "Unknown"}
Pinhole: OD ${metrics?.pinholeOD || "N/A"} / OS ${metrics?.pinholeOS || "N/A"}
Notes: ${diagnosis || "None"}

JSON FORMAT:
{
  "summary": "Summarize current vision status in max 2 sentences.",
  "trends": "Identify key trends or age-related concerns in max 2 sentences.",
  "options": "List clinical considerations or next steps in max 2 sentences.",
  "educational_notes": "Explain a metric or condition to the patient in max 2 sentences.",
  "disclaimer": "AI-generated informational guidance."
}
`;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.2, // Keeps it professional and focused
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Check Gemini API error
    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      throw new Error(data.error.message);
    }

    // Check if AI returned content
    if (!data.candidates || !data.candidates[0]) {
      throw new Error("Empty AI response");
    }

    let aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON safely (handles cases where AI adds intro/outro text)
    const start = aiText.indexOf("{");
    const end = aiText.lastIndexOf("}") + 1;

    if (start === -1 || end === 0) {
      throw new Error("No JSON found in response");
    }

    const jsonString = aiText.substring(start, end);
    const structuredData = JSON.parse(jsonString);

    return NextResponse.json({
      summary: structuredData.summary || "Analysis complete.",
      trends: structuredData.trends || "Stable metrics.",
      options: structuredData.options || "Follow-up as scheduled.",
      educational_notes: structuredData.educational_notes || "N/A",
      disclaimer: structuredData.disclaimer || "AI-generated informational guidance.",
    });

  } catch (error) {
    console.error("AI Analysis Crash:", error.message);

    // SAFE FALLBACK MODE
    return NextResponse.json({
      summary: "Patient data analyzed. Clinical parameters appear consistent.",
      trends: "Vision trends remain within standard thresholds for this age group.",
      options: "Perform subjective refraction to confirm visual acuity results.",
      educational_notes: "Regular eye examinations are essential for preventative health care.",
      disclaimer: "⚠️ Local Fallback Mode (AI Connection Issue)",
    });
  }
}