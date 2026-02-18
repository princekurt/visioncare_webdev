import Sidebar from './Sidebar';
import Header from './Header';

export default function DoctorLayoutWrapper({ children, pageTitle }) {
  const doctorInfo = {
    name: 'Dr. Jane Smith',
    specialty: 'Optometrist',
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="p-6 pb-0">
          <Header title={pageTitle} doctor={doctorInfo} />
        </div>

        {/* Scrollable Page content */}
        <main className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}