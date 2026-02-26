'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaFileMedical, FaCalendarAlt, FaEye } from 'react-icons/fa';
import PatientLayoutWrapper from '../../components/layout/PatientLayoutWrapper';

export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Standard Supabase initialization
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function getPatientData() {
      try {
        // 1. Check for authenticated user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push('/');
          return;
        }

        // 2. Search by email (matching what the doctor registered)
        const { data: patient, error: pError } = await supabase
          .from('tbl_patient')
          .select('*')
          .eq('patient_email', user.email)
          .single();

        if (pError || !patient) {
          console.log("No clinical profile linked to this email.");
          setLoading(false);
          return;
        }

        setPatientInfo(patient);

        // 3. Get clinical history for this specific patient ID
        const { data: checkups, error: cError } = await supabase
          .from('tbl_checkup')
          .select('*')
          .eq('patient_id', patient.id)
          .order('date_prescribed', { ascending: false });

        if (cError) throw cError;
        setRecords(checkups || []);

      } catch (error) {
        console.error("Dashboard Loading Error:", error);
      } finally {
        setLoading(false);
      }
    }

    getPatientData();
  }, [router]);

  if (loading) {
    return (
      <PatientLayoutWrapper pageTitle="Loading...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">
            Fetching vision records...
          </div>
        </div>
      </PatientLayoutWrapper>
    );
  }

  return (
    <PatientLayoutWrapper pageTitle="Dashboard" patientData={patientInfo}>
      <div className="flex flex-col gap-6 text-[#6D6E70]">
        
        {/* Welcome Section */}
        <div className="bg-[#6D6E70] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Welcome back, <span className="text-[#F17343]">{patientInfo?.patient_name || 'Patient'}</span>
            </h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">
              Clinic ID: #P-00{patientInfo?.id}
            </p>
          </div>
          <FaEye className="absolute -right-8 -bottom-8 text-white/5 text-[12rem]" />
        </div>

        {/* Records Header */}
        <div className="flex items-center justify-between mt-4 px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Recent Examinations
          </h3>
          <span className="bg-orange-50 text-[#F17343] text-[9px] font-black px-3 py-1 rounded-full uppercase">
            {records.length} Total Records
          </span>
        </div>

        {/* Records List */}
        <div className="grid gap-4">
          {records.length > 0 ? (
            /* FIXED: Added 'index' and a fallback key to prevent React warnings */
            records.map((record, index) => (
              <div 
                key={record.id || `record-${index}`} 
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 text-[#6D6E70] group-hover:bg-[#F17343] group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300">
                    <FaFileMedical size={24} />
                  </div>
                  <div>
                    <p className="font-black text-[#6D6E70] uppercase text-sm tracking-tight group-hover:text-[#F17343] transition-colors">
                      {record.diagnosis || "General Checkup"}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      <FaCalendarAlt className="text-[#F17343]" />
                      {record.date_prescribed ? new Date(record.date_prescribed).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>

                <button className="bg-slate-50 text-[#6D6E70] hover:bg-[#6D6E70] hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  View Results
                </button>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                No medical records found for this account.
              </p>
            </div>
          )}
        </div>
      </div>
    </PatientLayoutWrapper>
  );
}