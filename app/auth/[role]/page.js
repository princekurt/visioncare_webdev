'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthPage() {
  const { role } = useParams(); // Gets 'doctor' or 'patient' from the URL
  const router = useRouter();
  
  // Initialize Supabase using your env variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Success! Redirect based on the role in the path
      // Note: Make sure your folders are named 'doctor' and 'patient'
      router.push(`/${role}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-[#F17343] selection:text-white">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 relative overflow-hidden">
        
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${role === 'doctor' ? 'bg-[#6D6E70]' : 'bg-[#F17343]'}`} />

        <button 
          onClick={() => router.push('/')} 
          className="mb-8 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#F17343] transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Selection
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-[#6D6E70] uppercase tracking-tighter">
            {role} <span className="text-[#F17343]">Portal</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="email" 
                required 
                placeholder="name@visioncare.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/5 outline-none font-bold text-[#6D6E70] transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type={showPassword ? "text" : "password"}
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#F17343] focus:ring-4 focus:ring-[#F17343]/5 outline-none font-bold text-[#6D6E70] transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#F17343] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 ${role === 'doctor' ? 'bg-[#6D6E70]' : 'bg-[#F17343]'} hover:opacity-90 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 mt-4`}
          >
            {loading ? "Authenticating..." : `Access ${role} Dashboard`}
          </button>
        </form>

        {role === 'patient' && (
          <p className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            First time? <button onClick={() => router.push('/auth/signup')} className="text-[#F17343] hover:underline ml-1">Create an account</button>
          </p>
        )}
      </div>
    </div>
  );
}