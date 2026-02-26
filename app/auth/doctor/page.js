'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowLeft, FaStethoscope } from 'react-icons/fa';
import Image from 'next/image';

export default function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Directs to the Doctor's specific dashboard
      router.push('/doctor/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] selection:bg-orange-100 font-sans relative overflow-hidden">
      {/* Background Decorative Element - Same as Patient but slightly different vibe */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6D6E70]" /> 
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-slate-100 rounded-full opacity-50 blur-3xl" />
      
      <div className="w-full max-w-md px-6 relative z-10">
        <button 
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#6D6E70] transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          
          {/* Logo Branding */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
               <div className="relative w-40 h-16">
                  <Image 
                    src="/images/eyeVision.png" 
                    alt="EyeVision Logo" 
                    fill
                    className="object-contain"
                    priority
                  />
               </div>
            </div>
            
            <h1 className="text-2xl font-black tracking-tight text-[#6D6E70]">
              DOCTOR<span className="text-[#F17343]">PORTAL</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-2">
              Clinic Management System
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-r-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Staff Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="email" 
                  placeholder="doctor@visioncare.com" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#6D6E70] focus:ring-4 focus:ring-slate-50 outline-none transition-all font-bold text-sm text-[#6D6E70]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-[#6D6E70] focus:ring-4 focus:ring-slate-50 outline-none transition-all font-bold text-sm text-[#6D6E70]"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#d96236] hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              <FaStethoscope className={loading ? "animate-pulse" : ""} />
              {loading ? "Verifying Credentials..." : "Launch Dashboard"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Authorized Personnel Only
            </p>
          </div>
        </div>

        {/* Footer Motto */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
          <div className="h-[1px] w-8 bg-slate-300" />
          <p className="text-[10px] font-bold text-slate-500 italic">"Precision in every view"</p>
          <div className="h-[1px] w-8 bg-slate-300" />
        </div>
      </div>
    </div>
  );
}