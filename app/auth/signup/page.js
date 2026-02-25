'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function PatientSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // THE AUTO-LINK: Matches the login email with your database column
      const { error: linkError } = await supabase
        .from('tbl_patient')
        .update({ user_id: authData.user.id })
        .eq('patient_email', email); 

      if (linkError) console.error("Link Error:", linkError);
      
      alert("Registration successful! You can now log in.");
      router.push('/auth/patient');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
        <button onClick={() => router.push('/')} className="mb-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#F17343]">
          <FaArrowLeft /> Back
        </button>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-[#6D6E70] uppercase tracking-tighter">
            Patient <span className="text-[#F17343]">Registration</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Create an account to see your results</p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Must match clinic records)</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="email" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#F17343] outline-none font-bold text-[#6D6E70]" placeholder="your@email.com" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#F17343] outline-none font-bold text-[#6D6E70]" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} className="w-full py-4 bg-[#F17343] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-[#6D6E70] transition-all flex items-center justify-center gap-2">
            {loading ? "Processing..." : "Register"} <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
}