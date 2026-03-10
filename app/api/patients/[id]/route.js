import { supabaseAdmin } from '../../../../lib/supabase';

// GET SINGLE PATIENT
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const { data, error } = await supabaseAdmin
      .from('tbl_patient')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: "Patient not found" }), { status: 404 });
    }

    // Return the data object directly
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// UPDATE PATIENT
export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from('tbl_patient')
      .update(body)
      .eq('id', id)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ success: true, patient: data[0] }), 
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}