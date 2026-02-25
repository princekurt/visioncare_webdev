'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DoctorLayoutWrapper({ children, pageTitle }) {
  const [activeDoctor, setActiveDoctor] = useState({
    name: 'Dr. Jane Smith',
    specialty: 'Optometrist',
  });

  useEffect(() => {
    // 1. Function to pull the latest doctor from storage
    const loadActiveDoctor = () => {
      const savedName = localStorage.getItem('activeDoctor');
      if (savedName) {
        setActiveDoctor(prev => ({ ...prev, name: savedName }));
      }
    };

    // 2. Initial load
    loadActiveDoctor();

    // 3. Listen for the 'storage' event (triggered by your Settings page)
    window.addEventListener('storage', loadActiveDoctor);
    
    return () => window.removeEventListener('storage', loadActiveDoctor);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans text-selection-orange">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-6 pb-0">
          {/* Now passing the dynamic activeDoctor state */}
          <Header title={pageTitle} doctor={activeDoctor} />
        </div>

        <main className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}