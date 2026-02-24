import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { diagnosis, prescription, metrics } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return NextResponse.json({ summary: "API Key missing" }, { status: 500 });

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // GEMINI 2.5 COMPLIANT PROMPT
    const prompt = `You are an AI clinical assistant for ophthalmologists. 
Analyze the following patient vision metrics and provide informational guidance only. 
Do NOT give direct prescriptions or definitive diagnoses. 
Return only a valid JSON object, no conversational text, no markdown.

DATA:
Age: ${metrics.age}
Pinhole: ${metrics.pinholeOD}/${metrics.pinholeOS}
Mono PD: ${metrics.monoPDO || 'N/A'}/${metrics.monoPOS || 'N/A'}
Clinical Notes: ${diagnosis || "None"}
Previous Rx: ${prescription || "None"}

JSON STRUCTURE:
{
  "summary": "1-2 sentences summarizing the vision metrics.",
  "trends": "Notable changes or values outside normal ranges for age ${metrics.age}.",
  "options": "Considerations for further tests, patient questions, or lens adjustments (informational only).",
  "educational_notes": "Technical notes or explanations of metrics (informational only)."
}

Always include a disclaimer: "This is AI-generated guidance for informational purposes only. Final clinical decisions must be made by a licensed doctor."
`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1500,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return NextResponse.json({ summary: "AI Service error. Check API Key/Quota." }, { status: 500 });
    }

    if (!data.candidates || !data.candidates[0].content) {
      return NextResponse.json({ summary: "No response from AI. Safety filter triggered." });
    }

    let aiText = data.candidates[0].content.parts[0].text;
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const structuredData = JSON.parse(aiText);
      return NextResponse.json(structuredData);
    } catch (parseError) {
      console.error("Failed to parse AI JSON:", aiText);
      return NextResponse.json({ 
        summary: "Data formatting error.", 
        trends: "The AI sent a non-JSON response.",
        options: aiText
      });
    }

  } catch (error) {
    console.error("System Crash:", error);
    return NextResponse.json({ summary: "The AI Pilot encountered a system error." }, { status: 500 });
  }
}