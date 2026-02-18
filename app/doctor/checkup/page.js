'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaStethoscope, FaEye, FaNotesMedical, FaRobot } from 'react-icons/fa';

export default function Checkup() {
  const [form, setForm] = useState({
    patientId:'', fullName:'', age:'', gender:'', pinholeOD:'', pinholeOS:'',
    monoPDO:'', monoPOS:'', habitualPrescription:'', datePrescribed:new Date().toISOString().split('T')[0],
    prescribedBy:'Dr. Jane Smith', chiefComplaint:'', ocularHistory:'', diagnosis:'', prescription:'', nextVisit:''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log('Checkup submitted:', form);
    alert('Checkup submitted (mock)!');
  };

  // Consistent Input Style
  const inputClass = "w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium placeholder:text-slate-400";
  const labelClass = "text-[10px] font-bold text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest";

  return (
    <DoctorLayoutWrapper pageTitle="Checkup">
      <div className="max-w-5xl mx-auto pb-10">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-100 text-[#F17343] rounded-2xl shadow-sm">
            <FaStethoscope size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
              PATIENT <span className="text-[#F17343]">CHECKUP</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Clinical Examination Record</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Patient Info & Vision Assessment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Basic Information */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
                <div className="w-1.5 h-4 bg-[#F17343] rounded-full" />
                <h3 className="font-bold text-[#6D6E70] uppercase text-sm tracking-wider">General Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Patient ID</label>
                  <Input name="patientId" placeholder="EX: 1002" value={form.patientId} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <Input name="fullName" placeholder="Enter patient name" value={form.fullName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <Input name="age" placeholder="Years" value={form.age} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Vision Assessment */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
                <div className="w-1.5 h-4 bg-[#F17343] rounded-full" />
                <h3 className="font-bold text-[#6D6E70] uppercase text-sm tracking-wider">Vision Assessment</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className={labelClass}>Pinhole OD</label>
                  <Input name="pinholeOD" placeholder="OD" value={form.pinholeOD} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Pinhole OS</label>
                  <Input name="pinholeOS" placeholder="OS" value={form.pinholeOS} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Mono PD OD</label>
                  <Input name="monoPDO" placeholder="PD OD" value={form.monoPDO} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Mono PD OS</label>
                  <Input name="monoPOS" placeholder="PD OS" value={form.monoPOS} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Date Prescribed</label>
                  <Input name="datePrescribed" type="date" value={form.datePrescribed} onChange={handleChange} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Attending Optometrist</label>
                  <Input name="prescribedBy" value={form.prescribedBy} readOnly className={`${inputClass} bg-slate-100 cursor-not-allowed`} />
                </div>
                <div className="col-span-4">
                  <label className={labelClass}>Habitual Prescription</label>
                  <Input name="habitualPrescription" placeholder="Existing prescription details..." value={form.habitualPrescription} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Clinical Notes & Submission */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-50">
                <div className="w-1.5 h-4 bg-[#6D6E70] rounded-full" />
                <h3 className="font-bold text-[#6D6E70] uppercase text-sm tracking-wider">Clinical Notes</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <label className={labelClass}>Chief Complaint</label>
                  <textarea name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} className={`${inputClass} min-h-[80px]`} placeholder="Reason for visit..." />
                </div>
                <div>
                  <label className={labelClass}>Diagnosis</label>
                  <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} className={`${inputClass} min-h-[80px]`} placeholder="Final assessment..." />
                </div>
                <div>
                  <label className={labelClass}>New Prescription</label>
                  <textarea name="prescription" value={form.prescription} onChange={handleChange} className={`${inputClass} min-h-[80px] font-mono text-sm`} placeholder="Rx details..." />
                </div>
                <div>
                  <label className={labelClass}>Next Visit Schedule</label>
                  <Input name="nextVisit" type="date" value={form.nextVisit} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              {/* AI Placeholder */}
              <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-3">
                <FaRobot className="text-[#F17343] mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-[#F17343] uppercase tracking-tighter">Smart Suggestion</p>
                  <p className="text-[11px] text-[#6D6E70] leading-tight mt-0.5 italic">Complete assessment to generate AI insight.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-3 bg-[#F17343] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-200 hover:bg-[#d9653a] transition-all"
                >
                  Submit
                </button>
                <button 
                  onClick={() => setForm({})}
                  className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayoutWrapper>
  );
}