'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function AddPatient() {
  const [form, setForm] = useState({
    name: '', gender: '', address: '', dob: '', contact: '', email: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    console.log('Add patient:', form);
    alert('Patient added (mock)!');
    setForm({ name:'', gender:'', address:'', dob:'', contact:'', email:'' });
  };

  return (
    <DoctorLayoutWrapper pageTitle="Add Patient">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Add Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <select name="gender" value={form.gender} onChange={handleChange} className="p-3 rounded-lg bg-white/20 backdrop-blur-md shadow-inner">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <Input name="dob" type="date" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
          <Input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button className="bg-gray-400 hover:bg-gray-500" onClick={() => setForm({ name:'', gender:'', address:'', dob:'', contact:'', email:'' })}>Cancel</Button>
        </div>
      </Card>
    </DoctorLayoutWrapper>
  );
}
