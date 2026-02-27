'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaHistory, FaSearch, FaCalendarAlt, FaUserMd, FaEye, FaRobot, FaTimes, FaInfoCircle, FaBookOpen } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';

// MOVE THIS OUTSIDE the component so it stays constant between renders
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function VisitHistory() {
  const [visits, setVisits] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
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
          setVisits(history || []);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
    // Removed supabase from here because it's now defined outside and constant
  }, [router]);

  const filteredVisits = visits.filter(v => {
    const matchesSearch = v.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.attending_optometrist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? v.date_prescribed === filterDate : true;
    return matchesSearch && matchesDate;
  });

  const DetailsModal = () => {
    if (!selectedVisit) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
          <div className="bg-[#6D6E70] p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Full Consultation Report</p>
              <h3 className="text-xl font-black uppercase">{selectedVisit.date_prescribed}</h3>
            </div>
            <button onClick={() => setSelectedVisit(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all">
              <FaTimes />
            </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-[#F17343] uppercase tracking-widest border-b border-orange-100 pb-2 mb-4">Vision Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Pinhole OD</p>
                      <p className="font-black text-[#6D6E70]">{selectedVisit.pinhole_od || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-center">
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Pinhole OS</p>
                      <p className="font-black text-[#6D6E70]">{selectedVisit.pinhole_os || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-[#6D6E70] uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Doctor's Diagnosis</h4>
                  <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    "{selectedVisit.diagnosis || 'Standard Checkup'}"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                  <FaRobot /> AI Intelligence
                </h4>
                {selectedVisit.ai_analysis ? (
                  <div className="space-y-3">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Expert Summary</p>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{selectedVisit.ai_analysis.summary}</p>
                    </div>

                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-[9px] font-black text-[#F17343] uppercase mb-1">Health Trends</p>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{selectedVisit.ai_analysis.trends}</p>
                    </div>

                    <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                      <p className="text-[9px] font-black text-emerald-600 uppercase mb-1 flex items-center gap-2">
                        <FaBookOpen size={10} /> Patient Education
                      </p>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium italic">
                        {selectedVisit.ai_analysis.educational_notes || "Your optometrist will provide specific educational notes during your next visit."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-8 rounded-2xl text-center border border-dashed border-slate-200">
                    <FaInfoCircle className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase">No AI data for this visit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
            <FaUserMd className="text-slate-400" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Optometrist: <span className="text-[#6D6E70]">{selectedVisit.attending_optometrist}</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Syncing History...</div>;

  return (
    <PatientLayoutWrapper pageTitle="Visit History" patientData={patientInfo}>
      <div className="space-y-8 text-[#6D6E70]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F17343] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <FaHistory size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Visit <span className="text-[#F17343]">Timeline</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Your complete medical journey</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase outline-none focus:border-[#F17343] w-56 shadow-sm transition-all" 
              />
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
              <FaCalendarAlt className="text-[#F17343] text-xs" />
              <input 
                type="date" 
                value={filterDate} 
                onChange={(e) => setFilterDate(e.target.value)} 
                className="text-[10px] font-bold uppercase outline-none text-[#6D6E70]" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit, index) => (
              <div key={visit.checkup_id || `visit-${index}`} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:border-orange-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="min-w-[120px]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-black text-[#6D6E70] uppercase">{visit.date_prescribed}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-[#F17343] uppercase tracking-widest mb-1">Condition</p>
                  <p className="text-sm font-bold text-[#6D6E70] uppercase">{visit.diagnosis || "General Checkup"}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Optometrist</p>
                  <p className="text-[11px] font-black text-[#6D6E70] uppercase">{visit.attending_optometrist}</p>
                </div>
                <button 
                  onClick={() => setSelectedVisit(visit)} 
                  className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 hover:bg-[#6D6E70] hover:text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest shadow-sm group"
                >
                  <FaEye className="group-hover:scale-110 transition-transform" /> View Report
                </button>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">
              No visits found
            </div>
          )}
        </div>
      </div>
      <DetailsModal />
    </PatientLayoutWrapper>
  );
}