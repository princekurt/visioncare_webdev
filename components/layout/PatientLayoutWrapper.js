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
    <div className="flex min-h-screen bg-gray-100">
      <SidebarPatient />

      <div className="flex-1 p-6">
        <HeaderPatient title={pageTitle} patient={patientInfo} />
        {children}
      </div>
    </div>
  );
}
