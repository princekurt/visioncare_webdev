'use client';
import Link from 'next/link';
import { FaTachometerAlt, FaUserInjured, FaPlus, FaClipboardCheck, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Patient Records', href: '/doctor/patients', icon: <FaUserInjured /> },
    { name: 'Add Patient', href: '/doctor/add-patient', icon: <FaPlus /> },
    { name: 'Checkup', href: '/doctor/checkup', icon: <FaClipboardCheck /> },
    { name: 'Reports', href: '/doctor/reports', icon: <FaChartBar /> },
    { name: 'Settings', href: '/doctor/settings', icon: <FaCog /> },
    { name: 'Logout', href: '/logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 flex flex-col">
      <div className="text-2xl font-bold mb-6">VisionCare</div>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition">
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
