'use client';

import SidebarPatient from './SidebarPatient';
import HeaderPatient from './HeaderPatient';

export default function PatientLayoutWrapper({ children, pageTitle }) {
  const patientInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/patient-avatar.png',
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      {/* Patient Sidebar */}
      <SidebarPatient />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-6 pb-0">
          <HeaderPatient title={pageTitle} patient={patientInfo} />
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