'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';

export default function Settings() {
  const [profile, setProfile] = useState({ name:'Dr. Jane Smith', email:'dr@example.com', contact:'', specialty:'Optometrist' });

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = () => alert('Settings saved (mock)');

  return (
    <DoctorLayoutWrapper pageTitle="Settings">
      <Card>
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="name" placeholder="Name" value={profile.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={profile.email} onChange={handleChange} />
          <Input name="contact" placeholder="Contact" value={profile.contact} onChange={handleChange} />
          <Input name="specialty" placeholder="Specialty" value={profile.specialty} onChange={handleChange} />
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </DoctorLayoutWrapper>
  );
}
