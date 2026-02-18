'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Fixed: Added missing import

export default function Login() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] selection:bg-orange-100 font-sans">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F17343]" />
      
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10">
          
          {/* Logo Branding */}
          <div className="text-center mb-10 group">
            <div className="flex justify-center mb-4">
               {/* Fixed: Removed the CSS Eye border and allowed the image to breathe */}
               <div className="relative w-48 h-20">
                  <Image 
                    src="/images/eyeVision.png" 
                    alt="EyeVision Logo" 
                    fill
                    className="object-contain"
                    priority
                  />
               </div>
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-[#F17343]">
              VISION<span className="text-[#6D6E70]">CARE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-bold mt-1">
              OPTICAL CLINIC MANAGEMENT
            </p>
          </div>

          <div className="space-y-4">
            {/* Doctor Portal Button */}
            <button
              onClick={() => router.push('/doctor/dashboard')}
              className="group relative flex items-center w-full p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#F17343] hover:shadow-md transition-all duration-300 overflow-hidden text-left"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-orange-100 text-[#F17343] rounded-xl group-hover:bg-[#F17343] group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                </div>
                <div>
                  <p className="font-bold text-[#6D6E70] text-lg leading-tight">Doctor Portal</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Management & Staff</p>
                </div>
              </div>
            </button>

            {/* Patient Portal Button */}
            <button
              onClick={() => router.push('/patient')}
              className="group relative flex items-center w-full p-5 bg-white border border-slate-200 rounded-2xl hover:border-[#6D6E70] hover:shadow-md transition-all duration-300 overflow-hidden text-left"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-slate-50 rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-slate-100 text-[#6D6E70] rounded-xl group-hover:bg-[#6D6E70] group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className="font-bold text-[#6D6E70] text-lg leading-tight">Patient Portal</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Appointments & Results</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 opacity-60">
            <div className="h-[1px] w-8 bg-slate-200" />
            <p className="text-[11px] font-medium text-slate-400 italic">
              "What you see matters"
            </p>
            <div className="h-[1px] w-8 bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}