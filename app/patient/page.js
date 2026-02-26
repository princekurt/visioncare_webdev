'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaFileMedical, FaRobot, FaFlask, FaHistory, FaEye, FaArrowRight, FaLightbulb } from 'react-icons/fa';
import PatientLayoutWrapper from '../../components/layout/PatientLayoutWrapper';

// 1. TIP LIBRARY (Add this above your component)
const EYE_HEALTH_TIPS = {
  "Myopia": "Spend at least 2 hours outdoors daily. Natural light helps regulate eye growth and can slow nearsightedness.",
  "Hyperopia": "If you experience headaches during reading, ensure you have proper lighting and take frequent 'focus breaks'.",
  "Astigmatism": "Keep your screen brightness matched to your surroundings to reduce ghosting images and eye strain.",
  "Digital Eye Strain": "Apply the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
  "Dry Eye": "Increase your Omega-3 intake and remember to blink fully when using digital devices.",
  "Normal": "Your vision is optimal! Maintain it by eating leafy greens and wearing UV protection outdoors.",
  "Default": "Vision care is health care. Ensure you stay hydrated to keep your eyes' moisture levels stable."
};

export default function PatientDashboard() {
  const [records, setRecords] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // 2. SMART TIP LOGIC
  const getPersonalizedTip = () => {
    if (!records || records.length === 0) return EYE_HEALTH_TIPS["Default"];
    const diagnosis = records[0].diagnosis;
    return EYE_HEALTH_TIPS[diagnosis] || EYE_HEALTH_TIPS["Default"];
  };

  useEffect(() => {
    async function getPatientData() {
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
          const { data: checkups } = await supabase
            .from('tbl_checkup')
            .select('*')
            .eq('patient_id', patient.id)
            .order('date_prescribed', { ascending: false });
          setRecords(checkups || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getPatientData();
  }, [router]);

  if (loading) return <div className="p-20 text-center font-black text-slate-400">LOADING...</div>;

  return (
    <PatientLayoutWrapper pageTitle="Overview" patientData={patientInfo}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Greeting & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Welcome Card */}
          <div className="bg-[#6D6E70] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="bg-[#F17343] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Vision Care Member</span>
              <h2 className="text-4xl font-black mt-4 uppercase">Hello, {patientInfo?.patient_name?.split(' ')[0]}</h2>
              <p className="text-white/50 text-xs font-bold mt-2 max-w-xs">Your vision is our priority. Here is a quick look at your eye health status today.</p>
            </div>
            <FaEye className="absolute -right-10 -bottom-10 text-white/5 text-[15rem]" />
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SummaryCard 
              icon={<FaHistory className="text-[#F17343]" />}
              title="Last Examination"
              value={records[0]?.date_prescribed || "No Records"}
              label="Visit History"
              onClick={() => router.push('/patient/visit-history')}
            />
            <SummaryCard 
              icon={<FaRobot className="text-[#F17343]" />}
              title="AI Analysis"
              value="Stable"
              label="View AI Insights"
              onClick={() => router.push('/patient/ai-feedback')}
            />
          </div>

          {/* Recent Activity Teaser */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Checkup</h3>
              <button onClick={() => router.push('/patient/my-records')} className="text-[9px] font-black text-[#F17343] uppercase flex items-center gap-1 hover:underline">Full Records <FaArrowRight /></button>
            </div>
            {records.length > 0 ? (
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#6D6E70] shadow-sm">
                  <FaFileMedical />
                </div>
                <div>
                  <p className="font-black text-sm text-[#6D6E70] uppercase">{records[0].diagnosis}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{records[0].date_prescribed}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-bold italic">No examination history found.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Action Sidebar */}
        <div className="space-y-8">
          {/* AI Tip Widget - DYNAMIC CONTENT PLUGGED IN HERE */}
          <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 relative overflow-hidden">
            <FaLightbulb className="text-orange-200 text-6xl absolute -top-4 -right-4 rotate-12" />
            <h4 className="text-[10px] font-black text-[#F17343] uppercase tracking-widest mb-4">Daily Eye Tip</h4>
            <p className="text-sm font-bold text-[#6D6E70] leading-relaxed relative z-10 italic">
              "{getPersonalizedTip()}"
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Quick Links</h4>
            <QuickLink icon={<FaFlask />} text="Prescription Details" onClick={() => router.push('/patient/prescription')} />
            <QuickLink icon={<FaRobot />} text="Ask AI Assistant" onClick={() => router.push('/patient/ai-feedback')} />
            <QuickLink icon={<FaHistory />} text="Visit Timeline" onClick={() => router.push('/patient/visit-history')} />
          </div>
        </div>

      </div>
    </PatientLayoutWrapper>
  );
}

// Sub-component for Metric Cards
function SummaryCard({ icon, title, value, label, onClick }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-[#F17343] group-hover:text-white transition-colors">
          {icon}
        </div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      </div>
      <p className="text-xl font-black text-[#6D6E70] uppercase truncate">{value}</p>
      <button onClick={onClick} className="mt-4 text-[9px] font-black text-[#F17343] hover:text-[#6D6E70] transition-colors uppercase tracking-widest">
        {label} →
      </button>
    </div>
  );
}

// Sub-component for Sidebar Links
function QuickLink({ icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#F17343] hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-4">
        <span className="text-slate-300 group-hover:text-[#F17343] transition-colors">{icon}</span>
        <span className="text-xs font-black text-[#6D6E70] uppercase tracking-tight">{text}</span>
      </div>
      <FaArrowRight className="text-slate-200 text-xs group-hover:translate-x-1 transition-transform group-hover:text-[#F17343]" />
    </button>
  );
}