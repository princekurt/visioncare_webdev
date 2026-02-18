'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaSignOutAlt, FaUserInjured, FaClipboardCheck, FaClock, FaCheckCircle, FaChartBar, FaCog } from 'react-icons/fa';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: <FaChartBar /> },
    { name: 'Patient Records', href: '/doctor/patients', icon: <FaUserInjured /> },
    { name: 'Add Patient', href: '/doctor/add-patient', icon: <FaClock /> },
    { name: 'Checkup', href: '/doctor/checkup', icon: <FaCheckCircle /> },
    { name: 'Reports', href: '/doctor/reports', icon: <FaClipboardCheck /> },
    { name: 'Settings', href: '/doctor/settings', icon: <FaCog /> },
  ];

  return (
    <div className="w-72 bg-[#6D6E70] text-white min-h-screen flex flex-col border-r border-slate-200">
      {/* Branding Area - Floating Style */}
      <div className="p-8 pb-10">
        <div className="relative group">
          {/* This hidden div creates the 'glow' or shadow behind the floating logo card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#F17343] to-[#924a2e] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          
          <div className="relative bg-white p-1 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex justify-center transition-transform duration-300 hover:-translate-y-1">
             <Image 
              src="/images/eyeVision.png" 
              alt="EyeVision Logo" 
              width={140} 
              height={40} 
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-[#F17343] text-white shadow-lg shadow-orange-900/20' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-[#F17343] group-hover:text-white'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t border-white/10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 transition-all w-full font-bold text-slate-300 group"
        >
          <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </div>
  );
}