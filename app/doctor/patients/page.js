'use client';

import { useEffect, useState } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch patients');

      setPatients(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayoutWrapper pageTitle="Patient Records">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Table</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white/20 backdrop-blur-md rounded-xl shadow-xl divide-y divide-gray-200">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">DOB</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-white/10">
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.patient_code}</td>
                    <td className="px-4 py-2">{p.patient_name}</td>
                    <td className="px-4 py-2">{p.patient_gender}</td>
                    <td className="px-4 py-2">{p.patient_dob}</td>
                    <td className="px-4 py-2">{p.patient_contact}</td>
                    <td className="px-4 py-2">{p.patient_email}</td>
                    <td className="px-4 py-2">{p.patient_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DoctorLayoutWrapper>
  );
}
