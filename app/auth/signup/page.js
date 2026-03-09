'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowRight, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PatientSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. SECURE GATEKEEPER CHECK (Calling your new API route)
      const verifyRes = await fetch('/api/auth/verify-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.exists) {
        setErrorMessage("This email is not registered in our clinical records. Please contact your doctor to be added first.");
        setLoading(false);
        return;
      }

      // 2. PROCEED WITH AUTH (Now that we know they are in the clinic records)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 3. THE AUTO-LINK: Attach the Supabase User ID to their clinical record
        const { error: linkError } = await supabase
          .from('tbl_patient')
          .update({ user_id: authData.user.id })
          .eq('patient_email', email); 

        if (linkError) console.error("Link Error:", linkError);
        
        alert("Registration successful! Check your email for a verification link, then you can log in.");
        router.push('/auth/patient');
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <button 
          onClick={() => router.push('/')} 
          className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#F17343] transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#6D6E70] uppercase tracking-tighter">
            Patient <span className="text-[#F17343]">Registration</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Create an account to see your results</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase leading-relaxed animate-in fade-in slide-in-from-top-1">
            <FaExclamationTriangle className="shrink-0 text-xs" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="email" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#F17343] outline-none font-bold text-[#6D6E70] transition-all" 
                placeholder="your@email.com" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase italic ml-1">* Must match the email you gave the clinic</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="password" 
                required 
                minLength={6}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#F17343] outline-none font-bold text-[#6D6E70] transition-all" 
                placeholder="••••••••" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button 
            disabled={loading} 
            className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-[#6D6E70] disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Verifying Records..." : "Register"} <FaArrowRight />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase">
                Already have an account? 
                <button onClick={() => router.push('/auth/patient')} className="ml-2 text-[#F17343] hover:underline">Log In</button>
            </p>
        </div>
      </div>
    </div>
  );
}