'use client';

import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import DoctorLayoutWrapper from '../../../components/layout/DoctorLayoutWrapper';
import { FaUserCircle, FaSave, FaUserEdit, FaLock, FaBell } from 'react-icons/fa';

export default function Settings() {
  const [profile, setProfile] = useState({ 
    name: 'Dr. Jane Smith', 
    email: 'dr@example.com', 
    contact: '', 
    specialty: 'Optometrist' 
  });

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = () => alert('Settings saved (mock)');

  // Reusable label style for consistency
  const labelClass = "text-[10px] font-black text-[#6D6E70] uppercase ml-1 mb-1.5 block tracking-widest";
  const inputClass = "w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/10 transition-all outline-none text-[#6D6E70] font-medium placeholder:text-slate-300";

  return (
    <DoctorLayoutWrapper pageTitle="Settings">
      <div className="max-w-4xl mx-auto pb-10">
        
        {/* Settings Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#6D6E70] tracking-tight uppercase">
            ACCOUNT <span className="text-[#F17343]">SETTINGS</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">Manage your professional profile and account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-[#6D6E70] border-4 border-white shadow-md">
                  <FaUserCircle size={60} />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-[#F17343] text-white rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform">
                  <FaUserEdit size={12} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-[#6D6E70]">{profile.name}</h3>
              <p className="text-xs font-bold text-[#F17343] uppercase tracking-wider">{profile.specialty}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-50 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-[#6D6E70] hover:bg-slate-50 rounded-lg transition-colors">
                  <FaLock className="text-slate-400" /> Change Password
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-semibold text-[#6D6E70] hover:bg-slate-50 rounded-lg transition-colors">
                  <FaBell className="text-slate-400" /> Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center gap-2 mb-8 pb-2 border-b border-slate-50">
                <div className="w-1.5 h-4 bg-[#F17343] rounded-full" />
                <h3 className="font-bold text-[#6D6E70] uppercase text-sm tracking-wider">Profile Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Full Name</label>
                  <Input 
                    name="name" 
                    placeholder="Full Name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
                
                <div>
                  <label className={labelClass}>Email Address</label>
                  <Input 
                    name="email" 
                    placeholder="Email" 
                    value={profile.email} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>

                <div>
                  <label className={labelClass}>Contact Number</label>
                  <Input 
                    name="contact" 
                    placeholder="Contact" 
                    value={profile.contact} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Professional Specialty</label>
                  <Input 
                    name="specialty" 
                    placeholder="Specialty" 
                    value={profile.specialty} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-3.5 bg-[#F17343] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 hover:bg-[#d9653a] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  <FaSave />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DoctorLayoutWrapper>
  );
}