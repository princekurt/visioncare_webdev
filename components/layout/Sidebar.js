'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaUserInjured, FaClipboardCheck, FaClock, FaCheckCircle } from 'react-icons/fa';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: <FaUserInjured /> },
    { name: 'Patient Records', href: '/doctor/patients', icon: <FaClipboardCheck /> },
    { name: 'Add Patient', href: '/doctor/add-patient', icon: <FaClock /> },
    { name: 'Checkup', href: '/doctor/checkup', icon: <FaCheckCircle /> },
    { name: 'Reports', href: '/doctor/reports', icon: <FaClipboardCheck /> },
    { name: 'Settings', href: '/doctor/settings', icon: <FaClock /> },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white min-h-screen p-6 flex flex-col justify-between">
      {/* Menu Links */}
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition mt-6 w-full font-semibold"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}
