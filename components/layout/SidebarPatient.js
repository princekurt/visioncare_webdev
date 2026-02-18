'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaHome, 
  FaFileMedical, 
  FaRobot, 
  FaHistory, 
  FaPrescriptionBottleAlt, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

export default function SidebarPatient() {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', href: '/patient', icon: <FaHome /> },
    { name: 'My Records', href: '/patient/my-records', icon: <FaFileMedical /> },
    { name: 'AI Feedback', href: '/patient/ai-feedback', icon: <FaRobot /> },
    { name: 'Visit History', href: '/patient/visit-history', icon: <FaHistory /> },
    { name: 'Prescription', href: '/patient/prescription', icon: <FaPrescriptionBottleAlt /> },
    { name: 'Profile', href: '/patient/profile', icon: <FaUser /> },
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
