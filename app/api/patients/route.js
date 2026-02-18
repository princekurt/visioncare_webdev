import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('tbl_patient')
    .select('*')
    .order('id', { ascending: false });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { patient_name, patient_gender, patient_address, patient_dob, patient_contact, patient_email } = body;

    const { data, error } = await supabase
      .from('tbl_patient')
      .insert([{
        patient_name,
        patient_gender,
        patient_address,
        patient_dob,
        patient_contact,
        patient_email
      }])
      .select(); // returns the inserted row including id and patient_code

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(JSON.stringify({ success: true, patient: data[0] }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
