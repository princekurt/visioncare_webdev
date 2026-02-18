'use client';

import { useState } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaUserPlus, FaCheckCircle } from 'react-icons/fa';

export default function AddPatient() {
  const [form, setForm] = useState({
    patient_name: '',
    patient_gender: 'Male',
    patient_address: '',
    patient_dob: '',
    patient_contact: '',
    patient_email: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(`Patient ${data.patient.patient_name} added successfully! Code: ${data.patient.patient_code}`);
        setForm({
          patient_name: '',
          patient_gender: 'Male',
          patient_address: '',
          patient_dob: '',
          patient_contact: '',
          patient_email: ''
        });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayoutWrapper pageTitle="Add Patient">
      <div className="max-w-2xl mx-auto">
        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 text-[#F17343] rounded-xl">
            <FaUserPlus size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
              REGISTER <span className="text-[#F17343]">NEW PATIENT</span>
            </h2>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Patient Information Form</p>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4 duration-300">
            <FaCheckCircle className="shrink-0" />
            <p className="text-sm font-semibold">{successMsg}</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
            
            {/* Full Name - Span Full */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Full Name</label>
              <input
                type="text"
                name="patient_name"
                placeholder="Juan Dela Cruz"
                value={form.patient_name}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Gender</label>
              <select
                name="patient_gender"
                value={form.patient_gender}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium appearance-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Date of Birth</label>
              <input
                type="date"
                name="patient_dob"
                value={form.patient_dob}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
                required
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Contact Number</label>
              <input
                type="text"
                name="patient_contact"
                placeholder="0912 345 6789"
                value={form.patient_contact}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Email Address</label>
              <input
                type="email"
                name="patient_email"
                placeholder="example@mail.com"
                value={form.patient_email}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              />
            </div>

            {/* Address - Span Full */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Home Address</label>
              <input
                type="text"
                name="patient_address"
                placeholder="Street, City, Province"
                value={form.patient_address}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#d9653a] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUserPlus />
                    Register Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DoctorLayoutWrapper>
  );
}