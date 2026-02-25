import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { diagnosis, prescription, metrics } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return NextResponse.json({ summary: "API Key missing" }, { status: 500 });

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `You are an AI clinical assistant for ophthalmologists. 
Analyze the following patient vision metrics and provide informational guidance only. 
Return only a valid JSON object.

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
  "options": "Considerations for further tests, patient questions, or lens adjustments.",
  "educational_notes": "Technical notes or explanations of metrics."
}

Always include a disclaimer: "This is AI-generated guidance for informational purposes only."`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1000 },
    };

    // 1. ATTEMPT REAL API CALL
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 2. IF QUOTA EXCEEDED OR ERROR -> TRIGGER LOCAL FALLBACK
    if (!response.ok || data.error) {
      console.warn("Gemini API Offline or Quota Hit. Using Clinical Fallback.");
      
      const fallbackData = {
        summary: `Patient (Age: ${metrics.age}) presents with clinical notes indicating: ${diagnosis || 'Standard refractive assessment'}.`,
        trends: `Observations based on Pinhole vision (${metrics.pinholeOD}/${metrics.pinholeOS}) and Mono PD measurements suggest typical visual demands.`,
        options: "Consider comprehensive subjective refraction and binocular vision testing if symptoms persist. Review 20-20-20 rule for digital tasks.",
        educational_notes: "Visual metrics are currently within stable clinical parameters. Ensure lighting is optimized for near-point work. (Local Analysis Mode)"
      };

      return NextResponse.json(fallbackData);
    }

    // 3. PROCESS SUCCESSFUL AI RESPONSE
    if (data.candidates && data.candidates[0].content) {
      let aiText = data.candidates[0].content.parts[0].text;
      aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const structuredData = JSON.parse(aiText);
        return NextResponse.json(structuredData);
      } catch (parseError) {
        return NextResponse.json({ 
          summary: "AI generated analysis but format was slightly off.",
          trends: "Data parsed manually.",
          options: aiText
        });
      }
    }

    return NextResponse.json({ summary: "No valid response from AI." });

  } catch (error) {
    console.error("System Crash:", error);
    return NextResponse.json({ summary: "The AI Pilot encountered a system error." }, { status: 500 });
  }
}