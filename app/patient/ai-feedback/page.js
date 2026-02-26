'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaRobot, FaMicrochip, FaShieldAlt, FaLightbulb, FaPlay } from 'react-icons/fa';
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
      console.log("AI Response:", data); // Check this in your F12 Console
      setAiResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black">Loading...</div>;

  return (
    <PatientLayoutWrapper pageTitle="AI Insights" patientData={patientInfo}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-5">
            <FaRobot size={30} className={analyzing ? "animate-spin text-[#F17343]" : "text-[#F17343]"} />
            <div>
              <h2 className="text-2xl font-black uppercase">Vision Analyzer</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Server-side Processing</p>
            </div>
          </div>
          <button 
            onClick={runInference} 
            disabled={analyzing}
            className="bg-[#F17343] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-all shadow-lg"
          >
            {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </div>

        {/* Display Logic */}
        {!aiResult && !analyzing ? (
          <div className="p-20 border-2 border-dashed border-slate-200 rounded-[3rem] text-center text-slate-300 font-bold uppercase">
             Click the button to generate report
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity ${analyzing ? 'opacity-30' : 'opacity-100'}`}>
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[200px]">
                <p className="text-xl font-bold text-[#6D6E70] italic">
                   {aiResult?.feedback ? `"${aiResult.feedback}"` : "Initializing data nodes..."}
                </p>
              </div>
              <div className="bg-blue-600 p-8 rounded-[2rem] text-white flex items-center gap-4">
                <FaLightbulb size={30} />
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Smart Suggestion</p>
                  <p className="text-lg font-bold">{aiResult?.actionTip || "Calculating..."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Stability</p>
                <p className="text-6xl font-black text-[#6D6E70]">{aiResult?.stabilityIndex || 0}%</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Risk Factor</p>
                <p className="text-2xl font-black text-[#F17343] uppercase">{aiResult?.riskLevel || "Pending"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayoutWrapper>
  );
}