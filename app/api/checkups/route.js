import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Initialize Supabase Client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const body = await req.json();

    // Extracting all fields from the frontend payload
    const { 
      patientId, 
      diagnosis, 
      prescription, 
      pinholeOD, 
      pinholeOS, 
      monoPDO, 
      monoPOS, 
      datePrescribed, 
      prescribedBy,
      ai_analysis // This is the JSON object from the AI Pilot
    } = body;

    // Save to the correct table: tbl_checkup
    const { data, error } = await supabase
      .from('tbl_checkup')
      .insert([
        {
          patient_id: patientId,
          diagnosis: diagnosis,
          new_prescription: prescription,
          pinhole_od: pinholeOD,
          pinhole_os: pinholeOS,
          mono_pd_od: monoPDO,
          mono_pd_os: monoPOS,
          date_prescribed: datePrescribed,
          attending_optometrist: prescribedBy,
          ai_analysis: ai_analysis // Ensure this column exists in tbl_checkup
        }
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Backend Crash:", error);
    return NextResponse.json({ error: "Failed to save record" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetching history from the correct table
    const { data, error } = await supabase
      .from('tbl_checkup')
      .select('*')
      .order('date_prescribed', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}