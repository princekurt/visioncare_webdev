'use client';

import PatientLayoutWrapper from '../../components/layout/PatientLayoutWrapper';

export default function PatientDashboard() {
  return (
    <PatientLayoutWrapper pageTitle="Dashboard">
      <div className="bg-white p-6 rounded-xl shadow-md">
        Welcome to your patient dashboard.
      </div>
    </PatientLayoutWrapper>
  );
}
