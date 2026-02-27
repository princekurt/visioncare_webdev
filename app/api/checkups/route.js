import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const body = await req.json();

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
      ai_analysis // This is the JSON object from the AI
    } = body;

    // 1. Prepare the record for insertion
    const checkupRecord = {
      patient_id: patientId,
      diagnosis: diagnosis,
      new_prescription: prescription,
      pinhole_od: pinholeOD,
      pinhole_os: pinholeOS,
      mono_pd_od: monoPDO,
      mono_pd_os: monoPOS,
      date_prescribed: datePrescribed,
      attending_optometrist: prescribedBy,
      // We store the whole AI object (summary, trends, options, etc.)
      ai_analysis: ai_analysis 
    };

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from('tbl_checkup')
      .insert([checkupRecord])
      .select();

    if (error) {
      console.error("Supabase Save Error:", error);
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
    const { data, error } = await supabase
      .from('tbl_checkup')
      .select(`
        *,
        tbl_patient (
          id,
          patient_name
        )
      `)
      .order('date_prescribed', { ascending: false });

    if (error) throw error;

    // Flatten patient name so your UI can use visit.patient_name directly
    const formattedData = data.map(item => ({
      ...item,
      patient_name: item.tbl_patient?.patient_name || "Unknown Patient"
    }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}