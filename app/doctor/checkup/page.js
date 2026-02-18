'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

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

  return (
    <DoctorLayoutWrapper pageTitle="Checkup">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Patient Checkup</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} />
          <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} />
          <Input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
          <select name="gender" value={form.gender} onChange={handleChange} className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Vision Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="pinholeOD" placeholder="Pinhole OD" value={form.pinholeOD} onChange={handleChange} />
          <Input name="pinholeOS" placeholder="Pinhole OS" value={form.pinholeOS} onChange={handleChange} />
          <Input name="monoPDO" placeholder="Mono PD OD" value={form.monoPDO} onChange={handleChange} />
          <Input name="monoPOS" placeholder="Mono PD OS" value={form.monoPOS} onChange={handleChange} />
          <Input name="habitualPrescription" placeholder="Habitual Prescription" value={form.habitualPrescription} onChange={handleChange} className="col-span-2" />
          <Input name="datePrescribed" type="date" value={form.datePrescribed} onChange={handleChange} />
          <Input name="prescribedBy" value={form.prescribedBy} readOnly />
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Clinical Notes & Diagnosis</h3>
        <div className="grid grid-cols-1 gap-4">
          <textarea name="chiefComplaint" placeholder="Chief Complaint" value={form.chiefComplaint} onChange={handleChange} className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner" />
          <textarea name="ocularHistory" placeholder="Ocular History" value={form.ocularHistory} onChange={handleChange} className="p-3 rounded-lg bg-white/20 shadow-inner" />
          <textarea name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} className="p-3 rounded-lg bg-white/20 shadow-inner" />
          <textarea name="prescription" placeholder="Prescription" value={form.prescription} onChange={handleChange} className="p-3 rounded-lg bg-white/20 shadow-inner" />
          <Input name="nextVisit" type="date" value={form.nextVisit} onChange={handleChange} />
        </div>

        <div className="mt-6 p-4 bg-white/20 backdrop-blur-md rounded-lg shadow-inner border-dashed border-2 border-gray-300 text-gray-600">
          AI Diagnosis Suggestion Placeholder
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleSubmit}>Submit Record</Button>
          <Button className="bg-gray-400 hover:bg-gray-500" onClick={() => setForm({})}>Cancel</Button>
        </div>
      </Card>
    </DoctorLayoutWrapper>
  );
}
