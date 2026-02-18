'use client';

export default function HeaderPatient({ title, patient }) {
  return (
    <header className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
      {/* Title Section */}
      <div>
        <h1 className="text-xl font-extrabold text-[#6D6E70] tracking-tight uppercase">
          {title}
        </h1>
        <div className="h-1 w-6 bg-[#F17343] rounded-full mt-1" />
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        {patient && (
          <div className="flex items-center gap-3 border-l pl-4 border-slate-100">
            <div className="text-right">
              <p className="font-bold text-[#6D6E70] leading-none">
                {patient.name}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {patient.email}
              </p>
            </div>
            
            {/* Letter Avatar (Matching Doctor View style) */}
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#6D6E70] border border-slate-200 font-bold uppercase">
              {patient.name?.charAt(0) || 'P'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}