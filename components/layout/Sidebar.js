'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaSignOutAlt, FaUserInjured, FaClipboardCheck, FaClock, FaCheckCircle, FaChartBar, FaCog, FaTimes } from 'react-icons/fa';

export default function Sidebar({ isOpen, setIsOpen }) {
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
    <>
      {/* Dark Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#6D6E70] text-white flex flex-col border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex
      `}>
        
        {/* Branding Area */}
        <div className="p-8 pb-10 relative">
          {/* Close button for mobile */}
          <button 
            className="md:hidden absolute top-4 right-4 text-white/50 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={20} />
          </button>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F17343] to-[#924a2e] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div 
              className="relative bg-white p-1 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex justify-center cursor-pointer"
              onClick={() => { setIsOpen(false); router.push('/doctor/dashboard'); }}
            >
              <Image src="/images/eyeVision.png" alt="Logo" width={140} height={40} className="object-contain" />
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close on click for mobile
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive ? 'bg-[#F17343] text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-[#F17343] group-hover:text-white'}`}>{item.icon}</span>
                <span className="font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={() => router.push('/')} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 transition-all w-full font-bold text-slate-300 group">
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}