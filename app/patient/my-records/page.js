'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaFileMedical, FaCalendarAlt, FaSearch, FaDownload, FaEye, FaUserMd } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';

export default function MyRecords() {
  const [records, setRecords] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function fetchAllRecords() {
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
          
          // 1. SORTING: .order('date_prescribed', { ascending: false }) 
          // This ensures the most recent checkup is at the top.
          const { data: checkups, error } = await supabase
            .from('tbl_checkup')
            .select('*')
            .eq('patient_id', patient.id)
            .order('date_prescribed', { ascending: false });

          if (error) throw error;
          setRecords(checkups || []);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllRecords();
  }, [router]);

  const filteredRecords = records.filter(record => 
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date_prescribed?.includes(searchTerm)
  );

  if (loading) return <div className="p-20 text-center font-black text-slate-400">LOADING RECORDS...</div>;

  return (
    <PatientLayoutWrapper pageTitle="Medical Records" patientData={patientInfo}>
      <div className="space-y-6 text-[#6D6E70]">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Clinical <span className="text-[#F17343]">History</span></h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Managed vision care timeline</p>
          </div>

          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
            <input 
              type="text" 
              placeholder="SEARCH BY DOCTOR OR DIAGNOSIS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-100 focus:border-[#F17343] outline-none transition-all font-bold text-[10px] uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Date</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Diagnosis</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Attending Physician</th>
                  <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record, index) => (
                    <tr key={record.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <FaCalendarAlt className="text-[#F17343] text-xs" />
                          <span className="font-black text-xs uppercase">{record.date_prescribed}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-orange-50 text-[#F17343] text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                          {record.diagnosis || "General Checkup"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <FaUserMd className="text-slate-300" />
                          {/* 2. DYNAMIC DOCTOR NAME: record.doctor_name */}
                          <span className="text-[10px] font-bold text-[#6D6E70] uppercase tracking-widest">
                            Dr. {record.doctor_name || "Specialist"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-3 bg-slate-50 text-slate-400 hover:bg-[#6D6E70] hover:text-white rounded-xl transition-all shadow-sm">
                            <FaEye size={14} />
                          </button>
                          <button className="p-3 bg-slate-50 text-slate-400 hover:bg-[#F17343] hover:text-white rounded-xl transition-all shadow-sm">
                            <FaDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-30">
                        <FaFileMedical size={40} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No matching history found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PatientLayoutWrapper>
  );
}