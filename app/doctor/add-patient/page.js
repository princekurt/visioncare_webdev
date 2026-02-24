'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaUserPlus, FaCheckCircle, FaEdit } from 'react-icons/fa';

// This internal component handles the searchParams safely
function AddPatientContent() {
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

  useEffect(() => {
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
      console.error(err.message);
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
        setTimeout(() => router.push('/doctor/patients'), 1500);
      } else {
        setSuccessMsg(`Patient ${data.patient.patient_name} registered! Code: ${data.patient.patient_code}`);
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
    <div className="max-w-2xl mx-auto">
      {/* Dynamic Header based on Mode */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-orange-100 text-[#F17343] rounded-xl">
          {editMode ? <FaEdit size={20} /> : <FaUserPlus size={20} />}
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
            {editMode ? <>EDIT <span className="text-[#F17343]">PATIENT</span></> : <>REGISTER <span className="text-[#F17343]">NEW PATIENT</span></>}
          </h2>
          <p className="text-xs text-slate-500 font-bold tracking-widest uppercase font-sans">
            {editMode ? 'Update existing records' : 'Enter new patient details'}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-2">
          <FaCheckCircle />
          <p className="text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Full Name</label>
            <input
              type="text"
              name="patient_name"
              value={form.patient_name}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Gender</label>
            <select
              name="patient_gender"
              value={form.patient_gender}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Date of Birth</label>
            <input
              type="date"
              name="patient_dob"
              value={form.patient_dob}
              onChange={handleChange}
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Contact Number</label>
            <input
              type="text"
              name="patient_contact"
              value={form.patient_contact}
              onChange={handleChange}
              placeholder="0912 345 6789"
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Email Address</label>
            <input
              type="email"
              name="patient_email"
              value={form.patient_email}
              onChange={handleChange}
              placeholder="patient@example.com"
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1 block tracking-widest">Home Address</label>
            <input
              type="text"
              name="patient_address"
              value={form.patient_address}
              onChange={handleChange}
              placeholder="St. Name, City, Province"
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium"
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#d9653a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>{editMode ? 'Update Records' : 'Register Patient'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Export
export default function AddPatient() {
  return (
    <DoctorLayoutWrapper pageTitle="Patient Management">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-orange-100 border-t-[#F17343] rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Preparing Form...</p>
        </div>
      }>
        <AddPatientContent />
      </Suspense>
    </DoctorLayoutWrapper>
  );
}