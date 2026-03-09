'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  FaHome, 
  FaRobot, 
  FaHistory, 
  FaPrescriptionBottleAlt, 
  FaUser, 
  FaSignOutAlt,
  FaTimes 
} from 'react-icons/fa';

export default function SidebarPatient({ isOpen, setIsOpen }) {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize Supabase Client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const menuItems = [
    { name: 'Dashboard', href: '/patient', icon: <FaHome /> },
    { name: 'Visit History', href: '/patient/visit-history', icon: <FaHistory /> },
    { name: 'AI Feedback', href: '/patient/ai-feedback', icon: <FaRobot /> },
    { name: 'Prescription', href: '/patient/prescription', icon: <FaPrescriptionBottleAlt /> },
    { name: 'Profile', href: '/patient/profile', icon: <FaUser /> },
  ];

  const handleLogout = async () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await supabase.auth.signOut();
        router.push('/'); 
      } catch (error) {
        console.error('Error logging out:', error.message);
        router.push('/');
      }
    }
  };

  return (
    <>
      {/* 1. Dark Overlay for Mobile (only shows when sidebar is open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 2. Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#6D6E70] text-white flex flex-col border-r border-slate-200 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex
      `}>
        
        {/* Branding Area */}
        <div className="p-8 pb-10 relative">
          {/* Close button for mobile devices */}
          <button 
            className="md:hidden absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={20} />
          </button>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F17343] to-[#924a2e] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div 
              className="relative bg-white p-1 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex justify-center transition-transform duration-300 hover:-translate-y-1 cursor-pointer" 
              onClick={() => {
                setIsOpen(false);
                router.push('/patient');
              }}
            >
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
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)} // Auto-close on mobile after selection
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-[#F17343] text-white shadow-lg shadow-orange-900/20' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-[#F17343] group-hover:text-white'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium tracking-wide text-xs uppercase">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 transition-all w-full font-bold text-slate-300 text-[10px] uppercase tracking-widest group"
          >
            <FaSignOutAlt className="group-hover:translate-x-1 transition-transform text-[#F17343] group-hover:text-red-400" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}