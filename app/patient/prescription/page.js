'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaPrescriptionBottleAlt, FaEye, FaCalendarAlt, FaUserMd, FaInfoCircle, FaGlasses } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/'); return; }

        const { data: patient } = await supabase
          .from('tbl_patient')
          .select('*')
          .eq('patient_email', user.email)
          .single();

        if (patient) {
          setPatientInfo(patient);
          const { data: history, error } = await supabase
            .from('tbl_checkup')
            .select('*')
            .eq('patient_id', patient.id)
            .order('date_prescribed', { ascending: false });

          if (error) throw error;
          setPrescriptions(history || []);
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrescriptions();
  }, [router]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Retrieving Prescriptions...</div>;

  const latest = prescriptions[0];

  return (
    <PatientLayoutWrapper pageTitle="Prescription" patientData={patientInfo}>
      <div className="space-y-8 text-[#6D6E70]">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#6D6E70] rounded-2xl flex items-center justify-center text-white shadow-xl">
              <FaGlasses size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Lens <span className="text-[#F17343]">Prescription</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Your current corrective lens specifications</p>
            </div>
          </div>
        </div>

        {latest ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Prescription Card */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Specification</span>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">Current</span>
                </div>
                
                <div className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Right Eye (OD) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-[#F17343] rounded-full"></div>
                        <h3 className="font-black text-xl uppercase tracking-tighter text-[#6D6E70]">Right Eye <span className="text-slate-300 ml-2">(OD)</span></h3>
                      </div>
                      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visual Acuity / Pinhole</p>
                        <p className="text-4xl font-black text-[#6D6E70] tracking-tighter">{latest.pinhole_od || 'N/A'}</p>
                        <div className="absolute right-4 bottom-4 opacity-5 text-[8px] font-black uppercase tracking-widest vertical-text">Oculus Dexter</div>
                      </div>
                    </div>

                    {/* Left Eye (OS) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-slate-400 rounded-full"></div>
                        <h3 className="font-black text-xl uppercase tracking-tighter text-[#6D6E70]">Left Eye <span className="text-slate-300 ml-2">(OS)</span></h3>
                      </div>
                      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 relative overflow-hidden">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visual Acuity / Pinhole</p>
                        <p className="text-4xl font-black text-[#6D6E70] tracking-tighter">{latest.pinhole_os || 'N/A'}</p>
                        <div className="absolute right-4 bottom-4 opacity-5 text-[8px] font-black uppercase tracking-widest vertical-text">Oculus Sinister</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Diagnosis</p>
                      <p className="text-sm font-bold text-[#F17343] uppercase bg-orange-50 px-4 py-2 rounded-xl inline-block">
                        {latest.diagnosis || "General Refraction"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prescribing Doctor</p>
                      <div className="flex items-center gap-2">
                        <FaUserMd className="text-slate-300" />
                        <p className="text-sm font-black text-[#6D6E70] uppercase tracking-tight">Dr. {latest.attending_optometrist}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice Card */}
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex gap-4">
                <FaInfoCircle className="text-blue-400 mt-1" size={20} />
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Patient Notice</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    This prescription is valid based on your exam date: <strong>{latest.date_prescribed}</strong>. Avoid using lenses with older specifications as it may cause strain or headaches.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar: History & Reminders */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Previous Records</h4>
                <div className="space-y-4">
                  {prescriptions.slice(1, 4).map((prev, idx) => (
                    /* FIXED: Using checkup_id as key */
                    <div 
                      key={prev.checkup_id || `prev-${idx}`} 
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group" 
                      onClick={() => router.push('/patient/visit-history')}
                    >
                      <div>
                        <p className="text-[10px] font-black text-[#6D6E70] uppercase">{prev.date_prescribed}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{prev.diagnosis}</p>
                      </div>
                      <FaEye className="text-slate-200 group-hover:text-[#F17343] transition-colors" />
                    </div>
                  ))}
                  {prescriptions.length <= 1 && (
                    <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4 tracking-widest">No earlier records</p>
                  )}
                </div>
              </div>

              <div className="bg-[#6D6E70] p-8 rounded-[2.5rem] text-white shadow-lg relative overflow-hidden">
                <FaCalendarAlt className="absolute -right-4 -bottom-4 text-white/5 text-7xl" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Next Recommended Exam</p>
                <p className="text-lg font-black uppercase tracking-tight mb-4">6 Months Periodic</p>
                <button className="w-full py-3 bg-[#F17343] hover:bg-[#d9653a] transition-colors rounded-xl text-[10px] font-black uppercase tracking-widest">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-40 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <FaPrescriptionBottleAlt className="mx-auto text-slate-200 mb-4" size={50} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No prescription data found</p>
          </div>
        )}
      </div>
    </PatientLayoutWrapper>
  );
}