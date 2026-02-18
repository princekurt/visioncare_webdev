'use client';

import { useState } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

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
      <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Add Patient</h2>
        {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="patient_name"
            placeholder="Full Name"
            value={form.patient_name}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
            required
          />
          <select
            name="patient_gender"
            value={form.patient_gender}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            name="patient_address"
            placeholder="Address"
            value={form.patient_address}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          />
          <input
            type="date"
            name="patient_dob"
            value={form.patient_dob}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          />
          <input
            type="text"
            name="patient_contact"
            placeholder="Contact Number"
            value={form.patient_contact}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          />
          <input
            type="email"
            name="patient_email"
            placeholder="Email"
            value={form.patient_email}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          />

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Add Patient'}
          </button>
        </form>
      </div>
    </DoctorLayoutWrapper>
  );
}
