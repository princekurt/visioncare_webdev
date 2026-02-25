'use client';

import { useState, useEffect } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { 
  FaFilePdf, FaFileCsv, FaChartLine, FaRobot, 
  FaCheckCircle, FaPrint, FaTimes 
} from 'react-icons/fa';

export default function Reports() {
  const [checkups, setCheckups] = useState([]);
  const [aiInsight, setAiInsight] = useState("Gathering data for AI trend analysis...");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, topDiagnosis: 'N/A' });

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const res = await fetch('/api/checkups');
        const data = await res.json();
        setCheckups(data);
        calculateStats(data);
      } catch (err) {
        console.error("Error loading reports:", err);
      }
    };
    fetchReportsData();
  }, []);

  // 2. Calculate Dashboard Stats
  const calculateStats = (data) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCheckups = data.filter(c => {
      const d = new Date(c.date_prescribed);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const counts = {};
    data.forEach(c => {
      const diag = c.diagnosis || 'Unknown';
      counts[diag] = (counts[diag] || 0) + 1;
    });
    
    // Find the actual top diagnosis string
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'N/A');

    setStats({
      total: data.length,
      thisMonth: thisMonthCheckups.length,
      topDiagnosis: top
    });
  };

  // 3. AI Trend Analysis Function (Fixed for Gemini 2.5-Flash)
  const generateAiInsights = async () => {
    if (checkups.length === 0) return;
    setIsAiLoading(true);
    setAiInsight("Analyzing clinical patterns...");

    try {
      const diagnosisList = checkups.map(c => c.diagnosis).filter(Boolean); 
      const res = await fetch('/api/ai/analyze-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnoses: diagnosisList }),
      });
      const data = await res.json();
      
      // Handle the Rate Limit/Error message specifically
      setAiInsight(data.insight || "No specific trends detected in the current dataset.");
    } catch (err) {
      setAiInsight("Unable to connect to AI Pilot for trend analysis.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // 4. CSV Export Function
  const exportToCSV = () => {
    if (checkups.length === 0) return alert("No data to export!");
    const headers = ["Date", "Patient ID", "Optometrist", "Diagnosis", "Prescription"];
    const rows = checkups.map(c => [
      new Date(c.date_prescribed).toLocaleDateString(),
      c.patient_id,
      c.attending_optometrist,
      `"${(c.diagnosis || "").replace(/"/g, '""')}"`,
      `"${(c.new_prescription || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VisionCenter_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // 5. Report Modal Component (The "Just Show, Don't Download" view)
  const ReportPreview = () => {
    if (!showReportModal) return null;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-2xl font-black text-[#6D6E70] uppercase">Clinic <span className="text-[#F17343]">Summary</span></h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Record Preview</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2 bg-[#F17343] text-white rounded-xl font-black text-[10px] uppercase transition-transform active:scale-95">
                <FaPrint /> Print
              </button>
              <button onClick={() => setShowReportModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-200 text-[#6D6E70] rounded-full hover:bg-slate-300">
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="p-12 overflow-y-auto flex-1 bg-white">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-black text-[#6D6E70]">VISION<span className="text-[#F17343]">CENTER</span></h1>
                <p className="text-xs font-bold text-slate-400 italic uppercase">Clinical Analytics Division</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-[#6D6E70] uppercase">Generated On</p>
                <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mb-12 p-8 bg-orange-50 rounded-[2rem] border border-orange-100">
               <h4 className="text-xs font-black text-[#F17343] uppercase tracking-widest mb-3 flex items-center gap-2">
                 <FaRobot /> AI Trend Analysis
               </h4>
               <p className="text-md text-[#6D6E70] font-medium leading-relaxed italic">"{aiInsight}"</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-black text-[#6D6E70] uppercase tracking-widest border-b border-slate-100 pb-2">Recent Clinical Logs</h4>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-50">
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase">Date</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase">Patient ID</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase">Diagnosis</th>
                    <th className="py-2 text-[10px] font-black text-slate-400 uppercase text-right">Doctor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {checkups.map((c, i) => (
                    <tr key={i}>
                      <td className="py-4 text-xs font-bold text-[#6D6E70]">{new Date(c.date_prescribed).toLocaleDateString()}</td>
                      <td className="py-4 text-xs text-slate-500">#{c.patient_id}</td>
                      <td className="py-4 text-xs font-medium text-[#6D6E70]">{c.diagnosis}</td>
                      <td className="py-4 text-xs text-slate-500 text-right italic">{c.attending_optometrist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DoctorLayoutWrapper pageTitle="Analytics">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase leading-none">
              ANALYTICS & <span className="text-[#F17343]">REPORTS</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-2">Data-Driven Clinic Management</p>
          </div>
          <div className="text-right hidden md:block">
             <p className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-widest">
               <FaCheckCircle /> Database Live
             </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Exams</p>
             <h4 className="text-4xl font-black text-[#6D6E70]">{stats.total}</h4>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm border-b-4 border-b-[#F17343] transition-transform hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exams This Month</p>
             <h4 className="text-4xl font-black text-[#F17343]">{stats.thisMonth}</h4>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leading Pattern</p>
             {/* No Truncate here so we can read the full diagnosis */}
             <h4 className="text-sm font-black text-[#6D6E70] leading-tight mt-1 uppercase">{stats.topDiagnosis}</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Center */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-100 text-[#F17343] rounded-2xl">
                  <FaChartLine size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-[#6D6E70] tracking-tight uppercase">Export Center</h3>
              </div>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-[#F17343]/30 transition-all cursor-pointer" onClick={exportToCSV}>
                  <div>
                    <p className="text-xs font-black text-[#6D6E70] uppercase">Patient History Data</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Format: CSV (Spreadsheet)</p>
                  </div>
                  <div className="p-3 bg-white text-[#F17343] rounded-xl shadow-sm group-hover:bg-[#F17343] group-hover:text-white transition-all">
                    <FaFileCsv size={20}/>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 group hover:border-[#F17343]/30 transition-all cursor-pointer" onClick={() => setShowReportModal(true)}>
                  <div>
                    <p className="text-xs font-black text-[#6D6E70] uppercase">Monthly Health Summary</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Format: Modal Preview (Printable)</p>
                  </div>
                  <div className="p-3 bg-white text-slate-400 rounded-xl shadow-sm group-hover:text-[#F17343] transition-all">
                    <FaFilePdf size={20}/>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setShowReportModal(true)} className="w-full py-5 bg-[#6D6E70] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#F17343] transition-all shadow-xl active:scale-[0.98]">
              Generate Comprehensive Report
            </button>
          </div>

          {/* AI Trends Card */}
          <div className="bg-[#6D6E70] rounded-[2.5rem] shadow-sm p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/10 text-white rounded-2xl">
                  <FaRobot size={20} />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight uppercase">AI Trend Analyzer</h3>
              </div>
              <div className={`p-6 bg-white/10 rounded-[2rem] border border-white/10 mb-8 min-h-[160px] flex items-center justify-center transition-all ${isAiLoading ? 'animate-pulse' : ''}`}>
                <p className="text-sm font-medium leading-relaxed italic text-center opacity-90">
                  {aiInsight}
                </p>
              </div>
            </div>
            <button 
              onClick={generateAiInsights}
              disabled={isAiLoading || checkups.length === 0}
              className="relative z-10 w-full py-5 bg-[#F17343] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all disabled:opacity-30"
            >
              {isAiLoading ? "Syncing Clinical Data..." : "Run AI Trend Analysis"}
            </button>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <ReportPreview />
      </div>
    </DoctorLayoutWrapper>
  );
}