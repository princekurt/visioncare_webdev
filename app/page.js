'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-800 p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md text-center border border-white/20">
        <h1 className="text-4xl font-bold mb-6 text-white">VisionCare</h1>
        <p className="text-white/80 mb-8">Select your role to continue</p>

        <div className="flex flex-col gap-6">
          {/* Doctor Button */}
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold"
            onClick={() => router.push('/doctor/dashboard')}
          >
            Doctor
          </button>

          {/* Patient Button */}
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition font-semibold"
            onClick={() => router.push('/patient/dashboard')}
          >
            Patient
          </button>
        </div>

        
      </div>
    </div>
  );
}
