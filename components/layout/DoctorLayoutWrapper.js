import Sidebar from './Sidebar';
import Header from './Header';

export default function DoctorLayoutWrapper({ children, pageTitle }) {
  const doctorInfo = {
    name: 'Dr. Jane Smith',
    specialty: 'Optometrist',
    avatar: '/doctor-avatar.png', // make sure this exists in /public
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Dynamic Header per page */}
        <Header title={pageTitle} doctor={doctorInfo} />

        {/* Page content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
