'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { FaRobot, FaMicrochip, FaShieldAlt, FaChartLine, FaLightbulb } from 'react-icons/fa';
import PatientLayoutWrapper from '../../../components/layout/PatientLayoutWrapper';

export default function AIFeedbackPage() {
  const [patientInfo, setPatientInfo] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    async function getAIData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: patient } = await supabase.from('tbl_patient').select('*').eq('patient_email', user.email).single();
      
      if (patient) {
        setPatientInfo(patient);
        const { data: history } = await supabase.from('tbl_checkup').select('*').eq('patient_id', patient.id).order('date_prescribed', { ascending: false });

        try {
          const res = await fetch('/api/ai-patient-feedback', {
            method: 'POST',
            body: JSON.stringify({ history, patientName: patient.patient_name }),
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await res.json();
          setAiResult(data);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    }
    getAIData();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <FaMicrochip className="text-[#F17343] animate-spin text-5xl mx-auto mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Neural Syncing...</p>
      </div>
    </div>
  );

  return (
    <PatientLayoutWrapper pageTitle="AI Analyzer" patientData={patientInfo}>
      <div className="max-w-5xl mx-auto space-y-6 pb-10">
        
        {/* Header Section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/10 rounded-2xl text-[#F17343]">
              <FaRobot size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Vision <span className="text-[#F17343]">Inference</span></h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Patient Intelligence Model</p>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-black text-slate-500 uppercase mb-1">Status</div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest">Live Engine</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden min-h-[300px] flex flex-col justify-center">
              <div className="absolute top-8 left-10 flex items-center gap-2">
                <FaBrain className="text-slate-200" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Narrative Analysis</span>
              </div>
              <p className="text-2xl font-bold text-[#6D6E70] leading-snug italic mt-4">
                "{aiResult?.feedback || "System is evaluating your clinical history..."}"
              </p>
            </div>
            
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-lg flex items-center gap-6">
              <div className="p-4 bg-white/20 rounded-full shrink-0"><FaLightbulb size={24} /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">AI Smart Recommendation</p>
                <p className="text-lg font-bold">{aiResult?.actionTip}</p>
              </div>
            </div>
          </div>

          {/* AI Metrics Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Stability Index</p>
              <div className="relative inline-flex items-center justify-center">
                <p className="text-6xl font-black text-[#6D6E70]">{aiResult?.stabilityIndex || 0}<span className="text-xl text-[#F17343]">%</span></p>
              </div>
              <p className="text-[9px] font-bold text-slate-300 uppercase mt-4">Precision Metric</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</p>
                <FaShieldAlt className={aiResult?.riskLevel === 'Minimal' ? 'text-green-500' : 'text-orange-500'} />
              </div>
              <p className={`text-3xl font-black uppercase tracking-tighter ${aiResult?.riskLevel === 'Minimal' ? 'text-green-500' : 'text-orange-500'}`}>
                {aiResult?.riskLevel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PatientLayoutWrapper>
  );
}