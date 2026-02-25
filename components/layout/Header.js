export default function Header({ title, doctor, patient }) {
  return (
    <header className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
      <div>
        <h1 className="text-xl font-extrabold text-[#6D6E70] tracking-tight uppercase">
          {title}
        </h1>
        <div className="h-1 w-6 bg-[#F17343] rounded-full mt-1" />
      </div>

      <div className="flex items-center gap-4">
        {doctor && (
          <div className="flex items-center gap-3 border-l pl-4 border-slate-100 transition-all duration-500">
            <div className="text-right">
              {/* Doctor Name now updates dynamically */}
              <p className="font-bold text-[#6D6E70] leading-none transition-colors duration-300">
                {doctor.name}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 <p className="text-[10px] text-[#F17343] font-bold uppercase tracking-widest">
                   {doctor.specialty}
                 </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-slate-50 text-[#F17343] rounded-xl flex items-center justify-center border border-slate-100 font-black shadow-inner">
              {doctor.name.charAt(doctor.name.startsWith('Dr.') ? 4 : 0)}
            </div>
          </div>
        )}

        {patient && (
          <div className="flex items-center gap-3 border-l pl-4 border-slate-100">
            <div className="text-right">
              <p className="font-bold text-[#6D6E70] leading-none">{patient.name}</p>
              <p className="text-xs text-slate-400 mt-1">{patient.email}</p>
            </div>
            <img 
              src={patient.avatar} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              alt="avatar"
            />
          </div>
        )}
      </div>
    </header>
  );
}