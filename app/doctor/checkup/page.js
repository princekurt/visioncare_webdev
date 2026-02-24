'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaStethoscope, FaSearch, FaUserCheck, FaRobot, FaCalendarAlt } from 'react-icons/fa';

// 1. Initial State to prevent "uncontrolled input" errors
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
  prescribedBy: 'Dr. Jane Smith',
  chiefComplaint: '',
  diagnosis: '',
  prescription: '',
  nextVisit: ''
};

function CheckupContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize form with the full state object
  const [form, setForm] = useState(initialFormState);

  // Load patients for search
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('/api/patients');
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
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
      const res = await fetch('/api/checkups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      alert('Checkup record saved to database!');
      
      // Reset form properly using the initial state object
      setForm(initialFormState);
      setSearchTerm('');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium placeholder:text-slate-400";
  const labelClass = "text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest";

  return (
    <div className="max-w-6xl mx-auto pb-10">
      {/* Header & Search Bar */}
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
              onChange={handleSearch}
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
        {/* Left Side: Assessment Form */}
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
                <input value={form.prescribedBy || ''} readOnly className={`${inputClass} bg-slate-100 italic`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clinical Notes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#6D6E70] rounded-[2rem] p-8 text-white shadow-xl">
            <h3 className="font-black uppercase text-xs tracking-[0.2em] mb-6 opacity-80 flex items-center gap-2">
              <FaCalendarAlt /> Clinical Findings
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 block">Diagnosis</label>
                <textarea 
                  name="diagnosis" 
                  value={form.diagnosis || ''} 
                  onChange={handleChange} 
                  className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all min-h-[100px]" 
                  placeholder="Describe findings..."
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 block">New Rx</label>
                <textarea 
                  name="prescription" 
                  value={form.prescription || ''} 
                  onChange={handleChange} 
                  className="w-full bg-white/10 border border-white/10 rounded-xl p-3 text-sm focus:bg-white/20 outline-none transition-all font-mono" 
                  placeholder="OD: -1.00 SPH..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-8">
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setForm(initialFormState);
                  setSearchTerm('');
                }}
                className="w-full py-3 bg-white/5 text-white/50 rounded-2xl font-bold text-xs uppercase hover:bg-white/10 transition-all"
              >
                Clear Form
              </button>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[2rem] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white rounded-lg text-[#F17343] shadow-sm">
                <FaRobot size={18} />
              </div>
              <p className="text-[10px] font-black text-[#F17343] uppercase tracking-widest">AI Clinical Pilot</p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
              {form.fullName ? `Ready to analyze ${form.fullName}'s vision data.` : "Select a patient to enable diagnostic suggestions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapping in Suspense for Vercel build safety
export default function Checkup() {
  return (
    <DoctorLayoutWrapper pageTitle="Patient Checkup">
      <Suspense fallback={<div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Clinic...</div>}>
        <CheckupContent />
      </Suspense>
    </DoctorLayoutWrapper>
  );
}