'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaBars } from 'react-icons/fa'; // Import a menu icon

export default function DoctorLayoutWrapper({ children, pageTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDoctor, setActiveDoctor] = useState({
    name: 'Dr. Jane Smith',
    specialty: 'Optometrist',
  });

  useEffect(() => {
    const loadActiveDoctor = () => {
      const savedName = localStorage.getItem('activeDoctor');
      if (savedName) {
        setActiveDoctor(prev => ({ ...prev, name: savedName }));
      }
    };
    loadActiveDoctor();
    window.addEventListener('storage', loadActiveDoctor);
    return () => window.removeEventListener('storage', loadActiveDoctor);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Sidebar with mobile toggle logic */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-slate-200 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#6D6E70] hover:bg-slate-100 rounded-lg"
          >
            <FaBars size={20} />
          </button>
          <span className="ml-4 font-bold text-[#F17343]">VISIONCARE</span>
        </div>

        <div className="p-4 md:p-6 pb-0">
          <Header title={pageTitle} doctor={activeDoctor} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-2">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}