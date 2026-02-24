import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from('tbl_checkup')
      .insert([
        {
          patient_id: body.patientId,
          pinhole_od: body.pinholeOD,
          pinhole_os: body.pinholeOS,
          mono_pd_od: body.monoPDO,
          mono_pd_os: body.monoPOS,
          date_prescribed: body.datePrescribed,
          attending_optometrist: body.prescribedBy,
          habitual_prescription: body.habitualPrescription,
          chief_complaint: body.chiefComplaint,
          diagnosis: body.diagnosis,
          new_prescription: body.prescription,
          next_visit_schedule: body.nextVisit || null,
        },
      ])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data: data[0] }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tbl_checkup')
      .select(`
        *,
        tbl_patient (
          patient_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    // If the table doesn't exist yet, return an empty array instead of crashing
    return NextResponse.json([], { status: 200 });
  }
}