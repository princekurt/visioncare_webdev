'use client';

import { useEffect, useState } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import Link from 'next/link';

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
        <h2 className="text-2xl font-bold">Patient Records</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Gender</th>
                  <th className="px-4 py-2 text-left">Date of Birth</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{p.patient_code}</td>
                    <td className="px-4 py-2">{p.patient_name}</td>
                    <td className="px-4 py-2">{p.patient_gender}</td>
                    <td className="px-4 py-2">{p.patient_dob}</td>
                    <td className="px-4 py-2">{p.patient_contact}</td>
                    <td className="px-4 py-2">{p.patient_email}</td>
                    <td className="px-4 py-2">{p.patient_status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      {/* Edit button */}
                      <Link
                        href={`/doctor/add-patient?edit=true&id=${p.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </Link>
                      {/* View button placeholder */}
                      <button className="px-3 py-1 bg-blue-500 text-white rounded opacity-50 cursor-not-allowed">
                        View
                      </button>
                    </td>
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
