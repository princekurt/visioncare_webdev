'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaRobot, FaLightbulb, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';

export default function AIFeedbackPage() {
  const [patientInfo, setPatientInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    async function getInitialData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: patient } = await supabase.from('tbl_patient').select('*').eq('patient_email', user.email).single();
      if (patient) {
        setPatientInfo(patient);
        const { data: checkups } = await supabase.from('tbl_checkup').select('*').eq('patient_id', patient.id).order('date_prescribed', { ascending: false });
        setHistory(checkups || []);
      }
      setLoading(false);
    }
    getInitialData();
  }, []);

  const runInference = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai-patient-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, patientName: patientInfo.patient_name }),
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">Initialising AI Core...</div>;

  return (
    <PatientLayoutWrapper pageTitle="AI Insights" patientData={patientInfo}>
      <div className="max-w-5xl mx-auto space-y-6 px-1 md:px-0">
        
        {/* Responsive Header Card */}
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 md:gap-5 w-full md:w-auto">
            <div className={`p-4 rounded-2xl bg-white/5 ${analyzing ? "animate-pulse" : ""}`}>
                <FaRobot size={28} className={analyzing ? "animate-spin text-[#F17343]" : "text-[#F17343]"} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Vision <span className="text-[#F17343]">Analyzer</span></h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Deep Learning Feedback</p>
            </div>
          </div>
          
          <button 
            onClick={runInference} 
            disabled={analyzing}
            className="w-full md:w-auto bg-[#F17343] text-white px-8 py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50"
          >
            {analyzing ? 'Processing Data...' : 'Run AI Analysis'}
          </button>
        </div>

        {/* State Logic */}
        {!aiResult && !analyzing ? (
          <div className="p-16 md:p-24 border-2 border-dashed border-slate-200 rounded-[2.5rem] md:rounded-[3rem] text-center text-slate-300">
             <div className="mb-4 flex justify-center opacity-20"><FaChartLine size={50} /></div>
             <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-loose">
               Ready to process {history.length} records.<br/>Click the button to generate your health report.
             </p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-500 ${analyzing ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
            
            {/* Feedback Content */}
            <div className="md:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm min-h-[150px] flex items-center">
                <p className="text-base md:text-xl font-bold text-[#6D6E70] italic leading-relaxed">
                   {aiResult?.feedback ? `"${aiResult.feedback}"` : "Accessing neural pathways for patient history..."}
                </p>
              </div>

              <div className="bg-blue-600 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white flex items-start md:items-center gap-4 shadow-xl shadow-blue-900/10">
                <FaLightbulb size={24} className="shrink-0 mt-1 md:mt-0" />
                <div>
                  <p className="text-[8px] md:text-[10px] font-black uppercase opacity-60 tracking-widest">Smart Suggestion</p>
                  <p className="text-sm md:text-lg font-bold leading-tight">{aiResult?.actionTip || "Calculating next steps..."}</p>
                </div>
              </div>
            </div>

            {/* Sidebar Stats - Stacks on bottom for mobile */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 text-center shadow-sm flex flex-col justify-center">
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Stability</p>
                <p className="text-4xl md:text-6xl font-black text-[#6D6E70] tracking-tighter">
                  {aiResult?.stabilityIndex || 0}<span className="text-xl md:text-2xl text-slate-300">%</span>
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-center text-center">
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Risk Factor</p>
                <div className="flex items-center justify-center gap-2">
                  {aiResult?.riskLevel === 'High' && <FaExclamationTriangle className="text-[#F17343] text-xs" />}
                  <p className="text-lg md:text-2xl font-black text-[#F17343] uppercase tracking-tight">
                    {aiResult?.riskLevel || "Pending"}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </PatientLayoutWrapper>
  );
}