'use client';

import { useState, useEffect } from 'react';
import PatientTable from '../../../components/tables/PatientTable';
import Card from '../../../components/ui/Card';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // placeholder fetch for now
    setPatients([
      { id: 'P001', name: 'Alice Smith', age: 25, lastVisit: '2026-02-10', nextVisit: '2026-03-01', status: 'Active' },
      { id: 'P002', name: 'Bob Johnson', age: 30, lastVisit: '2026-02-05', nextVisit: '2026-03-02', status: 'Pending' },
      { id: 'P003', name: 'Charlie Lee', age: 28, lastVisit: '2026-01-20', nextVisit: '2026-03-10', status: 'Completed' },
    ]);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus ? p.status === filterStatus : true)
  );

  return (
    <DoctorLayoutWrapper pageTitle="Patient Records">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <Card>
          <PatientTable patients={filteredPatients} />
        </Card>
      </div>
    </DoctorLayoutWrapper>
  );
}
