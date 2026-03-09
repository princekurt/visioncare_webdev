import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("Verifying patient email:", email); // DEBUG LOG

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabaseAdmin
      .from('tbl_patient')
      .select('patient_email')
      .eq('patient_email', email)
      .maybeSingle();

    if (error) {
      console.error("Supabase Query Error:", error); // THIS WILL SHOW IN TERMINAL
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ exists: !!data });
  } catch (err) {
    console.error("API Route Crash:", err); // THIS WILL SHOW IN TERMINAL
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}