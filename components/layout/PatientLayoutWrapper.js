'use client';

import { useState } from 'react';
import SidebarPatient from './SidebarPatient';
import HeaderPatient from './HeaderPatient';
import { FaBars } from 'react-icons/fa';

export default function PatientLayoutWrapper({ children, pageTitle, patientData }) {
  // 1. Add state to track if mobile menu is open
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayInfo = {
    name: patientData?.patient_name || 'Loading...',
    email: patientData?.patient_email || '',
    avatar: '/images/default-avatar.png',
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      
      {/* 2. Pass the state props to the SidebarPatient */}
      <SidebarPatient 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        patient={displayInfo} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        
        {/* 3. MOBILE TOP BAR: Only visible on small screens */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#6D6E70] hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FaBars size={20} />
          </button>
          <div className="text-right">
            <span className="block font-black text-[#F17343] text-xs tracking-tighter">VISIONCARE</span>
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Patient Portal</span>
          </div>
        </div>

        <div className="p-4 md:p-6 pb-0">
          {/* Header shows the real patient data */}
          <HeaderPatient title={pageTitle} patient={displayInfo} />
        </div>
        
        {/* 4. MAIN CONTENT: Adjusted padding for mobile */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}