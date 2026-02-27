'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaStethoscope, FaSearch, FaUserCheck, FaRobot, FaCalendarAlt, FaHistory, FaInfoCircle } from 'react-icons/fa';

const initialFormState = {
  patientId: '',
  fullName: '',
  age: '',
  gender: '',
  pinholeOD: '',
  pinholeOS: '',
  monoPDO: '',
  monoPOS: '',
  habitualPrescription: '',
  datePrescribed: new Date().toISOString().split('T')[0],
  prescribedBy: 'Dr. Jane Smith', // Default fallback
  chiefComplaint: '',
  diagnosis: '',
  prescription: '',
  nextVisit: ''
};

function CheckupContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); 
  const [selectedVisit, setSelectedVisit] = useState(null);
  
  // AI States
  const [aiSuggestion, setAiSuggestion] = useState("Select a patient to enable diagnostic suggestions.");
  const [rawAiData, setRawAiData] = useState(null); 
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [form, setForm] = useState(initialFormState);

  // --- SYNC ACTIVE DOCTOR FROM SETTINGS ---
  useEffect(() => {
    const syncDoctor = () => {
      const savedDoctor = localStorage.getItem('activeDoctor');
      if (savedDoctor) {
        setForm(prev => ({ ...prev, prescribedBy: savedDoctor }));
      }
    };

    syncDoctor(); // Run on mount
    window.addEventListener('storage', syncDoctor); // Listen for changes in other tabs
    return () => window.removeEventListener('storage', syncDoctor);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, hRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/checkups')
        ]);
        const pData = await pRes.json();
        const hData = await hRes.json();
        setPatients(pData);
        setHistory(hData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleAiAnalysis = async () => {
    if (!form.diagnosis && !form.prescription) {
      setAiSuggestion("Please enter clinical notes or a prescription to analyze.");
      return;
    }

    setIsAiLoading(true);
    setAiSuggestion("Analyzing clinical data...");

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: form.diagnosis,
          prescription: form.prescription,
          metrics: { 
            age: form.age, 
            pinholeOD: form.pinholeOD, 
            pinholeOS: form.pinholeOS,
            monoPDO: form.monoPDO,
            monoPOS: form.monoPOS
          }
        }),
      });

      const data = await res.json();
      setRawAiData(data); 

      if (data.summary) {
        setAiSuggestion(
          `SUMMARY: ${data.summary}\n\n` +
          `TRENDS: ${data.trends}\n\n` +
          `OPTIONS: ${data.options}\n\n` +
          `EDUCATIONAL: ${data.educational_notes}\n\n` +
          `⚠️ ${data.disclaimer || "Consult a licensed professional."}`
        );
      } else {
        setAiSuggestion(data.analysis || "AI could not generate a response.");
      }
    } catch (err) {
      console.error(err);
      setAiSuggestion("AI Pilot is currently unavailable.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const selectPatient = (patient) => {
    const birthDate = new Date(patient.patient_dob);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));

    setForm({
      ...form,
      patientId: patient.id,
      fullName: patient.patient_name,
      age: age,
      gender: patient.patient_gender,
    });
    setSearchTerm(patient.patient_name);
    setShowDropdown(false);
    setAiSuggestion(`Ready to analyze ${patient.patient_name}'s vision data.`);
    setRawAiData(null); 
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.patientId) {
      alert("Please search and select a patient first!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        ai_analysis: rawAiData 
      };

      const res = await fetch('/api/checkups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      alert('Checkup record and AI Insight saved successfully!');
      
      const hRes = await fetch('/api/checkups');
      const hData = await hRes.json();
      setHistory(hData);

      const currentDoc = form.prescribedBy;
      setForm({ ...initialFormState, prescribedBy: currentDoc });
      
      setSearchTerm('');
      setRawAiData(null);
      setAiSuggestion("Select a patient to enable diagnostic suggestions.");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const patientHistory = history.filter(h => h.patient_id === form.patientId);

  const HistoryModal = () => {
    if (!selectedVisit) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="bg-[#6D6E70] p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Examination Archive</p>
              <h3 className="text-xl font-black uppercase">{new Date(selectedVisit.date_prescribed).toLocaleDateString()}</h3>
            </div>
            <button onClick={() => setSelectedVisit(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all font-bold">✕</button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-[#F17343] uppercase tracking-widest border-b border-orange-100 pb-2">Vision Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[9px] font-bold text-slate-400 uppercase">Pinhole OD</p><p className="font-bold text-[#6D6E70]">{selectedVisit.pinhole_od || 'N/A'}</p></div>
                <div><p className="text-[9px] font-bold text-slate-400 uppercase">Pinhole OS</p><p className="font-bold text-[#6D6E70]">{selectedVisit.pinhole_os || 'N/A'}</p></div>
                <div><p className="text-[9px] font-bold text-slate-400 uppercase">PD OD</p><p className="font-bold text-[#6D6E70]">{selectedVisit.mono_pd_od || 'N/A'}</p></div>
                <div><p className="text-[9px] font-bold text-slate-400 uppercase">PD OS</p><p className="font-bold text-[#6D6E70]">{selectedVisit.mono_pd_os || 'N/A'}</p></div>
              </div>
              <div className="mt-4">
                <h4 className="text-[10px] font-black text-[#F17343] uppercase tracking-widest border-b border-orange-100 pb-2 mb-2">Doctor's Diagnosis</h4>
                <p className="text-sm text-slate-600 italic bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                  "{selectedVisit.diagnosis || 'No diagnosis recorded.'}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-[#F17343] uppercase tracking-widest border-b border-orange-100 pb-2 flex items-center gap-2">
                <FaRobot /> AI PILOT INSIGHT
              </h4>
              
              {selectedVisit.ai_analysis ? (
                <div className="space-y-3">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 shadow-sm">
                    <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Clinical Summary</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                      {selectedVisit.ai_analysis.summary}
                    </p>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 shadow-sm">
                    <p className="text-[9px] font-black text-[#F17343] uppercase mb-1">Diagnostic Trends</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                      {selectedVisit.ai_analysis.trends}
                    </p>
                  </div>

                  {/* --- PATIENT EDUCATION SECTION --- */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1 flex items-center gap-1">
                      <span>📘</span> Patient Education
                    </p>
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium italic">
                      {selectedVisit.ai_analysis.educational_notes || "Understand your vision health better with these AI insights."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-10 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <FaInfoCircle className="text-slate-300 mb-2" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    No AI data recorded
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-bold text-slate-400 uppercase">
            Attending Optometrist: <span className="text-[#6D6E70]">{selectedVisit.attending_optometrist || selectedVisit.prescribedBy || 'Unknown'}</span>
          </div>
        </div>
      </div>
    );
  };

  const inputClass = "w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest";

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 text-[#F17343] rounded-2xl shadow-sm">
            <FaStethoscope size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase leading-none">
              CLINICAL <span className="text-[#F17343]">EXAM</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Vision Assessment Portal</p>
          </div>
        </div>

        <div className="relative w-full lg:w-96" ref={dropdownRef}>
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F17343]" />
            <input
              type="text"
              placeholder="Search Patient Name or ID..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.length > 0) {
                  const filtered = patients.filter(p =>
                    p.patient_name.toLowerCase().includes(value.toLowerCase()) ||
                    p.id.toString().includes(value)
                  );
                  setFilteredPatients(filtered);
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                }
              }}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:border-[#F17343] focus:ring-4 focus:ring-orange-50 outline-none shadow-sm font-bold text-[#6D6E70]"
            />
          </div>

          {showDropdown && filteredPatients.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-64 overflow-y-auto p-2">
              {filteredPatients.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPatient(p)}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-orange-50 rounded-xl transition-all text-left group"
                >
                  <div>
                    <p className="text-sm font-black text-[#6D6E70] group-hover:text-[#F17343]">{p.patient_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {p.id}</p>
                  </div>
                  <FaUserCheck className="text-slate-200 group-hover:text-[#F17343]" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#F17343] rounded-full" />
              <h3 className="font-black text-[#6D6E70] uppercase text-sm tracking-widest">Patient Identification</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <label className={labelClass}>ID Reference</label>
                <input value={form.patientId || ''} readOnly className={`${inputClass} bg-slate-100 font-black`} placeholder="---" />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Patient Full Name</label>
                <input value={form.fullName || ''} readOnly className={`${inputClass} bg-slate-100 font-black`} placeholder="Select patient..." />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Current Age</label>
                <input value={form.age || ''} readOnly className={`${inputClass} bg-slate-100`} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Biological Gender</label>
                <input value={form.gender || ''} readOnly className={`${inputClass} bg-slate-100`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-[#F17343] rounded-full" />
              <h3 className="font-black text-[#6D6E70] uppercase text-sm tracking-widest">Vision Metrics</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Pinhole OD</label>
                <input name="pinholeOD" placeholder="20/20" value={form.pinholeOD || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pinhole OS</label>
                <input name="pinholeOS" placeholder="20/20" value={form.pinholeOS || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mono PD OD</label>
                <input name="monoPDO" placeholder="32.0" value={form.monoPDO || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mono PD OS</label>
                <input name="monoPOS" placeholder="31.5" value={form.monoPOS || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Exam Date</label>
                <input name="datePrescribed" type="date" value={form.datePrescribed || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Signature Doctor</label>
                <input value={form.prescribedBy || ''} readOnly className={`${inputClass} bg-slate-100 italic font-bold text-[#F17343]`} />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200 border-dashed">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm">
                <FaHistory size={16} />
              </div>
              <h3 className="font-black text-[#6D6E70] uppercase text-sm tracking-widest">Medical History</h3>
            </div>

            {!form.patientId ? (
              <div className="py-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select a patient to view previous visits</div>
            ) : patientHistory.length === 0 ? (
              <div className="py-10 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">No previous checkups found</div>
            ) : (
              <div className="space-y-4">
                {patientHistory.map((visit, index) => (
                  <div key={`${visit.id}-${index}`} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-[#F17343]/30 transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#F17343] bg-orange-50 px-2 py-0.5 rounded-md uppercase">
                          {new Date(visit.date_prescribed).toLocaleDateString()}
                        </span>
                        {visit.ai_analysis && (
                          <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md uppercase flex items-center gap-1">
                            <FaRobot size={8} /> AI Record
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-[#6D6E70] line-clamp-1">{visit.diagnosis || 'No Diagnosis recorded'}</p>
                    </div>
                    <button onClick={() => setSelectedVisit(visit)} className="text-[10px] font-black text-[#F17343] uppercase hover:underline ml-4">Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#6D6E70] rounded-[2rem] p-8 text-white shadow-xl">
            <h3 className="font-black uppercase text-xs tracking-[0.2em] mb-6 opacity-80 flex items-center gap-2">
              <FaCalendarAlt /> Clinical Findings
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 block">Diagnosis</label>
                <textarea name="diagnosis" value={form.diagnosis || ''} onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all min-h-[100px]" placeholder="Describe findings..." />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 block">New Rx</label>
                <textarea name="prescription" value={form.prescription || ''} onChange={handleChange} className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all font-mono" placeholder="OD: -1.00 SPH..." />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-8">
              <button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50">
                {loading ? "Saving..." : "Save Record"}
              </button>
              <button 
                type="button"
                onClick={() => {
                  const currentDoc = form.prescribedBy;
                  setForm({ ...initialFormState, prescribedBy: currentDoc });
                  setSearchTerm('');
                  setRawAiData(null);
                  setAiSuggestion("Select a patient to enable diagnostic suggestions.");
                }}
                className="w-full py-3 bg-white/5 text-white/50 rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition-all"
              >
                Clear Form
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[2rem] p-6 min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-[#F17343] shadow-sm"><FaRobot size={18} className={isAiLoading ? "animate-bounce" : ""} /></div>
                <p className="text-[10px] font-black text-[#F17343] uppercase tracking-widest">AI Clinical Pilot</p>
              </div>
              <button onClick={handleAiAnalysis} disabled={isAiLoading || !form.patientId} className="text-[10px] font-black bg-[#F17343] text-white px-3 py-1.5 rounded-xl uppercase hover:bg-[#d95f2e] transition-all disabled:opacity-30">
                {isAiLoading ? "Processing..." : "Analyze"}
              </button>
            </div>
            <div className={`text-xs text-slate-500 font-medium italic ${isAiLoading ? 'opacity-50' : 'opacity-100'}`}>
              <p className="whitespace-pre-wrap">{aiSuggestion}</p>
            </div>
          </div>
        </div>
      </div>
      <HistoryModal />
    </div>
  );
}

export default function Checkup() {
  return (
    <DoctorLayoutWrapper pageTitle="Patient Checkup">
      <Suspense fallback={<div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Clinic...</div>}>
        <CheckupContent />
      </Suspense>
    </DoctorLayoutWrapper>
  );
}