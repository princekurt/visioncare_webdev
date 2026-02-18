import Sidebar from './Sidebar';
import Header from './Header';

export default function DoctorLayoutWrapper({ children, pageTitle }) {
  const doctorInfo = {
    name: 'Dr. Jane Smith',
    specialty: 'Optometrist', 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Persistent Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Dynamic Header */}
        <Header title={pageTitle} doctor={doctorInfo} />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
