import { supabase } from '../../../../lib/supabase';

// GET SINGLE PATIENT
export async function GET(req, { params }) {
  // Fix: Await params to avoid NaN error
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid Patient ID" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('tbl_patient')
    .select('*')
    .eq('id', id)
    .single();

  if (error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), { status: 200 });
}

// UPDATE PATIENT
export async function PUT(req, { params }) {
  // Fix: Await params to avoid NaN error
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const body = await req.json();

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid Patient ID" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from('tbl_patient')
    .update(body)
    .eq('id', id)
    .select();

  if (error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ success: true, patient: data[0] }), { status: 200 });
}