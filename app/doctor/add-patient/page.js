'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaUserPlus, FaCheckCircle } from 'react-icons/fa';

export default function AddPatient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const editMode = searchParams.get('edit') === 'true';
  const patientId = searchParams.get('id');

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

  // 🔥 LOAD PATIENT IF EDITING
  useEffect(() => {
    // Safety check: ensure patientId is present and not the string "null"
    if (editMode && patientId && patientId !== 'null') {
      fetchPatient();
    }
  }, [editMode, patientId]);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${patientId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setForm({
        patient_name: data.patient_name || '',
        patient_gender: data.patient_gender || 'Male',
        patient_address: data.patient_address || '',
        patient_dob: data.patient_dob || '',
        patient_contact: data.patient_contact || '',
        patient_email: data.patient_email || ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        editMode ? `/api/patients/${patientId}` : '/api/patients',
        {
          method: editMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (editMode) {
        setSuccessMsg('Patient updated successfully!');
        setTimeout(() => {
          router.push('/doctor/patients');
        }, 1000);
      } else {
        setSuccessMsg(
          `Patient ${data.patient.patient_name} added successfully! Code: ${data.patient.patient_code}`
        );

        setForm({
          patient_name: '',
          patient_gender: 'Male',
          patient_address: '',
          patient_dob: '',
          patient_contact: '',
          patient_email: ''
        });
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayoutWrapper pageTitle={editMode ? "Edit Patient" : "Add Patient"}>
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 text-[#F17343] rounded-xl">
            <FaUserPlus size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
              {editMode ? (
                <>EDIT <span className="text-[#F17343]">PATIENT</span></>
              ) : (
                <>REGISTER <span className="text-[#F17343]">NEW PATIENT</span></>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">
              Patient Information Form
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <FaCheckCircle />
            <p className="text-sm font-semibold">{successMsg}</p>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-8">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Full Name</label>
              <input
                type="text"
                name="patient_name"
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

            {/* Contact */}
            <div>
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Contact Number</label>
              <input
                type="text"
                name="patient_contact"
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
                value={form.patient_email}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-[#6D6E70] uppercase ml-1 mb-1 block">Home Address</label>
              <input
                type="text"
                name="patient_address"
                value={form.patient_address}
                onChange={handleChange}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-[#d9653a] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FaUserPlus />
                    {editMode ? 'Save Changes' : 'Register Patient'}
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