'use client';

import { useEffect, useState } from 'react';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import Link from 'next/link';
import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // 🔎 Search Filtering Logic
  const filteredPatients = patients.filter((p) => {
    const search = searchTerm.toLowerCase();

    return (
      p.patient_code?.toLowerCase().includes(search) ||
      p.patient_name?.toLowerCase().includes(search) ||
      p.patient_gender?.toLowerCase().includes(search) ||
      p.patient_contact?.toLowerCase().includes(search) ||
      p.patient_email?.toLowerCase().includes(search) ||
      p.patient_status?.toLowerCase().includes(search)
    );
  });

  return (
    <DoctorLayoutWrapper pageTitle="Patient Records">
      <div className="flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight">
              PATIENT <span className="text-[#F17343]">RECORDS</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Manage and view patient
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F17343]/20 focus:border-[#F17343] transition-all w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F17343]"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                
                <thead className="bg-[#6D6E70] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-nowrap">Sex</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-nowrap">Date of Birth</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 text-sm font-bold text-[#F17343]">
                          #{p.patient_code}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#6D6E70]">
                          {p.patient_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {p.patient_gender}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {p.patient_dob}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex flex-col">
                            <span>{p.patient_contact}</span>
                            <span className="text-[10px] text-slate-400">
                              {p.patient_email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                              p.patient_status?.toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.patient_status || 'New'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-2">
                            <Link
                              href={`/doctor/add-patient?edit=true&id=${p.id}`}
                              className="p-2 text-slate-400 hover:text-[#F17343] hover:bg-orange-50 rounded-lg transition-all"
                              title="Edit Patient"
                            >
                              <FaEdit size={16} />
                            </Link>
                            <button
                              className="p-2 text-slate-400 hover:text-[#6D6E70] hover:bg-slate-100 rounded-lg transition-all opacity-50 cursor-not-allowed"
                              title="View Records"
                            >
                              <FaEye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-slate-400 text-sm">
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium">
                Showing{' '}
                <span className="text-[#6D6E70]">
                  {filteredPatients.length}
                </span>{' '}
                registered patients
              </p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayoutWrapper>
  );
}