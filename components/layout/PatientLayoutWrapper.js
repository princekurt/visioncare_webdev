'use client';

import SidebarPatient from './SidebarPatient';
import HeaderPatient from './HeaderPatient';

export default function PatientLayoutWrapper({ children, pageTitle, patientData }) {
  // If no patientData is passed, we use a fallback to prevent errors
  const displayInfo = {
    name: patientData?.patient_name || 'Loading...',
    email: patientData?.patient_email || '',
    avatar: '/images/default-avatar.png', // Make sure this path exists or use a placeholder
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      {/* Patient Sidebar */}
      <SidebarPatient patient={displayInfo} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-6 pb-0">
          {/* Now the header will show the REAL patient name from Supabase */}
          <HeaderPatient title={pageTitle} patient={displayInfo} />
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